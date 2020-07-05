
module.exports = (req, res, msg) => res.status(400).json({
  success: false,
  code: 'bad-request',
  message: msg
});
