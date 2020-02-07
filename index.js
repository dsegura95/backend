const express = require('express');
const app = express();

const { config } = require('./config/index.js');
const reservACapi = require('./routes/reserva.js')

// const bodyParser = require('body-parser')

// Body Parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


reservACapi(app);

app.listen(config.port, function () {
    console.log(`Listening http://localhost:${config.port}`)
});