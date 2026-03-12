import { useEffect, useRef } from "react";
import { io, Socket} from 'socket.io-client';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');
        return () => {socketRef.current?.disconnect(); };
    }, []);

    const joinRoom = (roomId: string) => socketRef.current?.emit('join_room', roomId);

    const sendMsg = (roomId: string, message: unknown) => socketRef.current?.emit('send_message', {roomId, message});
    const onMessage = (cb: (msg: unknown) => void) => socketRef.current?.on('receive_message', cb);
    const offMessage = () => socketRef.current?.off('receive_message');

return {joinRoom, sendMsg, onMessage, offMessage};

};