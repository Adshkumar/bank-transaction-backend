const express = require('express');
const authmiddleware = require("../middleware/auth.middleware");
const { createAccountController, getUserAccountsController, getAccountBalanceController } = require('../controllers/account.controller');
const router = express.Router();


router.post("/create", authmiddleware, createAccountController);
router.get("/myaccounts", authmiddleware, getUserAccountsController);
router.get("/:accountId/balance", authmiddleware, getAccountBalanceController);

module.exports = router;