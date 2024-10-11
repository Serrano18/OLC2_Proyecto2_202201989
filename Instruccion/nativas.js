import { Invocable } from "./invocable.js";
import { Primitivo } from "../Compilador/nodos.js";
import { iarray } from "./array.js";
import { InstanciaA } from "./InstanciaA.js";
import { Instancia } from "./instancia.js";
import { errores } from "../index.js";
import { ErrorData } from "../Symbol/errores.js";
class Nativa extends Invocable {
    constructor(aridad, func) {
        super();
        this.aridad = aridad;
        this.invocar = func;
    }
}


export const fnativas = {
    'parseInt': new Nativa(() => 1, (interprete,args) => {
        
        if(args[0].tipo != 'string'){  
            errores.push({
                desc: "Error en la conversion a string",
                tipo: "Semantico", // Puedes agregar un tipo si lo deseas
                linea: args[0].location?.start.line || "Desconocido",
                columna:  args[0].location?.start.column || "Desconocido"
            })
            return new Primitivo({valor: null, tipo: 'int'})
            //throw new Error('Error en la conversion a string')
          }
        return new Primitivo({valor: parseInt(args[0].valor), tipo: 'int'})
    }),
    'parsefloat': new Nativa(() => 1, (interprete,args) => {
            
            if(args[0].tipo != 'string'){  
                errores.push({
                    desc: "Error en la conversion a string",
                    tipo: "Semantico", // Puedes agregar un tipo si lo deseas
                    linea: args[0].location?.start.line || "Desconocido",
                    columna:  args[0].location?.start.column || "Desconocido"
                })
                return new Primitivo({valor: null, tipo: 'float'})
                //throw new Error('Error en la conversion a string')
            }
            return new Primitivo({valor: parseFloat(args[0].valor), tipo: 'float'})
        }
    ),
    'toString': new Nativa(() => 1, (interprete,args) => {
        return new Primitivo({valor: args[0].valor.toString(), tipo: 'string'})
    }),
    'toLowerCase': new Nativa(() => 1, (interprete,args) => {
        if(args[0].tipo != 'string'){  
            errores.push({
                desc: "Error en la conversion a string",
                tipo: "Semantico", // Puedes agregar un tipo si lo deseas
                linea: args[0].location?.start.line || "Desconocido",
                columna:  args[0].location?.start.column || "Desconocido"
            })
             return new Primitivo({valor: null, tipo: 'string'})
            //throw new Error('Error en la conversion a string')
        }
        return new Primitivo({valor: args[0].valor.toLowerCase(), tipo: 'string'})
    }),
    'toUpperCase': new Nativa(() => 1, (interprete,args) => {
        if(args[0].tipo != 'string'){  
            errores.push({
                desc: "Error en la conversion a string",
                tipo: "Semantico", // Puedes agregar un tipo si lo deseas
                linea: args[0].location?.start.line || "Desconocido",
                columna:  args[0].location?.start.column || "Desconocido"
            })
            return new Primitivo({valor: null, tipo: 'string'})
            //throw new Error('Error en la conversion a string')
        }
        return new Primitivo({valor: args[0].valor.toUpperCase(), tipo: 'string'})
    }),
    'join': new Nativa(() => 1, (interprete,args) => {
        if (!(args[0] instanceof Primitivo)){
            throw new ErrorData('Error el dato no es primitivo',args[0].location)
        }
        if (!(args[0].valor instanceof InstanciaA)){
            throw new ErrorData('Error el argumento no es un Array o Matriz',args[0].location)
        }
        return new Primitivo({
            valor: args[0].valor.propiedades.map((x) => x.valor).join(','),
            tipo: 'string'})
    }),
    'indexOf': new Nativa(() => 2, (interprete,args) => {
        if (!(args[0] instanceof Primitivo)){
            throw new ErrorData('Error el dato no es primitivo',args[0].location)
        }
        if (!(args[0].valor instanceof InstanciaA)){
            throw new ErrorData('Error el argumento no es un Array o Matriz',args[0].location)
        }
        return new Primitivo({
            valor:args[0].valor.propiedades.findIndex(x => x.valor == args[1].valor && x.tipo == args[1].tipo),
            tipo: 'int'})
    }),
    'Object.keys': new Nativa(() => 1, (interprete,args) => {
        if (!(args[0] instanceof Primitivo)){
            throw new ErrorData('Error el dato no es primitivo',args[0].location)
        }
        if (!(args[0].valor instanceof Instancia)){
            throw new ErrorData('Error el argumento no es un Array o Matriz',args[0].location)
        }
        return new Primitivo({
            tipo: 'string',
            valor: args[0].valor.propiedades.getAllVariableNames()
        })
    }),

    
}