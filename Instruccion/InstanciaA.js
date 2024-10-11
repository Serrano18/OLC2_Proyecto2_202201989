
import { Primitivo } from "../Compilador/nodos.js";
import { iarray } from "./array.js";
export class InstanciaA {

    constructor(clase,propiedades) {

        /**
         * @type {iarray}
         * */
        this.clase = clase;
        this.propiedades = propiedades;
    }
    setVariable(indice, valor) {
        if(!(indice instanceof Primitivo)){
            throw new Error("Error en el indice")
        }
        if(indice.tipo != 'int'){
            throw new Error("Error en el indice")
        }
        if(indice.valor == null){
            throw new Error("Error en el indice")
        }
        if(indice.valor < 0 && indice.valor >= this.propiedades.length){
            throw new Error("Error en el indice")
        }
        this.propiedades[indice.valor] = valor;
    }

    getVariable(indice) {
        if(indice == "length"){
            return new Primitivo({tipo: 'int', valor: this.propiedades.length});
        }
        if(!(indice instanceof Primitivo)){
            throw new Error("Error en el indice")
        }
        if(indice.tipo != 'int'){
            throw new Error("Error en el indice")
        }
        if(indice.valor == null){
            throw new Error("Error en el indice")
        }
        if(indice.valor < 0 && indice.valor >= this.propiedades.length){
            //throw new Error("Error en el indice")
            return new Primitivo({tipo: 'error', valor: null});
        }
        return this.propiedades[indice.valor] ;
    }

    getdefecto(tipo) {
        const defecto = {
            char: new Primitivo({ tipo: 'char', valor: ' ' }),
            int: new Primitivo({ tipo: 'int', valor: 0 }),
            float: new Primitivo({ tipo: 'float', valor: 0.0 }),
            boolean: new Primitivo({ tipo: 'boolean', valor: false }),
            string: new Primitivo({ tipo: 'string', valor: '' }),
        }
    
        return defecto[tipo] !== undefined ? defecto[tipo] : new Primitivo({ tipo: tipo, valor: null });
        
    }
}
