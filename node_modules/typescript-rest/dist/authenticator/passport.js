'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const passport = require("passport");
class PassportAuthenticator {
    constructor(strategy, options = {}) {
        this.options = options;
        const authStrategy = options.strategyName || strategy.name || 'default_strategy';
        passport.use(authStrategy, strategy);
        this.authenticator = passport.authenticate(authStrategy, options.authOptions || {});
    }
    getMiddleware() {
        return this.authenticator;
    }
    getRoles(req) {
        const roleKey = this.options.rolesKey || 'roles';
        return _.castArray(_.get(req.user, roleKey, []));
    }
    initialize(router) {
        router.use(passport.initialize());
        const useSession = _.get(this.options, 'authOptions.session', true);
        if (useSession) {
            router.use(passport.session());
            if (this.options.serializeUser && this.options.deserializeUser) {
                passport.serializeUser((user, done) => {
                    Promise.resolve(this.options.serializeUser(user))
                        .then((result) => {
                        done(null, result);
                    }).catch((err) => {
                        done(err, null);
                    });
                });
                passport.deserializeUser((user, done) => {
                    Promise.resolve(this.options.deserializeUser(user))
                        .then((result) => {
                        done(null, result);
                    }).catch((err) => {
                        done(err, null);
                    });
                });
            }
        }
    }
}
exports.PassportAuthenticator = PassportAuthenticator;
//# sourceMappingURL=passport.js.map