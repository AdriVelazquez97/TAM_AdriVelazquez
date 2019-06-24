const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiDef = require('./api');

module.exports = (mongoService) => {

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());

  app.get('/', (req, res, next) => {
    return res.json('Dentro de la app')
  })

  app.use('/api', apiDef(mongoService))
  
  app.use('/login', (req, res, next) => {
    return res.json('Logueado en la app')
  })


  return app;

};
