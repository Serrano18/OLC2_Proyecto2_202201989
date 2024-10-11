
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expresion  {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {
        
        
        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    
export class Comentarios extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.comentario Comentario del nodo
    */
    constructor({ comentario }) {
        super();
        
        /**
         * Comentario del nodo
         * @type {string}
        */
        this.comentario = comentario;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitComentarios(this);
    }
}
    
export class DeclaracionStruct extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Valor del primitivo
 * @param {Expresion[]} options.vars Tipo del primitivo
    */
    constructor({ id, vars }) {
        super();
        
        /**
         * Valor del primitivo
         * @type {string}
        */
        this.id = id;


        /**
         * Tipo del primitivo
         * @type {Expresion[]}
        */
        this.vars = vars;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionStruct(this);
    }
}
    
export class Break extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor({  }) {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBreak(this);
    }
}
    
export class Continue extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor({  }) {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitContinue(this);
    }
}
    
export class Return extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion|undefined} options.exp Expresion a retornar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a retornar
         * @type {Expresion|undefined}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReturn(this);
    }
}
    
export class Primitivo extends Expresion {

    /**
    * @param {Object} options
    * @param {any} options.valor Valor del primitivo
 * @param {string} options.tipo Tipo del primitivo
    */
    constructor({ valor, tipo }) {
        super();
        
        /**
         * Valor del primitivo
         * @type {any}
        */
        this.valor = valor;


        /**
         * Tipo del primitivo
         * @type {string}
        */
        this.tipo = tipo;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrimitivo(this);
    }
}
    
export class OperacionLogica extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionLogica(this);
    }
}
    
export class Ternario extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.condicion Condicion del operador ternario
 * @param {Expresion} options.verdadero Expresion si la condicion es verdadera
 * @param {Expresion} options.falso Expresion si la condicion es falsa
    */
    constructor({ condicion, verdadero, falso }) {
        super();
        
        /**
         * Condicion del operador ternario
         * @type {Expresion}
        */
        this.condicion = condicion;


        /**
         * Expresion si la condicion es verdadera
         * @type {Expresion}
        */
        this.verdadero = verdadero;


        /**
         * Expresion si la condicion es falsa
         * @type {Expresion}
        */
        this.falso = falso;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTernario(this);
    }
}
    
export class OperacionAritmetica extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionAritmetica(this);
    }
}
    
export class OperacionRelacional extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionRelacional(this);
    }
}
    
export class OperacionIgualdades extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionIgualdades(this);
    }
}
    
export class OperacionUnaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ exp, op }) {
        super();
        
        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionUnaria(this);
    }
}
    
export class Instancia extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Tipo de la funcion
 * @param {Expresion[]} options.args Nombre de la funcion
    */
    constructor({ id, args }) {
        super();
        
        /**
         * Tipo de la funcion
         * @type {string}
        */
        this.id = id;


        /**
         * Nombre de la funcion
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitInstancia(this);
    }
}
    
export class DeclaFuncion extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la funcion
 * @param {string} options.id Nombre de la funcion
 * @param {Object[]} options.params Parametros de la funcion
 * @param {Expresion[]} options.bloque Cuerpo de la función
    */
    constructor({ tipo, id, params, bloque }) {
        super();
        
        /**
         * Tipo de la funcion
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Nombre de la funcion
         * @type {string}
        */
        this.id = id;


        /**
         * Parametros de la funcion
         * @type {Object[]}
        */
        this.params = params;


        /**
         * Cuerpo de la función
         * @type {Expresion[]}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaFuncion(this);
    }
}
    
export class Llamada extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.callee Expresion a llamar
 * @param {Expresion[]} options.args Argumentos de la llamada
    */
    constructor({ callee, args }) {
        super();
        
        /**
         * Expresion a llamar
         * @type {Expresion}
        */
        this.callee = callee;


        /**
         * Argumentos de la llamada
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLlamada(this);
    }
}
    
export class Get extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.objetivo Objeto de la propiedad
 * @param {string} options.propiedad Identificador de la propiedad
    */
    constructor({ objetivo, propiedad }) {
        super();
        
        /**
         * Objeto de la propiedad
         * @type {Expresion}
        */
        this.objetivo = objetivo;


        /**
         * Identificador de la propiedad
         * @type {string}
        */
        this.propiedad = propiedad;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitGet(this);
    }
}
    
export class Set extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.objetivo Objeto de la propiedad
 * @param {string} options.propiedad Identificador de la propiedad
 * @param {Expresion} options.valor Valor de la propiedad
 * @param {string} options.op Operador de la asignacion
    */
    constructor({ objetivo, propiedad, valor, op }) {
        super();
        
        /**
         * Objeto de la propiedad
         * @type {Expresion}
        */
        this.objetivo = objetivo;


        /**
         * Identificador de la propiedad
         * @type {string}
        */
        this.propiedad = propiedad;


        /**
         * Valor de la propiedad
         * @type {Expresion}
        */
        this.valor = valor;


        /**
         * Operador de la asignacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSet(this);
    }
}
    
export class Array extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo tipo de array
 * @param {Expresion[]} options.t Tamaño del array
 * @param {Expresion[]} options.args Expresion a evaluar
    */
    constructor({ tipo, t, args }) {
        super();
        
        /**
         * tipo de array
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Tamaño del array
         * @type {Expresion[]}
        */
        this.t = t;


        /**
         * Expresion a evaluar
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitArray(this);
    }
}
    
export class Bloque extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.ins Sentencias del bloque
    */
    constructor({ ins }) {
        super();
        
        /**
         * Sentencias del bloque
         * @type {Expresion[]}
        */
        this.ins = ins;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBloque(this);
    }
}
    
export class ExpresionStmt extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresionStmt(this);
    }
}
    
export class If extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del if
 * @param {Expresion[]} options.stmtTrue Cuerpo del if
 * @param {Expresion[]|undefined} options.stmtFalse Cuerpo del else
    */
    constructor({ cond, stmtTrue, stmtFalse }) {
        super();
        
        /**
         * Condicion del if
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del if
         * @type {Expresion[]}
        */
        this.stmtTrue = stmtTrue;


        /**
         * Cuerpo del else
         * @type {Expresion[]|undefined}
        */
        this.stmtFalse = stmtFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIf(this);
    }
}
    
export class While extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del while
 * @param {Expresion[]} options.stmt Cuerpo del while
    */
    constructor({ cond, stmt }) {
        super();
        
        /**
         * Condicion del while
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del while
         * @type {Expresion[]}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}
    
export class For extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.init Inicializacion del for
 * @param {Expresion} options.cond Condicion del for
 * @param {Expresion} options.inc Incremento del for
 * @param {Expresion[]} options.stmt Cuerpo del for
    */
    constructor({ init, cond, inc, stmt }) {
        super();
        
        /**
         * Inicializacion del for
         * @type {Expresion}
        */
        this.init = init;


        /**
         * Condicion del for
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Incremento del for
         * @type {Expresion}
        */
        this.inc = inc;


        /**
         * Cuerpo del for
         * @type {Expresion[]}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFor(this);
    }
}
    
export class Case extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Expresion izquierda de la operacion
 * @param {Expresion|null} options.exp Expresion a comparar del case
 * @param {Expresion[]} options.stmt Instrucciones dentro del case
    */
    constructor({ tipo, exp, stmt }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Expresion a comparar del case
         * @type {Expresion|null}
        */
        this.exp = exp;


        /**
         * Instrucciones dentro del case
         * @type {Expresion[]}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitCase(this);
    }
}
    
export class Switch extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Expresion izquierda de la operacion
 * @param {Case[]} options.cases Expresion derecha de la operacion
 * @param {Case} options.def Operador de la operacion
    */
    constructor({ cond, cases, def }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Expresion derecha de la operacion
         * @type {Case[]}
        */
        this.cases = cases;


        /**
         * Operador de la operacion
         * @type {Case}
        */
        this.def = def;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSwitch(this);
    }
}
    
export class Asignacionvar extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.valor Expresion izquierda de la operacion
 * @param {string} options.id Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ valor, id, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.valor = valor;


        /**
         * Expresion derecha de la operacion
         * @type {string}
        */
        this.id = id;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacionvar(this);
    }
}
    
export class Negacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ exp, op }) {
        super();
        
        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNegacion(this);
    }
}
    
export class Agrupacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion agrupada
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAgrupacion(this);
    }
}
    
export class Numero extends Expresion {

    /**
    * @param {Object} options
    * @param {number} options.valor Valor del numero
    */
    constructor({ valor }) {
        super();
        
        /**
         * Valor del numero
         * @type {number}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNumero(this);
    }
}
    
export class DeclaracionVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.exp Expresion de la variable
 * @param {string} options.tipo Tipo de la variable
    */
    constructor({ id, exp, tipo }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVariable(this);
    }
}
    
export class ReferenciaVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaVariable(this);
    }
}
    
export class Print extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a imprimir
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a imprimir
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}
    
export class Foreach extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.va Declaracion de la variable
 * @param {Expresion} options.arr Arreglo a recorrer
 * @param {Expresion[]} options.bloque Tipo de la variable
    */
    constructor({ va, arr, bloque }) {
        super();
        
        /**
         * Declaracion de la variable
         * @type {Expresion}
        */
        this.va = va;


        /**
         * Arreglo a recorrer
         * @type {Expresion}
        */
        this.arr = arr;


        /**
         * Tipo de la variable
         * @type {Expresion[]}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitForeach(this);
    }
}
    
export class TypeOf extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTypeOf(this);
    }
}
    
export class Sprint extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.args Expresion a evaluar
    */
    constructor({ args }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSprint(this);
    }
}
    
export default { Expresion, Comentarios, DeclaracionStruct, Break, Continue, Return, Primitivo, OperacionLogica, Ternario, OperacionAritmetica, OperacionRelacional, OperacionIgualdades, OperacionUnaria, Instancia, DeclaFuncion, Llamada, Get, Set, Array, Bloque, ExpresionStmt, If, While, For, Case, Switch, Asignacionvar, Negacion, Agrupacion, Numero, DeclaracionVariable, ReferenciaVariable, Print, Foreach, TypeOf, Sprint }
