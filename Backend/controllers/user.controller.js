const usermodel = require("../models/user.model");
const blackllist = require("../models/blacklist.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


export const registerController = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const existingUser = await usermodel.findOne({ email });
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hasedpassword = await bcrypt.hash(password, 10);

        const newUser = new usermodel({
            name,
            email,
            password: hasedpassword
        });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600000
        });

        res.status(201).json({
            message: "User registered successfully",
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error) {
        console.error("Error in registerController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logincontroller = async (req, res) =>{

    try {
        const { email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await usermodel.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({message: "Invalid Email or Password"});
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Email or Password"});
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Error in logincontroller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logoutcontroller = async (req, res) => {

    try {
        
        const token = req.cookies.token;
        if(token){
            await blackllist.create({ token });

            res.clearCookie("token");

            res.status(200).json({message: "Logout successful"});
        } else{
            res.status(400).json({message: "No token found"});
        }
    } catch (error) {
        console.error("Error in logoutcontroller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}