const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const { createServerStub } = require('../helpers/serverStub');

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
        server = createServerStub(adapter);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('processMessages forwards getMatchData command', () => {
        const msg = { command: 'getMatchData', message: {} };
        const stub = sinon.stub(server, 'getMatchData').resolves();
        server.processMessages(msg);
        sinon.assert.calledOnce(stub);
        expect(stub.getCall(0).args[0]).to.equal(msg);
    });

    it('reports message request failures to the caller', async () => {
        const error = new Error('network down');
        sinon.stub(server, 'getAllMatches').rejects(error);
        const msg = {
            command: 'getMatchData', from: 'client1', callback: 'cb',
            message: { league: 'BL1', season: '2022', datefrom: '2023-01-01', datetill: '2023-12-31' },
        };
        server.processMessages(msg);
        await new Promise(resolve => setImmediate(resolve));
        sinon.assert.calledWithExactly(adapter.sendTo, 'client1', 'getMatchData', 'error: network down', 'cb');
        sinon.assert.calledWithExactly(adapter.log.error, 'getMatchData failed: network down');
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
