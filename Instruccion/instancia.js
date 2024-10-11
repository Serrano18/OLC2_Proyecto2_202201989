import { enviroment } from "../Symbol/enviroment.js";
import { dstruct } from "./struct.js";

export class Instancia {

    constructor(clase,entorno) {

        /**
         * @type {dstruct}
         * */
        this.clase = clase;
        this.propiedades = new enviroment(entorno);
    }

    setVariable(nombre, valor) {
        this.propiedades.assignvariables(nombre, valor);
    }

    getVariable(nombre) {
        return this.propiedades.getVariable(nombre);    
    }
}