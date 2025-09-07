

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notice: {
        type: String, 
        required: true,
        trim: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now // automatically, store current date.
    }
});

// Export the model From here.
const notificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default notificationModel;
