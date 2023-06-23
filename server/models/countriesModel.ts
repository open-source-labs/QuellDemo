import mongoose, { Schema } from 'mongoose';

const countriesSchema: Schema = new Schema({
  name: { type: String, require: true},
})

export default mongoose.model('Countries', countriesSchema);