/// <reference types="node" />
import { ReferencedResource } from './server-types';
/**
 * Inform that a new resource was created. Server will
 * add a Location header and set status to 201
 */
export declare class NewResource<T> extends ReferencedResource<T> {
    /**
     * Constructor. Receives the location of the new resource created.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    constructor(location: string, body?: T);
}
/**
 * Inform that the request was accepted but is not completed.
 * A Location header should inform the location where the user
 * can monitor his request processing status.
 */
export declare class RequestAccepted<T> extends ReferencedResource<T> {
    /**
     * Constructor. Receives the location where information about the
     * request processing can be found.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    constructor(location: string, body?: T);
}
/**
 * Inform that the resource has permanently
 * moved to a new location, and that future references should use a
 * new URI with their requests.
 */
export declare class MovedPermanently<T> extends ReferencedResource<T> {
    /**
     * Constructor. Receives the location where the resource can be found.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    constructor(location: string, body?: T);
}
/**
 * Inform that the resource has temporarily
 * moved to another location, but that future references should
 * still use the original URI to access the resource.
 */
export declare class MovedTemporarily<T> extends ReferencedResource<T> {
    /**
     * Constructor. Receives the location where the resource can be found.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    constructor(location: string, body?: T);
}
/**
 * Used to download a resource.
 */
export declare class DownloadResource {
    filePath: string;
    fileName: string;
    /**
     * Constructor.
     * @param filePath The file path to download.
     * @param fileName The file name
     */
    constructor(filePath: string, fileName: string);
}
/**
 * Used to download binary data as a file.
 */
export declare class DownloadBinaryData {
    content: Buffer;
    mimeType: string;
    fileName?: string;
    /**
     * Constructor. Receives the location of the resource.
     * @param content The binary data to be downloaded as a file.
     * @param mimeType The mime-type to be passed on Content-Type header.
     * @param fileName The file name
     */
    constructor(content: Buffer, mimeType: string, fileName?: string);
}
/**
 * If returned by a service, no response will be sent to client. Use it
 * if you want to send the response by yourself.
 */
export declare const NoResponse: {};
