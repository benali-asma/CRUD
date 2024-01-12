'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
require("reflect-metadata");
const metadata_1 = require("../server/model/metadata");
const server_container_1 = require("../server/server-container");
/**
 * A decorator to be used on class properties or on service method arguments
 * to inform that the decorated property or argument should be bound to the
 * [[ServiceContext]] object associated to the current request.
 *
 * For example:
 *
 * ```
 * @ Path('context')
 * class TestService {
 *   @ Context
 *   context: ServiceContext;
 *   // ...
 * }
 * ```
 *
 * The field context on the above class will point to the current
 * [[ServiceContext]] instance.
 */
function Context(...args) {
    return new ParameterDecorator('Context').withType(metadata_1.ParamType.context)
        .decorateParameterOrProperty(args);
}
exports.Context = Context;
/**
 * A decorator to be used on class properties or on service method arguments
 * to inform that the decorated property or argument should be bound to the
 * the current request.
 *
 * For example:
 *
 * ```
 * @ Path('context')
 * class TestService {
 *   @ ContextRequest
 *   request: express.Request;
 *   // ...
 * }
 * ```
 *
 * The field request on the above class will point to the current
 * request.
 */
function ContextRequest(...args) {
    return new ParameterDecorator('ContextRequest').withType(metadata_1.ParamType.context_request)
        .decorateParameterOrProperty(args);
}
exports.ContextRequest = ContextRequest;
/**
 * A decorator to be used on class properties or on service method arguments
 * to inform that the decorated property or argument should be bound to the
 * the current response object.
 *
 * For example:
 *
 * ```
 * @ Path('context')
 * class TestService {
 *   @ ContextResponse
 *   response: express.Response;
 *   // ...
 * }
 * ```
 *
 * The field response on the above class will point to the current
 * response object.
 */
function ContextResponse(...args) {
    return new ParameterDecorator('ContextResponse').withType(metadata_1.ParamType.context_response)
        .decorateParameterOrProperty(args);
}
exports.ContextResponse = ContextResponse;
/**
 * A decorator to be used on class properties or on service method arguments
 * to inform that the decorated property or argument should be bound to the
 * the next function.
 *
 * For example:
 *
 * ```
 * @ Path('context')
 * class TestService {
 *   @ ContextNext
 *   next: express.NextFunction
 *       // ...
 * }
 * ```
 *
 * The next function can be used to delegate to the next registered
 * middleware the current request processing.
 */
function ContextNext(...args) {
    return new ParameterDecorator('ContextNext').withType(metadata_1.ParamType.context_next)
        .decorateParameterOrProperty(args);
}
exports.ContextNext = ContextNext;
/**
 * A decorator to be used on class properties or on service method arguments
 * to inform that the decorated property or argument should be bound to the
 * the current context language.
 *
 * For example:
 *
 * ```
 * @ Path('context')
 * class TestService {
 *   @ ContextLanguage
 *   language: string
 *       // ...
 * }
 * ```
 */
function ContextLanguage(...args) {
    return new ParameterDecorator('ContextLanguage')
        .withType(metadata_1.ParamType.context_accept_language)
        .decorateParameterOrProperty(args);
}
exports.ContextLanguage = ContextLanguage;
/**
 * A decorator to be used on class properties or on service method arguments
 * to inform that the decorated property or argument should be bound to the
 * the preferred media type for the current request.
 *
 * For example:
 *
 * ```
 * @ Path('context')
 * class TestService {
 *   @ ContextAccept
 *   media: string
 *       // ...
 * }
 * ```
 */
function ContextAccept(...args) {
    return new ParameterDecorator('ContextAccept').withType(metadata_1.ParamType.context_accept)
        .decorateParameterOrProperty(args);
}
exports.ContextAccept = ContextAccept;
/**
 * Creates a mapping between a fragment of the requested path and
 * a method argument.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ GET
 *   @ Path(':id')
 *   getPerson(@ PathParam('id') id: string) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests like:
 *
 * ```
 * GET http://mydomain/people/123
 * ```
 *
 * And pass 123 as the id argument on getPerson method's call.
 */
function PathParam(name) {
    return new ParameterDecorator('PathParam').withType(metadata_1.ParamType.path).withName(name)
        .decorateNamedParameterOrProperty();
}
exports.PathParam = PathParam;
/**
 * Creates a mapping between a file on a multipart request and a method
 * argument.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ POST
 *   @ Path('id')
 *   addAvatar(@ PathParam('id') id: string,
 *             @ FileParam('avatar') file: Express.Multer.File) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests and bind the
 * file with name 'avatar' on the requested form to the file
 * argument on addAvatar method's call.
 */
function FileParam(name) {
    return new ParameterDecorator('FileParam').withType(metadata_1.ParamType.file).withName(name)
        .decorateNamedParameterOrProperty();
}
exports.FileParam = FileParam;
/**
 * Creates a mapping between a list of files on a multipart request and a method
 * argument.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ POST
 *   @ Path('id')
 *   addAvatar(@ PathParam('id') id: string,
 *             @ FilesParam('avatar[]') files: Array<Express.Multer.File>) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests and bind the
 * files with name 'avatar' on the request form to the file
 * argument on addAvatar method's call.
 */
function FilesParam(name) {
    return new ParameterDecorator('FilesParam').withType(metadata_1.ParamType.files).withName(name)
        .decorateNamedParameterOrProperty();
}
exports.FilesParam = FilesParam;
/**
 * Creates a mapping between a query parameter on request and a method
 * argument.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ GET
 *   getPeople(@ QueryParam('name') name: string) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests like:
 *
 * ```
 * GET http://mydomain/people?name=joe
 * ```
 *
 * And pass 'joe' as the name argument on getPerson method's call.
 */
function QueryParam(name) {
    return new ParameterDecorator('QueryParam').withType(metadata_1.ParamType.query).withName(name)
        .decorateNamedParameterOrProperty();
}
exports.QueryParam = QueryParam;
/**
 * Creates a mapping between a header on request and a method
 * argument.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ GET
 *   getPeople(@ HeaderParam('header') header: string) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests and bind the
 * header called 'header' to the header argument on getPerson method's call.
 */
function HeaderParam(name) {
    return new ParameterDecorator('HeaderParam').withType(metadata_1.ParamType.header).withName(name)
        .decorateNamedParameterOrProperty();
}
exports.HeaderParam = HeaderParam;
/**
 * Creates a mapping between a cookie on request and a method
 * argument.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ GET
 *   getPeople(@ CookieParam('cookie') cookie: string) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests and bind the
 * cookie called 'cookie' to the cookie argument on getPerson method's call.
 */
function CookieParam(name) {
    return new ParameterDecorator('CookieParam').withType(metadata_1.ParamType.cookie).withName(name)
        .decorateNamedParameterOrProperty();
}
exports.CookieParam = CookieParam;
/**
 * Creates a mapping between a form parameter on request and a method
 * argument.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ GET
 *   getPeople(@ FormParam('name') name: string) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests and bind the
 * request paramenter called 'name' to the name argument on getPerson
 * method's call.
 */
function FormParam(name) {
    return new ParameterDecorator('FormParam').withType(metadata_1.ParamType.form).withName(name)
        .decorateNamedParameterOrProperty();
}
exports.FormParam = FormParam;
/**
 * Creates a mapping between a parameter on request and a method
 * argument.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ GET
 *   getPeople(@ Param('name') name: string) {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create a service that listen for requests and bind the
 * request paramenter called 'name' to the name argument on getPerson
 * method's call. It will work to query parameters or form parameters
 * received in the current request.
 */
function Param(name) {
    return new ParameterDecorator('Param').withType(metadata_1.ParamType.param).withName(name)
        .decorateNamedParameterOrProperty();
}
exports.Param = Param;
class ParameterDecorator {
    constructor(decorator) {
        this.nameRequired = false;
        this.name = null;
        this.decorator = decorator;
    }
    withType(paramType) {
        this.paramType = paramType;
        return this;
    }
    withName(name) {
        this.nameRequired = true;
        this.name = name ? name.trim() : '';
        return this;
    }
    decorateParameterOrProperty(args) {
        if (!this.nameRequired || this.name) {
            args = _.without(args, undefined);
            if (args.length < 3 || typeof args[2] === 'undefined') {
                return this.decorateProperty(args[0], args[1]);
            }
            else if (args.length === 3 && typeof args[2] === 'number') {
                return this.decorateParameter(args[0], args[1], args[2]);
            }
        }
        throw new Error(`Invalid @${this.decorator} Decorator declaration.`);
    }
    decorateNamedParameterOrProperty() {
        return (...args) => {
            return this.decorateParameterOrProperty(args);
        };
    }
    decorateParameter(target, propertyKey, parameterIndex) {
        const serviceMethod = server_container_1.ServerContainer.get().registerServiceMethod(target.constructor, propertyKey);
        if (serviceMethod) { // does not intercept constructor
            const paramTypes = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey);
            while (paramTypes && serviceMethod.parameters.length < paramTypes.length) {
                serviceMethod.parameters.push(new metadata_1.MethodParam(null, paramTypes[serviceMethod.parameters.length], metadata_1.ParamType.body));
            }
            serviceMethod.parameters[parameterIndex] =
                new metadata_1.MethodParam(this.name, paramTypes[parameterIndex], this.paramType);
        }
    }
    decorateProperty(target, key) {
        const classData = server_container_1.ServerContainer.get().registerServiceClass(target.constructor);
        const propertyType = Reflect.getMetadata('design:type', target, key);
        classData.addProperty(key, {
            name: this.name,
            propertyType: propertyType,
            type: this.paramType
        });
    }
}
//# sourceMappingURL=parameters.js.map