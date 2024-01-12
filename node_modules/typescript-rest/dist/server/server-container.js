'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const debug = require("debug");
const _ = require("lodash");
const multer = require("multer");
const Errors = require("./model/errors");
const metadata_1 = require("./model/metadata");
const server_types_1 = require("./model/server-types");
const service_invoker_1 = require("./service-invoker");
class DefaultServiceFactory {
    create(serviceClass) {
        return new serviceClass();
    }
    getTargetClass(serviceClass) {
        return serviceClass;
    }
}
exports.DefaultServiceFactory = DefaultServiceFactory;
class ServerContainer {
    constructor() {
        this.ignoreNextMiddlewares = false;
        this.authenticator = new Map();
        this.serviceFactory = new DefaultServiceFactory();
        this.paramConverters = new Map();
        this.debugger = {
            build: debug('typescript-rest:server-container:build'),
            runtime: debug('typescript-rest:server-container:runtime')
        };
        this.serverClasses = new Map();
        this.paths = new Map();
        this.pathsResolved = false;
    }
    static get() {
        return ServerContainer.instance;
    }
    registerServiceClass(target) {
        this.pathsResolved = false;
        target = this.serviceFactory.getTargetClass(target);
        if (!this.serverClasses.has(target)) {
            this.debugger.build('Registering a new service class, %o', target);
            this.serverClasses.set(target, new metadata_1.ServiceClass(target));
            this.inheritParentClass(target);
        }
        const serviceClass = this.serverClasses.get(target);
        return serviceClass;
    }
    registerServiceMethod(target, methodName) {
        if (methodName) {
            this.pathsResolved = false;
            const classData = this.registerServiceClass(target);
            if (!classData.methods.has(methodName)) {
                this.debugger.build('Registering the rest method <%s> for the service class, %o', methodName, target);
                classData.methods.set(methodName, new metadata_1.ServiceMethod());
            }
            const serviceMethod = classData.methods.get(methodName);
            return serviceMethod;
        }
        return null;
    }
    getPaths() {
        this.resolveAllPaths();
        const result = new Set();
        this.paths.forEach((value, key) => {
            result.add(key);
        });
        return result;
    }
    getHttpMethods(path) {
        this.resolveAllPaths();
        const methods = this.paths.get(path);
        return methods || new Set();
    }
    buildServices(types) {
        if (types) {
            types = types.map(type => this.serviceFactory.getTargetClass(type));
        }
        this.debugger.build('Creating service endpoints for types: %o', types);
        if (this.authenticator) {
            this.authenticator.forEach((auth, name) => {
                this.debugger.build('Initializing authenticator: %s', name);
                auth.initialize(this.router);
            });
        }
        this.serverClasses.forEach(classData => {
            if (!classData.isAbstract) {
                classData.methods.forEach(method => {
                    if (this.validateTargetType(classData.targetClass, types)) {
                        this.buildService(classData, method);
                    }
                });
            }
        });
        this.pathsResolved = true;
        this.handleNotAllowedMethods();
    }
    inheritParentClass(target) {
        const classData = this.serverClasses.get(target);
        const parent = Object.getPrototypeOf(classData.targetClass.prototype).constructor;
        const parentClassData = this.getServiceClass(parent);
        if (parentClassData) {
            if (parentClassData.methods) {
                parentClassData.methods.forEach((value, key) => {
                    classData.methods.set(key, _.cloneDeep(value));
                });
            }
            if (parentClassData.properties) {
                parentClassData.properties.forEach((value, key) => {
                    classData.properties.set(key, _.cloneDeep(value));
                });
            }
            if (parentClassData.languages) {
                classData.languages = _.union(classData.languages, parentClassData.languages);
            }
            if (parentClassData.accepts) {
                classData.accepts = _.union(classData.accepts, parentClassData.accepts);
            }
        }
        this.debugger.build('Service class registered with the given metadata: %o', classData);
    }
    buildService(serviceClass, serviceMethod) {
        this.debugger.build('Creating service endpoint for method: %o', serviceMethod);
        if (!serviceMethod.resolvedPath) {
            this.resolveProperties(serviceClass, serviceMethod);
        }
        let args = [serviceMethod.resolvedPath];
        args = args.concat(this.buildSecurityMiddlewares(serviceClass, serviceMethod));
        args = args.concat(this.buildParserMiddlewares(serviceClass, serviceMethod));
        args.push(this.buildServiceMiddleware(serviceMethod, serviceClass));
        switch (serviceMethod.httpMethod) {
            case server_types_1.HttpMethod.GET:
                this.router.get.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.POST:
                this.router.post.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.PUT:
                this.router.put.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.DELETE:
                this.router.delete.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.HEAD:
                this.router.head.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.OPTIONS:
                this.router.options.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.PATCH:
                this.router.patch.apply(this.router, args);
                break;
            default:
                throw Error(`Invalid http method for service [${serviceMethod.resolvedPath}]`);
        }
    }
    resolveAllPaths() {
        if (!this.pathsResolved) {
            this.debugger.build('Building the server list of paths');
            this.paths.clear();
            this.serverClasses.forEach(classData => {
                classData.methods.forEach(method => {
                    if (!method.resolvedPath) {
                        this.resolveProperties(classData, method);
                    }
                });
            });
            this.pathsResolved = true;
        }
    }
    getServiceClass(target) {
        target = this.serviceFactory.getTargetClass(target);
        return this.serverClasses.get(target) || null;
    }
    resolveProperties(serviceClass, serviceMethod) {
        this.resolveLanguages(serviceClass, serviceMethod);
        this.resolveAccepts(serviceClass, serviceMethod);
        this.resolvePath(serviceClass, serviceMethod);
    }
    resolveLanguages(serviceClass, serviceMethod) {
        this.debugger.build('Resolving the list of acceptable languages for method %s', serviceMethod.name);
        const resolvedLanguages = _.union(serviceClass.languages, serviceMethod.languages);
        if (resolvedLanguages.length > 0) {
            serviceMethod.resolvedLanguages = resolvedLanguages;
        }
    }
    resolveAccepts(serviceClass, serviceMethod) {
        this.debugger.build('Resolving the list of acceptable types for method %s', serviceMethod.name);
        const resolvedAccepts = _.union(serviceClass.accepts, serviceMethod.accepts);
        if (resolvedAccepts.length > 0) {
            serviceMethod.resolvedAccepts = resolvedAccepts;
        }
    }
    resolvePath(serviceClass, serviceMethod) {
        this.debugger.build('Resolving the path for method %s', serviceMethod.name);
        const classPath = serviceClass.path ? serviceClass.path.trim() : '';
        let resolvedPath = _.startsWith(classPath, '/') ? classPath : '/' + classPath;
        if (_.endsWith(resolvedPath, '/')) {
            resolvedPath = resolvedPath.slice(0, resolvedPath.length - 1);
        }
        if (serviceMethod.path) {
            const methodPath = serviceMethod.path.trim();
            resolvedPath = resolvedPath + (_.startsWith(methodPath, '/') ? methodPath : '/' + methodPath);
        }
        let declaredHttpMethods = this.paths.get(resolvedPath);
        if (!declaredHttpMethods) {
            declaredHttpMethods = new Set();
            this.paths.set(resolvedPath, declaredHttpMethods);
        }
        if (declaredHttpMethods.has(serviceMethod.httpMethod)) {
            throw Error(`Duplicated declaration for path [${resolvedPath}], method [${serviceMethod.httpMethod}].`);
        }
        declaredHttpMethods.add(serviceMethod.httpMethod);
        serviceMethod.resolvedPath = resolvedPath;
    }
    validateTargetType(targetClass, types) {
        if (types && types.length > 0) {
            return (types.indexOf(targetClass) > -1);
        }
        return true;
    }
    handleNotAllowedMethods() {
        this.debugger.build('Creating middleware to handle not allowed methods');
        const paths = this.getPaths();
        paths.forEach((path) => {
            const supported = this.getHttpMethods(path);
            const allowedMethods = new Array();
            supported.forEach((method) => {
                allowedMethods.push(server_types_1.HttpMethod[method]);
            });
            const allowed = allowedMethods.join(', ');
            this.debugger.build('Registering middleware to validate allowed HTTP methods for path %s.', path);
            this.debugger.build('Allowed HTTP methods [%s].', allowed);
            this.router.all(path, (req, res, next) => {
                if (res.headersSent || allowedMethods.indexOf(req.method) > -1) {
                    next();
                }
                else {
                    res.set('Allow', allowed);
                    throw new Errors.MethodNotAllowedError();
                }
            });
        });
    }
    getUploader() {
        if (!this.upload) {
            const options = {};
            if (this.fileDest) {
                options.dest = this.fileDest;
            }
            if (this.fileFilter) {
                options.fileFilter = this.fileFilter;
            }
            if (this.fileLimits) {
                options.limits = this.fileLimits;
            }
            if (options.dest) {
                this.debugger.build('Creating a file Uploader with options: %o.', options);
                this.upload = multer(options);
            }
            else {
                this.debugger.build('Creating a file Uploader with the default options.');
                this.upload = multer();
            }
        }
        return this.upload;
    }
    buildServiceMiddleware(serviceMethod, serviceClass) {
        const serviceInvoker = new service_invoker_1.ServiceInvoker(serviceClass, serviceMethod);
        this.debugger.build('Creating the service middleware for method <%s>.', serviceMethod.name);
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const context = new server_types_1.ServiceContext();
            context.request = req;
            context.response = res;
            context.next = next;
            yield serviceInvoker.callService(context);
        });
    }
    buildSecurityMiddlewares(serviceClass, serviceMethod) {
        const result = new Array();
        let roles = _.compact(_.union(serviceMethod.roles, serviceClass.roles));
        const authenticatorName = serviceMethod.authenticator || serviceClass.authenticator;
        if (this.authenticator && authenticatorName && roles.length) {
            this.debugger.build('Registering an authenticator middleware <%s> for method <%s>.', authenticatorName, serviceMethod.name);
            const authenticator = this.getAuthenticator(authenticatorName);
            result.push(authenticator.getMiddleware());
            roles = roles.filter((role) => role !== '*');
            if (roles.length) {
                this.debugger.build('Registering a role validator middleware <%s> for method <%s>.', authenticatorName, serviceMethod.name);
                this.debugger.build('Roles: <%j>.', roles);
                result.push(this.buildAuthMiddleware(authenticator, roles));
            }
        }
        return result;
    }
    getAuthenticator(authenticatorName) {
        if (!this.authenticator.has(authenticatorName)) {
            throw new Error(`Invalid authenticator name ${authenticatorName}`);
        }
        return this.authenticator.get(authenticatorName);
    }
    buildAuthMiddleware(authenticator, roles) {
        return (req, res, next) => {
            const requestRoles = authenticator.getRoles(req);
            if (this.debugger.runtime.enabled) {
                this.debugger.runtime('Validating authentication roles: <%j>.', requestRoles);
            }
            if (requestRoles.some((role) => roles.indexOf(role) >= 0)) {
                next();
            }
            else {
                throw new Errors.ForbiddenError();
            }
        };
    }
    buildParserMiddlewares(serviceClass, serviceMethod) {
        const result = new Array();
        const bodyParserOptions = serviceMethod.bodyParserOptions || serviceClass.bodyParserOptions;
        if (serviceMethod.mustParseCookies) {
            this.debugger.build('Registering cookie parser middleware for method <%s>.', serviceMethod.name);
            result.push(this.buildCookieParserMiddleware());
        }
        if (serviceMethod.mustParseBody) {
            const bodyParserType = serviceMethod.bodyParserType || serviceClass.bodyParserType || server_types_1.ParserType.json;
            this.debugger.build('Registering body %s parser middleware for method <%s>' +
                ' with options: %j.', server_types_1.ParserType[bodyParserType], serviceMethod.name, bodyParserOptions);
            result.push(this.buildBodyParserMiddleware(serviceMethod, bodyParserOptions, bodyParserType));
        }
        if (serviceMethod.mustParseForms || serviceMethod.acceptMultiTypedParam) {
            this.debugger.build('Registering body form parser middleware for method <%s>' +
                ' with options: %j.', serviceMethod.name, bodyParserOptions);
            result.push(this.buildFormParserMiddleware(bodyParserOptions));
        }
        if (serviceMethod.files.length > 0) {
            this.debugger.build('Registering file parser middleware for method <%s>.', serviceMethod.name);
            result.push(this.buildFilesParserMiddleware(serviceMethod));
        }
        return result;
    }
    buildBodyParserMiddleware(serviceMethod, bodyParserOptions, bodyParserType) {
        switch (bodyParserType) {
            case server_types_1.ParserType.text:
                return this.buildTextBodyParserMiddleware(bodyParserOptions);
            case server_types_1.ParserType.raw:
                return this.buildRawBodyParserMiddleware(bodyParserOptions);
            default:
                return this.buildJsonBodyParserMiddleware(bodyParserOptions);
        }
    }
    buildFilesParserMiddleware(serviceMethod) {
        const options = new Array();
        serviceMethod.files.forEach(fileData => {
            if (fileData.singleFile) {
                options.push({ 'name': fileData.name, 'maxCount': 1 });
            }
            else {
                options.push({ 'name': fileData.name });
            }
        });
        this.debugger.build('Creating file parser with options %j.', options);
        return this.getUploader().fields(options);
    }
    buildFormParserMiddleware(bodyParserOptions) {
        let middleware;
        if (!bodyParserOptions) {
            bodyParserOptions = { extended: true };
        }
        this.debugger.build('Creating form body parser with options %j.', bodyParserOptions);
        middleware = bodyParser.urlencoded(bodyParserOptions);
        return middleware;
    }
    buildJsonBodyParserMiddleware(bodyParserOptions) {
        let middleware;
        this.debugger.build('Creating json body parser with options %j.', bodyParserOptions || {});
        if (bodyParserOptions) {
            middleware = bodyParser.json(bodyParserOptions);
        }
        else {
            middleware = bodyParser.json();
        }
        return middleware;
    }
    buildTextBodyParserMiddleware(bodyParserOptions) {
        let middleware;
        this.debugger.build('Creating text body parser with options %j.', bodyParserOptions || {});
        if (bodyParserOptions) {
            middleware = bodyParser.text(bodyParserOptions);
        }
        else {
            middleware = bodyParser.text();
        }
        return middleware;
    }
    buildRawBodyParserMiddleware(bodyParserOptions) {
        let middleware;
        this.debugger.build('Creating raw body parser with options %j.', bodyParserOptions || {});
        if (bodyParserOptions) {
            middleware = bodyParser.raw(bodyParserOptions);
        }
        else {
            middleware = bodyParser.raw();
        }
        return middleware;
    }
    buildCookieParserMiddleware() {
        const args = [];
        if (this.cookiesSecret) {
            args.push(this.cookiesSecret);
        }
        if (this.cookiesDecoder) {
            args.push({ decode: this.cookiesDecoder });
        }
        this.debugger.build('Creating cookie parser with options %j.', args);
        const middleware = cookieParser.apply(this, args);
        return middleware;
    }
}
exports.ServerContainer = ServerContainer;
ServerContainer.instance = new ServerContainer();
//# sourceMappingURL=server-container.js.map