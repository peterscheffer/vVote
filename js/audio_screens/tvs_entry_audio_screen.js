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
 * TvsEntryAudioScreen - The audio screen class for the entry to the TVS system for the blind interface.
 * 
 * @author Peter Scheffer
 */

var TvsEntryAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {

    tvsMode = true;
    gvsMode = false;
    $('#keypad').show();
    
    // Listen for audio UI gestures.
    var touchContainer = document.getElementById('audio_only_screen');
    var hammer = new Hammer(touchContainer);
    hammer.ontap = null;
    hammer.ondoubletap = null;
    hammer.ontransformstart = null;
    hammer.ontransform = null;
    hammer.ontransformend = null;
    hammer.ondragstart = null;
    hammer.ondrag = null;
    hammer.ondragend = null;

    // At end of playing the complete context help sequence, play the navigation audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };

      var container = getContainer();
      var votingSession = container.Resolve("votingSession");
      var districtAudioFile = votingSession.getDistrictAudioFile();
      var regionAudioFile = votingSession.getRegionAudioFile();
      
      var clips = [ ['tvs_intro_district_of'],
                    [districtAudioFile],
                    ['and_in_the_region_of'],
                    [regionAudioFile],
                    ['tvs_flip_keypad'], 
                    ['tvs_introduction_audio'] ];

      var instructions = new AudioInstructions(clips, false, true, callback2);     
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var districtAudioFile = votingSession.getDistrictAudioFile();
    var regionAudioFile = votingSession.getRegionAudioFile();

    var clips = [ ['tvs_intro_district_of'],
                  [districtAudioFile],
                  ['and_in_the_region_of'],
                  [regionAudioFile],
                  ['tvs_flip_keypad'], 
                  ['tvs_introduction_audio'] ];

    var instructions = new AudioInstructions(clips, false, true, callback1);

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);

    var votingSession = container.Resolve("votingSession");
    votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));
    votingSession.setInactivityTimer(0);
    votingSession.setIsVisualMode(false);
  }
});