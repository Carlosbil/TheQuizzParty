// En un archivo llamado "emit_socket_event.js"
const io = require('socket.io-client');
const socket = io('http://192.168.1.62:3001'); // Cambia la URL a tu servidor

socket.on('connect', () => {
    console.log('Conectado al servidor.');

    // Reemplaza 'join_game' y el objeto con los detalles del evento que deseas enviar
    socket.emit('join_game', { token: 'tu_token_aquí', room: 'nombre_de_la_sala' });
    console.log('Evento emitido.')
    // Escuchar eventos de respuesta del servidor
    socket.on('join_game_response', (response) => {
        console.log(response);
    });
    // Desconectar después de emitir el evento
    setTimeout(() => {
        socket.disconnect();
    }, 10000); // Espera 5 segundos antes de desconectar
});

socket.on('connect_error', (error) => {
    console.error('Error de conexión:', error);
});
