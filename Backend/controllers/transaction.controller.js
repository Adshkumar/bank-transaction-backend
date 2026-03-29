const mongoose = require('mongoose');
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */

export const CreateTransactionController = async (req, res) => {

    try {
        const {fromAccount, toAccount, amount, idempotencyKey} = req.body;

        if(!fromAccount || !toAccount || !amount || !idempotencyKey){
            return res.status(400).json({message: "All fields are required"});
        }

        const fromAcc = await accountModel.findOne({_id: fromAccount});
        const toAcc = await accountModel.findOne({_id: toAccount});

        if(!fromAcc || !toAcc){
            return res.status(400).json({message: "Invalid account IDs"});
        }

        const IsTransactionExist = await transactionModel.findOne({idempotencyKey: idempotencyKey});

        if(IsTransactionExist){
            return res.status(400).json({message: "Transaction with this idempotency key already exists"});
        }

        if(IsTransactionExist.status === "COMPLETED"){
            return res.status(400).json({Message: "Transaction already completed"});
        }

        if(IsTransactionExist.status === "PENDING"){
            return res.status(400).json({Message: "Transaction is pending"});
        }

        if(IsTransactionExist.status === "FAILED"){
            return res.status(400).json({Message: "Transaction failed"});
        }

        if(fromAccount.status !== "ACTIVE" || toAccount.status !== "ACTIVE"){
            return res.status(400).json({message: "Both accounts must be active"});
        }

        const balance = await fromAccount.getBalance();
        if(balance < amount){
            return res.status(400).json({message: `Insufficient balance. Current balance: ${balance}. Required: ${amount}`});
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const creditEntry = new ledgerModel.create({
                account: toAccount._id,
                amount: amount,
                type: "CREDIT",
                description: `Transfer from account ${fromAccount._id}`
            }, {session});

            await transactionModel.findOneAndUpdate(
                {_id: transaction._id},
                {status: "COMPLETED"},
                {session}
            )

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({message: "Transaction completed successfully"});
        } catch (error) {
            return res.status(400).json({message: "Transaction is Pending Due to some Issue, Please Try Again"});
        }
    } catch (error) {
        console.error("Error in CreateTransactionController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}