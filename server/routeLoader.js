const path = require('path');
const express = require('express');

const routesPath = process.rootPathUtil(['resources', 'routes']);

let loadedRoutes = 0;

const fs = require('fs');

// Am facut un Object cu informatii despre resursele care trebuie incarcate.
const resourcesToLoad = {
  utils: {
    fileName: 'util',
    alias: 'utils'
  },
  actions: {
    fileName: 'action',
    alias: 'actions'
  },
  responders: {
    fileName: 'responder',
    alias: 'responders'
  },
  domain: {
    fileName: 'entry point',
    alias: 'domain'
  }
}

const start = (app) => {
  // Am definit un Object cu numele "loader" pentru a incarca resursele sub forma process.loader.nume
  process.loader = { };

  // Pentru fiecare resursa definita mai sus.
  Object.keys(resourcesToLoad).forEach((dir) => {
    const dirData = resourcesToLoad[dir];
    if (!dirData.fileName || !dirData.alias) {
      return;
    }

    // Se preia locatia folderului petru resurse.
    const path = process.rootPathUtil(['resources', dir]);

    let loadedCount = 0;
    const loadedFiles = {};

    // Citim fiecare fisier din acel director.
    fs.readdirSync(path).forEach((file) => {
      // Verifica daca fisierul are extensia .js
      if (!file.endsWith('.js')) {
        return;
      }

      try {
        // Se incearca importarea functiei/clasei din acel fisier, in caz ca nu merge aceasta nu este incarcata.
        loadedFiles[file.replace('.js', '')] = require(process.rootPathUtil(['resources', dir, file]));

        // Tinem evidenta fisierelor incarcate
        loadedCount += 1;
      } catch (e) {
        console.error('Loader', `Unable to load ${dirData.fileName} '${file}'.`);
      }
    });

    process.loader[dirData.alias] = loadedFiles;
    console.log('Loader', `${loadedCount} ${dirData.fileName}${(loadedCount !== 1 ? 's were' : ' was')} loaded.`);
  });

  try {
    let loadedEntities = 0;
    fs.readdirSync(process.rootPathUtil(['resources', 'domain', 'entities'])).forEach((file) => {
      // Verifica daca fisierul are extensia .js
      if (!file.endsWith('.js')) {
        return;
      }

      // Se incarca entitatile din domeniu.
      try {
        require(process.rootPathUtil(['resources', 'domain', 'entities', file]));
        loadedEntities += 1;
      } catch (e) {
        console.error('Loader', `Unable to load ${file.replace('.js', '')} '${file}'.`);
      }
    });
    console.log('Loader', `${loadedEntities} entit${(loadedEntities !== 1 ? 'ies were' : 'y was')} loaded.`);
  } catch (e) {
    console.error('Loader', 'Unable to load entities.');
  }

  // Citim fiecare fisier din directorul Routes si il validam.
  // Daca numele fisierului este de forma api.v1.routes.js
  // Routerul din acel fisier va porni cu calea /api/v1
  // Daca este api.auth.v1, acesta va fi /api/auth/v1
  fs.readdirSync(routesPath).forEach((file) => {
    try {
      const routeData = file.split('.').filter((i) => (i !== 'js' && i !== 'routes'));
      const route = require(process.rootPathUtil(['resources', 'routes', file]));

      if (routeData.length >= 1 && routeData[0].trim() !== '') {
        app.use(`/${path.join.apply(null, routeData.map((x) => x.toString().trim()))}`, route);
      } else {
        app.use(route);
      }

      loadedRoutes += 1;
    } catch (e) {
      console.error('Loader', `Unable to load route '${file}'.`);
    }
  });

  // Pentru ca ca rutele nedefinite pe /api sa nu duca catre
  // front-end am defint pe rutele libere un Responder care afiseaza
  // {"success":false,"code":404,"message":"Route not found"}
  app.use('/api/*', process.loader.responders['404']);

  // Toate rutele libere vor fi trimise catre front-end
  app.use(express.static(process.rootPathUtil(['public'])));
  app.get('/*', (req, res) => res.sendFile(
    path.join(process.rootPathUtil(['public', 'index.html']))
  ));

  // Daca aplicatia de front-end nu are predefinit o ruta 404
  // ii vom atribui noi acelasi responder ca pentru API.
  // {"success":false,"code":404,"message":"Route not found"}
  app.use('*', process.loader.responders['404']);

  console.log('Loader', `${loadedRoutes} route${(loadedRoutes !== 1 ? 's were' : ' was')} loaded.`);
};

function constructor (app) {
  start(app);
}

module.exports = constructor;
