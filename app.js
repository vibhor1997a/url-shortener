const express = require('express');
let app = express();
const bodyParser = require('body-parser');
let index = require('./routes/handler');
const logger = require('morgan');
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '\\static')));

app.use('/', express.static(path.join(__dirname, '\\node_modules\\qrcode\\build')));
app.use('/', index);

//404 handler
app.use((req, res, next) => {
    res.status(404).send('Not Found!');
});

module.exports = app;