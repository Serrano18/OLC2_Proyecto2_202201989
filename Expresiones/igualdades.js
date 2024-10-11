import { Primitivo } from "../Compilador/nodos.js";

export function igualdades(op,izq,der){
       //Evaluar si los valores son null
       if(izq.valor === null || der.valor === null){
        throw new Error('Error en la operacion aritmetica valores nulos');
    }

    if (op === '==') {
        if (izq.tipo === der.tipo) {
            return new Primitivo({valor: izq.valor === der.valor, tipo: 'boolean'});
        } else if(izq.tipo === 'int' && der.tipo === 'float'){
            return new Primitivo({valor: izq.valor == der.valor, tipo: 'boolean'});
        } else if(izq.tipo === 'float' && der.tipo === 'int'){
            return new Primitivo({valor:izq.valor == der.valor, tipo: 'boolean'});
        } else {
            throw new Error('Error en la operacion logica tipos incorrectos');
        }
    } else if (op === '!=') {
        if (izq.tipo === der.tipo) {
            return new Primitivo({valor: izq.valor !== der.valor, tipo: 'boolean'});
        } else if(izq.tipo === 'int' && der.tipo === 'float'){
            return new Primitivo({valor: izq.valor != der.valor, tipo: 'boolean'});
        } else if(izq.tipo === 'float' && der.tipo === 'int'){
            return new Primitivo({valor: izq.valor != der.valor, tipo: 'boolean'});
        }  else {
            throw new Error('Error en la operacion logica tipos incorrectos');
        }
    }
    return new Primitivo({valor: null, tipo: 'boolean'});
}