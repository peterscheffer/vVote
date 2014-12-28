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
 * AudioStartScreen class represents the starting screen for the blind UI.
 * 
 * @author Peter Scheffer
 */

var AudioStartScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {

    // At the end of playing nav gestures, repeat.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var clips = [ ['gvs_start_screen'] ];
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var clips = [ ['gvs_start_screen'] ];
    var instructions = new AudioInstructions(clips, false, true, callback1);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
    
    var votingSession = container.Resolve("votingSession");
    votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));
    votingSession.setInactivityTimer(0);
    votingSession.setIsVisualMode(false);
  },

  switchToAudioInterface: function () {
    switchedToVisualMode = false;
    var container = getContainer();
    
    var audioController = container.Resolve("audioController");    
    var audioScreenManager = container.Resolve("audioScreenManager");
    audioScreenManager.reset();

    var visualView = container.Resolve("visualView");
    var visualScreenManager = container.Resolve("visualScreenManager");
    var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    visualView.displaySection(currentVisualInterfaceScreen, 'audio_only_screen');

    this.initialEntry();
  }  
});