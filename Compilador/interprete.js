import { aritmeticas } from "../Expresiones/aritmeticas.js";
import { logicas } from "../Expresiones/logicas.js";
import { igualdades } from "../Expresiones/igualdades.js";
import { relacionales } from "../Expresiones/relacionales.js";
import { dvariable } from "../Instruccion/dvariables.js";
import { enviroment } from "../Symbol/enviroment.js";
import { BaseVisitor } from "../Compilador/visitor.js";
import nodos, { DeclaracionVariable, Llamada, Primitivo, ReferenciaVariable } from "../Compilador/nodos.js";
import { asignav } from "../Instruccion/asignacionvar.js";
import { dfuncion } from "../Instruccion/funcion.js";
import {Instancia} from "../Instruccion/instancia.js"
import { Invocable } from "../Instruccion/invocable.js";
import { fnativas } from "../Instruccion/nativas.js";
import { dstruct } from "../Instruccion/struct.js";
import {BreakException,ContinueException,ReturnException} from "../Instruccion/transferencias.js";
import { iarray } from "../Instruccion/array.js";
import { InstanciaA } from "../Instruccion/InstanciaA.js";
import { ClonarA } from "../Instruccion/clonarA.js";
import { ErrorData } from "../Symbol/errores.js";
export class InterpreterVisitor extends BaseVisitor{
  constructor(){
    super()
    this.entornoActual = new enviroment();
     Object.entries(fnativas).forEach(([nombre, funcion]) => {
      this.entornoActual.setVariable(nombre, funcion);});

    this.salida = '';
    this.prev = null;
    this.prevContinue = null;
    this.simbolos = [];
  }
    interpretar(nodo){
      return nodo.accept(this)
    }
    /**
      * @type {BaseVisitor['visitPrimitivo']}
    */
    visitPrimitivo(node){
        return node
    }
        /**
      * @type {BaseVisitor['visitOperacionAritmetica']}
    */

    visitOperacionAritmetica(node){
        const izq = node.izq.accept(this)
        const der = node.der.accept(this)
        return aritmeticas(node.op,izq,der)
    }
    /**
      * @type {BaseVisitor['visitOperacionLogica']}
    */
    visitOperacionLogica(node){
        const izq = node.izq.accept(this)
        const der = node.der.accept(this)

        return logicas(node.op,izq,der)
    }
    /**
      * @type {BaseVisitor['visitOperacionIgualdades']}
    */
    visitOperacionIgualdades(node){
        const izq = node.izq.accept(this)
        const der = node.der.accept(this)

        return igualdades(node.op,izq,der)
    }
    /**
      * @type {BaseVisitor['visitOperacionRelacional']}
    */
    visitOperacionRelacional(node){
        const izq = node.izq.accept(this)
        const der = node.der.accept(this)

        return relacionales(node.op,izq,der)
    }
    /**
      * @type {BaseVisitor['visitTernario']}
    */
    visitTernario(node){
        const condicion = node.condicion.accept(this)
        if(condicion.tipo === 'boolean'){
            if(condicion.valor){
                return node.verdadero.accept(this)
            }else{
                return node.falso.accept(this)
            } 
        }else{
            throw new Error('Error en la operacion ternaria tipos incorrectos');
        }
      
    }
        /**
      * @type {BaseVisitor['visitOperacionUnaria']}
    */
    visitOperacionUnaria(node){
        const exp = node.exp.accept(this)
        if (exp.valor == null){
          //error valor nulo
            return new Primitivo({valor:null , tipo: exp.tipo});
        }
        if (exp.tipo == 'int' || exp.tipo == 'float'){
            return new Primitivo({valor: exp.valor * -1 , tipo: exp.tipo});
        }else{
            // return new Primitivo({valor:null , tipo: exp.tipo});
      
            throw new ErrorData('Error en la Oeracion Unaria',node.location)
            
        }

    }
    /**
      * @type {BaseVisitor['visitAgrupacion']}
    */
    visitAgrupacion(node){
        return node.exp.accept(this)
    }
    /**
      * @type {BaseVisitor['visitDeclaracionVariable']}
    */
    visitDeclaracionVariable(node){
      let exp = node.exp  ? node.exp.accept(this) : null
      
      if (exp!= null){
        if(exp.valor instanceof InstanciaA){
         exp = ClonarA(exp)
        }
      }
      const result = dvariable(exp,node.tipo,node.id)
      this.entornoActual.setVariable(node.id,result,node.location)
      let tipoS;
      if (result != null){
        if (result.valor instanceof InstanciaA) {
          tipoS = "Array"
        }else if (result.valor instanceof Instancia) {
          tipoS = "Struct"
        }else{
          tipoS = "Variable"
        }
        this.simbolos.push({id: node.id, tsim: tipoS, tipod: node.tipo, linea: node.location.start.line, columna: node.location.start.column}) 
      }
  
      
    }
 /**
      * @type {BaseVisitor['visitReferenciaVariable']}
      */
    visitReferenciaVariable(node){
        return this.entornoActual.getVariable(node.id);
    }
   /**
      * @type {BaseVisitor['visitPrint']}
      */
   visitPrint(node) {
    const valor = node.exp.accept(this);
    this.salida += valor.valor + '\n';
  }
    /**
      * @type {BaseVisitor['visitNegacion']}
      */
  visitNegacion(node){
    const exp = node.exp.accept(this)
    if (exp.tipo == 'boolean'){
        return new Primitivo({valor: !exp.valor , tipo: exp.tipo});
    }else{
        throw new Error('Error en la operacion negacion tipos incorrectos');
    }
  }
    /**
      * @type {BaseVisitor['visitAsignacionvar']}
      */
  visitAsignacionvar(node){ 
    const valorn = node.valor.accept(this);
    
      if (valorn!= null){
        if(valorn.valor instanceof InstanciaA){
         valorn = ClonarA(exp)
        }
      }
    let valoractual = this.entornoActual.getVariable(node.id)
    let valorfinal = asignav(valorn,valoractual,node.op)
    this.entornoActual.assignvariables(node.id,valorfinal)
      if (valorfinal != null){
        if (valorfinal.valor == null){
          throw new ErrorData('Variable asignada con null tipos no coinciden',node.location)
        }
      }
  }
    /**
      * @type {BaseVisitor['visitBloque']}
      */
  visitBloque(node){

    const entornoAnterior = this.entornoActual;
        this.entornoActual = new enviroment(entornoAnterior);

        node.ins.forEach(ins => ins.accept(this));

        this.entornoActual = entornoAnterior;
  }
    /**
      * @type {BaseVisitor['visitIf']}
      */
  visitIf(node){
    const condicion = node.cond.accept(this)
    if(condicion.tipo !== 'boolean'){
      throw new ErrorData( 'Error en la condicion del if',node.location)
    }
    if(condicion.valor){
      return node.stmtTrue.accept(this)
    }else if(node.stmtFalse != null){
      return node.stmtFalse.accept(this)
    }
    return null
  }
   /**
      * @type {BaseVisitor['visitSwitch']}
      */
  visitSwitch(node){
    let condicion = node.cond.accept(this)
    if(node.cases === null && node.def === null){
      throw new ErrorData('Error en el switch',node.location)
    }
    let estado = false
    const entornoAnterior = this.entornoActual;
    this.entornoActual = new enviroment(entornoAnterior);
    try{
      if(node.cases != null){
        for(const caso of node.cases){
          let con = caso.exp.accept(this);
          if (con.valor == condicion.valor && con.tipo == condicion.tipo && !estado) {
              caso.accept(this);
            estado = true;
          }
          else if (estado){
            caso.accept(this);
          }
        }
        if(node.def != null){
            node.def.accept(this);
        }
      }
      else if(node.def != null){
          node.def.accept(this);
      }
    }catch(error){
      if (error instanceof  BreakException){
        return
      }
      throw error
    }finally{
      this.entornoActual = entornoAnterior;
    }
  }
  
    /**
      * @type {BaseVisitor['visitExpresionStmt']}
      */
    visitExpresionStmt(node) {
      node.exp.accept(this);
  }
  
   /**
      * @type {BaseVisitor['visitCase']}
      */
  visitCase(node){
      for(let inst of node.stmt){
        inst.accept(this);
      } 
  }
     /**
      * @type {BaseVisitor['visitWhile']}
      */

  visitWhile(node){
    const entornoinicial = this.entornoActual;
    
    try {
      while (node.cond.accept(this).valor && node.cond.accept(this).tipo === 'boolean') {
          node.stmt.accept(this);
      }
    } catch (error) {
      this.entornoActual = entornoinicial;
        if (error instanceof BreakException) {
            return
        }
        if (error instanceof ContinueException) {
            return this.visitWhile(node);
        }
        throw new ErrorData(error, node.location);
    }
  }
   /**
      * @type {BaseVisitor['visitFor']}
      */
  visitFor(node){
    const entornoinicial = this.entornoActual;
    const incrementoAnterior = this.prevContinue;
    this.prevContinue = node.inc;
        const forTraducido = new nodos.Bloque({
          ins: [
              node.init,
              new nodos.While({
                  cond: node.cond,
                  stmt: new nodos.Bloque({
                      ins: [
                          node.stmt,
                          node.inc
                      ]
                  })
              })
          ]
      })

      forTraducido.accept(this);

      this.prevContinue = incrementoAnterior;
  }
   /**
      * @type {BaseVisitor['visitForeach']}
      */
  visitForeach(node){
    let array;
    if (!node.va instanceof DeclaracionVariable){
      throw new ErrorData('Error en variabel el foreach',node.location)
    }
      array = node.arr.accept(this);
    
    if(!array.valor instanceof Primitivo){
      throw new ErrorData('Error en array el foreach',node.location)
    }  

    if (array.valor instanceof InstanciaA) {
      array = array.valor.propiedades;
    }
    const entornoinicial = this.entornoActual;
    try {
      for (let i = 0; i < array.length; i++) {
        node.va.exp = array[i];
        node.bloque.ins.unshift(node.va);
        node.bloque.accept(this);
        node.bloque.ins.splice(0, 1);
      }
    } catch (error) {
      this.entornoActual = entornoinicial;
      if (error instanceof BreakException) {
          return
      }
      if (error instanceof ContinueException) {
          return this.visitForeach(node);
      }
      throw error;
    }
}

     /**
      * @type {BaseVisitor['visitDeclaFuncion']}
      */
  visitDeclaFuncion(node) {
    const newfuncion = new dfuncion(node,this.entornoActual)
    this.entornoActual.setVariable(node.id,newfuncion,node.location)
     let  tipoS = "Funcion"
     this.simbolos.push({id: node.id, tsim: tipoS, tipod: node.tipo, linea: node.location.start.line, columna: node.location.start.column}) 
    
  }
    /**
      * @type {BaseVisitor['visitLlamada']}
      */
  visitLlamada(node){
    const funcion = node.callee.accept(this);
    const argumentos = node.args.map(arg => arg.accept(this));
    if (!(funcion instanceof Invocable)) {
      throw new Error('No es invocable');
      // 1() "sdalsk"()
    }
    if (funcion.aridad() !== argumentos.length) {
      throw new Error('Aridad incorrecta');
    }
    return funcion.invocar(this, argumentos);
  }
 /**
      * @type {BaseVisitor['visitGet']}
      */
  visitGet(node){
    const instancia = node.objetivo.accept(this);
    if (!(instancia instanceof Primitivo)) {
      throw new Error('No es posible obtener una propiedad o valor de algo que no es un Primitivo');
    }
    if (!(instancia.valor instanceof Instancia) && !(instancia.valor instanceof InstanciaA)) {
  throw new Error('No es posible obtener una propiedad de algo que no es una instancia');
    }
    if (node.propiedad instanceof Llamada) {
      node.propiedad.args.unshift(instancia)
      return node.propiedad.accept(this)
    }
    if (node.propiedad instanceof ReferenciaVariable){
      return instancia.valor.getVariable(node.propiedad.accept(this));
    }
    return instancia.valor.getVariable(node.propiedad);
  }

   /**
      * @type {BaseVisitor['visitSet']}
      */
  visitSet(node) {
    const instancia = node.objetivo.accept(this);

    if (!(instancia instanceof Primitivo)) {
      throw new Error('No es posible obtener una propiedad o valor de algo que no es un Primitivo');
    }
    if (!(instancia.valor instanceof Instancia) && !(instancia.valor instanceof InstanciaA)) {
       throw new Error('No es posible obtener una propiedad de algo que no es una instancia');
      }
      let valor = asignav(node.valor.accept(this),instancia.valor.getVariable(node.propiedad), node.op)
      return instancia.valor.setVariable(node.propiedad, valor);
  }
  

  /**
   * @type {BaseVisitor['visitTypeOf']}
   */
  visitTypeOf(node){
    let valor = node.exp.accept(this)
    return new Primitivo({valor: valor.tipo, tipo: 'string'})
  }

  visitSprint(node){
    for (const exp of node.args) {
        let valor = exp.accept(this);
        if (valor.tipo === 'string' && valor.valor != null) {
          valor.valor = valor.valor.replace('\\n', '\n')
          valor.valor = valor.valor.replace('\\r', '\r')
          valor.valor = valor.valor.replace('\\"', '\"')
          valor.valor = valor.valor.replace('\\t', '\t')
        }
        this.salida += valor.valor + " ";
    }
    this.salida += '\n';
  }

  visitDeclaracionStruct(node){
    const newstruct = new dstruct(node,this.entornoActual)
    this.entornoActual.setVariable(node.id, newstruct);
   // let  tipoS = "Struct"
    //this.simbolos.push({id: node.id, tsim: tipoS, tipod: node.id, linea: node.location.start.line, columna: node.location.start.column}) 
  }
  visitComentarios(node){}
  
  /**
     * @type {BaseVisitor['visitBreak']}
     */
  visitBreak(node){
    throw new BreakException();
  }
  /**
     * @type {BaseVisitor['visitContinue']}
     */
  visitContinue(node){
      if (this.prevContinue) {
        this.prevContinue.accept(this);
    }
    throw new ContinueException();
  }
  /**
     * @type {BaseVisitor['visitReturn']}
     */
  visitReturn(node){
    let valor = null;
    if (node.exp) {
        valor = node.exp.accept(this);
    }
    throw new ReturnException(valor);
  }

    /**
     * @type {BaseVisitor['visitDeclaracionStruct']}
     */

  visitDeclaracionStruct(node){
    //verificar que sea el entono global pendiente  error
    const struct = new dstruct(node,this.entornoActual)
    this.entornoActual.setVariable(node.id, struct,node.location);
  }
  /**
     * @type {BaseVisitor['visitInstancia']}
     */
  visitInstancia(node){
   const struct = this.entornoActual.getVariable(node.id);

    return new Primitivo({valor:struct.invocar(this,node.args), tipo: node.id});
  }
  visitArray(node){
    const array = new iarray(node,[])
    const valor = array.invocar(this,node.args)
    return new Primitivo({valor:valor, tipo: array.nodo.tipo});
      
  }


}