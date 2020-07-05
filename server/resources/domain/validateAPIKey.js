
module.exports = async (key) => {
  const { mongoose } = process;
  const check = await mongoose.model('apikey').get(key);
  if (!check || (check && check.key !== key)) {
    return false;
  }

  return true;
};
