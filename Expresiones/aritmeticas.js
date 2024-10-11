import { Primitivo } from "../Compilador/nodos.js";


export function aritmeticas(op,izq,der){
    
    //Evaluar si los valores son null
    if(izq.valor === null || der.valor === null){
        throw new Error('Error en la operacion aritmetica valores nulos');
    }
    //Crear las reglas de operaciones aritmeticas
    const reglas = condiciones[op];
    //Verificamos que los tipos sean correctos
    const tipo = reglas.find(([tipoIzq,tipoDer])=>tipoIzq === izq.tipo && tipoDer === der.tipo);

    if(!tipo){
        throw new Error('Error en la operacion aritmetica tipos incorrectos');
    }
    //Verificamos que si la operacion es / o % el valor derecho no sea 0
    if(op === '/' || op === '%'){
        if(der.valor === 0){
            return new Primitivo({valor:null,tipo:'int'});
            //throw new Error('Error en la operacion aritmetica division por 0');
        }
    }
    const operaciones = {
        '+':(izq,der)=> izq + der,
        '-':(izq,der)=> izq - der,
        '*':(izq,der)=> izq * der,
        '/':(izq,der)=> izq / der,
        '%':(izq,der)=> izq % der,
    }
    let tiporesultante = tipo[2];
    let valorresultante = operaciones[op](izq.valor,der.valor);
    if (tiporesultante === 'int' && valorresultante !== null){
        valorresultante = parseInt(valorresultante);
    }
    return new Primitivo({valor:valorresultante,tipo:tiporesultante});
   
}
function condicionesc()  {
    return  [
        ['int','int','int'],
        ['int','float','float'],
        ['float','int','float'],
        ['float','float','float']
    ];
}
//trabajando objetos para + agregar string string = string

const condiciones = {
    '+':[...condicionesc(),['string','string','string']],
    '-':condicionesc(),
    '*':condicionesc(),
    '/':condicionesc(),
    '%':[['int','int','int']]
}