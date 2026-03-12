import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI!);
  
  const user = await User.findOneAndUpdate(
    { email: 'jraselthehansel.com' }, // ← put your email here
    { role: 'admin' },
    { new: true }
  );
  
  console.log('Updated:', user?.name, '→', user?.role);
  await mongoose.disconnect();
}

makeAdmin();