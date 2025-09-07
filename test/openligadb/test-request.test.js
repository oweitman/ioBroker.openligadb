const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const OpenLigaServer = require('../../lib/openligadbserver');

/**
 * Tests for the internal request helper on the OpenLiga server.  The server
 * delegates HTTP GET requests to axios and returns the response data.  On
 * error the request function should log the error message and return
 * undefined.  The axios module is stubbed to avoid real network calls.
 */
describe('openligadbserver request helper', () => {
    let adapter;
    let server;
    let axios;

    beforeEach(() => {
        adapter = createAdapterStub();
        // Stub init to prevent automatic observer creation and to initialise
        sinon.stub(OpenLigaServer.prototype, 'init').callsFake(function () {
            this.api_ep_gettable    = 'https://api.openligadb.de/getbltable/%LEAGUE%/%SEASON%';
            this.api_ep_actplayday  = 'https://api.openligadb.de/getmatchdata/%LEAGUE%';
            this.api_ep_allmatches  = 'https://api.openligadb.de/getmatchdata/%LEAGUE%/%SEASON%';
            this.api_ep_actgroup    = 'https://api.openligadb.de/getcurrentgroup/%LEAGUE%';
            this.api_ep_goalgetter  = 'https://api.openligadb.de/getgoalgetters/%LEAGUE%/%SEASON%';
            this.stateTemplate = {
                table:        { name: 'table', read: true, write: false, type: 'string', role: 'value' },
                currgameday:  { name: 'currgameday', read: true, write: false, type: 'string', role: 'value' },
                allmatches:   { name: 'allmatches', read: true, write: false, type: 'string', role: 'value' },
                goalgetters:  { name: 'goalgetters', read: true, write: false, type: 'string', role: 'value' },
            };
            const { ioUtil } = require('../../lib/ioUtil');
            this.ioUtil = new ioUtil(this.adapter);
            return Promise.resolve();
        });
        server = new OpenLigaServer(adapter);
        // Prevent observers from scheduling timeouts during tests
        sinon.stub(server.ioUtil, 'setTimeout');
        // Retrieve axios from node_modules so that we can stub get on it
        axios = require('axios');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('returns data when axios resolves successfully', async () => {
        const data = { foo: 'bar' };
        sinon.stub(axios, 'get').resolves({ data });
        const result = await server.request('http://test');
        expect(result).to.deep.equal(data);
        sinon.assert.calledOnce(axios.get);
        expect(axios.get.getCall(0).args[0]).to.equal('http://test');
        sinon.assert.notCalled(adapter.log.error);
    });

    it('logs error and returns undefined on request failure', async () => {
        const error = new Error('network down');
        sinon.stub(axios, 'get').rejects(error);
        const result = await server.request('http://fail');
        expect(result).to.be.undefined;
        sinon.assert.calledOnce(adapter.log.error);
        expect(adapter.log.error.getCall(0).args[0]).to.equal('network down');
    });
});