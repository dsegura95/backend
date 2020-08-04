const { config } = require('./config/index.js');

const app = require('./server');

app.listen(config.port, function() {
  config.dev === 'development'
    ? console.log(`Listening in DEVELOPMENT http://localhost:${config.port}`)
    : console.log(`Listening http://localhost:${config.port}`);
});

module.exports = app;
