const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countriesSchema = new Schema({
  name: { type: String, require: true },
});
//albums
const Countries = mongoose.model("Countries", countriesSchema);

export default Countries;
