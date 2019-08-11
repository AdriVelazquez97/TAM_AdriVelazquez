const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const apiDef = require('./api');
const loginDef = require('./api/routes/login')

module.exports = (mongoService) => {

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(fileUpload({ useTempFiles: true }));

  app.use('/api', apiDef(mongoService))
  app.use('/login', loginDef(mongoService))

  return app;

};
