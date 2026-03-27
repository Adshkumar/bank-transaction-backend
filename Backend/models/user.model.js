import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        matchMedia: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }, 
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }, 
    isverified: {
        type: Boolean,
        default: false
    },
    isblocked: {
        type: Boolean,
        default: false
    },
    lastlogin: date
    }, { timestamps: true });

export default mongoose.model("User", userSchema);