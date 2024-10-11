import { Primitivo } from "../Compilador/nodos.js";
export class BreakException extends Error {
    constructor() {
        super('Break');
    }
}

export class ContinueException extends Error {
    constructor() {
        super('Continue');
    }
}

export class ReturnException extends Error {
    /**
     * @param {Primitivo} value
     */
    constructor(value) {
        super('Return');
        this.valor = value;
    }
}