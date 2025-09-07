const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const { ioUtil } = require('../../lib/ioUtil');

/**
 * Tests covering state read/write helpers on ioUtil.  These tests ensure
 * that paths are concatenated correctly, acknowledgement flags are set
 * appropriately and that callbacks are honoured.  Both synchronous and
 * asynchronous accessors are exercised here.
 */
describe('ioUtil state operations', () => {
    it('setStateAsync always uses ack=true and full name', async () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        await util.setStateAsync('stateName', 42, 'lvl1', 'lvl2');
        sinon.assert.calledOnce(adapter.setState);
        const [fullName, value, ack] = adapter.setState.getCall(0).args;
        expect(fullName).to.equal('lvl1.lvl2.stateName');
        expect(value).to.equal(42);
        expect(ack).to.be.true;
    });

    it('setStateNack sets ack=false when callback supplied', (done) => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        util.setStateNack('id', 0, 'l1', 'l2', () => {
            sinon.assert.calledOnce(adapter.setState);
            const [fullName, value, ack] = adapter.setState.getCall(0).args;
            expect(fullName).to.equal('l1.l2.id');
            expect(value).to.equal(0);
            expect(ack).to.be.false;
            done();
        });
    });

    it('setStateNack defaults ack=true when no callback', () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        util.setStateNack('temp', 'val', 'x', 'y');
        sinon.assert.calledOnce(adapter.setState);
        const [fullName, value, ack] = adapter.setState.getCall(0).args;
        expect(fullName).to.equal('x.y.temp');
        expect(value).to.equal('val');
        expect(ack).to.be.true;
    });

    it('createState forwards parameters correctly', (done) => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        const templ = { name: 'foo', read: true, write: false };
        util.createState(templ, 'lv1', 'lv2', () => {
            sinon.assert.calledOnce(adapter.createState);
            const call = adapter.createState.getCall(0);
            // adapter.createState(level1, level2, name, template, cb)
            expect(call.args[0]).to.equal('lv1');
            expect(call.args[1]).to.equal('lv2');
            expect(call.args[2]).to.equal('foo');
            expect(call.args[3]).to.equal(templ);
            done();
        });
    });

    it('setState always uses ack=true for synchronous variant', () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        util.setState('myState', 5, 'p', 'q');
        sinon.assert.calledOnce(adapter.setState);
        const [name, value, ack] = adapter.setState.getCall(0).args;
        expect(name).to.equal('p.q.myState');
        expect(value).to.equal(5);
        expect(ack).to.be.true;
    });

    it('getObjects returns map keyed by id', async () => {
        const adapter = createAdapterStub();
        // simulate two objects returned from adapter
        adapter._objectList = { rows: [ { id: 'a', value: 1 }, { id: 'b', value: 2 } ] };
        const util = new ioUtil(adapter);
        const objs = await util.getObjects('some.path');
        expect(objs).to.deep.equal({ a: { id: 'a', value: 1 }, b: { id: 'b', value: 2 } });
        sinon.assert.calledOnce(adapter.getObjectListAsync);
    });

    it('getStates concatenates pattern and forwards to adapter', async () => {
        const adapter = createAdapterStub();
        adapter._states = { 'x.y.state1': { val: 1 } };
        const util = new ioUtil(adapter);
        const states = await util.getStates('state1', 'x', 'y');
        expect(states).to.deep.equal(adapter._states);
        sinon.assert.calledOnce(adapter.getStatesAsync);
        expect(adapter.getStatesAsync.getCall(0).args[0]).to.equal('x.y.state1');
    });

    it('getState forwards full name and callback', (done) => {
        const adapter = createAdapterStub();
        adapter._stateValue = { val: 999 };
        const util = new ioUtil(adapter);
        util.getState('id', 'l', 'm', (err, state) => {
            expect(err).to.be.null;
            expect(state).to.deep.equal(adapter._stateValue);
            sinon.assert.calledOnce(adapter.getState);
            expect(adapter.getState.getCall(0).args[0]).to.equal('l.m.id');
            done();
        });
    });

    it('getStateAsync concatenates id for async access', async () => {
        const adapter = createAdapterStub();
        adapter._stateValue = { val: 'asyncVal' };
        const util = new ioUtil(adapter);
        const result = await util.getStateAsync('bar', 'a', 'b');
        sinon.assert.calledOnce(adapter.getStateAsync);
        expect(adapter.getStateAsync.getCall(0).args[0]).to.equal('a.b.bar');
        expect(result).to.equal(adapter._stateValue);
    });
});