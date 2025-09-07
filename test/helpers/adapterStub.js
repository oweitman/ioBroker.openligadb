/*
 * Helper to build a stubbed ioBroker adapter using sinon.  Each adapter method
 * is replaced with a sinon.fake or sinon.stub so that tests can assert
 * invocation counts and arguments.  Some methods expose internal state via
 * properties on the returned adapter (for example `_objectExists`, `_objectList`,
 * `_states` and `_stateValue`) so that tests can configure how stubbed
 * functions behave.
 */

const sinon = require('sinon');

function createAdapterStub() {
    const log = {
        silly: sinon.spy(),
        debug: sinon.spy(),
        info:  sinon.spy(),
        error: sinon.spy(),
    };
    const adapter = {
        namespace: 'testns',
        // Provide a default config to avoid JSON.parse errors in init
        config: { leagues: JSON.stringify([]), refresh: 0 },
        log,
        // Async object creation
        setObjectAsync: sinon.fake.resolves(),
        setObjectNotExistsAsync: sinon.fake.resolves(),
        // Sync object creation
        setObject: sinon.fake((name, obj, cb) => { if (cb) cb(); }),
        // getObject uses internal flag _objectExists
        getObject: sinon.stub(),
        // deletion
        delObject: sinon.fake((name, options, cb) => { if (typeof options === 'function') { options(); } else if (cb) { cb(); } }),
        extendObjectAsync: sinon.fake.resolves(),
        setState: sinon.fake((name, value, ack, cb) => { if (typeof cb === 'function') cb(); }),
        createState: sinon.fake((level1, level2, name, stateTemplate, cb) => { if (cb) cb(); }),
        getObjectListAsync: sinon.stub(),
        getStatesAsync: sinon.stub(),
        getState: sinon.fake((name, cb) => { if (cb) cb(null, adapter._stateValue || null); }),
        // Use a stub instead of fake here so that callsFake can be used to
        // override its behaviour.  A sinon.fake does not expose callsFake.
        getStateAsync: sinon.stub(),
        delay: sinon.fake.resolves(),
        // timers
        // Use plain functions for timers so that tests can stub them without
        // encountering "already spied on" errors.  clearTimeout and clearInterval
        // remain fakes to allow call count assertions when not stubbed.
        setTimeout: function (fn, time, arg1, arg2) { return { fn, time, arg1, arg2 }; },
        clearTimeout: sinon.fake(),
        clearInterval: sinon.fake(),
        sendTo: sinon.fake(),
    };
    // Default behaviours for stubs
    adapter.getObject.callsFake((name, cb) => {
        cb(null, adapter._objectExists ? { id: name } : null);
    });
    adapter.getObjectListAsync.callsFake(async (opts) => {
        return adapter._objectList || { rows: [] };
    });
    adapter.getStatesAsync.callsFake(async (pattern) => {
        return adapter._states || {};
    });
    adapter.getStateAsync.callsFake(async (name) => {
        return adapter._stateValue || null;
    });
    return adapter;
}

module.exports = {
    createAdapterStub,
};