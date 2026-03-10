import { Router } from "express";
import verifyToken from "../middleware/auth";
import { uploadImages } from "../middleware/upload";
import { getListings, getListingById, createListing, deleteListing, getMyListings } from "../controllers/listingController";

const router = Router();
router.get('/', getListings);
router.get('/my', verifyToken, getMyListings);
router.get('/:id', getListingById);
router.post('/', verifyToken, uploadImages, createListing);
router.delete('/:id', verifyToken, deleteListing);

export default router;

