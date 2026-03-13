import type { Response } from "express";
import type { AuthRequest } from "../types";
import Bookmark from "../models/Bookmark";

export const toggleBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const listingId = req.params.listingId as string;
        const existing = await Bookmark.findOne({
            user: req.userId,
            listing: listingId
        });

        if(existing) {
            await Bookmark.deleteOne({
                _id: existing._id
            });
            res.json({bookmarked: false, message: 'Removed from Bookmarks.'});
        }else {
            await Bookmark.create({
                user: req.userId, 
                listing: listingId
            });
            res.json({bookmarked: true, message: 'Added to bookmarks'});
        }

    }catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};

export const getByBookmarks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const bookmarks = await Bookmark.find({user: req.userId})
            .populate('listing').sort({createdAt: -1});
            res.json(bookmarks);
    }catch(error: unknown){
        if(error instanceof Error) {
            res.status(500).json({mesage: error.message});
        }
    }
};

export const checkBookmarks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const exists = await Bookmark.findOne({user: req.userId, listing: req.params.listingId});
        res.json({bookmarked: !!exists});
        
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(500) .json({message: error.message});
        }
    }
};