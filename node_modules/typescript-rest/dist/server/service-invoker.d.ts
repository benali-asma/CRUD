import { ServiceClass, ServiceMethod } from './model/metadata';
import { ServiceContext } from './model/server-types';
export declare class ServiceInvoker {
    private serviceClass;
    private serviceMethod;
    private preProcessors;
    private postProcessors;
    private debugger;
    constructor(serviceClass: ServiceClass, serviceMethod: ServiceMethod);
    callService(context: ServiceContext): Promise<void>;
    private mustCallNext;
    private runPreProcessors;
    private runPostProcessors;
    private callTargetEndPoint;
    private getMethodToCall;
    private checkAcceptance;
    private identifyAcceptedLanguage;
    private identifyAcceptedType;
    private createService;
    private buildArgumentsList;
    private processParameter;
    private processResponseHeaders;
    private sendValue;
    private sendComplexValue;
    private sendReferencedResource;
    private sendFile;
    private downloadResToPromise;
}
