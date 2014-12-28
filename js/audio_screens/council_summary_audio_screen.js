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
 * CouncilSummaryAudioScreen - The audio screen class for the council summary confirmation for the blind interface.
 *
 * If you change the number of audio clips in a segment, then you also need to update audioController.skipToNextCouncilSegment
 * 
 * @author Peter Scheffer
 */

var CouncilSummaryAudioScreen = AudioScreen.extend({  
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
    var audioScreenManager = container.Resolve("audioScreenManager");
    var aboveOrBelow = audioScreenManager.getUserVotedAboveOrBelowTheLine();
    var audioController = container.Resolve("audioController");
    var belowTheLineCouncilBallot = container.Resolve("btl");
    var aboveTheLineCouncilBallot = container.Resolve("atl");

    var clips = new Array();

    if (!aboveTheLineCouncilBallot.getVisited() && !belowTheLineCouncilBallot.getVisited()) {
      var clips = [ ['have_not_voted_in_council'], 
                    ['this_vote_will_not_be_counted'], 
                    ['warning_user_cant_make_changes'],
                    ['continue_to_printing'], 
                    ['swipe_up_repeat_summary'] ];
      var instructions = new AudioInstructions(clips, true, true, callback1);
      audioController.playAudioInstructions(instructions);
      return;
    }
   
    if (aboveOrBelow == "above") {
      var selectedGroup = aboveTheLineCouncilBallot.getSelection();        
      if (selectedGroup != null) {            
        clips = clips.concat(['legislative_council_group_summary'], 
                 ['this_vote_will_be_counted'], 
                 ['swipe_down_skip_ahead'],
                 ['swipe_up_repeat_summary'],
                 ['you_have_voted_for'], 
                 ['number_1'], 
                 ['group'], 
                 ['preference_number'], 
                 ['number_1'], 
                 [selectedGroup.getAudioFileName()], 
                 ['warning_user_cant_make_changes'],
                 ['continue_to_printing'], 
                 ['swipe_up_repeat_summary']);
        var instructions = new AudioInstructions(clips, true, true, callback1);
        audioController.playAudioInstructions(instructions);
        return;

      } else {
        clips = clips.concat(['legislative_council_group_summary'], 
                 ['this_vote_will_not_be_counted'], 
                 ['you_have_voted_for'], 
                 ['number_0'], 
                 ['groups'], 
                 ['warning_user_cant_make_changes'],
                 ['continue_to_printing'], 
                 ['swipe_up_repeat_summary']);

        var instructions = new AudioInstructions(clips, true, true, callback1);
        audioController.playAudioInstructions(instructions);
        return;
      }
    } else if (aboveOrBelow == "below") {
      var selectionCount = belowTheLineCouncilBallot.getHighestSelection();
      if (selectionCount == 0) {
        clips = clips.concat(['legislative_council_candidate_summary'], 
                 ['this_vote_will_not_be_counted'],
                 ['make_changes_to_ballot'], 
                 ['you_have_voted_for'], 
                 ['number_0'], 
                 ['candidates'], 
                 ['warning_user_cant_make_changes'],
                 ['continue_to_printing'], 
                 ['swipe_up_repeat_summary']);

        var instructions = new AudioInstructions(clips, true, true, callback1);
        audioController.playAudioInstructions(instructions);
        return;
      }

      clips = clips.concat(['legislative_council_candidate_summary']); 
      
      if (selectionCount < MIN_COUNCIL_CANDIDATES_REQUIRED) {
        clips = clips.concat(['this_vote_will_not_be_counted']);
      } else {
        clips = clips.concat(['this_vote_will_be_counted']);
      }
      
      clips = clips.concat(['swipe_down_skip_ahead'],
                           ['swipe_up_repeat_summary'],
                           ['you_have_voted_for'], 
                           ['number_' + selectionCount], 
                           ['candidates']);      

      var preferenceOrderList = belowTheLineCouncilBallot.getPreferenceOrderList();
      for (var index = 0; index < preferenceOrderList.length; index++) {
        var selection = preferenceOrderList[index];
        if (selection == null || !selection.getBallotBoxId()) {
          continue;
        }

        clips = clips.concat(['preference_number'], 
                             ['number_' + (index+1)], 
                             [selection.getAudioFileName()]);
      }
    } else {
      throw UNRECOGNISED_BALLOT;
    }

    clips = clips.concat(['warning_user_cant_make_changes'], ['continue_to_printing'] , ['swipe_up_repeat_summary']);

    if (clips != null && clips.length > 0) {
      var instructions = new AudioInstructions(clips, true, true, callback1);
      audioController.playAudioInstructions(instructions);
    }
  }
});