# QuizzGame

QuizzGame is a quiz game application featuring a user interface built with React and game logic implemented in a Python server using Flask.

## Project Structure

- `python_server`: Holds the game logic implemented using Python with Flask.
- `questionary`: Holds the user interface of the game, implemented in React.

## Installation

To test the application locally, follow these steps:

### Install User Interface Dependencies

1. Navigate to the `questionary` directory:
   ```sh
   cd questionary   
    ```
2. Install dependencies with npm:
```sh 
    npm install
```
3.(Optional) Install concurrently to run both servers at the same time:
```sh
   npm install concurrently
```

## Install Python Server Dependencies

Navigate to the `python_server` directory and install Flask:

```sh
    cd python_server
    pip install flask
```

## Installing DataBase
For macOs system you can use:
```
brew install postgresql
```

For other OS visit: https://www.postgresql.org/download/

### Run PostgreSQL Service
Once installed, start the PostgreSQL service. 
* On macOS, you can use the following command:
```sh
brew services start postgresql
```
* On Linux, the command will typically be:
```
sudo service postgresql start
```

* On Windows, you can start the service through the Services application.


## Usage

To test the application, navigate to the questionary directory and use one of the following commands:

* `npm start`: Runs only the React server.
* `npm run start_both`: Runs both servers, React and Python.

## Contributing

If you wish to contribute to the project, please fork the repository, make your changes in your fork, and then submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.


## Points of postgreSQL

# Acceder al usuario postgres
sudo -u postgres psql

# Crear una base de datos
CREATE DATABASE ******;

# Crear un usuario
CREATE USER * WITH PASSWORD '**';

# Otorgar permisos al usuario sobre la base de datos
GRANT ALL PRIVILEGES ON DATABASE proyectBDP TO bdp;

# Salir de psql
\q

# Ver los usuarios 
SELECT * FROM {databaseName}