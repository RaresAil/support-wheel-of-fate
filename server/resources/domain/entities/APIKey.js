const mongoose = process.mongoose;

if (!mongoose) {
  return;
}

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  id: ObjectId,
  key: String
});

const HashUtil = require(process.rootPathUtil(['resources', 'utils', 'HashUtil']));

schema.statics.generate = function () {
  const clone = (new this());
  clone.key = HashUtil.generateAESKey();
  return clone.save();
}

schema.statics.get = function (key) {
  return this.findOne({
    key
  }).lean();
}

mongoose.model('apikey', schema);
