
/**

 * @typedef {import('./nodos').Expresion} Expresion


 * @typedef {import('./nodos').Comentarios} Comentarios


 * @typedef {import('./nodos').DeclaracionStruct} DeclaracionStruct


 * @typedef {import('./nodos').Break} Break


 * @typedef {import('./nodos').Continue} Continue


 * @typedef {import('./nodos').Return} Return


 * @typedef {import('./nodos').Primitivo} Primitivo


 * @typedef {import('./nodos').OperacionLogica} OperacionLogica


 * @typedef {import('./nodos').Ternario} Ternario


 * @typedef {import('./nodos').OperacionAritmetica} OperacionAritmetica


 * @typedef {import('./nodos').OperacionRelacional} OperacionRelacional


 * @typedef {import('./nodos').OperacionIgualdades} OperacionIgualdades


 * @typedef {import('./nodos').OperacionUnaria} OperacionUnaria


 * @typedef {import('./nodos').Instancia} Instancia


 * @typedef {import('./nodos').DeclaFuncion} DeclaFuncion


 * @typedef {import('./nodos').Llamada} Llamada


 * @typedef {import('./nodos').Get} Get


 * @typedef {import('./nodos').Set} Set


 * @typedef {import('./nodos').Array} Array


 * @typedef {import('./nodos').Bloque} Bloque


 * @typedef {import('./nodos').ExpresionStmt} ExpresionStmt


 * @typedef {import('./nodos').If} If


 * @typedef {import('./nodos').While} While


 * @typedef {import('./nodos').For} For


 * @typedef {import('./nodos').Case} Case


 * @typedef {import('./nodos').Switch} Switch


 * @typedef {import('./nodos').Asignacionvar} Asignacionvar


 * @typedef {import('./nodos').Negacion} Negacion


 * @typedef {import('./nodos').Agrupacion} Agrupacion


 * @typedef {import('./nodos').Numero} Numero


 * @typedef {import('./nodos').DeclaracionVariable} DeclaracionVariable


 * @typedef {import('./nodos').ReferenciaVariable} ReferenciaVariable


 * @typedef {import('./nodos').Print} Print


 * @typedef {import('./nodos').Foreach} Foreach


 * @typedef {import('./nodos').TypeOf} TypeOf


 * @typedef {import('./nodos').Sprint} Sprint

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {Expresion} node
     * @returns {any}
     */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }
    

    /**
     * @param {Comentarios} node
     * @returns {any}
     */
    visitComentarios(node) {
        throw new Error('Metodo visitComentarios no implementado');
    }
    

    /**
     * @param {DeclaracionStruct} node
     * @returns {any}
     */
    visitDeclaracionStruct(node) {
        throw new Error('Metodo visitDeclaracionStruct no implementado');
    }
    

    /**
     * @param {Break} node
     * @returns {any}
     */
    visitBreak(node) {
        throw new Error('Metodo visitBreak no implementado');
    }
    

    /**
     * @param {Continue} node
     * @returns {any}
     */
    visitContinue(node) {
        throw new Error('Metodo visitContinue no implementado');
    }
    

    /**
     * @param {Return} node
     * @returns {any}
     */
    visitReturn(node) {
        throw new Error('Metodo visitReturn no implementado');
    }
    

    /**
     * @param {Primitivo} node
     * @returns {any}
     */
    visitPrimitivo(node) {
        throw new Error('Metodo visitPrimitivo no implementado');
    }
    

    /**
     * @param {OperacionLogica} node
     * @returns {any}
     */
    visitOperacionLogica(node) {
        throw new Error('Metodo visitOperacionLogica no implementado');
    }
    

    /**
     * @param {Ternario} node
     * @returns {any}
     */
    visitTernario(node) {
        throw new Error('Metodo visitTernario no implementado');
    }
    

    /**
     * @param {OperacionAritmetica} node
     * @returns {any}
     */
    visitOperacionAritmetica(node) {
        throw new Error('Metodo visitOperacionAritmetica no implementado');
    }
    

    /**
     * @param {OperacionRelacional} node
     * @returns {any}
     */
    visitOperacionRelacional(node) {
        throw new Error('Metodo visitOperacionRelacional no implementado');
    }
    

    /**
     * @param {OperacionIgualdades} node
     * @returns {any}
     */
    visitOperacionIgualdades(node) {
        throw new Error('Metodo visitOperacionIgualdades no implementado');
    }
    

    /**
     * @param {OperacionUnaria} node
     * @returns {any}
     */
    visitOperacionUnaria(node) {
        throw new Error('Metodo visitOperacionUnaria no implementado');
    }
    

    /**
     * @param {Instancia} node
     * @returns {any}
     */
    visitInstancia(node) {
        throw new Error('Metodo visitInstancia no implementado');
    }
    

    /**
     * @param {DeclaFuncion} node
     * @returns {any}
     */
    visitDeclaFuncion(node) {
        throw new Error('Metodo visitDeclaFuncion no implementado');
    }
    

    /**
     * @param {Llamada} node
     * @returns {any}
     */
    visitLlamada(node) {
        throw new Error('Metodo visitLlamada no implementado');
    }
    

    /**
     * @param {Get} node
     * @returns {any}
     */
    visitGet(node) {
        throw new Error('Metodo visitGet no implementado');
    }
    

    /**
     * @param {Set} node
     * @returns {any}
     */
    visitSet(node) {
        throw new Error('Metodo visitSet no implementado');
    }
    

    /**
     * @param {Array} node
     * @returns {any}
     */
    visitArray(node) {
        throw new Error('Metodo visitArray no implementado');
    }
    

    /**
     * @param {Bloque} node
     * @returns {any}
     */
    visitBloque(node) {
        throw new Error('Metodo visitBloque no implementado');
    }
    

    /**
     * @param {ExpresionStmt} node
     * @returns {any}
     */
    visitExpresionStmt(node) {
        throw new Error('Metodo visitExpresionStmt no implementado');
    }
    

    /**
     * @param {If} node
     * @returns {any}
     */
    visitIf(node) {
        throw new Error('Metodo visitIf no implementado');
    }
    

    /**
     * @param {While} node
     * @returns {any}
     */
    visitWhile(node) {
        throw new Error('Metodo visitWhile no implementado');
    }
    

    /**
     * @param {For} node
     * @returns {any}
     */
    visitFor(node) {
        throw new Error('Metodo visitFor no implementado');
    }
    

    /**
     * @param {Case} node
     * @returns {any}
     */
    visitCase(node) {
        throw new Error('Metodo visitCase no implementado');
    }
    

    /**
     * @param {Switch} node
     * @returns {any}
     */
    visitSwitch(node) {
        throw new Error('Metodo visitSwitch no implementado');
    }
    

    /**
     * @param {Asignacionvar} node
     * @returns {any}
     */
    visitAsignacionvar(node) {
        throw new Error('Metodo visitAsignacionvar no implementado');
    }
    

    /**
     * @param {Negacion} node
     * @returns {any}
     */
    visitNegacion(node) {
        throw new Error('Metodo visitNegacion no implementado');
    }
    

    /**
     * @param {Agrupacion} node
     * @returns {any}
     */
    visitAgrupacion(node) {
        throw new Error('Metodo visitAgrupacion no implementado');
    }
    

    /**
     * @param {Numero} node
     * @returns {any}
     */
    visitNumero(node) {
        throw new Error('Metodo visitNumero no implementado');
    }
    

    /**
     * @param {DeclaracionVariable} node
     * @returns {any}
     */
    visitDeclaracionVariable(node) {
        throw new Error('Metodo visitDeclaracionVariable no implementado');
    }
    

    /**
     * @param {ReferenciaVariable} node
     * @returns {any}
     */
    visitReferenciaVariable(node) {
        throw new Error('Metodo visitReferenciaVariable no implementado');
    }
    

    /**
     * @param {Print} node
     * @returns {any}
     */
    visitPrint(node) {
        throw new Error('Metodo visitPrint no implementado');
    }
    

    /**
     * @param {Foreach} node
     * @returns {any}
     */
    visitForeach(node) {
        throw new Error('Metodo visitForeach no implementado');
    }
    

    /**
     * @param {TypeOf} node
     * @returns {any}
     */
    visitTypeOf(node) {
        throw new Error('Metodo visitTypeOf no implementado');
    }
    

    /**
     * @param {Sprint} node
     * @returns {any}
     */
    visitSprint(node) {
        throw new Error('Metodo visitSprint no implementado');
    }
    
}
