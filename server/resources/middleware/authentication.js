
module.exports = async (req, res, next) => {
  // Verificam daca ruta incepe cu /api dar nu si cu /api-docs
  if (
    req.path.toString().startsWith('/api') &&
    !req.path.toString().startsWith('/api-docs')) {
    // Daca acest "if" este adevarat atunci verificam dupa token-ul Bearer si il validam.
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
