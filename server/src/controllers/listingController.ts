import type { Response } from "express";
import type { AuthRequest } from "../types";
import Listing from "../models/Listing";
import { createListingSchema } from "../schemas/listing.schema";
import mongoose from "mongoose";

        
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
        if(condition)filter.condition = condition;
        if(location)
            filter.location = {$regex: location, $options: 'i'};
        if(minPrice || maxPrice) {
            filter.price = {};
            if(minPrice) 
                (filter.price as Record<string, number>).$gte = Number(minPrice);
            if(maxPrice)
            (filter.price as Record<string, number>).$lte = Number(maxPrice);
        }
        
        const limit = 12;
        const skip = (Number(page) -1 ) * limit;

        const [listings, total] = await Promise.all([
            Listing.find(filter).populate('seller', 'name avatar').sort({createdAt: - 1 }).skip(skip).limit(limit),
            Listing.countDocuments(filter),
        ]);
        

        res.json({ listings, total, pages: Math.ceil(total / limit), page: Number(page) });

    }catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};

// get listing by id 

export const getListingById = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        const listing = await Listing.findById(req.params.id).populate('seller', 'name email avatar');
        if(!listing) {
            res.status(404).json({message: 'Listing not found.'});
            return;
        }
    // increment views
    await Listing.findByIdAndUpdate(req.params.id, {$inc: {views: 1} });
    res.json(listing);

    }catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};

//delete listing
export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        const listing = await Listing.findOneAndDelete({_id: req.params.id, seller: req.userId});
        if(!listing){
            res.status(404).json({message: 'Listing deleted'});
        }
    
    }catch(error: unknown) {
        if(error instanceof Error) {
        res.status(500).json({message: error.message})
        }
    }
};

// get my listing

export const getMyListings = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        const listings = await Listing.find({
            seller: req.userId
        }).sort({createdAt: -1});
        res.json(listings);
   
   
    }catch(error: unknown) {
        if(error instanceof Error){
            res.status(500).json({message: error.message});
        }
    }
};  
