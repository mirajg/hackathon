
import dotenv from 'dotenv';
dotenv.config(); // load env first so no related error come later. 

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

// this one is to store mesage which use has send. 
export const storeMessages = async (req, res) => {
    try {
        const { userId, remoteUserId, text } = req.body;

        const newMessage = new message({
            senderId: userId,
            receiverId: remoteUserId,
            content: text
        });

        await newMessage.save();
        return res.status(201).json({ success: true, message: newMessage });
    } catch (err) {
        console.error("Store message error:", err);
        return res.status(500).json({ success: false, message: "Server  error" });
    }
};

export const contentPosts = async (req, res) => {
    try {
        const posts = await post.find().populate("owner"); // this one to fill out all data of owner who posts content.
        return res.json({ success: true, posts });
    } catch (err) {
        console.error("Get content posts error:", err);
        return res.status(500).json({ success: false, message: "Server  error" });
    }
};

export const createPost = async (req, res) => {
    try {
        const userId = req.params.id;
        const { description } = req.body;

        const image = req.file ? `/images/${req.file.filename}` : null;

        const newPost = new post({
            owner: userId,
            postdesc: description,
            image
        });

        await userSchema.findByIdAndUpdate(userId, { $push: { contentPosts: newPost._id } });

        await newPost.save();
        return res.status(201).json({ success: true, post: newPost });
    } catch (err) {
        console.error("create post error has detected:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const fetchMessages = async (req, res) => {
    try {
        const { userId, remoteUserId } = req.query;

        const messages = await message.find({
            $or: [
                { senderId: userId, receiverId: remoteUserId },
                { senderId: remoteUserId, receiverId: userId }
            ]
        }).populate("senderId receiverId");

        return res.json({ success: true, messages: messages });
    } catch (err) {
        console.error("Fetch messages error:", err);
        return res.status(500).json({ success: false, message: "server error" });
    }
};

export const getAllJobsPost = async (req, res) => {
    try {
        const jobs = await Job.find().populate("owner"); // also fill out the all data of owner of who posts job. 
        return res.json({ success: true, jobs });
    } catch (err) {
        console.error("Get all jobs  error:", err);
        return res.status(500).json({ success: false, message: "server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postIdThisOne = req.params.id;
        const deletedPost = await Job.findByIdAndDelete(postIdThisOne);

        if (!deletedPost) {
            return res.status(404).json({ success: false, message: "post has not found" });
        }

        return res.json({ success: true, message: "post  has deleted successfully" });
    } catch (err) {
        console.error("delete  post error:", err);
        return res.status(500).json({ success: false, message: "server error detected" });
    }
};

export const getUserInfoWithId = async (req, res) => {

};

export const followUser = async (req, res) => {

};

export const checkFollowStatus = async (req, res) => {

};

export const deleteContentPost = async (req, res) => {
    try {
        const postId = req.params.id; // this one is the id of post, unique one 
        const postDoc = await post.findById(postId);

        if (!postDoc) {
            return res.status(404).json({ success: false, message: "Post  not found" });
        }

        const userId = postDoc.owner;

        await postDoc.deleteOne();
        await userSchema.findByIdAndUpdate(userId, { $pull: { contentPosts: postId } });

        return res.status(200).json({ success: true, message: "post  has deleted successfully" });
    } catch (err) {
        console.error("Delete content post error:", err);
        return res.status(500).json({ success: false, message: "server  error has detected," });
    }
};


export const applyJob = async (req, res) => {
    try {
        const { userId } = req.body; // applicant user id
        const receiverId = req.body.receiverId;
        const postId = req.params.postId;

        // let's see whether require condition meet or not during logic time. 
        if (!userId || !postId || !receiverId) {
            return res.status(400).json({ success: false, message: "All  fields are required" });
        }

        let receiverInfo = await userSchema.findById(receiverId);
        if (!receiverInfo) {
            return res.status(404).json({ success: false, message: "Receiver  not found" });
        }

        await notificationModel.create({
            sender: userId,
            receiver: receiverId,
            notice: "Applied for job",
            post: postId
        });

        if (receiverInfo.isGoogle == true && receiverInfo.email) {
            console.log('sending emai,l to Google user');

            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: `"Linterest" <${process.env.EMAIL_USER}>`,
                to: receiverInfo.email,
                subject: "📩 New Message Received on Linterest",
                html: `
    <div style="
        font-family: 'Helvetica Neue', Arial,  sans-serif;
        max-width: 600px;
        margin: auto;
        border: 2px solid #4CAF50;
        border-radius: 12px;
        padding: 30px;
        background-color: #f9f9f9;
        color: grey;
    ">
        <h2 style="color: #4CAF50; text-align: center;"> new message on Linterest</h2>
        <p style="font-size: 16px; line-height: 1.6;">
            Hello <strong>${receiverInfo.name || 'there'}</strong>,
        </p>
        <p style="font-size: 16px;  

        line-height: 1.6;">
            you received a new message in <strong>Linterest</strong>. Click the button below to view it:
        </p>

        <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.frontendPath}/profile/${receiverId}" 


               style="
                   display: inline-block;
                   padding: 12px 24px;
                   font-size: 16px;
                   font-weight: bold;
                   color: white;
                   background-color: #4CAF50;
                   border-radius: 8px;
                   text-decoration: none;
               ">
               View Message
            </a>
        </div>
        <p style="color: #555;  
        font-size: 14px;  text-align: center;">
        
            If you didn't expect this email, you can safely ignore it.
        </p>
    </div>
    `
            });
        }


        return res.status(200).json({ success: true, message: "applied for job successfully" });

    } catch (err) {
        console.error("Apply job error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getNotification = async (req, res) => {

};

export const getComments = async (req, res) => {
    try {
        const postId = req.query.postId;
        const comments = await post.findById(postId).populate("comments.owner");

        return res.status(200).json({ success: true, comments: comments?.comments || [] });
    } catch (err) {
        console.error("Get comments error:", err);
        return res.status(500).json({ success: false, message: " server error" });
    }
};

export const storeComment = async (req, res) => {
    try {
        const { postId, content, userId } = req.body;

        // to check whether user has proper postId, content and postId or not, to reduce error in Later. 
        if (!postId || !content || !userId) {
            return res.status(400).json({ success: false, message: "all fields  are required" });
        }

        // let;s create new comment form below lines of code. 
        const newComment = {
            text: content,
            owner: userId,
            createdAt: new Date() // to add current date into comment. 
        };

        await post.findByIdAndUpdate(postId, { $push: { comments: newComment } });

        return res.status(201).json({ success: true });
    } catch (err) {
        console.error("Store comment error:", err);
        return res.status(500).json({ success: false, message: "s,erver error" });
    }
};

export const logOut = async (req, res) => {
    try {

        // to clear the cookies, when user logout, 
        res.clearCookie('token');
        res.clearCookie('userId');

        return res.status(200).json({ message: "logged out has been  successfully" }); // sent success txt ,
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, message: "server error" });
    }
};


export const userRegister = async (req, res) => {
    try {
        const { name, email, password, isGoogle } = req.body;

        const existingUser = await userSchema.findOne({ email, isGoogle });
        if (existingUser) {
            return res.status(400).json({ error: 'email is already  registered' });
        }

        // hash password only if isGoogle is false. 
        let hashedPassword = '';
        if (!isGoogle) {
            const salt = await bcrypt.genSalt(10);

            hashedPassword = await bcrypt.hash(password, salt);
        }

        // create new user
        const user = new userSchema({
            name,

            email,
            password: hashedPassword,

            isGoogle,
        });

        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                isGoogle, name: name
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // only HTTPS in production
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
        res.status(500).json({ error: ' internal server  error has detected' });
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
            return res.status(400).json({ error: "Name and email are compulsary required here" });
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
            message: "User logged in  successfully with Google",
            user: { id: user._id, name: user.name, email: user.email },
            txt: { successStatus: true },
        });

    } catch (err) {
        console.error("log In error:", err.message);
        res.status(500).json({ error: " internal  server error" });
    }
};

// this one is use to check the token, and make sure whether user has login using Custom auth or OAuth. 

export const checkToken = (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ user: decoded });
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password, isGoogle } = req.body;


        const existingUser = await userSchema.findOne({ email, isGoogle: isGoogle });
        if (!existingUser) {
            return res.status(401).json({ error: 'invalid email  or password' });
        }

        if (!isGoogle) {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'invalid  email or password' });
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
        console.error(' Login  error detects :', err.message);
        res.status(500).json({ error: 'internal server error detected' });
    }
};