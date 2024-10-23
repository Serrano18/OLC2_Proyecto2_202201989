
import {BaseVisitor} from "./visitor.js"

export class FrameVisitor extends BaseVisitor {

    constructor(baseOffset) {
        super();
        this.frame = [];
        this.localSize = 0;
        this.baseOffset = baseOffset;
    }
   /**
     * 
     * @type {BaseVisitor['visitDeclaracionVariable']}
     */
   visitDeclaracionVariable(node) {
        this.frame.push({
            id: node.id,
            offset: this.baseOffset + this.localSize,
        });
        this.localSize += 1;
    }
      /**
     * 
     * @type {BaseVisitor['visitBloque']}
     */
      visitBloque(node) {
        node.ins.forEach(dcl => dcl.accept(this));
    }

    /**
     * 
     * @type {BaseVisitor['visitIf']}
     */
    visitIf(node) {
        node.stmtTrue.accept(this);
        if (node.stmtFalse) node.stmtFalse.accept(this);
    }
    /**
     * 
     * @type {BaseVisitor['visitWhile']}
     */
    visitWhile(node) {
        node.stmt.accept(this);
    }

    /**
     * 
     * @type {BaseVisitor['visitFor']}
     */
    visitFor(node) {
        node.stmt.accept(this);
    }
    /*
    * @type {BaseVisitor['visitcase']}
    */
   visitCase(node){
    node.stmt.accept(this);
     }
    /**
      * 
      * @type {BaseVisitor['visitSwitch']}
      */
     visitSwitch(node) {
        node.cases.forEach(caso => caso.accept(this));
     }
     
    visitBreak(node){}
    visitContinue(node){}
    visitReturn(node){}
    visitLlamada(node){}
    visitDeclaFuncion(node){}
    visitInstancia(node){}
    visitAsignacion(node){}
    visitExpresion(node){}
    visitComentarios(node){}
    visitPrimitivo(node){}
    visitExpresionStmt(node){}
     visitSprint(node){}
     visitPrint(node){}
     visitAgrupacion(node){}
    visitOperacionAritmetica(node){}
    visitOperacionLogica(node){}
    visitOperacionRelacional(node){}
    visitOperacionIgualdades(node){}
    visitOperacionUnaria(node){}
    visitGet(node){}
    visitSet(node){}
    visitArray(node){}
    visitAsignacionvar(node){}
    visitNegacion(node){}
    visitReferenciaVariable(node){}
    visitTypeOf(node){}
    visitComentarios(node){}
    visitArray(node){}
}