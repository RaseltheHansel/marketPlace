import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'marketplace', 
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{width: 800, height: 600, crop: 'limit'}],
    } as Record<string, unknown>,
});

// allow up to 5 images listing 

export const uploadImages = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
}).array('images', 5);

export const uploadAvatar = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024}, 
}).single('avatar');    