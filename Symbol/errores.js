export class ErrorData extends Error {
    constructor(message, location) {
        super(message);  // Llama al constructor de Error
        this.name = "ErrorData";  // Nombre del error personalizado
        this.location = location;  // Almacena la ubicación del nodo
    }
}
