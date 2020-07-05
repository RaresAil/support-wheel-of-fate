
module.exports.middleware = (fn) => (req, res, next) => (
  Promise
    .resolve(fn(req, res, next))
    .catch((e) => {
      console.error('Async Middleware Crash', e.message);
      return process.loader.responders['500'](req, res);
    })
);

module.exports.route = (route) => (req, res) => Promise.resolve(route(req, res)).catch((err) => {
  console.error('Async Route Crash', err.message);
  return process.loader.responders['500'](req, res);
});
