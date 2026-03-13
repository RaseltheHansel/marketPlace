import type { Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
import User from '../models/User';
import { sendEmail } from '../config/nodemailer';
import crypto from 'crypto'

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

// verifyEmail
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


// login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'No account with this email.' });
      return;
    }
    if (!user.isVerified) {
      res.status(400).json({ message: 'Please verify your email first.', needsVerification: true, email });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Wrong password.' });
      return;
    }

    const secret = process.env.JWT_SECRET!;
    const token  = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

// forgot password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try{
        const {email} = req.body as {email: string};

        const user = await User.findOne({email});
        if(!user){
            res.json({message: 'If this Email exists, a reset link has been sent'});
            return;
        }
        
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); //1hour

        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

         await sendEmail(
         email,
        'Reset your Marketplace password',
        `<div style='font-family: sans-serif; max-width: 600px; margin: auto;'>
           <h2 style='color: #e74c3c;'>Password Reset Request</h2>
           <p>Hi ${user.name}, click the button below to reset your password.</p>
           <a href='${resetUrl}' style='display: inline-block; background: #e74c3c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;font-weight: bold; margin: 20px 0;'>
            Reset Password
           </a>
           <p style='color: #888;'>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>`
        
    );
    res.json({message: 'If this email exists, reset link has been sent.'});

    }catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};

// reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, token, newPassword} = req.body as {email: string; token: string; newPassword: string; };

        const user = await User.findOne({email});
        if(!user || user.resetToken !== token) {
            res.status(400).json({message: 'Invalid or expired reset link.'});
            return;
        }
        if(user.resetTokenExpires && user.resetTokenExpires < new Date()) {
            res.status(400).json({message: 'Reset link has expired'});
            return;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

     res.json({ message: 'Password reset successful! You can now login.' });



    }catch(error: unknown) {
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
};