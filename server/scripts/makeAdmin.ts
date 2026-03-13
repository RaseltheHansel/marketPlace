import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI!);
  
  const result = await mongoose.connection.collection('users').findOneAndUpdate(
    { email: 'EmmetteZion@gmail.com' }, // ← your email
    { $set: { role: 'admin' } },
    { returnDocument: 'after' }
  );
  
  console.log('✅ Updated:', result?.name, '→ role:', result?.role);
  await mongoose.disconnect();
}

makeAdmin();