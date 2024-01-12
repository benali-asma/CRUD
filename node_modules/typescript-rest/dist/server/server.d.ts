/// <reference types="express-serve-static-core" />
/// <reference types="passport" />
import * as express from 'express';
import 'multer';
import { FileLimits, HttpMethod, ParameterConverter, ServiceAuthenticator, ServiceFactory } from './model/server-types';
/**
 * The Http server main class.
 */
export declare class Server {
    /**
     * Create the routes for all classes decorated with our decorators
     */
    static buildServices(router: express.Router, ...types: Array<any>): void;
    /**
     * An alias for Server.loadServices()
     */
    static loadControllers(router: express.Router, patterns: string | Array<string>, baseDir?: string): void;
    /**
     * Load all services from the files that matches the patterns provided
     */
    static loadServices(router: express.Router, patterns: string | Array<string>, baseDir?: string): void;
    /**
     * Makes the server immutable. Any configuration change request to the Server
     * is ignored when immutable is true
     * @param value true to make immutable
     */
    static immutable(value: boolean): void;
    /**
     * Return true if the server is immutable. Any configuration change request to the Server
     * is ignored when immutable is true
     */
    static isImmutable(): boolean;
    /**
     * Retrieve the express router that serves the rest endpoints
     */
    static server(): express.Router;
    /**
     * Return all paths accepted by the Server
     */
    static getPaths(): Array<string>;
    /**
     * Register a custom serviceFactory. It will be used to instantiate the service Objects
     * If You plan to use a custom serviceFactory, You must ensure to call this method before any typescript-rest service declaration.
     */
    static registerServiceFactory(serviceFactory: ServiceFactory | string): void;
    /**
     * Register a service authenticator. It will be used to authenticate users before the service method
     * invocations occurs.
     */
    static registerAuthenticator(authenticator: ServiceAuthenticator, name?: string): void;
    /**
     * Return the set oh HTTP verbs configured for the given path
     * @param servicePath The path to search HTTP verbs
     */
    static getHttpMethods(servicePath: string): Array<HttpMethod>;
    /**
     * A string used for signing cookies. This is optional and if not specified,
     * will not parse signed cookies.
     * @param secret the secret used to sign
     */
    static setCookiesSecret(secret: string): void;
    /**
     * Specifies a function that will be used to decode a cookie's value.
     * This function can be used to decode a previously-encoded cookie value
     * into a JavaScript string.
     * The default function is the global decodeURIComponent, which will decode
     * any URL-encoded sequences into their byte representations.
     *
     * NOTE: if an error is thrown from this function, the original, non-decoded
     * cookie value will be returned as the cookie's value.
     * @param decoder The decoder function
     */
    static setCookiesDecoder(decoder: (val: string) => string): void;
    /**
     * Set where to store the uploaded files
     * @param dest Destination folder
     */
    static setFileDest(dest: string): void;
    /**
     * Set a Function to control which files are accepted to upload
     * @param filter The filter function
     */
    static setFileFilter(filter: (req: Express.Request, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) => void): void;
    /**
     * Set the limits of uploaded data
     * @param limit The data limit
     */
    static setFileLimits(limit: FileLimits): void;
    /**
     * Adds a converter for param values to have an ability to intercept the type that actually will be passed to service
     * @param converter The converter
     * @param type The target type that needs to be converted
     */
    static addParameterConverter(converter: ParameterConverter, type: Function): void;
    /**
     * Remove the converter associated with the given type.
     * @param type The target type that needs to be converted
     */
    static removeParameterConverter(type: Function): void;
    /**
     * Makes the server ignore next middlewares for all endpoints.
     * It has the same effect than add @IgnoreNextMiddlewares to all
     * services.
     * @param value - true to ignore next middlewares.
     */
    static ignoreNextMiddlewares(value: boolean): void;
    /**
     * Creates and endpoint to publish the swagger documentation.
     * @param router Express router
     * @param options Options for swagger endpoint
     */
    static swagger(router: express.Router, options?: SwaggerOptions): void;
    private static locked;
    private static loadSwaggerDocument;
    private static getOptions;
}
export interface SwaggerOptions {
    /**
     * The path to a swagger file (json or yaml)
     */
    filePath?: string;
    /**
     * Where to publish the docs
     */
    endpoint?: string;
    /**
     * The hostname of the service
     */
    host?: string;
    /**
     * The schemes used by the server
     */
    schemes?: Array<string>;
    /**
     * Options to send to swagger-ui
     */
    swaggerUiOptions?: object;
}
