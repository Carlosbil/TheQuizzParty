# Dockerfile

# Utiliza una imagen base de Python
FROM python:3.9

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de requerimientos al directorio de trabajo
COPY requirements.txt .

# Instala las dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código fuente al directorio de trabajo
COPY . .

# Expone el puerto en el que se ejecutará el servidor
EXPOSE 3001

# Comando para ejecutar el servidor
CMD ["python", "server.py"]
