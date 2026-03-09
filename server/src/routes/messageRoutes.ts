import type { Response } from "express";
import type { AuthRequest } from "../types";
import Message from "../models/Message";
import Listing from "../models/Listing";
import User from '../models/User';
import { sendEmail } from "../config/nodemailer";


export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            listingId, receiverId, text, } = req.body as {
            listingId: string;
            receiverId: string;
            text: string;
        };

        if(!text.trim()) {
            res.status(400).json({message: 'Message cannot be empty'});
            return;

        }

        const message = await Message.create({
            listing: listingId, sender: req.userId, receiver: receiverId, text,
        });

        // send email notification

        const [sender, receiver, listing] = await Promise.all([
            User.findById(req.userId),
            User.findById(receiverId),
            Listing.findById(listingId),
        ]);


        if(receiver?.email && sender && listing) {
            await sendEmail(
                receiver.email,
                `New Message about: $(listing.title)`,
                `<div style='font-family: sans-serif; max-width: 600px; margin: auto'>
                    <h2 styles = 'color: #1a5276'>You have new Message!</h2>
                    <p><strong>${sender.name}</strong>sent you a message about your listing: </p>
                    <div style = 'background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0'>
                        <strong>${listing.title}</strong>
                    </div>
                    <div style ='background: #eaf4fb; padding: 16px; border-radius: 8px;'>
                        <p>${text}</p>
                    </div>
                    <p style = 'margin-top: 16px'>
                    <a href = '${process.env.CLIENT_URL}' style = 'background: #1a5276; color: white; paddubg: 10px 20px; border-radius: 6px; text-decoration: none'>
                    View Message </a>
                    </p>
                </div>`
            );
            res.status(201).json(message);
        }
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(500).json({message: error.message});
        }
    }
};


export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {listingId, otherUserId} = req.params;
        const message  = await Message.find({
            listing: listingId,
            $or: [
                {sender: req.userId, receiver: otherUserId},
                {sender: otherUserId, receiver: req.userId},
            ],
        }).populate('sender', 'name avatar').sort({createdAt: 1});
        res.json(message);

    }catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};