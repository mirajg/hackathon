

// ✅ let's load environment variable at first. 
import dotenv from 'dotenv';
dotenv.config();

// Now import everything else which is required for us. 
import socketHandler from './socketHandler.js';
import express from 'express';
import cors from 'cors';  // to alloww from different path to connect. But who have authorised.  
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/dbConnect.js';
import cookieParser from 'cookie-parser'; 
import { createServer } from 'http';
import { Server } from 'socket.io'; // to create server.

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.frontendPath, // to stop disconnection between frontend and backend distinct path. 
        methods: ["GET", "POST"],
        credentials: true // related cookies also go to there.
    }
});

const PORT = 5000;

app.use(cookieParser()); // to read cookie with this library. Node JS library
app.use(cors({
    origin: process.env.frontendPath,
    credentials: true
}));

app.use(express.json());                                   // use to get frontend data into backend without any error, 
app.use(express.urlencoded({ extended: true }));

connectDB(); // use to connect with mongoDB database.

app.use('/api', userRoutes); // 

socketHandler(io); // handles logic related to real time communication.

// Start server with node js.
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});