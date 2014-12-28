/**
 *   This file is part of vVote from the Victorian Electoral Commission.
 *
 *   vVote is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License.
 *
 *   vVote is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with vVote.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   Contact Craig Burton   craig.burton@vec.vic.gov.au
 *
 *
 * Screen class represents the displayed section of the web application on the screen at any one time.
 * Some screens have initialisation code to execute before display, and some have tear down code.
 * The Screen class defines enter and exit functions that call the relevant controllers and managers to perform the task.  
 * Screens need to be created in this manner only if they have specific setup and/or tear down functions.
 * 
 * @author Peter Scheffer
 */
var Screen = Class.extend({
  
  typeOf: function () {
    return "Screen";
  },

  // Initialiser/Constructor.
  init: function (manager, screenName, initialiser, exiter, switchScreen) {
    this.manager = manager;
    this.screenName = screenName;
    this.initialiser = initialiser;
    this.exiter = exiter;
    this.visited = false;
    this.switchScreen = switchScreen;
  },
  
  // Action to call when exiting the screen.
  exit: function () {
    this.manager.execute({
      request : 'exitScreen',
      screen: this.screenName,
      callback: this.exiter
    });
  },
  
  // Action to call on entry to the screen.
  enter: function () {
    this.manager.execute({
      request : 'enterScreen',
      screen: this.screenName,
      callback: this.initialiser
    });
    // Have visited? on exit so that start screen sets this parameter.
    this.visited = true;
  },
  
  // Switch from audio to visual equivalent.
  switchToVisual: function () {
    this.manager.execute({
      request : 'switchToScreen',
      screen: this.screenName,
      callback: this.switchScreen
    });
  },
  
  // Returns boolean indicating whether the user has visited this screen.
  hasVisited: function () {
    return this.visited;
  },
  
  setHasVisited: function (visited) {
    this.visited = visited;
  }
});