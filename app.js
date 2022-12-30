const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const db = require('./db/index');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', router);

app.listen(process.env.PORT || PORT, () => {
    console.log(`App running on port: ${PORT}`)
})