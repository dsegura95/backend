const express = require('express');
const app = express();

const { config } = require('./config/index.js');
const reservACapi = require('./routes/reserva.js')

// const bodyParser = require('body-parser')

// Body Parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

reservACapi(app);

app.listen(config.port, function () {
    console.log(`Listening http://localhost:${config.port}`)
});