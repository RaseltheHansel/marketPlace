import { Router } from "express";
import verifyToken from "../middleware/auth";
import isAdmin from "../middleware/admin";
import { getPendingListings, updateListingStatus, getAllUsers } from "../controllers/adminController";

const router = Router();

router.get('/listings/pending', verifyToken, isAdmin, getPendingListings);
router.patch('listings/:id/status', verifyToken, isAdmin, updateListingStatus);
router.get('/users', verifyToken, isAdmin, getAllUsers);



export default router;