import * as express from 'express';
import * as passport from 'passport';
import { ServiceAuthenticator } from '../server/model/server-types';
export interface PassportAuthenticatorOptions {
    authOptions?: passport.AuthenticateOptions;
    rolesKey?: string;
    strategyName?: string;
    serializeUser?: (user: any) => string | Promise<string>;
    deserializeUser?: (user: string) => any;
}
export declare class PassportAuthenticator implements ServiceAuthenticator {
    private authenticator;
    private options;
    constructor(strategy: passport.Strategy, options?: PassportAuthenticatorOptions);
    getMiddleware(): express.RequestHandler;
    getRoles(req: express.Request): Array<string>;
    initialize(router: express.Router): void;
}
