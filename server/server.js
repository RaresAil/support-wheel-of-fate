console.clear();
const path = require('path');

// Citim fiserul .ENV
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Definim o functie ajutatoare pentru a genera locatia fiserului absoluta
process.rootDir = __dirname;
process.rootPathUtil = (p) => path.join.apply(null, [__dirname, ...p]);

const
  express = require('express'),
  app = express(),
  helmet = require('helmet'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  routeLoader = require(process.rootPathUtil(['routeLoader'])),
  mongoose = require('mongoose'),
  expressSwagger = require('express-swagger-generator')(app),
  AsyncMode = require(process.rootPathUtil(['resources', 'utils', 'AsyncMode']))
;

// Definim o singura instanta pentru mongoose in server.
process.mongoose = mongoose;

// Initializam swagger pentru documentatia supra rutelor.
expressSwagger({
  swaggerDefinition: {
    info: {
      description: 'This is the server for "Wheel of Fate" using Express as the server and for the client-side i used ReactJS for Desktop and React Native for a mobile version.',
      title: 'Wheel of Fate',
      version: '1.0.0'
    },
    host: '',
    basePath: '/api/v1',
    produces: [
      'application/json'
    ],
    schemes: ['http'],
    securityDefinitions: {
      'Bearer Token': {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'The value must be like this "Bearer key", replace the "key" with your API Key.'
      }
    }
  },
  basedir: __dirname,
  files: ['./resources/routes/**/*.js']
});

// Folosim middleware-urile Morgan (Pentru debug), Helmet pentru securitate
// si body parser pentru a primi cereri in formatul JSON
app.use(morgan('dev'))
app.use(helmet());
app.use(bodyParser.json({ type: process.env.CONTENT_TYPE }));
app.use(AsyncMode.middleware(require(process.rootPathUtil(['resources', 'middleware', 'authentication']))));

// Initializam rutele.
routeLoader(app);

const startServer = async () => {
  // Se contecteaza la baza de date MongoDB din cloud.
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Incepem ascultarea pe host-ul si portul definit in .ENV
  app.listen(process.env.PORT, process.env.HOSTNAME, async () => {
    console.log('Server', `Server started. (${process.env.HOSTNAME}:${process.env.PORT})`);
  });
};

startServer();
