import type { Request } from "express";
import type {Document, Types } from "mongoose";

export interface AuthRequest extends Request {
    userId?: string,
    userRole?: string,
}

export type ListingStatus = 'pending' | 'approved' | 'rejected';
export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';
export type Category = 'Electronics' | 'Clothing' | 'Furniture' | 'Books' | 'Vehicles' | 'Sports' | 'Toys' | 'Foods' | 'Others';


export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    avatar?: string;
}

export interface IListing extends Document {
    seller: Types.ObjectId;
    title: string;
    description: string;
    price: number;
    category: Category;
    condition: ListingCondition;
    images: string[];
    location: string;
    status: ListingStatus;
    views: number;
}

export interface IBookmark extends Document {
    user: Types.ObjectId;
    listing: Types.ObjectId;
}

export interface IMessage extends Document {
    listing: Types.ObjectId;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    text: string;
    read: boolean;
}