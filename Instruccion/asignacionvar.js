import { Primitivo } from "../Compilador/nodos.js";
import { ErrorData } from "../Symbol/errores.js";
import { errores } from "../index.js";
export function asignav (valorn,valoractual,op){
    if( valorn.valor == null){
        return new Primitivo({valor:null , tipo: valoractual.tipo});
        //throw new Error('Variable no definida')
    }
    switch (op){
        case '=':
            if(valorn.tipo == valoractual.tipo){
                return new Primitivo({valor:valorn.valor , tipo: valorn.tipo});
            }else{
                errores.push({
                    desc: "Error al asignar valor tipos no coinciden",
                    tipo: "Semantico", // Puedes agregar un tipo si lo deseas
                    linea: valorn.location?.start.line || "Desconocido",
                    columna:  valorn.location?.start.column || "Desconocido"
                })
                //agregarError("Variable no definida", "Semántico", , columna);
                return new Primitivo({valor:null , tipo: valoractual.tipo});
                //throw new Error('Tipos no compatibles')
            }
        case '+=':
            if(valorn.tipo == valoractual.tipo){
                return new Primitivo({valor:valoractual.valor+=valorn.valor , tipo: valorn.tipo});
            }else{
                errores.push({
                    desc: "Error al asignar valor tipos no coinciden",
                    tipo: "Semantico", // Puedes agregar un tipo si lo deseas
                    linea: valorn.location?.start.line || "Desconocido",
                    columna:  valorn.location?.start.column || "Desconocido"
                })
                return new Primitivo({valor:null , tipo: valoractual.tipo});
                throw new Error('Tipos no compatibles')
            }
        case '-=':
            if(valorn.tipo == valoractual.tipo){
                return new Primitivo({valor:valoractual.valor-=valorn.valor , tipo: valorn.tipo});
            }else{
                errores.push({
                    desc: "Error al asignar valor tipos no coinciden",
                    tipo: "Semantico", // Puedes agregar un tipo si lo deseas
                    linea: valorn.location?.start.line || "Desconocido",
                    columna:  valorn.location?.start.column || "Desconocido"
                })
                return new Primitivo({valor:null , tipo: valoractual.tipo});
                throw new Error('Tipos no compatibles')
            }
        default:
            throw new ErrorData('Operador no valido',valorn.location);
    }
}