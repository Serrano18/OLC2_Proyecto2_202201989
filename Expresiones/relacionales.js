import { Primitivo } from "../Compilador/nodos.js";

export function relacionales(op,izq,der){
       //Evaluar si los valores son null
       if(izq.valor === null || der.valor === null){
        throw new Error('Error en la operacion aritmetica valores nulos');
    }
    if (izq.tipo == 'int' || izq.tipo == 'float' || izq.tipo == 'char' 
        &&
        der.tipo == 'int' || der.tipo == 'float' || der.tipo == 'char') {

          switch (op) {
              case '>':
                if (izq.tipo == der.tipo){
                    return new Primitivo({valor: izq.valor > der.valor, tipo: 'boolean'});
                }else if(izq.tipo == 'int' && der.tipo == 'float'){
                    return new Primitivo({valor: izq.valor > der.valor, tipo: 'boolean'});
                }else if(izq.tipo == 'float' && der.tipo == 'int'){
                    return new Primitivo({valor: izq.valor > der.valor, tipo: 'boolean'});
                }else{
                    throw new Error('Error en la operacion logica tipos incorrectos');
                    //return new Primitivo({valor: null, tipo: 'boolean'});
                }
              case '<':
                if (izq.tipo == der.tipo){
                    return new Primitivo({valor: izq.valor < der.valor, tipo: 'boolean'});
                }else if(izq.tipo == 'int' && der.tipo == 'float'){
                    return new Primitivo({valor: izq.valor < der.valor, tipo: 'boolean'});
                }else if(izq.tipo == 'float' && der.tipo == 'int'){
                    return new Primitivo({valor: izq.valor < der.valor, tipo: 'boolean'});
                }else{
                    throw new Error('Error en la operacion logica tipos incorrectos');
                    //return new Primitivo({valor: null, tipo: 'boolean'});
                }
              case '>=':
                if (izq.tipo == der.tipo){
                    return new Primitivo({valor: izq.valor >= der.valor, tipo: 'boolean'});
                }else if(izq.tipo == 'int' && der.tipo == 'float'){
                    return new Primitivo({valor: izq.valor >= der.valor, tipo: 'boolean'});
                }else if(izq.tipo == 'float' && der.tipo == 'int'){
                    return new Primitivo({valor: izq.valor >= der.valor, tipo: 'boolean'});
                }else{
                    throw new Error('Error en la operacion logica tipos incorrectos');
                    //return new Primitivo({valor: null, tipo: 'boolean'});
                }  
              case '<=':
                if (izq.tipo == der.tipo){
                    return new Primitivo({valor: izq.valor <= der.valor, tipo: 'boolean'});
                }else if(izq.tipo == 'int' && der.tipo == 'float'){
                    return new Primitivo({valor: izq.valor <= der.valor, tipo: 'boolean'});
                }else if(izq.tipo == 'float' && der.tipo == 'int'){
                    return new Primitivo({valor: izq.valor <= der.valor, tipo: 'boolean'});
                }else{
                    throw new Error('Error en la operacion logica tipos incorrectos');
                    //return new Primitivo({valor: null, tipo: 'boolean'});
                }
             default:
                //return new Primitivo({valor: null, tipo: 'boolean'});
                  throw new Error('Error en la operacion logica tipos incorrectos');
            }
        }else{
            //return new Primitivo({valor: null, tipo: 'boolean'});
            throw new Error('Error en la operacion logica tipos incorrectos');
        }

}