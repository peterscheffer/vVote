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
 * TriageVisualScreen - The visual screen class for the triage (black) screen for the visual interface.
 * 
 * @author Peter Scheffer
 */

var TriageVisualScreen = Screen.extend({
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    this._super(visualScreenManager, 'triage_screen', 
      this.initialiseTriageScreen,
      this.exitTriageScreen,
      this.switchToTriageScreen);
  },  

  initialiseTriageScreen: function () {

    var container = getContainer();
    var visualView = container.Resolve('visualView');
    visualView.playVideo("scan_qr_code_video", "videos/start_qr.ogv");

    var audioController = container.Resolve("audioController");
    var clips = new Array();
    clips = clips.concat(['four_fingers_on_screen']);
    var instructions = new AudioInstructions(clips, true, true, null);
    audioController.playAudioInstructions(instructions);

    window.clearTimeout(barcodeTimeout);
    barcodeTimeout = window.setTimeout(function () { getBarcode(processQRcode); }, SCAN_TIMEOUT);
  },
  
  exitTriageScreen: function () {
    var visualView = container.Resolve("visualView");
    visualView.stopVideo('scan_qr_code_video');
  },
  
  switchToTriageScreen: function () {

  }
});