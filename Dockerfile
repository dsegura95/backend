FROM postgres:13

ENV POSTGRES_PASSWORD 1234

ENV POSTGRES_DB reserva

COPY ./data_base/createdb.sql ./data_base/fillerdb.sql /docker-entrypoint-initdb.d/