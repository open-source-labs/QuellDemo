import mongoose, { Schema } from 'mongoose';

const citiesSchema: Schema = new Schema({
  name: { type: String, require: true},
  country: { type: String, require: true }
})

export default mongoose.model('Cities', citiesSchema);