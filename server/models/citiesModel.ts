import mongoose, { Schema } from 'mongoose';

const citiesSchema: Schema = new Schema({
  name: { type: String, required: true},
  country: { type: String, required: true }
})

export default mongoose.model('Cities', citiesSchema);