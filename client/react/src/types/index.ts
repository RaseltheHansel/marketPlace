export type ListingStatus = 'pending' | 'approved' | 'rejected';
export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';
export type Category = 'Electronics' | 'Clothing' | 'Furniture' | 'Books' | 'Vehicles' | 'Sports' | 'Toys' | 'Foods' | 'Others';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatar: string;
}

export interface Listing {
    _id: string;
    seller: User;
    title: string;
    description: string;
    price: number;
    category: Category;
    condition: ListingCondition;
    images: string[];
    location: string;
    status: ListingStatus;
    views: number;
    createdAt: string;
}

export interface ListingResponse {
    listings: Listing[];
    total: number;
    pages: number;
    page: number;
}

export interface Message {
    _id: string;
    listing: string;
    sender: User;
    receiver: string;
    text: string;
    read: boolean;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}