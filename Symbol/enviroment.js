import { ErrorData } from "../Symbol/errores.js";

export class enviroment {
  constructor(padre = null) {
    this.name = "";
    this.prev = padre;
    this.variables = {};
    }


    setVariable(name, value,location) {
        if (this.variables.hasOwnProperty(name)) {
            throw new ErrorData('La variable ya ha sido declarada',location);
        }
        this.variables[name] = value;
    }
    getVariable(name) {
        if (this.variables.hasOwnProperty(name)) {
            return this.variables[name];
        }
        if (this.prev) {
            return this.prev.getVariable(name);
        }
        throw new Error(`La variable ${name} no ha sido declarada`);
    }
    assignvariables(nombre, valor) {
        const valorActual = this.variables[nombre];

        if (valorActual !== undefined) {
            this.variables[nombre] = valor;
            return;
        }

        if (!valorActual && this.prev) {
            this.prev.assignvariables(nombre, valor);
            return;
        }

        throw new Error(`Variable ${nombre} no definida`);
    }

    getAllVariableNames() {
        // Obtiene los nombres de las variables en el contexto actual
        const currentNames = Object.keys(this.variables);
        // Retorna los nombres actuales como un string separados por comas
        return currentNames.join(' , ');
    }

}