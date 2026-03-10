import { Server } from "socket.io";
import { Server as HttpServer} from 'http';

export const initSocket = (httpServer: HttpServer): void => {
    const io = new Server(httpServer, {
        cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] },
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // join a chat room for a specific listing conservation
        socket.on('join_room', (roomId: string) => {
            socket.join(roomId)
        });

        // when a message is sent, broadcast to the room
        socket.on('send_message', (data: {roomId: string; message: unknown}) => {
            socket.to(data.roomId).emit('receive_message', data.message);
        });
        
        socket.on('disconnect', () => {
            console.log('User disconnected: ', socket.id);
        });
    });
};