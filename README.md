# backend
Backend del sistema de reserva de laboratorios F (+ Docker + Jenkins CI/CD + Unit Test)

CI/CD del proyecto:
---------
![CI/CD](https://www.qatouch.com/wp-content/uploads/2018/12/CI-with-Jenkins-Git.png)

Versiones:
---------

Docker image: NodeJs 12.18.0 - Npm 6.14.4

Docker image: postgres 13


Requisitos para ejecutar:
---------

- Docker CE & Docker compose
- Archivo **.env** en la raiz del proyecto con los datos de los siguientes parametros: {host, password, database, port, user} *(el puerto definirlo en 5432 el default de postgres)*
- No tener ocupado el puerto 5432 (apagar el servicio postgres local: sudo services postgresql stop) en caso de querer ocupar otro puerto cambiarlo en el .env

Instrucciones:
---------

- Clonar el repo
- Levantar el proyecto con docker-compose:

```
$ docker-compose up -d
```
esto levantara 2 servicios: la db (db_reserva_cont) y el backend (backend_reserva_cont) que se conecta con la bd. sus respectivas imagenes son (reservadb, reservabackend).
- Probar que todo este funcionando realizando una peticion GET:

```
$ curl -v localhost:3000/api/items
```
- Empezar a codear sobre el proyecto

Ejecucion de pruebas unitarias:
---------

Recuerda cumplir los requisitos (tener el puerto de la bd libre). y no tener en ejecucion la aplicacion (asegurate con: $ docker-compose down). Posteriormente correr el script npm:
```
$ npm run dtest
```

(el script, levanta la imagen de la BD, en background. Ejecuta la imagen del backend con el comando de pruebas y por ultimo finaliza todo lo levantado con docker-compose down)

Desarrollando con docker:
---------

- Para instalar modules:
```
$ docker-compose exec backend npm install <nombrePaquete>
```

- Para ver logs de la app en conjunto:
```
$ docker-compose logs -f
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
- Para tumbar la app:
```
$ docker-compose down
```
Luego en caso de volver querer volver a iniciarla:
```
$ docker-compose up -d --build
```
- Para operar directamente con la BD (Meter querys, etc, en usando postgres) conectarse al servidor con los datos proporcionados por el .env

*Probablemente este pasando algo por alto, pero estare modificando y agregando informacion a la vez. Cualquier cosa creen un issue - JK*

