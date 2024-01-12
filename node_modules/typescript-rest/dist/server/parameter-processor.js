'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const typescript_rest_1 = require("../typescript-rest");
const metadata_1 = require("./model/metadata");
const server_container_1 = require("./server-container");
class ParameterProcessor {
    constructor() {
        this.debugger = {
            build: debug('typescript-rest:parameter-processor:build'),
            runtime: debug('typescript-rest:parameter-processor:runtime')
        };
        this.parameterMapper = this.initializeParameterMappers();
    }
    static get() {
        return ParameterProcessor.instance;
    }
    processParameter(context, property) {
        const processor = this.parameterMapper.get(property.type);
        if (!processor) {
            throw new typescript_rest_1.Errors.BadRequestError('Invalid parameter type');
        }
        return processor(context, property);
    }
    initializeParameterMappers() {
        this.debugger.build('Initializing parameters processors');
        const parameterMapper = new Map();
        parameterMapper.set(metadata_1.ParamType.path, (context, property) => this.convertType(context.request.params[property.name], property.propertyType));
        parameterMapper.set(metadata_1.ParamType.query, (context, property) => this.convertType(context.request.query[property.name], property.propertyType));
        parameterMapper.set(metadata_1.ParamType.header, (context, property) => this.convertType(context.request.header(property.name), property.propertyType));
        parameterMapper.set(metadata_1.ParamType.cookie, (context, property) => this.convertType(context.request.cookies[property.name], property.propertyType));
        parameterMapper.set(metadata_1.ParamType.body, (context, property) => this.convertType(context.request.body, property.propertyType));
        parameterMapper.set(metadata_1.ParamType.file, (context, property) => {
            this.debugger.runtime('Processing file parameter');
            // @ts-ignore
            const files = context.request.files ? context.request.files[property.name] : null;
            if (files && files.length > 0) {
                return files[0];
            }
            return null;
        });
        parameterMapper.set(metadata_1.ParamType.files, (context, property) => {
            this.debugger.runtime('Processing files parameter');
            // @ts-ignore
            return context.request.files[property.name];
        });
        parameterMapper.set(metadata_1.ParamType.form, (context, property) => this.convertType(context.request.body[property.name], property.propertyType));
        parameterMapper.set(metadata_1.ParamType.param, (context, property) => {
            const paramValue = context.request.body[property.name] ||
                context.request.query[property.name];
            return this.convertType(paramValue, property.propertyType);
        });
        parameterMapper.set(metadata_1.ParamType.context, (context) => context);
        parameterMapper.set(metadata_1.ParamType.context_request, (context) => context.request);
        parameterMapper.set(metadata_1.ParamType.context_response, (context) => context.response);
        parameterMapper.set(metadata_1.ParamType.context_next, (context) => context.next);
        parameterMapper.set(metadata_1.ParamType.context_accept, (context) => context.accept);
        parameterMapper.set(metadata_1.ParamType.context_accept_language, (context) => context.language);
        return parameterMapper;
    }
    convertType(paramValue, paramType) {
        const serializedType = paramType['name'];
        this.debugger.runtime('Processing parameter. received type: %s, received value:', serializedType, paramValue);
        switch (serializedType) {
            case 'Number':
                return paramValue === undefined ? paramValue : parseFloat(paramValue);
            case 'Boolean':
                return paramValue === undefined ? paramValue : paramValue === 'true' || paramValue === true;
            default:
                let converter = server_container_1.ServerContainer.get().paramConverters.get(paramType);
                if (!converter) {
                    converter = ParameterProcessor.defaultParamConverter;
                }
                return converter(paramValue);
        }
    }
}
exports.ParameterProcessor = ParameterProcessor;
ParameterProcessor.instance = new ParameterProcessor();
ParameterProcessor.defaultParamConverter = (p) => p;
//# sourceMappingURL=parameter-processor.js.map