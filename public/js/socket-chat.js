

const socket = io();
const param = new URLSearchParams( window.location.search);

if ( !param.has('nombre') ||  !param.has('sala')){
    window.location ='index.html';
    throw new Error( 'El nombre y sala son necesario');
}


const usuario = {
    nombre:param.get('nombre'),
    sala:param.get('sala')

}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrar-chat', usuario,  ( resp ) => {

        renderizarUsuarios(resp);

    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/**
socket.emit('crear-mensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});
*/

// Escuchar información
socket.on('crear-mensaje', function(mensaje) {

    renderizarMensajes(mensaje, false);
    //console.log('Servidor:', mensaje);
    scrollBottom();

});

//Escuchar cambios de usuarios
//cuando un usuario entra o sale del chat
socket.on('lista-persona', ( personas ) => {

    //console.log('Servidor:', mensaje);
    renderizarUsuarios(personas);

});

// mensajes privados
socket.on('mensaje-privado', ( mensaje ) => {

    console.log('mensaje provado', mensaje);

});