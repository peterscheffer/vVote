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
 * AudioModeScanVisualScreen - The visual screen class for the scan qr code screen for the audio interface.
 * 
 * @author Peter Scheffer
 */
 
var AudioModeScanVisualScreen = Screen.extend({
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    this._super(visualScreenManager, 'audio_mode_scan_qr_code_screen', 
      this.initialiseScanScreen, 
      this.exitScanScreen,
      this.switchToScanScreen);
  },

  initialiseScanScreen: function () { 

    var clips = [ ['scan_qr_code_screen'] ];
    var instructions = new AudioInstructions(clips, true, true, null);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },
  
  switchToScanScreen: function () {

    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();

    var visualView = container.Resolve("visualView");
    visualView.displaySection('audio_mode_scan_qr_code_screen', 'triage_screen');
    var screenFactory = container.Resolve("screenFactory");
    var scanScreen = screenFactory.getInstance("scan_qr_code_screen");
    scanScreen.initialiseScanScreen();    
  },
  
  exitScanScreen: function () {}

});