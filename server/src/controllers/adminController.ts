import type { Response } from "express";    
import type { AuthRequest } from "../types";
import Listing from "../models/Listing";
import User from "../models/User";
import { sendEmail } from "../config/nodemailer";

export const getPendingListings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const listings = await Listing.find({status: 'pending'}).populate('seller', 'name email').sort({createdAt: -1});
        res.json(listings);

    }catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};

export const updateListingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {status, reason } = req.body as {status: 'approved' | 'rejected'; reason?: string};
        const listing = await Listing.findByIdAndUpdate(
            req.params.id, {status}, {new: true}
        ).populate('seller', 'name email');

        if(!listing){
            res.status(401).json({message: 'Listing not found'});
            return;
        }

        const seller = listing.seller as unknown as {name: string; email: string};

        if(status === 'approved') {
            await sendEmail(
                seller.email,
                'Your Listing has been Approved!',
                `<div style = 'font-family: sans-serif; max-width: 600px; margin: auto;'>
                <h2 style = 'color: #27ae60'>Listing Approved!</h2>
                <p>Hi ${seller.name}, your listing <strong>${listing.title}</strong>is now live!</p>
                <a href = '${process.env.CLIENT_URL}' style = 'background: #27ae60; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;'>
                View Listing
                </a>
                </div>`
            );


        }else{
            await sendEmail(
                seller.email,
                'Your Listing was not approved',
                `<div style = 'font-family: sans-serif; max-width: 600px; margin: auto'>
                <h2 style = 'color: #e74c3c'>Listing not Approved</h2>
                <p>Hi ${seller.name}, your listing <strong>${listing.title}</strong>was not approved.</p>
                ${reason ? `<p>Reason: ${reason}</p> ` : ''}
                <p>Please review our guidelines and try again. </p>
                </div>`
            );
        }
        res.json(listing);

    }catch(error: unknown){
        if(error instanceof Error){
            res.status(500).json({message: error.message});
        }
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        const users = await User.find().select('-password').sort({createdAt: -1});
        res.json(users);

    }catch(error: unknown){
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};

export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      res.status(404).json({ message: 'Listing not found.' });
      return;
    }
    res.json({ message: 'Listing deleted by admin.' });
  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};