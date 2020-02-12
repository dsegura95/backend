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

insert into dept(id, name) values
('QM', 'Departamento de Quimica');

insert into dept(id, name) values
('FIS', 'Departamento de Fisica');

insert into dept(id, name) values
('MC', 'Departamento de Mecanica');

insert into dept(id, name) values
('MA', 'Departamento de Matematicas Puras y Aplicadas');

insert into dept(id, name) values
('EC', 'Departamento de Electronica y Circuitos');

insert into dept(id, name) values
('TF', 'Departamento de Termonidamica y Fenomenos de Transferencia');

insert into dept(id, name) values
('MT', 'Departamento de Ciencias de los Materiales');

insert into dept(id, name) values
('CC', 'Departamento de Ciencia y Tecnologia del Comportamiento');

insert into dept(id, name) values
('GC', 'Departamento de Ciencias de La Tierra');

insert into dept(id, name) values
('LL', 'Departamento de Lengua y Literatura');

insert into dept(id, name) values
('CE', 'Departamento de Ciencias Economicas y Administrativas');

insert into dept(id, name) values
('ID', 'Departamento de Idiomas');

insert into dept(id, name) values
('CS', 'Departamento de Ciencias Sociales');

insert into dept(id, name) values
('DA', 'Departamento de Diseno, Arquitectura y Artes plasticas');

insert into dept(id, name) values
('PL', 'Departamento de Planificacion Urbana');

insert into dept(id, name) values
('BC', 'Departamento de Biologia Celular');

insert into dept(id, name) values
('EA', 'Departamento de Estudios Ambientales');

insert into dept(id, name) values
('BO', 'Departamento de Biologia de Organismos');

insert into dept(id, name) values
('PB', 'Departamento de Procesos Biologicos y Bioquimicos');

insert into dept(id, name) values
('DTI', 'Departamento de Tecnologia Industrial');


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
('CI2693', 'CI', 'Laboratorio de Algoritmos y Estructuras III');

insert into subject(id, dept, name) values
('CO3321', 'CO', 'Estadística');

insert into subject(id, dept, name) values
('PS1115', 'PS', 'Sistemas de Informacion I');

insert into subject(id, dept, name) values
('CO2111', 'CO', 'Computo Cientifico');

insert into subject(id, dept, name) values
('CI3815', 'CI', 'Organizacion del Computador');

insert into subject(id, dept, name) values
('CO3121', 'CO', 'Fundamentos de Probabilidades para Ingenieros');

insert into subject(id, dept, name) values
('CI3391', 'CI', 'Laboratorio de Sistemas de Base de Datos I');

insert into subject(id, dept, name) values
('CI3825', 'CI', 'Sistemas de Operacion I');

insert into subject(id, dept, name) values
('CI3715', 'CI', 'Ingenieria de Software I');

insert into subject(id, dept, name) values
('PS1111', 'PS', 'Modelos Lineales I');

insert into subject(id, dept, name) values
('CI3661', 'CI', 'Laboratorio de Lenguajes de Programacion');

insert into subject(id, dept, name) values
('CI4325', 'CI', 'Interfaces con el Usuario');

insert into subject(id, dept, name) values
('CI4835', 'CI', 'Redes de Computadoras');

insert into subject(id, dept, name) values
('CI5832', 'CI', 'Redes de Computadoras II');

insert into subject(id, dept, name) values
('CI5833', 'CI', 'Redes de Computadoras III');

insert into subject(id, dept, name) values
('CI4721', 'CI', 'Lenguajes de Programacion II');

insert into subject(id, dept, name) values
('CI4722', 'CI', 'Lenguajes de Programacion III');

insert into subject(id, dept, name) values
('CI4821', 'CI', 'Sistemas de Operacion II');

insert into subject(id, dept, name) values
('CI4822', 'CI', 'Sistemas de Operacion III');
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
('jacob', 'Alberto Mendoza', 'jacob@usb.ve', 2222, true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('strefezza', 'Lin Son de Strefezza', 'strefezza@usb.ve', 2222,  true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('avargas', 'Adolfo Vargas', 'avargas@usb.ve', 2222,  true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('rosamariacuenca', 'Rosa Maria Cuenca Marcano', 'rosamariacuenca@usb.ve', 2222,  true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('vvilacha', 'Victor Vilacha', 'vvilacha@usb.ve', 2222,  true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('gonzalezl', 'Lourdes Yetzabe Gonzalez', 'gonzalezl@usb.ve', 2222,  true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('lcornieles', 'Liseth Cornieles', 'lcornieles@usb.ve', 2222,  true, 'labF');

--------------------------------------------------------------------

insert into usuario(id,name,email,type,is_active, chief) values
('LDAC', 'MAC', 'ldac@usb.ve', 3333,  true, 'cchang');

insert into usuario(id,name,email,type,is_active, chief) values
('LDC', 'Laboratorio docente de computacion', 'ldc@usb.ve', 3333,  true, 'eduardo');

insert into usuario(id,name,email,type,is_active, chief) values
('LAMEC', 'Laboratorio de Matematicas y Estadistica Computacional', 'lamec@usb.ve', 3333,  true, 'jacob');

insert into usuario(id,name,email,type,is_active, chief) values
('LAIAC', 'Laboratorio de Aprendizaje de Idiomas Asistido por Computador', 'laiac@usb.ve', 3333,  false, 'strefezza');

insert into usuario(id,name,email,type,is_active, chief) values
('MMLab', 'Laboratorio de Computacion Grafica y Multimedia', 'MMLab@usb.ve', 3333,  false, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('LDCP', 'Laboratorio de Ciencias Politicas', 'ldcp@usb.ve', 3333,  true, 'avargas');

insert into usuario(id,name,email,type,is_active, chief) values
('CADD', 'Laboratorio de Diseno Asisitdo por Computadora', 'cadd@usb.ve', 3333,  true, 'rosamariacuenca');

insert into usuario(id,name,email,type,is_active, chief) values
('ET', 'Laboratorio de Estudios Tecnologicos', 'et@usb.ve', 3333,  true, 'labF');

insert into usuario(id,name,email,type,is_active, chief) values
('LGU', 'Laboratorio de Geomatica Urbana', 'lgu@usb.ve', 3333,  true, 'vvilacha');

insert into usuario(id,name,email,type,is_active, chief) values
('LIE', 'Laboratorio de Informatica Educativa', 'lie@usb.ve', 3333,  true, 'gonzalezl');

insert into usuario(id,name,email,type,is_active, chief) values
('LJSU-CIU', 'Lab Jose Santos Urriola-CIU', 'ciu@usb.ve', 3333,  true, 'lcornieles');

insert into usuario(id,name,email,type,is_active, chief) values
('BWL', 'Laboratorio de Redes y Bases de Datos', 'bwl@usb.ve', 3333,  false, 'labF');


insert into usuario(id,name,email,type,is_active, chief) values
('CI', 'Departamento de Computacion', 'dci@usb.ve', 0000, true, 'CI');

/*Rellenamos la tabla de room*/

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-120', 'Sala baratheon','eduardo', 'LDC', true, 'La salita de ldc para pruebas', '2020-07-02', '2018-06-05');

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-119', 'Sala Leal','eduardo', 'LDC', true, 'La salita de ldc', '2020-07-02', '2018-06-05');

insert into room(id,name,owner_id,manager_id,is_active,description,last_used,first_used) values
('MYS-019','Sala A','cchang','LDAC',true,'La mejor sala del mundo','2020-07-02','2018-06-05');

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-018', 'Sala A','cchang', 'LDAC', true, 'La mejor sala del mundo', '2020-07-02', '2018-06-05');

insert into room(id, name,owner_id, manager_id, is_active,description , last_used, first_used) values
('MYS-001', 'Sala E','cchang', 'LDAC', true, 'Sala multimedia, solicitar televisor de ser necesario','2020-01-01', '2019-06-01');

/*Rellenamos la tabla item*/

insert into item(name,description) values('computadoras','hp 64 bits');
insert into item(name) values('mouse');
insert into item(name,description) values('videobeam','casio 6000 lumens');
insert into item(name) values('sillas');
insert into item(name,description) values('mesas','madera');
insert into item(name, description) values('pizarras', 'acrilica');


/*Rellenamos la tabla de room_item*/

insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-019', 'ENE-MAR2020', 3, 5);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-019', 'ENE-MAR2020', 2, 3);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-001', 'ENE-MAR2020', 2, 6);
insert into room_item(room_id,trimester_id,item_id,quantity)values('MYS-001', 'SEP-DIC2019', 3, 3);

/*Rellenamos room_request*/

insert into room_request(room_id,requested_id,owner_id,manager_id,trimester_id,date,status)values('MYS-019', 'labF', 'LDAC', 'cchang', 'ENE-MAR2020', '2020-05-06','A');
insert into room_request(room_id,requested_id,owner_id,manager_id,trimester_id,date,status)values('MYS-019', 'labF', 'LDAC', 'cchang', 'ENE-MAR2020', '2020-01-06','E');

/*Rellenamos reservation_request*/
/*P de pendiente, A aceptado, R rechazado*/
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, status) values ('15-10611', 'MYS-019', 'CI2693', 'ENE-MAR2020', 'Clases', 'Sillas y mesas', 'E');
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, status) values ('15-11523', 'MYS-001', 'CI2692', 'ENE-MAR2020', 'Prepas', 'Sillas y mesas', 'A');
insert into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, status) values ('15-11523', 'MYS-119', 'CI2692', 'ENE-MAR2020', 'Prepas', 'Sillas y mesas', 'A');

/*Rellenamos reserve_req_schedule*/

insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 13, 2);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 13, 4);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 13, 6);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 13, 8);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 13, 10);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(1,'Lunes', 13, 12);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(2,'MarJue', 23, 7);
insert into reservation_request_schedule(reservation_request_id, day, hour, week) values(2,'MarJue', 25, 7);


/*Rellenamos asignation*/

insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-019', 'CI2692', 'ENE-MAR2020', '2020-02-06');
insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-001', 'CI2693', 'ENE-MAR2020', '2020-02-08');
insert into asignation(room_id,subject_id,trimester_id,date) values('MYS-119', 'CO3321', 'ENE-MAR2020', '2020-01-02');