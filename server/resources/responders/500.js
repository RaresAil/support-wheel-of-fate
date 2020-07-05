
module.exports = (req, res) => res.status(500).json({
  success: false,
  code: 'internal-error',
  message: 'Internal Server Error'
});
