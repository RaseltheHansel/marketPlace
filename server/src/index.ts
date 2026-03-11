import express, {Application} from 'express';
import {createServer} from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

import connectDB from './config/db';
import { initSocket } from './socket';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import bookmarkRoutes from './routes/bookmarkRoutes';
import listingRoutes from './routes/listingRoutes';
import messageRoutes from './routes/messageRoutes';


const app: Application = express();
const httpServer = createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per IP
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // only 10 login attempts per 15 minutes
  message: { message: 'Too many attempts, please try again later.' },
});

connectDB();
initSocket(httpServer);

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

app.use(limiter);
app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (_req, res) => res.send('MarketPlace API is RUNNING!!!'));


const PORT = parseInt(process.env.PORT ?? '5000', 10);
httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));