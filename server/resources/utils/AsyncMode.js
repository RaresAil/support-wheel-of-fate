
// Aceste 2 functii sunt pentru a folosi middleware si route-uri asincrone.
// Fara acestea daca ruta arunca un Exception si nu se foloseste try & catch atunci client-ul nu va primi raspunsul niciodata de la server.
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
