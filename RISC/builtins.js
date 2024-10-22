import { registers as r , floatRegisters as f} from "../RISC/constantes.js"
import { Generador } from "../RISC/generador.js"

/**
 * @param {Generador} code
 */

export const comparacionString = (code) => {
  // A0 -> dirección en heap de la primera cadena
    // A1 -> dirección en heap de la segunda cadena
    code.comment('# Inicio de la comparación de cadenas')
    const end1 = code.getLabel()
    const verdadero = code.getLabel()
    const loop1 = code.getLabel()
    //inicio del ciclo
    code.addLabel(loop1)
    //Cargar byte en t1 y t2
    code.lb(r.T1, r.A0)
    code.lb(r.T2, r.A1)
    //Verificar que sean iguales
    code.beq(r.T2,r.T1,verdadero)
    //Si no es verdadero entonces r.t0 es 1
	code.li(r.T0,1)
	code.j(end1)
    //Si es verdadero entonces que mire si son nulos para finalizar el ciclo
    code.addLabel(verdadero)
    code.beq(r.T1,r.ZERO,end1)
    code.j(loop1)

    //Ahora la parte final 
    code.addLabel(end1)
    code.li(r.T0, 0) 
}





export const concatString = (code) => {
    // A0 -> dirección en heap de la primera cadena
    // A1 -> dirección en heap de la segunda cadena
    // result -> push en el stack la dirección en heap de la cadena concatenada

    code.comment('#Guardando en el stack la dirección en heap de la cadena concatenada')
    code.push(r.HP);

    code.comment('# Copiando la 1er cadena en el heap')
    const end1 = code.getLabel()
    const loop1 = code.addLabel()

    code.lb(r.T1, r.A0)
    code.beq(r.T1, r.ZERO, end1)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A0, r.A0, 1)
    code.j(loop1)
    code.addLabel(end1)

    code.comment('# Copiando la 2da cadena en el heap')
    const end2 = code.getLabel()
    const loop2 = code.addLabel()

    code.lb(r.T1, r.A1)
    code.beq(r.T1, r.ZERO, end2)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A1, r.A1, 1)
    code.j(loop2)
    code.addLabel(end2)

    code.comment('# Agregando el caracter nulo al final')
    code.sb(r.ZERO, r.HP)
    code.addi(r.HP, r.HP, 1)
}
export const menorque = (code) => {
    const verdadero = code.getLabel();
    const final = code.getLabel();
    //operador y comparacoio
    code.flts(r.T0, f.FT1, f.FT0); // Comparar si FT0 < FT1
    code.bne(r.T0, r.ZERO, verdadero); // Si es verdadero, saltar
    //Ahora la parte falsa retorna 0 y brinca al final       
    code.li(r.T0, 0);
    code.push(r.T0);
    code.j(final);

    //Ahora la parte verdadera retorna 1
    code.addLabel(verdadero);
    code.li(r.T0, 1);
    code.push(r.T0)

    //Etiqueta final y pushOBJETO BOOLEANO
    code.addLabel(final);
}
export const printch = (code) => {
    const l1 = code.getLabel()
        
 
    code.li(r.A1,196)
    code.beq(r.A0,r.A1,l1) //==

    //Falsa
    code.li(r.A7, 11)
    code.ecall()

    code.ret()
    //Verdadera
    code.addLabel(l1)
    code.la(r.A1, 'null')
    code.li(r.A0,  1)
    code.li(r.A2, 5)
    code.li(r.A7, 64)
    code.ecall()
}
export const printFloat = (code) => {
    const l1 = code.getLabel()

    code.fcvtws(r.A3,f.FA0)
    code.li(r.A1,1234567936)
    code.beq(r.A3,r.A1,l1) //==

    //Falsa
    code.li(r.A7, 2)
    code.ecall()


    code.ret()
    //Verdadera
    code.addLabel(l1)
    code.la(r.A1, 'null')
    code.li(r.A0,  1)
    code.li(r.A2, 5)
    code.li(r.A7, 64)
    code.ecall()

}


export const printint = (code) => {
    const l1 = code.getLabel()


    code.li(r.A1,1234567890)
    code.beq(r.A0,r.A1,l1) //==

    //Falsa
    code.li(r.A7, 1)
    code.ecall()


    code.ret()
    //Verdadera
    code.addLabel(l1)
    code.la(r.A1, 'null')
    code.li(r.A0,  1)
    code.li(r.A2, 5)
    code.li(r.A7, 64)
    code.ecall()

}


export const mayorque = (code) => {
    const verdadero = code.getLabel();
    const final = code.getLabel();
    //operador y comparacoio
    code.flts(r.T0, f.FT0, f.FT1); // Comparar si FT1 < FT0
    code.bne(r.T0, r.ZERO, verdadero); // Si es verdadero, saltar
    //Ahora la parte falsa retorna 0 y brinca al final       
    code.li(r.T0, 0);
    code.push(r.T0);
    code.j(final);

    //Ahora la parte verdadera retorna 1
    code.addLabel(verdadero);
    code.li(r.T0, 1);
    code.push(r.T0)

    //Etiqueta final y pushOBJETO BOOLEANO
    code.addLabel(final);
}
export const menorIgual = (code) => {
    const verdadero = code.getLabel();
    const final = code.getLabel();
    //operador y comparacoio
    code.fles(r.T0, f.FT1, f.FT0); // Comparar si FT1 <= FT0
    code.bne(r.T0, r.ZERO, verdadero); // Si es verdadero, saltar
    //Ahora la parte falsa retorna 0 y brinca al final       
    code.li(r.T0, 0);
    code.push(r.T0);
    code.j(final);

    //Ahora la parte verdadera retorna 1
    code.addLabel(verdadero);
    code.li(r.T0, 1);
    code.push(r.T0)

    //Etiqueta final y pushOBJETO BOOLEANO
    code.addLabel(final);
}

export const mayorIgual = (code) => {
    const verdadero = code.getLabel();
    const final = code.getLabel();
    //operador y comparacoio
    code.fles(r.T0, f.FT0, f.FT1); // Comparar si FT0 <= FT1
    code.bne(r.T0, r.ZERO, verdadero); // Si es verdadero, saltar
    //Ahora la parte falsa retorna 0 y brinca al final       
    code.li(r.T0, 0);
    code.push(r.T0);
    code.j(final);

    //Ahora la parte verdadera retorna 1
    code.addLabel(verdadero);
    code.li(r.T0, 1);
    code.push(r.T0)

    //Etiqueta final y pushOBJETO BOOLEANO
    code.addLabel(final);
}
export const builtins = {
    concatString: concatString,
    comparacionString: comparacionString,
    menorque: menorque,
    mayorque: mayorque,
    menorIgual: menorIgual,
    mayorIgual: mayorIgual,
    printch: printch,
    printint: printint,
    printFloat: printFloat,

}