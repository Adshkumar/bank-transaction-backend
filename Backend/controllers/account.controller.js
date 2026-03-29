const accountModel = require("../models/account.model");

export const createAccountController = async (req, res) => {

    try {
        const user = req.user;

        const account = await new accountModel.create({
            user: user._id,
            status: "active",
            currency: "INR",
            balance: 0
        });

        res.status(201).json({
            message: "Account created successfully",
            account
        })
    } catch (error) {
        console.error("Error in createAccountController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserAccountsController = async (req, res) => {

    try {
        const user = req.user;
        const accounts = await accountModel.find({ user: user._id });

        res.status(200).json({
            message: "Accounts retrieved successfully",
            accounts
        })
    } catch (error) {
        console.error("Error in getUserAccountsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAccountBalanceController = async (req, res) => {

    try {
        const {accountId} = req.params;
        const account = await accountModel.findById(accountId);

        if(!account){
            return res.status(404).json({message: "Account not found"});
        }

        const balance = await account.getBalance();

        res.status(200).json({
            accountId: account._id,
            balance
        });
    } catch (error) {
        console.log("Error in getAccountBalanceController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}