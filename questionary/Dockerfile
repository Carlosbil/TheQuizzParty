# Establecer la imagen base
FROM node:18.15.0

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de npm
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto 3000 (o el puerto que uses para el servidor de desarrollo de React)
EXPOSE 3000

# Comando para iniciar la aplicación de React
CMD ["npm", "start"]
