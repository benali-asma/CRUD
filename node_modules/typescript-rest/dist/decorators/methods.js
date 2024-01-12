'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const metadata_1 = require("../server/model/metadata");
const server_types_1 = require("../server/model/server-types");
const server_container_1 = require("../server/server-container");
/**
 * A decorator to tell the [[Server]] that a method
 * should be called to process HTTP GET requests.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ GET
 *   getPeople() {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests like:
 *
 * ```
 * GET http://mydomain/people
 * ```
 */
function GET(target, propertyKey) {
    new MethodDecorator(server_types_1.HttpMethod.GET).decorateMethod(target, propertyKey);
}
exports.GET = GET;
/**
 * A decorator to tell the [[Server]] that a method
 * should be called to process HTTP POST requests.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ POST
 *   addPerson() {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests like:
 *
 * ```
 * POST http://mydomain/people
 * ```
 */
function POST(target, propertyKey) {
    new MethodDecorator(server_types_1.HttpMethod.POST).decorateMethod(target, propertyKey);
}
exports.POST = POST;
/**
 * A decorator to tell the [[Server]] that a method
 * should be called to process HTTP PUT requests.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ PUT
 *   @ Path(':id')
 *   savePerson(person: Person) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests like:
 *
 * ```
 * PUT http://mydomain/people/123
 * ```
 */
function PUT(target, propertyKey) {
    new MethodDecorator(server_types_1.HttpMethod.PUT).decorateMethod(target, propertyKey);
}
exports.PUT = PUT;
/**
 * A decorator to tell the [[Server]] that a method
 * should be called to process HTTP DELETE requests.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ DELETE
 *   @ Path(':id')
 *   removePerson(@ PathParam('id')id: string) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests like:
 *
 * ```
 * PUT http://mydomain/people/123
 * ```
 */
function DELETE(target, propertyKey) {
    new MethodDecorator(server_types_1.HttpMethod.DELETE).decorateMethod(target, propertyKey);
}
exports.DELETE = DELETE;
/**
 * A decorator to tell the [[Server]] that a method
 * should be called to process HTTP HEAD requests.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ HEAD
 *   headPerson() {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests like:
 *
 * ```
 * HEAD http://mydomain/people/123
 * ```
 */
function HEAD(target, propertyKey) {
    new MethodDecorator(server_types_1.HttpMethod.HEAD).decorateMethod(target, propertyKey);
}
exports.HEAD = HEAD;
/**
 * A decorator to tell the [[Server]] that a method
 * should be called to process HTTP OPTIONS requests.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ OPTIONS
 *   optionsPerson() {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests like:
 *
 * ```
 * OPTIONS http://mydomain/people/123
 * ```
 */
function OPTIONS(target, propertyKey) {
    new MethodDecorator(server_types_1.HttpMethod.OPTIONS).decorateMethod(target, propertyKey);
}
exports.OPTIONS = OPTIONS;
/**
 * A decorator to tell the [[Server]] that a method
 * should be called to process HTTP PATCH requests.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ PATCH
 *   @ Path(':id')
 *   savePerson(person: Person) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests like:
 *
 * ```
 * PATCH http://mydomain/people/123
 * ```
 */
function PATCH(target, propertyKey) {
    new MethodDecorator(server_types_1.HttpMethod.PATCH).decorateMethod(target, propertyKey);
}
exports.PATCH = PATCH;
class MethodDecorator {
    constructor(httpMethod) {
        this.httpMethod = httpMethod;
    }
    decorateMethod(target, propertyKey) {
        const serviceMethod = server_container_1.ServerContainer.get().registerServiceMethod(target.constructor, propertyKey);
        if (serviceMethod) { // does not intercept constructor
            if (!serviceMethod.httpMethod) {
                serviceMethod.httpMethod = this.httpMethod;
                this.processServiceMethod(target, propertyKey, serviceMethod);
            }
            else if (serviceMethod.httpMethod !== this.httpMethod) {
                throw new Error('Method is already annotated with @' +
                    server_types_1.HttpMethod[serviceMethod.httpMethod] +
                    '. You can only map a method to one HTTP verb.');
            }
        }
    }
    /**
     * Extract metadata for rest methods
     */
    processServiceMethod(target, propertyKey, serviceMethod) {
        serviceMethod.name = propertyKey;
        const paramTypes = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey);
        this.registerUndecoratedParameters(paramTypes, serviceMethod);
        serviceMethod.parameters.forEach(param => {
            const processor = MethodDecorator.PROCESSORS.get(param.paramType);
            if (processor) {
                processor(serviceMethod, param);
            }
        });
    }
    registerUndecoratedParameters(paramTypes, serviceMethod) {
        while (paramTypes && paramTypes.length > serviceMethod.parameters.length) {
            serviceMethod.parameters.push(new metadata_1.MethodParam(null, paramTypes[serviceMethod.parameters.length], metadata_1.ParamType.body));
        }
    }
}
MethodDecorator.PROCESSORS = getParameterProcessors();
function getParameterProcessors() {
    const result = new Map();
    result.set(metadata_1.ParamType.cookie, (serviceMethod) => {
        serviceMethod.mustParseCookies = true;
    });
    result.set(metadata_1.ParamType.file, (serviceMethod, param) => {
        serviceMethod.files.push(new metadata_1.FileParam(param.name, true));
    });
    result.set(metadata_1.ParamType.files, (serviceMethod, param) => {
        serviceMethod.files.push(new metadata_1.FileParam(param.name, false));
    });
    result.set(metadata_1.ParamType.param, (serviceMethod) => {
        serviceMethod.acceptMultiTypedParam = true;
    });
    result.set(metadata_1.ParamType.form, (serviceMethod) => {
        if (serviceMethod.mustParseBody) {
            throw Error('Can not use form parameters with a body parameter on the same method.');
        }
        serviceMethod.mustParseForms = true;
    });
    result.set(metadata_1.ParamType.body, (serviceMethod) => {
        if (serviceMethod.mustParseForms) {
            throw Error('Can not use form parameters with a body parameter on the same method.');
        }
        if (serviceMethod.mustParseBody) {
            throw Error('Can not use more than one body parameter on the same method.');
        }
        serviceMethod.mustParseBody = true;
    });
    return result;
}
//# sourceMappingURL=methods.js.map