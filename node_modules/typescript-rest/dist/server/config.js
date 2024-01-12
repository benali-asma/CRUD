"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const fs = require("fs-extra");
const path = require("path");
const server_1 = require("./server");
const serverDebugger = debug('typescript-rest:server:config:build');
class ServerConfig {
    static configure() {
        try {
            const CONFIG_FILE = this.searchConfigFile();
            if (CONFIG_FILE && fs.existsSync(CONFIG_FILE)) {
                const config = fs.readJSONSync(CONFIG_FILE);
                serverDebugger('rest.config file found: %j', config);
                if (config.serviceFactory) {
                    if (config.serviceFactory.indexOf('.') === 0) {
                        config.serviceFactory = path.join(process.cwd(), config.serviceFactory);
                    }
                    server_1.Server.registerServiceFactory(config.serviceFactory);
                }
            }
        }
        catch (e) {
            // tslint:disable-next-line:no-console
            console.error(e);
        }
    }
    static searchConfigFile() {
        serverDebugger('Searching for rest.config file');
        let configFile = path.join(__dirname, 'rest.config');
        while (!fs.existsSync(configFile)) {
            const fileOnParent = path.normalize(path.join(path.dirname(configFile), '..', 'rest.config'));
            if (configFile === fileOnParent) {
                return null;
            }
            configFile = fileOnParent;
        }
        return configFile;
    }
}
exports.ServerConfig = ServerConfig;
//# sourceMappingURL=config.js.map