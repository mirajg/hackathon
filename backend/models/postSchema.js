
// schema for content post.

import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    postdesc: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalVotes: {
        type: Number,
        default: 0
    },
    comments: [{
        text: {
            type: String,
            required: true,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    image: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default post;
