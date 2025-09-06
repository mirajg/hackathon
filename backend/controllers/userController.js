
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

};

export const JobAdd = async (req, res) => {

};


export const getUserInfo = async (req, res) => {

};

export const registerOAuth = async (req, res) => {

};

export const checkToken = (req, res) => {

};


export const userLogin = async (req, res) => {

};