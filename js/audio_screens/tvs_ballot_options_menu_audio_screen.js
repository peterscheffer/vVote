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
 * TvsBallotOptionsMenuAudioScreen - The audio screen class for the ballot options menu screen for the TVS blind interface.
 * 
 * @author Peter Scheffer
 */

var TvsBallotOptionsMenuAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {
    
    // At the end of playing nav gestures, repeat.
    var callback1 = function () {
      var container = getContainer();
      var audioController = container.Resolve("audioController");    
      audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
    };

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    
    var clips = [ ['options_menu'], 
                  ['options_menu_item_1'], 
                  ['tvs_press_1'],
                  ['options_menu_item_2'], 
                  ['tvs_press_2'],
                  ['options_menu_item_3'], 
                  ['tvs_press_3'],
                  ['options_menu_item_4'], 
                  ['tvs_press_4'],
                  ['options_menu_item_5'], 
                  ['tvs_press_5'],
                  ['options_menu_item_6'], 
                  ['tvs_press_6'],
                  ['options_menu_item_7'], 
                  ['tvs_press_7'],
                  ['tvs_to_exit_this_options_menu'], 
                  ['tvs_press_hash'] ];

    var instructions = new AudioInstructions(clips, true, true, callback1);
    audioController.playAudioInstructions(instructions);
  }

});