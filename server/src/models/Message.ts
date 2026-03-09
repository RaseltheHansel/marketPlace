import mongoose, {Schema} from "mongoose";
import type { IMessage } from "../types";

const messageSchema = new Schema<IMessage>(
    {
        listing: {type: Schema.Types.ObjectId, ref: 'Listing', required: true},
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true}, 
        receiver: {type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: {type: String, required: true},
        read: {type: Boolean, default: false},
    },
    {timestamps: true}

);

export default mongoose.model<IMessage>('Message', messageSchema);