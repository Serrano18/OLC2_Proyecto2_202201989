import { enviroment } from "../Symbol/enviroment.js";
import { Invocable } from "./invocable.js";
import { DeclaracionStruct } from "../Compilador/nodos.js";
import { Instancia } from "./instancia.js";
export class dstruct extends Invocable {
    constructor(nodo, clousure) {
        super();
        /**
         * @type {DeclaracionStruct}
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
        const entornoAntesDeLaLlamada = interprete.entornoActual;
    
        const instancia = new Instancia(this,this.clousure);
        interprete.entornoActual = instancia.propiedades;

        this.nodo.vars.forEach(vare => {
            vare.accept(interprete);
        });

        args.forEach(arg => {
            arg.accept(interprete)});

        
        interprete.entornoActual = entornoAntesDeLaLlamada;
        return instancia;
    }
/*
    atar(instancia) {
        const entornoOculto = new enviroment(this.clousure);
        entornoOculto.set('this', instancia);
        return new dfuncion(this.nodo, entornoOculto);
    }
        */
}