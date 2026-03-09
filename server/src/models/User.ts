import mongoose, {Schema} from "mongoose";
import type { IUser } from "../types";


const userSchema = new Schema<IUser>(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {type: String, enum: ['user', 'admin'], default: 'user'},
        avatar: {type: String, default: ''},
    },
    {timestamps: true}
);

export default mongoose.model<IUser>('User', userSchema);