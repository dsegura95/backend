const express = require('express');
const app = express();

const { config } = require('./config/index.js');
const reservACapi = require('./routes/reserva.js')

reservACapi(app);

app.listen(config.port, function() {
    console.log(`Listening http://localhost:${config.port}`)
});