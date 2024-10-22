import { parse } from './gramatica/gramatica.js';
import { InterpreterVisitor } from './Compilador/interprete.js';
import { CompilerVisitor } from './Compilador/compilador.js';

document.getElementById('new-file').addEventListener('click', createNewFile);
document.getElementById('save-file').addEventListener('click', saveFile);
document.getElementById('save-run').addEventListener('click', runsave);
document.getElementById('open-file').addEventListener('click', () => document.getElementById('file-input').click());
document.getElementById('file-input').addEventListener('change', openFile);
document.getElementById('Rerrores').addEventListener('click', createRerrores);
document.getElementById('Rsimbolos').addEventListener('click', createRsimbolos);

document.getElementById('run').addEventListener('click', run);
const salida = document.getElementById('consoleOutput');
let tabs = [];
let activeTab = null;
export let errores = [];
let simbolos = [];


function createRerrores(){

    const tabla = document.getElementById('tablaErrores').getElementsByTagName('tbody')[0]; // Seleccionamos el tbody de la tabla
    tabla.innerHTML = ''; // Limpiar contenido anterior

    // Recorrer la lista de símbolos y agregar filas a la tabla
    errores.forEach((e, index) => {
        const row = tabla.insertRow(); // Crear una nueva fila en el tbody

        // Insertar cada valor como una celda
        // Insertar cada valor como una celda, índices empiezan desde 0
        const cellNo = row.insertCell(0);    // Primera columna
        const cellDescripcion = row.insertCell(1);    // Segunda columna
        const cellTipo = row.insertCell(2);  // Cuarta columna
        const cellLinea = row.insertCell(3);   // Quinta columna
        const cellColumna = row.insertCell(4); // Sexta columna

        // Asignar valores a las celdas
        cellNo.textContent = index +1;
        cellDescripcion.textContent = e.desc;
        cellTipo.textContent = e.tipo;
        cellLinea.textContent = e.linea;
        cellColumna.textContent = e.columna;
    });

}
function createRsimbolos(){
    const tabla = document.getElementById('tablaSimbolos').getElementsByTagName('tbody')[0]; // Seleccionamos el tbody de la tabla
    tabla.innerHTML = ''; // Limpiar contenido anterior

    // Recorrer la lista de símbolos y agregar filas a la tabla
    simbolos.forEach((simbolo, index) => {
        const row = tabla.insertRow(); // Crear una nueva fila en el tbody

        // Insertar cada valor como una celda
        // Insertar cada valor como una celda, índices empiezan desde 0
        const cellNo = row.insertCell(0);    // Primera columna
        const cellId = row.insertCell(1);    // Segunda columna
        const cellTipoSimbolo = row.insertCell(2); // Tercera columna
        const cellTipoDato = row.insertCell(3);    // Cuarta columna
        const cellLinea = row.insertCell(4);   // Quinta columna
        const cellColumna = row.insertCell(5); // Sexta columna

        // Asignar valores a las celdas
        cellNo.textContent = index +1;
        cellId.textContent = simbolo.id;
        cellTipoSimbolo.textContent = simbolo.tsim;
        cellTipoDato.textContent = simbolo.tipod;
        cellLinea.textContent = simbolo.linea;
        cellColumna.textContent = simbolo.columna;
    });

}



// Crear un nuevo archivo en blanco
function createNewFile() {
    const fileName = prompt("Nombre del archivo:", `nuevoArchivo${tabs.length + 1}.oak`);
    if (!fileName) return;

    const newTab = { name: fileName, content: '' };
    tabs.push(newTab);
    activeTab = newTab;
    updateTabs();
    updateEditor();
}

// Guardar el archivo actual
function saveFile() {
    if (!activeTab) return;

    const fileContent = document.getElementById('codeEditor').value;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = activeTab.name;
    link.click();
}

function runsave(){
    const fileContent = document.getElementById('consoleOutput').value;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    // Solicitar al usuario el nombre del archivo
    let fileName = prompt("Por favor, ingresa el nombre del archivo:");

    // Si el usuario no ingresó un nombre, usar un nombre predeterminado
    if (!fileName) {
        fileName = "archivo";
    }

    // Añadir la extensión .s si no la tiene
    link.download = fileName.endsWith('.asm') ? fileName : `${fileName}.asm`;

    // Descargar el archivo
    link.click();
}

// Abrir un archivo desde el sistema
function openFile(event) {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith('.oak')) {
        alert('Solo se permiten archivos .oak');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        const newTab = { name: file.name, content: fileContent };
        tabs.push(newTab);
        activeTab = newTab;
        updateTabs();
        updateEditor();
    };
    reader.readAsText(file);
}

function updateTabs() {
    const tabContainer = document.getElementById('tabs-container');
    tabContainer.innerHTML = ''; // Limpiar las pestañas anteriores

    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.classList.add('tab');
        tabElement.textContent = tab.name;
        if (tab === activeTab) {
            tabElement.classList.add('active');
        }
        tabElement.addEventListener('click', () => {
            activeTab = tab;
            updateTabs();
            updateEditor();
        });
        tabContainer.appendChild(tabElement);
    });
}

// Actualizar el contenido del editor
function updateEditor() {
    if (activeTab) {
        document.getElementById('codeEditor').value = activeTab.content;
    } else {
        document.getElementById('codeEditor').value = '';
    }
}

function run(){
    const code = document.getElementById('codeEditor').value;
    try {
        errores = [];
        const sentencias = parse(code);
        const interprete = new InterpreterVisitor();
        for (let i = 0; i < sentencias.length; i++) {
            try{
                if (sentencias[i] !== undefined) {
                    sentencias[i].accept(interprete);
                }
                //salida.innerHTML = compilador.code;
                //salida.innerHTML = interprete?.salida || "";
                //console.log(interprete.salida)
            }catch(error){
                console.log(error)
                errores.push({
                    desc: error.message || "Error desconocido",
                    tipo: "Semantico", // Puedes agregar un tipo si lo deseas
                    linea: error.location?.start.line || "Desconocido",
                    columna: error.location?.start.column || "Desconocido"
                });
            }
        }
        
        simbolos = interprete.simbolos;
 
    } catch (error) {
        console.log(error)
        errores.push({
            desc: error.message || "Error de parsing",
            tipo: "Sintáctico",
            linea: error.location?.start.line || "Desconocido",
            columna: error.location?.start.column || "Desconocido"
        });

        salida.innerHTML += error.message + ' at line ' + error.location.start.line + ' column ' + error.location.start.column
   }
  
    try {
        const sentencias = parse(code);
        const compilador = new CompilerVisitor();
        console.log({ sentencias })
        sentencias.forEach(sentencia => sentencia.accept(compilador))
        salida.innerHTML = compilador.code;
    } catch (error) {
        console.log(error)
    }
}
// Actualizar el contenido del archivo actual al escribir
document.getElementById('codeEditor').addEventListener('input', () => {
    if (activeTab) {
        activeTab.content = document.getElementById('codeEditor').value;
    }
});

