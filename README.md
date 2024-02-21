# Warning
---
Since this is only a develop phase, it usually has the localhost config in the url from React to python, modify and include the host ip for let to other users to play

This code might contain bugs in the app or produce incorrect answers, and therefore needs to be reviewed. If you have any suggestions for improving the application or if you find any errors, please contact me via email at carlosbilbao2@gmail.com or make a pull request and assign it to me.

# QuizzGame
---
QuizzGame is a quiz game application featuring a user interface built with React and game logic implemented in a Python server using Flask.

## Project Structure
---
- `python_server`: Holds the game logic implemented using Python with Flask and Data Base 
- `questionary`: Holds the user interface of the game, implemented in React.

## Installation
---
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
---
Navigate to the `python_server` directory and install Flask:

```sh
    cd python_server
    pip install -r requirements.txt
```

## Installing DataBase
---
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

## To Use With Docker and K8s enviroment
---
### Mac

First of all be sure that you have installed and available a k8s enviroment, and be sure that Docker is running:

```bash
brew install minikube
minikube start
```

Be sure that you have instaled postgresql, if not, use:

```bash
docker pull postgres
```

After that, in root folder, just use the following command to deploy with Docker:

```bash
docker-compose up -d
```

To use k8s use:

**This section are going to be completed...** 


## Usage
---

To test the application, navigate to the questionary directory and use one of the following commands:
From `/questionary`

* `npm start`: Runs only the React server.
* `npm run both`: Runs both servers, React and Python.(need to have installed `npm install concurrently` )

## Contributing

If you wish to contribute to the project, please fork the repository, make your changes in your fork, and then submit a pull request.

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International Public License](./LICENSE).
