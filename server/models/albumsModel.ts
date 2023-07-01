import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbums extends Document {
  name: string;
  artist: string;
};

const albumSchema: Schema = new Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
});

export default mongoose.model<IAlbums>('Album', albumSchema);