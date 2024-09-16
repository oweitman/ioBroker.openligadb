/*
    ioBroker.vis openligadb Widget-Set

    Copyright 2020 oweitman oweitman@gmx.de

*/
"use strict";
/* global vis, $, systemDictionary */
/* eslint prefer-const: "error"*/
/*eslint no-var: "error"*/

// add translations for edit mode

$.extend(true, systemDictionary, {
    "lcount": { "en": "Groups", "de": "Gruppen", "ru": "Группы", "pt": "Grupos", "nl": "Groepen", "fr": "Groupes", "it": "Gruppi", "es": "Grupos", "pl": "Grupy", "uk": "Групи", "zh-cn": "组" },
    "maxicon": { "en": "Icon size", "de": "Icongröße", "ru": "Размер иконы", "pt": "Tamanho do ícone", "nl": "Pictogramgrootte", "fr": "Taille de l'icône", "it": "Dimensione icona", "es": "Tamaño del icono", "pl": "Rozmiar ikon", "uk": "Розмір ікони", "zh-cn": "图标大小" },
    "showresult": { "en": "Display result", "de": "Anzeige Ergebnis", "ru": "Результат", "pt": "Resultado da exposição", "nl": "Resultaat tonen", "fr": "Afficher le résultat", "it": "Visualizzazione del risultato", "es": "Resultado de visualización", "pl": "Wynik wyświetlania", "uk": "Результати пошуку", "zh-cn": "显示结果" },
    "showabbreviation": { "en": "Display abbreviation", "de": "Abkürzung anzeigen", "ru": "Отображение аббревиатуры", "pt": "Abreviatura de exibição", "nl": "Afkorting weergeven", "fr": "Afficher l'abréviation", "it": "Visualizzazione abbreviazione", "es": "Pantalla abreviatura", "pl": "Pokaż skrót", "uk": "Розширення екрану", "zh-cn": "显示缩略语" },
    "showweekday": { "en": "Display weekday", "de": "Anzeige Wochentag", "ru": "Дисплей", "pt": "Exibir dia da semana", "nl": "Weekdag weergeven", "fr": "Affichage en semaine", "it": "Visualizza giorno della settimana", "es": "Mostrar semanario", "pl": "Wyświetl dzień tygodnia", "uk": "День відкритих дверей", "zh-cn": "显示工作日" },
    "group_leagues": { "en": "Group", "de": "Gruppe", "ru": "Группа", "pt": "Grupo", "nl": "Groep", "fr": "Groupe", "it": "Gruppo", "es": "Grupo", "pl": "Grupa", "uk": "Група", "zh-cn": "组" },
    "oid-allmatches": { "en": "ID allmatches", "de": "ID allmatches", "ru": "ID allmatches", "pt": "ID allmatches", "nl": "ID allmatches", "fr": "NUMÉRO allmatches", "it": "ID allmatches", "es": "ID allmatches", "pl": "ID allmatches", "uk": "ІМ'Я allmatches", "zh-cn": "身份证 allmatches" },
    "oid-currgameday": { "en": "ID currgameday", "de": "ID currgameday", "ru": "ID currgameday", "pt": "ID currgameday", "nl": "ID currgameday", "fr": "NUMÉRO currgameday", "it": "ID currgameday", "es": "ID currgameday", "pl": "ID currgameday", "uk": "ІМ'Я currgameday", "zh-cn": "身份证 currgameday" },
    "showgameday": { "en": "Gameday", "de": "Spieltag", "ru": "Gameday", "pt": "Gameday", "nl": "Speldag", "fr": "Jour de jeu", "it": "Giorno di gioco", "es": "Juego", "pl": "Gameday", "uk": "День народження", "zh-cn": "游戏日" },
    "showgamedaycount": { "en": "Number of match days", "de": "Anzahl der Spieltage", "ru": "Количество дней матча", "pt": "Número de dias de jogo", "nl": "Aantal wedstrijddagen", "fr": "Nombre de jours de match", "it": "Numero di giorni di partita", "es": "Número de días de partido", "pl": "Liczba dni meczu", "uk": "Кількість днів матчу", "zh-cn": "比赛天数" },
    "shortname": { "en": "Short name", "de": "Kurzbezeichnung", "ru": "Название", "pt": "Nome curto", "nl": "Korte naam", "fr": "Nom abrégé", "it": "Nome breve", "es": "Nombre corto", "pl": "Nazwa skrócona", "uk": "Коротка назва", "zh-cn": "简称" },
    "onlylogo": { "en": "only Logo", "de": "nur Logo", "ru": "только Лого", "pt": "só Logotipo", "nl": "alleen logo", "fr": "logo unique", "it": "solo Logo", "es": "sólo Logo", "pl": "tylko Logo", "uk": "логотип", "zh-cn": "只有日志" },
    "abbreviation": { "en": "Abbreviation", "de": "Abkürzung", "ru": "Сокращения", "pt": "Abreviação", "nl": "Afkorting", "fr": "Abréviation", "it": "Abbreviazione", "es": "Abreviatura", "pl": "Skrót", "uk": "Аббревіатура", "zh-cn": "缩略语" },
    "filter": { "en": "Filter", "de": "Filter", "ru": "Фильтр", "pt": "Filtro", "nl": "Filter", "fr": "Filtre", "it": "Filtro", "es": "Filtro", "pl": "Filtr", "uk": "Фільтри", "zh-cn": "过滤器" },
    "highlight": { "en": "Highlight", "de": "Hervorheben", "ru": "Основной момент", "pt": "Destaque", "nl": "Oplichten", "fr": "Mettre en évidence", "it": "In evidenza", "es": "Highlight", "pl": "Podświetlenie", "uk": "Підсвічування", "zh-cn": "突出显示" },
    "showtrend": { "en": "Show trend", "de": "Trend anzeigen", "ru": "Тенденция", "pt": "Mostrar tendência", "nl": "Trend tonen", "fr": "Afficher la tendance", "it": "Mostra trend", "es": "Mostrar tendencia", "pl": "Pokaż trend", "uk": "Показати тренд", "zh-cn": "显示趋势" },
    "mode": { "en": "Mode", "de": "Modus", "ru": "Режим", "pt": "Modo", "nl": "Modus", "fr": "Mode", "it": "Modalità", "es": "Modo", "pl": "Tryb", "uk": "Режими", "zh-cn": "模式" },
    "mode_binding": { "en": "Mode (Binding)", "de": "Modus (Binding)", "ru": "Режим (Binding)", "pt": "Modo (Binding)", "nl": "Modus (Binding)", "fr": "Mode (Binding)", "it": "Modalità (Binding)", "es": "Modo (Binding)", "pl": "Tryb (Binding)", "uk": "Режими (Binding)", "zh-cn": "模式 (Binding)" },
    "group_icons": { "en": "Trend icons", "de": "Trend icons", "ru": "Иконы тренда", "pt": "Ícones de tendência", "nl": "Trendpictogrammen", "fr": "Icônes de tendance", "it": "Icone di tendenza", "es": "Iconos de tendencia", "pl": "Ikony trendu", "uk": "Модні ікони", "zh-cn": "趋势图标" },
    "iconup": { "en": "Trend upward", "de": "Trend nach oben", "ru": "Отклонение вверх", "pt": "Tendência para cima", "nl": "Trend omhoog", "fr": "Tendance à la hausse", "it": "Tendenza verso l'alto", "es": "Tendencia hacia arriba", "pl": "Trend w górę", "uk": "Тенденції", "zh-cn": "上升趋势" },
    "icondn": { "en": "Downward trend", "de": "Abwärtstrend", "ru": "Внизу", "pt": "Tendência para baixo", "nl": "Dalende trend", "fr": "Tendances à la baisse", "it": "Tendenza verso il basso", "es": "Tendencia descendente", "pl": "Tendencja spadkowa", "uk": "Важкий тренд", "zh-cn": "向下趋势" },
    "iconst": { "en": "Trend unchanged", "de": "Trend unverändert", "ru": "Тренд без изменений", "pt": "Tendência inalterada", "nl": "Ontwikkeling ongewijzigd", "fr": "Évolution inchangée", "it": "Tendenze invariate", "es": "Tendencia sin cambios", "pl": "Trend bez zmian", "uk": "Тенденції без змін", "zh-cn": "趋势不变" },
    "lastgamecount": { "en": "Last matchday", "de": "Letzter Spieltag", "ru": "Последний день матча", "pt": "Último dia do jogo", "nl": "Laatste wedstrijddag", "fr": "Dernier jour de rencontre", "it": "Ultimo giorno di partita", "es": "Último partido", "pl": "Ostatni mecz", "uk": "Останній збіг", "zh-cn": "上一个匹配日" },
    "highlightontop": { "en": "Highlight at the beginning", "de": "Highlight am Anfang", "ru": "Основной момент в начале", "pt": "Destaque no início", "nl": "Oplichten bij het begin", "fr": "Mettre en évidence au début", "it": "In evidenza all'inizio", "es": "Destacar al principio", "pl": "Podświetl na początku", "uk": "Виділити на початку", "zh-cn": "开头突出" },
    "maxcount": { "en": "Maximum number", "de": "Maximale Anzahl", "ru": "Максимальное число", "pt": "Número máximo", "nl": "Maximumaantal", "fr": "Nombre maximal", "it": "Numero massimo", "es": "Número máximo", "pl": "Maksymalna liczba", "uk": "Максимальна кількість", "zh-cn": "最大数目" },
    "sort": { "en": "Sorted", "de": "Sortiert", "ru": "Сортированные", "pt": "Classificação", "nl": "Gesorteerd", "fr": "Triés", "it": "Ordinato", "es": "Clasificado", "pl": "Sortowane", "uk": "Сортувати", "zh-cn": "排序" },
    "showonlyhighlight": { "en": "Show highlights only", "de": "Nur Highlights anzeigen", "ru": "Показать только", "pt": "Mostrar apenas destaques", "nl": "Alleen hoogtepunten tonen", "fr": "Afficher uniquement les faits saillants", "it": "Mostra solo i punti salienti", "es": "Show highlights sólo", "pl": "Pokaż tylko podświetlenia", "uk": "Показати тільки", "zh-cn": "只显示突出显示" },
    "oid-goalgetters": { "en": "ID goalgetters", "de": "ID goalgetters", "ru": "ID goalgetters", "pt": "ID goalgetters", "nl": "ID goalgetters", "fr": "NUMÉRO goalgetters", "it": "ID goalgetters", "es": "ID goalgetters", "pl": "ID goalgetters", "uk": "ІМ'Я goalgetters", "zh-cn": "身份证 goalgetters" },

    "xxx": {},

});


vis.binds["openligadb"] = {
    version: "1.4.0",
    showVersion: function () {
        if (vis.binds["openligadb"].version) {
            console.log("Version openligadb: " + vis.binds["openligadb"].version);
            vis.binds["openligadb"].version = null;
        }
    },
    pivottable2: {
        createWidget: function (widgetID, view, data, style) {

            const $div = $("#" + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].pivottable2.createWidget(widgetID, view, data, style);
                }, 100);
            }

            const allmatches = data["oid-allmatches"] ? JSON.parse(vis.states.attr(data["oid-allmatches"] + ".val")) : [];
            let currgameday = data["oid-currgameday"] ? vis.states.attr(data["oid-currgameday"] + ".val") : 1;
            currgameday = currgameday || 1;
            const maxicon = data.maxicon || 25;
            const shortname = data.shortname || false;
            const onlylogo = data.onlylogo || false;
            const highlight = data.highlight || "";
            const sort = data.sort || "table";
            const highlightontop = data.highlightontop || false;

            function onChange() {
                vis.binds["openligadb"].pivottable2.createWidget(widgetID, view, data, style);
            }

            if (data["oid-allmatches"] && data["oid-currgameday"]) {
                if (!vis.editMode) {
                    vis.binds["openligadb"].bindStates2($div, [data["oid-allmatches"], data["oid-currgameday"]], onChange);
                }
            }

            if (!allmatches) return;
            const pivottable2 = allmatches.reduce(function (collect, item) {
                let team;
                if (Object.prototype.hasOwnProperty.call(collect, item.team1.teamName)) {
                    team = collect[item.team1.teamName];
                } else {
                    team = {
                        "teamName": item.team1.teamName,
                        "shortName": item.team1.shortName,
                        "teamIconUrl": item.team1.teamIconUrl,
                        "gamedays": []
                    };
                }
                const result = vis.binds["openligadb"].getResult(item.matchResults);
                let team1result = Object.prototype.hasOwnProperty.call(result, "pointsTeam1") ? result.pointsTeam1 : "-";
                let team2result = Object.prototype.hasOwnProperty.call(result, "pointsTeam2") ? result.pointsTeam2 : "-";
                if (item.group.groupOrderID > currgameday) {
                    team1result = "-";
                    team2result = "-";
                }

                const game = {
                    "matchDateTime": item.matchDateTime,
                    "result": team1result + ":" + team2result,
                    "groupName": item.group.groupName,
                    "groupOrderID": item.group.groupOrderID,
                    "teamName": item.team2.teamName,
                    "shortName": item.team2.shortName,
                    "teamIconUrl": item.team2.teamIconUrl
                };

                team.gamedays[item.team2.teamName] = game;
                collect[item.team1.teamName] = team;
                return collect;

            }, []);
            let table = vis.binds["openligadb"].table4.calcTable(allmatches, 1, currgameday, currgameday);
            const newtable = new Array();
            for (const items in table) {
                newtable.push(table[items]);
            }
            if (sort == "table") {
                table = newtable.sort(function (a, b) {
                    return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : (a.goalDiff < b.goalDiff) ? 1 : (a.goalDiff > b.goalDiff) ? -1 : 0);
                });
            }
            if (sort == "name") {
                table = newtable.sort(function (a, b) {
                    const name1 = (shortname) ? a.shortName : a.teamName;
                    const name2 = (shortname) ? b.shortName : b.teamName;
                    return (name1 > name2) ? 1 : (name1 < name2) ? -1 : 0;
                });
            }
            if (highlightontop) {
                if (highlight.trim() != "") {
                    let tophighlight = highlight.split(";");
                    tophighlight = tophighlight.reverse();
                    for (let i = 0; i < tophighlight.length; i++) {
                        const topindex = table.findIndex(function (item) {
                            return item.teamName.toLowerCase().indexOf(tophighlight[i].toLowerCase()) >= 0;
                        });
                        if (topindex > 0) table.splice(0, 0, table.splice(topindex, 1)[0]);
                    }
                }
            }

            let text = "";

            text += "<style> \n";
            text += "#" + widgetID + " .oldb-icon {\n";
            text += "   max-height: " + maxicon + "px; \n";
            text += "   max-width: " + maxicon + "px; \n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-center {\n";
            text += "   text-align: center;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-tt td{\n";
            text += "   white-space: nowrap;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-full {\n";
            text += "   width: 100%;\n";
            text += "} \n";
            text += "</style> \n";

            text += '<table class="oldb-tt">';
            text += "        <tr>";
            text += '           <th class="oldb-center oldb-rank">#</th><th></th><th></th>';
            table.forEach(function (team) {
                text += '           <th class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="' + team.teamIconUrl + '">';
                text += "           </th>";
            });
            text += '           <th class="oldb-center oldb-goaldiff">Diff</th><th class="oldb-center oldb-points">Punkte</th>';
            text += "        </tr>";
            let pteam1;
            table.forEach(function (team1) {
                pteam1 = pivottable2[team1.teamName];
                let team1name = shortname ? team1.shortName : team1.teamName;
                if (vis.binds["openligadb"].checkHighlite(team1.teamName, highlight)) team1name = '<b class="favorite">' + team1name + "</b>";
                text += "        <tr>";
                text += '            <td class="oldb-center oldb-rank">';
                text += team1.ranking[team1.ranking.length - 1];
                text += "            </td>";
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="' + team1.teamIconUrl + '">';
                text += "           </td>";
                if (!onlylogo) {
                    text += '           <td class="oldb-teamname oldb-full">' + team1name + "</td>";
                }
                table.forEach(function (team2) {
                    if (team1.teamName == team2.teamName) {
                        text += '           <td class=""></td>';
                        return;
                    }
                    const result = pteam1.gamedays[team2.teamName] && pteam1.gamedays[team2.teamName].result || "-";

                    text += '           <td class="oldb-center oldb-result">' + result + "</td>";
                });
                text += '           <td class="oldb-center oldb-goaldiff">' + team1.goalDiff + "</td>";
                text += '           <td class="oldb-center oldb-points">' + team1.points + "</td>";
                text += "        </tr>";
            });
            text += "</table>";
            $("#" + widgetID).html(text);
        },
    },
    goalgetters2: {
        createWidget: function (widgetID, view, data, style) {

            const $div = $("#" + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].goalgetters2.createWidget(widgetID, view, data, style);
                }, 100);
            }

            let goalgetters = data["oid-goalgetters"] ? JSON.parse(vis.states.attr(data["oid-goalgetters"] + ".val")) : [];
            const maxcount = data.maxcount || 99999;
            const sort = data.sort || "goal";
            const highlight = data.highlight || "";
            const showonlyhighlight = data.showonlyhighlight || false;

            function onChange() {
                vis.binds["openligadb"].goalgetters2.createWidget(widgetID, view, data, style);
            }

            if (data["oid-goalgetters"]) {
                if (!vis.editMode) {
                    vis.binds["openligadb"].bindStates2($div, [data["oid-goalgetters"]], onChange);
                }
            }

            goalgetters = this.setName(goalgetters);

            if (sort == "goal") {
                goalgetters = goalgetters.sort(function (a, b) {
                    return b.goalCount - a.goalCount;
                });
            }
            if (sort == "name") {
                goalgetters = goalgetters.sort(function (a, b) {
                    return ("" + a.lastname + " " + a.prename).localeCompare("" + b.lastname + " " + b.prename);
                });
            }

            let text = "";

            text += "<style> \n";
            text += "#" + widgetID + " .oldb-tt td{\n";
            text += "   white-space: nowrap;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-left {\n";
            text += "   text-align: left;\n";
            text += "} \n";
            text += "</style> \n";

            text += '<table class="oldb-gg">';
            text += "        <tr>";
            text += '           <th class="oldb-left">Name</td>';
            text += '           <th class="oldb-left">Tore</td>';
            text += "        </tr>";
            let count = 0;
            goalgetters.forEach(function (goalgetter) {

                if (count < maxcount) {

                    let name = "";
                    name += goalgetter.lastname;
                    (goalgetter.prename) ? name += ", " + goalgetter.prename : name += goalgetter.prename;
                    const check = vis.binds["openligadb"].checkHighlite(name, highlight);
                    if (check) name = "<b>" + name + "</b>";

                    if (!showonlyhighlight || showonlyhighlight && check) {
                        text += "        <tr>";
                        text += '           <td class="oldb-left">' + name + "</td>";
                        text += '           <td class="oldb-left">' + goalgetter.goalCount + "</td>";
                        text += "        </tr>";
                        count++;
                    }
                }
            });
            text += "</table>            ";
            $("#" + widgetID).html(text);
        },
        setName: function (goalgetters) {
            let arr;
            goalgetters.forEach(function (goalgetter) {
                const regex_c1 = /(.+), ?(.+)/g;
                const regex_c2 = /(.+)\. ?(.+)/g;
                const name = goalgetter.goalGetterName.trim();
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
                    goalgetter.prename = arr[1] + ".";
                    goalgetter.ok = true;
                    return;
                }
                arr = name.split(" ");
                if ((arr) && arr.length > 1) {
                    goalgetter.lastname = arr.pop();
                    goalgetter.prename = arr.join(" ");
                    goalgetter.ok = true;
                    return;
                }
                if ((arr) && arr.length == 1) {
                    goalgetter.lastname = arr.pop();
                    goalgetter.prename = "";
                    goalgetter.ok = true;
                }
            });
            return goalgetters;
        },
    },
    favgames3: {
        createWidget: function (widgetID, view, data, style) {

            const $div = $("#" + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].favgames3.createWidget(widgetID, view, data, style);
                }, 100);
            }
            let favgames = [];
            const showabbreviation = data.showabbreviation || false;
            const onlylogo = data.onlylogo || false;
            const showweekday = data.showweekday || false;
            const showresult = data.showresult || false;
            const maxicon = data.maxicon || 25;
            let nohighlight = "";
            const bound = [];

            for (let i = 1; i <= data.lcount; i++) {

                const allmatches = data["oid-allmatches" + i] ? JSON.parse(vis.states.attr(data["oid-allmatches" + i] + ".val")) : [];
                const currgameday = data["oid-currgameday" + i] ? vis.states.attr(data["oid-currgameday" + i] + ".val") : 1;

                if (data["oid-allmatches" + i]) bound.push(data["oid-allmatches" + i]);
                if (data["oid-currgameday" + i]) bound.push(data["oid-currgameday" + i]);
                let showgameday = data["showgameday" + i] || "";
                if (vis.editMode && /{.*}/gm.test(showgameday)) showgameday = "";
                if (showgameday == 0) showgameday = "";
                showgameday = showgameday || currgameday || "";
                let showgamedaycount = data["showgamedaycount" + i] || 9999;
                if (showgamedaycount == 0) showgamedaycount = 9999;

                const abbreviation = data["abbreviation" + i] || "";
                const shortname = data["shortname" + i] || false;
                const filter = data["filter" + i] || "";

                favgames = favgames.concat(this.filterFavGames(allmatches, showgameday, showgamedaycount, currgameday, filter, shortname, abbreviation));
                if (filter == "") nohighlight += "group" + i + " ";
            }

            function onChange() {
                vis.binds["openligadb"].favgames3.createWidget(widgetID, view, data, style);
            }

            if (bound.length > 0) {
                if (!vis.editMode) {
                    vis.binds["openligadb"].bindStates2($div, bound, onChange);
                }
            }
            favgames = this.sortFavGames(favgames);

            const weekday_options = { weekday: "short" };
            //var date_options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const date_options = { month: "2-digit", day: "2-digit" };
            const time_options = { hour: "2-digit", minute: "2-digit" };
            let text = "";

            text += "<style> \n";
            text += "#" + widgetID + " .oldb-icon {\n";
            text += "   max-height: " + maxicon + "px; \n";
            text += "   max-width: " + maxicon + "px; \n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-tdicon {\n";
            text += "   width: " + maxicon + "px; \n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-tt {\n";
            text += "   width: 100%;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-tt td{\n";
            text += "   white-space: nowrap;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-full {\n";
            text += "   width: 50%;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-center {\n";
            text += "   text-align: center;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-right {\n";
            text += "   text-align: right;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-left {\n";
            text += "   text-align: left;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-datetime {\n";
            text += "       font-weight: bold;\n";
            text += "} \n";
            text += "</style> \n";

            text += '<table class="oldb-tt">';

            favgames.forEach(function (match) {
                let team1name = match.shortname ? match.team1.shortName : match.team1.teamName;
                let team2name = match.shortname ? match.team2.shortName : match.team2.teamName;
                if (vis.binds["openligadb"].checkHighlite(team1name, match.filter)) team1name = '<b class="favorite">' + team1name + "</b>";
                if (vis.binds["openligadb"].checkHighlite(team2name, match.filter)) team2name = '<b class="favorite">' + team2name + "</b>";
                const result = vis.binds["openligadb"].getResult(match.matchResults);
                const team1result = Object.prototype.hasOwnProperty.call(result, "pointsTeam1") ? result.pointsTeam1 : "-";
                const team2result = Object.prototype.hasOwnProperty.call(result, "pointsTeam2") ? result.pointsTeam2 : "-";

                const today = new Date();
                const mdate = vis.binds["openligadb"].getDateFromJSON(match.matchDateTime);
                (vis.binds["openligadb"].compareDate(today, mdate)) ? text += '        <tr class="todaygame">' : text += "        <tr>";

                if (showweekday) text += '           <td class="oldb-left">' + vis.binds["openligadb"].getDateFromJSON(match.matchDateTime).toLocaleString(vis.language, weekday_options) + "</td>";
                text += '           <td class="oldb-left">' + vis.binds["openligadb"].getDateFromJSON(match.matchDateTime).toLocaleString(vis.language, date_options) + "</td>";
                text += '           <td class="oldb-left">' + vis.binds["openligadb"].getDateFromJSON(match.matchDateTime).toLocaleString(vis.language, time_options) + "</td>";
                if (showabbreviation) text += '           <td class="oldb-left">' + match.abbreviation + "</td>";
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-icon" src="' + match.team1.teamIconUrl + '">';
                text += "           </td>";
                if (!onlylogo) {
                    text += '           <td class="oldb-full">' + team1name + "</td>";
                }
                if (showresult) text += '           <td class="oldb-left">' + team1result + "</td>";
                text += '           <td class="oldb-left">:</td>';
                if (showresult) text += '           <td class="oldb-left">' + team2result + "</td>";
                text += '           <td class="oldb-center oldb-tdicon">';
                text += '              <img class="oldb-left oldb-icon" src="' + match.team2.teamIconUrl + '">';
                text += "           </td>";
                if (!onlylogo) {
                    text += '           <td class="oldb-full">' + team2name + "</td>";
                }
                text += "        </tr>";
            });
            if (nohighlight != "") text += "<tr><td>No filter set for: " + nohighlight + "</td></tr>";
            text += "</table>            ";
            $("#" + widgetID).html(text);

        },
        filterFavGames: function (allmatches, gameday, gamedaycount, currgameday, filter, shortname, abbreviation) {
            if (!Array.isArray(allmatches)) return [];
            gameday = parseInt(gameday);
            gamedaycount = parseInt(gamedaycount);
            currgameday = parseInt(currgameday);

            return allmatches.reduce(function (result, item) {
                let found;
                item.abbreviation = abbreviation;
                if (gameday > 0 && item.group.groupOrderID >= gameday && item.group.groupOrderID < gameday + gamedaycount) found = item;
                if (gameday < 0 && item.group.groupOrderID >= currgameday + gameday && item.group.groupOrderID < currgameday + gameday + gamedaycount) found = item;
                item.filter = filter;
                item.shortname = shortname;
                if (found && (vis.binds["openligadb"].checkHighlite(item.team1.teamName, filter) || vis.binds["openligadb"].checkHighlite(item.team2.teamName, filter))) result.push(item);
                return result;
            }, []);
        },
        sortFavGames: function (favgames) {
            return favgames.sort(function (a, b) {
                let comp = 0;
                if (vis.binds["openligadb"].getDateFromJSON(a.matchDateTime).getTime() > vis.binds["openligadb"].getDateFromJSON(b.matchDateTime).getTime()) comp = 1;
                if (vis.binds["openligadb"].getDateFromJSON(a.matchDateTime).getTime() < vis.binds["openligadb"].getDateFromJSON(b.matchDateTime).getTime()) comp = -1;
                return comp;
            });
        },
    },
    gameday2: {
        createWidget: function (widgetID, view, data, style) {

            const $div = $("#" + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].gameday2.createWidget(widgetID, view, data, style);
                }, 100);
            }

            const allmatches = data["oid-allmatches"] ? JSON.parse(vis.states.attr(data["oid-allmatches"] + ".val")) : [];
            const currgameday = data["oid-currgameday"] ? vis.states.attr(data["oid-currgameday"] + ".val") : 1;
            let showgameday = data.showgameday || "";
            if (vis.editMode && /{.*}/gm.test(showgameday)) showgameday = "";
            if (showgameday == 0) showgameday = "";
            let showgamedaycount = data.showgamedaycount || 1;
            if (showgamedaycount == 0) showgamedaycount = 1;
            const showweekday = data.showweekday || false;
            const showgoals = data.showgoals || false;

            const maxicon = data.maxicon || 25;
            const shortname = data.shortname || false;
            const onlylogo = data.onlylogo || false;
            const highlight = data.highlight || "";

            function onChange() {
                vis.binds["openligadb"].gameday2.createWidget(widgetID, view, data, style);
            }

            if (data["oid-allmatches"] && data["oid-currgameday"]) {
                if (!vis.editMode) {
                    vis.binds["openligadb"].bindStates2($div, [data["oid-allmatches"], data["oid-currgameday"]], onChange);
                }
            }

            const matches = this.filterGameDay(allmatches, showgameday || currgameday || "", showgamedaycount, currgameday);
            const gamedays = this.groupGameDay(matches, shortname, highlight);

            let text = "";

            text += "<style> \n";
            text += "#" + widgetID + " .oldb-icon {\n";
            text += "   max-height: " + maxicon + "px; \n";
            text += "   max-width: " + maxicon + "px; \n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-tdicon {\n";
            text += "   width: " + maxicon + "px; \n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-tt {\n";
            text += "   width: 100%;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-tt td{\n";
            text += "   white-space: nowrap;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-wrap {\n";
            text += "   white-space: normal !important;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-goal {\n";
            text += "   white-space: nowrap;\n";
            text += "   display: inline-block;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-full {\n";
            text += "   width: 50%;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-center {\n";
            text += "   text-align: center;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-right {\n";
            text += "   text-align: right;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-left {\n";
            text += "   text-align: left;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-datetime {\n";
            text += "       font-weight: bold;\n";
            text += "} \n";
            text += "</style> \n";

            text += '<table class="oldb-tt">';

            //var date_options = (showweekday) ? { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' } : { year: 'numeric', month: '2-digit', day: '2-digit' };
            const date_options = (showweekday) ? { weekday: "short", month: "2-digit", day: "2-digit" } : { month: "2-digit", day: "2-digit" };
            const time_options = { hour: "2-digit", minute: "2-digit" };

            gamedays.forEach(function (gameday) {

                const today = new Date();
                const gddate = vis.binds["openligadb"].getDateFromJSON(gameday.matchDateTime);

                let classtext = (vis.binds["openligadb"].compareDate(today, gddate)) ? "todaygameheader" : "";
                classtext += (gameday.favorite) ? " favorite" : "";
                (classtext != "") ? text += '        <tr class="' + classtext + '">' : text += "        <tr>";

                text += '           <td class="oldb-right oldb-datetime" colspan="3">' + gddate.toLocaleString(vis.language, date_options) + "</td>";
                text += '           <td class=""></td>';
                text += '           <td class="oldb-left oldb-datetime" colspan="3">' + gddate.toLocaleString(vis.language, time_options) + "</td>";
                text += "        </tr>";
                gameday.matches.forEach(function (match) {
                    const mdate = vis.binds["openligadb"].getDateFromJSON(match.matchDateTime);

                    let team1name = shortname ? match.team1.shortName : match.team1.teamName;
                    let team2name = shortname ? match.team2.shortName : match.team2.teamName;
                    if (match.team1.favorite) {
                        team1name = '<b class="favorite">' + team1name + "</b>";
                    }
                    if (match.team2.favorite) {
                        team2name = '<b class="favorite">' + team2name + "</b>";
                    }
                    if (onlylogo) {
                        team1name = "&nbsp;";
                        team2name = "&nbsp;";
                    }
                    const result = vis.binds["openligadb"].getResult(match.matchResults);
                    const team1result = Object.prototype.hasOwnProperty.call(result, "pointsTeam1") ? result.pointsTeam1 : "-";
                    const team2result = Object.prototype.hasOwnProperty.call(result, "pointsTeam2") ? result.pointsTeam2 : "-";

                    (vis.binds["openligadb"].compareDate(today, mdate)) ? text += '        <tr class="todaygame">' : text += "        <tr>";
                    text += '           <td class="oldb-right oldb-full">' + team1name + "</td>";
                    text += '           <td class="oldb-center oldb-tdicon">';
                    text += '              <img class="oldb-icon" src="' + match.team1.teamIconUrl + '">';
                    text += "           </td>";
                    text += '           <td class="oldb-center">' + team1result + "</td>";
                    text += '           <td class="oldb-center">:</td>';
                    text += '           <td class="oldb-center">' + team2result + "</td>";
                    text += '           <td class="oldb-center oldb-tdicon">';
                    text += '              <img class="oldb-center oldb-icon" src="' + match.team2.teamIconUrl + '">';
                    text += "           </td>";
                    text += '           <td class="oldb-left oldb-full">' + team2name + "</td>";
                    text += "        </tr>";

                    const goals = this.getGoals(match);
                    if (showgoals && goals != "") {
                        text += "        <tr>";
                        text += '           <td class="oldb-center oldb-wrap" colspan="7"><small>' + this.getGoals(match) + "</small></td>";
                        text += "        </tr>";
                    }
                }.bind(this));
            }.bind(this));

            text += "</table>            ";

            $("#" + widgetID).html(text);
        },
        filterGameDay: function (allmatches, gameday, gamedaycount, currgameday) {
            gameday = parseInt(gameday);
            gamedaycount = parseInt(gamedaycount);
            currgameday = parseInt(currgameday);

            return allmatches.reduce(function (result, item) {
                if (gameday > 0 && item.group.groupOrderID >= gameday && item.group.groupOrderID < gameday + gamedaycount) result.push(item);
                if (gameday < 0 && item.group.groupOrderID >= currgameday + gameday && item.group.groupOrderID < currgameday + gameday + gamedaycount) result.push(item);
                return result;
            }, []);
        },
        groupGameDay: function (allmatches, shortname, highlight) {
            const newarray = new Array();
            const objectarr = allmatches.reduce(function (result, item) {
                let gameday;
                if (Object.prototype.hasOwnProperty.call(result, item.matchDateTime)) {
                    gameday = result[item.matchDateTime];
                } else {
                    gameday = {
                        "matchDateTime": item.matchDateTime,
                        "matches": [],
                        "favorite": false
                    };
                }
                const team1name = shortname ? item.team1.shortName : item.team1.teamName;
                let team2name = shortname ? item.team2.shortName : item.team2.teamName;
                item.team1.favorite = false;
                item.team2.favorite = false;
                if (vis.binds["openligadb"].checkHighlite(team1name, highlight)) {
                    item.team1.favorite = true;
                    gameday.favorite = true;
                }
                if (vis.binds["openligadb"].checkHighlite(team2name, highlight)) {
                    team2name = '<b class="favorite">' + team2name + "</b>";
                    item.team2.favorite = true;
                    gameday.favorite = true;
                }
                gameday.matches.push(item);
                result[item.matchDateTime] = gameday;
                return result;
            }, []);
            for (const items in objectarr) {
                newarray.push(objectarr[items]);
            }
            return newarray;

        },
        getGoals: function (match) {
            let goaltxts = "";
            match.goals.forEach(function (goal, index, arr) {
                let goaltxt = "";
                const name = (goal.goalGetterName) ? " " + goal.goalGetterName : "";
                const minute = (goal.matchMinute) ? " (" + goal.matchMinute + ")" : "";
                goaltxt += goal.scoreTeam1 + ":" + goal.scoreTeam2 + name + minute;
                goaltxt += (goal.isPenalty) ? " (Elfmeter)" : "";
                goaltxt += (goal.isOwnGoal) ? " (Eigentor)" : "";
                goaltxt += index < arr.length - 1 ? ", " : "";
                goaltxts += '<span class="oldb-goal">' + goaltxt + "</span>";
            });
            return goaltxts;
        }
    },
    table4: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["openligadb"].table4.createWidget(widgetID, view, data, style);
                }, 100);
            }
            const allmatches = data["oid-allmatches"] ? JSON.parse(vis.states.attr(data["oid-allmatches"] + ".val")) : [];
            const currgameday = data["oid-currgameday"] ? vis.states.attr(data["oid-currgameday"] + ".val") : 1;

            let showgameday = data.showgameday || "";
            if (vis.editMode && /{.*}/gm.test(showgameday)) showgameday = "";
            if (showgameday == 0) showgameday = "";
            showgameday = showgameday || currgameday || "";
            let lastgamecount = data["lastgamecount"] || showgameday;
            if (lastgamecount == 0) lastgamecount = showgameday;
            const showtrend = data.showtrend || false;

            const iconup = data.iconup || "widgets/openligadb/img/trend_up.png";
            const icondn = data.icondn || "widgets/openligadb/img/trend_dn.png";
            const iconst = data.iconst || "widgets/openligadb/img/trend_st.png";

            const mode_binding = data.mode_binding || "";
            data.mode = ("1total,2home,3away,4round1,5round2".indexOf(mode_binding) >= 0 && mode_binding != "") ? mode_binding : data.mode;

            const mode = data.mode || "1total";
            const mymode = mode[0];

            function onChange() {
                vis.binds["openligadb"].table4.createWidget(widgetID, view, data, style);
            }

            if (data["oid-allmatches"] && data["oid-currgameday"]) {
                if (!vis.editMode) {
                    vis.binds["openligadb"].bindStates2($div, [data["oid-allmatches"], data["oid-currgameday"]], onChange);
                }
            }

            let table = this.calcTable(allmatches, mymode, showgameday, lastgamecount);

            const newtable = new Array();
            for (const items in table) {
                newtable.push(table[items]);
            }
            table = newtable.sort(function (a, b) {
                return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : (a.goalDiff < b.goalDiff) ? 1 : (a.goalDiff > b.goalDiff) ? -1 : 0);
            });

            const maxicon = data.maxicon || 25;
            const onlylogo = data.onlylogo || false;
            const shortname = data.shortname || false;
            const highlight = data.highlight || "";
            const filter = data.filter || "";
            //test

            let text = "";

            text += "<style> \n";
            text += "#" + widgetID + " .oldb-icon {\n";
            text += "   max-height: " + maxicon + "px; \n";
            text += "   max-width: " + maxicon + "px; \n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-tt {\n";
            text += "   width: 100%;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-tt td{\n";
            text += "   white-space: nowrap;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-full {\n";
            text += "   width: 100%;\n";
            text += "} \n";
            text += "#" + widgetID + " .oldb-center {\n";
            text += "   text-align: center;\n";
            text += "} \n";
            text += "</style> \n";

            text += '<table class="oldb-tt">';
            text += "    <thead>";
            text += "    <tr >";
            text += '        <th class="oldb-center oldb-rank">';
            text += "            #";
            text += "        </th>";
            text += '        <th colspan="2" class="oldb-clubheader" style="text-align: left;">';
            text += "            Club";
            text += "        </th>";
            text += "";
            text += '        <th class="oldb-center oldb-games">';
            text += "            Sp";
            text += "        </th>";
            text += '        <th class="oldb-center oldb-won">';
            text += "            S";
            text += "        </th>";
            text += '        <th class="oldb-center oldb-draw">';
            text += "            U";
            text += "        </th>";
            text += '        <th class="oldb-center oldb-lost">';
            text += "            N";
            text += "        </th>";
            text += '        <th class="oldb-center oldb-goals">';
            text += "            Tore";
            text += "        </th>";
            text += '        <th class="oldb-center oldb-goaldiff">';
            text += "            Diff";
            text += "        </th>";
            text += '        <th class="oldb-center oldb-points">';
            text += "            Punkte";
            text += "        </th>";
            if (showtrend) text += '        <th class="oldb-center oldb-trend">';
            if (showtrend) text += "            T";
            if (showtrend) text += "        </th>";

            text += "    </tr>";
            text += "    </thead>";

            text += '    <tbody class="oldb-tb">';

            table.forEach(function (team, index) {

                let teamname = shortname ? team.shortName : team.teamName;
                if (!(vis.binds["openligadb"].checkHighlite(teamname, filter) || filter == "")) return;
                if (vis.binds["openligadb"].checkHighlite(teamname, highlight)) teamname = '<b class="favorite">' + teamname + "</b>";

                text += "        <tr>";
                text += '            <td class="oldb-center oldb-rank">';
                text += index + 1;
                text += "            </td>";
                text += '            <td class="oldb-center">';
                text += '                <img class="oldb-icon" src="' + team.teamIconUrl + '">';
                text += "            </td>";
                if (!onlylogo) {
                    text += '            <td class="oldb-teamname oldb-full">';
                    text += "                <span>" + teamname + "</span>";
                    text += "            </td>";
                }
                text += '            <td class="oldb-center oldb-games">';
                text += team.matches;
                text += "            </td>";
                text += '            <td class="oldb-center oldb-won">';
                text += team.won;
                text += "           </td>";
                text += '            <td class="oldb-center oldb-draw">';
                text += team.draw;
                text += "            </td>";
                text += '            <td class="oldb-center oldb-lost">';
                text += team.lost;
                text += "            </td>";
                text += '            <td class="oldb-center oldb-goals">';
                text += team.goals + ":" + team.opponentGoals;
                text += "            </td>";
                text += '            <td class="oldb-center oldb-goaldiff">';
                text += team.goalDiff;
                text += "            </td>";
                text += '            <td class="oldb-center oldb-points">';
                text += "                <strong>" + team.points + "</strong>";
                text += "            </td>";
                let ticon = "";
                if (showtrend) {
                    if (team.ranking[team.ranking.length - 1] < team.ranking[team.ranking.length - 2]) ticon = iconup;
                    if (team.ranking[team.ranking.length - 1] > team.ranking[team.ranking.length - 2]) ticon = icondn;
                    if (team.ranking[team.ranking.length - 1] == team.ranking[team.ranking.length - 2]) ticon = iconst;
                }

                if (showtrend) text += '            <td class="oldb-center oldb-points">';
                if (showtrend) text += '                <img class="oldb-icon" src="' + ticon + '">';
                if (showtrend) text += "            </td>";

                text += "        </tr>";
            });
            text += "    </tbody>";
            text += "</table>            ";

            $("#" + widgetID).html(text);
        },
        addRanking: function (table, prevgd) {
            let newtable = new Array();
            for (const items in table) {
                newtable.push(table[items]);
            }
            newtable = newtable.sort(function (a, b) {
                return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : (a.goalDiff < b.goalDiff) ? 1 : (a.goalDiff > b.goalDiff) ? -1 : 0);
            });
            newtable.forEach(function (team, index) {
                table[team.teamName].ranking[prevgd] = index + 1;
            });
        },
        calcTable: function (allmatches, mymode, showgameday, lastgamecount) {

            let prevgd = 0;
            const self = this;
            if (!allmatches) return [];
            const maxgameday = allmatches.reduce(function (a, b) {
                return Math.max(a, b.group.groupOrderID);
            }, 0);

            const table = allmatches.reduce(function (result, item) {
                if (item.group.groupOrderID != prevgd && item.group.groupOrderID <= showgameday) {
                    self.addRanking(result, prevgd);
                }
                prevgd = item.group.groupOrderID;
                const team1name = item.team1.teamName;
                const shortname1 = item.team1.shortName;
                const teamiconurl1 = item.team1.teamIconUrl;
                const team2name = item.team2.teamName;
                const shortname2 = item.team2.shortName;
                const teamiconurl2 = item.team2.teamIconUrl;

                let team1;
                if (Object.prototype.hasOwnProperty.call(result, team1name)) {
                    team1 = result[team1name];
                } else {
                    team1 = {
                        "teamName": team1name,
                        "shortName": shortname1,
                        "teamIconUrl": teamiconurl1,
                        "points": 0,
                        "ranking": [],
                        "opponentGoals": 0,
                        "goals": 0,
                        "matches": 0,
                        "won": 0,
                        "lost": 0,
                        "draw": 0,
                        "goalDiff": 0

                    };
                }
                let team2;
                if (Object.prototype.hasOwnProperty.call(result, team2name)) {
                    team2 = result[team2name];
                } else {
                    team2 = {
                        "teamName": team2name,
                        "shortName": shortname2,
                        "teamIconUrl": teamiconurl2,
                        "points": 0,
                        "ranking": [],
                        "opponentGoals": 0,
                        "goals": 0,
                        "matches": 0,
                        "won": 0,
                        "lost": 0,
                        "draw": 0,
                        "goalDiff": 0

                    };
                }
                const matchresult = vis.binds["openligadb"].getResult(item.matchResults);
                if (Object.prototype.hasOwnProperty.call(matchresult, "pointsTeam1") && item.group.groupOrderID <= showgameday && item.group.groupOrderID > showgameday - lastgamecount) {

                    if (matchresult.pointsTeam1 > matchresult.pointsTeam2) {
                        if (mymode == 1 || mymode == 2 || (mymode == 4 && item.group.groupOrderID <= maxgameday / 2) || (mymode == 5 && item.group.groupOrderID > maxgameday / 2)) {
                            team1.points += 3;
                            team1.opponentGoals += matchresult.pointsTeam2;
                            team1.goals += matchresult.pointsTeam1;
                            team1.matches += 1;
                            team1.won += 1;
                            team1.goalDiff = team1.goals - team1.opponentGoals;
                        }

                        if (mymode == 1 || mymode == 3 || (mymode == 4 && item.group.groupOrderID <= maxgameday / 2) || (mymode == 5 && item.group.groupOrderID > maxgameday / 2)) {
                            team2.points += 0;
                            team2.opponentGoals += matchresult.pointsTeam1;
                            team2.goals += matchresult.pointsTeam2;
                            team2.matches += 1;
                            team2.lost += 1;
                            team2.goalDiff = team2.goals - team2.opponentGoals;
                        }
                    }
                    if (matchresult.pointsTeam1 == matchresult.pointsTeam2) {
                        if (mymode == 1 || mymode == 2 || (mymode == 4 && item.group.groupOrderID <= maxgameday / 2) || (mymode == 5 && item.group.groupOrderID > maxgameday / 2)) {
                            team1.points += 1;
                            team1.opponentGoals += matchresult.pointsTeam2;
                            team1.goals += matchresult.pointsTeam1;
                            team1.matches += 1;
                            team1.draw += 1;
                            team1.goalDiff = team1.goals - team1.opponentGoals;
                        }

                        if (mymode == 1 || mymode == 3 || (mymode == 4 && item.group.groupOrderID <= maxgameday / 2) || (mymode == 5 && item.group.groupOrderID > maxgameday / 2)) {
                            team2.points += 1;
                            team2.opponentGoals += matchresult.pointsTeam1;
                            team2.goals += matchresult.pointsTeam2;
                            team2.matches += 1;
                            team2.draw += 1;
                            team2.goalDiff = team2.goals - team2.opponentGoals;
                        }
                    }
                    if (matchresult.pointsTeam1 < matchresult.pointsTeam2) {
                        if (mymode == 1 || mymode == 2 || (mymode == 4 && item.group.groupOrderID <= maxgameday / 2) || (mymode == 5 && item.group.groupOrderID > maxgameday / 2)) {
                            team1.points += 0;
                            team1.opponentGoals += matchresult.pointsTeam2;
                            team1.goals += matchresult.pointsTeam1;
                            team1.matches += 1;
                            team1.lost += 1;
                            team1.goalDiff = team1.goals - team1.opponentGoals;
                        }

                        if (mymode == 1 || mymode == 3 || (mymode == 4 && item.group.groupOrderID <= maxgameday / 2) || (mymode == 5 && item.group.groupOrderID > maxgameday / 2)) {
                            team2.points += 3;
                            team2.opponentGoals += matchresult.pointsTeam1;
                            team2.goals += matchresult.pointsTeam2;
                            team2.matches += 1;
                            team2.won += 1;
                            team2.goalDiff = team2.goals - team2.opponentGoals;
                        }
                    }
                }
                result[team1name] = team1;
                result[team2name] = team2;

                return result;
            }, []);
            this.addRanking(table, showgameday);
            return table;

        },

    },






    bindStates: function (elem, bound, change_callback) {
        const $div = $(elem);
        const boundstates = $div.data("bound");
        if (boundstates) {
            for (let i = 0; i < boundstates.bound.length; i++) {
                vis.states.unbind(boundstates.bound[i], boundstates.change_callback);
            }
        }
        $div.data("bound", null);
        $div.data("bindHandler", null);

        vis.conn.gettingStates = 0;
        vis.conn.getStates(bound, function (error, states) {
            vis.updateStates(states);
            vis.conn.subscribe(bound);

            for (let i = 0; i < bound.length; i++) {
                bound[i] = bound[i] + ".val";
                vis.states.bind(bound[i], change_callback);
            }
            $div.data("bound", { bound, change_callback });
            $div.data("bindHandler", change_callback);
        }.bind({ change_callback }));
    },
    bindStates2: function (elem, bound, change_callback) {
        const $div = $(elem);
        const boundstates = $div.data("bound");
        if (boundstates) {
            for (let i = 0; i < boundstates.bound.length; i++) {
                vis.states.unbind(boundstates.bound[i], boundstates.bindHandler);
            }
        }
        $div.data("bound", null);

        for (let i = 0; i < bound.length; i++) {
            bound[i] = bound[i] + ".val";
            vis.states.bind(bound[i], change_callback);
        }
        $div.data("bound", { bound, bindHandler: change_callback });
    },
    checkHighlite: function (value, highlights, sep) {
        sep = typeof sep !== "undefined" ? sep : ";";
        const highlight = highlights.split(sep);
        return highlight.reduce(function (acc, cur) {
            if (cur == "") return acc;
            return acc || value.toLowerCase().indexOf(cur.toLowerCase()) >= 0;
        }, false);
    },
    getDateFromJSON: function (datestring) {
        const aDate = datestring.split("T")[0].split("-");
        const aTime = datestring.split("T")[1].split(":");
        return new Date(aDate[0], aDate[1] - 1, aDate[2], aTime[0], aTime[1]);
    },
    getResult: function (results) {
        if (results.length == 0) return {};
        results = results.reduce(function (acc, cur) {
            //if (cur.ResultTypeID==2) acc = cur;
            if (cur.resultTypeID > (acc.resultTypeID || 0)) acc = cur;
            return acc;
        }, {});
        return results;
    },
    compareDate: function (adate, bdate) {
        return adate.getDate() == bdate.getDate() &&
            adate.getMonth() == bdate.getMonth() &&
            adate.getYear() == bdate.getYear();
    },
    checkTodayFavorite: function (oid, highlite) {
        if (oid) {
            const json = vis.states.attr(oid + '.val');
            if ((json) && json != 'null') {
                if (!vis.subscribing.IDs.includes(oid)) {
                    vis.subscribing.IDs.push(oid);
                    const a = [];
                    a.push(oid);
                    vis.conn.gettingStates = 0;
                    vis.conn.getStates(a, function (error, data) {
                        vis.updateStates(data);
                        const a = [];
                        a.push(oid);
                        vis.conn.subscribe(a);
                    });
                }
                const matches = JSON.parse(json);
                if (matches) {
                    const today = new Date();
                    return matches.reduce(function (result, item) {
                        const mdate = vis.binds["openligadb"].getDateFromJSON(item.matchDateTime);
                        const test = vis.binds["openligadb"].compareDate(today, mdate) &&
                            (vis.binds["openligadb"].checkHighlite(item.team1.teamName, highlite, ",") ||
                                vis.binds["openligadb"].checkHighlite(item.team2.teamName, highlite, ","));
                        if (test) {
                        }
                        return result || test;
                    }, false);
                }
            } else {
                if (!vis.subscribing.IDs.includes(oid)) vis.subscribing.IDs.push(oid);
                const a = [];
                a.push(oid);
                vis.conn.gettingStates = 0;
                vis.conn.getStates(a, function (error, data) {
                    vis.updateStates(data);
                    const a = [];
                    a.push(oid);
                    vis.conn.subscribe(a);
                });
            }
        }
        return false;
    },
};
vis.binds["openligadb"].showVersion();

