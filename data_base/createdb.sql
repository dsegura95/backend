-- La bd la crea el docker-compose en su file de configuracion, luego crea toda estas tablas

SET TIME ZONE 'America/Caracas';

-- Cargamos los datos en tablas
-- Tabla de usuario
CREATE TABLE IF NOT EXISTS item(
    id BIGSERIAL PRIMARY KEY, -- A pata
    name VARCHAR(64) NOT NULL,
    description VARCHAR(256) -- Especificaciones: 64bits, 4 GB RAM
);

-- Si Sep-Dic termina en Dic, Ene o Feb sig trim sera Ene-Mar
-- Si Ene-Mar termina en Mar, Abr o May sig trim sera Abr-Jul
-- Si Abr-Jul termina en Junio, Jul o Sep sig trim sera Sep-Dic
CREATE TABLE IF NOT EXISTS trimester(
    id VARCHAR(12) PRIMARY KEY,
    start timestamptz,
    finish timestamptz,
    CONSTRAINT correctDate CHECK (start < finish)
);

--NA si no tiene dpt
CREATE TABLE IF NOT EXISTS dept(
    id VARCHAR(3) PRIMARY KEY,
    name VARCHAR(128)
);

-- Solo los labs pueden agregar una nueva subject
-- El front tiene que permitirte crear el subject mediante un modal
CREATE TABLE IF NOT EXISTS subject(
    id VARCHAR(6) PRIMARY KEY,
    name VARCHAR(128),
    dept VARCHAR(3),
    FOREIGN KEY (dept) REFERENCES dept(id)
);

CREATE TABLE IF NOT EXISTS usuario(
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    clave VARCHAR(200),
    email VARCHAR(64) NOT NULL,
    type SMALLINT NOT NULL,
    is_active BOOLEAN NOT NULL, --En caso de que un lab se disuelva o salga del sistema
    chief VARCHAR(64) NOT NULL, --Labf es su propio jefe
    FOREIGN KEY (chief) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS room(
    id VARCHAR(7) PRIMARY KEY,--MYS-222
    name VARCHAR(64) NOT NULL, --Sala A
    owner_id VARCHAR(64) NOT NULL, --Chang
    FOREIGN KEY (owner_id) REFERENCES usuario(id),
    manager_id VARCHAR(64) NOT NULL, --LDAC
    FOREIGN KEY (manager_id) REFERENCES usuario(id),
    is_active BOOLEAN NOT NULL,
    description VARCHAR(1024) NOT NULL, --Lo llenara el usuario en un vista para informacion del laboratorio
    last_used DATE, --LAB F puede modificarla para extenderla
    first_used DATE
);

CREATE TABLE IF NOT EXISTS room_request(
    id BIGSERIAL PRIMARY KEY,
    room_id VARCHAR(64) NOT NULL, --MYS-222
    requested_id VARCHAR(64) NOT NULL, --LAB F
    FOREIGN KEY (requested_id) REFERENCES usuario(id),
    owner_id VARCHAR(64) NOT NULL, --Eduardo Whithe
    FOREIGN KEY (owner_id) REFERENCES usuario(id),
    manager_id VARCHAR(64) NOT NULL, --LDC
    FOREIGN KEY (manager_id) REFERENCES usuario(id),
    trimester_id VARCHAR(12) NOT NULL,
    FOREIGN KEY (trimester_id) REFERENCES trimester(id),
    date DATE NOT NULL,
    status CHAR(1) --A(aprobado),R(rechazado),E(espera)
);

CREATE TABLE IF NOT EXISTS room_item(
    room_id VARCHAR(7),
    FOREIGN KEY (room_id) REFERENCES room(id),
    trimester_id VARCHAR(12) NOT NULL,
    FOREIGN KEY (trimester_id) REFERENCES trimester(id),
    item_id BIGSERIAL NOT NULL,
    FOREIGN KEY (item_id) REFERENCES item(id),
    PRIMARY KEY (room_id, trimester_id, item_id),
    quantity SMALLINT
);

-- Esta no se elimina
CREATE TABLE IF NOT EXISTS asignation(
    id BIGSERIAL PRIMARY KEY,
    room_id VARCHAR(7),
    FOREIGN KEY (room_id) REFERENCES room(id),
    subject_id VARCHAR(6),
    FOREIGN KEY (subject_id) REFERENCES subject(id),
    trimester_id VARCHAR(12),
    FOREIGN KEY (trimester_id) REFERENCES trimester(id),
    date DATE NOT NULL
);

-- Esta es la del crud
CREATE TABLE IF NOT EXISTS asig_schedule(
    id BIGSERIAL PRIMARY KEY,
    asignation_id BIGINT NOT NULL,
    FOREIGN KEY (asignation_id) REFERENCES asignation(id),
    day VARCHAR(9),
    hour SMALLINT,
    week SMALLINT,
    UNIQUE (asignation_id ,day, hour, week)
);

CREATE TABLE IF NOT EXISTS reservation_request(
    id BIGSERIAL PRIMARY KEY,
    requester_id VARCHAR(64),
    FOREIGN KEY (requester_id) REFERENCES usuario(id),
    room_id VARCHAR(7),
    FOREIGN KEY (room_id) REFERENCES room(id),
    subject_id VARCHAR(6),
    FOREIGN KEY (subject_id) REFERENCES subject(id),
    send_time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    trimester_id VARCHAR(12),
    reason VARCHAR(128),
    material_needed VARCHAR(512),
    quantity SMALLINT,
    status CHAR(1) --A(aprobado),R(rechazado),E(espera)
);

--Hace referencia al horario
CREATE TABLE IF NOT EXISTS reservation_request_schedule(
    id BIGSERIAL PRIMARY KEY,
    reservation_request_id BIGINT,
    FOREIGN KEY (reservation_request_id) REFERENCES reservation_request(id),
    day VARCHAR(9),
    hour SMALLINT,
    week SMALLINT
);