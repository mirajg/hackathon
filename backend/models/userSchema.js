

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        trim: true,
    },

    followers: {
        type: Array,
        default: [],
    },
    bio: {
        type: String,
        trim: true,
        default: "I'm a User"
    },
    skills: {
        type: Array,
        default: [],
    },
    profilePic: {
        type: String,
        default: "/images/placeholder.png"
    },

    contentPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    isGoogle: {
        type: Boolean,
        default: false,
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
