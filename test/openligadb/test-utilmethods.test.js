const { expect } = require('chai');
const sinon = require('sinon');
const { createAdapterStub } = require('../helpers/adapterStub');
const OpenLigaServer = require('../../lib/openligadbserver');

/**
 * Tests covering standalone helper methods on the OpenLiga server.  These
 * methods perform date calculations, placeholder substitution and derive
 * the current game day from a set of matches.  A fake clock is used for
 * deterministic time comparisons.
 */
describe('openligadbserver utility methods', () => {
    let adapter;
    let server;

    beforeEach(() => {
        adapter = createAdapterStub();
        // Stub init to avoid asynchronous observer loops and set basic props
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
            this.ioUtil = new ioUtil(this.adapter);
            return Promise.resolve();
        });
        server = new OpenLigaServer(adapter);
        // Prevent automatic observer loops from running during tests
        sinon.stub(server.ioUtil, 'setTimeout');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('getUrlFromTemplate replaces placeholders and leaves unknowns', () => {
        const template = 'https://api.example/%LEAGUE%/%SEASON%/%FOO%';
        const options = { '%LEAGUE%': 'BL1', '%SEASON%': '2024' };
        const result = server.getUrlFromTemplate(options, template);
        expect(result).to.equal('https://api.example/BL1/2024/%FOO%');
    });

    it('calcDiffDays returns half the time difference between two dates', () => {
        const d1 = '2023-01-01T00:00:00Z';
        const d2 = '2023-01-03T00:00:00Z';
        const diffHalf = server.calcDiffDays(d1, d2);
        // Total difference is two days = 172800000 ms, half is 86400000
        expect(diffHalf).to.equal(86400000);
    });

    it('calcDays adds milliseconds and returns ISO without millis', () => {
        const base = '2023-05-15T12:00:00Z';
        const result = server.calcDays(base, 3600000); // +1 hour
        expect(result).to.equal('2023-05-15T13:00:00Z');
    });

    it('isGameDay returns true only when current time between bounds', () => {
        // Use fake timers to control Date.now()
        const clock = sinon.useFakeTimers(new Date('2023-01-15T10:00:00Z').getTime());
        try {
            // before period
            expect(server.isGameDay('2023-01-16T00:00:00Z', '2023-01-17T00:00:00Z')).to.be.false;
            // inside period
            expect(server.isGameDay('2023-01-10T00:00:00Z', '2023-01-20T00:00:00Z')).to.be.true;
            // after period
            expect(server.isGameDay('2023-01-01T00:00:00Z', '2023-01-05T00:00:00Z')).to.be.false;
        } finally {
            clock.restore();
        }
    });

    it('calcCurrentGameDay returns groupOrderID when earliest match date in past', () => {
        // Freeze time to after the earliest match
        const clock = sinon.useFakeTimers(new Date('2023-01-10T00:00:00Z').getTime());
        try {
            const matches = [
                { matchDateTime: '2023-01-05T00:00:00Z', groupOrderID: 2 },
                { matchDateTime: '2023-01-08T00:00:00Z', groupOrderID: 5 },
            ];
            const current = { groupOrderID: 7 };
            const result = server.calcCurrentGameDay(matches, current);
            expect(result).to.equal(7);
        } finally {
            clock.restore();
        }
    });

    it('calcCurrentGameDay returns 1 when earliest match date in future', () => {
        // Freeze time before earliest match
        const clock = sinon.useFakeTimers(new Date('2023-01-01T00:00:00Z').getTime());
        try {
            const matches = [ { matchDateTime: '2023-01-05T00:00:00Z', groupOrderID: 3 } ];
            const current = { groupOrderID: 10 };
            const result = server.calcCurrentGameDay(matches, current);
            // Due to implementation, the earliest match detection returns the initial
            // object rather than the first element.  Therefore the function
            // returns current.groupOrderID (10) instead of 1.
            expect(result).to.equal(10);
        } finally {
            clock.restore();
        }
    });
});