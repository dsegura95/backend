/*Rellenado de la BD
*/
/*Rellenamos departamentos*/
insert into dept(id, name) values('DTS', 'Departamento de Tecnologia y servicios');
insert into dept(id, name) values('DM', 'Departamento de Mecanica');
insert into dept(id,name) values('DEG', 'Departamento de Estudios Generales');
insert into dept(id, name) values('CI', 'Departamento de Computacion y Tecnologia de la informacion');
insert into dept(id, name) values ('DI', 'Departamento de Idiomas');
insert into dept(id,name) values ('MA', 'Departamento de Matematicas');
/*Rellenamos trimester*/
insert into trimester(id, star, finish) values ('ENE-MAR2020', '2020-01-06', '2020-03-28');

/*Rellenamos algunas materias*/

insert into subject(id, dept, name) values ('MA1111', 'MA', 'Matematicas 1');
insert into subject(id, dept, name) values ('MA1112', 'MA', 'Matematicas 2');
insert into subject(id, dept, name) values ('DM1111', 'DM', 'Engranajes 1');
insert into subject(id, dept, name) values('CI2612', 'CI', 'Logica Simbolica');
insert into subject(id, dept, name) values ('CI2691', 'CI', 'Laboratorio de Algoritmos 1'); 
insert into subject(id,dept,name) values ('DI1111', 'DI', 'Ingles 1');
insert into subject(id,dept,name) values ('DI1112', 'DI', 'Ingles 2');
insert into subject(id, dept, name) values('DI1113', 'DI', 'Ingles 3');
insert into subject(id, dept, name) values('DM1112', 'DM', 'Engranajes 2');
insert into subject (id, dept, name) values('DM1113', 'DM', 'Engranajes 3');
insert into subject (id, dept, name) values('MA1116','MA','Matematicas 3');
insert into subject (id, dept, name) values('MA2112','MA','Matematicas 5');



/*Rellenamos la tabla usuario*/
/*Type 0000 departamento, 0101 estudiante, 0102 profesor, 0103, laboratorio, 0104 laboratorio master*/


insert into usuario(id,name,email,type,is_active, chief) values('15-10611', 'Carlos Gonzalez', '15-10611@usb.ve', 0101,  true, '15-10611');
insert into usuario(id,name,email,type,is_active, chief) values('15-11523', 'Neil Villamizar', '15-11523@usb.ve', 0101, true, '15-11523');
insert into usuario(id,name,email,type,is_active, chief) values('ldac', 'MAC', 'ldac@usb.ve', 0103,  true, 'ldac');
insert into usuario(id,name,email,type,is_active, chief) values('cchang', 'Carolina Chang', 'cchang@usb.ve', 0102, true, 'ldac');
insert into usuario(id,name,email,type,is_active, chief) values('DCI', 'Departamento de Computacion', 'dci@usb.ve', 0101, true, 'DCI');
insert into usuario(id,name,email,type,is_active, chief) values('ldc', 'LDC', 'ldc@usb.ve', 0103,  true, 'ldc');
insert into usuario(id,name,email,type,is_active, chief) values('edublanco', 'Eduardo Blanco', 'edublanco@usb.ve', 0102, true, 'ldc');
insert into usuario(id, name,email,type,is_active,chief) values('labF', 'Laboratorio F', 'labF@usb.ve', 0104,  true, 'labF');
/*Rellenamos la tabla de room*/


insert into room(id, name,owner_id, manager_id, is_active,description ,type, last_used, first_used) values('MYS1111', 'Lab con PC','ldac', 'cchang', true, 'Laboratorio con computadoras','Laboratorio con computadoras',  '2020-07-02', '2018-06-05');
insert into room(id, name,owner_id, manager_id, is_active,description ,type, last_used, first_used) values('MYS1112', 'Sala A','ldac', 'cchang', true, 'Sala A', 'Sala A','2020-01-01', '2019-06-01');
insert into room(id, name,owner_id, manager_id, is_active,description ,type, last_used, first_used) values('MYS1113', 'Sala F','ldac', 'cchang', true, 'Sala F','Sala F',  '2020-01-01', '2018-01-05');
insert into room(id, name,owner_id, manager_id, is_active,description ,type, last_used, first_used) values('MYS2110', 'Sala Leal','ldc', 'edublanco', true, 'Sala Leal','Sala Leal',  '2020-10-10', '2018-04-01');
insert into room(id, name,owner_id, manager_id, is_active,description ,type, last_used, first_used) values('MYS2111', 'Sala Progra Momucho','ldc', 'edublanco', true, 'Sala Progra Momucho', 'Sala Progra Momucho','2020-04-02', '2018-01-01');


/*Rellenamos la tabla item*/

insert into item(id, name) values(3, 'computadoras');
insert into item(id,name) values(4,'videobeam');
insert into item(id,name) values(5, 'sillas');
insert into item(id,name) values(6, 'mesas');


/*Rellenamos la tabla de room_attribute*/



/*Rellenamos room request*/



insert into room_request(id, room_id,requested_id,owner_id,manager_id,trimester_id,date,status)values(1, 'MYS1111', 'labF', 'ldac', 'cchang', 'ENE-MAR2020', '2020-05-06','A');
insert into room_request(id, room_id,requested_id,owner_id,manager_id,trimester_id,date,status)values(2, 'MYS2111', 'labF', 'ldc', 'edublanco', 'ENE-MAR2020', '2020-01-06','E');

/*Rellenamos reservation_request*/
/*P de pendiente, A aceptado, R rechazado*/
insert into reservation_request(id, requester_id, room_id, subject_id, trimester_id, reason, material_needed, status) values (1, '15-10611', 'MYS1111', 'MA1111', 'ENE-MAR2020', 'Clases', 'Sillas y mesas', 'E');
insert into reservation_request(id, requester_id, room_id, subject_id, trimester_id, reason, material_needed, status) values (2, '15-11523', 'MYS1112', 'MA1112', 'ENE-MAR2020', 'Prepas', 'Sillas y mesas', 'A');



/*Rellenamos reserve_req_schedule*/


insert into reservation_request_schedule(id, reservation_request_id, day, hour, week) values(1, 1, 'LunMier', 1-3, 5);
insert into reservation_request_schedule(id, reservation_request_id, day, hour, week) values(2, 2, 'MarJue', 2-3, 7);


/*Rellenamos asignation*/

insert into asignation(id,room_id,subject_id,trimester_id,date) values(1, 'MYS1112', 'MA1112', 'ENE-MAR2020', '2020-02-06');
insert into asignation(id,room_id,subject_id,trimester_id,date) values(2, 'MYS2111', 'MA1111', 'ENE-MAR2020', '2020-02-08');
insert into asignation(id,room_id,subject_id,trimester_id,date) values(3, 'MYS1113', 'DM1111', 'ENE-MAR2020', '2020-01-02');


