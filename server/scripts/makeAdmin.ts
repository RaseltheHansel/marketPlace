import mongoose from 'mongoose';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI!);

  const email = process.env.ADMIN_EMAIL;
  const newPassword = process.env.ADMIN_PASSWORD;

  if (!email || !newPassword) {
    console.log('❌ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
    await mongoose.disconnect();
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ User not found:', email);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updated = await User.findOneAndUpdate(
    { email },
    { role: 'admin', password: hashedPassword },
    { new: true }
  );

  console.log('✅ Updated:', updated?.name);
  console.log('👑 Role:', updated?.role);
  console.log('🔒 Password: updated successfully');

  await mongoose.disconnect();
}

makeAdmin();
