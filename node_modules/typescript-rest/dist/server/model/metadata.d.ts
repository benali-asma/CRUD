import { HttpMethod, ParserType, ServiceProcessor } from './server-types';
export interface ServiceProperty {
    type: ParamType;
    name: string;
    propertyType: any;
}
/**
 * Metadata for REST service classes
 */
export declare class ServiceClass {
    [key: string]: any;
    targetClass: any;
    path: string;
    roles: Array<string>;
    authenticator: string;
    preProcessors: Array<ServiceProcessor>;
    postProcessors: Array<ServiceProcessor>;
    methods: Map<string, ServiceMethod>;
    bodyParserOptions: any;
    bodyParserType: ParserType;
    languages: Array<string>;
    accepts: Array<string>;
    properties: Map<string, ServiceProperty>;
    isAbstract: boolean;
    ignoreNextMiddlewares: boolean;
    constructor(targetClass: any);
    addProperty(key: string, property: ServiceProperty): void;
    hasProperties(): boolean;
}
/**
 * Metadata for REST service methods
 */
export declare class ServiceMethod {
    [key: string]: any;
    name: string;
    path: string;
    roles: Array<string>;
    authenticator: string;
    resolvedPath: string;
    httpMethod: HttpMethod;
    parameters: Array<MethodParam>;
    mustParseCookies: boolean;
    files: Array<FileParam>;
    mustParseBody: boolean;
    bodyParserOptions: any;
    bodyParserType: ParserType;
    mustParseForms: boolean;
    acceptMultiTypedParam: boolean;
    languages: Array<string>;
    accepts: Array<string>;
    resolvedLanguages: Array<string>;
    resolvedAccepts: Array<string>;
    preProcessors: Array<ServiceProcessor>;
    postProcessors: Array<ServiceProcessor>;
    ignoreNextMiddlewares: boolean;
}
/**
 * Metadata for File parameters on REST methods
 */
export declare class FileParam {
    name: string;
    singleFile: boolean;
    constructor(name: string, singleFile: boolean);
}
/**
 * Metadata for REST service method parameters
 */
export declare class MethodParam {
    name: string;
    type: Function;
    paramType: ParamType;
    constructor(name: string, type: Function, paramType: ParamType);
}
/**
 * Enumeration of accepted parameter types
 */
export declare enum ParamType {
    path = "path",
    query = "query",
    header = "header",
    cookie = "cookie",
    form = "form",
    body = "body",
    param = "param",
    file = "file",
    files = "files",
    context = "context",
    context_request = "context_request",
    context_response = "context_response",
    context_next = "context_next",
    context_accept = "context_accept",
    context_accept_language = "context_accept_language"
}
