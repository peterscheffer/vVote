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
 * AssemblySummaryAudioScreen - The audio screen class for the assembly summary confirmation for the blind interface.
 *
 * If you change the number of audio clips in a segment, then you also need to update audioController.skipToNextAssemblySegment
 * 
 * @author Peter Scheffer
 */

var AssemblySummaryAudioScreen = AudioScreen.extend({  
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
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();

    var clips = new Array();
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var preferenceOrderList = legislativeAssemblyBallot.getPreferenceOrderList();

    if (preferenceOrderList.length == 0) {
      clips = clips.concat(['legislative_assembly_ballot_summary']);

      var votingSession = container.Resolve("votingSession");
      var audioController = container.Resolve("audioController");
      var isUncontested = votingSession.getRegionIsUncontested();
      if (isUncontested) {
        clips = clips.concat(['continue_to_printing']);
      } else {    
        clips = clips.concat(['continue_to_council_summary']);
      }
      
      clips = clips.concat(['this_vote_will_not_be_counted'],
                           ['you_have_voted_for'], 
                           ['number_0'], 
                           ['candidates']);

      var instructions = new AudioInstructions(clips, true, true, callback1);
      audioController.playAudioInstructions(instructions);
      return;
    }

    clips = clips.concat(['legislative_assembly_ballot_summary']);

    var votingSession = container.Resolve("votingSession");
    var audioController = container.Resolve("audioController");
    var isUncontested = votingSession.getRegionIsUncontested();
    if (isUncontested) {
      clips = clips.concat(['continue_to_printing']);
    } else {    
      clips = clips.concat(['continue_to_council_summary']);
    }

    var selectionCount = legislativeAssemblyBallot.getHighestSelection();
    clips = clips.concat(['have_voted_in_assembly']);

    if (selectionCount < maxAssemblyCandidatesRequired) {
      clips = clips.concat(['this_vote_will_not_be_counted']);
    } else {
      clips = clips.concat(['this_vote_will_be_counted']);
    }

    clips = clips.concat(['you_have_voted_for'], 
                         ['number_' + selectionCount], 
                         ['candidates']);
    
    clips = clips.concat(['swipe_down_skip_ahead'],
                         ['swipe_up_repeat_summary']);

    for (var index = 0; index < preferenceOrderList.length; index++) {
      var selection = preferenceOrderList[index];
      if (selection == null || !selection.getAudioFileName()) {
        continue;
      }

      clips = clips.concat(['preference_number'], 
                           ['number_' + (index+1)], 
                           [selection.getAudioFileName()]);
    }
    
    clips = clips.concat(['continue_to_council_summary'], ['swipe_up_repeat_summary']);

    if (clips != null && clips.length > 0) {
      var instructions = new AudioInstructions(clips, true, true, callback1);
      audioController.playAudioInstructions(instructions);
    }
  }
});