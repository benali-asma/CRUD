'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Metadata for REST service classes
 */
class ServiceClass {
    constructor(targetClass) {
        this.isAbstract = false;
        this.ignoreNextMiddlewares = false;
        this.targetClass = targetClass;
        this.methods = new Map();
        this.properties = new Map();
    }
    addProperty(key, property) {
        this.properties.set(key, property);
    }
    hasProperties() {
        return (this.properties && this.properties.size > 0);
    }
}
exports.ServiceClass = ServiceClass;
/**
 * Metadata for REST service methods
 */
class ServiceMethod {
    constructor() {
        this.parameters = new Array();
        this.mustParseCookies = false;
        this.files = new Array();
        this.mustParseBody = false;
        this.mustParseForms = false;
        this.acceptMultiTypedParam = false;
        this.ignoreNextMiddlewares = false;
    }
}
exports.ServiceMethod = ServiceMethod;
/**
 * Metadata for File parameters on REST methods
 */
class FileParam {
    constructor(name, singleFile) {
        this.name = name;
        this.singleFile = singleFile;
    }
}
exports.FileParam = FileParam;
/**
 * Metadata for REST service method parameters
 */
class MethodParam {
    constructor(name, type, paramType) {
        this.name = name;
        this.type = type;
        this.paramType = paramType;
    }
}
exports.MethodParam = MethodParam;
/**
 * Enumeration of accepted parameter types
 */
var ParamType;
(function (ParamType) {
    ParamType["path"] = "path";
    ParamType["query"] = "query";
    ParamType["header"] = "header";
    ParamType["cookie"] = "cookie";
    ParamType["form"] = "form";
    ParamType["body"] = "body";
    ParamType["param"] = "param";
    ParamType["file"] = "file";
    ParamType["files"] = "files";
    ParamType["context"] = "context";
    ParamType["context_request"] = "context_request";
    ParamType["context_response"] = "context_response";
    ParamType["context_next"] = "context_next";
    ParamType["context_accept"] = "context_accept";
    ParamType["context_accept_language"] = "context_accept_language";
})(ParamType = exports.ParamType || (exports.ParamType = {}));
//# sourceMappingURL=metadata.js.map