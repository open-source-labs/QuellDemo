import mongoose, { Schema } from 'mongoose';

const attractionsSchema: Schema = new Schema({
  name: { type: String, required: true},
  city: { type: String, required: true}
})

export default mongoose.model('Attractions', attractionsSchema);