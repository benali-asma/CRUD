/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
/// <reference types="passport" />
import * as express from 'express';
import { ServiceClass, ServiceMethod } from './model/metadata';
import { FileLimits, HttpMethod, ParameterConverter, ServiceAuthenticator, ServiceFactory } from './model/server-types';
export declare class DefaultServiceFactory implements ServiceFactory {
    create(serviceClass: any): any;
    getTargetClass(serviceClass: Function): FunctionConstructor;
}
export declare class ServerContainer {
    static get(): ServerContainer;
    private static instance;
    cookiesSecret: string;
    cookiesDecoder: (val: string) => string;
    fileDest: string;
    fileFilter: (req: Express.Request, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) => void;
    fileLimits: FileLimits;
    ignoreNextMiddlewares: boolean;
    authenticator: Map<string, ServiceAuthenticator>;
    serviceFactory: ServiceFactory;
    paramConverters: Map<Function, ParameterConverter>;
    router: express.Router;
    private debugger;
    private upload;
    private serverClasses;
    private paths;
    private pathsResolved;
    private constructor();
    registerServiceClass(target: Function): ServiceClass;
    registerServiceMethod(target: Function, methodName: string): ServiceMethod;
    getPaths(): Set<string>;
    getHttpMethods(path: string): Set<HttpMethod>;
    buildServices(types?: Array<Function>): void;
    private inheritParentClass;
    private buildService;
    private resolveAllPaths;
    private getServiceClass;
    private resolveProperties;
    private resolveLanguages;
    private resolveAccepts;
    private resolvePath;
    private validateTargetType;
    private handleNotAllowedMethods;
    private getUploader;
    private buildServiceMiddleware;
    private buildSecurityMiddlewares;
    private getAuthenticator;
    private buildAuthMiddleware;
    private buildParserMiddlewares;
    private buildBodyParserMiddleware;
    private buildFilesParserMiddleware;
    private buildFormParserMiddleware;
    private buildJsonBodyParserMiddleware;
    private buildTextBodyParserMiddleware;
    private buildRawBodyParserMiddleware;
    private buildCookieParserMiddleware;
}
