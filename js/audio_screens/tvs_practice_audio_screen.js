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
 * TvsPracticeAudioScreen - The audio screen class for the TVS keypad practice for the blind interface.
 * 
 * @author Peter Scheffer
 */

var TvsPracticeAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {

    // At end of playing the complete context help sequence, play the navigation audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var instructions = new AudioInstructions(['tvs_practice_navigation_instructions', 'tvs_quit_practice_press_hash'], false, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var clips = new Array();
    clips = clips.concat(['practice_buttons_instructions', 'tvs_quit_practice_press_hash']);
    var instructions = new AudioInstructions(clips, true, true, callback1);

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },
  
  practice: function (response, error) {

    // At end of playing the complete context help sequence, play the navigation audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var instructions = new AudioInstructions(['tvs_practice_navigation_instructions'], false, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var clips = new Array();
    clips = clips.concat([response]);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var instructions = new AudioInstructions(clips, false, true, callback1);
    audioController.playAudioInstructions(instructions);  
  }
}); 
