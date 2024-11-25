const http = require('https');

/**
 * Initializes the IoOlServer instance with the given adapter.
 *
 * This server instance interacts with the OpenLigaDB API to retrieve and manage
 * soccer match data. It supports fetching data such as current match day games,
 * all matches for a given league and season, current group information, goal getters,
 * and league tables. The server also processes messages to fetch match data within
 * a specific date range.
 *
 * The adapter is configured with various state templates like 'table', 'currgameday',
 * 'allmatches', and 'goalgetters', which are used to create and manage data points.
 * The server also includes methods for observing data changes, making HTTP requests,
 * and managing the state and lifecycle of the instance.
 *
 * @param adapter - The ioBroker adapter instance for managing states and logs.
 */
function IoOlServer(adapter) {
    /*
    Api-Schema
    Nachfolgend wird das Api-Schema anhand von Beispielen dargestellt:

    Spiele des aktuellen Spieltages der ersten Bundesliga:

    https://www.openligadb.de/api/getmatchdata/bl1

    Der aktuelle Spieltag wird jeweils zur Hälfte der Zeit zwischen dem letzten Spiel des letzten Spieltages und dem ersten Spiel des nächsten Spieltages erhöht.

    Spiele des 8. Spieltages der ersten Bundesliga 2016/2017:

    https://www.openligadb.de/api/getmatchdata/bl1/2016/8

    Alle Spiele der ersten Bundesliga 2016/2017:

    https://www.openligadb.de/api/getmatchdata/bl1/2016

    Spiel mit der Id 39738:

    https://www.openligadb.de/api/getmatchdata/39738

    Die aktuelle Group (entspricht z.B. bei der Fussball-Bundesliga dem 'Spieltag') des als Parameter zu übergebenden leagueShortcuts (z.B. 'bl1'):

    https://www.openligadb.de/api/getcurrentgroup/bl1

    Der aktuelle Spieltag wird jeweils zur Hälfte der Zeit zwischen dem letzten Spiel des letzten Spieltages und dem ersten Spiel des nächsten Spieltages erhöht.

    Eine Liste der Spiel-Einteilungen (Spieltag, Vorrunde, Finale, ...) der als Parameter zu übergebenden Liga + Saison

    https://www.openligadb.de/api/getavailablegroups/bl1/2016

    Datum und Uhrzeit der letzten Änderung in den Daten des 8. Spieltages der ersten Bundesliga 2016/2017.

    https://www.openligadb.de/api/getlastchangedate/bl1/2016/8

    Diese Methode dient zur Ermittlung der Änderung von Spieldaten, um unnötiges Pollen der o.g. Service-Methoden zu vermeiden.

    Das nächste anstehende Spiel des als Parameter zu übergebenden Teams der ebenfalls zu übergebenen Liga:

    https://www.openligadb.de/api/getnextmatchbyleagueteam/3005/7

    '3005' entspricht der LeagueId der 1. Fußball Bundesliga 2016/2017
    '7' entspricht der TeamId von Borussia Dortmund
    Alle Teams einer Liga:

    https://www.openligadb.de/api/getavailableteams/bl1/2016

    Die Spiele, bei welchen die als Parameter übergebenen Teams gegeneinander spielten:

    https://www.openligadb.de/api/getmatchdata/40/7

    Die Torschützen der übergebenen Liga:

    https://www.openligadb.de/api/getgoalgetters/bl1/2017

    Die Tabelle ersten Bundesliga 2017/2018

    https://www.openligadb.de/api/getbltable/bl1/2017
    */

    const api_ep_gettable = 'https://api.openligadb.de/getbltable/%LEAGUE%/%SEASON%';
    const api_ep_actplayday = 'https://api.openligadb.de/getmatchdata/%LEAGUE%';
    const api_ep_allmatches = 'https://api.openligadb.de/getmatchdata/%LEAGUE%/%SEASON%';
    const api_ep_actgroup = 'https://api.openligadb.de/getcurrentgroup/%LEAGUE%';
    //const api_ep_nextgame       = "https://api.openligadb.de/getnextmatchbyleagueteam/%LEAGUEID%/%TEAMID%";
    //const api_ep_allteams       = "https://api.openligadb.de/getavailableteams/%LEAGUE%/%SEASON%";
    const api_ep_goalgetter = 'https://api.openligadb.de/getgoalgetters/%LEAGUE%/%SEASON%';

    this.stateTemplate = {
        table: {
            name: 'table',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
        },
        currgameday: {
            name: 'currgameday',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
        },
        allmatches: {
            name: 'allmatches',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
        },
        goalgetters: {
            name: 'goalgetters',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
        },
    };

    this.adapter = adapter;
    this.isLogsilly = true;
    this.isLogdebug = true;
    this.observers = [];

    this.init = function () {
        this.setState('connection', true, 'info');
        this.doObserver();
    };
    this.doObserver = function () {
        this.logsilly('doObserver');

        this.getData();
        this.setTimeout('doObserver', this.doObserver.bind(this), this.adapter.config.refresh * 60 * 1000);
    };
    this.getData = function () {
        this.logsilly('getData');
        let leagues = {};
        if (typeof this.adapter.config.leagues == 'object') {
            leagues = this.adapter.config.leagues;
        } else {
            leagues = JSON.parse(this.adapter.config.leagues);
        }
        this.logdebug(`getData ${this.adapter.config.leagues}`);
        leagues.forEach(item => {
            let league = item.league;
            let season = item.season;
            this.getTable(league, season, data => {
                const stateTemplate = this.stateTemplate['table'];
                this.createObject(stateTemplate, league, season, () => {
                    this.setState(stateTemplate.name, JSON.stringify(data), league, season);
                });
            });
            this.getAllMatches(league, season, data => {
                const stateTemplate = this.stateTemplate['allmatches'];
                this.createObject(stateTemplate, league, season, () => {
                    this.setState(stateTemplate.name, JSON.stringify(data), league, season);
                });
            });
            this.getCurrentGroup(league, data => {
                const stateTemplate = this.stateTemplate['currgameday'];
                this.createObject(stateTemplate, league, season, () => {
                    this.setState(stateTemplate.name, String(data.groupOrderID), league, season);
                });
            });
            this.getGoalgetter(league, season, data => {
                const stateTemplate = this.stateTemplate['goalgetters'];
                this.createObject(stateTemplate, league, season, () => {
                    this.setState(stateTemplate.name, JSON.stringify(data), league, season);
                });
            });
        });
    };
    this.getTable = function (league, season, callback) {
        this.logsilly('getTable');
        if (league.length == 0) {
            return '';
        }
        if (season.length == 0) {
            return '';
        }
        const options = {
            '%LEAGUE%': league,
            '%SEASON%': season,
        };
        return this.request(this.getUrlFromTemplate(options, api_ep_gettable), callback);
    };
    this.getMatches = function (league, callback) {
        this.logsilly('getMatches');
        if (league.length == 0) {
            return '';
        }
        const options = {
            '%LEAGUE%': league,
        };
        return this.request(this.getUrlFromTemplate(options, api_ep_actplayday), callback);
    };
    this.getAllMatches = function (league, season, callback) {
        this.logsilly('getAllMatches');
        if (league.length == 0) {
            return '';
        }
        if (season.length == 0) {
            return '';
        }
        const options = {
            '%LEAGUE%': league,
            '%SEASON%': season,
        };
        return this.request(this.getUrlFromTemplate(options, api_ep_allmatches), callback);
    };
    this.getCurrentGroup = function (league, callback) {
        this.logsilly('getCurrentGroup');
        if (league.length == 0) {
            return '';
        }
        const options = {
            '%LEAGUE%': league,
        };
        return this.request(this.getUrlFromTemplate(options, api_ep_actgroup), callback);
    };
    this.getGoalgetter = function (league, season, callback) {
        this.logsilly('getGoalgetter');
        if (league.length == 0) {
            return '';
        }
        if (season.length == 0) {
            return '';
        }
        const options = {
            '%LEAGUE%': league,
            '%SEASON%': season,
        };
        return this.request(this.getUrlFromTemplate(options, api_ep_goalgetter), callback);
    };

    this.processMessages = function (msg) {
        this.logdebug(`processMessages ${JSON.stringify(msg)}`);
        if (msg.command === 'getMatchData') {
            this.logdebug('send getMatchData');
            this.getMatchData(msg);
        }
    };
    this.getMatchData = function (msg) {
        this.logsilly('getMatchData ');
        let error = '';
        if (typeof msg.message === 'object') {
            const league = msg.message.league;
            const season = msg.message.season;
            const dstart = new Date(msg.message.datefrom);
            const dend = new Date(msg.message.datetill);
            if (isNaN(dstart.getTime())) {
                error += 'datefrom is not valid ';
            }
            if (isNaN(dend.getTime())) {
                error += 'datetill is not valid ';
            }
            this.getAllMatches(league, season, data => {
                if (error == '') {
                    data = data.filter(
                        match => new Date(match.matchDateTime) >= dstart && new Date(match.matchDateTime) <= dend,
                    );
                    this.logdebug(
                        `getMatchData send${msg.from} ${msg.command} ${JSON.stringify(data).substring(0, 100)} ${
                            msg.callback
                        }`,
                    );
                    if (msg.callback) {
                        this.adapter.sendTo(msg.from, msg.command, data, msg.callback);
                    }
                } else {
                    if (msg.callback) {
                        this.adapter.sendTo(msg.from, msg.command, `error: ${error}`, msg.callback);
                    }
                }
            });
        }
    };

    this.isGameDay = function (date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getTime() < new Date().getTime() && new Date().getTime() < d2.getTime();
    };
    this.calcDiffDays = function (date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (d2.getTime() - d1.getTime()) / 2;
    };
    this.calcDays = function (date1, diff) {
        const d1 = new Date(date1);
        return `${new Date(d1.getTime() + diff).toISOString().split('.')[0]}Z`;
    };
    this.getUrlFromTemplate = function (options, urltemplate) {
        return urltemplate.replace(/%\w+%/g, function (option) {
            return options[option] || option;
        });
    };
    this.request = function (url, callback) {
        this.logdebug(`request url ${url}`);
        http.get(url, res => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error(
                    // @ts-expect-error servername not recognized
                    `Request Failed.\n` + `Status Code: ${statusCode} ${res.socket.servername}${res.req.path}`,
                );
            } else if (!/^application\/json/.test(contentType || '')) {
                error = new Error(
                    `Invalid content-type.\n` +
                        // @ts-expect-error servername not recognized
                        `Expected application/json but received ${contentType} ${res.socket.servername}${res.req.path}`,
                );
            }
            if (error) {
                this.logerror(error.message);
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', chunk => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    this.logsilly(`request rawData${rawData}`);
                    const parsedData = JSON.parse(rawData);
                    callback(parsedData);
                } catch (e) {
                    this.logerror(e.message);
                }
            });
        }).on('error', e => {
            this.logerror(e.message);
        });
    };
    this.createObject = function (stateTemplate, level1path, level2path, callback) {
        this.logdebug(`createObject ${stateTemplate.name}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + stateTemplate.name;
        this.adapter.getObject(name, (err, obj) => {
            const newobj = {
                type: 'state',
                common: stateTemplate,
                native: {},
            };
            if (!obj) {
                callback ? this.adapter.setObject(name, newobj, callback) : this.adapter.setObject(name, newobj); // jshint ignore:line
            } else {
                if (callback) {
                    callback();
                }
            }
        });
    };
    this.getState = function (id, level1path = false, level2path = false, callback) {
        this.logdebug(`getState ${id}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + id;
        this.adapter.getState(name, callback);
    };
    this.setState = function (name, value, level1path, level2path, callback) {
        this.logdebug(`setState ${name}`);
        name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + name;
        this.adapter.log.debug(`setState name: ${name}` /*+ ' value: ' + value*/);
        callback ? this.adapter.setState(name, value, true, callback) : this.adapter.setState(name, value, true); // jshint ignore:line
    };
    this.setTimeout = function (id, callback, time) {
        this.clearTimeout(id);
        this.observers[id] = setTimeout(callback.bind(this), time);
    };
    this.setInterval = function (id, callback, time) {
        this.clearInterval(id);
        this.observers[id] = setInterval(callback.bind(this), time);
    };
    this.clearInterval = function (id) {
        if (this.observers[id]) {
            clearInterval(this.observers[id]);
        }
        delete this.observers[id];
    };
    this.clearTimeout = function (id) {
        if (this.observers[id]) {
            clearTimeout(this.observers[id]);
        }
        delete this.observers[id];
    };
    this.deleteObservers = function () {
        this.logdebug('deleteObservers');
        this.clearTimeout('doObserver');
    };
    this.closeConnections = function () {
        this.logdebug('closeConnections');
        this.deleteObservers();
    };
    this.logsilly = s => {
        if (this.isLogsilly) {
            this.adapter.log.silly(s);
        }
    };
    this.logdebug = s => {
        if (this.isLogdebug) {
            this.adapter.log.debug(s);
        }
    };
    this.logerror = function (s) {
        this.adapter.log.error(s);
    };
    this.loginfo = s => {
        this.adapter.log.info(s);
    };

    this.init.bind(this)();
}
module.exports = IoOlServer;
