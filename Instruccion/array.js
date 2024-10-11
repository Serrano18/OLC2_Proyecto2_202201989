import { enviroment } from "../Symbol/enviroment.js";
import { Invocable } from "./invocable.js";
import { Array, Primitivo } from "../Compilador/nodos.js";
import { InstanciaA } from "./InstanciaA.js";
export class iarray extends Invocable {
    constructor(nodo, args) {
        super();
        /**
         * @type {Array}
         */
        this.nodo = nodo;

        this.args = args

    }
    aridad() {
        return this.nodo.params.length;
    }
    /**
    * @type {Invocable['invocar']}
    */



    invocar(interprete, args) {
        const nodo = this.nodo;
        if(nodo.tipo != undefined && nodo.t != undefined){
            const arreglo = this.crearArreglo(nodo.tipo,nodo.t,interprete)
            this.nodo.tipo = nodo.tipo + '[]'.repeat(nodo.t.length)
            arreglo.clase.nodo.tipo = this.nodo.tipo
            return arreglo
        }
        if(nodo.args != undefined){
            const arreglo = this.obtenerarreglo(interprete)
            return arreglo
        }
    }

    crearArreglo(tipo, tamano,interprete){
        if (tamano.length == 1){
            let instanciaA = new InstanciaA(this,[]);
            let ndatos = this.nodo.t[0].accept(interprete);
            for (let i=0; i<ndatos.valor; i++){
                instanciaA.propiedades.push(instanciaA.getdefecto(tipo));
            }
            return instanciaA;
        }else{
            let instanciaA = new InstanciaA(this,[]);
            let arreglo = []
               // Usar ciclo for para crear las instancias del array
            let length = tamano[0].accept(interprete).valor;
            for (let i = 0; i < length; i++) {
                arreglo.push(new Primitivo({
                    tipo: tipo + '[]'.repeat(tamano.length - 1),
                    valor: this.crearArreglo(tipo, tamano.slice(1), interprete)
                }));
            }
            instanciaA.propiedades = arreglo;
            return instanciaA;
        }

    }

    obtenerarreglo(interprete){
        let instanciaA = new InstanciaA(this,[]);
        let arreglo = []
        this.nodo.args.forEach(arg => {
            arreglo.push(arg.accept(interprete));
        });
        if(instanciaA.clase.nodo.tipo == undefined){
            this.nodo.tipo = arreglo[0].tipo + '[]'
        }else{
            this.nodo.tipo += '[]'
        }
        instanciaA.clase.nodo.tipo = this.nodo.tipo
        instanciaA.propiedades = arreglo;
        return instanciaA;
    }

}