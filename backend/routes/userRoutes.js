
// this is user routes  .
// some add to later.

// :id, = is dynamic id. 

import { userRegister, JobAdd, storeMessages, getNotification, fetchMessages, handleVote, applyJob, deleteContentPost, storeComment, getComments, contentPosts, createPost, getUserInfoWithId, deletePost, getAllJobsPost, logOut, checkFollowStatus, followUser, userLogin, multerUpload, updateUserInfo, getUserInfo, checkToken, registerOAuth } from '../controllers/userController.js';
import express from 'express';
import multer from 'multer'; // use to send image from frontend to backend. 
import path from 'path';
const router = express.Router();

router.post('/register', userRegister); // register to the user 
router.post('/registerOAuth', registerOAuth);
router.post('/login', userLogin);
router.get('/logout', logOut);
router.get('/check-token', checkToken);
router.get('/comments', getComments);
router.get('/messages', fetchMessages);
router.post('/messages', storeMessages);
router.post('/comments', storeComment);
router.get('/contentPosts', contentPosts);
router.delete('/contentPosts/:id', deleteContentPost);
router.get('/get-user/:id', getUserInfo);
router.post('/create-post/:id', multerUpload.single('image'), createPost);
router.get('/jobs-post', getAllJobsPost);
router.get('/user/:id', getUserInfoWithId);
router.post('/update-user/:id', multerUpload.single('image'), updateUserInfo);
router.post('/jobs', JobAdd);
router.delete('/posts/:id', deletePost);
router.post('/follow/:id', followUser);
router.post('/posts/:postId/apply', applyJob);
router.post('/posts/:id/vote', handleVote);
router.get('/notifications/:id', getNotification);
router.post('/follow/status/:id', checkFollowStatus);

export default router;
