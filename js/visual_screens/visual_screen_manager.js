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
 *  VisualScreenManager is responsible for maintaining state of each of the Screens in the Visual interface.
 *  It is driven via the Command pattern - requests are sent to the VisualScreenManager via the execute() function, 
 *  and a callback is called immediately after the command is executed, with the response from the command
 *  sent to the callback function, along with any errors that occur.
 *  There is not a lot for this Manager to do.  All data manipulation takes place via interface click triggers.
 * 
 * @author Peter Scheffer
 */

var VisualScreenManager = Class.extend({

  // Initialiser is called by the Constructor
  init: function () {
    this.userVotedAboveOrBelowTheLine = null;
    this.currentVisualInterfaceScreen = 'triage_screen';
  },

  reset: function () {
    this.userVotedAboveOrBelowTheLine = null;
    this.currentVisualInterfaceScreen = 'triage_screen';
  },

  // Flag whether the user visited above or below the line in council ballot.  
  setUserVotedAboveOrBelowTheLine: function (userVotedAboveOrBelowTheLine) {
    this.userVotedAboveOrBelowTheLine = userVotedAboveOrBelowTheLine;
  },
  
  // Flag whether the user visited above or below the line in council ballot.  
  getUserVotedAboveOrBelowTheLine: function () {
    return this.userVotedAboveOrBelowTheLine;
  },

  // Update the visual navigation model based on the screen entered.
  enterScreen: function (screen) { 

    this.previousVisualInterfaceScreen = this.currentVisualInterfaceScreen;
    this.currentVisualInterfaceScreen = screen;

    var container = getContainer();
    
    if (screen == null) {
      throw NULL_POINTER_EXCEPTION;
    }    
    
    if (screen == 'legislative_assembly_candidate_vote_screen') {
      var legislativeAssemblyBallot = container.Resolve("assembly");
      legislativeAssemblyBallot.setVisited(true);
      var visualController = container.Resolve("visualController");
      visualController.setCurrentBallot(legislativeAssemblyBallot);        
    } else if (screen == 'legislative_council_combined_screen') {
      var aboveTheLineCouncilBallot = container.Resolve("atl");
      aboveTheLineCouncilBallot.setVisited(true);
      var belowTheLineCouncilBallot = container.Resolve("btl");
      belowTheLineCouncilBallot.setVisited(true);            
    }
    
    return screen;
  },
  
  switchToScreen: function (screen) {
    return screen;
  },

  // Update the visual navigation model based on the screen entered.
  exitScreen: function (screen) {},

  // Return the current screen that the user is viewing.  
  getCurrentVisualInterfaceScreen: function () {
    return this.currentVisualInterfaceScreen;
  },
  
  setCurrentVisualInterfaceScreen: function (screen) {
    this.currentVisualInterfaceScreen = screen;
  },
  
  getPreviousVisualInterfaceScreen: function () {
    return this.previousVisualInterfaceScreen;
  },

  // Prevent the user from zooming in and out and generally dragging the (touch) screen.  
  preventScreenDragging: function () {
    document.ontouchmove = function(e) {
      e.preventDefault();
    }
  },

  // Switch from the visual UI to the audio UI.  
  switchToAudioInterface: function () {
    this.preventScreenDragging();
    return this.currentVisualInterfaceScreen;
  },

  // Execute a Command that calls one of this class's methods and then 
  // calls the callback defined in the command.
  execute : function (command){
    var response = this[command.request](command.screen);
    if (command.callback != null) {
      command.callback(response, null, command.screen);
    }
  }
});