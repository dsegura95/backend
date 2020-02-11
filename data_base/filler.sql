-- Nos conectamos a la BD
\c "reserva";
-- Cargamos los datos en tablas
-- Tabla de usuario

/*Rellenado de la BD*/

/*Rellenamos departamentos*/

insert into dept(id, name) values
('CO', 'Departamento de Cómputo Científico y Estadística');

insert into dept(id, name) values
('CI', 'Departamento de Computacion y Tecnologia de la informacion');

insert into dept(id, name) values
('PS', 'Departamento de Procesos y Sistemas');

/*Rellenamos trimester*/
insert into trimester(id, star, finish) values
('ENE-MAR2020', '2020-01-06', '2020-03-28');

insert into trimester(id, star, finish) values
('SEP-DIC2019', '2019-09-26', '2019-12-06');

insert into trimester(id, star, finish) values
('ENE-MAR2019', '2019-01-26', '2019-06-01');

insert into trimester(id, star, finish) values
('ENE-MAR2018', '2018-09-26', '2018-12-06');

/*Rellenamos algunas materias*/
insert into subject(id, dept, name) values
('CI2691', 'CI', 'Laboratorio de Algoritmos y Estructuras I');

insert into subject(id, dept, name) values
('CI2692', 'CI', 'Laboratorio de Algoritmos y Estructuras II');

insert into subject(id, dept, name) values
('CI2693', 'CI', 'Laboratorio de Algoritmos y Estructuras II');

insert into subject(id, dept, name) values
('CO3321', 'CO', 'Estadística');

insert into subject(id, dept, name) values
('PS1115', 'PS', 'Sistemas de Informacion I');

/*Rellenamos la tabla usuario*/
/*Type 0000 departamento, 1111 estudiante, 2222 profesor, 3333 laboratorio, 4444 laboratorio master*/

insert into usuario(id,name,email,type,is_active, chief) values
('15-10611', 'Carlos Gonzalez', '15-10611@usb.ve', 1111,  false, '15-10611');

insert into usuario(id,name,email,type,is_active, chief) values
('15-11523', 'Neil Villamizar', '15-11523@usb.ve', 1111, true, '15-11523');

insert into usuario(id,name,email,type,is_active, chief) values
('labF', 'Laboratorio F', 'labf@usb.ve', 3333, true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('cchang', 'Carolina Chang', 'cchang@usb.ve', 2222, true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('eduardo', 'Eduardo Blanco', 'eduardo@usb.ve', 2222, true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('ldac', 'MAC', 'ldac@usb.ve', 4444,  true, 'cchang');

insert into usuario(id,name,email,type,is_active, chief) values
('ldc', 'Laboratorio docente de computacion', 'ldc@usb.ve', 4444,  true, 'eduardo');

insert into usuario(id,name,email,type,is_active, chief) values
('DCI', 'Departamento de Computacion', 'dci@usb.ve', 0000, true, 'DCI');

/*Rellenamos la tabla de room*/

insert into room(id,name,owner_id,manager_id,is_active,description,last_used,first_used) values
('MYS-120','Sala baratheon','eduardo','ldc',true,'La salita de ldc para pruebas','2020-07-02','2018-06-05');

insert into room(id,name,owner_id,manager_id,is_active,description,last_used,first_used) values
('MYS-119','Sala Leal','eduardo','ldc',true,'La salita de ldc','2020-07-02','2018-06-05');

insert into room(id,name,owner_id,manager_id,is_active,description,last_used,first_used) values
('MYS-019','Sala A','ldac','cchang',true,'La mejor sala del mundo','2020-07-02','2018-06-05');

insert into room(id,name,owner_id,manager_id,is_active,description,last_used,first_used) values
('MYS-001','Sala F','ldac','cchang',true,'Sala F, el switch murio','2020-01-01','2018-01-05');

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-014','Sala E','ldac','cchang',true,'Sala F, el switch murio','2020-01-01','2018-01-05');



/*Rellenamos la tabla item*/

insert into item(name,description) values('computadoras','hp 64 bits');
insert into item(name) values('mouse');
insert into item(name,description) values('videobeam','casio 6000 lumens');
insert into item(name) values('sillas');
insert into item(name,description) values('mesas','madera');

/*Rellenamos la tabla de room_item*/

insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-019', 'ENE-MAR2020', 3, 5);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-019', 'ENE-MAR2020', 2, 3);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-001', 'ENE-MAR2020', 2, 6);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-001', 'SEP-DIC2019', 3, 3);

/*Rellenamos room_request*/

insert into room_request(room_id,requested_id,owner_id,manager_id,trimester_id,date,status)values('MYS-019', 'labF', 'ldac', 'cchang', 'ENE-MAR2020', '2020-05-06','A');
insert into room_request(room_id,requested_id,owner_id,manager_id,trimester_id,date,status)values('MYS-019', 'labF', 'ldac', 'cchang', 'ENE-MAR2020', '2020-01-06','E');

/*Rellenamos reservation_request*/
/*P de pendiente, A aceptado, R rechazado*/
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, status) values ('15-10611', 'MYS-019', 'CI2693', 'ENE-MAR2020', 'Clases', 'Sillas y mesas', 'E');
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, status) values ('15-11523', 'MYS-001', 'CI2692', 'ENE-MAR2020', 'Prepas', 'Sillas y mesas', 'A');

/*Rellenamos reserve_req_schedule*/

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'LunMier', 1-3, 5);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(2,'MarJue', 2-3, 7);


/*Rellenamos asignation*/

insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-019', 'CI2692', 'ENE-MAR2020', '2020-02-06');
insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-001', 'CI2693', 'ENE-MAR2020', '2020-02-08');
insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-014', 'CO3321', 'ENE-MAR2020', '2020-01-02');