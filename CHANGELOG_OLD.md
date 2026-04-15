# Changelog (archived)

This file contains older changes of ioBroker.poolcontrol.  
Recent changes can be found in the README.md.

## 1.2.4

- fix problems reported by adapter-checker

## 1.2.3

- add connectiontype and datasource to io-package.json

## 1.2.2

- fix result calculation

## 1.2.1

- fix object type

## 1.2.0

- fix display of goals if goals are without minutes and playername saved by openligadb

- fixed that sometimed request of states failed

## 1.1.0

- prepare v1.1.0

## 1.0.3

- change setstate/createobject logic

## 1.0.2

- remove deprecated widgets / change widget beta flag

- improve debug messages

## 1.0.1

- improve error message for requests

## 1.0.0

- prepare for stable repository

## 0.11.5

- pivottable: show only results for selected gameday
- table3: icon attributes, add image selection dialog
- table3: add an extra attribute for mode to use with binding
- all widgets: update documentation

## 0.11.4

- fixed build/test problem

## 0.11.3

- pivottable: fix problem with rank number

## 0.11.2

- pivottable: fix problem with sort and highlightontop
- fix problem with goalgetters

## 0.11.1

- change some template settings, goalgetter table get headers,
  add object change sensing
- widget goalgetters: add parameter highlight and showonlyhighlight
- widget pivottable: add sort option and choice to place favorite teams on top
- remove year from date for several widgets

## 0.11.0

- extend table to calculate with x last games and extend table to calculate
  ranking for a defined gameday, to ensure backward compatibility i have to
  create a new table v3 widget
- extend table with trend sign (arrow up/down, point for no change)
- new widget goal getter ranking with sort function
- new widget pivot table of played games
- extend table modes with 1st round,2nd round

## 0.10.3

- change computing and output logic of gameday widget to mark gameday
  header with favorite class
- improve documentation with css-klasses for table widget
- bugfix for calculate gameday.

## 0.10.2

- Add data column goaldiff to table widget, improve more documentation
  (systax highlighting,copy code function), add example to
  control gameday with buttons,

## 0.10.1

- Improve documentation with more recipes and syntax highlighting,
  improve code to get and subscribe states

## 0.10.0

- New widget Table 2 that includes the calculation of the total, home and
  away results. the previous widget is now deprecated, due to the
  different datapoint (allmatches) to be selected.

## 0.9.3

- Remove ES6 features due to compatibility with older browsers

## 0.9.2

- next try to fix the experimental javascript binding function

## 0.9.1

- fix bugs in calculation matchresults and highlight clubs in favgames

## 0.9.0

- new Function for vis Binding to search for games at the actual day for
  favorite clubs, css-classes für games at actual day, fix bug to show
  the right match results,

## 0.8.0

- push version for latest repository. fix some typos. fix a problem with
  date handling on different OS

## 0.0.11

- widget gameday: fix issue with not working gamedaycount

## 0.0.10

- widget gameday: optional you can show informations about the goalgetters

## 0.0.9

- optional weekday for widgets: gameday and gamesoffavclub,highlight the
  clubname in gamesoffavclub

## 0.0.8

- new widget games of favorite clubs with multi league support as
  replacement for the old one

## 0.0.7

- close connections and remove observers (timeouts/intervals)

## 0.0.6

- NPM deployment and preperation for the latest repository

## 0.0.5

- highlight favorite club,
- Replacement value for edit mode if showgameday is set with binding,
- widget gameday setting for start gameday an length (-1,3 = show previous
  gameday and 3 gamedays after that)
- some documentation
- remove unused code
- new widget: next x games of club
- fix issue for dynamic with of club column

## 0.0.4

- fixed more oids in vis runtime

## 0.0.3

- fixed getting oids in vis runtime

## 0.0.2

- add controlable gameday logic to gameday widget and adapter

## 0.0.1

- initial release
