const { ioUtil } = require('./ioUtil');
const axios = require('axios'); // for fetching the feed

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
class openligaserverclass {
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
    observers = {};
    /**
     * The constructor for the openligaserverclass
     *
     * @param adapter - the iobroker adapter
     */
    constructor(adapter) {
        this.adapter = adapter;
        this.ioUtil = new ioUtil(adapter);
        this.init();
    }
    /**
     * Initialize the openligadb server
     *
     * Sets up the state template and api endpoints
     *
     * @async
     * @returns A promise that resolves when the initialization is complete.
     */
    async init() {
        this.api_ep_gettable = 'https://api.openligadb.de/getbltable/%LEAGUE%/%SEASON%';
        this.api_ep_actplayday = 'https://api.openligadb.de/getmatchdata/%LEAGUE%';
        this.api_ep_allmatches = 'https://api.openligadb.de/getmatchdata/%LEAGUE%/%SEASON%';
        this.api_ep_actgroup = 'https://api.openligadb.de/getcurrentgroup/%LEAGUE%';
        //this.api_ep_nextgame       = "https://api.openligadb.de/getnextmatchbyleagueteam/%LEAGUEID%/%TEAMID%";
        //this.api_ep_allteams       = "https://api.openligadb.de/getavailableteams/%LEAGUE%/%SEASON%";
        this.api_ep_goalgetter = 'https://api.openligadb.de/getgoalgetters/%LEAGUE%/%SEASON%';

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
        this.isLogsilly = true;
        this.isLogdebug = true;
        await this.ioUtil.setStateAsync('connection', true, 'info', null);
        this.doObserver();
    }

    /**
     * Timer function to periodically call getData
     *
     */
    doObserver() {
        this.ioUtil.logsilly('doObserver');

        this.getData();
        this.ioUtil.setTimeout('doObserver', this.doObserver.bind(this), this.adapter.config.refresh * 60 * 1000);
    }
    /**
     * Gets all data for the configured leagues and seasons.
     *
     * Fetches the table, all matches, the current game day and the goal getter ranking for each configured league and season.
     * It then creates the state objects for each league and season if they do not exist, and sets the state values.
     *
     * This function is called periodically by the doObserver function.
     *
     * @async
     * @returns A promise that resolves when all data has been fetched and states have been set.
     */
    async getData() {
        this.ioUtil.logsilly('getData');
        let leagues = {};
        if (typeof this.adapter.config.leagues == 'object') {
            leagues = this.adapter.config.leagues;
        } else {
            leagues = JSON.parse(this.adapter.config.leagues);
        }
        this.ioUtil.logdebug(`getData ${this.adapter.config.leagues}`);
        if (this.stateTemplate) {
            leagues.forEach(async item => {
                let stateTemplate;
                let league = item.league;
                let season = item.season;
                const table = await this.getTable(league, season);
                stateTemplate = this.stateTemplate?.['table'] ?? {};
                await this.ioUtil.createObjectNotExistsAsync(stateTemplate, league, season);
                await this.ioUtil.setStateAsync(stateTemplate.name, JSON.stringify(table), league, season);

                const allmatches = await this.getAllMatches(league, season);
                stateTemplate = this.stateTemplate?.['allmatches'] ?? {};
                await this.ioUtil.createObjectNotExistsAsync(stateTemplate, league, season);
                await this.ioUtil.setStateAsync(stateTemplate.name, JSON.stringify(allmatches), league, season);

                let currentGroup = await this.getCurrentGroup(league);
                currentGroup = this.calcCurrentGameDay(allmatches, currentGroup);
                stateTemplate = this.stateTemplate?.['currgameday'] ?? {};
                await this.ioUtil.createObjectNotExistsAsync(stateTemplate, league, season);
                await this.ioUtil.setStateAsync(stateTemplate.name, String(currentGroup), league, season);

                let goalgetter = await this.getGoalgetter(league, season);
                stateTemplate = this.stateTemplate?.['goalgetters'] ?? {};
                await this.ioUtil.createObjectNotExistsAsync(stateTemplate, league, season);
                await this.ioUtil.setStateAsync(stateTemplate.name, JSON.stringify(goalgetter), league, season);
            });
        }
    }
    /**
     * Fetches the table of a given league and season from openligadb.
     *
     * @param league League identifier, e.g. "bl1"
     * @param season Season identifier, e.g. "2022"
     * @returns Promise that resolves with the table data or an empty object if the league or season is invalid.
     */
    async getTable(league, season) {
        this.ioUtil.logsilly('getTable');
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
        return await this.request(this.getUrlFromTemplate(options, this.api_ep_gettable));
    }
    /**
     * Fetches the current match day of a given league from openligadb.
     *
     * @param league League identifier, e.g. "bl1"
     * @returns Promise that resolves with the current match day data or an empty object if the league is invalid.
     */
    async getMatches(league) {
        this.ioUtil.logsilly('getMatches');
        if (league.length == 0) {
            return '';
        }
        const options = {
            '%LEAGUE%': league,
        };
        return await this.request(this.getUrlFromTemplate(options, this.api_ep_actplayday));
    }
    /**
     * Fetches all matches of a given league and season from openligadb.
     *
     * @param league League identifier, e.g. "bl1"
     * @param season Season identifier, e.g. "2022"
     * @returns Promise that resolves with the all matches data or an empty object if the league or season is invalid.
     */
    async getAllMatches(league, season) {
        this.ioUtil.logsilly('getAllMatches');
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
        return await this.request(this.getUrlFromTemplate(options, this.api_ep_allmatches));
    }
    /**
     * Fetches the current group of a given league from openligadb.
     *
     * @param league League identifier, e.g. "bl1"
     * @returns Promise that resolves with the current group data or an empty object if the league is invalid.
     */
    async getCurrentGroup(league) {
        this.ioUtil.logsilly('getCurrentGroup');
        if (league.length == 0) {
            return '';
        }
        const options = {
            '%LEAGUE%': league,
        };
        return await this.request(this.getUrlFromTemplate(options, this.api_ep_actgroup));
    }
    /**
     * Fetches the goal scorer information for a given league and season from openligadb.
     *
     * @param league League identifier, e.g. "bl1"
     * @param season Season identifier, e.g. "2022"
     * @returns Promise that resolves with the goal getter data or an empty string if the league or season is invalid.
     */
    async getGoalgetter(league, season) {
        this.ioUtil.logsilly('getGoalgetter');
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
        return await this.request(this.getUrlFromTemplate(options, this.api_ep_goalgetter));
    }

    /**
     * Processes incoming messages and triggers appropriate actions.
     *
     * @param msg {object} - The message object containing command information.
     * @param msg.command {string} - The command to be processed, e.g., 'getMatchData'.
     *
     * This function logs the received message and checks the command type.
     * If the command is 'getMatchData', it triggers the getMatchData function
     * with the provided message object.
     */
    processMessages(msg) {
        this.ioUtil.logdebug(`processMessages ${JSON.stringify(msg)}`);
        if (msg.command === 'getMatchData') {
            this.ioUtil.logdebug('send getMatchData');
            this.getMatchData(msg);
        }
    }

    /**
     * Fetches match data from OpenLigaDB for a given league, season, and time range.
     *
     * @param msg {object} - The message object containing command information.
     *
     * This function filters the match data based on the provided time range and sends the result back
     * to the adapter that sent the message. If the time range is invalid, it sends an error message.
     */
    async getMatchData(msg) {
        this.ioUtil.logsilly('getMatchData ');
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
            let allmatches = await this.getAllMatches(league, season);
            if (error == '') {
                allmatches = allmatches.filter(
                    match => new Date(match.matchDateTime) >= dstart && new Date(match.matchDateTime) <= dend,
                );
                this.ioUtil.logdebug(
                    `getMatchData send${msg.from} ${msg.command} ${JSON.stringify(allmatches).substring(0, 100)} ${
                        msg.callback
                    }`,
                );
                if (msg.callback) {
                    this.adapter.sendTo(msg.from, msg.command, allmatches, msg.callback);
                }
            } else {
                if (msg.callback) {
                    this.adapter.sendTo(msg.from, msg.command, `error: ${error}`, msg.callback);
                }
            }
        }
    }
    /**
     * Checks if the current date is between two given dates.
     *
     * @param date1 - the first date in ISO notation
     * @param date2 - the second date in ISO notation
     * @returns true if the current date is between the two given dates, false otherwise
     */
    isGameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getTime() < new Date().getTime() && new Date().getTime() < d2.getTime();
    }
    /**
     * Calculates half the difference in milliseconds between two dates.
     *
     * @param date1 - The first date in a string format that can be parsed by the Date constructor.
     * @param date2 - The second date in a string format that can be parsed by the Date constructor.
     * @returns Half the difference in milliseconds between the two dates.
     */
    calcDiffDays(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (d2.getTime() - d1.getTime()) / 2;
    }
    /**
     * Calculates a new date by adding the given difference in milliseconds to the first date.
     *
     * @param date1 - The first date in a string format that can be parsed by the Date constructor.
     * @param diff - The difference in milliseconds to add to the first date.
     * @returns The new date in ISO notation.
     */
    calcDays(date1, diff) {
        const d1 = new Date(date1);
        return `${new Date(d1.getTime() + diff).toISOString().split('.')[0]}Z`;
    }
    /**
     * Calculates the current game day.
     *
     * @param allmatches - An array of all matches.
     * @param currentGameDay - The current game day.
     * @returns The current game day. If the first match is in the future then 1 is returned.
     */
    calcCurrentGameDay(allmatches, currentGameDay) {
        let firstPlayDate = allmatches.reduce(
            (previousValue, currentValue) => {
                return new Date(previousValue.matchDateTime) < new Date(currentValue.matchDateTime)
                    ? previousValue
                    : currentValue;
            },
            { matchDateTime: '0', groupOrderID: 1 },
        );
        if (new Date(firstPlayDate.matchDateTime) > new Date()) {
            return 1;
        }
        return currentGameDay.groupOrderID;
    }
    /**
     * Replaces placeholders in the given URL template with values from the options object.
     * The placeholders are expected to be in the format of %KEY%, where KEY is a key in the options object.
     * If the key is not found in the options object the placeholder will be left unchanged.
     *
     * @param options - An object with values to replace placeholders.
     * @param urltemplate - A string containing placeholders to be replaced.
     * @returns The URL with replaced placeholders.
     */
    getUrlFromTemplate(options, urltemplate) {
        return urltemplate.replace(/%\w+%/g, function (option) {
            return options[option] || option;
        });
    }
    /**
     * Sends a GET request to the given URL and returns the response data.
     * If an error occurs it is logged as an error and the function returns undefined.
     *
     * @param url - The URL to request.
     * @returns The response data or undefined if an error occurred.
     */
    async request(url) {
        this.ioUtil.logdebug(`request url ${url}`);
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            this.ioUtil.logerror(error.message);
        }
    }
}
module.exports = openligaserverclass;
