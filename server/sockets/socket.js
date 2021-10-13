const { io } = require('../server');
const { Usuarios } = require('../classes/usuario');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrar-chat', (data, callback ) => {
        
        if( !data.nombre || !data.sala ){
            return callback({
                error: true,
                mensaje:'El nombre/sala es necesario'
            })
        }

        client.join( data.sala );

        usuarios.agregarPersona( client.id, data.nombre, data.sala);

        client.broadcast.to( data.sala ).emit('lista-persona', usuarios.getPersonasPorSala( data.sala));
        client.broadcast.to( data.sala ).emit('crear-mensaje', crearMensaje( 'Administrador', `${ data.nombre } se unió al chat`));

        callback ( usuarios.getPersonasPorSala(data.sala));
    });

    client.on('disconnect', () => {

        const personaBorrada = usuarios.borrarPersona( client.id);
        
        if( personaBorrada )
        {
            client.broadcast.to( personaBorrada.sala ).emit('crear-mensaje', crearMensaje( 'Administrador', `${ personaBorrada.nombre } abandono el chat`));
            client.broadcast.to( personaBorrada.sala ).emit('lista-persona', usuarios.getPersonasPorSala( personaBorrada.sala ));
        }

    });

    client.on('crear-mensaje', ( data, callback ) =>{

        const persona = usuarios.getPersona(client.id);

        const mensaje = crearMensaje( persona.nombre, data.mensaje );
        client.broadcast.to( persona.sala ).emit( 'crear-mensaje', mensaje);

        callback( mensaje);
    });

    //Mensajes privados
    client.on('mensaje-privado', ( data ) =>{

        const persona = usuarios.getPersona(client.id);

        const mensaje = crearMensaje( persona.nombre, data.mensaje );
        
        client.broadcast.to(data.para).emit( 'mensaje-privado', mensaje);

    });
});