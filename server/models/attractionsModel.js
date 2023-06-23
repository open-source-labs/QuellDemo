const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const attractionsSchema = new Schema({
  name: { type: String, require: true },
  city: { type: String, require: true },
});
//albums
const Attractions = mongoose.model("Attractions", attractionsSchema);

export default Attractions;
