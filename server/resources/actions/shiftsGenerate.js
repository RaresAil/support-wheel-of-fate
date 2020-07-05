
module.exports = async (req, res) => {
  let data = req.body;
  if (!Array.isArray(data)) {
    return process.loader.responders['400'](req, res, 'The \'engineers\' array is required.');
  }

  // Delete dublicates and invalid names.
  data = Array.from(new Set(data)).filter((x) => x && x.toString().trim() !== '' && x.toString().length <= 60);

  if (data.length !== 10) {
    return process.loader.responders['400'](req, res, 'The \'engineers\' array must have 10 engineers only.');
  }

  const response = await process.loader.domain.shiftsGenerate(data);
  if (response) {
    return process.loader.responders['400'](req, res, response);
  }

  // Trimitem datele primite din dominiu in responder.
  return process.loader.responders.success(req, res);
}
