import Album from './albumsModel';
import Songs from './songsModel';
import mongoose, { Schema } from 'mongoose';

const artistSchema: Schema = new Schema({
  name: { type: String, require: true},
});

export default mongoose.model('Artist', artistSchema);