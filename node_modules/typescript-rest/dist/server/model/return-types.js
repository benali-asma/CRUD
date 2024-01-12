'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const server_types_1 = require("./server-types");
/**
 * Inform that a new resource was created. Server will
 * add a Location header and set status to 201
 */
class NewResource extends server_types_1.ReferencedResource {
    /**
     * Constructor. Receives the location of the new resource created.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    constructor(location, body) {
        super(location, 201);
        this.body = body;
    }
}
exports.NewResource = NewResource;
/**
 * Inform that the request was accepted but is not completed.
 * A Location header should inform the location where the user
 * can monitor his request processing status.
 */
class RequestAccepted extends server_types_1.ReferencedResource {
    /**
     * Constructor. Receives the location where information about the
     * request processing can be found.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    constructor(location, body) {
        super(location, 202);
        this.body = body;
    }
}
exports.RequestAccepted = RequestAccepted;
/**
 * Inform that the resource has permanently
 * moved to a new location, and that future references should use a
 * new URI with their requests.
 */
class MovedPermanently extends server_types_1.ReferencedResource {
    /**
     * Constructor. Receives the location where the resource can be found.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    constructor(location, body) {
        super(location, 301);
        this.body = body;
    }
}
exports.MovedPermanently = MovedPermanently;
/**
 * Inform that the resource has temporarily
 * moved to another location, but that future references should
 * still use the original URI to access the resource.
 */
class MovedTemporarily extends server_types_1.ReferencedResource {
    /**
     * Constructor. Receives the location where the resource can be found.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    constructor(location, body) {
        super(location, 302);
        this.body = body;
    }
}
exports.MovedTemporarily = MovedTemporarily;
/**
 * Used to download a resource.
 */
class DownloadResource {
    /**
     * Constructor.
     * @param filePath The file path to download.
     * @param fileName The file name
     */
    constructor(filePath, fileName) {
        this.filePath = filePath;
        this.fileName = fileName;
    }
}
exports.DownloadResource = DownloadResource;
/**
 * Used to download binary data as a file.
 */
class DownloadBinaryData {
    /**
     * Constructor. Receives the location of the resource.
     * @param content The binary data to be downloaded as a file.
     * @param mimeType The mime-type to be passed on Content-Type header.
     * @param fileName The file name
     */
    constructor(content, mimeType, fileName) {
        this.content = content;
        this.mimeType = mimeType;
        this.fileName = fileName;
    }
}
exports.DownloadBinaryData = DownloadBinaryData;
/**
 * If returned by a service, no response will be sent to client. Use it
 * if you want to send the response by yourself.
 */
exports.NoResponse = {};
//# sourceMappingURL=return-types.js.map