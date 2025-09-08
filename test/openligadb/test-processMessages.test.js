const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const OpenLigaServer = require('../../lib/openligadbserver');

/**
 * Tests covering message processing and match data retrieval.  The
 * processMessages method dispatches commands to getMatchData.  The
 * getMatchData method filters matches by date and returns results via
 * adapter.sendTo.  Error handling for invalid dates is also verified.
 */
describe('openligadbserver message processing', () => {
    let adapter;
    let server;

    beforeEach(() => {
        adapter = createAdapterStub();
        // stub init to prevent auto observer and set endpoints/state templates
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
            this.ioUtil = new ioUtil(adapter);
            return Promise.resolve();
        });
        server = new OpenLigaServer(adapter);
        // suppress observer loops by stubbing setTimeout
        sinon.stub(server.ioUtil, 'setTimeout');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('processMessages forwards getMatchData command', () => {
        const msg = { command: 'getMatchData', message: {} };
        const stub = sinon.stub(server, 'getMatchData');
        server.processMessages(msg);
        sinon.assert.calledOnce(stub);
        expect(stub.getCall(0).args[0]).to.equal(msg);
    });

    it('getMatchData filters matches by date and sends result', async () => {
        // stub getAllMatches to return two matches
        sinon.stub(server, 'getAllMatches').resolves([
            { matchDateTime: '2023-01-10T12:00:00Z' },
            { matchDateTime: '2023-02-15T12:00:00Z' },
        ]);
        const sendSpy = adapter.sendTo;
        const msg = {
            command: 'getMatchData',
            from: 'client1',
            callback: 'cb',
            message: {
                league: 'BL1',
                season: '2022',
                datefrom: '2023-01-01',
                datetill: '2023-01-31',
            },
        };
        await server.getMatchData(msg);
        sinon.assert.calledOnce(sendSpy);
        const [to, cmd, data, cb] = sendSpy.getCall(0).args;
        expect(to).to.equal('client1');
        expect(cmd).to.equal('getMatchData');
        expect(cb).to.equal('cb');
        expect(data).to.deep.equal([
            { matchDateTime: '2023-01-10T12:00:00Z' },
        ]);
    });

    it('getMatchData reports error for invalid dates', async () => {
        sinon.stub(server, 'getAllMatches').resolves([]);
        const sendSpy = adapter.sendTo;
        const msg = {
            command: 'getMatchData',
            from: 'unit',
            callback: 'cb2',
            message: {
                league: 'BL1',
                season: '2022',
                datefrom: 'not-a-date',
                datetill: 'invalid',
            },
        };
        await server.getMatchData(msg);
        sinon.assert.calledOnce(sendSpy);
        const [, , data] = sendSpy.getCall(0).args;
        expect(data).to.match(/^error:/);
        expect(data).to.include('datefrom is not valid');
        expect(data).to.include('datetill is not valid');
    });

    it('getMatchData does nothing when callback is absent', async () => {
        sinon.stub(server, 'getAllMatches').resolves([
            { matchDateTime: '2023-03-01T12:00:00Z' },
        ]);
        const sendSpy = adapter.sendTo;
        const msg = {
            command: 'getMatchData',
            from: 'x',
            // no callback
            message: {
                league: 'BL',
                season: '2022',
                datefrom: '2023-01-01',
                datetill: '2023-12-31',
            },
        };
        await server.getMatchData(msg);
        sinon.assert.notCalled(sendSpy);
    });
});