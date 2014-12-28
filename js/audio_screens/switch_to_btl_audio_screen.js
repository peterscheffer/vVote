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
 * SwitchToBtlAudioScreen - The audio screen class for the switch from ATL to BTL warning for the blind interface.
 * 
 * @author Peter Scheffer
 */

var SwitchToBtlAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {

    // If the user didn't vote ATL, then we can skip this Switch to BTL warning.
    var container = getContainer();
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var selectionCount = aboveTheLineCouncilBallot.getHighestSelection();

    if (selectionCount == 0) {    
      var audioScreenManager = container.Resolve("audioScreenManager");
      var audioController = container.Resolve("audioController");
      
      audioScreenManager.execute({ 
        request: 'enterScreen', 
        data: 'legislative_council_candidate_vote_screen', 
        callback: audioController.enterBlindUiScreen
      });
      
      return;
    }    

    // At end of playing the complete intro sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var clips = [ ['switch_to_btl_warning_screen'], ['left_back_right_continue'] ];
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };
   
    var clips = [ ['switch_to_btl_warning_screen'], ['left_back_right_continue'] ];
    var instructions = new AudioInstructions(clips, true, true, callback1);

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  }
});