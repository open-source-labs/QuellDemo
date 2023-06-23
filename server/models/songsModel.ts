import mongoose, { Schema } from 'mongoose';

const songsSchema: Schema = new Schema({
  name: {type: String, required: true},
  artist: {type: String, required: true},
  album: {type: String, required: true},
})

export default mongoose.model('Songs', songsSchema);