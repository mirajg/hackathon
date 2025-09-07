
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Linterest');
        console.log('Yes, MongoDB connected ');
    } catch (err) { 
        console.error('Sorry,  MongoDB  connection error:', err);
        process.exit(1);
    }
};

export default connectDB;
