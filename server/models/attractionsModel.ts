import mongoose, { Schema } from 'mongoose';

const attractionsSchema: Schema = new Schema({
  name: { type: String, require: true},
  city: { type: String, require: true}
})

export default mongoose.model('Attractions', attractionsSchema);