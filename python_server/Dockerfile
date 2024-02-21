# Dockerfile
FROM ubuntu:latest

# Install VI
RUN apt-get update && apt-get install -y vim

# Use python 3.9
FROM python:3.9

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the code
COPY app.py .
COPY dataBase.py .
COPY requirements.txt .
COPY servery.py .
COPY socketio_handler.py .
COPY tinkers.py .
COPY data .

# Expose the port
EXPOSE 3001

# Execution the server
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "--timeout", "86400", "server:app", "-b", "0.0.0.0:3001"]
