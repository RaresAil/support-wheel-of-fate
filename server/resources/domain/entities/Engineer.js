const mongoose = process.mongoose;

if (!mongoose) {
  return;
}

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

mongoose.model('engineer', new Schema({
  id: ObjectId,
  name: {
    type: String,
    unique: true,
    required: true
  },
  shifts: {
    type: Array,
    required: true
  }
}));
