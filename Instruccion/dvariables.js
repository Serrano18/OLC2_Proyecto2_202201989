import { Primitivo } from "../Compilador/nodos.js";
import { ErrorData } from "../Symbol/errores.js";

export function dvariable (exp,tipo,id){
    if (id == null){
        //error de id no reconocido
        throw new ErrorData("id no reconocido", exp.location);
    }
    //primitivo por defecto
    if (exp == null){
         return new Primitivo({valor:null , tipo: tipo});
    }
    if(tipo == 'float'){
        if(exp.tipo == 'int'){
            return new Primitivo({valor: parseFloat(exp.valor) , tipo: tipo});
        }
    }

    if (tipo == 'var'){
        //var id = exp
        if (exp.valor != null){
            return exp;
        }else{
            throw new ErrorData("Variable no definida", exp.location);
        }
    }

    if (exp.tipo == tipo){
        //agregar variable al entorno o actualizar
        return exp;
    }else{
        return new Primitivo({valor:null , tipo: tipo});
    }
}