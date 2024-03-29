const params = new URLSearchParams( window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

//Referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
//const divUsuarios     = document.querySelector('#divUsuarios');

//Funciones apra renderizar usuarios

function renderizarUsuarios( personas ) {

    let html = '';

    html += '<li>';
    html +='   <a href="javascript:void(0)" class="active"> Chat de <span>'+ params.get('sala') +' </span></a>';
    html +='</li>';

    for( let i = 0; i < personas.length; i++)
    {

        html +='<li>';
        html +='    <a data-id="'+ personas[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+  personas[i].nombre +'<small class="text-success">online</small></span></a>';
        html +='</li>';
    }

    divUsuarios.html(html);
    //divUsuarios.innerHTML = html;
}

function renderizarMensajes( mensaje, yo ){

    const fecha = new Date( mensaje.fecha);
    const hora = fecha.getHours() + ':' + fecha.getMinutes();

    var  adminClass = 'info';
    if( mensaje.nombre === 'Administrador'){
        adminClass = 'danger';
    }

    let html = ''
    if ( yo ){

        html = 
        `<li class="reverse">
        <div class="chat-content">
            <h5>${ mensaje.nombre}</h5>
            <div class="box bg-light-inverse">${ mensaje.mensaje}</div>
        </div>
        <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
        <div class="chat-time">${ hora }</div>
        </li>`;

    }else{
        html = `
        <li class="animated fadeIn">
            <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>
            <div class="chat-content">
                <h5>${ mensaje.nombre}</h5>
                <div class="box bg-light-${ adminClass }"> ${ mensaje.mensaje}</div>
            </div>
            <div class="chat-time">${ hora }</div>
        </li>
    `;
    }
    



    divChatbox.append(html);

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//listenes
divUsuarios.on('click', 'a', function(){

    const id = $(this).data('id');

    if( id ){
        console.log(id);
    }
    

});

formEnviar.on('submit', function(e){

    e.preventDefault();

    if( txtMensaje.val().trim().length === 0)
    {
        return
    }
    socket.emit('crear-mensaje', {
        usuario: nombre,
        mensaje: txtMensaje.val()
    }, function(resp) {
        txtMensaje.val('').focus;
        renderizarMensajes(resp, true);
        scrollBottom();
    });

})

