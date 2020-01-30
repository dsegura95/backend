const express = require('express');

const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'reserva',
    port: '5432'
})

function reservACapi(app){
    const router = express.Router();
    app.use("/items",router);

    router.get("/", async function(req, res, next){
        try {
            const response = await pool.query('SELECT * FROM item');
            console.log(response.rows);
            res.send('items');
        } catch (err) {
            next(err);
        }
    });
}
module.exports = reservACapi;