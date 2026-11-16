const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const { createServerStub } = require('../helpers/serverStub');

/**
 * Tests verifying that the high-level data fetching functions compose URLs
 * correctly and respect guard clauses when parameters are empty.  The
 * getData method orchestrates multiple calls and should create and set
 * states for each configured league/season pair.
 */
describe('openligadbserver data fetching', () => {
    let adapter;
    let server;

    beforeEach(() => {
        adapter = createAdapterStub();
        server = createServerStub(adapter);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('getTable returns empty string when league or season missing', async () => {
        // Missing league
        let result = await server.getTable('', '2023');
        expect(result).to.equal('');
        // Missing season
        result = await server.getTable('BL1', '');
        expect(result).to.equal('');
    });

    it('getTable invokes request with composed url when parameters provided', async () => {
        const reqStub = sinon.stub(server, 'request').resolves('TABLEDATA');
        const url = server.getUrlFromTemplate({ '%LEAGUE%': 'BL1', '%SEASON%': '2023' }, server.api_ep_gettable);
        const result = await server.getTable('BL1', '2023');
        expect(result).to.equal('TABLEDATA');
        sinon.assert.calledOnce(reqStub);
        expect(reqStub.getCall(0).args[0]).to.equal(url);
    });

    it('getMatches returns empty string when league missing and otherwise calls request', async () => {
        // Missing league
        let result = await server.getMatches('');
        expect(result).to.equal('');
        const reqStub = sinon.stub(server, 'request').resolves('MATCHES');
        const url = server.getUrlFromTemplate({ '%LEAGUE%': 'BL2' }, server.api_ep_actplayday);
        result = await server.getMatches('BL2');
        expect(result).to.equal('MATCHES');
        sinon.assert.calledOnce(reqStub);
        expect(reqStub.getCall(0).args[0]).to.equal(url);
    });

    it('getAllMatches returns empty string when league or season missing and otherwise calls request', async () => {
        let result = await server.getAllMatches('', '');
        expect(result).to.equal('');
        result = await server.getAllMatches('BL1', '');
        expect(result).to.equal('');
        result = await server.getAllMatches('', '2024');
        expect(result).to.equal('');
        const reqStub = sinon.stub(server, 'request').resolves(['match1']);
        const url = server.getUrlFromTemplate({ '%LEAGUE%': 'BL1', '%SEASON%': '2022' }, server.api_ep_allmatches);
        result = await server.getAllMatches('BL1', '2022');
        expect(result).to.deep.equal(['match1']);
        sinon.assert.calledOnce(reqStub);
        expect(reqStub.getCall(0).args[0]).to.equal(url);
    });

    it('getCurrentGroup returns empty string when league missing and otherwise calls request', async () => {
        let result = await server.getCurrentGroup('');
        expect(result).to.equal('');
        const reqStub = sinon.stub(server, 'request').resolves({ groupOrderID: 4 });
        const url = server.getUrlFromTemplate({ '%LEAGUE%': 'BL2' }, server.api_ep_actgroup);
        result = await server.getCurrentGroup('BL2');
        expect(result).to.deep.equal({ groupOrderID: 4 });
        sinon.assert.calledOnce(reqStub);
        expect(reqStub.getCall(0).args[0]).to.equal(url);
    });

    it('getGoalgetter returns empty string when league or season missing and otherwise calls request', async () => {
        let result = await server.getGoalgetter('', '');
        expect(result).to.equal('');
        result = await server.getGoalgetter('BL1', '');
        expect(result).to.equal('');
        result = await server.getGoalgetter('', '2023');
        expect(result).to.equal('');
        const reqStub = sinon.stub(server, 'request').resolves({ goals: [] });
        const url = server.getUrlFromTemplate({ '%LEAGUE%': 'BL3', '%SEASON%': '2021' }, server.api_ep_goalgetter);
        result = await server.getGoalgetter('BL3', '2021');
        expect(result).to.deep.equal({ goals: [] });
        sinon.assert.calledOnce(reqStub);
        expect(reqStub.getCall(0).args[0]).to.equal(url);
    });

    it('getData iterates leagues and sets states for each - string', async () => {
        // Configure two leagues
        adapter.config.leagues = JSON.stringify([
            { league: 'BL1', season: '2022' },
            { league: 'BL2', season: '2023' },
        ]);
        // stub internal data functions to return simple values
        sinon.stub(server, 'getTable').resolves({ table: 'data' });
        sinon.stub(server, 'getAllMatches').resolves([{ matchDateTime: '2022-01-01T00:00:00Z' }]);
        sinon.stub(server, 'getCurrentGroup').resolves({ groupOrderID: 3 });
        sinon.stub(server, 'calcCurrentGameDay').returns(3);
        sinon.stub(server, 'getGoalgetter').resolves({ list: [] });
        // stub ioUtil methods to record calls
        const coStub = sinon.stub(server.ioUtil, 'createObjectNotExistsAsync').resolves();
        const ssStub = sinon.stub(server.ioUtil, 'setStateAsync').resolves();
        await server.getData();
        // Two leagues * four data points = 8 calls
        expect(coStub.callCount).to.equal(8);
        expect(ssStub.callCount).to.equal(8);
        // Check first league calls
        const firstTableCall = coStub.getCall(0);
        expect(firstTableCall.args[0]).to.equal(server.stateTemplate.table);
        expect(firstTableCall.args[1]).to.equal('BL1');
        expect(firstTableCall.args[2]).to.equal('2022');
        const firstStateCall = ssStub.getCall(0);
        expect(firstStateCall.args[0]).to.equal('table');
        expect(firstStateCall.args[1]).to.equal(JSON.stringify({ table: 'data' }));
        expect(firstStateCall.args[2]).to.equal('BL1');
        expect(firstStateCall.args[3]).to.equal('2022');
    });
    it('getData iterates leagues and sets states for each - object', async () => {
        // Configure two leagues
        adapter.config.leagues = [
            { league: 'BL1', season: '2022' },
            { league: 'BL2', season: '2023' },
        ];
        // stub internal data functions to return simple values
        sinon.stub(server, 'getTable').resolves({ table: 'data' });
        sinon.stub(server, 'getAllMatches').resolves([{ matchDateTime: '2022-01-01T00:00:00Z' }]);
        sinon.stub(server, 'getCurrentGroup').resolves({ groupOrderID: 3 });
        sinon.stub(server, 'calcCurrentGameDay').returns(3);
        sinon.stub(server, 'getGoalgetter').resolves({ list: [] });
        // stub ioUtil methods to record calls
        const coStub = sinon.stub(server.ioUtil, 'createObjectNotExistsAsync').resolves();
        const ssStub = sinon.stub(server.ioUtil, 'setStateAsync').resolves();
        await server.getData();
        // Two leagues * four data points = 8 calls
        expect(coStub.callCount).to.equal(8);
        expect(ssStub.callCount).to.equal(8);
        // Check first league calls
        const firstTableCall = coStub.getCall(0);
        expect(firstTableCall.args[0]).to.equal(server.stateTemplate.table);
        expect(firstTableCall.args[1]).to.equal('BL1');
        expect(firstTableCall.args[2]).to.equal('2022');
        const firstStateCall = ssStub.getCall(0);
        expect(firstStateCall.args[0]).to.equal('table');
        expect(firstStateCall.args[1]).to.equal(JSON.stringify({ table: 'data' }));
        expect(firstStateCall.args[2]).to.equal('BL1');
        expect(firstStateCall.args[3]).to.equal('2022');
    });

    it('keeps existing states on a failed refresh and succeeds on the next refresh', async () => {
        adapter.config.leagues = [{ league: 'BL1', season: '2022' }];
        const requestError = new Error('network down');
        const getTable = sinon.stub(server, 'getTable');
        getTable.onFirstCall().rejects(requestError);
        getTable.onSecondCall().resolves([]);
        sinon.stub(server, 'getAllMatches').resolves([]);
        sinon.stub(server, 'getCurrentGroup').resolves({ groupOrderID: 1 });
        sinon.stub(server, 'getGoalgetter').resolves([]);
        const setState = sinon.stub(server.ioUtil, 'setStateAsync').resolves();

        server.doObserver();
        await new Promise(resolve => setImmediate(resolve));
        sinon.assert.notCalled(setState);
        sinon.assert.calledWithExactly(adapter.log.error, 'Update failed: network down');
        sinon.assert.calledOnce(server.ioUtil.setTimeout);

        server.doObserver();
        await new Promise(resolve => setImmediate(resolve));
        expect(setState.callCount).to.equal(4);
        sinon.assert.calledTwice(server.ioUtil.setTimeout);
    });
});
