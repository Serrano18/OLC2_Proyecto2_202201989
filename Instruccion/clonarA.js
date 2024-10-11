
import { Primitivo } from "../Compilador/nodos.js";
import { InstanciaA } from "./InstanciaA.js";


export function ClonarA(dato) {
    let valor;
    if (!(dato instanceof Primitivo)) {
        throw new Error ("El dato no es primitivo")
    }
    if (Array.isArray(dato.valor)) {
        valor = dato.valor.map(x => ClonarV(x)); //matrix
    } else {
        valor = ClonarV(dato.valor);
    }
    return new Primitivo({ valor: valor, tipo: dato.tipo });
}

//Aqui solo deberia recibir el valor para que suba y retrone el primitivo
function ClonarV(valor) {
    if (valor instanceof Primitivo) {
        return ClonarA(valor);
    } else if (Array.isArray(valor)) { //matrix
        return valor.map(x => ClonarV(x));
    } else if (valor instanceof InstanciaA) {
        return ClonarInstancia(valor);
    } else {
        return JSON.parse(JSON.stringify(valor));
    }
}


function ClonarInstancia(instncia) {
    if (!(instncia instanceof InstanciaA)) {
        throw new Error('EL valor no es una matriz');
    }
    const propiedades = instncia.propiedades.map(x => ClonarV(x)); //copiar las propiedades que ya sean primitivos
    return new InstanciaA(instncia.clase, propiedades);
}