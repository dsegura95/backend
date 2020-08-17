const { Pool } = require('pg');
const { config } = require('../config/index.js');

//  ************************ ACCESO A BD POSTGRESQL  ***********************
// Obtiene todos estos valores del ./config/index.js
// PD: para el refactor del codigo seria bueno que anada condicionales aqui para correr con BD de QA y BD de PROD, para los tests de QA con jenkins
const pool = new Pool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.portdb
});

module.exports = pool;
