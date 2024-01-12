'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
require("reflect-metadata");
const server_container_1 = require("../server/server-container");
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should be bound to a given path.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ PUT
 *   @ Path(':id')
 *   savePerson(person:Person) {
 *      // ...
 *   }
 *
 *   @ GET
 *   @ Path(':id')
 *   getPerson():Person {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create services that listen for requests like:
 *
 * ```
 * PUT http://mydomain/people/123 or
 * GET http://mydomain/people/123
 * ```
 */
function Path(path) {
    return new ServiceDecorator('Path').withProperty('path', path)
        .createDecorator();
}
exports.Path = Path;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should include a determined role
 * or all authorized users (token) using passport
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * @ Security()
 * class PeopleService {
 *   @ PUT
 *   @ Path(':id', true)
 *   @ Security(['ROLE_ADMIN'])
 *   savePerson(person:Person) {
 *      // ...
 *   }
 *
 *   @ GET
 *   @ Path(':id', true)
 *   getPerson():Person {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create services that listen for requests like:
 *
 * ```
 * PUT http://mydomain/people/123 (Only for ADMIN roles) or
 * GET http://mydomain/people/123 (For all authorized users)
 * ```
 */
function Security(roles, name) {
    roles = _.castArray(roles || '*');
    return new ServiceDecorator('Security')
        .withProperty('roles', roles)
        .withProperty('authenticator', name || 'default')
        .createDecorator();
}
exports.Security = Security;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should include a pre-processor in its request pipelines.
 *
 * For example:
 * ```
 * function validator(req: express.Request): express.Request {
 *   if (!req.body.userId) {
 *      throw new Errors.BadRequestError("userId not present");
 *   }
 * }
 * ```
 * And:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ PUT
 *   @ Path(':id')
 *   @ PreProcessor(validator)
 *   savePerson(person:Person) {
 *      // ...
 *   }
 * }
 * ```
 */
function PreProcessor(preprocessor) {
    return new ProcessorServiceDecorator('PreProcessor')
        .withArrayProperty('preProcessors', preprocessor, true)
        .createDecorator();
}
exports.PreProcessor = PreProcessor;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should include a post-processor in its request pipelines.
 *
 * For example:
 * ```
 * function processor(req: express.Request): express.Request {
 *   if (!req.body.userId) {
 *      throw new Errors.BadRequestError("userId not present");
 *   }
 * }
 * ```
 * And:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ PUT
 *   @ Path(':id')
 *   @ PostProcessor(validator)
 *   savePerson(person:Person) {
 *      // ...
 *   }
 * }
 * ```
 */
function PostProcessor(postprocessor) {
    return new ProcessorServiceDecorator('PostProcessor')
        .withArrayProperty('postProcessors', postprocessor, true)
        .createDecorator();
}
exports.PostProcessor = PostProcessor;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should only accept requests from clients that accepts one of
 * the supported languages.
 *
 * For example:
 *
 * ```
 * @ Path('accept')
 * @ AcceptLanguage('en', 'pt-BR')
 * class TestAcceptService {
 *      // ...
 * }
 * ```
 *
 * Will reject requests that only accepts languages that are not
 * English or Brazilian portuguese
 *
 * If the language requested is not supported, a status code 406 returned
 */
function AcceptLanguage(...languages) {
    languages = _.compact(languages);
    return new AcceptServiceDecorator('AcceptLanguage').withArrayProperty('languages', languages, true)
        .createDecorator();
}
exports.AcceptLanguage = AcceptLanguage;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should only accept requests from clients that accepts one of
 * the supported mime types.
 *
 * For example:
 *
 * ```
 * @ Path('accept')
 * @ Accept('application/json')
 * class TestAcceptService {
 *      // ...
 * }
 * ```
 *
 * Will reject requests that only accepts mime types that are not
 * 'application/json'
 *
 * If the mime type requested is not supported, a status code 406 returned
 */
function Accept(...accepts) {
    accepts = _.compact(accepts);
    return new AcceptServiceDecorator('Accept').withArrayProperty('accepts', accepts, true)
        .createDecorator();
}
exports.Accept = Accept;
/**
 * A decorator to inform options to pe passed to bodyParser.
 * You can inform any property accepted by
 * [[bodyParser]](https://www.npmjs.com/package/body-parser)
 */
function BodyOptions(options) {
    return new ServiceDecorator('BodyOptions').withProperty('bodyParserOptions', options)
        .createDecorator();
}
exports.BodyOptions = BodyOptions;
/**
 * A decorator to inform the type of parser to be used to parse the body.
 * The default type is json.
 */
function BodyType(type) {
    return new ServiceDecorator('BodyType').withProperty('bodyParserType', type)
        .createDecorator();
}
exports.BodyType = BodyType;
/**
 * A decorator to inform that server should ignore other middlewares.
 * It makes server does not call next function after service invocation.
 */
function IgnoreNextMiddlewares(...args) {
    return new ServiceDecorator('IgnoreNextMiddlewares').withProperty('ignoreNextMiddlewares', true)
        .decorateTypeOrMethod(args);
}
exports.IgnoreNextMiddlewares = IgnoreNextMiddlewares;
/**
 * Mark the annotated service class as an abstract service. Abstract services has none of its
 * methods exposed as rest enpoints, even if the class is in the services list to be exposed.
 *
 * For example:
 *
 * ```
 * @ Abstract
 * abstract class PeopleService {
 *   @ GET
 *   getPeople(@ Param('name') name: string) {
 *      // ...
 *   }
 * }
 * ```
 *
 * No endpoint will be registered for PeopleService. It is useful if you only plain that subclasses of
 * PeopleService exposes the getPeople method.
 */
function Abstract(...args) {
    args = _.without(args, undefined);
    if (args.length === 1) {
        const classData = server_container_1.ServerContainer.get().registerServiceClass(args[0]);
        classData.isAbstract = true;
    }
    else {
        throw new Error('Invalid @Abstract Decorator declaration.');
    }
}
exports.Abstract = Abstract;
class ServiceDecorator {
    constructor(decorator) {
        this.properties = [];
        this.decorator = decorator;
    }
    withProperty(property, value, required = false) {
        this.properties.push({
            checkRequired: () => required && !value,
            process: (target) => {
                target[property] = value;
            },
            property: property,
            required: required,
            value: value
        });
        return this;
    }
    createDecorator() {
        return (...args) => {
            this.checkRequiredValue();
            this.decorateTypeOrMethod(args);
        };
    }
    decorateTypeOrMethod(args) {
        args = _.without(args, undefined);
        if (args.length === 1) {
            this.decorateType(args[0]);
        }
        else if (args.length === 3 && typeof args[2] === 'object') {
            this.decorateMethod(args[0], args[1]);
        }
        else {
            throw new Error(`Invalid @${this.decorator} Decorator declaration.`);
        }
    }
    checkRequiredValue() {
        this.properties.forEach(property => {
            if (property.checkRequired()) {
                throw new Error(`Invalid @${this.decorator} Decorator declaration.`);
            }
        });
    }
    decorateType(target) {
        const classData = server_container_1.ServerContainer.get().registerServiceClass(target);
        if (classData) {
            this.updateClassMetadata(classData);
        }
    }
    decorateMethod(target, propertyKey) {
        const serviceMethod = server_container_1.ServerContainer.get().registerServiceMethod(target.constructor, propertyKey);
        if (serviceMethod) { // does not intercept constructor
            this.updateMethodMetadada(serviceMethod);
        }
    }
    updateClassMetadata(classData) {
        this.properties.forEach(property => {
            property.process(classData);
        });
    }
    updateMethodMetadada(serviceMethod) {
        this.properties.forEach(property => {
            property.process(serviceMethod);
        });
    }
}
class ProcessorServiceDecorator extends ServiceDecorator {
    withArrayProperty(property, value, required = false) {
        this.properties.push({
            checkRequired: () => required && !value,
            process: (target) => {
                if (!target[property]) {
                    target[property] = [];
                }
                target[property].unshift(value);
            },
            property: property,
            required: required,
            value: value
        });
        return this;
    }
}
class AcceptServiceDecorator extends ServiceDecorator {
    withArrayProperty(property, value, required = false) {
        this.properties.push({
            checkRequired: () => required && (!value || !value.length),
            process: (target) => {
                target[property] = _.union(target[property], value);
            },
            property: property,
            required: required,
            value: value
        });
        return this;
    }
}
//# sourceMappingURL=services.js.map