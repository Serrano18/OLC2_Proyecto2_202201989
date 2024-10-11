import { registers as r } from "../RISC/constantes.js";
import { Generador } from "../RISC/generador.js";
import { BaseVisitor } from "../Compilador/visitor.js";
import nodos, {OperacionIgualdades } from "../Compilador/nodos.js";


export class CompilerVisitor extends BaseVisitor {

    constructor() {
        super();
        this.code = new Generador();
    }

    /**
     * @type {BaseVisitor['visitExpresionStmt']}
     */
    visitExpresionStmt(node) {
        node.exp.accept(this);
        this.code.popObject(r.T0);
    }

    /**
     * @type {BaseVisitor['visitPrimitivo']}
     */
    visitPrimitivo(node) {
        //this.code.comment(`Primitivo: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        //this.code.comment(`Fin Primitivo: ${node.valor}`);
    }
    

    /**
     * 
     * @type {BaseVisitor['visitNegacion']}
     */

    visitNegacion(node){
        node.exp.accept(this);
        this.code.popObject(r.T1);
        this.code.seqz(r.T0,r.T1)  // t0 = !(t1)
        this.code.push(r.T0);
        this.code.pushObject({type:'boolean',length:4});
    }
    
    /**
     * @type {BaseVisitor['visitOperacionIgualdades']}
     * 
     */
    visitOperacionIgualdades(node) {
        this.code.comment(`#Operacion Igualdad: ${node.op}`);
        node.izq.accept(this);
        node.der.accept(this);
        //variables de la pila
        const der =  this.code.popObject(r.T0);
        const izq = this.code.popObject(r.T1);
        //etiquetas de saltos
        const verdadero = this.code.getLabel();
        const final = this.code.getLabel();
        if (izq.type === 'string' && der.type === 'string') {
            this.code.add(r.A0, r.ZERO, r.T1);
            this.code.add(r.A1, r.ZERO, r.T2);
            this.code.callBuiltin('comparacionString')
            const operadores = {
                '==': () => this.code.beq(r.T0,r.ZERO,verdadero),
                '!=': () => this.code.bne(r.T0,r.ZERO,verdadero)
            }
            operadores[node.op]();
        }else{
            const operadores = {
                '==': () => this.code.beq(r.T0,r.T1,verdadero),
                '!=': () => this.code.bne(r.T0,r.T1,verdadero)
            }
            operadores[node.op]();
        }
       
        //Si no se cumple Continua
        //Ahora la parte falsa retorna 0 y brinca al final
        this.code.li(r.T0, 0);  
        this.code.push(r.T0);
        this.code.j(final);
        //Ahora la parte verdadera retorna 1
        this.code.addLabel(verdadero);
        this.code.li(r.T0, 1);
        this.code.push(r.T0)
        //Etiqueta final y pushOBJETO BOOLEANO
        this.code.addLabel(final);
        this.code.pushObject({type:'boolean',length:4});

    }

    /**
     * @type {BaseVisitor['visitOperacionRelacional']}
     */
    visitOperacionRelacional(node) {
        this.code.comment(`#Operacion Relacional: ${node.op}`);
        node.izq.accept(this);
        node.der.accept(this);
        //variables de la pila
         this.code.popObject(r.T0);
         this.code.popObject(r.T1);
        //etiquetas de saltos
        const verdadero = this.code.getLabel();
        const final = this.code.getLabel();
        //Ahora los operadores y de cumplirse salta a verdadero 
        const operadores = {
            '>' : () => this.code.blt(r.T0,r.T1,verdadero),
            '>=' : () => this.code.bge(r.T1,r.T0,verdadero),
            '<' : () => this.code.blt(r.T1,r.T0,verdadero),
            '<=' : () => this.code.bge(r.T0,r.T1,verdadero)   
        }
        operadores[node.op]();
        //Si no se cumple Continua
        //Ahora la parte falsa retorna 0 y brinca al final
        this.code.li(r.T0, 0);
        this.code.push(r.T0);
        this.code.j(final);

        //Ahora la parte verdadera retorna 1
        this.code.addLabel(verdadero);
        this.code.li(r.T0, 1);
        this.code.push(r.T0)

        //Etiqueta final y pushOBJETO BOOLEANO
        this.code.addLabel(final);
        this.code.pushObject({type:'boolean',length:4});
        this.code.comment(`#Fin Operacion Relacional: ${node.op}`);
    }

     /**
     * 
     *  @type {BaseVisitor['visitOperacionLogica']} 
     */
    visitOperacionLogica(node) {
        this.code.comment(`#Operacion Logica: ${node.op}`);
        if(node.op == '&&'){
            node.izq.accept(this); // izq
            this.code.popObject(r.T0); // izq

            const labelFalse = this.code.getLabel();
            const labelEnd = this.code.getLabel();

            this.code.beq(r.T0, r.ZERO, labelFalse); // if (!izq) goto labelFalse
            node.der.accept(this); // der
            this.code.popObject(r.T0); // der
            this.code.beq(r.T0, r.ZERO, labelFalse); // if (!der) goto labelFalse

            this.code.li(r.T0, 1);
            this.code.push(r.T0);
            this.code.j(labelEnd);
            this.code.addLabel(labelFalse);
            this.code.li(r.T0, 0);
            this.code.push(r.T0);

            this.code.addLabel(labelEnd);
            this.code.pushObject({ type: 'boolean', length: 4 });
            return
        }
        
        if (node.op === '||') {
            node.izq.accept(this); // izq
            this.code.popObject(r.T0); // izq

            const labelTrue = this.code.getLabel();
            const labelEnd = this.code.getLabel();

            this.code.bne(r.T0, r.ZERO, labelTrue); // if (izq) goto labelTrue
            node.der.accept(this); // der
            this.code.popObject(r.T0); // der
            this.code.bne(r.T0, r.ZERO, labelTrue); // if (der) goto labelTrue

            this.code.li(r.T0, 0);
            this.code.push(r.T0);

            this.code.j(labelEnd);
            this.code.addLabel(labelTrue);
            this.code.li(r.T0, 1);
            this.code.push(r.T0);

            this.code.addLabel(labelEnd);
            this.code.pushObject({ type: 'boolean', length: 4 });
            return
        }
    }

    /**
     * @type {BaseVisitor['visitOperacionAritmetica']}
     */
    visitOperacionAritmetica(node) {
        //this.code.comment(`Operacion: ${node.op}`);
        node.izq.accept(this);
        node.der.accept(this);

        const der = this.code.popObject(r.T0);
        const izq = this.code.popObject(r.T1);
        if (izq.type === 'string' && der.type === 'string') {
            this.code.add(r.A0, r.ZERO, r.T1);
            this.code.add(r.A1, r.ZERO, r.T0);
            this.code.callBuiltin('concatString');
            this.code.pushObject({ type: 'string', length: 4 });
            return;
        }
        switch (node.op) {
            case '+':
                this.code.add(r.T0, r.T0, r.T1);
                this.code.push(r.T0);
                break;
            case '-':
                this.code.sub(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                break;
            case '*':
                this.code.mul(r.T0, r.T0, r.T1);
                this.code.push(r.T0);
                break;
            case '/':
                this.code.div(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                break;
            case '%':
                this.code.rem(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                break;

        }
        this.code.pushObject({ type: izq.type, length: 4 });
    }

    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        node.exp.accept(this);

        this.code.popObject(r.T0);

        switch (node.op) {
            case '-':
                this.code.li(r.T1, 0);
                this.code.sub(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                this.code.pushObject({ type: 'int', length: 4 });
                break;
        }

    }

    /**
     * @type {BaseVisitor['visitAgrupacion']}
     */
    visitAgrupacion(node) {
        return node.exp.accept(this);
    }

    visitPrint(node) {
        //this.code.comment('Print');
        node.exp.accept(this);

        const object = this.code.popObject(r.A0); 

        const tipoPrint = {
            'int': () => this.code.printInt(),
            'string': () => this.code.printString(),
            'char': () => this.code.printChar(),
            'boolean': () => this.code.printInt(),
        }

        tipoPrint[object.type]();
        this.code.li(r.A0, 10);
        this.code.li(r.A7, 11);
        this.code.ecall();
    }
   /**
     * @type {BaseVisitor['visitComentarios']}
     */
    visitComentarios(node){
        //console.log(node.comentario)
        this.code.comment(node.comentario)
    }
    /**
     * 
     * * @type {BaseVisitor['visitDeclaracionVariable']}
     */

    visitDeclaracionVariable(node){
        this.code.comment(`# Inicio Declaracion Variable: ${node.id}`); 
        node.exp.accept(this)
        
        this.code.tagObject(node.id);
        this.code.comment(`# Fin Declaracion Variable: ${node.id}`);
    }
    /**
     * 
     * * @type {BaseVisitor['visitAsignacionvar']}
     */
    visitAsignacionvar(node){
        node.valor.accept(this)
        this.code.comment(`#Inicio Asignacion Variable: ${node.id}`); 
        const valueObject = this.code.popObject(r.T0);
        const [offset, variableObject] = this.code.getObject(node.id);

        this.code.addi(r.T1, r.SP, offset);
        this.code.sw(r.T0, r.T1);
        variableObject.type = valueObject.type;
        this.code.push(r.T0);
        this.code.pushObject(valueObject);

        this.code.comment(`#Fin Asignacion Variable: ${node.id}`); 
    }
    /**
     * 
   * * @type {BaseVisitor['visitReferenciaVariable']}
     */
    
    visitReferenciaVariable(node){
        this.code.comment(`#Inicio Referencia Variable: ${node.id}`);
        const [offset, variableObject] = this.code.getObject(node.id);
        this.code.addi(r.T0, r.SP, offset);
        this.code.lw(r.T1, r.T0);
        this.code.push(r.T1);
        this.code.pushObject({ ...variableObject, id: undefined });
        this.code.comment(`#Fin Referencia Variable: ${node.id}`);
    }
        /**
     * 
   * * @type {BaseVisitor['visitBloque']}
     */

    visitBloque(node){
        this.code.comment('# Inicio de bloque');

        this.code.newScope();

        node.ins.forEach(d => d.accept(this));

        this.code.comment('# Reduciendo la pila');
        const bytesToRemove = this.code.endScope();

        if (bytesToRemove > 0) {
            this.code.addi(r.SP, r.SP, bytesToRemove);
        }

        this.code.comment('#Fin de bloque');
    }
//sentencias
    /**
     * @type {BaseVisitor['visitIf']}
     */
    visitIf(node) {
        this.code.comment('#Inicio de If');

        this.code.comment('#Condicion');
        node.cond.accept(this);
        this.code.popObject(r.T0);
        this.code.comment('#Fin de condicion');

        const hasElse = !!node.stmtFalse

        if (hasElse) {
            const elseLabel = this.code.getLabel();
            const endIfLabel = this.code.getLabel();

            this.code.beq(r.T0, r.ZERO, elseLabel);
            this.code.comment('#Rama verdadera');
            node.stmtTrue.accept(this);
            this.code.j(endIfLabel);
            this.code.addLabel(elseLabel);
            this.code.comment('#Rama falsa');
            node.stmtFalse.accept(this);
            this.code.addLabel(endIfLabel);
        } else {
            const endIfLabel = this.code.getLabel();
            this.code.beq(r.T0, r.ZERO, endIfLabel);
            this.code.comment('#Rama verdadera');
            node.stmtTrue.accept(this);
            this.code.addLabel(endIfLabel);
        }

        this.code.comment('#Fin del If');
    

    }

    /**
     * 
     * @type {BaseVisitor['visitSwitch']} 
     */

    visitSwitch(node){
        this.code.comment('# Switch Statement')
        //Etiquetas a utilizar listado de cases, de default y final
        const def = node.def ? this.code.getLabel() : null
        const fin = this.code.getLabel()
        const cases = node.cases.map(() => this.code.getLabel())
        let defa = false
        //Ahora hay que trabajar la condicion entonces hay que recorrer los casos y verificar las condicionales 
        node.cases.forEach((c, i) => {
            //Nodo para verificar la condicion 
            let condicion = new nodos.OperacionIgualdades({izq:node.cond,der:c.exp,op:"=="})
            condicion.accept(this)
            this.code.popObject(r.T0)
            //ahora si r.ZERO es 0 comparamos para ver si la condicion es correcta en r.t0
            //si es asi entonces brincamos al caso correspondiente
            this.code.bne(r.T0,r.ZERO,cases[i])
        })
        //hay que ver si existe els default7
        //La parte false
        if(def){
            defa = true
            //Si existe el default entonces brincamos a la etiqueta def
            this.code.j(def)
        }else{
            //Si no existe entonces brincamos al final
            this.code.j(fin)
        }
        
        //Situacion verdadera es decir salto a cases[i]
        for (let i = 0; i < cases.length; i++) {
            this.code.addLabel(cases[i])
            node.cases[i].accept(this)
        }
        
        if(defa){
            this.code.addLabel(def)
            node.def.accept(this)
        }
        this.code.addLabel(fin)
    }

    visitCase(node){
        this.code.comment(`#Inicio Case: ${node.exp}`)
        for(let inst of node.stmt){
            inst.accept(this);
        }
        this.code.comment(`#Fin Case: ${node.exp}`)
    }
}