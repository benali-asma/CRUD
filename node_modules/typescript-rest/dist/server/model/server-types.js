'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The supported HTTP methods.
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["PATCH"] = "PATCH";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
/**
 * Represents the current context of the request being handled.
 */
class ServiceContext {
}
exports.ServiceContext = ServiceContext;
/**
 * Used to create a reference to a resource.
 */
class ReferencedResource {
    /**
     * Constructor. Receives the location of the resource.
     * @param location To be added to the Location header on response
     * @param statusCode the response status code to be sent
     */
    constructor(location, statusCode) {
        this.location = location;
        this.statusCode = statusCode;
    }
}
exports.ReferencedResource = ReferencedResource;
/**
 * The types of parsers to parse the message body
 */
var ParserType;
(function (ParserType) {
    ParserType["json"] = "json";
    ParserType["text"] = "text";
    ParserType["raw"] = "raw";
})(ParserType = exports.ParserType || (exports.ParserType = {}));
//# sourceMappingURL=server-types.js.map