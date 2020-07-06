
module.exports = async () => {
  // Descarcam toate intrarile din tabela Shifts.
  const data = await process.mongoose.model('engineer').find().lean();

  return data.map((x) => {
    // Scoatem variabila __v din raspunsul primit de la baza de date.
    const { __v, _id, ...data } = x;
    return data;
  });
};
