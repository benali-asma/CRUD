import 'reflect-metadata';
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
export declare function Context(...args: Array<any>): void;
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
export declare function ContextRequest(...args: Array<any>): void;
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
export declare function ContextResponse(...args: Array<any>): void;
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
export declare function ContextNext(...args: Array<any>): void;
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
export declare function ContextLanguage(...args: Array<any>): void;
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
export declare function ContextAccept(...args: Array<any>): void;
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
export declare function PathParam(name: string): (...args: any[]) => void;
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
export declare function FileParam(name: string): (...args: any[]) => void;
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
export declare function FilesParam(name: string): (...args: any[]) => void;
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
export declare function QueryParam(name: string): (...args: any[]) => void;
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
export declare function HeaderParam(name: string): (...args: any[]) => void;
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
export declare function CookieParam(name: string): (...args: any[]) => void;
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
export declare function FormParam(name: string): (...args: any[]) => void;
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
export declare function Param(name: string): (...args: any[]) => void;
