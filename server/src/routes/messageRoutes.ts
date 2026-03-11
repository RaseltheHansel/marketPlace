import { Router } from "express";
import verifyToken from "../middleware/auth";
import { sendMessage, getMessages } from "../controllers/messageController";

const router = Router();

router.post('/', verifyToken, sendMessage);
router.get('/:listingId/:otherUserId', verifyToken, getMessages);


export default router