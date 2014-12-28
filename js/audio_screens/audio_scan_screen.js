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
 * AudioScanScreen class represents the QR code scan screen for the blind UI.
 * 
 * @author Peter Scheffer
 */

var AudioScanScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {
    var clips = ['scan_qr_code_screen'];
    var instructions = new AudioInstructions(clips, false, true, null);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
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
    visualView.displaySection(currentVisualInterfaceScreen, 'audio_scan_screen');

    this.initialEntry();
  }  
});