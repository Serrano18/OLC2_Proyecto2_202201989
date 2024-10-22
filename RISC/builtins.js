import { registers as r , floatRegisters as f} from "../RISC/constantes.js"
import { Generador } from "../RISC/generador.js"

/**
 * @param {Generador} code
 */

export const comparacionString = (code) => {

    code.comment('# Inicio comparación de cadenas');
    
    // No necesitamos hacer add aquí porque ya recibimos las direcciones en A0 y A1
    
    const endLabel = code.getLabel();
    const equalLabel = code.getLabel();
    const notEqualLabel = code.getLabel();
    const loopLabel = code.getLabel();
    code.addLabel(loopLabel);
    // Cargar bytes de ambas cadenas
    code.lb(r.T1, r.A0);
    code.lb(r.T2, r.A1);
    // Si son diferentes, no son iguales
    code.bne(r.T1, r.T2, notEqualLabel);
        
    // Si ambos son cero, son iguales
    code.beq(r.T1, r.ZERO, equalLabel);
    
    // Avanzar al siguiente carácter
    code.addi(r.A0, r.A0, 1);
    code.addi(r.A1, r.A1, 1);
    code.j(loopLabel);

    // Las cadenas son iguales
    code.addLabel(equalLabel);
    code.li(r.T0, 1);  // 1 significa iguales
    code.j(endLabel);

      // Las cadenas son diferentes
      code.addLabel(notEqualLabel);
      code.li(r.T0, 0);  // 0 significa diferentes
      
     code.addLabel(endLabel);
  // A0 -> dirección en heap de la primera cadena
    // A1 -> dirección en heap de la segunda cadena
    /*code.comment('# Inicio de la comparación de cadenas')
    const end1 = code.getLabel()
    const verdadero = code.getLabel()
    const loop1 = code.getLabel()
    
    //inicio del ciclo
    code.addLabel(loop1)
    //Cargar byte en t1 y t2
    code.lb(r.T1, r.A0)
    code.lb(r.T2, r.A1)
    //Verificar que sean iguales
    code.beq(r.T1,r.T2,verdadero)
    //Si no es verdadero entonces r.t0 es 1
	code.li(r.T0,1)
	code.j(end1)
    //Si es verdadero entonces que mire si son nulos para finalizar el ciclo
    code.addLabel(verdadero)
    code.beq(r.T1,r.ZERO,end1)
    code.j(loop1)

    //Ahora la parte final 
    code.addLabel(end1)
    code.li(r.T0, 0) */
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
    code.li(r.A2, 4)
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
    code.li(r.A2, 4)
    code.li(r.A7, 64)
    code.ecall()

}
export const printbool = (code) => {
    const l1 = code.getLabel()
    const l3 = code.getLabel()

    code.beqz(r.A0,l1) //==
    code.la(r.A1, 'true')
    code.j(l3)


    //Verdadera
    code.addLabel(l1)
    code.la(r.A1, 'false')

    code.addLabel(l3)
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
    code.li(r.A2, 4)
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



export const toLowerCase = (code) => {
    // A0 -> dirección en heap de la primera cadena
    // result -> push en el stack la dirección en heap de la cadena convertida a minúsculas
    code.comment('#Inicio ToLowerCase')
    code.push(r.HP);

    const end = code.getLabel()
    const loop = code.getLabel()
    const noConvert = code.getLabel()
    const convert = code.getLabel()
    const nextChar = code.getLabel()

    code.addLabel(loop)

    code.lb(r.T1, r.T0)
    code.beq(r.T1, r.ZERO, end)

    // Caracteres ascii de A-Z
    code.li(r.T2, 65)
    code.li(r.T3, 90)

    // Menor que ascii de A tons no se convierte
    code.blt(r.T1, r.T2, noConvert)
    // Mayor que ascii de Z tonns no se convierte
    code.bgt(r.T1, r.T3, noConvert)


    code.j(convert)

    // copiar el caracter tal cual esta en minuscula
    code.addLabel(noConvert)
    code.sb(r.T1, r.HP)
    // Pasamos al siguiente caracter
    code.addLabel(nextChar)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.T0, r.T0, 1)
    code.j(loop)

    // convertir el caracter a minúscula
    code.addLabel(convert)
    code.addi(r.T1, r.T1, 32)
    code.sb(r.T1, r.HP)

    code.j(nextChar)
    code.addLabel(end)
    code.sb(r.ZERO, r.HP)
    code.addi(r.HP, r.HP, 1)

    code.comment('#Fin ToLowerCase')
    
}

export const toUpperCase = (code) => {
    //solo para strings

    code.comment('#Inicio ToUpperCase')
    code.push(r.HP);

    const end = code.getLabel()
    const loop = code.getLabel()
    const noConvert = code.getLabel()
    const convert = code.getLabel()
    const nextChar = code.getLabel()

    code.addLabel(loop)

    code.lb(r.T1, r.T0)
    code.beq(r.T1, r.ZERO, end)

    // Caracteres ascii de a-z
    code.li(r.T2, 97)
    code.li(r.T3, 122)

    // Menor que ascii de  A tons no se convierte
    code.blt(r.T1, r.T2, noConvert)
    // Mayor que ascii de Z tons no se convierte
    code.bgt(r.T1, r.T3, noConvert)

    //casos falsos
    code.j(convert)

    // copiar el caracter tal cual pq esta en mayuscula
    code.addLabel(noConvert)
    code.sb(r.T1, r.HP)

    //siguiente caracter
    code.addLabel(nextChar)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.T0, r.T0, 1)
    code.j(loop)

    //convertir el caracter a mayúscula esta en minuscula
    code.addLabel(convert)
    code.addi(r.T1, r.T1, -32)
    code.sb(r.T1, r.HP)

    code.j(nextChar)
    code.addLabel(end)
    code.sb(r.ZERO, r.HP)
    code.addi(r.HP, r.HP, 1)

    code.comment('#Fin ToUpperCase')
}

export const parseInt = (code) => {
    code.comment('# Inicio parseInt')
    const inicio = code.getLabel()//l0
    const fin = code.getLabel()//l1

    code.add(r.A0,r.ZERO,r.T0)
    code.li(r.T0,0)
    code.li(r.T1,0)
    code.li(r.T2,46)
    code.li(r.T3,10)

    code.addLabel(inicio)
    code.lb(r.T1, r.A0)
    code.beq(r.T1, r.ZERO, fin)
    code.beq(r.T1, r.T2, fin)
    code.addi(r.T1, r.T1, -48)

    code.mul(r.T0, r.T0, r.T3);
    code.add(r.T0, r.T0, r.T1)
    code.addi(r.A0, r.A0, 1);
    code.j(inicio)

    code.addLabel(fin)
    code.push(r.T0)
    code.comment('# Fin parseInt')
}

export const parsefloat = (code) => {

    code.comment(`#Inicio parseFloat"`);

    const inicio = code.getLabel();
    const fin = code.getLabel();
    const l1 = code.getLabel();
    
    code.add(r.A0, r.ZERO, r.T0);
    code.li(r.T0, 0);
    code.li(r.T1, 0);
    code.li(r.T2, 46);
    code.li(r.T3, 10);
    code.li(r.T4, 1);
    code.fcvtsw(f.FT0, r.T0);
    code.fcvtsw(f.FT2, r.T4);
    code.fcvtsw(f.FT3, r.T3);

    code.addLabel(inicio);
    code.lb(r.T1, r.A0);
    code.addi(r.A0, r.A0, 1);
    code.beq(r.T1, r.ZERO, fin);
    code.beq(r.T1, r.T2, l1);
    code.addi(r.T1, r.T1, -48);

    code.fcvtsw(f.FT1, r.T1);
    code.fmul(f.FT0, f.FT0, f.FT3);
    code.fadd(f.FT0, f.FT0, f.FT1);
    code.j(inicio);

    code.addLabel(l1);
    code.lb(r.T1, r.A0);
    code.addi(r.A0, r.A0, 1);
    code.beq(r.T1, r.ZERO, fin);
    code.addi(r.T1, r.T1, -48);
    
    code.fcvtsw(f.FT1, r.T1);
    code.fmul(f.FT2, f.FT2, f.FT3);
    code.fdiv(f.FT1, f.FT1, f.FT2);
    code.fadd(f.FT0, f.FT0, f.FT1);
    code.j(l1);
    
    code.addLabel(fin)
    
    code.pushFloat(f.FT0)

    code.comment(`#Fin parseFloat`)


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
    printbool: printbool,
    toLowerCase: toLowerCase,
    toUpperCase: toUpperCase,
    parseInt: parseInt,
    parsefloat: parsefloat,

}