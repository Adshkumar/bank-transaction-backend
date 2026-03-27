const jwt = require("jsonwebtoken");
const usermodel = require("../models/user.model.js");
const blackllist = require("../models/blacklist.model.js");


module.exports = async (req, res, next) => {

    try {
        const token = res.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }

        const blacklisted = await blackllist.findOne({ token });
        if(blacklisted){
            return res.status(401).json({message: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findOne({ _id: decoded.id});
        if(!user){
            return res.status(401).json({message: "Unauthorized"});
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }
}