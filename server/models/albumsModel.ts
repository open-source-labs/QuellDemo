import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbums extends Document {
  name: string;
  artist: string;
};

const albumSchema: Schema = new Schema({
  name: { type: String, require: true },
  artist: { type: String, require: true },
});

export default mongoose.model<IAlbums>('Album', albumSchema);