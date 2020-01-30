/*
    ioBroker.vis openligadb Widget-Set

    Copyright 2020 oweitman oweitman@gmx.de
    
    
 
    
*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "oid1": {"en": "allmatches", "de": "allmatches", "ru": "allmatches"},
        "oid2": {"en": "currgameday", "de": "currgameday", "ru": "currgameday"},        
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
    gameday: {
        createWidget: function (widgetID, view, data, style) {
            
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].gameday.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            var allmatches  = data.oid1 ? JSON.parse(vis.states.attr(data.oid1 + '.val')) : {};
            var currgameday = data.oid2 ? JSON.parse(vis.states.attr(data.oid2 + '.val')) : {};
            var showgameday = data.showgameday || '';

            var maxicon = data.maxicon || 25;
            var shortname = data.shortname || false;
            
            var gameday = this.filterGameDay(allmatches,showgameday || currgameday || '');            
            
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
                var team1result = match.MatchResults[0] ? match.MatchResults[0].PointsTeam1 : '-';
                var team2result = match.MatchResults[0] ? match.MatchResults[0].PointsTeam2 : '-';
                
                text += '        <tr>';
                text += '           <td class="oldb-right">'+ team1name +'</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="'+match.Team1.TeamIconUrl+'">';
                text += '           </td>';
                text += '           <td class="oldb-center">'+team1result+'</td>';
                text += '           <td class="oldb-center">:</td>';
                text += '           <td class="oldb-center">'+team2result+'</td>';
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-center oldb-icon" src="'+match.Team2.TeamIconUrl+'">';
                text += '           </td>';
                text += '           <td>'+ team2name +'</td>';                
                text += '        </tr>';

            });
            
            
            
            
            text += '</table>            ';

            
            
            $('#' + widgetID).html(text);
        },
        filterGameDay: function(allmatches,gameday) {
            return allmatches.reduce(function(result,item){
                if (item.Group.GroupOrderID == gameday) result.push(item);
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
            
            var text ='';

            text += '<style> \n';
            text += '#'+widgetID + ' .oldb-icon {\n';
            text += '   max-height: ' + maxicon + 'px; \n';
            text += '   max-width: ' + maxicon + 'px; \n';
            text += '} \n';
            text += '#'+widgetID + ' .oldb-tt {\n';
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
                
                text += '        <tr>';
                text += '            <td class="oldb-center oldb-rank">';
                text += index +1;
                text += '            </td>';
                text += '            <td class="oldb-center">';
                text += '                <img class="oldb-icon" src="'+team.TeamIconUrl+'">';
                text += '            </td>';
                text += '            <td class="oldb-teamname">';
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
    favorites : {

        createWidget: function (widgetID, view, data, style) {
            
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].favorites.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            data.functionname = 'favorites';

            var redrawinspectwidgets = false;

            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;
       
            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};
            
            var key = ainstance[0] + "."+ ainstance[1] + "." + "Favorites.*";
            vis.conn.gettingStates =0;
            vis.conn.getStates(key,function (err, obj) {

                var favorites = this.getFavorites(obj,ainstance);
                favorites = data.viewindexcheck = this.filterFavorites(favorites);

                var editmodehelper = data.editmodehelper;
                var bCount      = data.bCount;
                var picWidth    = data.picWidth;
                var picHeight   = data.picHeight;
                var opacity     = (vis.editMode && editmodehelper) ? 1 : data.opacity;
                var borderwidth = data.borderwidth;
                var borderstyle = data.borderstyle;
                var bordercolornormal = data.bordercolornormal;
                var bordercoloractive = data.bordercoloractive;
                var borderradius = data.borderradius;
                var buttonbkcolor = data.buttonbkcolor;   
                var buttonmargin        = data.buttonmargin || '0px';
               
                if (!data.viewindex || data.viewindex.trim() == "") {
                    data.viewindex = this.getViewindex(favorites).join(", ");
                }

               if (vis.editMode && data.bCount != Math.min(favorites.length,data.viewindex.split(',').length)) {
                    data.bCount = Math.min(favorites.length,data.viewindex.split(',').length);
                    redrawinspectwidgets = true;                
                }
                
                var text = '';        
                
                text += '<style>\n';
                text += '#'+widgetID + ' div {\n';
                text += '     display: inline-block; \n';
                text += '}\n';
                text += '#'+widgetID + ' div div {\n';
                text += '     position: relative; \n';
                text += '     margin: 0px '+buttonmargin+' '+buttonmargin+' 0px; \n';
                text += '}\n';
                text += '#'+widgetID + ' input[type="radio"] {\n';
                text += '    display: none;\n';
                text += '}\n';
                text += '#'+widgetID + ' img {\n';
                text += '    opacity: '+opacity+';\n';
                text += '    width: '+picWidth+'px;\n';
                text += '    height: '+picHeight+'px;\n';
                text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolornormal+';\n';
                text += '    border-radius: '+borderradius+';\n';
                text += '}\n';
                text += '#'+widgetID + ' canvas {\n';
                text += '    opacity: '+opacity+';\n';
                text += '    width: '+picWidth+'px;\n';
                text += '    height: '+picHeight+'px;\n';
                text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolornormal+';\n';
                text += '    border-radius: '+borderradius+';\n';
                text += '}\n';
                text += '#'+widgetID + ' img:active {\n';
                text += '    transform: scale(0.9, 0.9);\n';
                text += '    opacity: 1;\n';
                text += '    border: '+borderwidth+' '+borderstyle+' '+bordercoloractive+';\n';
                text += '    border-radius: '+borderradius+';\n';
                text += '}\n';
                text += '#'+widgetID + ' canvas:active {\n';
                text += '    transform: scale(0.9, 0.9);\n';
                text += '    opacity: 1;\n';
                text += '    border: '+borderwidth+' '+borderstyle+' '+bordercoloractive+';\n';
                text += '    border-radius: '+borderradius+';\n';
                text += '}\n';
                text += '#'+widgetID + ' input[type="radio"]:checked + label img {\n';
                text += '    opacity: 1;\n';
                text += '    border: '+borderwidth+' '+borderstyle+' '+bordercoloractive+';\n';
                text += '    border-radius: '+borderradius+';\n';
                text += '}\n';
                text += '#'+widgetID + ' input[type="radio"]:checked + label canvas {\n';
                text += '    opacity: 1;\n';
                text += '    border: '+borderwidth+' '+borderstyle+' '+bordercoloractive+';\n';
                text += '    border-radius: '+borderradius+';\n';
                text += '}\n';
                text += '</style>\n';
                
                text += '<div id="'+widgetID+'container">';
                var viewindex = data.viewindex.split(', ');
                for (var i = 0; i < viewindex.length;i++) {
                    var favorite = this.findById(favorites,viewindex[i]);
                    text += '  <div>';
                    text += '    <input type="radio" id="'+ widgetID + favorite.id +'" name="'+widgetID+'" value="' + favorite.id + '" >';
                    text += '    <label for="'+ widgetID + favorite.id + '">';
                    text += '      <span>';
                    var favimage = favorite.image || "";
                    var favtext = favorite.id || "";
                    var attrimage = data['buttonsImage'+(i+1)] || "";
                    var attrtext = data['buttonsText'+(i+1)] || "";

                    var favimage = favimage.trim();
                    var favtext = favtext.trim();
                    var attrimage = attrimage.trim();
                    var attrtext = attrtext.trim();
                    
                    var buttonsImage = attrimage || favimage;

                    if (!(attrtext) && (buttonsImage)) {
                        text += '        <img src="'+ buttonsImage +'">';
                    }
                    text += '      </span>';
                    text += '    </label>';
                    if (vis.editMode && editmodehelper) {
                        text += '<div style="position: absolute;top: 0;right: 0;background-color: black;color: white;border-width: 1px;border-color: white;border-style: solid;font-size: xx-small;padding: 1px;">'+ viewindex[i] + '</div>';
                    }
                    text += '  </div>';
                }
                text += '</div>';
                
                $('#' + widgetID).html(text);

                var spans = $('#' + widgetID + ' span');
                var font = new Font($('#' + widgetID));
                var opt = {};

                opt.style = window.getComputedStyle($('#' + widgetID)[0],null);
                opt.backgroundcolor = data.buttonbkcolor;
                var i=0;
                for (var i = 0; i< viewindex.length;i++) {
                    var favorite = this.findById(favorites,viewindex[i]);
                    
                    var favimage = favorite.image || "";
                    var favtext = favorite.id+"("+i+")" || "";
                    var attrimage = data['buttonsImage'+(i+1)] || "";
                    var attrtext = data['buttonsText'+(i+1)] || "";

                    var favimage = favimage.trim();
                    var favtext = favtext.trim();
                    var attrimage = attrimage.trim();
                    var attrtext = attrtext.trim();
                    
                    var buttonsImage = attrimage || favimage;
                    
                    var buttonsText = attrtext || favtext;
                    if ((attrtext) || !(buttonsImage)) {
                        $(spans[i]).append(createTextImage( buttonsText, font, picWidth, picHeight,opt));
                    }
                }
                var favbtns = $("input[name="+widgetID+"]");
                favbtns.off('change.favorite').on('change.favorite',fdata, function(event){
                    var fdata = event.data
                    var data = fdata.data;
                    var favorite=this.value;
                    var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
                    var state = ainstance[0]+'.'+ainstance[1]+".Players"+"."+playername+".cmdPlayFavorite";
                    //vis.conn._socket.emit('setState', state, favorite);
                    vis.setValue(state, favorite);
                });
                if (vis.editMode && redrawinspectwidgets) vis.binds["squeezeboxrpc"].redrawInspectWidgets(view);                
            }.bind(this));
        },
        getFavorites: function(datapoints, ainstance) {
            const regex = new RegExp("^"+ainstance[0]+"\\."+ainstance[1]+"\\.Favorites","");
            return Object.keys(datapoints).reduce(function(acc,cur,index,arr){
                if (regex.test(cur)) {
                    var key = cur.split('.')[3];
                    var name = cur.split('.')[4];
                    if (!acc[key]) acc[key]={};
                    acc[key][name]=this[cur].val;
                }
                return acc;
            }.bind(datapoints),[]);            
        },
        filterFavorites: function(favorites) {
            favorites = Object.values(favorites);
            return favorites.filter(function(cur){
                return (cur.isaudio===1);
            });            
        },
        findById: function(favorites,id){
            return favorites.find(function(cur) {
                return (cur.id.trim() == this.trim()); 
            }.bind(id));
        },
        getViewindex: function(favorites) {
            return favorites.map(cur => cur.id);
        },
        checkViewindexExist: function(viewindex,favorites) {
            return viewindex.map(function (item) {
                return (favorites.find(el => el.id == item)) ? item:"0";
            });
        },
    },
    players: {
        createWidget: function (widgetID, view, data, style) {
            
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].players.createWidget(widgetID, view, data, style);
                }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            data.functionname = 'players';
            vis.conn._socket.emit('getObjects', function (err, obj) {
            //socket.emit('getObjects', function (err, obj) {
                var redrawinspectwidgets = false;
                if (data.ainstance) {
                    data.ainstance = data.ainstance.split(".").slice(0,2).join(".");
                } else {
                    data.ainstance = "";
                }
                
                var ainstance = data.ainstance.split(".");
                if (!ainstance || ainstance[0] != "squeezeboxrpc") {
                    $('#' + widgetID).html("Please select an instance");
                    return;
                }
                var players = data.viewindexcheck = this.getPlayers(obj,ainstance);
                
                var editmodehelper = data.editmodehelper;
                var bCount              = data.bCount;
                var picWidth            = data.picWidth;
                var picHeight           = data.picHeight;
                var opacity             = (vis.editMode && editmodehelper) ? 1 : data.opacity;
                var borderwidth         = data.borderwidth;
                var borderstyle         = data.borderstyle;
                var bordercolornormal   = data.bordercolornormal;
                var bordercoloractive   = data.bordercoloractive;
                var borderradius        = data.borderradius;
                var buttonbkcolor       = data.buttonbkcolor;
                var buttonmargin        = data.buttonmargin || '0px';

                if (!data.viewindex || data.viewindex.trim() == "") {
                    data.viewindex = this.getViewindex(players).join(", ");
                }
                
                if (vis.editMode && data.bCount != Math.min(players.length,data.viewindex.split(',').length)) {               
                    data.bCount = Math.min(players.length,data.viewindex.split(',').length);
                    redrawinspectwidgets = true;
                }
                
                var viewindex = data.viewindex.split(', ');  
                if (data.formattype == 'formatselect') {

                    var text='';
                    var option='';
                    option += '<option value=""></option>';
                    for (var i = 0; i < viewindex.length;i++) {
                        var buttonsText  = (data['buttonsText'+(viewindex[i]+1)]) || '';
                        buttonsText = (buttonsText.trim() !='') ? buttonsText : players[viewindex[i]];
                        if (vis.editMode && editmodehelper) buttonsText += ' [' + viewindex[i] + ']';

                        option += '<option value="' + players[viewindex[i]] + '">'+buttonsText+'</option>';
                    }
                    text += '<select type="text" id="'+ widgetID + 'select">'+option+'</select>';
                    $('#' + widgetID).html(text);
                
                }
                if (data.formattype == 'formatbutton') {
                    
                    var text = '';        
                    
                    text += '<style>\n';
                    text += '#'+widgetID + ' div {\n';
                    text += '     display: inline-block; \n';
                    text += '}\n';
                    text += '#'+widgetID + ' div div {\n';
                    text += '     position: relative; \n';
                    text += '     margin: 0px '+buttonmargin+' '+buttonmargin+' 0px; \n';
                    text += '}\n';
                    text += '#'+widgetID + ' input[type="radio"] {\n';
                    text += '    display: none;\n';
                    text += '}\n';
                    text += '#'+widgetID + ' img {\n';
                    text += '    opacity: '+opacity+';\n';
                    text += '    width: '+picWidth+'px;\n';
                    text += '    height: '+picHeight+'px;\n';
                    text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolornormal+';\n';
                    text += '    border-radius: '+borderradius+';\n';
                    text += '}\n';
                    text += '#'+widgetID + ' canvas {\n';
                    text += '    opacity: '+opacity+';\n';
                    text += '    width: '+picWidth+'px;\n';
                    text += '    height: '+picHeight+'px;\n';
                    text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolornormal+';\n';
                    text += '    border-radius: '+borderradius+';\n';
                    text += '}\n';
                    text += '#'+widgetID + ' img:active {\n';
                    text += '    transform: scale(0.9, 0.9);\n';
                    text += '    opacity: 1;\n';
                    text += '    border: '+borderwidth+' '+borderstyle+' '+bordercoloractive+';\n';
                    text += '    border-radius: '+borderradius+';\n';
                    text += '}\n';
                    text += '#'+widgetID + ' canvas:active {\n';
                    text += '    transform: scale(0.9, 0.9);\n';
                    text += '    opacity: 1;\n';
                    text += '    border: '+borderwidth+' '+borderstyle+' '+bordercoloractive+';\n';
                    text += '    border-radius: '+borderradius+';\n';
                    text += '}\n';
                    text += '#'+widgetID + ' input[type="radio"]:checked + label img {\n';
                    text += '    opacity: 1;\n';
                    text += '    border: '+borderwidth+' '+borderstyle+' '+bordercoloractive+';\n';
                    text += '    border-radius: '+borderradius+';\n';
                    text += '}\n';
                    text += '#'+widgetID + ' input[type="radio"]:checked + label canvas {\n';
                    text += '    opacity: 1;\n';
                    text += '    border: '+borderwidth+' '+borderstyle+' '+bordercoloractive+';\n';
                    text += '    border-radius: '+borderradius+';\n';
                    text += '}\n';
                    text += '</style>\n';
                    
                    text += '<div id="'+widgetID+'container" >';
                                      
                    for (var i = 0; i < viewindex.length;i++) {
                        text += '  <div >';
                        text += '    <input type="radio" id="'+ widgetID + players[viewindex[i]] +'" name="'+widgetID+'" value="' + players[viewindex[i]] + '" >';
                        text += '    <label for="'+ widgetID + players[viewindex[i]] + '">';
                        text += '      <span>';
                        var buttonsImage = (data['buttonsImage'+(viewindex[i]+1)]) || '';
                        if (buttonsImage.trim() !='') {
                            text += '        <img src="'+ data['buttonsImage'+(viewindex[i]+1)] +'">';
                        }
                        text += '      </span>';
                        text += '    </label>';
                        if (vis.editMode && editmodehelper) {
                            text += '<div style="position: absolute;top: 0;right: 0;background-color: black;color: white;border-width: 1px;border-color: white;border-style: solid;font-size: xx-small;padding: 1px;margin:0px;">'+ viewindex[i] + '</div>';
                        }
                        text += '  </div>';
                    }
                    text += '</div>';
                    
                    $('#' + widgetID).html(text);

                    var spans = $('#' + widgetID + ' span');
                    var font = new Font($('#' + widgetID));
                    var opt = {};
                    opt.wrapCamelCase=data.wrapcamelcase;
                    opt.style = window.getComputedStyle($('#' + widgetID)[0],null);
                    opt.backgroundcolor = data.buttonbkcolor;
                    var i=0;
                    for (var i = 0; i< viewindex.length;i++) {
                        var buttonsImage = (data['buttonsImage'+(viewindex[i]+1)]) || '';
                        var buttonsText  = (data['buttonsText'+(viewindex[i]+1)]) || '';
                        buttonsText = (buttonsText.trim() !='') ? buttonsText : players[viewindex[i]];
                        if (buttonsImage.trim() =='') {
                            $(spans[i]).append(createTextImage( buttonsText, font, picWidth, picHeight,opt));
                        }
                    }
                }
                if (vis.editMode && redrawinspectwidgets) vis.binds["squeezeboxrpc"].redrawInspectWidgets(view);                
                $('#' + widgetID).trigger('playerschanged');
            }.bind(this));
        },
        getViewindex: function(players) {
            return Object.keys(players);
        },         
        checkViewindexExist: function(viewindex,players) {
            return viewindex.map(function (item) {
                return (item < players.length) ? item:0;
            });            
        },
        getPlayers: function(datapoints, ainstance) {
            const regex = new RegExp("^"+ainstance[0]+"\\."+ainstance[1]+"\\.Players","gm");
            return Object.keys(datapoints).reduce(function(acc,cur){
                if (regex.test(cur)) {
                    var key = cur.split('.')[3]; //getPlayers
                    if (acc.indexOf(key)===-1) acc.push(key);
                }
                return acc;
            },[]);    
        },
    },
    buttonplay : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonplay.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            
            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;
            
            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};
            
            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.state');
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));
          
            var text = '';
            text += '<style> \n';
            text += '#'+widgetID + ' div {\n';
            text += '   display: inline-block; \n';
            text += '   width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' input[type="submit"] { \n';
            text += '  display: none; \n';
            text += '} \n';
            text += '#'+widgetID + ' img { \n';
            text += '  width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' img:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '} \n';
            text += '#'+widgetID + ' svg { \n';
            text += '  width:  100%; \n';
            text += '} \n';
            text += '#'+widgetID + ' svg:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '  transform-origin: 50% 50%; \n';
            text += '} \n';            
            text += '</style> \n';
            
            text += '<div class="btn"> \n';
            text += '  <div> \n';
            text += '    <input type="submit" id="'+ widgetID + 'button" name="'+widgetID+'" value="" >';
            text += '    <span> \n';
            text += '      <img src=""> \n';
            text += '    </span> \n';
            text += '  </div> \n';
            text += '</div> \n';
            
            $('#' + widgetID).html(text);
            this.setState(fdata);
        },
        onClick: function(event) {
            var data = event.data.data;
            var self = event.data.self;
            var widgetID = event.data.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+".state";
            var state = $("input[name="+widgetID+"]").val();
            state = (state==1) ? 0 : 1;
            vis.setValue(stateid,state);
        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },
        setState: function(fdata) {
            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var svg = vis.binds["squeezeboxrpc"].svg;               
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+".state";       
            
            var state = (vis.states[stateid+ '.val'] || vis.states[stateid+ '.val'] === 0) ? parseInt(vis.states[stateid+ '.val']) : 2;
            var imagepause = data.imagepause || '';
            var imageplay = data.imageplay || '';
            var imagestop = data.imagepause || '';
            
            var svgfill = data.fillcolor || '#ffffff';
            var svgstroke = data.strokecolor || '#ffffff';
            var svgstrokeWidth = data.strokewidth || '0.3';
            
            var image = '';
            //0=pause
            //1=play
            //2=stop
            if (state==0) image = imageplay  || svg.play;
            if (state==1) image = imagepause || svg.pause;
            if (state==2) image = imageplay  || svg.play;
            $('#'+widgetID+ ' input').val(state);
            $('#' + widgetID + ' img').off('click.play',this.onClick);
            $('#' + widgetID + ' svg').off('click.play',this.onClick);
            if (image.startsWith('<svg')) {
                $('#' + widgetID+' span').html(image);
                var $g = $('#' + widgetID+' svg > g')
                if ($g.length) {
                    $g.attr('fill',svgfill);
                    $g.attr('stroke',svgstroke);
                    $g.attr('stroke-width',svgstrokeWidth);
                }                
            } else {
                $('#'+widgetID+ ' img').attr('src',image);                        
            }
            $('#' + widgetID + ' img').on('click.play',fdata,this.onClick);
            $('#' + widgetID + ' svg').on('click.play',fdata,this.onClick);

        },        
    },
    buttonfwd : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);            
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonfwd.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;
            
            var svgfill = data.fillcolor || '#ffffff';
            var svgstroke = data.strokecolor || '#ffffff';
            var svgstrokeWidth = data.strokewidth || '0.3';
            
            var svg = vis.binds["squeezeboxrpc"].svg;            
            
            var text = '';
            text += '<style> \n';
            text += '#'+widgetID + ' div {\n';
            text += '   display: inline-block; \n';
            text += '   width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' input[type="submit"] { \n';
            text += '  display: none; \n';
            text += '} \n';
            text += '#'+widgetID + ' img { \n';
            text += '  width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' img:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '} \n';
            text += '#'+widgetID + ' svg { \n';
            text += '  width:  100%; \n';
            text += '} \n';
            text += '#'+widgetID + ' svg:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '  transform-origin: 50% 50%; \n';
            text += '} \n';            
            text += '</style> \n';
            text += '<div class="btn"> \n';
            text += '  <div> \n';
            text += '    <input type="submit" id="'+ widgetID + 'button" name="'+widgetID+'" value="fwd" >';
            text += '    <span> \n';
            text += '      <img src="widgets/squeezeboxrpc/img/fwd.png"> \n';
            text += '    </span> \n';
            text += '  </div> \n';
            text += '</div> \n';
            
            $('#' + widgetID).html(text);
            
            var image = data.imagefwd || svg.fwd;
            
            if (image.startsWith('<svg')) {
                $('#' + widgetID+' span').html(image);
                var $g = $('#' + widgetID+' svg > g')
                if ($g.length) {
                    $g.attr('fill',svgfill);
                    $g.attr('stroke',svgstroke);
                    $g.attr('stroke-width',svgstrokeWidth);
                }                
            } else {
                $('#'+widgetID+ ' img').attr('src',image);                        
            }

            //one onclick on span?
            $('#' + widgetID + ' img').on('click',{self:this,widgetID:widgetID, view:view, data:data, style:style},this.onClick);
            $('#' + widgetID + ' svg').on('click',{self:this,widgetID:widgetID, view:view, data:data, style:style},this.onClick);
        },
        onClick: function(event) {
                var data = event.data.data;
                var self = event.data.self;
                var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
                var stateid = data.ainstance.join('.')+".Players"+"."+playername+".btnRewind";
                var state = true
                vis.setValue(stateid,state);
        },        
    },
    buttonrew : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);            
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonrew.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;

            var svgfill = data.fillcolor || '#ffffff';
            var svgstroke = data.strokecolor || '#ffffff';
            var svgstrokeWidth = data.strokewidth || '0.3';

            var svg = vis.binds["squeezeboxrpc"].svg;
            
            var text = '';
            text += '<style> \n';
            text += '#'+widgetID + ' div {\n';
            text += '   display: inline-block; \n';
            text += '   width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' input[type="submit"] { \n';
            text += '  display: none; \n';
            text += '} \n';
            text += '#'+widgetID + ' img { \n';
            text += '  width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' img:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '} \n';
            text += '#'+widgetID + ' svg { \n';
            text += '  width:  100%; \n';
            text += '} \n';
            text += '#'+widgetID + ' svg:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '  transform-origin: 50% 50%; \n';
            text += '} \n';            
            text += '</style> \n';            
            text += '<div class="btn"> \n';
            text += '  <div> \n';
            text += '    <input type="submit" id="'+ widgetID + 'button" name="'+widgetID+'" value="rew" >';
            text += '    <span> \n';
            text += '      <img src="widgets/squeezeboxrpc/img/rew.svg"> \n';
            text += '    </span> \n';
            text += '  </div> \n';
            text += '</div> \n';
            
            $('#' + widgetID).html(text);
            
            var image = data.imagerew || svg.rew;
            
            if (image.startsWith('<svg')) {
                $('#' + widgetID+' span').html(image);
                var $g = $('#' + widgetID+' svg > g')
                if ($g.length) {
                    $g.attr('fill',svgfill);
                    $g.attr('stroke',svgstroke);
                    $g.attr('stroke-width',svgstrokeWidth);
                }                
            } else {
                $('#'+widgetID+ ' img').attr('src',image);                        
            }
            
            //one onclick on span?
            $('#' + widgetID + ' img').on('click',{self:this,widgetID:widgetID, view:view, data:data, style:style},this.onClick);
            $('#' + widgetID + ' svg').on('click',{self:this,widgetID:widgetID, view:view, data:data, style:style},this.onClick);
        },
        onClick: function(event) {
                var data = event.data.data;
                var self = event.data.self;
                var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
                var stateid = data.ainstance.join('.')+".Players"+"."+playername+".btnRewind";
                var state = true
                vis.setValue(stateid,state);
        },
    },
    buttonrepeat : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonrepeat.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            
            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;

            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.PlaylistRepeat');
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));

            var text = ''; 
            text += '<style> \n';
            text += '#'+widgetID + ' div {\n';
            text += '   display: inline-block; \n';
            text += '   width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' input[type="submit"] { \n';
            text += '  display: none; \n';
            text += '} \n';
            text += '#'+widgetID + ' img { \n';
            text += '  width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' img:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '} \n';
            text += '#'+widgetID + ' svg { \n';
            text += '  width:  100%; \n';
            text += '} \n';
            text += '#'+widgetID + ' svg:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '  transform-origin: 50% 50%; \n';
            text += '} \n';            
            text += '</style> \n';
            
            text += '<div class="btn"> \n';
            text += '  <div> \n';
            text += '    <input type="submit" id="'+ widgetID + 'button" name="'+widgetID+'" value="" >';
            text += '    <span> \n';
            text += '      <img src=""> \n';
            text += '    </span> \n';
            text += '  </div> \n';
            text += '</div> \n';
            
            $('#' + widgetID).html(text);
            this.setState({self:this,widgetID:widgetID, view:view, data:data, style:style});
        },
        onClick: function(event) {
            var data = event.data.data;
            var self = event.data.self;
            var widgetID = event.data.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+".PlaylistRepeat";
            var state = $("input[name="+widgetID+"]").val();
            state = (state > 1) ? 0: parseInt(state) + 1;
            vis.setValue(stateid,state);
        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },
        setState: function(fdata) {
            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var svg = vis.binds["squeezeboxrpc"].svg;               
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+".PlaylistRepeat";       
            
            var state = (vis.states[stateid+ '.val'] || vis.states[stateid+ '.val'] === 0) ? parseInt(vis.states[stateid+ '.val']) : 0;
            var imagerepeat0 = data.imagerepeat0 || '';
            var imagerepeat1 = data.imagerepeat1 || '';
            var imagerepeat2 = data.imagerepeat2 || '';
            
            var svgfill = data.fillcolor || '#ffffff';
            var svgstroke = data.strokecolor || '#ffffff';
            var svgstrokeWidth = data.strokewidth || '0.3';
            
            var image = '';
            //0=pause
            //1=play
            //2=stop
            if (state==0) image = imagerepeat0  || svg.repeat0;
            if (state==1) image = imagerepeat1  || svg.repeat1;
            if (state==2) image = imagerepeat2  || svg.repeat0;
            $('#'+widgetID+ ' input').val(state);
            $('#' + widgetID + ' img').off('click.repeat',this.onClick);
            $('#' + widgetID + ' svg').off('click.repeat',this.onClick);
            if (image.startsWith('<svg')) {
                $('#' + widgetID+' span').html(image);
                var $g = $('#' + widgetID+' svg > g')
                if ($g.length) {
                    $g.attr('fill',svgfill);
                    $g.attr('stroke',svgstroke);
                    $g.attr('stroke-width',svgstrokeWidth);
                    if (state===0) {
                        $g.attr('opacity',".5");
                    } else {
                        $g.attr('opacity',"1");                        
                    }
                }                
            } else {
                $('#'+widgetID+ ' img').attr('src',image);                        
            }
            $('#' + widgetID + ' img').on('click.repeat',fdata,this.onClick);
            $('#' + widgetID + ' svg').on('click.repeat',fdata,this.onClick);
        },        
    },
    buttonshuffle : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonshuffle.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            var text = '';

            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;

            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};
            
            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.PlaylistShuffle');
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));

            text += '<style> \n';
            text += '#'+widgetID + ' div {\n';
            text += '   display: inline-block; \n';
            text += '   width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' input[type="submit"] { \n';
            text += '  display: none; \n';
            text += '} \n';
            text += '#'+widgetID + ' img { \n';
            text += '  width:  100%; \n';

            text += '} \n';
            text += '#'+widgetID + ' img:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '} \n';
            text += '#'+widgetID + ' svg { \n';
            text += '  width:  100%; \n';
            text += '} \n';
            text += '#'+widgetID + ' svg:active { \n';
            text += '  transform: scale(0.9, 0.9); \n';
            text += '  transform-origin: 50% 50%; \n';
            text += '} \n';            
            text += '</style> \n';
            
            text += '<div class="btn"> \n';
            text += '  <div> \n';
            text += '    <input type="submit" id="'+ widgetID + 'button" name="'+widgetID+'" value="" >';
            text += '    <span> \n';
            text += '      <img src=""> \n';
            text += '    </span> \n';
            text += '  </div> \n';
            text += '</div> \n';
            
            $('#' + widgetID).html(text);
            this.setState({self:this,widgetID:widgetID, view:view, data:data, style:style});
        },
        onClick: function(event) {
            var data = event.data.data;
            var self = event.data.self;
            var widgetID = event.data.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+".PlaylistShuffle";
            var state = $("input[name="+widgetID+"]").val();
            state = (state > 1) ? 0: parseInt(state) + 1;
            vis.setValue(stateid,state);
        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },
        setState: function(fdata) {
            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var svg = vis.binds["squeezeboxrpc"].svg;               
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+".PlaylistShuffle";       
            
            var state = (vis.states[stateid+ '.val'] || vis.states[stateid+ '.val'] === 0) ? parseInt(vis.states[stateid+ '.val']) : 0;
            var imageshuffle0 = data.imageshuffle0 || '';
            var imageshuffle1 = data.imageshuffle1 || '';
            var imageshuffle2 = data.imageshuffle2 || '';
            
            var svgfill = data.fillcolor || '#ffffff';
            var svgstroke = data.strokecolor || '#ffffff';
            var svgstrokeWidth = data.strokewidth || '0.3';
            
            var image = '';
            //0=pause
            //1=play
            //2=stop
            if (state==0) image = imageshuffle0  || svg.shuffle0;
            if (state==1) image = imageshuffle1  || svg.shuffle0;
            if (state==2) image = imageshuffle2  || svg.shuffle2;
            $('#'+widgetID+ ' input').val(state);
            $('#' + widgetID + ' img').off('click.shuffle',this.onClick);
            $('#' + widgetID + ' svg').off('click.shuffle',this.onClick);
            if (image.startsWith('<svg')) {
                $('#' + widgetID+' span').html(image);
                var $g = $('#' + widgetID+' svg > g')
                if ($g.length) {
                    $g.attr('fill',svgfill);
                    $g.attr('stroke',svgstroke);
                    $g.attr('stroke-width',svgstrokeWidth);
                    if (state===0) {
                        $g.attr('opacity',".5");
                    } else {
                        $g.attr('opacity',"1");                        
                    }
                }                
            } else {
                $('#'+widgetID+ ' img').attr('src',image);                        
            }
            $('#' + widgetID + ' img').on('click.shuffle',fdata,this.onClick);
            $('#' + widgetID + ' svg').on('click.shuffle',fdata,this.onClick);

        },        
    },
    volumebar : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].volumebar.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;

            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style, ainstance:ainstance};
            //if ($('#' + data.widgetPlayer).length>0) this.playersChanged({data:fdata});

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.Volume');
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));            

            var calctype = data.calctype || 'segstep';
            var segments = data.segments || 11;
            var position = data.position || 'vertical';
            if (position=='vertical') {
                var segheight = data.segheight || '100%';
                var segwidth = data.segwidth || '100%';
            } else {
                var segheight = data.segheight || '100%';
                var segwidth = data.segwidth || '20px';
            }
            var borderwidth = data.borderwidth || '1px';
            var bordercolornormal = data.bordercolornormal || '#909090';
            var bordercoloractive  = data.bordercoloractive || '#87ceeb';
            var fillcolornormal = data.fillcolornormal || '#005000';
            var fillcoloractive = data.fillcoloractive || '#00ff00';
            var reverse = data.reverse || false;
            var margin = data.margin || "1px";
            
            
            data.calctype = calctype;
            data.segments = segments;
            data.position = position;

            data.segheight = segheight;
            data.segwidth = segwidth;
            data.borderwidth = borderwidth;
            data.bordercolornormal = bordercolornormal;
            data.bordercoloractive = bordercoloractive;
            data.fillcolornormal = fillcolornormal;
            data.fillcoloractive = fillcoloractive;
            data.reverse = reverse;
            data.margin = margin;
            
            var text = '';
            text += '<style> \n';
            text += '    #'+widgetID + ' .volume { \n';
            text += '        box-sizing: border-box; \n';
            text += '        display: inline-block; \n';
            text += '        font-size:0px; \n';
            text += '        width: 100%; \n';
            text += '        height: 100%; \n';
            text += '        overflow: visible; \n';
            if (position=='horizontal') {
                text += '        white-space: nowrap; \n';
            }
            text += '    } \n';
            text += '    #'+widgetID + ' .level { \n';
            text += '        box-sizing: border-box; \n';  
            text += '        display: inline-block; \n';
            text += '        outline: '+ borderwidth +' solid '+ bordercolornormal +'; \n';
            if (position=='horizontal') {
                text += '        height: calc(100% - ( 2 * '+ margin +' )); \n';
                text += '        width: calc((100% / '+ segments +') - ( 2 * ' +  margin +' )); \n'; 
            }
            if (position=='vertical') {
                text += '        height: calc((100% / '+ segments +') - ( 2 * '+  margin +' )); \n'; 
                text += '        width: calc(100% - ( 2 * '+ margin +' )); \n';
            }
            text += '        background-color: '+ fillcolornormal +'; \n';
            text += '        margin: '+ margin +';         \n';
            text += '    } \n';
            text += '    #'+widgetID + ' .active { \n';
            text += '        border-color: '+ bordercoloractive +'; \n';
            text += '        background-color: '+ fillcoloractive +'; \n';
            text += '    } \n';
            text += '</style> \n';

            text += '<div class="volume"> \n';
            for (var i=0;i < segments;i++) {
                text += '    <div class="level" value="'+i+'"></div> \n';
            }
            text += '</div> \n';
            $('#' + widgetID).html(text);
            $('#' + widgetID + ' div.volume').on('click.volume',fdata,this.onClick);
            if (vis.editMode) this.setState(fdata);
            if (vis.editMode) vis.inspectWidgets(view, view);
        },
        onClick: function(event) {
            var offset = $(this).offset();
            var x = event.pageX - offset.left;
            var y = event.pageY - offset.top ;

            var data = event.data.data;
            var self = event.data.self;
            var widgetID = event.data.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+".Volume";

            var pos;
            var high;
            var segstep
            (data.position=='horizontal') ? pos = x : pos = y;
            (data.position=='horizontal') ? high = this.scrollWidth : high = this.scrollHeight ;
            if (data.reverse) pos=high-pos;

            if (data.calctype=='exact') {
                segstep = high/data.segments;
                pos = (pos-segstep < 0) ? 0 : pos-segstep;
                var state = (pos*100)/(high-segstep);
            }
            if (data.calctype=='segstep') {
                var level = Math.floor(pos/(high/data.segments));
                var state = Math.floor(100/(data.segments-1)*level);
            }
            
            vis.setValue(stateid,state);
        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },        
        setState: function(fdata) {

            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var reverse = data.reverse;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+".Volume";       
            var state = (vis.states[stateid+ '.val'] || vis.states[stateid+ '.val'] === 0) ? vis.states[stateid+ '.val'] : 0;
            if (vis.editMode) state = 50;
            
            if (data.calctype=='exact') {
                var level = Math.ceil(state/(100/(data.segments-1)))+1;
            }
            if (data.calctype=='segstep') {
                var level = Math.round(state/(100/(data.segments-1)))+1;
            }
            var selector = (reverse) ? '#' + widgetID + ' div.volume > div.level:nth-last-child(-n+'+level+')' : '#' + widgetID + ' div.volume > div.level:nth-child(-n+'+level+')';
            $('#' + widgetID + ' div.volume > div.level').removeClass('active');
            $(selector).addClass('active');

        },       
    },

    syncgroup : {
        createWidget: function (widgetID, view, data, style) {
            
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;
                        
            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};
    
            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(fdata){
                var widgetID = fdata.widgetID;
                var view = fdata.view;
                var data = fdata.data;
                var style = fdata.style;
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.PlayerID');
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.SyncMaster');
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.SyncSlaves');
                }                
                setTimeout(function () {
                    vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
                }, 100);
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));

            if (vis.binds["squeezeboxrpc"].getPlayerWidgetType(view,data.widgetPlayer) == 'formatselect') {
                $div.html("Only Player formattype button is supported");
                return false;
            }            
            
            var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);

            var dataplayer = vis.views[view].widgets[data.widgetPlayer].data;
            
            var picWidth            = dataplayer.picWidth;
            var picHeight           = dataplayer.picHeight;
            var borderwidth         = data.borderwidth;
            var borderstyle         = data.borderstyle;
            var bordercolornogroup   = data.bordercolornogroup;
            var bordercolorowngroup   = data.bordercolorowngroup;
            var bordercolorothergroup   = data.bordercolorothergroup;
            var borderradius        = data.borderradius;
            var buttonbkcolor       = data.buttonbkcolor;
            var buttonmargin        = data.buttonmargin || '0px';
            
            var text = '';        
            text += '<style>\n';
            text += '#'+widgetID + ' div {\n';
            text += '     display: inline-block; \n';
            text += '}\n';
            text += '#'+widgetID + ' div div {\n';
            text += '     position: relative; \n';
            text += '     margin: 0px '+buttonmargin+' '+buttonmargin+' 0px; \n';
            text += '}\n';
            text += '#'+widgetID + ' input[type="checkbox"] {\n';
            text += '    display: none;\n';
            text += '}\n';
            text += '#'+widgetID + ' canvas {\n';
            text += '    opacity: 1;\n';
            text += '    width: '+picWidth+'px;\n';
            text += '    height: '+picHeight+'px;\n';
            text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolornogroup+';\n';
            text += '    border-radius: '+borderradius+';\n';
            text += '}\n';
            text += '#'+widgetID + ' canvas:active {\n';
            text += '    transform: scale(0.9, 0.9);\n';
            text += '    opacity: 1;\n';
            text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolorowngroup+';\n';
            text += '    border-radius: '+borderradius+';\n';
            text += '}\n';
            text += '#'+widgetID + ' input[type="checkbox"]:checked + label img {\n';
            text += '    opacity: 1;\n';
            text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolorowngroup+';\n';
            text += '    border-radius: '+borderradius+';\n';
            text += '}\n';
            text += '#'+widgetID + ' input[type="checkbox"]:checked + label canvas {\n';
            text += '    opacity: 1;\n';
            text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolorowngroup+';\n';
            text += '    border-radius: '+borderradius+';\n';
            text += '}\n';
            text += '#'+widgetID + ' input[type="checkbox"][othergroup="true"] + label img {\n';
            text += '    opacity: 1;\n';
            text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolorothergroup+';\n';
            text += '    border-radius: '+borderradius+';\n';
            text += '}\n';
            text += '#'+widgetID + ' input[type="checkbox"][othergroup="true"] + label canvas {\n';
            text += '    opacity: 1;\n';
            text += '    border: '+borderwidth+' '+borderstyle+' '+bordercolorothergroup+';\n';
            text += '    border-radius: '+borderradius+';\n';
            text += '}\n';
            text += '</style>\n';
            
            text += '<div id="'+widgetID+'container" >';
            var valid = false;
            for (var i = 0; i < players.length;i++) {
                var stateid = data.ainstance.join('.') + ".Players"+"." + players[i] + ".PlayerID";
                var playerid = (vis.states[stateid+ '.val'] || vis.states[stateid+ '.val'] === 0) ? vis.states[stateid+ '.val'] : "";
                valid = valid || playerid;
                text += '  <div>';
                text += '    <input type="checkbox" id="'+ widgetID + players[i] +'" name="'+widgetID+'" playername="'+ players[i] +'" value="' + playerid + '" disabled>';
                text += '    <label for="'+ widgetID + players[i] + '">';
                text += '      <span>';
                text += '      <canvas></canvas>';
                text += '      </span>';
                text += '    </label>';
                text += '  </div>';
            }
            if (!valid) return setTimeout(function () {
                vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
            }, 100);
            text += '</div>';
            $('#' + widgetID).html(text);                

            for (var i = 0; i< players.length;i++) {
                var elemp = $('#'+data.widgetPlayer+' input[value="'+players[i]+'"]  + label span :first-child');
                var elems = $('#'+widgetID+players[i]+' + label span canvas');
                elems[0].height=elemp.height();
                elems[0].width=elemp.width();
                
                var destCtx = elems[0].getContext('2d');
                destCtx.drawImage(elemp[0], 0, 0,elemp.width(),elemp.height());
            }
            
            var syncgroupbtns = $("input[name="+widgetID+"]");
            syncgroupbtns.off('change.syncgroup').on('change.syncgroup',fdata, function(event){
                var fdata = event.data
                var data = fdata.data;
                var self = fdata.self;
                var syncplayer=this.value;
                var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
                var syncplayername = $(this).attr("playername");
                if (syncplayer) {
                    if (!$(this).prop('checked')) {
                        var stateid = ainstance[0]+'.'+ainstance[1]+".Players"+"."+syncplayername+".cmdGeneral";
                        vis.setValue(stateid, '"sync","-"');                    
                    } else {
                        var stateid = ainstance[0]+'.'+ainstance[1]+".Players"+"."+playername+".cmdGeneral";
                        vis.setValue(stateid, '"sync","'+syncplayer+'"');
                    }
                }
                self.setState(fdata);
            });
        },
        onChange: function(e, newVal, oldVal) {
            console.log(e.type + ": " + newVal + ", " + oldVal);
            this.self.setState(this);
        },        
        setState: function(fdata) {

            var data = fdata.data;        
            var widgetID = fdata.widgetID;
            
            var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);            
            var syncgroups = [];
            for (var ip=0;ip<players.length;ip++) {
                var playername = players[ip];
                var stateid1 = data.ainstance.join('.')+".Players"+"."+playername+".SyncMaster";
                var stateid2 = data.ainstance.join('.')+".Players"+"."+playername+".SyncSlaves";
                var state1 = (vis.states[stateid1+ '.val'] || vis.states[stateid1+ '.val'] === 0) ? vis.states[stateid1+ '.val'] : "";
                var state2 = (vis.states[stateid2+ '.val'] || vis.states[stateid2+ '.val'] === 0) ? vis.states[stateid2+ '.val'] : "";
                var state = state1.split(",").concat(state2.split(','));
                state = state.filter(item => item != "");
                if (Array.isArray(state)) {
                    if (!syncgroups.reduce(function(acc,val){
                        return state[0] == "" || state.length==0 || acc || val.includes(state[0]);
                    },false)) syncgroups.push(state);
                }
            }
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer)
            var stateid1 = data.ainstance.join('.')+".Players"+"."+playername+".SyncMaster";
            var stateid2 = data.ainstance.join('.')+".Players"+"."+playername+".SyncSlaves";
            var stateid3 = data.ainstance.join('.')+".Players"+"."+playername+".PlayerID";
            var state1 = (vis.states[stateid1+ '.val'] || vis.states[stateid1+ '.val'] === 0) ? vis.states[stateid1+ '.val'] : "";
            var state2 = (vis.states[stateid2+ '.val'] || vis.states[stateid2+ '.val'] === 0) ? vis.states[stateid2+ '.val'] : "";
            var state3 = (vis.states[stateid3+ '.val'] || vis.states[stateid3+ '.val'] === 0) ? vis.states[stateid3+ '.val'] : "";
            var owngroup = null;
            for (var i=0;i<syncgroups.length;i++) {
                if (syncgroups[i].includes(state3)) {
                    owngroup = i;
                    break;
                }                    
            }
            var state = state1.split(",").concat(state2.split(','));
            state = state.filter(item => item != "");
            for (var ip=0;ip<players.length;ip++) {
                var playerbutton = players[ip];
                var playerstateid = data.ainstance.join('.')+".Players"+"."+playerbutton+".PlayerID";
                var playerid = (vis.states[playerstateid+ '.val'] || vis.states[playerstateid+ '.val'] === 0) ? vis.states[playerstateid+ '.val'] : "";                    
                var playergroup = null;
                for (var is=0;is<syncgroups.length;is++) {
                    if (syncgroups[is].includes(playerid)) {
                        playergroup = is;
                        break;
                    }                    
                }                    
                
                var $btn = $("input[id="+widgetID+playerbutton+"]");
                if (state.includes(playerid) && playerid !== state3) {
                    $btn.prop('checked',true);
                } else {
                    $btn.prop('checked',false);                    
                }
                if (playerid == state3) {
                    $btn.prop('disabled',true);
                } else {
                    $btn.prop('disabled',false);                    
                }
                if (playergroup!= null && playergroup != owngroup ) {
                    $btn.attr('othergroup',true);
                } else {
                    $btn.attr('othergroup',false);                    
                }                
            }
        },
    },
    playtime : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].playtime.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;

            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.Duration');                   
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.Time');
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.state');
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.cmdGoTime');
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));
           
            var mainbarcolor        = data.mainbarcolor;
            var playtimebarcolor    = data.playtimebarcolor;
            var borderwidth         = data.borderwidth;
            var borderstyle         = data.borderstyle;
            var bordercolor         = data.bordercolor;
            var borderradius        = data.borderradius;
            
            var text = '';
            text += '<style> \n';
            text += '#'+widgetID + ' .playtimemain {\n';
            text += '    width: 100%;\n';
            text += '    height: 100%;\n';
            text += '    background-color: ' + mainbarcolor + ';\n';
            text += '    border: ' + bordercolor + ' ' + borderwidth + ' ' + borderstyle + ';\n';
            text += '    border-radius: ' + borderradius + ';\n';
            text += '    overflow: hidden;\n';
            text += '}';

            text += '#'+widgetID + ' .playtimebar {\n';
            text += '  height: 100%;\n';
            text += '  background-color: ' + playtimebarcolor + ';\n';
            text += '}\n';
            text += '</style> \n';

            text += '<div class="playtimemain">\n';
            text += '    <div class="playtimebar"></div>\n';
            text += '</div>\n';
                        
            $('#' + widgetID).html(text);
            $('#' + widgetID + ' div.playtimemain').on('click.playtime',fdata,this.onClick);

            this.setState(fdata);
        },
        onClick: function(event) {
            var data = event.data.data;
            var self = event.data.self;
            var widgetID = event.data.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid_duration = data.ainstance.join('.')+".Players"+"."+playername+".Duration";
            var stateid_playtime = data.ainstance.join('.')+".Players"+"."+playername+".Time";
            var stateid_gotime   = data.ainstance.join('.')+".Players"+"."+playername+".cmdGoTime";
            
            var state_duration = (vis.states[stateid_duration+ '.val'] || vis.states[stateid_duration+ '.val'] === 0) ? parseInt(vis.states[stateid_duration+ '.val']) : 0;
            var state_playtime = (vis.states[stateid_playtime+ '.val'] || vis.states[stateid_playtime+ '.val'] === 0) ? parseInt(vis.states[stateid_playtime+ '.val']) : 0;
            var clickx = event.offsetX;
            var clicky = event.offsetY;
            var width = $(this).width();
            var height = $(this).height();
            var time = clickx/width * state_duration;
            if (time>state_duration) return;
            vis.setValue(stateid_gotime,time.toString());
        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },
        setState: function(fdata) {
            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var svg = vis.binds["squeezeboxrpc"].svg;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid_duration = data.ainstance.join('.')+".Players"+"."+playername+".Duration";
            var stateid_playtime = data.ainstance.join('.')+".Players"+"."+playername+".Time";
            var stateid_state    = data.ainstance.join('.')+".Players"+"."+playername+".state";
            
            var state_duration = (vis.states[stateid_duration+ '.val'] || vis.states[stateid_duration+ '.val'] === 0) ? parseInt(vis.states[stateid_duration+ '.val']) : 0;
            var state_playtime = (vis.states[stateid_playtime+ '.val'] || vis.states[stateid_playtime+ '.val'] === 0) ? parseInt(vis.states[stateid_playtime+ '.val']) : 0;
            var state_state    = (vis.states[stateid_state   + '.val'] || vis.states[stateid_state   + '.val'] === 0) ? parseInt(vis.states[stateid_state   + '.val']) : 0;
            var width = state_playtime * 100 / state_duration;
            var width = state_duration==0 ? 0:width;
            if (state_state == 2) width=0; //0 if player stop 
            if (vis.editMode) width=50;
            $('#' + widgetID + ' div.playtimebar').width(width+"%");            
        },        
    },
    string : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].string.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            
            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;
            
            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};
            
            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.' + data.playerattribute);
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));
          
            this.setState(fdata);
        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },
        setState: function(fdata) {
            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+'.' + data.playerattribute;       
            
            var state = (vis.states[stateid+ '.val']) ? vis.states[stateid+ '.val'] : '';
            if (vis.editMode) state = data.test_html || '';
            var html_prepend = data.html_prepend || '';
            var html_append = data.html_append || '';
            $('#'+widgetID).html(html_prepend+state+html_append);
        },        
    },    
    number : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].number.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            
            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;
            
            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};
            
            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.' + data.playerattribute);
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));
          
            this.setState(fdata);
        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },
        setState: function(fdata) {
            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+'.' + data.playerattribute;       
            
            var state = (vis.states[stateid+ '.val']) ? vis.states[stateid+ '.val'] : '';
            if (vis.editMode) state = data.test_html || '';
            state = parseFloat(state);
            if (state === undefined || state === null || isNaN(state) )  state = 0;
            if (data.digits || data.digits !== '')      state = state.toFixed(parseFloat(data.digits, 10));
            if (data.is_tdp && data.is_tdp !== '') {
                state = state.toString().split('.');
                state[0] = state[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g,"$&,");
                state = state.join('.');
            }            
            if (data.is_comma && data.is_comma !== '')  state = state.split('.').map(e => e.replace(/,/g,'.')).join(',');

            var html_prepend = data.html_prepend || '';
            var html_append = data.html_append || '';
            $('#'+widgetID).html(html_prepend+state+html_append);
        },        
    },
    datetime : {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].datetime.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            
            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;
            
            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};
            
            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.' + data.playerattribute);
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));
          
            this.setState(fdata);
        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },
        setState: function(fdata) {
            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+'.' + data.playerattribute;       
            
            var state = (vis.states[stateid+ '.val']) ? vis.states[stateid+ '.val'] : '';
            if (vis.editMode) state = data.test_html || '';
            if (data.factor && data.factor !== '') state = state * data.factor;
            var offset = 1000*60*new Date(0).getTimezoneOffset()
            state = new Date(offset+state);
            if (isNaN(state)) state = '';
            if (state instanceof Date) state = state.format(data.format);
            var html_prepend = data.html_prepend || '';
            var html_append = data.html_append || '';
            $('#'+widgetID).html(html_prepend+state+html_append);
        },        
    },
    image: {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].image.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            
            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;
            
            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};
            
            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.' + data.playerattribute);
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));
            var imgstyle = "width:100%;";
            if (data.stretch) imgstyle += "height:100%;";
            var text = '';
            text +=data.html_prepend || '';
            text += '<img style="'+imgstyle+'"></img> \n';
            text +=data.html_append || '';
            $('#' + widgetID).html(text);          
            this.setState(fdata);

        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },
        setState: function(fdata) {
            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+'.' + data.playerattribute;       
            
            var state = (vis.states[stateid+ '.val']) ? vis.states[stateid+ '.val'] : '';
            if (vis.editMode) state = data.test_html || '';

            $('#'+widgetID + ' img').attr('src',state);
        },        
    },
    playlist: {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
                        if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].playlist.createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            
            var ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div,data.widgetPlayer) 
            if (!ainstance) return;
            
            data.showimage  = data.showimage || "1";
            data.showtitle  = data.showtitle || "1";
            data.showartist = data.showartist || "1";                        
            
            var fdata = {self:this,widgetID:widgetID, view:view, data:data, style:style};
            
            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer,fdata,this.onChange.bind(fdata),function(){
                var boundstates = [];
                var players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (var i=0;i<players.length;i++) {
                    boundstates.push(ainstance[0]+'.'+ainstance[1]+'.Players.'+players[i]+'.Playlist');
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer,fdata,this.setState.bind(fdata));
            var text = '';
            text +='<div></div>';
            $('#' + widgetID).html(text);          
            this.setState(fdata);

        },
        onChange: function(e, newVal, oldVal) {
            this.self.setState(this);
        },
        setState: function(fdata) {
            var data = fdata.data;
            var widgetID = fdata.widgetID;
            var playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            var stateid = data.ainstance.join('.')+".Players"+"."+playername+'.Playlist';       
            
            var state = (vis.states[stateid+ '.val']) ? vis.states[stateid+ '.val'] : '';
            if (state) state = JSON.parse(state); 
            var fragment = can.view('tplplaylist',state);

            
            $('#'+widgetID ).empty().append(fragment);
        },        
    },
    redrawInspectWidgets: function (view) {
        if (window.Selection) {
            if (window.getSelection()) var sel = window.getSelection();
            if (sel.anchorNode) {
                var $edit = $(sel.anchorNode).find('input, textarea').first();
                var id = $edit.attr('id');
                var start = $edit.prop('selectionStart');
                var end   = $edit.prop('selectionEnd');
            } 
        }
        vis.inspectWidgets(view, view);
        var $edit = $('#'+id);
        if ($edit) {
            $edit.focus();
            $edit.prop({
                'selectionStart': start,
                'selectionEnd': end
            });            
        }
        
    },
    checkViewIndex: function (widgetID, view, viewindex, attr, isCss) {
        var data = vis.views[view].widgets[widgetID].data;
        var viewindexcheck = data.viewindexcheck;

        if (!viewindex || viewindex.trim() == "") {
            viewindex = vis.binds["squeezeboxrpc"][data.functionname].getViewindex(viewindexcheck).join(", ");
        }
        
        viewindex   = viewindex.split(",").map(function(item) {
            return item.trim();
        });

        viewindex = vis.binds["squeezeboxrpc"][data.functionname].checkViewindexExist(viewindex,viewindexcheck);

        if (viewindex.length > viewindexcheck.length) viewindex = viewindex.slice(0,viewindexcheck.length);
        data.viewindex = viewindex.join(', ');
        var $edit = $('#inspect_viewindex');
        var id = $edit.attr('id');
        var start = $edit.prop('selectionStart');
        var end   = $edit.prop('selectionEnd');
        if (start > data.viewindex.length) start = data.viewindex.length;
        if (end   > data.viewindex.length) end   = data.viewindex.length;
        $edit.val(data.viewindex);
        var $edit = $('#inspect_viewindex');
        if ($edit) {
            $edit.focus();
            $edit.prop({
                'selectionStart': start,
                'selectionEnd': end
            });
        }
        return false;
        
    },
    getPlayerWidgetType: function (view,playerWidgetID) {
        return vis.views[view].widgets[playerWidgetID].data.formattype || '';
    },
    checkAttributes: function ($div,widgetPlayer) {
        if (!widgetPlayer) {
            $div.html("Please select a player widget");
            return false;
        }
        if (!vis.widgets[widgetPlayer].data.ainstance) {
            $div.html("Please select an instance at the playerwidget");
            return false;
        }
        var ainstance = vis.widgets[widgetPlayer].data.ainstance.split(".");
        if (!ainstance || ainstance[0] != "squeezeboxrpc") {
            $div.html("Please select an instance at the playerwidget");
            return false;
        }
        return ainstance;
    },
    setChanged: function (widgetPlayer,fdata,setState_callback) {
        $('.vis-view').off('change.' + fdata.widgetID).on('change.' + fdata.widgetID, '#' + widgetPlayer, fdata, function(event) {
            var self = fdata.self;
            self.setState(fdata);
        });
    },
    setPlayersChanged: function ($div,widgetPlayer,fdata,onChange_callback,boundstates_callback) {        

        $('.vis-view').off('playerschanged.' + fdata.widgetID).on('playerschanged.' + fdata.widgetID, '#' + widgetPlayer, fdata, function(event) {
            var fdata = event.data;
            var boundstates = boundstates_callback.apply(this,[fdata]);
            if (boundstates) vis.binds["squeezeboxrpc"].bindStates($div, boundstates, onChange_callback, fdata);
        }.bind(this));
    },
    bindStates: function (elem, bound, change_callback, fdata) {        
        var $div = $(elem);
        var boundstates = $div.data('bound');
        if (boundstates) {
            for (var i = 0; i < boundstates.length; i++) {
                vis.states.unbind(boundstates[i], change_callback);
            }
        }
        $div.data('bound', null);
        $div.data('bindHandler', null);

        vis.conn.gettingStates =0;
        vis.conn.getStates(bound, function (error, states) {
            var fdata = this.fdata;
            var self = fdata.self;
            vis.updateStates(states);
            vis.conn.subscribe(bound);
            for (var i=0;i<bound.length;i++) {
                bound[i]=bound[i]+'.val';
                vis.states.bind(bound[i] , change_callback);            
            }
            $div.data('bound', bound);
            $div.data('bindHandler', change_callback);
        }.bind({fdata,change_callback}));                
    },
    attrSelect: function (wid_attr, options) {
            if (wid_attr === 'widgetPlayer') var options = this.findPlayerWidgets();
            if (wid_attr === 'widgetFavorites') var options = this.findFavoritesWidgets();
            var html='';
            for (var i=0;i < options.length;i++) {
                html += '<option value="'+options[i]+'">'+options[i]+'</option>';
            }
            var line = {
                input: '<select type="text" id="inspect_' + wid_attr + '">'+html+'</select>'
            };
            return line;
    },
    playerAttrSelect: function (wid_attr, options) {
            var html='';
            var playerattributes = vis.binds["squeezeboxrpc"].playerattributes.sort();
            for (var i=0;i < playerattributes.length;i++) {
                html += '<option value="'+playerattributes[i]+'">'+playerattributes[i]+'</option>';
            }
            var line = {
                input: '<select type="text" id="inspect_' + wid_attr + '">'+html+'</select>'
            };
            return line;
    },        
    findPlayerWidgets: function() {
        var widgets = vis.views[vis.activeView].widgets;
        var keys = Object.keys(widgets);
        var result = [];
        for (var i=0;i < keys.length;i++) {
            if (widgets[keys[i]].tpl == "tplSqueezeboxrpcPlayer") result.push(keys[i]);
        }
        return result;
    },
    findFavoritesWidgets: function() {
        var widgets = vis.views[vis.activeView].widgets;
        var keys = Object.keys(widgets);
        var result = [];
        for (var i=0;i < keys.length;i++) {
            if (widgets[keys[i]].tpl == "tplSqueezeboxrpcFavorites") result.push(keys[i]);
        }
        return result;
    },
    getPlayerValues: function(widgetPlayer) {
        return $("input[name="+widgetPlayer+"], #"+widgetPlayer+" option").toArray().reduce(function(acc,cur){
             if ($(cur).val()) acc.push($(cur).val());
             return acc;
        },[]);
    },
    getPlayerName: function(widgetPlayer) {
        return $("input[name="+widgetPlayer+"]:checked, #"+widgetPlayer+" option:checked").val();
    },
    onHorizChange: function(widgetID, view, newId, attr, isCss) {
        var data = vis.views[view].widgets[widgetID].data;
        if (newId=='vertical') {
            data.segheight = '100%';
            data.segwidth = '100%';
        } else {
            data.segheight = '20px';
            data.segwidth = '20px';
        }
        return true;
    },
    editDimension: function (widgetID, view, newId, attr, isCss) {        
        if (newId && typeof newId !== 'object') {
            var e = newId.substring(newId.length - 2);
            if (e !== 'px' && e !== 'em' && newId[newId.length - 1] !== '%') {
                vis.views[view].widgets[widgetID].data[attr] = newId + 'px';
            }
        }
    },
}
vis.binds["openligadb"].showVersion();
      