const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const { ioUtil } = require('../../lib/ioUtil');

/**
 * Tests for the timer management methods in ioUtil.  The util tracks
 * scheduled callbacks in an internal observers map and proxies through
 * the adapter's timer functions.  These tests simulate scheduling and
 * clearing timers without relying on real timeouts.
 */
describe('ioUtil timers and observer management', () => {
    afterEach(() => {
        // Restore any stubs created in tests to avoid interference across tests
        sinon.restore();
    });
    it('setTimeout schedules timer and replaces existing one', () => {
        const adapter = createAdapterStub();
        // Replace the fake with a stub so that we can specify return values
        const setTimeoutStub = sinon.stub(adapter, 'setTimeout');
        const token1 = { id: 1 };
        const token2 = { id: 2 };
        setTimeoutStub.onFirstCall().returns(token1);
        setTimeoutStub.onSecondCall().returns(token2);
        const util = new ioUtil(adapter);
        const cb = sinon.spy();
        // schedule first timer
        util.setTimeout('job', cb, 100);
        expect(util.observers.job).to.equal(token1);
        sinon.assert.calledOnce(setTimeoutStub);
        // schedule again with same id should clear first
        util.setTimeout('job', cb, 50);
        // clearTimeout should be called for old token
        sinon.assert.calledOnce(adapter.clearTimeout);
        expect(adapter.clearTimeout.getCall(0).args[0]).to.equal(token1);
        expect(util.observers.job).to.equal(token2);
        sinon.assert.calledTwice(setTimeoutStub);
    });

    it('setTimeout does nothing when doClose is true', () => {
        const adapter = createAdapterStub();
        // stub to detect calls
        const setTimeoutStub = sinon.stub(adapter, 'setTimeout');
        const util = new ioUtil(adapter);
        util.doClose = true;
        util.setTimeout('id', () => {}, 10);
        sinon.assert.notCalled(setTimeoutStub);
        // observers map should not have the id entry
        expect(util.observers).to.not.have.property('id');
    });

    it('clearTimeout clears timer and removes observer entry', () => {
        const adapter = createAdapterStub();
        // stub setTimeout to always return a token
        const setTimeoutStub = sinon.stub(adapter, 'setTimeout').returns('tok');
        const util = new ioUtil(adapter);
        util.setTimeout('abc', () => {}, 0);
        expect(util.observers.abc).to.equal('tok');
        util.clearTimeout('abc');
        sinon.assert.calledOnce(adapter.clearTimeout);
        expect(adapter.clearTimeout.getCall(0).args[0]).to.equal('tok');
        expect(util.observers).to.not.have.property('abc');
    });

    it('clearInterval clears timer and removes observer entry', () => {
        const adapter = createAdapterStub();
        const setTimeoutStub = sinon.stub(adapter, 'setTimeout').returns('tokInt');
        const util = new ioUtil(adapter);
        util.setTimeout('interval', () => {}, 0);
        util.clearInterval('interval');
        sinon.assert.calledOnce(adapter.clearInterval);
        expect(adapter.clearInterval.getCall(0).args[0]).to.equal('tokInt');
        expect(util.observers).to.not.have.property('interval');
    });

    it('deleteObservers clears all timers', () => {
        const adapter = createAdapterStub();
        // stub setTimeout to return tokens in sequence
        const setTimeoutStub = sinon.stub(adapter, 'setTimeout');
        setTimeoutStub.onFirstCall().returns('t1');
        setTimeoutStub.onSecondCall().returns('t2');
        const util = new ioUtil(adapter);
        util.setTimeout('a', () => {}, 0);
        util.setTimeout('b', () => {}, 0);
        util.deleteObservers();
        // clearTimeout should be invoked for both tokens
        sinon.assert.calledTwice(adapter.clearTimeout);
        expect(Object.keys(util.observers).length).to.equal(0);
    });

    it('closeConnections clears observers and prevents new timers', () => {
        const adapter = createAdapterStub();
        const setTimeoutStub = sinon.stub(adapter, 'setTimeout').returns('tok');
        const util = new ioUtil(adapter);
        util.setTimeout('c', () => {}, 5);
        util.closeConnections();
        // clearing existing
        sinon.assert.calledOnce(adapter.clearTimeout);
        expect(util.doClose).to.be.true;
        // new schedule should be ignored
        util.setTimeout('new', () => {}, 10);
        sinon.assert.calledOnce(setTimeoutStub);
        expect(util.observers).to.not.have.property('new');
    });
});