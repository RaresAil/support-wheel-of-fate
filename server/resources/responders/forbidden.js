
module.exports = (res) => {
  return res.status(403).json({
    success: false,
    code: 403,
    message: 'Forbidden'
  });
};
