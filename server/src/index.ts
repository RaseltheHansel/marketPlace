import express, {Application} from 'express';
import {createServer} from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
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

connectDB();
initSocket(httpServer);


app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (_req, res) => res.send('MarketPlace API is RUNNING!!!'));


const PORT = parseInt(process.env.PORT ?? '5000', 10);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));