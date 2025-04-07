# Frontend Vue.js con Docker

Este proyecto utiliza Vue.js y Vite para desarrollar una aplicación frontend, y Docker para contenerizarla. A continuación se detallan los pasos para construir, ejecutar y administrar el contenedor de Docker.

## Requisitos previos

Asegúrate de tener Docker y Docker Compose instalados en tu máquina antes de proceder.

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Pasos de Construcción y Ejecución

### 1. Construir la imagen Docker

Para construir la imagen de Docker para la aplicación, abre una terminal en la raíz del proyecto y ejecuta el siguiente comando:

docker build -t vue-frontend .

# Iniciar el contenedor 
Una vez estè construida la imagen, se puede iniciar el contenedor con el siguiente comando:

docker run -p 8080:80 vue-frontend

O si prefieres hacerlo con docker-compose utilizar el siguiente comando:

docker-compose up --build

(Esto construirá la imagen y levantará el contenedor en un solo paso. La aplicación estará disponible en http://localhost:8080).

#Detener el contenedor
Para detener el contenedor, puedes presionar Ctrl+C en la terminal donde está corriendo, o bien ejecutar el siguiente comando para detener y eliminar el contenedor manualmente:

docker stop <nombre_del_contenedor>
docker rm <nombre_del_contenedor>

Para eliminar la imagen después de usarla, puedes ejecutar:

docker rmi vue-frontend

# frontendvue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
