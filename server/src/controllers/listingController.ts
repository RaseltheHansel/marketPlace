import type { Response } from "express";
import type { AuthRequest } from "../types";
import Listing from "../models/Listing";
import { createListingSchema } from "../schemas/listing.schema";
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

// Helper to upload buffer to cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation: [{ width: 800, height: 600, crop: 'limit' }] },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

// post
export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('📥 Body:', req.body);
    console.log('📁 Files:', req.files);

    const parsed = createListingSchema.safeParse({
      ...req.body,
      price: Number(req.body.price),
    });

    console.log('✅ Parsed:', parsed.success, parsed.success ? parsed.data : parsed.error.flatten());

    if (!parsed.success) {
      res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
      return;
    }

    const files = req.files as Express.Multer.File[];
    console.log('🖼️ Files count:', files?.length);

    const imageUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        console.log('⬆️ Uploading:', file.originalname);
        const url = await uploadToCloudinary(file.buffer, 'marketplace');
        console.log('✅ Uploaded:', url);
        imageUrls.push(url);
      }
    }

    const listing = new Listing({
      seller: req.userId,
      ...parsed.data,
      images: imageUrls,
      status: 'pending',
    });

    await listing.save();
    console.log('✅ Listing saved!');
    res.status(201).json(listing);

  } catch (error: unknown) {
    console.error('❌ Error:', error);
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

// GetListings - search and filter
export const getListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      search, category, condition,
      minPrice, maxPrice, location, page = '1'
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { status: 'approved' };

    if (search)    filter.$text     = { $search: search };
    if (category)  filter.category  = category;
    if (condition) filter.condition = condition;
    if (location)  filter.location  = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    const limit = 12;
    const skip  = (Number(page) - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find(filter).populate('seller', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Listing.countDocuments(filter),
    ]);

    res.json({ listings, total, pages: Math.ceil(total / limit), page: Number(page) });

  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

// get listing by id

const viewedSessions = new Set<string>();

export const getListingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email avatar');
    if (!listing) {
      res.status(404).json({ message: 'Listing not found.' });
      return;
    }
    // only counts view once per user/IP per listing
    const sessionKey = `${req.ip}-${req.params.id}`;
    if(!viewedSessions.has(sessionKey)) {
      viewedSessions.add(sessionKey);
      await Listing.findByIdAndUpdate(req.params.id, {$inc: {views: 1} });
    }
    res.json(listing);  

  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

// delete listing
export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, seller: req.userId });
    if (!listing) {
      res.status(404).json({ message: 'Listing not found.' });
      return;
    }
    res.json({ message: 'Listing deleted.' });

  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

// get my listings
export const getMyListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listings = await Listing.find({ seller: req.userId }).sort({ createdAt: -1 });
    res.json(listings);

  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};