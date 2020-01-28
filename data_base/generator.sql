DROP DATABASE IF EXISTS "reserva";
-- Creamos la BD
CREATE DATABASE "reserva";
-- Nos conectamos a la BD
\c "reserva";
-- Cargamos los datos en tablas
-- Tabla de usuario

CREATE TABLE IF NOT EXISTS user(
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    email_user VARCHAR(64) NOT NULL,
    type SMALLINT NOT NULL,
    description VARCHAR(1024), --Lo llenara el usuario en un vista para informacion del laboratorio
    is_active BOOLEAN NOT NULL, --En caso de que un lab se disuelva o salga del sistema
    chief VARCHAR(64) NOT NULL, --Labf es su propio jefe
    FOREIGN KEY (chief) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS room(
    id VARCHAR(7) PRIMARY KEY,
    owner_id VARCHAR(64) NOT NULL, --Chang
    FOREIGN KEY (owner_id) REFERENCES user(id),
    manager_id VARCHAR(64) NOT NULL, --LDAC
    FOREIGN KEY (manager_id) REFERENCES user(id),
    is_active BOOLEAN,
    type VARCHAR(64), --Sala o Lab
    last_used DATE, --LAB F puede modificarla para extenderla
    first_used DATE
);

CREATE TABLE IF NOT EXISTS room_request(
    id BIGSERIAL PRIMARY KEY,
    room_id VARCHAR(64) NOT NULL, --MYS-222
    FOREIGN KEY (room_id) REFERENCES room(id),
    requested_id VARCHAR(64) NOT NULL, --LAB F
    FOREIGN KEY (requested_id) REFERENCES user(id),
    owner_id VARCHAR(64) NOT NULL, --LDC
    FOREIGN KEY (requester_id) REFERENCES user(id),
    manager_id VARCHAR(64) NOT NULL, --Eduardo Whithe
    FOREIGN KEY (manager_id) REFERENCES user(id),
    trimester_id VARCHAR(12) NOT NULL,
    FOREIGN KEY (trimester_id) REFERENCES user(id),
    date DATE NOT NULL,
    name VARCHAR(64) NOT NULL,
    type VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS room_attribute(
    room_id VARCHAR(7),
    FOREIGN KEY (room_id) REFERENCES room(id),
    trimester_id VARCHAR(12) NOT NULL,
    FOREIGN KEY (trimester_id) REFERENCES trimester(id),
    item_id BIGSERIAL NOT NULL,
    FOREIGN KEY (item_id) REFERENCES item(id),
    PRIMARY KEY room_id trimester_id item_id
    quantity INT,
    description VARCHAR(256) -- Especificaciones: 64bits, 4 GB RAM
);

CREATE TABLE IF NOT EXISTS item(
    id BIGSERIAL PRIMARY KEY, -- A pata
    name VARCHAR(64) NOT NULL
);

-- Esta es la del crud
CREATE TABLE IF NOT EXISTS asig_shedule(
    id BIGSERIAL PRIMARY KEY,
    asignation_id BIGINT NOT NULL,
    FOREIGN KEY (asignation_id) REFERENCES asignation(id),
    day VARCHAR(9),
    hour SMALLINT,
    week SMALLINT,
    UNIQUE (day hour week)
);

-- Esta no se elimina
CREATE TABLE IF NOT EXISTS asignation(
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT,
    FOREIGN KEY (room_id) REFERENCES room(id),
    subject_id BIGINT,
    FOREIGN KEY (subject_id) REFERENCES subject(id),
    trimester_id BIGINT,
    FOREIGN KEY (trimester_id) REFERENCES trimester(id),
    date DATE NOT NULL
);

-- Solo los labs pueden agregar una nueva subject
-- El front tiene que permitirte crear el subject mediante un modal
CREATE TABLE IF NOT EXISTS subject(
    id VARCHAR(6) PRIMARY KEY,
    name VARCHAR(128),
    dept VARCHAR(3),
    FOREIGN KEY (dept) REFERENCES dept(id)
);

--NA si no tiene dpt
CREATE TABLE IF NOT EXISTS dept(
    id VARCHAR(3) PRIMARY KEY,
    name VARCHAR(128)
);

--Hace referencia al horario
CREATE TABLE IF NOT EXISTS reserve_req_shedule(
    id BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT,
    FOREIGN KEY (reservation_id) REFERENCES reservation_request(id),
    day VARCHAR(9),
    hour SMALLINT,
    week SMALLINT
);

CREATE TABLE IF NOT EXISTS reservation_request(
    id BIGSERIAL PRIMARY KEY,
    requester_id BIGINT,
    FOREIGN KEY (requester_id) REFERENCES user(id),
    room_id BIGINT,
    FOREIGN KEY (room_id) REFERENCES room(id),
    subject_id VARCHAR(6),
    FOREIGN KEY (subject_id) REFERENCES subject(id),
    send_time TIMESTAMP,
    trimester_name VARCHAR(12),
    reason VARCHAR(128),
    material_needed VARCHAR(512),
    status CHAR(1) --A(aprobado),R(rechazado),E(espera)
);

-- Si Sep-Dic termina en Dic, Ene o Feb sig trim sera Ene-Mar
-- Si Ene-Mar termina en Mar, Abr o May sig trim sera Abr-Jul
-- Si Abr-Jul termina en Junio, Jul o Sep sig trim sera Sep-Dic
CREATE TABLE IF NOT EXISTS trimester(
    id VARCHAR(12) PRIMARY KEY,
    star DATE,
    end DATE
);

--notifications? control de taquilla?