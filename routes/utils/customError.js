class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomError";
    }
    add({HTTPstatus,code}){
        this.HTTPstatus=HTTPstatus
        this.code=code
        return this
    }
}

// Attach the custom error to the global object in Node.js
if (typeof global !== "undefined") {
    global.CustomError = CustomError;
}

module.exports = CustomError;