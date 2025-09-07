const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const { ioUtil } = require('../../lib/ioUtil');

/**
 * Tests for miscellaneous utility helpers on ioUtil.  These cover the delay
 * wrapper around the adapter, numeric range checking and the internal
 * conversion of object lists into maps.
 */
describe('ioUtil utility methods', () => {
    it('delay delegates to adapter.delay', async () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        await util.delay(123);
        sinon.assert.calledOnce(adapter.delay);
        expect(adapter.delay.getCall(0).args[0]).to.equal(123);
    });

    it('checkNumberRange returns value when within range', () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        const result = util.checkNumberRange('5', 0, 10, 99);
        // String should be coerced to number
        expect(result).to.equal(5);
    });

    it('checkNumberRange returns default when out of range or invalid', () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        expect(util.checkNumberRange(20, 0, 10, 42)).to.equal(42);
        expect(util.checkNumberRange('abc', 0, 10, 42)).to.equal(42);
    });
});