const express = require('express');
const { registerController, logincontroller } = require('../controllers/user.controller');
const router = express.Router();

router.post("/register", registerController);
router.post("/login", logincontroller);
router.post("/logout", logincontroller);

module.exports = router;
