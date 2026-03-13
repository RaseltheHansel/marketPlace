import type { Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
import User from '../models/User';
import { sendEmail } from '../config/nodemailer';

// Register

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

        // Generate 6-digit verification code 
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        const user = new User({
            name, email,
            password: hashedPassword,
            verificationCode,
            verificationExpires,
            isVerified: false,
        });

        await user.save();

        // send verification email
        await sendEmail(
          email,
            'Verify your Marketplace account',
            `<div style='font-family: sans-serif; max-width: 600px; margin: auto;'>
          <h2 style='color: #2e86c1;'>Welcome to Marketplace, ${name}!</h2>
          <p>Your verification code is:</p>
          <div style='font-size: 40px; font-weight: bold; letter-spacing: 8px;
          color: #2e86c1; text-align: center; padding: 20px;
          background: #eaf4fb; border-radius: 12px; margin: 20px 0;'>
          ${verificationCode}
        </div>
        <p style='color: #888;'>This code expires in 24 hours.</p>
      </div>`
    );

    res.status(201).json({
        message: 'Registration successful! Check your email for the verification code.',
        email,
    });


    } catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, code } = req.body as { email: string; code: string};

        const user = await User.findOne({email});
        if(!user) {
            res.status(404).json({message: 'User is not found'});
            return;
        }
        if(user.isVerified) {
            res.status(400).json({message: 'Email is already verified.'});
            return;
        }
        if(user.verificationCode !== code) {
            res.status(400).json({message: 'Invalid verification code.'});
            return;
        }
        if(user.verificationExpires && user.verificationExpires < new Date()) {
            res.status(400).json({message: 'Verification code expired.'});
            return;
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationExpires = undefined;
        await user.save();

        const secret = process.env.JWT_SECRET!;
        const token  = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });

        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch(error: unknown){
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

// 