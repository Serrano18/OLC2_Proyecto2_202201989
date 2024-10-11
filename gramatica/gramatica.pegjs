{
    const nuevoNodo = (tipo, props) => {
        const tipos = {
            'Primitivo': nodos.Primitivo,
            'Print': nodos.Print,
            'OpAritmetica': nodos.OperacionAritmetica,
            'OpRelacional': nodos.OperacionRelacional,
            'OpIgualdades': nodos.OperacionIgualdades,
            'OpLogica': nodos.OperacionLogica,
            'OpTernario': nodos.Ternario,
            'Unaria': nodos.OperacionUnaria,
            'Agrupacion': nodos.Agrupacion,
            'DeclaracionVar': nodos.DeclaracionVariable,
            'ReferenciaVariable': nodos.ReferenciaVariable,
            'Negacion': nodos.Negacion,
            'Asignacionvar': nodos.Asignacionvar,
            'Bloque': nodos.Bloque,
            'If': nodos.If,
            'Switch': nodos.Switch,
            'Case': nodos.Case,
            'Break': nodos.Break,
            'Continue': nodos.Continue,
            'Return': nodos.Return,
            'For': nodos.For,
            'While': nodos.While,
            'DeclaFuncion' : nodos.DeclaFuncion,
            'Llamada' : nodos.Llamada,
            'Get' : nodos.Get,
            'Sprint' : nodos.Sprint,
            'TypeOf' : nodos.TypeOf,
            'DeclaracionStruct' : nodos.DeclaracionStruct,
            'Instancia' : nodos.Instancia,
            'Set' : nodos.Set,
            'Array' : nodos.Array,
            'ArrayDefecto' : nodos.ArrayDefecto,
            'Marray' : nodos.Marray,
            'ExpresionStmt' : nodos.ExpresionStmt,
            'Foreach' : nodos.Foreach,
            'Comentarios' : nodos.Comentarios,
        }

        const nodo = new tipos[tipo](props)
        nodo.location = location()
        return nodo
    }
}

programa 
    = _ dcl:instucciones* _ { return dcl }
    

instucciones 
    = c:Comentarios _ { return c }    
    /_ dcl:declaraciones _{ return dcl }
        
declaraciones 

    =  dcls:declaracionstrucuts _ { return dcls }
    / dclf:declaracionfunciones _ { return dclf }
     / dclv:declaracionvariables _ ";" _ { return dclv }
    /  stmt:Stmt _ { return stmt }
        

declaracionstrucuts
    = "struct" _ id:id _ "{" _ vars:(campos:declaracionvariables _ ";" _ {return campos})+  _"}" _ ";" 
        { return nuevoNodo('DeclaracionStruct', { id, vars }) }

instancia
    = _ id:id _ "{" _ args:params  _ "}" _
        { return nuevoNodo('Instancia', { id, args }) }

params = _ p:param _  ps:("," _ pr:param {return pr})*
        { return [p, ...ps] }

param
    = _ id:id _ ":" _ valor:expresion _ 
        { return  nuevoNodo('Asignacionvar', { id,op:"=",valor }) }

declaracionfunciones 
    = tipo:(tipo / "void"/ id) _ id:id _ "(" _ params:Parametros? _ ")" _ bloque:bloque 
        { return nuevoNodo('DeclaFuncion', {tipo, id, params: params || [], bloque }) }

Parametros 
    = d:declarafunc _ params:("," _ ds:declarafunc { return ds})* 
        { return [d, ...params] }

//Llamadas de funciones

declarafunc
    = declaracionvariables

declaracionvariables  //declara variables y arrays
    = tipo:  (tipo / "var"/ id) _ t:("[" _ "]"_ {return 0})* _ id:id _ valor:( "=" _ valor:expresion { return valor}) ? 
            { return  nuevoNodo('DeclaracionVar', { tipo:(tipo + '[]'.repeat(t.length)), id, exp:valor || null }) }

// -------------------Sentencias-------------------
Stmt 
    = print 
    /sprint
    /if
    /switch
    /break
    /conti
    /ret
    /foreach
    /for
    /while
    /bloque
    / exp:expresion _ ";" { return nuevoNodo('ExpresionStmt', { exp }) }
    /c:Comentarios _ { return c }    


print 
    = "print" _ "(" _ exp:expresion _ ")" _ ";" 
        { return  nuevoNodo('Print', { exp }) }

bloque 
    = "{" _ ins:instucciones* _ "}" 
        { return nuevoNodo('Bloque',{ins}) }

if                                                                                      //se vuelve a llamar a ella misma
    = "if" _ "(" _ cond:expresion _ ")" _ stmtTrue:bloque _ stmtFalse:(_ "else" _ stmtFalse:(bloque/if) { return stmtFalse } )? 
      { return nuevoNodo('If', { cond, stmtTrue, stmtFalse }) }

switch
    = "switch" _ "(" _ cond:expresion _ ")" _ "{" _ cases:case* _ def:default? _ "}" 
        { return nuevoNodo('Switch', { cond, cases, def }) }
       
case
    =  tipo:("case") _ exp:expresion _ ":" _ stmt:instucciones* _
        { return nuevoNodo('Case', { tipo, exp, stmt }) }
default
    =  tipo:"default" _ ":" _ stmt:instucciones* _
        {return nuevoNodo('Case', { tipo, exp: null, stmt })  }

for
    = "for" _ "(" _ init:ForInit _ cond:expresion _ ";" _ inc:asignatura _ ")" _ stmt:bloque
     {return nuevoNodo('For', { init, cond, inc, stmt })}

ForInit
    = dcl:declaracionvariables _ ";" { return dcl }
    / exp:expresion _ ";" { return exp }
    / ";" { return null }

foreach
    = "for" _ "(" _ va:declaracionvariables _ ":" _ arr:expresion _ ")" _ bloque:bloque
        {return nuevoNodo('Foreach', { va, arr, bloque })}

while
    = "while" _ "(" _ cond:expresion _ ")" _ stmt:bloque 
        { return nuevoNodo('While', { cond, stmt }) }
   

//----------------Transferencia----------------
break
    = _ "break" _ ";" 
        { return nuevoNodo('Break',{}) }

conti 
    = "continue" _ ";" 
        { return nuevoNodo('Continue',{}) }

ret
    = "return" _ exp:expresion? _  ";" 
        { return nuevoNodo('Return', { exp }) }

asignatura
    =  id:llamada _ op:("+="/"-="/"=") _ valor:expresion _ 
        { 
            if (id instanceof nodos.ReferenciaVariable){
                if (op === "="){
                    return  nuevoNodo('Asignacionvar', { id:id.id,op,valor })
                }else{
                    let ope;
                    if (op === "+="){
                        ope = nuevoNodo('OpAritmetica', { op:'+', izq:id, der:valor })
                    }else {
                        ope = nuevoNodo('OpAritmetica', { op:'-', izq:id, der:valor })
                    }
                    return  nuevoNodo('Asignacionvar', { id:id.id,op,valor:ope })
                }
            } else if (id instanceof nodos.Get){
                return  nuevoNodo('Set', { objetivo:id.objetivo,propiedad:id.propiedad,valor,op}) 
            } 
        }

//eXPRESION QUE PUEDE SER 
expresion = asignacion

asignacion 
    = asignatura
    /ternario

ternario 
    = _ condicion: OR _ "?" _ verdadero:ternario _ ":" _ falso:ternario _ 
        { return  nuevoNodo('OpTernario', { condicion, verdadero, falso }) }
    / OR 

//-------------------------------------------------OPERACIONES LOGICAS ------------------------------------------------
OR 
    = _ izq:AND expansion:( _ "||" _ der:AND { return { tipo: "||", der } })* { 
        return expansion.reduce(
        (Anterior, Actual) => {
        const { tipo, der } = Actual
        return  nuevoNodo('OpLogica', { op:tipo, izq: Anterior, der })},izq)}

AND 
    = _ izq:igualdad expansion:( _ "&&" _ der:igualdad { return { tipo: "&&", der } })* { 
        return expansion.reduce((Anterior, Actual) => {const { tipo, der } = Actual
        return  nuevoNodo('OpLogica', { op:tipo, izq: Anterior, der })},izq)}

igualdad 
    = izq:relacional expansion:( _ op:("==" / "!=") _ der:relacional { return { tipo: op, der } })* { 
        return expansion.reduce((Anterior, Actual) => {const { tipo, der } = Actual
        return  nuevoNodo('OpIgualdades', { op:tipo, izq: Anterior, der })},izq)}

//-------------------------------------------------OPERACIONES RELACIONALES ------------------------------------------------
relacional 
    = izq:Suma expansion:( _ op:("<=" /">="/"<" / ">") _ der:Suma { return { tipo: op, der } })* { 
        return expansion.reduce((Anterior, Actual) => {const { tipo, der } = Actual
        return  nuevoNodo('OpRelacional', { op:tipo, izq: Anterior, der })},izq)}

//-------------------------------------------------OPERACIONES ARITMETICAS ------------------------------------------------
Suma 
    = izq:Multiplicacion expansion:(_ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } })* { 
        return expansion.reduce((Anterior,Actual) => {const { tipo, der } = Actual
        return  nuevoNodo('OpAritmetica', { op:tipo, izq: Anterior, der })},izq)}

Multiplicacion
 = izq:Unarias expansion:(_ op: ("*" / "/"/"%") _ der:Unarias { return { tipo: op, der } })* {
        return expansion.reduce((Anterior, Actual) => {const { tipo, der } = Actual
        return  nuevoNodo('OpAritmetica', { op:tipo, izq: Anterior, der })},izq)}

Unarias 
    = "-" _ num:Unarias { return  nuevoNodo('Unaria', { op: '-', exp: num }) }
    /"!" _ num:Unarias { return  nuevoNodo('Negacion', { op: '!', exp: num}) }
    /llamada
    / datos
Marray
    = m:("indexOf"/"join"/"Object.keys") arg:( "(" _ exp:expresion?_ ")" {return exp})?{
        const valor = nuevoNodo('ReferenciaVariable', {id: m})
        return nuevoNodo('Llamada', { callee: valor, args: arg ? [arg] : [] })
    }
llamada 
    =  objetivoInicial:datos operaciones:(
    ("(" _ args:Argumentos? _ ")" { return {args, tipo: 'funcCall' } })
    / ("." _ id:("length"/Marray/id/llamada) _ { return { id, tipo: 'Get' } }) 
    / ("[" _ id:expresion _ "]" { return { id, tipo: 'Inarray' } })
    )* 
  {
  const op =  operaciones.reduce(
    (objetivo, args) => {
      // return crearNodo('llamada', { callee, args: args || [] })
      const { tipo, id, args:argumentos } = args
      if (tipo === 'funcCall') {
        return nuevoNodo('Llamada', { callee: objetivo, args: argumentos || [] })
      }else if (tipo === 'Get') {
        return nuevoNodo('Get', { objetivo, propiedad: id })
      }else if (tipo === 'Inarray') {
        return nuevoNodo('Get', { objetivo, propiedad: id })
      }
    },
    objetivoInicial
  )
    return op
    }


//Esta no es expresion
sprint
    = "System.out.println" _ "(" _ args:Argumentos _ ")" _ ";" 
        { return  nuevoNodo('Sprint', { args }) }
//nativas expresiones 

typeof
    = "typeof" _  exp:expresion  _ 
        { return  nuevoNodo('TypeOf', { exp }) }

Argumentos 
    = arg:expresion _ args:("," _ exp:expresion { return exp })* 
        { return [arg, ...args] }


// ------------------------------Datos primitivos----------------------------------
datos 
    = numeros
    /agrupacion
    / decimal 
    / booleano 
    / cadena 
    /instancia
    / char 
    /typeof 
    /instanciaArray
    /idvalue


//instancia para los arrays 2 casos
// {primtivo, primitivo, primitivo}  o matriz { {primtivo, primitivo, primitivo}, {primtivo, primitivo, primitivo} }
// new tipos/id []*

instanciaArray
    = "new" _ tip:(tipo / id) _ t:("[" _ exp:expresion _ "]" _{return exp})+  
        { return nuevoNodo('Array', { tipo:tip, t }) }
    /  "{" _ args:Argumentos _ "}" _
        { return nuevoNodo('Array', { args }) }

agrupacion 
    =  "(" _ exp:expresion _ ")" _
        {return  nuevoNodo('Agrupacion', { exp })}

numeros 
    = decimal 
    / entero 

entero 
    = [0-9]+    {return  nuevoNodo('Primitivo', { tipo: 'int', valor: parseInt(text()) })}

decimal 
    = [0-9]+("."[0-9]+)     {return  nuevoNodo('Primitivo', { tipo: 'float', valor: parseFloat(text()) })}
        
booleano 
    = ("true" / "false")  {return  nuevoNodo('Primitivo', { tipo: 'boolean', valor: text() === "true" ? true : false })}

cadena 
    = "\"" (!"\"" .)* "\""   {return  nuevoNodo('Primitivo', { tipo: 'string', valor: text().slice(1, -1) })}

char 
    = "'" (!"'" .) "'"     {return  nuevoNodo('Primitivo', { tipo: 'char', valor: text().slice(1, -1) })}

idvalue
     = id: "Object.keys"
        { return nuevoNodo('ReferenciaVariable', {id})} 
     / id:id    
        {return  nuevoNodo('ReferenciaVariable', {id})}

reservadas = "int" / "float" / "string" / "char" / "boolean" / "true" / "false" / "void" /
 "var" / "struct" / "if" / "else" / "switch" / "case" / "default" / "break" / "continue" 
 / "return" / "for" / "while" / "print" / "System.out.println"  / "new" / "null"  


separadores = "(" / ")" / "{" / "}" / "[" / "]" / "," / ";" / "." 
/ ":" / "?" / "!" / "=" / "==" / "!=" / "<" / "<=" / ">" / ">="
 / "+" / "-" / "*" / "/" / "%" / "&&" / "||" / "!" / "+="
  / "-=" / "*=" / "/=" / "%=" / "++" / "--" 
identificador = ([a-zA-Z_])[a-zA-Z0-9_]* {return text()}
id = !(reservadas separadores) id:identificador {return id}

tipo = "int" / "float" / "string" / "char" / "boolean"
//Comentarios
_ = ([ \t\n\r] )* 

Comentarios = "//" (![\n] .)* {return nuevoNodo('Comentarios',{comentario:text().replace('//', '#')})}
            / "/*" (!("*/") .)* "*/" {return nuevoNodo('Comentarios',{comentario:text()})}