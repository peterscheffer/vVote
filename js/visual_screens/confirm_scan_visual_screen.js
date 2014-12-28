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
 * ConfirmScanVisualScreen - The visual screen class for confirming entrance to the visual interface.
 * Deprecated - this screen has been culled.
 * 
 * @author Peter Scheffer
 */
 
var ConfirmScanVisualScreen = Screen.extend({
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    this._super(visualScreenManager, 'confirm_scan_screen', 
      this.initialiseScanScreen, 
      this.exitScanScreen,
      this.switchToScanScreen);
  },

  initialiseScanScreen: function () { 
  
    $('#confirm_scan_screen_next_button').bind('touchstart', function () {
      startVisualApp = window.setTimeout(function () { openSettingsScreen(); }, 750);
    });
  
    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    window.clearTimeout(votingSession.getInactivityCounterTimer());
    votingSession.setInactivityCounterTimer(window.setTimeout(function () { checkForTimeout(); }, 2000));
    votingSession.setInactivityTimer(0);
    votingSession.setIsVisualMode(true);

    var audioController = container.Resolve("audioController");
    var instructions = new AudioInstructions([ ['four_fingers_on_screen'] ], true, true, null);     
    audioController.playAudioInstructions(instructions);
  },

  exitScanScreen: function () { 

  },

  switchToScanScreen: function () { 
  
  }
});
