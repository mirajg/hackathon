

export default function socketHandler(io) {
    const userSocketMap = {}; // from userId > socket.id, it saved. 
    const socketUserMap = {}; // fromm socket.id > userId

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Register a user with their userId in list. 
        socket.on('register-user', ({ userId }) => {
            // Check if userId already mapped .
            const existingSocketId = userSocketMap[userId];
            if (existingSocketId === socket.id) {
                console.log(`User ${userId} is already registered with socket ${socket.id}`);
                return;
            }

            // Register/update then userInfo in list.  
            userSocketMap[userId] = socket.id;
            socketUserMap[socket.id] = userId;
            console.log(userSocketMap, socketUserMap);

        });

        socket.on("update-message-to-remote-user", (message) => {
            const { userId } = message;
            const recipientSocketId = userSocketMap[userId];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("new-message", message.newMessage);  
            }
        });

        socket.on("disconnect", () => {
            const userId = socketUserMap[socket.id];
            if (userId) {
                delete userSocketMap[userId];
                delete socketUserMap[socket.id];
                console.log(`User disconnected: ${userId}`);
            }
        });
    });
}