
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load env first so no related error come later. 

import Job from '../models/jobAvailable.js';
import userSchema from '../models/userSchema.js';
import multer from 'multer';
import path from 'path';
import crypto from "crypto";
import jwt from 'jsonwebtoken'
import message from '../models/messageSchema.js';
import nodemailer from 'nodemailer' // for real time email notify to user. 
import notificationModel from '../models/notificationSchema.js';
import post from '../models/postSchema.js';
import bcrypt from 'bcrypt'; // to convert to in hash form. 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "../frontend/public/images"));
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });
export const multerUpload = upload;

export const updateUserInfo = async (req, res) => {

};

export const handleVote = async (req, res) => {

};

export const storeMessages = async (req, res) => {

};

export const contentPosts = async (req, res) => {

};

export const createPost = async (req, res) => {

};

export const fetchMessages = async (req, res) => {

};

export const getAllJobsPost = async (req, res) => {

};

export const deletePost = async (req, res) => {

};

export const getUserInfoWithId = async (req, res) => {

};

export const followUser = async (req, res) => {

};

export const checkFollowStatus = async (req, res) => {

};

export const deleteContentPost = async (req, res) => {

};

export const applyJob = async (req, res) => {

};

export const getNotification = async (req, res) => {

};

export const getComments = async (req, res) => {

};

export const storeComment = async (req, res) => {

};

export const logOut = async (req, res) => {
    try {

        // Clear the cookies,
        res.clearCookie('token');
        res.clearCookie('userId');

        return res.status(200).json({ message: "Logged out successfully" }); // sent success txt ,
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


export const userRegister = async (req, res) => {
    try {
        const { name, email, password, isGoogle } = req.body;

        const existingUser = await userSchema.findOne({ email, isGoogle });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash password only if isGoogle is false. 
        let hashedPassword = '';
        if (!isGoogle) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Create new user
        const user = new userSchema({
            name,
            email,
            password: hashedPassword,
            isGoogle,
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, isGoogle, name: name },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        res.cookie('userId', user._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        console.error(' Registration error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const JobAdd = async (req, res) => {

};


export const getUserInfo = async (req, res) => {

};

export const registerOAuth = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }


        let user = await userSchema.findOne({ email, isGoogle: true });

        if (!user) {
            user = new userSchema({
                name: name, // features from maybe after ESM 6+
                email,
                isGoogle: true,
            });
            await user.save();
        }

        res.status(201).json({
            message: "User logged in successfully with Google",
            user: { id: user._id, name: user.name, email: user.email },
            txt: { successStatus: true },
        });

    } catch (err) {
        console.error("log In error:", err.message);
        res.status(500).json({ error: " internal server error" });
    }
};

export const checkToken = (req, res) => {

};



export const userLogin = async (req, res) => {
    try {
        const { email, password, isGoogle } = req.body;


        const existingUser = await userSchema.findOne({ email, isGoogle: isGoogle });
        if (!existingUser) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!isGoogle) {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
        }

        // Generate JWT token to store in users cookies of browser. Stateless Authentication. 
        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email, isGoogle, name: existingUser.name },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );


        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,             // Prevents from client side JS access
            secure: process.env.NODE_ENV === 'production', // Only HTTPS one,  in production
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        res.cookie('userId', existingUser._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.status(200).json({
            message: 'Login successful',
            user: existingUser
        });
    } catch (err) {
        console.error(' Login error detects :', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};