# backend
Backend del sistema de reserva de laboratorios F (+ Docker + Jenkins CI/CD + Unit Test)

#
CI/CD del proyecto:
---------
![CI/CD](https://www.qatouch.com/wp-content/uploads/2018/12/CI-with-Jenkins-Git.png)

#
Versiones:
---------

Docker image: NodeJs 12.18.0 - Npm 6.14.4

Docker image: postgres 13

#
Requisitos para ejecutar (No Docker):
---------

- Postgresql
- Nodejs (>=11.x <14.x)

#
Instrucciones:
---------

- Clonar el repo
- Instalar dependencias:
```
$ npm install
```

- Crear variables de entorno: copiar .env.example a .env y rellenar las variables de entorno
```
$ cp .env.example .env
```

- Crear la BD default: reserva (especificar en el .env si se elige otro nombre para la bd)
```
$ sudo -u postgres psql -c "DROP DATABASE reserva"
```

- Crear la estructura y tablas
```
$ sudo -u postgres psql -d reserva -f data_base/init_db/createdb.sql
```

- (Opcional) Llenar la BD con datos de prueba
```
$ sudo -u postgres psql -d reserva -f data_base/init_db/createdb.sql
```

- Ejecutar el backend:
```
$ npm run dev
```

- Comprobar en localhost:3000 (default port) y empezar a codear


#
Requisitos para ejecutarlo con Docker:
---------

- Docker CE & Docker compose
- Puerto 5432 libre (en caso de no definirlo en el .env)

#
Instrucciones para Docker:
---------

- Clonar el repo
- Crear variables de entorno: copiar .env.example a .env y rellenar las variables de entorno
```
$ cp .env.example .env
```
- Levantar el proyecto con docker-compose:

```
$ docker-compose up -d
```
esto levantara 2 servicios: la db (db_reserva_cont) y el backend (backend_reserva_cont) que se conecta con la bd.
- Probar que todo este funcionando realizando :

- Comprobar en localhost:3000 (default port) y empezar a codear

#
Ejecucion de pruebas unitarias:
---------

Recuerda cumplir los requisitos (tener el puerto de la bd libre). y no tener en ejecucion la aplicacion (asegurate con: $ docker-compose down). Posteriormente correr el script npm:
```
$ npm run dtest
```

(el script, levanta la imagen de la BD, en background. Ejecuta la imagen del backend con el comando de pruebas y por ultimo finaliza todo lo levantado con docker-compose down)

#
Desarrollando con docker:
---------

- Para instalar modules:
```
$ docker-compose exec backend npm install <nombrePaquete>
```

- Para ver logs de la app (en ejecucion) en conjunto:
```
$ docker-compose logs -f
```

o ejecutar la aplicacion con:
```
$ docker-compose up
```

- Para ver logs por separado de la bd o el backend:
```
$ docker logs -f backend_reserva_cont
```
o
```
$ docker logs -f db_reserva_cont
```
- Para instalar un paquete npm en el container: (debe estar corriendo el container backend)
```
$ docker exec backend_reserva_cont npm install <package>
```
Automaticamente quedara guardado en el package.json por lo que tendras el archivo actualizado en tu host y en cada nuevo build se construira el container con el paquete.
- Para detener la app:
```
$ docker-compose stop
```

- Para tumbar la app:
```
$ docker-compose down
```

- Para operar directamente con la BD (Meter querys, etc, en usando postgres) conectarse al servidor con los datos proporcionados por el .env

*Probablemente este pasando algo por alto, pero estare modificando y agregando informacion a la vez. Cualquier cosa creen un issue - JK*

