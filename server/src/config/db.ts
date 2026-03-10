import mongoose, { connect } from "mongoose";

const connectDB =  async(): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI;
        if(!uri) 
            throw new Error('MONGO_URI is not defined');

        await mongoose.connect(uri);
        console.log('MongoDB Connected');

    }catch(error: unknown){
        if(error instanceof Error) {
            console.error("Error connecting to MongoDB" ,error.message);
        }
        process.exit(1)
        
    }
};

export default connectDB;