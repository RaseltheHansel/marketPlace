import { Router } from "express";
import verifyToken from "../middleware/auth";
import { toggleBookmark, getByBookmarks, checkBookmarks } from "../controllers/bookmarkController";


const router = Router();

router.get('/', verifyToken, getByBookmarks);
router.get('/:listingId/check', verifyToken, checkBookmarks);
router.post('/:listingId', verifyToken, toggleBookmark);

export default router;