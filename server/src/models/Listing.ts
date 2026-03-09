import mongoose, { Schema } from "mongoose";
import type { IListing } from "../types";

const listingSchema = new Schema<IListing>(
    {
    seller: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true },
    description: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    category: {type: String, enum: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Vehicles', 'Sports', 'Toys', 'Foods', 'Others'], required: true},
    condition: {type: String, enum: ['new', 'Like-new', 'good', 'fair', 'poor'], required: true},
    images: [{type: String}],
    location: {type: String, required: true},
    status: {type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
    views: {types: Number, default: 0},
    },
    {timestamps: true}
);

listingSchema.index({title: 'text', description: 'text'});

export default mongoose.model<IListing>('Listing',listingSchema);