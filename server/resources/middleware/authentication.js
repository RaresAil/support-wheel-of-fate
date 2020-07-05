
module.exports = async (req, res, next) => {
  if (
    req.path.toString().startsWith('/api') &&
    !req.path.toString().startsWith('/api-docs')) {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.toString().startsWith('Bearer ') ||
      !(await process.loader.domain.validateAPIKey(req.headers.authorization.toString().replace('Bearer ', '')))
    ) {
      return process.loader.responders.forbidden(res);
    }
  }

  return next();
};
