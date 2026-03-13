import type { Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, email, password} = req.body as {
            name: string;
            email: string;
            password: string;
        };

        const existing = await User.findOne({email});
        if(existing) {
            res.status(400).json({message: 'Email already registered.'});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hashedPassword});
        await user.save();

        const secret = process.env.JWT_SECRET;
        if(!secret) throw new Error('JWT_SECRET not defined!');

        const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });
        res.status(201).json({ token, user: { _id: user._id, name, email, role: user.role } });

    } catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body as {
            email: string;
            password: string;
        };

        const user = await User.findOne({email});
        
        // 🔍 Debug logs
        console.log('👤 User found:', user?.email);
        console.log('👑 Role:', user?.role);
        console.log('🔒 Password in DB:', user?.password);

        if(!user) {
            res.status(400).json({message: 'No account with this email'});
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        // 🔍 Debug log
        console.log('🔑 Password match:', isMatch);

        if(!isMatch) {
            res.status(400).json({message: 'Wrong password'});
            return;
        }

        const secret = process.env.JWT_SECRET;
        if(!secret) throw new Error('JWT_SECRET not defined');

        const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });
        res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch(error: unknown) {
        if(error instanceof Error) {
             res.status(500).json({message: error.message});
        }
    }
};