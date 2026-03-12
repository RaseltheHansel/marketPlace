import mongoose, { Schema } from "mongoose";
import type { IListing } from "../types";

const listingSchema = new Schema<IListing>(
    {
    seller: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true },
    description: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    category: {type: String, enum: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Vehicles', 'Sports', 'Toys', 'Food', 'Other'], required: true},
    condition: {type: String, enum: ['new', 'like-new', 'good', 'fair', 'poor'], required: true},
    images: [{type: String}],
    location: {type: String, required: true},
    status: {type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
    views: {type: Number, default: 0},
    },
    {timestamps: true}
);

listingSchema.index({title: 'text', description: 'text'});

export default mongoose.model<IListing>('Listing',listingSchema);