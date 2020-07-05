
module.exports = (req, res) => res.status(404).json({
  success: false,
  code: 'not-found',
  message: 'Route not found'
});
