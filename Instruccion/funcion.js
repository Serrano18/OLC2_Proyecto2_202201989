import { enviroment } from "../Symbol/enviroment.js";
import { Invocable } from "./invocable.js";
import { DeclaFuncion } from "../Compilador/nodos.js";
import { ReturnException } from "../Instruccion/transferencias.js";
export class dfuncion extends Invocable {
    constructor(nodo, clousure) {
        super();
        /**
         * @type {DeclaFuncion}
         */
        this.nodo = nodo;

        /**
         * @type {enviroment}
         */
        this.clousure = clousure;
    }
    aridad() {
        return this.nodo.params.length;
    }
    /**
    * @type {Invocable['invocar']}
    */
    invocar(interprete, args) {
        const entornoNuevo = new enviroment(this.clousure);
        const entornoAntesDeLaLlamada = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;

        this.nodo.params.forEach((param, i) => {
           param.exp = args[i];
              param.accept(interprete);
        });
        try {
            this.nodo.bloque.accept(interprete);
        } catch (error) {
            interprete.entornoActual = entornoAntesDeLaLlamada;
            if (error instanceof ReturnException) {
                if (this.nodo.tipo == error.valor.tipo){ //verificar que el tipo de retorno sea igual al tipo de la funcion
                    return error.valor;
                }
            }
            throw error;
        }
        interprete.entornoActual = entornoAntesDeLaLlamada;
        return null
    }
/*
    atar(instancia) {
        const entornoOculto = new enviroment(this.clousure);
        entornoOculto.set('this', instancia);
        return new dfuncion(this.nodo, entornoOculto);
    }
        */
}