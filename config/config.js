require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    user: process.env.USERDB || 'postgres',
    database: process.env.DATABASE || 'reserva',
    host: process.env.HOST || 'localhost',
    portdb: process.env.PORTDB || 5432,
    password: process.env.PASSWORD || 1234
};

module.exports = { config };