"use strict";

/*
 * Created with @iobroker/create-adapter v1.12.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");

// Load your modules here, e.g.:
// const fs = require("fs");

const IoOlServer = require(__dirname + "/lib/openligadbserver.js");

/**
 * The adapter instance
 * @type {ioBroker.Adapter}
 */
let adapter;

let openligadbServer;

/**
 * Starts the adapter instance
 * @param {Partial<ioBroker.AdapterOptions>} [options]
 */
function startAdapter(options) {
    // Create the adapter and define its methods
    // @ts-ignore
    return adapter = utils.adapter(Object.assign({}, options, {
        name: "openligadb",

        // The ready callback is called when databases are connected and adapter received configuration.
        // start here!
        ready: main, // Main method defined below for readability

        // is called when adapter shuts down - callback has to be called under any circumstances!
        unload: (callback) => {
            try {
                openligadbServer.closeConnections();
                adapter.log.info("openligadb unloaded");
                callback();
            } catch {
                callback();
            }
        },
        message: (obj) => {
            if (typeof obj === "object" && obj.message) {
                openligadbServer.processMessages(obj);
            }
        },
        // is called if a subscribed state changes
        stateChange: (id, state) => {
            if (state) {
                // The state was changed
                if (openligadbServer) openligadbServer.stateChange(id, state);
            }
        },

    }));
}

function main() {

    if (!openligadbServer) {
        openligadbServer = new IoOlServer(adapter);
    }
}

// @ts-ignore
if (module.parent) {
    // Export startAdapter in compact mode
    module.exports = startAdapter;
} else {
    // otherwise start the instance directly
    startAdapter();
}

