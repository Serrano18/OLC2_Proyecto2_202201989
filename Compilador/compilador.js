import { registers as r } from "../RISC/constantes.js";
import { Generador } from "../RISC/generador.js";
import { BaseVisitor } from "../Compilador/visitor.js";
import nodos, { ReferenciaVariable }  from "../Compilador/nodos.js";
import { floatRegisters as f } from "../RISC/constantes.js";
import {FrameVisitor } from "../Compilador/frame.js";
export class CompilerVisitor extends BaseVisitor {

    constructor() {
        super();
        this.code = new Generador();
        //ETIQUETAS DE TRANSFERENCIA
        this.lcontinue = null
        this.lbreak = null

        this.functionMetada = {}
        this.insideFunction = false;
        this.frameDclIndex = 0;
        this.returnLabel = null;
    }

    /**
     * @type {BaseVisitor['visitExpresionStmt']}
     */
    visitExpresionStmt(node) {
        node.exp.accept(this);
        const isDerFloat = this.code.getTopObject().type === 'float';
        this.code.popObject(isDerFloat ? f.FT0 : r.T0);
    }

    /**
     * @type {BaseVisitor['visitPrimitivo']}
     */
    visitPrimitivo(node) {
        this.code.comment(`#Primitivo: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`#Fin Primitivo: ${node.valor}`);
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
        const isDerFloat = this.code.getTopObject().type === 'float';
        const der = this.code.popObject(isDerFloat ? f.FT0 : r.T0); // der
        const isIzqFloat = this.code.getTopObject().type === 'float';
        const izq = this.code.popObject(isIzqFloat ? f.FT1 : r.T1); // izq
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
        
        } else {
            
            if (!isIzqFloat) this.code.fcvtsw(f.FT1, r.T1); // Convertir izq a float si es entero
            if (!isDerFloat) this.code.fcvtsw(f.FT0, r.T0); // Convertir der a float si es entero
            
            const operadores = {
                '==': () => {
                    this.code.feq_s(r.T0, f.FT1, f.FT0);  // Comparar si FT1 == FT0 y guardar el resultado en T0
                    this.code.bne(r.T0, r.ZERO, verdadero);  // Si son iguales, ir a verdadero
                },
                '!=': () => {
                    this.code.feq_s(r.T0, f.FT1, f.FT0);  // Comparar si FT1 == FT0
                    this.code.beq(r.T0, r.ZERO, verdadero);  // Si no son iguales, ir a verdadero
                    }
                };
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
        const isDerFloat = this.code.getTopObject().type === 'float';
        this.code.popObject(isDerFloat ? f.FT0 : r.T0); // der
        const isIzqFloat = this.code.getTopObject().type === 'float';
        this.code.popObject(isIzqFloat ? f.FT1 : r.T1); // izq
         //etiquetas de saltos
         if (!isIzqFloat) this.code.fcvtsw(f.FT1, r.T1); // Convertir izq a float si es entero
         if (!isDerFloat) this.code.fcvtsw(f.FT0, r.T0); // Convertir der a float si es entero
         
        //Ahora los operadores y de cumplirse salta a verdadero 
         const operadores = {
            '>': () => {
                this.code.callBuiltin('mayorque')
            },
            '>=': () => {
                this.code.callBuiltin('mayorIgual')
            },
            '<': () => {
                this.code.callBuiltin('menorque')
            },
            '<=': () => {
                this.code.callBuiltin('menorIgual')
            }
        };
        operadores[node.op]();

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
        this.code.comment(`#Operacion: ${node.op}`);
        node.izq.accept(this);
        node.der.accept(this);

        const isDerFloat = this.code.getTopObject().type === 'float';
        const der = this.code.popObject(isDerFloat ? f.FT0 : r.T0); // der
        const isIzqFloat = this.code.getTopObject().type === 'float';
        const izq = this.code.popObject(isIzqFloat ? f.FT1 : r.T1); // izq
         if (izq.type === 'string' && der.type === 'string') {
            this.code.add(r.A0, r.ZERO, r.T1);
            this.code.add(r.A1, r.ZERO, r.T0);
            this.code.callBuiltin('concatString');
            this.code.pushObject({ type: 'string', length: 4 });
            return;
        }
        if (isIzqFloat || isDerFloat) {
            if (!isIzqFloat) this.code.fcvtsw(f.FT1, r.T1);
            if (!isDerFloat) this.code.fcvtsw(f.FT0, r.T0);

            switch (node.op) {
                case '+':
                    this.code.fadd(f.FT0, f.FT1, f.FT0);
                    break;
                case '-':
                    this.code.fsub(f.FT0, f.FT1, f.FT0);
                    break;
                case '*':
                    this.code.fmul(f.FT0, f.FT1, f.FT0);
                    break;
                case '/':
                    this.code.fdiv(f.FT0, f.FT1, f.FT0);
                    break;
            }

            this.code.pushFloat(f.FT0);
            this.code.pushObject({ type: 'float', length: 4 });
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
                //etiqueta
                const verdadero = this.code.getLabel();
                const fin = this.code.getLabel();
                //condicion de que sea 0
                this.code.beq(r.T0, r.ZERO, verdadero);
                //parte falsa
                this.code.div(r.T0, r.T1, r.T0);
                this.code.j(fin);
                //parte verdadera
                this.code.addLabel(verdadero);
                this.code.li(r.T0, 1234567890);
                
                this.code.addLabel(fin);

                this.code.push(r.T0);
                break;
            case '%':
                this.code.rem(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                break;

        }
        this.code.pushObject({ type: izq.type, length: 4 });
        this.code.comment(`#Fin Operacion: ${node.op}`);
    }

    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        node.exp.accept(this);
        const isDerFloat = this.code.getTopObject().type === 'float';
        this.code.popObject(isDerFloat ? f.FT0 : r.T0);  
        if (isDerFloat) {
            this.code.li(r.T1, 0);
            this.code.fcvtsw(f.FT1, r.T1);
            this.code.fsub(f.FT0, f.FT1, f.FT0);
            this.code.pushFloat(f.FT0);
            this.code.pushObject({ type: 'float', length: 4 });
        }else{
            this.code.sub(r.T0, r.ZERO, r.T0);
            this.code.push(r.T0);
            this.code.pushObject({ type: 'int', length: 4 });
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

        const isFloat = this.code.getTopObject().type === 'float';
        const object = this.code.popObject(isFloat ? f.FA0 : r.A0);

        const tipoPrint = {
            'int': () => this.code.printInt(),
            'string': () => this.code.printString(),
            'char': () => this.code.callBuiltin('printch'),
            'boolean': () => this.code.printInt(),
            'float': () => this.code.callBuiltin('printFloat'),
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
       //aqui tengo un problema con el tipo y el localobject
        if(this.insideFunction){
            const localObject = this.code.getFrameLocal(this.frameDclIndex);
            const valueObj = this.code.popObject(r.T0);
            this.code.addi(r.T1, r.FP, -localObject.offset * 4);
            this.code.sw(r.T0, r.T1);
            // ! inferir el tipo
            localObject.type = valueObj.type;
            this.frameDclIndex++;
            return
        }
        if ( node.exp){
           node.exp.accept(this)
           const valor = this.code.getTopObject();
           console.log("valor objeto",valor.type)
           console.log("valor nod",node.tipo)
           if(valor.type !== node.tipo){
            console.log("valor objeto",valor.type)
            console.log("valor nod",node.tipo)
                if (node.tipo !== 'var'){
                    this.code.popObject(r.T0);
                    if (node.tipo == 'char'){
                        const primitivo = new nodos.Primitivo({tipo:node.tipo,valor:'Ä'})
                        primitivo.accept(this)
                    }else{
                        const primitivo = new nodos.Primitivo({tipo:node.tipo,valor:1234567890})
                        primitivo.accept(this)
                    }
                }
           }
        }else{
            //aqui que guardar null en el stack 0
            if (node.tipo == 'char'){
                const primitivo = new nodos.Primitivo({tipo:node.tipo,valor:'Ä'})
                primitivo.accept(this)
            }else{
                const primitivo = new nodos.Primitivo({tipo:node.tipo,valor:1234567890})
                primitivo.accept(this)
            }
          
        }
        
        this.code.tagObject(node.id);
        this.code.comment(`# Fin Declaracion Variable: ${node.id}`);
    }
    /**
     * 
     * * @type {BaseVisitor['visitAsignacionvar']}
     */
    visitAsignacionvar(node){
        
        this.code.comment(`#Inicio Asignacion Variable: ${node.id}`); 
        this.code.comment(`#lectura expresion`);
        node.valor.accept(this)
        
        this.code.comment(`# fin lectura expresion`);
        
        const isFloat = this.code.getTopObject().type === 'float';
        const valueObject = this.code.popObject(isFloat ? f.FT0 : r.T0);
        const [offset, variableObject] = this.code.getObject(node.id);
        
        if (this.insideFunction) {
            this.code.addi(r.T1, r.FP, -variableObject.offset * 4); // ! REVISAR
            this.code.sw(r.T0, r.T1); // ! revisar
            return
        }
        
        if( valueObject.type == 'float'){
            this.code.addi(r.T1, r.SP, offset);
            this.code.fsw(f.FT0, r.T1);
            variableObject.type = valueObject.type;
            this.code.pushFloat(f.FT0);
        }else{
            this.code.addi(r.T1, r.SP, offset);
            this.code.sw(r.T0, r.T1);
            variableObject.type = valueObject.type;
            this.code.push(r.T0);
        }
       
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
        if (this.insideFunction) {
            this.code.addi(r.T1, r.FP, -variableObject.offset * 4);
            this.code.lw(r.T0, r.T1);
            this.code.push(r.T0);
            this.code.pushObject({ ...variableObject, id: undefined });
            return
        }

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
        const prevBreakLabel = this.lbreak;
        this.lbreak = fin;
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
        
        this.lbreak = prevBreakLabel;
    }

    visitCase(node){
        this.code.comment(`#Inicio Case: ${node.exp}`)
        for(let inst of node.stmt){
            inst.accept(this);
        }
        this.code.comment(`#Fin Case: ${node.exp}`)
    }

    visitWhile(node){
        const startWhileLabel = this.code.getLabel();
        const prevContinueLabel = this.lcontinue;
        this.lcontinue = startWhileLabel;

        const endWhileLabel = this.code.getLabel();
        const prevBreakLabel = this.lbreak;
        this.lbreak = endWhileLabel;

        this.code.addLabel(startWhileLabel);
        this.code.comment('#Condicion');
        node.cond.accept(this);
        this.code.popObject(r.T0);
        this.code.comment('#Fin de condicion');
        this.code.beq(r.T0, r.ZERO, endWhileLabel);
        this.code.comment('#Cuerpo del while');
        node.stmt.accept(this);
        this.code.j(startWhileLabel);
        this.code.addLabel(endWhileLabel);

        this.lcontinue = prevContinueLabel;
        this.lbreak = prevBreakLabel;
    }
    visitFor(node){
        this.code.comment('#For');

        const startForLabel = this.code.getLabel();

        const endForLabel = this.code.getLabel();
        const prevBreakLabel = this.lbreak;
        this.lbreak = endForLabel;

        const incrementLabel = this.code.getLabel();
        const prevContinueLabel = this.lcontinue;
        this.lcontinue = incrementLabel;

        this.code.newScope();

        node.init.accept(this);

        this.code.addLabel(startForLabel);
        this.code.comment('#Condicion');
        node.cond.accept(this);
        this.code.popObject(r.T0);
        this.code.comment('#Fin de condicion');
        this.code.beq(r.T0, r.ZERO, endForLabel);

        this.code.comment('#Cuerpo del for');
        node.stmt.accept(this);

        this.code.addLabel(incrementLabel);
        node.inc.accept(this);
        this.code.popObject(r.T0);
        this.code.j(startForLabel);

        this.code.addLabel(endForLabel);

        this.code.comment('#Reduciendo la pila');
        const bytesToRemove = this.code.endScope();

        if (bytesToRemove > 0) {
            this.code.addi(r.SP, r.SP, bytesToRemove);
        }

        this.lcontinue = prevContinueLabel;
        this.lbreak = prevBreakLabel;

        this.code.comment('#Fin de For');
    }

    visitBreak(node){
        this.code.j(this.lbreak);
    }

    visitContinue(node){
        this.code.j(this.lcontinue);
    }


    visitSprint (node){
             //this.code.comment('Print');
             for (const exp of node.args) {
                exp.accept(this);

                const isFloat = this.code.getTopObject().type === 'float';
                const object = this.code.popObject(isFloat ? f.FA0 : r.A0);
                //si el objeto A0 es null 1234567890 || si el objeto fA0 es null 1234567890

                
                /* .data nullo = null
                                    this.code.li(r.A0, 10);
                this.code.li(r.A7, 11);
                this.code.ecall(); 
                return
                */
                
                const tipoPrint = {
                    'int': () => this.code.callBuiltin('printint'),
                    'string': () => this.code.printString(),
                    'char': () => this.code.callBuiltin('printch'),
                    'boolean': () => this.code.printInt(),
                    'float': () => this.code.callBuiltin('printFloat'),
                }
        
                tipoPrint[object.type]();
                this.code.li(r.A0, 10);
                this.code.li(r.A7, 11);
                this.code.ecall(); 
            }
             
    }

    /**
     * 
     */
    visitDeclaFuncion(node){
        const baseSize = 2; // | ra | fp |

        const paramSize = node.params.length; // | ra | fp | p1 | p2 | ... | pn |

        const frameVisitor = new FrameVisitor(baseSize + paramSize);
        node.bloque.accept(frameVisitor);
        const localFrame = frameVisitor.frame;
        const localSize = localFrame.length; // | ra | fp | p1 | p2 | ... | pn | l1 | l2 | ... | ln |

        const returnSize = 1; // | ra | fp | p1 | p2 | ... | pn | l1 | l2 | ... | ln | rv |

        const totalSize = baseSize + paramSize + localSize + returnSize;
        this.functionMetada[node.id] = {
            frameSize: totalSize,
            returnType: node.tipo,
        }

        const instruccionesDeMain = this.code.instrucciones;
        const instruccionesDeDeclaracionDeFuncion = []
        this.code.instrucciones = instruccionesDeDeclaracionDeFuncion;

        node.params.forEach((param, index) => {
            this.code.pushObject({
                id: param.id,
                type: param.tipo,
                length: 4,
                offset: baseSize + index
            })
        });

        localFrame.forEach(variableLocal => {
            this.code.pushObject({
                ...variableLocal,
                length: 4,
                type: 'local',
            })
        });

        this.insideFunction = node.id;
        this.frameDclIndex = 0;
        this.returnLabel = this.code.getLabel();

        this.code.comment(`#Declaracion de funcion ${node.id}`);
        this.code.addLabel(node.id);

        node.bloque.accept(this);

        this.code.addLabel(this.returnLabel);

        this.code.add(r.T0, r.ZERO, r.FP);
        this.code.lw(r.RA, r.T0);
        this.code.jalr(r.ZERO, r.RA, 0);
        this.code.comment(`#Fin de declaracion de funcion ${node.id}`);

        // Limpiar metadatos
        for (let i = 0; i < paramSize + localSize; i++) {
            this.code.objectStack.pop(); // ! aqui no retrocedemos el SP, hay que hacerlo más adelanto
        }

        this.code.instrucciones = instruccionesDeMain

        instruccionesDeDeclaracionDeFuncion.forEach(instruccion => {
            this.code.instrucionesDeFunciones.push(instruccion);
        });

    }

    /**
     * 
     */
    visitLlamada(node){
        if (!(node.callee instanceof ReferenciaVariable)) return

        const nombreFuncion = node.callee.id;

        this.code.comment(`#Llamada a funcion ${nombreFuncion}`);

        const etiquetaRetornoLlamada = this.code.getLabel();

        // 1. Guardar los argumentos
        node.args.forEach((arg, index) => {
            arg.accept(this)
            this.code.popObject(r.T0)
            this.code.addi(r.T1, r.SP, -4 * (3 + index)) // ! REVISAR
            this.code.sw(r.T0, r.T1)
        });

        // Calcular la dirección del nuevo FP en T1
        this.code.addi(r.T1, r.SP, -4)

        // Guardar direccion de retorno
        this.code.la(r.T0, etiquetaRetornoLlamada)
        this.code.push(r.T0)

        // Guardar el FP
        this.code.push(r.FP)
        this.code.addi(r.FP, r.T1, 0)

        // colocar el SP al final del frame
        // this.code.addi(r.SP, r.SP, -(this.functionMetada[nombreFuncion].frameSize - 4))
        this.code.addi(r.SP, r.SP, -(node.args.length * 4)) // ! REVISAR


        // Saltar a la función
        this.code.j(nombreFuncion)
        this.code.addLabel(etiquetaRetornoLlamada)

        // Recuperar el valor de retorno
        const frameSize = this.functionMetada[nombreFuncion].frameSize
        const returnSize = frameSize - 1;
        this.code.addi(r.T0, r.FP, -returnSize * 4)//duda 1:33:00
        this.code.lw(r.A0, r.T0)

        // Regresar el FP al contexto de ejecución anterior
        this.code.addi(r.T0, r.FP, -4)
        this.code.lw(r.FP, r.T0)

        // Regresar mi SP al contexto de ejecución anterior
        this.code.addi(r.SP, r.SP, (frameSize - 1) * 4)


        this.code.push(r.A0)
        this.code.pushObject({ type: this.functionMetada[nombreFuncion].returnType, length: 4 })

        this.code.comment(`#Fin de llamada a funcion ${nombreFuncion}`);
    }


    /**
     * @type {BaseVisitor['visitReturn']}
     */
    visitReturn(node) {
        this.code.comment('#Inicio Return');

        if (node.exp) {
            node.exp.accept(this);
            this.code.popObject(r.A0);

            const frameSize = this.functionMetada[this.insideFunction].frameSize
            const returnOffest = frameSize - 1;
            this.code.addi(r.T0, r.FP, -returnOffest * 4)
            this.code.sw(r.A0, r.T0)
        }

        this.code.j(this.returnLabel);
        this.code.comment('#Final Return');
        
    }
    
}