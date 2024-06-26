# Usar la imagen base de Node.js
FROM node:18.15.0

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración de dependencias
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el código de la aplicación al contenedor
COPY . .

# Ejecutar TailwindCSS para generar el CSS
RUN npx tailwindcss -i ./src/index.css -o ./src/tailwind-output.css --minify

# Exponer el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
