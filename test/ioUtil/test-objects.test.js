const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const { ioUtil } = require('../../lib/ioUtil');

describe('ioUtil object creation', () => {
    it('createObjectChannelAsync creates channel with proper name', async () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        const template = { name: 'chan', role: 'value' };
        await util.createObjectChannelAsync(template, 'l1', 'l2');
        sinon.assert.calledOnce(adapter.setObjectAsync);
        const [name, obj] = adapter.setObjectAsync.getCall(0).args;
        expect(name).to.equal('l1.l2.chan');
        expect(obj).to.deep.equal({ type: 'channel', common: template, native: {} });
    });

    it('createObjectAsync creates state with proper name', async () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        const template = { name: 'state', role: 'value' };
        await util.createObjectAsync(template, 'a', 'b');
        sinon.assert.calledOnce(adapter.setObjectAsync);
        const [name, obj] = adapter.setObjectAsync.getCall(0).args;
        expect(name).to.equal('a.b.state');
        expect(obj.type).to.equal('state');
        expect(obj.common).to.equal(template);
    });

    it('createObjectNotExistsAsync delegates to setObjectNotExistsAsync', async () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        const template = { name: 'noexist', read: true };
        await util.createObjectNotExistsAsync(template, '', '');
        sinon.assert.calledOnce(adapter.setObjectNotExistsAsync);
        const [name, obj] = adapter.setObjectNotExistsAsync.getCall(0).args;
        expect(name).to.equal('noexist');
        expect(obj.type).to.equal('state');
        expect(obj.common).to.equal(template);
    });

    it('createFolderNotExistsAsync creates folder correctly', async () => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        await util.createFolderNotExistsAsync('folder', 'p1', 'p2');
        sinon.assert.calledOnce(adapter.setObjectNotExistsAsync);
        const [name, obj] = adapter.setObjectNotExistsAsync.getCall(0).args;
        expect(name).to.equal('p1.p2.folder');
        expect(obj.type).to.equal('folder');
        expect(obj.common).to.deep.equal({ name: 'folder' });
    });

    it('createObjectState only creates when object is absent', (done) => {
        const adapter = createAdapterStub();
        const util = new ioUtil(adapter);
        const template = { name: 'mystate' };
        // first call: object absent
        adapter._objectExists = false;
        util.createObjectState(template, 'x', 'y', () => {
            // ensure setObject called once
            sinon.assert.calledOnce(adapter.setObject);
            const call = adapter.setObject.getCall(0);
            expect(call.args[0]).to.equal('x.y.mystate');
            // second call: object exists, should not call setObject again
            adapter._objectExists = true;
            util.createObjectState(template, 'x', 'y', () => {
                sinon.assert.calledOnce(adapter.setObject);
                done();
            });
        });
    });
});