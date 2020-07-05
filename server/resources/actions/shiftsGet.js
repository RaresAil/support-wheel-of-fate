
module.exports = async (req, res) => {
  const shifts = await process.loader.domain.shiftsGet();

  // Trimitem datele primite din dominiu in responder.
  return process.loader.responders.shiftsGet(req, res, shifts);
}
