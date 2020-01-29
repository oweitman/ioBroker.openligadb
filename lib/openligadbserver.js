 const http = require('https');
 
 
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
    
    const api_ep_gettable       = "https://www.openligadb.de/api/getbltable/%LEAGUE%/%SEASON%";
    const api_ep_actplayday     = "https://www.openligadb.de/api/getmatchdata/%LEAGUE%";
    const api_ep_allmatches     = "https://www.openligadb.de/api/getmatchdata/%LEAGUE%/%SEASON%";
    const api_ep_actgroup       = "https://www.openligadb.de/api/getcurrentgroup/%LEAGUE%";
    const api_ep_nextgame       = "https://www.openligadb.de/api/getnextmatchbyleagueteam/%LEAGUEID%/%TEAMID%";
    const api_ep_allteams       = "https://www.openligadb.de/api/getavailableteams/%LEAGUE%/%SEASON%";

    this.stateTemplate = {
        'table': {
            name:   'table',
            read:   true,
            write:  false,
            type:   'string',
            role:   'value'
        },
        'currgameday': {
            name:   'currgameday',
            read:   true,
            write:  false,
            type:   'string',
            role:   'value'
        },
        'allmatches': {
            name:   'allmatches',
            read:   true,
            write:  false,
            type:   'string',
            role:   'value'
        }
    };
    
    this.adapter = adapter;
    this.log = {};
    this.logsilly = false;
    this.logdebug = true;
    this.observers = [];

    this.init = function() {
        this.setState('connection', true, 'info');
        this.doObserver();
    };
    this.doObserver = function() {
        this.log.silly('doObserver');
        this.getData();
        this.setTimeout('doObserver',this.doObserver.bind(this),this.adapter.config.refresh*60*1000);

    };
    
    this.getData = function() {
        var leagues = JSON.parse(this.adapter.config.leagues);        
        this.log.debug('getData ' + this.adapter.config.leagues);
        leagues.forEach(function(item) {
            this.getTable(item.league,item.season,function(league,season,data){
                var stateTemplate = this.stateTemplate['table'];
                this.adapter.createState(league,season,stateTemplate.name,stateTemplate);
                this.setState(stateTemplate.name,JSON.stringify(data),league,season);
            }.bind(this,item.league,item.season));
            this.getMatches(item.league,function(league,data){
                var stateTemplate = this.stateTemplate['currgameday'];
                this.adapter.createState(league,false,stateTemplate.name,stateTemplate);
                this.setState(stateTemplate.name,JSON.stringify(data),league);
            }.bind(this,item.league));
            this.getAllMatches(item.league,item.season,function(league,season,data){
                var stateTemplate = this.stateTemplate['allmatches'];
                this.adapter.createState(league,season,stateTemplate.name,stateTemplate);
                this.setState(stateTemplate.name,JSON.stringify(data),league,season);
            }.bind(this,item.league,item.season));
        }.bind(this));
    }
    
    this.getTable = function(league,season,callback) {
        if (league.length == 0) return "";
        if (season.length == 0) return "";
        var options = {
            "%LEAGUE%":league,
            "%SEASON%":season
            };
        return this.request(this.getUrlFromTemplate(options,api_ep_gettable),callback);                
    }
    this.getMatches = function(league,callback) {
        if (league.length == 0) return "";
        var options = {
            "%LEAGUE%":league
            };
        return this.request(this.getUrlFromTemplate(options,api_ep_actplayday),callback);                        
    }
    this.getAllMatches = function(league,season,callback) {
        if (league.length == 0) return "";
        if (season.length == 0) return "";
        var options = {
            "%LEAGUE%":league,
            "%SEASON%":season
            };
        return this.request(this.getUrlFromTemplate(options,api_ep_allmatches),callback);                
    }
    

    this.createState = function(stateTemplate,level1path=false,level2path=false,callback) {
        const name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + stateTemplate.name;
        this.log.silly('Create Key ' + name);
        this.adapter.createState(level1path,level2path,stateTemplate.name,stateTemplate,callback);
    };

    this.setState = function(name, value,level1path=false,level2path=false,callback) {
        name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + name;
        this.adapter.log.silly('setState name: ' + name + ' value: ' + value);
        this.adapter.setState(name, value, true, callback);
    };
    
    this.getUrlFromTemplate = function(options,urltemplate) {
        return urltemplate.replace(/%\w+%/g, function(option) {
           return options[option] || option;
        });        
    }
    this.request = function(url,callback) {
        this.log.debug("request url " + url);
         http.get(url, (res) => {
            const {
                statusCode
            } = res;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
            }
            if (error) {
                this.log.error(error.message);
                //console.error(error.message);
                // Consume response data to free up memory
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    this.log.silly(parsedData);
                    //console.log(parsedData);
                    callback(parsedData);
                } catch (e) {
                    this.log.error(e.message);
                    //console.error(e.message);
                }
            });
         }).on('error', (e) => {
            //console.error(`Got error: ${e.message}`);
            this.log.error(e.message);
         });
         
    }
    this.setTimeout = function(id,callback,time) {
        this.clearTimeout(id);
        this.observers[id]= setTimeout(callback.bind(this),time);
    };
    this.setInterval = function(id,callback,time) {
        this.clearInterval(id);
        this.observers[id]= setInterval(callback.bind(this),time);
    };
    this.clearInterval = function(id) {
        if (this.observers[id]) clearInterval(this.observers[id]);
        delete this.observers[id];
    };
    this.clearTimeout = function(id) {
        if (this.observers[id]) clearTimeout(this.observers[id]);
        delete this.observers[id];
    };
    this.log.silly = function(s) {
        if (this.logsilly) this.adapter.log.silly(s);
    }.bind(this);
    this.log.debug = function(s) {
        if (this.logdebug) this.adapter.log.debug(s);
    }.bind(this);
    this.log.error = function(s) {
        this.adapter.log.error(s);
    }.bind(this);
    this.log.info = function(s) {
        this.adapter.log.info(s);
    }.bind(this);


    this.init.bind(this)(); 

}
module.exports = IoOlServer;