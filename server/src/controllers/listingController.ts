import type { Response } from "express";
import type { AuthRequest } from "../types";
import Listing from "../models/Listing";
import { createListingSchema } from "../schemas/listing.schema";
import mongoose from "mongoose";
import { unknown } from "zod";
        
// Get
export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // zod validation  
        const parsed = createListingSchema.safeParse({
            ...req.body,
            price: Number(req.body.price),
        });

        if(!parsed.success){
            res.status(400).json({message: 'Validation failed', errors:parsed.error.flatten() });
            return;

        }
        // Get uploaded images URLs from cloudinary via multer

        const files = req.files as Express.Multer.File[];
        const images = files?.map(f => f.path) ?? [];

        const listing = new Listing({
            seller: req.userId,
            ...parsed.data,
            images,
            status: 'pending',
        });

        await listing.save();
        res.status(201).json(listing);

    }catch(error: unknown){
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};

// GetListing - search and filter

export const getListings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            search,
            category,
            condition,
            minPrice,
            maxPrice,
            location,
            page = '1'
        } = req.query as Record<string, string>;

        const filter: Record<string, unknown> = {status: 'approved'};

        if(search)filter.$text = {$search: search};
        if(category)filter.category = category;
        if(condition)filter.






    }catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
}

