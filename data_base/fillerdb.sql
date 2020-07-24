\c "reserva";
-- Cargamos los datos en tablas
-- Tabla de usuario

/*Rellenado de la BD*/

/*Rellenamos departamentos*/

insert into dept(id, name) values
('CO', 'Departamento de Cómputo Científico y Estadística');

insert into dept(id, name) values
('CI', 'Departamento de Computación y Tecnología de la Información');

insert into dept(id, name) values
('PS', 'Departamento de Procesos y Sistemas');

insert into dept(id, name) values
('QM', 'Departamento de Química');

insert into dept(id, name) values
('FIS', 'Departamento de Física');

insert into dept(id, name) values
('MC', 'Departamento de Mecánica');

insert into dept(id, name) values
('MA', 'Departamento de Matemáticas Puras y Aplicadas');

insert into dept(id, name) values
('EC', 'Departamento de Electrónica y Circuitos');

insert into dept(id, name) values
('TF', 'Departamento de Termodinámica y Fenómenos de Transferencia');

insert into dept(id, name) values
('MT', 'Departamento de Ciencias de los Materiales');

insert into dept(id, name) values
('CC', 'Departamento de Ciencia y Tecnología del Comportamiento');

insert into dept(id, name) values
('GC', 'Departamento de Ciencias de La Tierra');

insert into dept(id, name) values
('LL', 'Departamento de Lengua y Literatura');

insert into dept(id, name) values
('CE', 'Departamento de Ciencias Económicas y Administrativas');

insert into dept(id, name) values
('ID', 'Departamento de Idiomas');

insert into dept(id, name) values
('CS', 'Departamento de Ciencias Sociales');

insert into dept(id, name) values
('DA', 'Departamento de Diseño, Arquitectura y Artes Plásticas');

insert into dept(id, name) values
('PL', 'Departamento de Planificación Urbana');

insert into dept(id, name) values
('BC', 'Departamento de Biología Celular');

insert into dept(id, name) values
('EA', 'Departamento de Estudios Ambientales');

insert into dept(id, name) values
('BO', 'Departamento de Biología de Organismos');

insert into dept(id, name) values
('PB', 'Departamento de Procesos Biológicos y Bioquímicos');

insert into dept(id, name) values
('DTI', 'Departamento de Tecnología Industrial');


/*Rellenamos trimester*/
insert into trimester(id, start, finish) values
('ENE-MAR2020', '2020-01-06', '2020-04-17');

insert into trimester(id, start, finish) values
('SEP-DIC2019', '2019-09-26', '2019-12-06');

insert into trimester(id, start, finish) values
('ENE-MAR2019', '2019-01-26', '2019-06-01');

insert into trimester(id, start, finish) values
('SEP-DIC2018', '2018-09-26', '2018-12-06');

insert into trimester(id, start, finish) values
('ABR-JUL2018', '2018-04-26', '2018-06-06');

insert into trimester(id, start, finish) values
('ENE-MAR2018', '2018-09-26', '2018-12-06');

/*Rellenamos algunas materias*/
insert into subject(id, dept, name) values
('CI2691', 'CI', 'Laboratorio de Algoritmos y Estructuras I');

insert into subject(id, dept, name) values
('CI2692', 'CI', 'Laboratorio de Algoritmos y Estructuras II');

insert into subject(id, dept, name) values
('CI2693', 'CI', 'Laboratorio de Algoritmos y Estructuras III');

insert into subject(id, dept, name) values
('CO3321', 'CO', 'Estadística');

insert into subject(id, dept, name) values
('PS1115', 'PS', 'Sistemas de Información I');

insert into subject(id, dept, name) values
('CO2111', 'CO', 'Cómputo Científico');

insert into subject(id, dept, name) values
('CI3815', 'CI', 'Organización del Computador');

insert into subject(id, dept, name) values
('CO3121', 'CO', 'Fundamentos de Probabilidades para Ingenieros');

insert into subject(id, dept, name) values
('CI3391', 'CI', 'Laboratorio de Sistemas de Base de Datos I');

insert into subject(id, dept, name) values
('CI3825', 'CI', 'Sistemas de Operación I');

insert into subject(id, dept, name) values
('CI3715', 'CI', 'Ingeniería de Software I');

insert into subject(id, dept, name) values
('PS1111', 'PS', 'Modelos Lineales I');

insert into subject(id, dept, name) values
('CI3661', 'CI', 'Laboratorio de Lenguajes de Programación');

insert into subject(id, dept, name) values
('CI4325', 'CI', 'Interfaces con el Usuario');

insert into subject(id, dept, name) values
('CI4835', 'CI', 'Redes de Computadoras');

insert into subject(id, dept, name) values
('CI5832', 'CI', 'Redes de Computadoras II');

insert into subject(id, dept, name) values
('CI5833', 'CI', 'Redes de Computadoras III');

insert into subject(id, dept, name) values
('CI4721', 'CI', 'Lenguajes de Programación II');

insert into subject(id, dept, name) values
('CI4722', 'CI', 'Lenguajes de Programación III');

insert into subject(id, dept, name) values
('CI4821', 'CI', 'Sistemas de Operación II');

insert into subject(id, dept, name) values
('CI4822', 'CI', 'Sistemas de Operación III');

/*Rellenamos la tabla usuario*/
/*Type 0000 departamento, 1111 estudiante, 2222 profesor, 3333 laboratorio, 4444 laboratorio master*/

insert into usuario(id,name,email,type,is_active, chief) values
('12-10273', 'Jesus Kauze', '12-10273@usb.ve', 1111,  false, '12-10273');

insert into usuario(id,name,email,type,is_active, chief) values
('15-10123', 'Jose Barrera', '15-10123@usb.ve', 1111,  false, '15-10123');

insert into usuario(id,name,email,type,is_active, chief) values
('13-11341', 'David Segura', '13-11341@usb.ve', 1111,  false, '13-11341');

insert into usuario(id,name,email,type,is_active, chief) values
('15-10611', 'Carlos Gonzalez', '15-10611@usb.ve', 1111,  false, '15-10611');

insert into usuario(id,name,email,type,is_active, chief) values
('15-11523', 'Neil Villamizar', '15-11523@usb.ve', 1111, true, '15-11523');

insert into usuario(id,name,email,type,is_active, chief) values
('labf', 'Laboratorio F', 'labf@usb.ve', 4444, true, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('cchang', 'Carolina Chang', 'cchang@usb.ve', 2222, true, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('eduardo', 'Eduardo Blanco', 'eduardo@usb.ve', 2222, true, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('mgoncalves', 'Marlene Goncalves', 'mgoncalves@usb.ve', 2222, true, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('mcorniel', 'Marla Corniel', 'mcornie@usb.ve', 2222,  true, 'labf');
--------------------------------------------------------------------

insert into usuario(id,name,email,type,is_active, chief) values
('ldac', 'Laboratorio Docente de Aulas Computarizadas', 'ldac@usb.ve', 3333,  true, 'cchang');

insert into usuario(id,name,email,type,is_active, chief) values
('ldc', 'Laboratorio Docente de Computación', 'ldc@usb.ve', 3333,  true, 'eduardo');

insert into usuario(id,name,email,type,is_active, chief) values
('lamec', 'Laboratorio de Matemáticas y Estadística Computacional', 'lamec@usb.ve', 3333,  true, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('laiac', 'Laboratorio de Aprendizaje de Idiomas Asistido por Computador', 'laiac@usb.ve', 3333,  false, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('lcgm', 'Laboratorio de Computación Gráfica y Multimedia', 'lcgm@usb.ve', 3333,  false, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('ldcp', 'Laboratorio de Ciencias Políticas', 'ldcp@usb.ve', 3333,  true, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('et', 'Laboratorio de Estudios Tecnologicos', 'et@usb.ve', 3333,  true, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('lgu', 'Laboratorio de Geomatica Urbana', 'lgu@usb.ve', 3333,  true, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('lie', 'Laboratorio de Informática Educativa', 'lie@usb.ve', 3333,  true, 'labf');

insert into usuario(id,name,email,type,is_active, chief) values
('bwl', 'Laboratorio de Redes y Bases de Datos', 'bwl@usb.ve', 3333,  false, 'mgoncalves');

insert into usuario(id,name,email,type,is_active, chief) values
('CI', 'Departamento de Computación', 'dci@usb.ve', 0000, true, 'CI');

insert into usuario(id,name,email,type,is_active, chief) values
('CO', 'Departamento de Cómputo Científico y Estadística', 'dept-co@usb.ve', 0000, true, 'CI');

/*Rellenamos la tabla de room*/

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-221', 'Sala Ken Thompson','eduardo', 'ldc', true, 'Aula computarizada fundada por Ken Thompson', '2020-07-02', '2018-06-05');

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-220', 'Sala Jorge Baralt','eduardo', 'ldc', true, 'Aula audiovisual', '2020-07-02', '2018-06-05');

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-219', 'Sala Leal','eduardo', 'ldc', true, 'Aula audiovisual', '2020-07-02', '2018-06-05');

insert into room(id,name,owner_id,manager_id,is_active,description,last_used,first_used) values
('MYS-019','Sala A','cchang','ldac',true,'Aula computarizada disponible para prestamo estudiantil','2020-07-02','2018-06-05');

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-018', 'Sala F','cchang', 'ldac', true, 'Aula computarizada', '2020-07-02', '2018-06-05');

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-020', 'Sala E','cchang', 'ldac', true, 'Sala multimedia, solicitar televisor de ser necesario','2020-01-01', '2019-06-01');

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-015', 'Laboratorio de Bases de Datos','mgoncalves', 'bwl', true, 'Sala multimedia', '2020-07-02', '2018-06-05');

/*Rellenamos la tabla item*/

insert into item(name) values('Mouse');
insert into item(name) values('Monitor');
insert into item(name) values('Teclado');
insert into item(name, description) values('computadoras', 'Arquitectura de 64 bits');
insert into item(name, description) values('computadoras', 'Arquiectura de 63 bits');
insert into item(name,description) values('Videobeam','casio 6000 lumens');
insert into item(name) values('Sillas');
insert into item(name) values('Mesas');
insert into item(name, description) values('pizarron', 'Acrilica');
insert into item(name) values('mousepad');
insert into item(name, description) values('Televisor', 'De 42 pulgadas');

/*Rellenamos la tabla de room_item*/

insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-019', 'ENE-MAR2020', 1, 15);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-019', 'ENE-MAR2020', 2, 15);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-019', 'ENE-MAR2020', 3, 15);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-019', 'ENE-MAR2020', 4, 15);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-019', 'ENE-MAR2020', 6, 1);

insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-018', 'ENE-MAR2020', 1, 15);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-018', 'ENE-MAR2020', 2, 15);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-018', 'ENE-MAR2020', 3, 15);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-018', 'ENE-MAR2020', 4, 15);

insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-020', 'ENE-MAR2020', 7, 20);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-020', 'ENE-MAR2020', 8, 20);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-020', 'SEP-DIC2019', 11, 1);

insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-219', 'ENE-MAR2020', 1, 10);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-219', 'ENE-MAR2020', 2, 10);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-219', 'ENE-MAR2020', 3, 10);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-219', 'ENE-MAR2020', 4, 10);

insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-220', 'ENE-MAR2020', 1, 8);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-220', 'ENE-MAR2020', 2, 8);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-220', 'ENE-MAR2020', 3, 8);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-220', 'ENE-MAR2020', 4, 8);

/*Rellenamos room_request*/

insert into room_request(room_id,requested_id,owner_id,manager_id,trimester_id,date,status)values('MYS-215', 'labf', 'eduardo', 'ldc', 'ENE-MAR2020', '2020-05-06','P');
insert into room_request(room_id,requested_id,owner_id,manager_id,trimester_id,date,status)values('MYS-006', 'labf', 'cchang', 'ldac', 'ENE-MAR2020', '2020-01-06','P');
insert into room_request(room_id,requested_id,owner_id,manager_id,trimester_id,date,status)values('MYS-006', 'labf', 'eduardo', 'ldc', 'ENE-MAR2020', '2020-01-06','P');

/*Rellenamos reservation_request*/
/*P de pendiente, A aceptado, R rechazado*/
-- 1
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('15-10611', 'MYS-019', 'CI2693', 'ENE-MAR2020', 'Sillas, mesas', 10, 'P');
-- 2
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('15-11523', 'MYS-020', 'CI2693', 'ENE-MAR2020', 'Sillas, mesas', 20, 'P');
-- 3
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('15-11523', 'MYS-018', 'CI2692', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 30, 'P');
-- 4
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('13-11341', 'MYS-020', 'CI2692', 'ENE-MAR2020', 'Sillas, mesas y televisor', 24, 'P');
-- 5
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('12-10273', 'MYS-018', 'CI2691', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 40, 'P');
-- 6
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('mcorniel', 'MYS-220', 'PS1115', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 10, 'P');
-- 7
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('mgoncalves', 'MYS-015', 'CI3391', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 15, 'P');
-- 8
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('mcorniel', 'MYS-221', 'PS1115', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 24, 'P');
-- 9
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('CO', 'MYS-019', 'CO3321', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 20, 'P');
-- 10
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('12-10273', 'MYS-018', 'CI2691', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 40, 'P');
-- 11
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('12-10273', 'MYS-020', 'CI4821', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 21, 'P');
-- 12
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('12-10273', 'MYS-019', 'CI4822', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 41, 'P');
-- 13
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('13-11341', 'MYS-018', 'PS1115', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 10, 'P');
-- 14
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('13-11341', 'MYS-020', 'CI5832', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 40, 'P');
-- 15
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('13-11341', 'MYS-019', 'CI2691', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 40, 'P');
-- 16
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, material_needed, quantity, status)
values ('eduardo', 'MYS-020', 'CI2691', 'ENE-MAR2020', 'Sillas, mesas y computadoras', 30, 'P');
/*Rellenamos reserve_req_schedule*/

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 1, 2);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 1, 4);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 1, 6);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 1, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 1, 10);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 1, 12);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 2, 2);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 2, 4);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 2, 6);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 2, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 2, 10);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 2, 12);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(2,'Lunes', 1, 2);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(2,'Lunes', 1, 4);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(2,'Lunes', 1, 6);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(2,'Lunes', 1, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(2,'Lunes', 1, 10);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(2,'Lunes', 1, 12);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(3,'Miercoles', 5, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(3,'Miercoles', 5, 3);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(3,'Miercoles', 5, 5);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(3,'Miercoles', 5, 7);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(3,'Miercoles', 5, 9);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(3,'Miercoles', 5, 11);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(4,'Viernes', 7, 5);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(4,'Jueves', 7, 5);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(4,'Viernes', 8, 9);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(4,'Jueves', 8, 11);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(5,'Viernes', 7, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(5,'Viernes', 7, 3);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(5,'Viernes', 7, 5);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(5,'Viernes', 7, 7);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(5,'Viernes', 7, 9);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(5,'Viernes', 7, 11);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(6,'Miercoles', 5, 2);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(6,'Miercoles', 5, 4);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(6,'Miercoles', 5, 6);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(6,'Miercoles', 5, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(6,'Miercoles', 5, 10);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(6,'Miercoles', 5, 12);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(7,'Lunes', 2, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(7,'Lunes', 3, 8);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(8,'Jueves', 6, 5);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(8,'Jueves', 7, 5);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(9,'Martes', 3, 2);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(9,'Martes', 3, 4);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(9,'Martes', 3, 6);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(9,'Martes', 3, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(9,'Martes', 3, 10);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(9,'Martes', 3, 12);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(10,'Jueves', 8, 2);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(10,'Jueves', 8, 4);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(10,'Jueves', 8, 6);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(10,'Jueves', 8, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(10,'Jueves', 8, 10);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(10,'Jueves', 8, 12);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(11,'Viernes', 8, 2);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(11,'Viernes', 8, 4);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(11,'Viernes', 8, 6);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(11,'Viernes', 8, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(11,'Viernes', 8, 10);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(11,'Viernes', 8, 12);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(12,'Martes', 4, 2);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(12,'Martes', 4, 4);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(12,'Martes', 4, 6);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(12,'Martes', 4, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(12,'Martes', 4, 10);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(12,'Martes', 4, 12);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(13,'Viernes', 10, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(13,'Viernes', 10, 3);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(13,'Viernes', 10, 5);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(13,'Viernes', 10, 7);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(13,'Viernes', 10, 9);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(13,'Viernes', 10, 11);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(14,'Miercoles', 1, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(14,'Miercoles', 2, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(14,'Miercoles', 3, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(14,'Miercoles', 4, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(14,'Miercoles', 5, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(14,'Miercoles', 6, 1);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(15,'Lunes', 7, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(15,'Lunes', 7, 3);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(15,'Lunes', 7, 5);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(15,'Lunes', 7, 7);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(15,'Lunes', 7, 9);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(15,'Lunes', 7, 11);

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(16,'Jueves', 11, 1);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(16,'Jueves', 11, 3);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(16,'Jueves', 11, 5);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(16,'Jueves', 11, 7);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(16,'Jueves', 11, 9);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(16,'Jueves', 11, 11);
/*Rellenamos asignation*/

-- insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-019', 'CI2692', 'ABR-JUL2020', '2020-02-06');
-- insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-019', 'PS1111', 'ABR-JUL2020', '2020-02-07');
insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-019', 'CI2693', 'ENE-MAR2020', '2020-02-08');
insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-019', 'CO3321', 'ENE-MAR2020', '2020-01-02');

/*Rellenamos Horarios de las asignation*/
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 1, 2);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 1, 4);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 1, 6);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 1, 8);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 1, 10);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 1, 12);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 2, 2);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 2, 4);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 2, 6);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 2, 8);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 2, 10);
insert into asig_schedule(asignation_id, day, hour, week) values(1,'Lunes', 2, 12);

insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 1, 2);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 1, 4);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 1, 6);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 1, 8);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 1, 10);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 1, 12);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 2, 2);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 2, 4);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 2, 6);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 2, 8);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 2, 10);
insert into asig_schedule(asignation_id, day, hour, week) values(2,'Martes', 2, 12);

-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 1, 2);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 1, 4);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 1, 6);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 1, 8);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 1, 10);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 1, 12);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 2, 2);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 2, 4);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 2, 6);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 2, 8);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 2, 10);
-- insert into asig_schedule(asignation_id, day, hour, week) values(3,'Martes', 2, 12);

-- insert into asig_schedule(asignation_id, day, hour, week) values(4,'Lunes', 1, 2);
-- insert into asig_schedule(asignation_id, day, hour, week) values(4,'Lunes', 2, 2);
-- insert into asig_schedule(asignation_id, day, hour, week) values(4,'Lunes', 3, 2);

