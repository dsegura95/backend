-- Nos conectamos a la BD
\c "reserva";
-- Cargamos los datos en tablas
-- Tabla de usuario

/*Rellenado de la BD*/

--Querys

SELECT r.quantity, i.name
FROM room_item AS r
INNER JOIN item AS i ON i.id = r.item_id
WHERE room_id = 'MYS-111';

SELECT id
FROM trimester 
ORDER BY id DESC
LIMIT 1;