-- Nos conectamos a la BD
\c "reserva";
-- Cargamos los datos en tablas
-- Tabla de usuario

/*Rellenado de la BD*/

--Querys

SELECT id FROM reservation_request WHERE status = 'R' AND trimester_id = 'ENE-MAR2020'