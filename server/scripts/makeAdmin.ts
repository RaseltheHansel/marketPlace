import mongoose from 'mongoose';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI!);

  // Find the user first
  const user = await User.findOne({ email: 'your@email.com' }); // ← put your email here

  if (!user) {
    console.log('❌ User not found');
    await mongoose.disconnect();
    return;
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash('password', 10); // ← put your password here

  // Update role and password
  const updated = await User.findOneAndUpdate(
    { email: 'jraselthehansel@gmail.com' }, // ← same email
    { role: 'admin', password: hashedPassword },
    { new: true }
  );

  console.log('✅ Updated:', updated?.name);
  console.log('👑 Role:', updated?.role);
  console.log('🔒 Password: updated successfully');

  await mongoose.disconnect();
}

makeAdmin();