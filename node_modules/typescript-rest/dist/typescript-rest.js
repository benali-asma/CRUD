'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./server/config");
const Errors = require("./server/model/errors");
exports.Errors = Errors;
const Return = require("./server/model/return-types");
exports.Return = Return;
__export(require("./decorators/parameters"));
__export(require("./decorators/methods"));
__export(require("./decorators/services"));
__export(require("./server/model/server-types"));
__export(require("./server/server"));
__export(require("./authenticator/passport"));
var server_container_1 = require("./server/server-container");
exports.DefaultServiceFactory = server_container_1.DefaultServiceFactory;
config_1.ServerConfig.configure();
//# sourceMappingURL=typescript-rest.js.map