// import fs from 'fs';
const fs = require('fs')

const types = [
    `
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
    `
]

const configuracionNodos = [
    // Configuracion del nodo inicial
    {
        name: 'Expresion',
        base: true,
        props: [
            {
                name: 'location',
                type: 'Location|null',
                description: 'Ubicacion del nodo en el codigo fuente',
                default: 'null'
            }
        ]
    },
    {
        name: 'Comentarios',
        extends: 'Expresion',
        props: [
            {
                name: 'comentario',
                type: 'string',
                description: 'Comentario del nodo'
            }
        ]
    },
    {
        name: 'DeclaracionStruct',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Valor del primitivo'
            },
            {
                name: 'vars',
                type: 'Expresion[]',
                description: 'Tipo del primitivo'
            }
        ]
    },
    {
        name: 'Break',
        extends: 'Expresion',
        props: []
    },
    {
        name: 'Continue',
        extends: 'Expresion',
        props: []
    },
    {
        name: 'Return',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion|undefined',
                description: 'Expresion a retornar'
            }
        ]
    },
    {
        name: 'Primitivo',
        extends: 'Expresion',
        props: [
            {
                name: 'valor',
                type: 'any',
                description: 'Valor del primitivo'
            },
            {
                name: 'tipo',
                type: 'string',
                description: 'Tipo del primitivo'
            }
        ]
    },
    {
        name: 'OperacionLogica',
        extends: 'Expresion',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    {
        name: 'Ternario',
        extends: 'Expresion',
        props: [
            {
                name: 'condicion',
                type: 'Expresion',
                description: 'Condicion del operador ternario'
            },
            {
                name: 'verdadero',
                type: 'Expresion',
                description: 'Expresion si la condicion es verdadera'
            },
            {
                name: 'falso',
                type: 'Expresion',
                description: 'Expresion si la condicion es falsa'
            }
        ]
    },
    {
        name: 'OperacionAritmetica',
        extends: 'Expresion',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    {
        name: 'OperacionRelacional',
        extends: 'Expresion',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    {
        name: 'OperacionIgualdades',
        extends: 'Expresion',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    {
        name: 'OperacionUnaria',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    {
        name: 'Instancia',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Tipo de la funcion'
            },
            {
                name: 'args',
                type: 'Expresion[]',
                description: 'Nombre de la funcion'
            }
        ]
    },
    {
        name: 'DeclaFuncion',
        extends: 'Expresion',
        props: [
            {
                name: 'tipo',
                type: 'string',
                description: 'Tipo de la funcion'
            },
            {
                name: 'id',
                type: 'string',
                description: 'Nombre de la funcion'
            },
            {
                name: 'params',
                type: 'Object[]',
                description: 'Parametros de la funcion'
            },
            {
                name: 'bloque',
                type: 'Expresion[]',
                description: 'Cuerpo de la función'
            }
        ]
    },
    {
        name: 'Llamada',
        extends: 'Expresion',
        props: [
            {
                name: 'callee',
                type: 'Expresion',
                description: 'Expresion a llamar'
            },
            {
                name: 'args',
                type: 'Expresion[]',
                description: 'Argumentos de la llamada'
            }
        ]
    },
    {
        name: 'Get',
        extends: 'Expresion',
        props: [
            {
                name: 'objetivo',
                type: 'Expresion',
                description: 'Objeto de la propiedad'
            },
            {
                name: 'propiedad',
                type: 'string',
                description: 'Identificador de la propiedad'
            }
        ]
    },
    {
        name: 'Set',
        extends: 'Expresion',
        props: [
            {
                name: 'objetivo',
                type: 'Expresion',
                description: 'Objeto de la propiedad'
            },
            {
                name: 'propiedad',
                type: 'string',
                description: 'Identificador de la propiedad'
            },
            {
                name: 'valor',
                type: 'Expresion',
                description: 'Valor de la propiedad'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la asignacion'
            }
        ]
    },
    {
        
            name: 'Array',
            extends: 'Expresion',
            props: [
                {
                    name: 'tipo',
                    type: 'string',
                    description: 'tipo de array'
                },
                {
                    name: 't',
                    type: 'Expresion[]',
                    description: 'Tamaño del array'
                },
                {
                    name: 'args',
                    type: 'Expresion[]',
                    description: 'Expresion a evaluar'
                }
            ]
    
        
    },
    { 
        name: 'Bloque',
        extends: 'Expresion',
        props: [
            {
                name: 'ins',
                type: 'Expresion[]',
                description: 'Sentencias del bloque'
            }
        ]
    },
    {
        name: 'ExpresionStmt',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion a evaluar'
            }
        ]
    },
    {
        name: 'If',
        extends: 'Expresion',
        props: [
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del if'
            },
            {
                name: 'stmtTrue',
                type: 'Expresion[]',
                description: 'Cuerpo del if'
            },
            {
                name: 'stmtFalse',
                type: 'Expresion[]|undefined',
                description: 'Cuerpo del else'
            }
        ]
    },
    {
        name: 'While',
        extends: 'Expresion',
        props: [
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del while'
            },
            {
                name: 'stmt',
                type: 'Expresion[]',
                description: 'Cuerpo del while'
            }
        ]
    },
    {
        name: 'For',
        extends: 'Expresion',
        props: [
            {
                name: 'init',
                type: 'Expresion',
                description: 'Inicializacion del for'
            },
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del for'
            },
            {
                name: 'inc',
                type: 'Expresion',
                description: 'Incremento del for'
            },
            {
                name: 'stmt',
                type: 'Expresion[]',
                description: 'Cuerpo del for'
            }
        ]
    },
    {
        name: 'Case',
        extends: 'Expresion',
        props: [
            {
                name: 'tipo',
                type: 'string',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'exp',
                type: 'Expresion|null',
                description: 'Expresion a comparar del case'
            },
            {
                name: 'stmt',
                type: 'Expresion[]',
                description: 'Instrucciones dentro del case'
            }
        ]
    },
    {
        name: 'Switch',
        extends: 'Expresion',
        props: [
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'cases',
                type: 'Case[]',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'def',
                type: 'Case',
                description: 'Operador de la operacion'
            }
        ]
    },
    
    {
        name: 'Asignacionvar',
        extends: 'Expresion',
        props: [
            {
                name: 'valor',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'id',
                type: 'string',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
        
    },
    {
        name: 'Negacion',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    {
        name: 'Agrupacion',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion agrupada'
            }
        ]
    },
    {
        name: 'Numero',
        extends: 'Expresion',
        props: [
            {
                name: 'valor',
                type: 'number',
                description: 'Valor del numero'
            }
        ]
    },
    //     DeclaracionVariable
    {
        name: 'DeclaracionVariable',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la variable'
            },
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion de la variable'
            },
            {
                name: 'tipo',
                type: 'string',
                description: 'Tipo de la variable'
            }
        ]
    },
    // ReferenciaVariable
    {
        name: 'ReferenciaVariable',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la variable'
            }
        ]
    },
    // Print
    {
        name: 'Print',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion a imprimir'
            }
        ]
    },
   {
    name: 'Foreach',
    extends: 'Expresion',
    props: [
        {
            name: 'va',
            type: 'Expresion',
            description: 'Declaracion de la variable'
        },
        {
            name: 'arr',
            type: 'Expresion',
            description: 'Arreglo a recorrer'
        },
        {
            name: 'bloque',
            type: 'Expresion[]',
            description: 'Tipo de la variable'
        }
    ]
   },
    {
        name: 'TypeOf',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion a evaluar'
            }
        ]
    },
    {
        name: 'Sprint',
        extends: 'Expresion',
        props: [
            {
                name: 'args',
                type: 'Expresion[]',
                description: 'Expresion a evaluar'
            }
        ]

    }
]

let code = ''

// Tipos base
types.forEach(type => {
    code += type + '\n'
})



code += `
/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */
`

const baseClass = configuracionNodos.find(nodo => nodo.base)

configuracionNodos.forEach(nodo => {


    code += `
export class ${nodo.name} ${baseClass && nodo.extends ? `extends ${nodo.extends}` : ''} {

    /**
    * @param {Object} options
    * ${nodo.props.map(prop => `@param {${prop.type}} options.${prop.name} ${prop.description}`).join('\n * ')}
    */
    constructor(${!nodo.base && `{ ${nodo.props.map(prop => `${prop.name}`).join(', ')} }` || ''}) {
        ${baseClass && nodo.extends ? `super();` : ''}
        ${nodo.props.map(prop => `
        /**
         * ${prop.description}
         * @type {${prop.type}}
        */
        this.${prop.name} = ${prop.default || `${prop.name}`};
`).join('\n')}
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visit${nodo.name}(this);
    }
}
    `
})

code += `
export default { ${configuracionNodos.map(nodo => nodo.name).join(', ')} }
`


fs.writeFileSync('./nodos.js', code)
console.log('Archivo de clases de nodo generado correctamente')


// Visitor
// @typedef {import('./nodos').Expresion} Expresion
code = `
/**
${configuracionNodos.map(nodo => `
 * @typedef {import('./nodos').${nodo.name}} ${nodo.name}
`).join('\n')}
 */
`

code += `

/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    ${configuracionNodos.map(nodo => `
    /**
     * @param {${nodo.name}} node
     * @returns {any}
     */
    visit${nodo.name}(node) {
        throw new Error('Metodo visit${nodo.name} no implementado');
    }
    `).join('\n')
    }
}
`

fs.writeFileSync('./visitor.js', code)
console.log('Archivo de visitor generado correctamente')