-- Nos conectamos a la BD
\c "reserva";
-- Cargamos los datos en tablas
-- Tabla de usuario

/*Rellenado de la BD*/

--Querys

SELECT * FROM usuario WHERE email = 'cchang@usb.ve';

SELECT r.quantity, i.name, i.description
FROM room_item AS r
INNER JOIN item AS i ON i.id = r.item_id
WHERE room_id = 'MYS-111';

SELECT id
FROM trimester 
ORDER BY id DESC
LIMIT 1;

SELECT subject_id, day, hour
FROM asignation
JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id
WHERE room_id = 'MYS-019'
GROUP BY subject_id, day, hour;

SELECT COUNT(*) FROM asignation WHERE room_id = 'MYS-019' AND trimester_id = 'ENE-MAR2020';