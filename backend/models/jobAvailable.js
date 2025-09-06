
// This is schema, all job related info store to here. 

import mongoose from 'mongoose';

const jobdesc = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    salary: { 
        type: String,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobdesc: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the  model,
const Job = mongoose.models.Job || mongoose.model('Job', jobdesc);
export default Job;
