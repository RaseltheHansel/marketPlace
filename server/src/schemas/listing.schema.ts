import  { z } from 'zod';

export const createListingSchema = z.object({
    title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),

    description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),

    price: z.string()
    .min(1, 'Price must be at least 1')
    .max(100000, 'Price is too high'),  

    category: z.enum(['Electronics', 'Clothing', 'Furniture', 'Books', 'Vehicles', 'Sports','Toys', 'Foods', 'Others' ]),

    condition: z.enum(['new', 'Like-new', 'good', 'fair', 'poor']), 

    location: z.string().min(2, 'Location is required'),


});

export type CreateListingInput = z.infer<typeof createListingSchema>;