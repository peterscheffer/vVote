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
 *  OptionsManager is responsible for configuring the performance and behaviour of the application.
 *  It is driven via the Command pattern - requests are sent to the ScreenManager via the execute() function, 
 *  and a callback is called immediately after the command is executed, with the response from the command
 *  sent to the callback function, along with any errors that occur.
 * 
 * @author Peter Scheffer
 */

var OptionsManager = Class.extend({

  init: function () {
    this.audioSpeed = 1;
    this.playbackRate = 1;
  },
  
  reset: function () {
    this.audioSpeed = 1;
    this.playbackRate = 1;
  },

  showUnavailableOption: function (ballot) {
    return ballot;
  },
  
  requestClearBallot: function () {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    ballot = audioController.getCurrentBallot();
    return ballot;
  },
  
  setCurrentBallot: function (ballot) {
    this.currentBallot = ballot;
  },

  confirmClearBallot: function (ballot) {
    var container = getContainer();
    var audioScreenManager = container.Resolve("audioScreenManager");
    if (gvsMode) {
      audioScreenManager.setCurrentBlindInterfaceScreen('ballot_options_menu_screen');
    } else {
      audioScreenManager.setCurrentBlindInterfaceScreen('tvs_ballot_options_menu_screen');
    }
    
    var audioController = container.Resolve("audioController");
    ballot = audioController.getCurrentBallot();
  
    if (ballot == null) {
      throw NULL_POINTER_EXCEPTION;
    }

    ballot.clear();

    return ballot;
  },
  
  getPlaybackRate: function () {
    return this.playbackRate;
  },
  
  resetAudioSpeed: function () {
    this.playbackRate = 1;
  },

  increaseAudioSpeed: function () {
  
    this.audioSpeed++;
    if (this.audioSpeed > 3) {
      this.audioSpeed = 1;
    }
    
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var audioScreenManager = container.Resolve("audioScreenManager");
    
    if (this.audioSpeed == 1) {
      var audio = document.getElementById('complete_audio');
      this.playbackRate = 1;
      
      return 'speaking_rate_normal';
      
    } else if (this.audioSpeed == 2) {
      var audio = document.getElementById('complete_audio');
      this.playbackRate = 1.4;

      return 'speaking_rate_medium';
      
    } else if (this.audioSpeed == 3) {
      var audio = document.getElementById('complete_audio');
      this.playbackRate = 1.8;

      return 'speaking_rate_fast';
    }
  },
  
  switchToVisualInterface: function () {
    switchedToVisualMode = true;
    userAlertedOfTimeout = false;

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    window.clearTimeout(votingSession.getAuiInactivityCounterTimer());
    votingSession.setAuiInactivityTimer(0);
    votingSession.setInactivityCounterTimer(window.setTimeout(function () { checkForTimeout(); }, 2000));
    votingSession.setIsVisualMode(true);
    
    // Play alert to the blind user that they have been switched to the visual UI.    
    var instructions = new AudioInstructions(['switch_to_audio'], false, true, null);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);

    return 'start_screen';
  },
  
  pauseVoting: function (ballot) {
    return ballot;
  },
  
  requestEndVoting: function (ballot) {
    return ballot;
  },

  // Execute a Command that calls one of this class's methods and then 
  // calls the callback defined in the command.
  execute : function (command){
    try {
      var response = this[command.request](command.data);
      command.callback(response, null, command.data);
    } catch (error) {
      alert("Error in OptionsManager. Trace: " + error.message); 
    }
  }
});