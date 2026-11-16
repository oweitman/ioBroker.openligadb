const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const { createServerStub } = require('../helpers/serverStub');

/**
 * Tests for the internal request helper on the OpenLiga server.  The server
 * delegates HTTP GET requests to axios and returns the response data.  On
 * error the request function should log the URL and reject. The axios module
 * is stubbed to avoid real network calls.
 */
describe('openligadbserver request helper', () => {
    let adapter;
    let server;
    let axios;

    beforeEach(() => {
        adapter = createAdapterStub();
        server = createServerStub(adapter);
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

    it('logs URL and propagates request failure', async () => {
        const error = new Error('network down');
        sinon.stub(axios, 'get').rejects(error);
        try {
            await server.request('http://fail');
            expect.fail('request should reject');
        } catch (caught) {
            expect(caught).to.equal(error);
        }
        sinon.assert.calledOnce(adapter.log.error);
        expect(adapter.log.error.getCall(0).args[0]).to.equal('API error http://fail: network down');
    });
});
