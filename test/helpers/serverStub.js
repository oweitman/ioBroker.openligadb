const sinon = require('sinon');
const OpenLigaServer = require('../../lib/openligadbserver');

/**
 * Create a server without starting its asynchronous observer.
 *
 * @param adapter - The adapter stub.
 */
function createServerStub(adapter) {
    sinon.stub(OpenLigaServer.prototype, 'init').resolves();
    const server = new OpenLigaServer(adapter);
    server.api_ep_gettable = 'https://api.openligadb.de/getbltable/%LEAGUE%/%SEASON%';
    server.api_ep_actplayday = 'https://api.openligadb.de/getmatchdata/%LEAGUE%';
    server.api_ep_allmatches = 'https://api.openligadb.de/getmatchdata/%LEAGUE%/%SEASON%';
    server.api_ep_actgroup = 'https://api.openligadb.de/getcurrentgroup/%LEAGUE%';
    server.api_ep_goalgetter = 'https://api.openligadb.de/getgoalgetters/%LEAGUE%/%SEASON%';
    server.stateTemplate = {
        table: { name: 'table', read: true, write: false, type: 'string', role: 'value' },
        currgameday: { name: 'currgameday', read: true, write: false, type: 'string', role: 'value' },
        allmatches: { name: 'allmatches', read: true, write: false, type: 'string', role: 'value' },
        goalgetters: { name: 'goalgetters', read: true, write: false, type: 'string', role: 'value' },
    };
    sinon.stub(server.ioUtil, 'setTimeout');
    return server;
}

module.exports = { createServerStub };
