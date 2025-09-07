const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const { ioUtil } = require('../../lib/ioUtil');

/**
 * Test suite covering deletion and extension methods of ioUtil.  These tests
 * verify that object identifiers are composed correctly and that the adapter
 * methods are invoked with the proper options or callbacks.  Deletion
 * functions support both asynchronous and synchronous variants and pass a
 * recursive flag where appropriate.
 */
describe('ioUtil deletion and extension', () => {
    it('deleteObjectAsync composes name and passes recursive flag', async () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        await util.deleteObjectAsync('state', 'l1', 'l2');
        sinon.assert.calledOnce(adapter.delObject);
        const [name, options] = adapter.delObject.getCall(0).args;
        expect(name).to.equal('l1.l2.state');
        expect(options).to.deep.equal({ recursive: true });
    });

    it('deleteObject composes name and forwards callback', (done) => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        // Provide a callback to verify it is executed
        util.deleteObject('myid', 'p1', 'p2', () => {
            sinon.assert.calledOnce(adapter.delObject);
            const [name] = adapter.delObject.getCall(0).args;
            expect(name).to.equal('p1.p2.myid');
            done();
        });
    });

    it('extendObjectAsync composes name and forwards properties', async () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        const props = { common: { desc: 'extra' } };
        await util.extendObjectAsync('id123', 'a', 'b', props);
        sinon.assert.calledOnce(adapter.extendObjectAsync);
        const [name, obj] = adapter.extendObjectAsync.getCall(0).args;
        expect(name).to.equal('a.b.id123');
        expect(obj).to.equal(props);
    });
});