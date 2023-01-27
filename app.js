const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const db = require('./db/index');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '../../client/public/')});
  });
//app.use(express.static('client/build')); // serve static files (css & js) from the 'public' directory
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', router);

app.listen(process.env.PORT || PORT, () => {
    console.log("Express server listening on port in %s mode", app.settings.env);
  })