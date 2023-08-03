/*
    ioBroker.vis openligadb Widget-Set

    Copyright 2020 oweitman oweitman@gmx.de
    
*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "allmatches_oid": {"en": "allmatches", "de": "allmatches", "ru": "allmatches"},
        "currgameday_oid": {"en": "currgameday", "de": "currgameday", "ru": "currgameday"},
        "showgameday": {"en": "showgameday", "de": "showgameday", "ru": "showgameday"},
        "showgamedaycount": {"en": "showgamedaycount", "de": "showgamedaycount", "ru": "showgamedaycount"},
        "maxicon": {"en": "maxicon", "de": "maxicon", "ru": "maxicon"},
        "shortname": {"en": "shortname", "de": "shortname", "ru": "shortname"},
        "showgoals": {"en": "showgoals", "de": "showgoals", "ru": "showgoals"},
        "showweekday": {"en": "showweekday", "de": "showweekday", "ru": "showweekday"},
        });
}

vis.binds["openligadb"] = {
    version: "0.5.0",
    showVersion: function () {
        if (vis.binds["openligadb"].version) {
            console.log('Version openligadb: ' + vis.binds["openligadb"].version);
            vis.binds["openligadb"].version = null;
        }
    },
    
    pivottable: {
        createWidget: function (widgetID, view, data, style) {
            
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].pivottable.createWidget(widgetID, view, data, style);
                }, 100);
            }

            var allmatches  = data.allmatches_oid ? JSON.parse(vis.states.attr(data.allmatches_oid + '.val')) : [];
            var currgameday = data.currgameday_oid ? vis.states.attr(data.currgameday_oid + '.val') : 1;
            currgameday = currgameday || 1;
            var maxicon = data.maxicon || 25;
            var shortname = data.shortname || false;
            var highlight = data.highlight || '';
            var sort = data.sort || 'table';
            var highlightontop = data.highlightontop || false;
            
            function onChange(e, newVal, oldVal) {
                vis.binds["openligadb"].pivottable.createWidget(widgetID, view, data, style);
            }

            if (data.allmatches_oid && data.currgameday_oid) {
                if (1 || !vis.editMode) {
                    vis.binds["openligadb"].bindStates($div,[data.allmatches_oid,data.currgameday_oid],onChange);                    
                }
            }

            if (!allmatches) return;
            var pivottable = allmatches.reduce(function(collect,item){
                if (collect.hasOwnProperty(item.team1.teamName)) {
                    var team =collect[item.team1.teamName];
                } else {
                    var team = {
                        "teamName":             item.team1.teamName,
                        "shortName":            item.team1.shortName,
                        "teamIconUrl":          item.team1.teamIconUrl,
                        "gamedays":             []
                    }
                }
                var result = vis.binds["openligadb"].getResult(item.matchResults);
                var team1result = result.hasOwnProperty('pointsTeam1') ? result.pointsTeam1 : '-';
                var team2result = result.hasOwnProperty('pointsTeam2') ? result.pointsTeam2 : '-';
                if (item.group.groupOrderID>currgameday) {
                    team1result='-';
                    team2result='-';                    
                }

                var game = {
                        "matchDateTime":        item.matchDateTime,
                        "result":               team1result + ':'+ team2result,
                        "groupName":            item.group.groupName,
                        "groupOrderID":         item.group.groupOrderID,
                        "teamName":             item.team2.teamName,
                        "shortName":            item.team2.shortName,
                        "teamIconUrl":          item.team2.teamIconUrl
                };
                
                team.gamedays[item.team2.teamName] = game;
                collect[item.team1.teamName] = team;
                return collect;
                
            },[]);
            var table = vis.binds["openligadb"].table3.calcTable(allmatches, 1, currgameday, currgameday);
            var newtable = new Array();
            for (var items in table){
                newtable.push( table[items] );
            }
            if (sort=='table') {
                table = newtable.sort(function(a,b) {
                    return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : (a.goalDiff<b.goalDiff) ? 1: (a.goalDiff>b.goalDiff)? -1:0);
                });
            }
            if (sort=='name') {
                table = newtable.sort(function(a,b) {
                    var name1,name2
                    name1 = (shortname)? a.shortName : a.teamName;
                    name2 = (shortname)? b.shortName : b.teamName;
                    return (name1 > name2) ? 1 : (name1 < name2) ? -1:0;
                });
            }
            if (highlightontop) {
                if (highlight.trim()!='') {
                    var tophighlight = highlight.split(';');
                    tophighlight = tophighlight.reverse();
                    for (var i=0;i<tophighlight.length;i++) {
                        var topindex = table.findIndex(function(item){
                            return item.teamName.toLowerCase().indexOf(tophighlight[i].toLowerCase())>=0; 
                        });
                        if (topindex>0) table.splice(0,0,table.splice(topindex,1)[0]);
                    }
                }
            }
            
            var text ='';
            
            text += '<style> \n';
            text += '#'+widgetID + ' .oldb-icon {\n';
            text += '   max-height: ' + maxicon + 'px; \n';
            text += '   max-width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-center {\n';
            text += '   text-align: center;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt td{\n';
            text += '   white-space: nowrap;\n';
            text += '} \n';            
            text += '#'+widgetID + ' .oldb-full {\n';
            text += '   width: 100%;\n';
            text += '} \n';                                    
            text += '</style> \n';            
            
            text += '<table class="oldb-tt">';
            text += '        <tr>';
            text += '           <th class="oldb-center oldb-rank">#</th><th></th><th></th>';
            table.forEach(function(team, index) {
                text += '           <th class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="'+team.teamIconUrl+'">';
                text += '           </th>';                
            });
            text += '           <th class="oldb-center oldb-goaldiff">Diff</th><th class="oldb-center oldb-points">Punkte</th>';
            text += '        </tr>';            
            var pteam1,pteam2;            
            table.forEach(function(team1, index) {
                pteam1 = pivottable[team1.teamName];
                var team1name = shortname ? team1.shortName : team1.teamName;
                if (vis.binds["openligadb"].checkHighlite(team1.teamName,highlight)) team1name = '<b class="favorite">' + team1name + '</b>';
                text += '        <tr>';
                text += '            <td class="oldb-center oldb-rank">';
                text += team1.ranking[team1.ranking.length-1];
                text += '            </td>';                
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="'+team1.teamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-teamname oldb-full">'+team1name+'</td>';
                table.forEach(function(team2, index) {
                    if (team1.teamName==team2.teamName) {
                        text += '           <td class=""></td>';
                        return;
                    }
                    var result = pteam1.gamedays[team2.teamName].result;
                    text += '           <td class="oldb-center oldb-result">'+result+'</td>';
                });
                text += '           <td class="oldb-center oldb-goaldiff">'+team1.goalDiff+'</td>';
                text += '           <td class="oldb-center oldb-points">'+team1.points+'</td>';
                text += '        </tr>';
            });
            text += '</table>';
            $('#' + widgetID).html(text);
        },    
    },
            
    goalgetters: {
        createWidget: function (widgetID, view, data, style) {
            
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].goalgetters.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            var goalgetters  = data.goalgetters_oid ? JSON.parse(vis.states.attr(data.goalgetters_oid + '.val')) : [];
            var maxcount = data.maxcount || 99999;
            var sort = data.sort || 'goal';
            var highlight = data.highlight || '';
            var showonlyhighlight = data.showonlyhighlight || false;
            
            function onChange(e, newVal, oldVal) {
                vis.binds["openligadb"].goalgetters.createWidget(widgetID, view, data, style);
            }

            if (data.goalgetters_oid) {
                if (1 || !vis.editMode) {
                    vis.binds["openligadb"].bindStates($div,[data.goalgetters_oid],onChange);                    
                }
            }            
                                   
            goalgetters = this.setName(goalgetters);
            
            if (sort=='goal') {
                goalgetters = goalgetters.sort(function(a,b){
                   return b.goalCount-a.goalCount;
                });
            }
            if (sort=='name') {
                goalgetters = goalgetters.sort(function(a,b){
                    return ('' + a.lastname + ' ' + a.prename).localeCompare('' + b.lastname + ' ' + b.prename);
                });
            }
            
            var text ='';

            text += '<style> \n';
            text += '#'+widgetID + ' .oldb-tt td{\n';
            text += '   white-space: nowrap;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-left {\n';
            text += '   text-align: left;\n';
            text += '} \n';            
            text += '</style> \n';            
            
            text += '<table class="oldb-gg">';
            text += '        <tr>';
            text += '           <th class="oldb-left">Name</td>';
            text += '           <th class="oldb-left">Tore</td>';
            text += '        </tr>';
            var count=0;
            goalgetters.forEach(function(goalgetter, index) {
                
                if (count<maxcount) {
                    
                    var name = '';
                    name += goalgetter.lastname;
                    (goalgetter.prename) ? name += ', ' + goalgetter.prename : name += goalgetter.prename;
                    var check = vis.binds["openligadb"].checkHighlite(name,highlight);
                    if (check) name = '<b>'+name+'</b>';
                    
                    if (!showonlyhighlight || showonlyhighlight && check) {
                        text += '        <tr>';
                        text += '           <td class="oldb-left">'+ name +'</td>';
                        text += '           <td class="oldb-left">'+ goalgetter.goalCount  +'</td>';
                        text += '        </tr>';
                        count++;
                    }
                }
            });
            text += '</table>            ';            
            $('#' + widgetID).html(text);            
        },         
        setName: function(goalgetters) {
            var arr;
            goalgetters.forEach(function(goalgetter, index) {
                const regex_c1 = /(.+), ?(.+)/g;
                const regex_c2 = /(.+)\. ?(.+)/g;
                var name = goalgetter.goalGetterName.trim();
                goalgetter.ok = false;
                arr = regex_c1.exec(name);
                if ((arr) && arr[1] && arr[2]) {
                    goalgetter.prename = arr[2];
                    goalgetter.lastname = arr[1];
                    goalgetter.ok = true;
                    return;
                }
                arr = regex_c2.exec(name);
                if ((arr) && arr[1] && arr[2]) {
                    goalgetter.lastname = arr[2];
                    goalgetter.prename = arr[1] + '.';
                    goalgetter.ok = true;
                    return;
                }
                arr = name.split(' ');
                if ((arr) && arr.length>1) {
                    goalgetter.lastname = arr.pop();
                    goalgetter.prename = arr.join(' ');  
                    goalgetter.ok = true;
                    return;
                }
                if ((arr) && arr.length==1) {
                    goalgetter.lastname = arr.pop();
                    goalgetter.prename = '';  
                    goalgetter.ok = true;
                }                
            });
            return goalgetters;
        },    
    },

    favgames2: {
        createWidget: function (widgetID, view, data, style) {
            
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].favgames2.createWidget(widgetID, view, data, style);
                }, 100);
            }
            var favgames = [];
            var showabbreviation = data.showabbreviation || false;
            var showweekday = data.showweekday || false;
            var showresult = data.showresult || false;
            var maxicon = data.maxicon || 25;
            var nohighlight = '';
            var bound = [];

            for (var i = 1; i <= data.lCount; i++) {

                var allmatches  = data['allmatches_oid'+i] ? JSON.parse(vis.states.attr( data['allmatches_oid'+i] + '.val')) : {};
                var currgameday = data['currgameday_oid'+i] ? JSON.parse(vis.states.attr(data['currgameday_oid'+i] + '.val')) : {};
                if (data['allmatches_oid'+i]) bound.push(data['allmatches_oid'+i]);
                if (data['currgameday_oid'+i]) bound.push(data['currgameday_oid'+i]);
                var showgameday = data['showgameday'+i] || '';
                if (vis.editMode && /{.*}/gm.test(showgameday))  showgameday = '';
                if (showgameday==0) showgameday='';
                showgameday = showgameday || currgameday || '';
                var showgamedaycount = data['showgamedaycount'+i] || 9999;
                if (showgamedaycount==0) showgamedaycount = 9999;

                var abbreviation = data['abbreviation'+i] || '';
                var shortname = data['shortname'+i] || false;
                var highlight = data['highlight'+i] || '';

                favgames=favgames.concat(this.filterFavGames(allmatches, showgameday, showgamedaycount, currgameday, highlight,shortname,abbreviation));  
                if (highlight=='') nohighlight += 'group'+i+' ';
            }

            function onChange(e, newVal, oldVal) {
                vis.binds["openligadb"].favgames2.createWidget(widgetID, view, data, style);
            }

            if (bound.length>0) {
                if (1 || !vis.editMode) {
                    vis.binds["openligadb"].bindStates($div,bound,onChange);                    
                }
            }            
            


            
            favgames = this.sortFavGames(favgames);

            var weekday_options = { weekday: 'short' };
            //var date_options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            var date_options = { month: '2-digit', day: '2-digit' };
            var time_options = { hour: '2-digit', minute: '2-digit' };            
            var text ='';
            
            text += '<style> \n';
            text += '#'+widgetID + ' .oldb-icon {\n';
            text += '   max-height: ' + maxicon + 'px; \n';
            text += '   max-width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tdicon {\n';
            text += '   width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt {\n';
            text += '   width: 100%;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt td{\n';
            text += '   white-space: nowrap;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-full {\n';
            text += '   width: 50%;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-center {\n';
            text += '   text-align: center;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-right {\n';
            text += '   text-align: right;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-left {\n';
            text += '   text-align: left;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-datetime {\n';
            text += '       font-weight: bold;\n';
            text += '} \n';            
            text += '</style> \n';
            
            text += '<table class="oldb-tt">';

            favgames.forEach(function(match, index) {
                var team1name = match.shortname ? match.team1.shortName : match.team1.teamName;
                var team2name = match.shortname ? match.team2.shortName : match.team2.teamName;
                if (vis.binds["openligadb"].checkHighlite(team1name,match.highlight)) team1name = '<b class="favorite">' + team1name + '</b>';
                if (vis.binds["openligadb"].checkHighlite(team2name,match.highlight)) team2name = '<b class="favorite">' + team2name + '</b>';
                var result = vis.binds["openligadb"].getResult(match.matchResults);
                var team1result = result.hasOwnProperty('pointsTeam1') ? result.pointsTeam1 : '-';
                var team2result = result.hasOwnProperty('pointsTeam2') ? result.pointsTeam2 : '-';
                
                var today = new Date();
                var mdate = vis.binds["openligadb"].getDateFromJSON(match.matchDateTime);
                (vis.binds["openligadb"].compareDate(today,mdate)) ? text += '        <tr class="todaygame">' : text += '        <tr>';

                if (showweekday) text += '           <td class="oldb-left">'+ vis.binds["openligadb"].getDateFromJSON(match.matchDateTime).toLocaleString(vis.language,weekday_options)  +'</td>';
                text += '           <td class="oldb-left">'+ vis.binds["openligadb"].getDateFromJSON(match.matchDateTime).toLocaleString(vis.language,date_options)  +'</td>';
                text += '           <td class="oldb-left">'+ vis.binds["openligadb"].getDateFromJSON(match.matchDateTime).toLocaleString(vis.language,time_options)  +'</td>';
                if (showabbreviation) text += '           <td class="oldb-left">'+ match.abbreviation +'</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="'+match.team1.teamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-full">'+ team1name +'</td>';
                if (showresult) text += '           <td class="oldb-left">'+team1result+'</td>';
                text += '           <td class="oldb-left">:</td>';
                if (showresult) text += '           <td class="oldb-left">'+team2result+'</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-left oldb-icon" src="'+match.team2.teamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-full">'+ team2name +'</td>';                
                text += '        </tr>';
            });
            if (nohighlight != '') text += '<tr><td>No filter set for: ' + nohighlight + '</td></tr>';
            text += '</table>            ';            
            $('#' + widgetID).html(text);            

        },
        filterFavGames: function(allmatches,gameday,gamedaycount,currgameday,highlight,shortname, abbreviation) {
            if (!Array.isArray(allmatches)) return [];
            gameday = parseInt(gameday);
            gamedaycount = parseInt(gamedaycount);
            currgameday = parseInt(currgameday);
            
            return allmatches.reduce(function(result,item){
                var found;
                item.abbreviation = abbreviation;
                if (gameday > 0 && item.group.groupOrderID >= gameday && item.group.groupOrderID < gameday + gamedaycount ) found=item;
                if (gameday < 0 && item.group.groupOrderID >= currgameday + gameday && item.group.groupOrderID < currgameday + gameday + gamedaycount) found=item;
                item.highlight=highlight;
                item.shortname=shortname;
                if (found && (vis.binds["openligadb"].checkHighlite(item.team1.teamName,highlight) || vis.binds["openligadb"].checkHighlite(item.team2.teamName,highlight)) ) result.push(item);
                return result;
            },[]);            
        },
        sortFavGames: function(favgames) {
            return favgames.sort(function(a,b){
                var comp = 0;
                if (vis.binds["openligadb"].getDateFromJSON(a.matchDateTime).getTime()>vis.binds["openligadb"].getDateFromJSON(b.matchDateTime).getTime()) comp=1;
                if (vis.binds["openligadb"].getDateFromJSON(a.matchDateTime).getTime()<vis.binds["openligadb"].getDateFromJSON(b.matchDateTime).getTime()) comp=-1;
                return comp;
            });
        },
    },         
    
    favgames: {
        createWidget: function (widgetID, view, data, style) {
            
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].favgames.createWidget(widgetID, view, data, style);
                }, 100);
            }
            var allmatches  = data.allmatches_oid ? JSON.parse(vis.states.attr(data.allmatches_oid + '.val')) : {};
            var currgameday = data.currgameday_oid ? JSON.parse(vis.states.attr(data.currgameday_oid + '.val')) : {};
            var showgameday = data.showgameday || '';
            if (vis.editMode && /{.*}/gm.test(showgameday))  showgameday = '';
            if (showgameday==0) showgameday='';
            showgameday = showgameday || currgameday || '';
            var showgamedaycount = data.showgamedaycount || 9999;
            if (showgamedaycount==0) showgamedaycount = 9999;

            var maxicon = data.maxicon || 25;
            var shortname = data.shortname || false;
            var highlight = data.highlight || '';
            
            var favgames = this.filterFavGames(allmatches, showgameday, showgamedaycount, currgameday, highlight);  
            
            //var date_options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            var date_options = { month: '2-digit', day: '2-digit' };
            var time_options = { hour: '2-digit', minute: '2-digit' };            
            var text ='';
            
            text += '<style> \n';
            text += '#'+widgetID + ' .oldb-icon {\n';
            text += '   max-height: ' + maxicon + 'px; \n';
            text += '   max-width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tdicon {\n';
            text += '   width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt {\n';
            text += '   width: 100%;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt td{\n';
            text += '   white-space: nowrap;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-full {\n';
            text += '   width: 50%;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-center {\n';
            text += '   text-align: center;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-right {\n';
            text += '   text-align: right;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-left {\n';
            text += '   text-align: left;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-datetime {\n';
            text += '       font-weight: bold;\n';
            text += '} \n';            
            text += '</style> \n';
            
            text += '<table class="oldb-tt">';

            favgames.forEach(function(match, index) {
                var team1name = shortname ? match.team1.shortName : match.team1.teamName;
                var team2name = shortname ? match.team2.shortName : match.team2.teamName;
                
                text += '        <tr>';
                text += '           <td class="oldb-left">'+ vis.binds["openligadb"].getDateFromJSON(match.matchDateTime).toLocaleString(vis.language,date_options)  +'</td>';
                text += '           <td class="oldb-left">'+ vis.binds["openligadb"].getDateFromJSON(match.matchDateTime).toLocaleString(vis.language,time_options)  +'</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="'+match.team1.teamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-full">'+ team1name +'</td>';
                text += '           <td class="oldb-left">:</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-left oldb-icon" src="'+match.team2.teamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-full">'+ team2name +'</td>';                
                text += '        </tr>';
            });
            if (highlight == '') text += '<tr><td>Not filter set</td></tr>';
            text += '<tr><td colspan="7">This widget is deprecated. Please use FavGames2</td></tr>';
            text += '</table>            ';            
            $('#' + widgetID).html(text);            

            
        },
        filterFavGames: function(allmatches,gameday,gamedaycount,currgameday,highlight) {
            gameday = parseInt(gameday);
            gamedaycount = parseInt(gamedaycount);
            currgameday = parseInt(currgameday);
            
            return allmatches.reduce(function(result,item){
                var found;
                if (gameday > 0 && item.group.groupOrderID >= gameday && item.group.groupOrderID < gameday + gamedaycount ) found=item;
                if (gameday < 0 && item.group.groupOrderID >= currgameday + gameday && item.group.groupOrderID < currgameday + gameday + gamedaycount) found=item;
                if (found && (vis.binds["openligadb"].checkHighlite(item.team1.teamName,highlight) || vis.binds["openligadb"].checkHighlite(item.team2.teamName,highlight)) ) result.push(item);
                return result;
            },[]);            
        },
        
    },     

    gameday: {
        createWidget: function (widgetID, view, data, style) {
            
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].gameday.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            var allmatches  = data.allmatches_oid ? JSON.parse(vis.states.attr(data.allmatches_oid + '.val')) : [];
            var currgameday = data.currgameday_oid ? vis.states.attr(data.currgameday_oid + '.val') : 1;
            var showgameday = data.showgameday || '';
            if (vis.editMode && /{.*}/gm.test(showgameday))  showgameday = '';
            if (showgameday==0) showgameday='';
            var showgamedaycount = data.showgamedaycount || 1;
            if (showgamedaycount==0) showgamedaycount = 1;
            var showweekday = data.showweekday || false;
            var showgoals = data.showgoals || false;

            var maxicon = data.maxicon || 25;
            var shortname = data.shortname || false;
            var highlight = data.highlight || '';

            function onChange(e, newVal, oldVal) {
                vis.binds["openligadb"].gameday.createWidget(widgetID, view, data, style);
            }

            if (data.allmatches_oid && data.currgameday_oid) {
                if (1 || !vis.editMode) {
                    vis.binds["openligadb"].bindStates($div,[data.allmatches_oid,data.currgameday_oid],onChange);                    
                }
            }            
            
            var matches = this.filterGameDay(allmatches,showgameday || currgameday || '', showgamedaycount, currgameday);
            var gamedays = this.groupGameDay(matches,shortname,highlight);
            
            var text ='';

            text += '<style> \n';
            text += '#'+widgetID + ' .oldb-icon {\n';
            text += '   max-height: ' + maxicon + 'px; \n';
            text += '   max-width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tdicon {\n';
            text += '   width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt {\n';
            text += '   width: 100%;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt td{\n';
            text += '   white-space: nowrap;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-wrap {\n';
            text += '   white-space: normal !important;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-goal {\n';
            text += '   white-space: nowrap;\n';
            text += '   display: inline-block;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-full {\n';
            text += '   width: 50%;\n';
            text += '} \n';            
            text += '#'+widgetID + ' .oldb-center {\n';
            text += '   text-align: center;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-right {\n';
            text += '   text-align: right;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-left {\n';
            text += '   text-align: left;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-datetime {\n';
            text += '       font-weight: bold;\n';
            text += '} \n';
            text += '</style> \n';
            
            text += '<table class="oldb-tt">';

            var curDate,oldDate = new Date(0);
            //var date_options = (showweekday) ? { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' } : { year: 'numeric', month: '2-digit', day: '2-digit' };
            var date_options = (showweekday) ? { weekday: 'short', month: '2-digit', day: '2-digit' } : { month: '2-digit', day: '2-digit' };
            var time_options = { hour: '2-digit', minute: '2-digit' };

            gamedays.forEach(function(gameday, index) {

                var today = new Date();
                var gddate = vis.binds["openligadb"].getDateFromJSON(gameday.matchDateTime);
                
                var classtext = (vis.binds["openligadb"].compareDate(today,gddate)) ? 'todaygameheader':'';
                classtext +=    (gameday.favorite) ? ' favorite' : '';
                (classtext!='')? text += '        <tr class="'+ classtext + '">' : text += '        <tr>';

                text += '           <td class="oldb-right oldb-datetime" colspan="3">'+ gddate.toLocaleString(vis.language,date_options) +'</td>';
                text += '           <td class=""></td>';
                text += '           <td class="oldb-left oldb-datetime" colspan="3">'+ gddate.toLocaleString(vis.language,time_options) +'</td>';
                text += '        </tr>';
                gameday.matches.forEach(function(match, index) {
                    var mdate = vis.binds["openligadb"].getDateFromJSON(match.matchDateTime);

                    var team1name = shortname ? match.team1.shortName : match.team1.teamName;
                    var team2name = shortname ? match.team2.shortName : match.team2.teamName;
                    if (match.team1.favorite) {
                        team1name = '<b class="favorite">' + team1name + '</b>';
                    }
                    if (match.team2.favorite) {
                        team2name = '<b class="favorite">' + team2name + '</b>';
                    }

                    var result = vis.binds["openligadb"].getResult(match.matchResults);
                    var team1result = result.hasOwnProperty('pointsTeam1') ? result.pointsTeam1 : '-';
                    var team2result = result.hasOwnProperty('pointsTeam2') ? result.pointsTeam2 : '-';
                    
                    (vis.binds["openligadb"].compareDate(today,mdate)) ? text += '        <tr class="todaygame">' : text += '        <tr>';  
                    text += '           <td class="oldb-right oldb-full">'+ team1name +'</td>';
                    text += '           <td class="oldb-center oldb-tdicon">';
                    text += '              <img class="oldb-icon" src="'+match.team1.teamIconUrl+'">';
                    text += '           </td>';
                    text += '           <td class="oldb-center">'+team1result+'</td>';
                    text += '           <td class="oldb-center">:</td>';
                    text += '           <td class="oldb-center">'+team2result+'</td>';
                    text += '           <td class="oldb-center oldb-tdicon">';
                    text += '              <img class="oldb-center oldb-icon" src="'+match.team2.teamIconUrl+'">';
                    text += '           </td>';
                    text += '           <td class="oldb-left oldb-full">'+ team2name +'</td>';                
                    text += '        </tr>';

                    var goals = this.getGoals(match);
                    if (showgoals && goals !='' ) {
                        text += '        <tr>';
                        text += '           <td class="oldb-center oldb-wrap" colspan="7"><small>'+ this.getGoals(match) +'</small></td>';                                
                        text += '        </tr>';
                    }
                }.bind(this));
            }.bind(this));

            text += '</table>            ';

            $('#' + widgetID).html(text);
        },
        filterGameDay: function(allmatches,gameday,gamedaycount,currgameday) {
            gameday = parseInt(gameday);
            gamedaycount = parseInt(gamedaycount);
            currgameday = parseInt(currgameday);
            
            return allmatches.reduce(function(result,item){
                if (gameday > 0 && item.group.groupOrderID >= gameday && item.group.groupOrderID < gameday + gamedaycount ) result.push(item);
                if (gameday < 0 && item.group.groupOrderID >= currgameday + gameday && item.group.groupOrderID < currgameday + gameday + gamedaycount) result.push(item);
                return result;
            },[]);            
        },
        groupGameDay: function(allmatches,shortname,highlight) {
            var newarray = new Array();
            var objectarr;
            objectarr =  allmatches.reduce(function(result,item){
                if (result.hasOwnProperty(item.matchDateTime)) {
                    var gameday =result[item.matchDateTime];
                } else {
                    var gameday = {
                        "matchDateTime":    item.matchDateTime,
                        "matches":          [],
                        "favorite":         false                        
                    }
                }
                var team1name = shortname ? item.team1.shortName : item.team1.teamName;
                var team2name = shortname ? item.team2.shortName : item.team2.teamName;
                item.team1.favorite=false;
                item.team2.favorite=false;
                if (vis.binds["openligadb"].checkHighlite(team1name,highlight)) {
                    item.team1.favorite=true;
                    gameday.favorite =true;
                }
                if (vis.binds["openligadb"].checkHighlite(team2name,highlight)) {
                    team2name = '<b class="favorite">' + team2name + '</b>';
                    item.team2.favorite=true;
                    gameday.favorite =true;
                }
                gameday.matches.push(item);
                result[item.matchDateTime]=gameday;
                return result;
            },[]);      
            for (var items in objectarr){
                newarray.push( objectarr[items] );
            }            
            return newarray;
            
        },        
        getGoals: function(match) {
            var goaltxts = '';
            match.goals.forEach(function(goal, index,arr) {
                var goaltxt = '';
                var name = (goal.goalGetterName)?' '+goal.goalGetterName:"";
                var minute = (goal.matchMinute)?' ('+goal.matchMinute+')':"";
                goaltxt += goal.scoreTeam1+':'+goal.scoreTeam2+name+minute;
                goaltxt += (goal.isPenalty) ? ' (Elfmeter)' : '';
                goaltxt += (goal.isOwnGoal) ? ' (Eigentor)' : '';
                goaltxt += index < arr.length-1 ? ', ' : '';
                goaltxts += '<span class="oldb-goal">' + goaltxt + '</span>';
            });
            return goaltxts;
        }       
    },
    table3: {
        createWidget: function (widgetID, view, data, style) {        
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].table3.createWidget(widgetID, view, data, style);
                }, 100);
            }
            var allmatches = data.allmatches_oid ? JSON.parse(vis.states.attr(data.allmatches_oid + '.val')) : [];
            var currgameday = data.currgameday_oid ? vis.states.attr(data.currgameday_oid + '.val') : 1;

            var showgameday = data.showgameday || '';
            if (vis.editMode && /{.*}/gm.test(showgameday))  showgameday = '';
            if (showgameday==0) showgameday='';
            showgameday = showgameday || currgameday || '';
            var lastgamecount = data['lastgamecount'] || showgameday;
            if (lastgamecount==0) lastgamecount = showgameday;
            var showtrend = data.showtrend || false;

            var iconup = data.iconup || 'widgets/openligadb/img/trend_up.png';
            var icondn = data.icondn || 'widgets/openligadb/img/trend_dn.png';
            var iconst = data.iconst || 'widgets/openligadb/img/trend_st.png';
            
            var mode_binding = data.mode_binding || '';
            data.mode = ('1total,2home,3away,4round1,5round2'.indexOf(mode_binding)>=0 && mode_binding!='') ? mode_binding : data.mode;
            
            var mode = data.mode || '1total';
            var mymode=mode[0];

            function onChange(e, newVal, oldVal) {
                vis.binds["openligadb"].table3.createWidget(widgetID, view, data, style);
            }

            if (data.allmatches_oid && data.currgameday_oid) {
                if (1 || !vis.editMode) {
                    vis.binds["openligadb"].bindStates($div,[data.allmatches_oid,data.currgameday_oid],onChange);                    
                }
            }            
            
            var table = this.calcTable(allmatches, mymode, showgameday, lastgamecount);
                
            var newtable = new Array();
            for (var items in table){
                newtable.push( table[items] );
            }
            table = newtable.sort(function(a,b) {
                return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : (a.goalDiff<b.goalDiff) ? 1: (a.goalDiff>b.goalDiff)? -1:0);
            }); 

            var maxicon = data.maxicon || 25;
            var shortname = data.shortname || false;
            var highlight = data.highlight || '';
            var filter = data.filter || '';
            //test
            
            var text ='';

            text += '<style> \n';
            text += '#'+widgetID + ' .oldb-icon {\n';
            text += '   max-height: ' + maxicon + 'px; \n';
            text += '   max-width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt {\n';
            text += '   width: 100%;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt td{\n';
            text += '   white-space: nowrap;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-full {\n';
            text += '   width: 100%;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-center {\n';
            text += '   text-align: center;\n';
            text += '} \n';
            text += '</style> \n';
            
            text += '<table class="oldb-tt">';
            text += '    <thead>';
            text += '    <tr >';            
            text += '        <th class="oldb-center oldb-rank">';
            text += '            #';
            text += '        </th>';
            text += '        <th colspan="2" class="oldb-clubheader" style="text-align: left;">';
            text += '            Club';
            text += '        </th>';
            text += '';
            text += '        <th class="oldb-center oldb-games">';
            text += '            Sp';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-won">';
            text += '            S';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-draw">';
            text += '            U';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-lost">';
            text += '            N';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-goals">';
            text += '            Tore';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-goaldiff">';
            text += '            Diff';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-points">';
            text += '            Punkte';
            text += '        </th>'; 
            if (showtrend) text += '        <th class="oldb-center oldb-trend">';
            if (showtrend) text += '            T';
            if (showtrend) text += '        </th>';
            
            text += '    </tr>';
            text += '    </thead>';

            text += '    <tbody class="oldb-tb">';
            
            table.forEach(function(team, index) {

                var teamname = shortname ? team.shortName : team.teamName;
                if (!(vis.binds["openligadb"].checkHighlite(teamname,filter)||filter=="")) return;
                if (vis.binds["openligadb"].checkHighlite(teamname,highlight)) teamname = '<b class="favorite">' + teamname + '</b>';
                
                text += '        <tr>';
                text += '            <td class="oldb-center oldb-rank">';
                text += index +1;
                text += '            </td>';
                text += '            <td class="oldb-center">';
                text += '                <img class="oldb-icon" src="'+team.teamIconUrl+'">';
                text += '            </td>';
                text += '            <td class="oldb-teamname oldb-full">';
                text += '                <span>'+teamname+'</span>';
                text += '            </td>';
                text += '            <td class="oldb-center oldb-games">';
                text += team.matches;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-won">';
                text += team.won;
                text += '           </td>';
                text += '            <td class="oldb-center oldb-draw">';
                text += team.draw;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-lost">';
                text += team.lost;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-goals">';
                text += team.goals + ':' + team.opponentGoals;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-goaldiff">';
                text += team.goalDiff;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-points">';
                text += '                <strong>'+team.points+'</strong>';
                text += '            </td>';
                var ticon='';
                if (showtrend) {
                    if (team.ranking[team.ranking.length-1]<team.ranking[team.ranking.length-2]) ticon = iconup;
                    if (team.ranking[team.ranking.length-1]>team.ranking[team.ranking.length-2]) ticon = icondn;
                    if (team.ranking[team.ranking.length-1]==team.ranking[team.ranking.length-2]) ticon = iconst;
                }

                if (showtrend) text += '            <td class="oldb-center oldb-points">';
                if (showtrend) text += '                <img class="oldb-icon" src="'+ticon+'">';
                if (showtrend) text += '            </td>';

                text += '        </tr>';
            });
            text += '    </tbody>';
            text += '</table>            ';
            
            $('#' + widgetID).html(text);
        },
        addRanking: function(table, prevgd) {
                var newtable = new Array();
                for (var items in table){
                    newtable.push( table[items] );
                }
                newtable = newtable.sort(function(a,b) {
                    return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : (a.goalDiff<b.goalDiff) ? 1: (a.goalDiff>b.goalDiff)? -1:0);
                });
                newtable.forEach(function(team, index) {
                    table[team.teamName].ranking[prevgd]=index+1;
                });
        },
        calcTable: function(allmatches, mymode, showgameday,lastgamecount) {
            
            var prevgd=0
            var self = this;
            if (!allmatches) return [];
            var maxgameday = allmatches.reduce(function(a, b) {
              return Math.max(a, b.group.groupOrderID);
            },0);

            var table = allmatches.reduce(function(result,item){
                if(item.group.groupOrderID!=prevgd && item.group.groupOrderID<=showgameday) {
                    self.addRanking(result,prevgd);
                }
                prevgd=item.group.groupOrderID;
                var team1name = item.team1.teamName;
                var shortname1 = item.team1.shortName;
                var teamiconurl1 = item.team1.teamIconUrl;
                var team2name = item.team2.teamName;
                var shortname2 = item.team2.shortName;
                var teamiconurl2 = item.team2.teamIconUrl;
                
                if (result.hasOwnProperty(team1name)) {
                    var team1 =result[team1name];
                } else {
                    var team1 = {
                        "teamName":         team1name,
                        "shortName":        shortname1,
                        "teamIconUrl":      teamiconurl1,
                        "points":           0,
                        "ranking":          [],
                        "opponentGoals":    0,
                        "goals":            0,
                        "matches":          0,
                        "won":              0,
                        "lost":             0,
                        "draw":             0,
                        "goalDiff":         0
                        
                    }
                }
                if (result.hasOwnProperty(team2name)) {
                    var team2 =result[team2name];
                } else {
                    var team2 = {
                        "teamName":         team2name,
                        "shortName":        shortname2,
                        "teamIconUrl":      teamiconurl2,
                        "points":           0,
                        "ranking":          [],
                        "opponentGoals":    0,
                        "goals":            0,
                        "matches":          0,
                        "won":              0,
                        "lost":             0,
                        "draw":             0,
                        "goalDiff":         0

                    }
                }
                var matchresult = vis.binds["openligadb"].getResult(item.matchResults);
                if (matchresult.hasOwnProperty('pointsTeam1') && item.group.groupOrderID<=showgameday && item.group.groupOrderID>showgameday-lastgamecount) {

                    if (matchresult.pointsTeam1>matchresult.pointsTeam2) {
                        if (mymode==1 || mymode ==2 || (mymode ==4 && item.group.groupOrderID<=maxgameday/2) || (mymode ==5 && item.group.groupOrderID>maxgameday/2)) {
                            team1.points        += 3;
                            team1.opponentGoals += matchresult.pointsTeam2;
                            team1.goals         += matchresult.pointsTeam1;
                            team1.matches       += 1;
                            team1.won           += 1;
                            team1.goalDiff      = team1.goals-team1.opponentGoals;
                        }

                        if (mymode==1 || mymode ==3 || (mymode ==4 && item.group.groupOrderID<=maxgameday/2) || (mymode ==5 && item.group.groupOrderID>maxgameday/2)) {
                            team2.points        += 0;
                            team2.opponentGoals += matchresult.pointsTeam1;
                            team2.goals         += matchresult.pointsTeam2;
                            team2.matches       += 1;
                            team2.lost          += 1;
                            team2.goalDiff      = team2.goals-team2.opponentGoals;
                        }                        
                    }
                    if (matchresult.pointsTeam1==matchresult.pointsTeam2) {
                        if (mymode==1 || mymode ==2 || (mymode ==4 && item.group.groupOrderID<=maxgameday/2) || (mymode ==5 && item.group.groupOrderID>maxgameday/2)) {
                            team1.points        += 1;
                            team1.opponentGoals += matchresult.pointsTeam2;
                            team1.goals         += matchresult.pointsTeam1;
                            team1.matches       += 1;
                            team1.draw          += 1;
                            team1.goalDiff      = team1.goals-team1.opponentGoals;
                        }

                        if (mymode==1 || mymode ==3 || (mymode ==4 && item.group.groupOrderID<=maxgameday/2) || (mymode ==5 && item.group.groupOrderID>maxgameday/2)) {
                            team2.points        += 1;
                            team2.opponentGoals += matchresult.pointsTeam1;
                            team2.goals         += matchresult.pointsTeam2;
                            team2.matches       += 1;
                            team2.draw          += 1;
                            team2.goalDiff      = team2.goals-team2.opponentGoals;
                        }
                    }
                    if (matchresult.pointsTeam1<matchresult.pointsTeam2) {
                        if (mymode==1 || mymode ==2 || (mymode ==4 && item.group.groupOrderID<=maxgameday/2) || (mymode ==5 && item.group.groupOrderID>maxgameday/2)) {
                            team1.points        += 0;
                            team1.opponentGoals += matchresult.pointsTeam2;
                            team1.goals         += matchresult.pointsTeam1;
                            team1.matches       += 1;
                            team1.lost          += 1;
                            team1.goalDiff      = team1.goals-team1.opponentGoals;
                        }

                        if (mymode==1 || mymode ==3 || (mymode ==4 && item.group.groupOrderID<=maxgameday/2) || (mymode ==5 && item.group.groupOrderID>maxgameday/2)) {
                            team2.points        += 3;
                            team2.opponentGoals += matchresult.pointsTeam1;
                            team2.goals         += matchresult.pointsTeam2;
                            team2.matches       += 1;
                            team2.won           += 1;
                            team2.goalDiff      = team2.goals-team2.opponentGoals;
                        }
                    }
                }
                result[team1name]=team1;
                result[team2name]=team2;
                
                return result;
            },[]);   
            this.addRanking(table,showgameday);
            return table;

        },    
            
    },
    table2: {
        createWidget: function (widgetID, view, data, style) {        
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].table2.createWidget(widgetID, view, data, style);
                }, 100);
            }
            var allmatches = data.allmatches_oid ? JSON.parse(vis.states.attr(data.allmatches_oid + '.val')) : {};
            var mode = data.mode || '1home';
            var mymode=mode[0];

            var table = allmatches.reduce(function(result,item){
                var team1name = item.team1.teamName;
                var shortname1 = item.team1.shortName;
                var teamiconurl1 = item.team1.teamIconUrl;
                var team2name = item.team2.teamName;
                var shortname2 = item.team2.shortName;
                var teamiconurl2 = item.team2.teamIconUrl;
                
                if (result.hasOwnProperty(team1name)) {
                    var team1 =result[team1name];
                } else {
                    var team1 = {
                        "teamName":         team1name,
                        "shortName":        shortname1,
                        "teamIconUrl":      teamiconurl1,
                        "points":           0,
                        "opponentGoals":    0,
                        "goals":            0,
                        "matches":          0,
                        "won":              0,
                        "lost":             0,
                        "draw":             0,
                        "goalDiff":         0
                        
                    }
                }
                if (result.hasOwnProperty(team2name)) {
                    var team2 =result[team2name];
                } else {
                    var team2 = {
                        "teamName":         team2name,
                        "shortName":        shortname2,
                        "teamIconUrl":      teamiconurl2,
                        "points":           0,
                        "opponentGoals":    0,
                        "goals":            0,
                        "matches":          0,
                        "won":              0,
                        "lost":             0,
                        "draw":             0,
                        "goalDiff":         0

                    }
                }
                var matchresult = vis.binds["openligadb"].getResult(item.matchResults);
                if (matchresult.hasOwnProperty('pointsTeam1')) {

                    if (matchresult.pointsTeam1>matchresult.pointsTeam2) {
                        if (mymode==1 || mymode ==2) {
                            team1.points        += 3;
                            team1.opponentGoals += matchresult.pointsTeam2;
                            team1.goals         += matchresult.pointsTeam1;
                            team1.matches       += 1;
                            team1.won           += 1;
                            team1.goalDiff      = team1.goals-team1.opponentGoals;
                        }

                        if (mymode==1 || mymode ==3) {
                            team2.points        += 0;
                            team2.opponentGoals += matchresult.pointsTeam1;
                            team2.goals         += matchresult.pointsTeam2;
                            team2.matches       += 1;
                            team2.lost          += 1;
                            team2.goalDiff      = team2.goals-team2.opponentGoals;
                        }                        
                    }
                    if (matchresult.pointsTeam1==matchresult.pointsTeam2) {
                        if (mymode==1 || mymode ==2) {
                            team1.points        += 1;
                            team1.opponentGoals += matchresult.pointsTeam2;
                            team1.goals         += matchresult.pointsTeam1;
                            team1.matches       += 1;
                            team1.draw          += 1;
                            team1.goalDiff      = team1.goals-team1.opponentGoals;
                        }

                        if (mymode==1 || mymode ==3) {
                            team2.points        += 1;
                            team2.opponentGoals += matchresult.pointsTeam1;
                            team2.goals         += matchresult.pointsTeam2;
                            team2.matches       += 1;
                            team2.draw          += 1;
                            team2.goalDiff      = team2.goals-team2.opponentGoals;
                        }
                    }
                    if (matchresult.pointsTeam1<matchresult.pointsTeam2) {
                        if (mymode==1 || mymode ==2) {
                            team1.points        += 0;
                            team1.opponentGoals += matchresult.pointsTeam2;
                            team1.goals         += matchresult.pointsTeam1;
                            team1.matches       += 1;
                            team1.lost          += 1;
                            team1.goalDiff      = team1.goals-team1.opponentGoals;
                        }

                        if (mymode==1 || mymode ==3) {
                            team2.points        += 3;
                            team2.opponentGoals += matchresult.pointsTeam1;
                            team2.goals         += matchresult.pointsTeam2;
                            team2.matches       += 1;
                            team2.won           += 1;
                            team2.goalDiff      = team2.goals-team2.opponentGoals;
                        }
                    }
                }
                result[team1name]=team1;
                result[team2name]=team2;
                
                return result;
            },[]);            
            var newtable = new Array();
            for (var items in table){
                newtable.push( table[items] );
            }
            table = newtable.sort(function(a,b) {
                return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : (a.goalDiff<b.goalDiff) ? 1: (a.goalDiff>b.goalDiff)? -1:0);
            }); 

            var maxicon = data.maxicon || 25;
            var shortname = data.shortname || false;
            var highlight = data.highlight || '';
            
            var text ='';

            text += '<style> \n';
            text += '#'+widgetID + ' .oldb-icon {\n';
            text += '   max-height: ' + maxicon + 'px; \n';
            text += '   max-width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt {\n';
            text += '   width: 100%;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt td{\n';
            text += '   white-space: nowrap;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-full {\n';
            text += '   width: 100%;\n';
            text += '} \n';                        
            text += '#'+widgetID + ' .oldb-center {\n';
            text += '   text-align: center;\n';
            text += '} \n';
            text += '</style> \n';
            
            text += '<table class="oldb-tt">';
            text += '    <thead>';
            text += '    <tr >';            
            text += '        <th class="oldb-center oldb-rank">';
            text += '            #';
            text += '        </th>';
            text += '        <th colspan="2" class="oldb-clubheader" style="text-align: left;">';
            text += '            Club';
            text += '        </th>';
            text += '';
            text += '        <th class="oldb-center oldb-games">';
            text += '            Sp';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-won">';
            text += '            S';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-draw">';
            text += '            U';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-lost">';
            text += '            N';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-goals">';
            text += '            Tore';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-goaldiff">';
            text += '            Diff';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-points">';
            text += '            Punkte';
            text += '        </th>';
            text += '    </tr>';
            text += '    </thead>';

            text += '    <tbody class="oldb-tb">';
            
            table.forEach(function(team, index) {

                var teamname = shortname ? team.shortName : team.teamName;
                if (vis.binds["openligadb"].checkHighlite(teamname,highlight)) teamname = '<b class="favorite">' + teamname + '</b>';
                
                text += '        <tr>';
                text += '            <td class="oldb-center oldb-rank">';
                text += index +1;
                text += '            </td>';
                text += '            <td class="oldb-center">';
                text += '                <img class="oldb-icon" src="'+team.teamIconUrl+'">';
                text += '            </td>';
                text += '            <td class="oldb-teamname oldb-full">';
                text += '                <span>'+teamname+'</span>';
                text += '            </td>';
                text += '            <td class="oldb-center oldb-games">';
                text += team.matches;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-won">';
                text += team.won;
                text += '           </td>';
                text += '            <td class="oldb-center oldb-draw">';
                text += team.draw;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-lost">';
                text += team.lost;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-goals">';
                text += team.goals + ':' + team.opponentGoals;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-goaldiff">';
                text += team.goalDiff;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-points">';
                text += '                <strong>'+team.points+'</strong>';
                text += '            </td>';
                text += '        </tr>';
            });
            text += '    </tbody>';
            text += '</table>            ';
            
            $('#' + widgetID).html(text);
        }            
            
            
            
    },
    table: {
        createWidget: function (widgetID, view, data, style) {

            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].table.createWidget(widgetID, view, data, style);
                }, 100);
            }
            var table = data.oid ? JSON.parse(vis.states.attr(data.oid + '.val')) : {};
            var maxicon = data.maxicon || 25;
            var shortname = data.shortname || false;
            var highlight = data.highlight || '';
            
            var text ='';

            text += '<style> \n';
            text += '#'+widgetID + ' .oldb-icon {\n';
            text += '   max-height: ' + maxicon + 'px; \n';
            text += '   max-width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt {\n';
            text += '   width: 100%;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt td{\n';
            text += '   white-space: nowrap;\n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-full {\n';
            text += '   width: 100%;\n';
            text += '} \n';                        
            text += '#'+widgetID + ' .oldb-center {\n';
            text += '   text-align: center;\n';
            text += '} \n';
            text += '</style> \n';
            
            text += '<table class="oldb-tt">';
            text += '    <thead>';
            text += '    <tr >';            
            text += '        <th class="oldb-center oldb-rank">';
            text += '            #';
            text += '        </th>';
            text += '        <th colspan="2" class="oldb-clubheader" style="text-align: left;">';
            text += '            Club';
            text += '        </th>';
            text += '';
            text += '        <th class="oldb-center oldb-games">';
            text += '            Sp';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-won">';
            text += '            S';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-draw">';
            text += '            U';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-lost">';
            text += '            N';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-goals">';
            text += '            Tore';
            text += '        </th>';
            text += '        <th class="oldb-center oldb-points">';
            text += '            Punkte';
            text += '        </th>';
            text += '    </tr>';
            text += '    </thead>';

            text += '    <tbody class="oldb-tb">';
            
            table.forEach(function(team, index) {

                var teamname = shortname ? team.shortName : team.teamName;
                if (vis.binds["openligadb"].checkHighlite(teamname,highlight)) teamname = '<b class="favorite">' + teamname + '</b>';
                
                text += '        <tr>';
                text += '            <td class="oldb-center oldb-rank">';
                text += index +1;
                text += '            </td>';
                text += '            <td class="oldb-center">';
                text += '                <img class="oldb-icon" src="'+team.teamIconUrl+'">';
                text += '            </td>';
                text += '            <td class="oldb-teamname oldb-full">';
                text += '                <span>'+teamname+'</span>';
                text += '            </td>';
                text += '            <td class="oldb-center oldb-games">';
                text += team.matches;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-won">';
                text += team.won;
                text += '           </td>';
                text += '            <td class="oldb-center oldb-draw">';
                text += team.draw;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-lost">';
                text += team.lost;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-goals">';
                text += team.goals + ':' + team.opponentGoals;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-points">';
                text += '                <strong>'+team.points+'</strong>';
                text += '            </td>';
                text += '        </tr>';
                
            });
            text += '<tr><td colspan="9">This widget is deprecated. Please use table3</td></tr>';
            text += '    </tbody>';
            text += '</table>            ';
            
            $('#' + widgetID).html(text);
        }
    },
    bindStates: function(elem,bound,change_callback) {
        var $div = $(elem);
        var boundstates = $div.data('bound');
        if (boundstates) {
            for (var i = 0; i < boundstates.bound.length; i++) {
                vis.states.unbind(boundstates.bound[i], boundstates.change_callback);
            }
        }
        $div.data('bound', null);
        $div.data('bindHandler', null);

        vis.conn.gettingStates = 0;
        vis.conn.getStates(bound, function (error, states) {
            vis.updateStates(states);
            vis.conn.subscribe(bound);

            for (var i=0;i<bound.length;i++) {
                bound[i]=bound[i]+'.val';
                vis.states.bind(bound[i] , change_callback);
            }
            $div.data('bound', {bound,change_callback});
            $div.data('bindHandler', change_callback);
        }.bind({change_callback}));
    },
    checkHighlite: function(value,highlights,sep) {
        sep = typeof sep !== 'undefined' ? sep : ";";
        var highlight = highlights.split(sep);
        return highlight.reduce(function(acc,cur){
            if (cur=='') return acc;
            return acc || value.toLowerCase().indexOf(cur.toLowerCase())>=0; 
        },false);
    },
    getDateFromJSON: function(datestring) {
        var aDate = datestring.split("T")[0].split("-");
        var aTime = datestring.split("T")[1].split(":");
        return new Date(aDate[0],aDate[1]-1,aDate[2],aTime[0],aTime[1]);
    },
    getResult: function(results) {
        if (results.length==0) return {};
        results = results.reduce(function(acc,cur){
            //if (cur.ResultTypeID==2) acc = cur;
            if (cur.resultTypeID>(acc.resultTypeID||0)) acc = cur;
            return acc;
        },{});
        return results;
    },
    compareDate: function(adate,bdate) {
        return adate.getDate() == bdate.getDate() && 
               adate.getMonth() == bdate.getMonth() && 
               adate.getYear() == bdate.getYear();
    },
    checkTodayFavorite: function(oid,highlite) {
        if (oid) {
            var json = vis.states.attr( oid + '.val');
            if ((json) && json!='null') {
                if (!vis.subscribing.IDs.includes(oid)) {
                    vis.subscribing.IDs.push(oid);
                    var a = [];
                    a.push(oid);
                    vis.conn.gettingStates=0;
                    vis.conn.getStates(a, function (error, data) {
                        vis.updateStates(data);
                        var a = [];
                        a.push(oid);                    
                        vis.conn.subscribe(a);
                    });                                                 
                }
                var matches = JSON.parse(json);
                if (matches) {
                    var today = new Date();
                    return matches.reduce(function(result,item){
                        var mdate = vis.binds["openligadb"].getDateFromJSON(item.matchDateTime);
                        var test =  vis.binds["openligadb"].compareDate(today,mdate) &&
                            (vis.binds["openligadb"].checkHighlite(item.team1.teamName,highlite,",") ||
                            vis.binds["openligadb"].checkHighlite(item.team2.teamName,highlite,","));
                        if (test) {
                        } 
                        return result || test;
                    },false);
                }
            } else {
                if(!vis.subscribing.IDs.includes(oid)) vis.subscribing.IDs.push(oid);
                var a = [];
                a.push(oid);
                vis.conn.gettingStates=0;
                vis.conn.getStates(a, function (error, data) {
                    vis.updateStates(data);
                    var a = [];
                    a.push(oid);                    
                    vis.conn.subscribe(a);
                });                             
            }
        }
        return false;
    },  
}
vis.binds["openligadb"].showVersion();

