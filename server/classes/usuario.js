

class Usuarios{

    constructor(){
        this.personas = [];
    }

    agregarPersona( id, nombre, sala ){

        const persona = {
            id,
            nombre, 
            sala
        }

        this.personas.push(persona);

        return this.personas;

    }

    getPersona( id ) {
        /** 
        let persona = this.personas.filter( persona =>{
            return persona.id === id;
        })[0];
        */

        let persona = this.personas.find( persona =>  persona.id === id ); 
        return persona;


    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala( sala ){

        const personasEnSala = this.personas.filter ( persona => {
            return persona.sala === sala
        })

        return personasEnSala;
    }

    borrarPersona ( id ){

        const personaBorrada = this.getPersona( id );

        this.personas = this.personas.filter( persona => {
            return persona.id !== id;
        });

        /**
         * Otra forma de hacerlo.
         *  this.personas = this.personas.filter( persona =>  persona.id !== id) ;
         */

        return personaBorrada;


    }
}

module.exports = {
    Usuarios
}