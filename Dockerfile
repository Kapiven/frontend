# Usar una imagen base de Node
FROM node:20 AS build

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todos los archivos del proyecto
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Usar nginx para servir los archivos estáticos
FROM nginx:stable-alpine

# Copiar los archivos compilados a nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
