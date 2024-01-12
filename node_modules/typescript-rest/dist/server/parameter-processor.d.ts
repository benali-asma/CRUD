import { ServiceProperty } from './model/metadata';
import { ServiceContext } from './model/server-types';
export declare class ParameterProcessor {
    static get(): ParameterProcessor;
    private static instance;
    private static defaultParamConverter;
    private parameterMapper;
    private debugger;
    private constructor();
    processParameter(context: ServiceContext, property: ServiceProperty): any;
    private initializeParameterMappers;
    private convertType;
}
