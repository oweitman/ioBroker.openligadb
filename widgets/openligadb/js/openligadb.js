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
        });
}


vis.binds["openligadb"] = {
    version: "0.0.2",
    showVersion: function () {
        if (vis.binds["openligadb"].version) {
            console.log('Version openligadb: ' + vis.binds["openligadb"].version);
            vis.binds["openligadb"].version = null;
        }
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
            var showgamedaycount = data.showgamedaycount || 9999;
            if (showgamedaycount==0) showgamedaycount = 9999;

            var maxicon = data.maxicon || 25;
            var shortname = data.shortname || false;
            var highlight = data.highlight || '';
            
            var favgames = this.filterFavGames(allmatches,showgameday || currgameday || '', showgamedaycount, currgameday, highlight);  

            
            const date_options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const time_options = { hour: '2-digit', minute: '2-digit' };            
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
                var team1name = shortname ? match.Team1.ShortName : match.Team1.TeamName;
                var team2name = shortname ? match.Team2.ShortName : match.Team2.TeamName;
                
                text += '        <tr>';
                text += '           <td class="oldb-left">'+ new Date(match.MatchDateTime).toLocaleString(vis.language,date_options)  +'</td>';
                text += '           <td class="oldb-left">'+ new Date(match.MatchDateTime).toLocaleString(vis.language,time_options)  +'</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="'+match.Team1.TeamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-full">'+ team1name +'</td>';
                text += '           <td class="oldb-left">:</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-left oldb-icon" src="'+match.Team2.TeamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-full">'+ team2name +'</td>';                
                text += '        </tr>';
            });
            text += '</table>            ';            
            $('#' + widgetID).html(text);            

            
        },
        filterFavGames: function(allmatches,gameday,gamedaycount,currgameday,highlight) {
            gameday = parseInt(gameday);
            gamedaycount = parseInt(gamedaycount);
            currgameday = parseInt(currgameday);
            
            return allmatches.reduce(function(result,item){
                var found;
                if (gameday > 0 && item.Group.GroupOrderID >= gameday && item.Group.GroupOrderID < gameday + gamedaycount ) found=item;
                if (gameday < 0 && item.Group.GroupOrderID >= currgameday + gameday && item.Group.GroupOrderID < currgameday + gameday + gamedaycount) found=item;
                if (found && (vis.binds["openligadb"].checkHighlite(item.Team1.TeamName,highlight) || vis.binds["openligadb"].checkHighlite(item.Team2.TeamName,highlight)) ) result.push(item);
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
            
            var allmatches  = data.allmatches_oid ? JSON.parse(vis.states.attr(data.allmatches_oid + '.val')) : {};
            var currgameday = data.currgameday_oid ? JSON.parse(vis.states.attr(data.currgameday_oid + '.val')) : {};
            var showgameday = data.showgameday || '';
            if (vis.editMode && /{.*}/gm.test(showgameday))  showgameday = '';
            if (showgameday==0) showgameday='';
            var showgamedaycount = data.showgamedaycount || 1;
            if (showgamedaycount==0) showgamedaycount = 1;

            var maxicon = data.maxicon || 25;
            var shortname = data.shortname || false;
            var highlight = data.highlight || '';
            
            
            var gameday = this.filterGameDay(allmatches,showgameday || currgameday || '', showgamedaycount, currgameday);            
            
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

            var curDate,oldDate ='' ;
            const date_options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const time_options = { hour: '2-digit', minute: '2-digit' };
            gameday.forEach(function(match, index) {
                curDate = new Date(match.MatchDateTime);
                if (curDate.toString() != oldDate.toString()) {
                    oldDate=curDate;
                    text += '        <tr>';
                    text += '           <td class="oldb-right oldb-datetime" colspan="3">'+ new Date(curDate).toLocaleString(vis.language,date_options) +'</td>';
                    text += '           <td class=""></td>';
                    text += '           <td class="oldb-left oldb-datetime" colspan="3">'+ new Date(curDate).toLocaleString(vis.language,time_options) +'</td>';
                    text += '        </tr>';
                }
                
                var team1name = shortname ? match.Team1.ShortName : match.Team1.TeamName;
                var team2name = shortname ? match.Team2.ShortName : match.Team2.TeamName;
                if (vis.binds["openligadb"].checkHighlite(team1name,highlight)) team1name = '<b class="favorite">' + team1name + '</b>';
                if (vis.binds["openligadb"].checkHighlite(team2name,highlight)) team2name = '<b class="favorite">' + team2name + '</b>';
                var team1result = match.MatchResults[0] ? match.MatchResults[0].PointsTeam1 : '-';
                var team2result = match.MatchResults[0] ? match.MatchResults[0].PointsTeam2 : '-';
                
                text += '        <tr>';
                text += '           <td class="oldb-right oldb-full">'+ team1name +'</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="'+match.Team1.TeamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-center">'+team1result+'</td>';
                text += '           <td class="oldb-center">:</td>';
                text += '           <td class="oldb-center">'+team2result+'</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-center oldb-icon" src="'+match.Team2.TeamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-left oldb-full">'+ team2name +'</td>';                
                text += '        </tr>';

            }.bind(this));
            
            
            
            
            text += '</table>            ';

            
            
            $('#' + widgetID).html(text);
        },
        filterGameDay: function(allmatches,gameday,gamedaycount,currgameday) {
            gameday = parseInt(gameday);
            gamedaycount = parseInt(gamedaycount);
            currgameday = parseInt(currgameday);
            
            return allmatches.reduce(function(result,item){
                if (item.Group.GroupOrderID == gameday) result.push(item);
                if (gameday < 0 && item.Group.GroupOrderID >= currgameday + gameday && item.Group.GroupOrderID < currgameday + gameday + gamedaycount) result.push(item);
                return result;
            },[]);            
        },
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

                var teamname = shortname ? team.ShortName : team.TeamName;
                if (vis.binds["openligadb"].checkHighlite(teamname,highlight)) teamname = '<b class="favorite">' + teamname + '</b>';
                
                text += '        <tr>';
                text += '            <td class="oldb-center oldb-rank">';
                text += index +1;
                text += '            </td>';
                text += '            <td class="oldb-center">';
                text += '                <img class="oldb-icon" src="'+team.TeamIconUrl+'">';
                text += '            </td>';
                text += '            <td class="oldb-teamname oldb-full">';
                text += '                <span>'+teamname+'</span>';
                text += '            </td>';
                text += '            <td class="oldb-center oldb-games">';
                text += team.Matches;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-won">';
                text += team.Won;
                text += '           </td>';
                text += '            <td class="oldb-center oldb-draw">';
                text += team.Draw;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-lost">';
                text += team.Lost;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-goals">';
                text += team.Goals + ':' + team.OpponentGoals;
                text += '            </td>';
                text += '            <td class="oldb-center oldb-points">';
                text += '                <strong>'+team.Points+'</strong>';
                text += '            </td>';
                text += '        </tr>';
            });
            text += '    </tbody>';
            text += '</table>            ';
            
            $('#' + widgetID).html(text);
        }
    },
    checkHighlite: function(value,highlights) {
        var highlight = highlights.split(';');
        return highlight.reduce(function(acc,cur){
            if (cur=='') return acc;
            return acc || value.toLowerCase().indexOf(cur.toLowerCase())>=0; 
        },false);
    },
}
vis.binds["openligadb"].showVersion();
      