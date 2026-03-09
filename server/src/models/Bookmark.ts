import mongoose, {mongo, Schema} from "mongoose";
import type { IBookmark } from "../types";

const bookmarkSchema = new Schema<IBookmark> (
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
        listing: {type: Schema.Types.ObjectId, ref: 'Listing', required: true},

    },
    {timestamps: true}
);

bookmarkSchema.index({user: 1, listing: 1});

export default mongoose.model<IBookmark>('Bookmark', bookmarkSchema);