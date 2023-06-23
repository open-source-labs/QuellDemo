const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
  name: { type: String, require: true },
  artist: { type: String, require: true },
});
//albums
const Album = mongoose.model('Album', albumSchema);

export default Album;
