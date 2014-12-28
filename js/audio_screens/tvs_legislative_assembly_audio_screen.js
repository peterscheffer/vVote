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
 * TvsLegislativeAssemblyAudioScreen - The audio screen class for the legislative assembly for the TVS blind interface.
 * 
 * @author Peter Scheffer
 */

var TvsLegislativeAssemblyAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  // First time entering the screen.
  initialEntry: function () {

    // At end of playing the complete intro sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var instructions = new AudioInstructions(['tvs_legislative_assembly_navigation'], true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var ballot = container.Resolve("assembly");
    var candidate = ballot.getCurrentCandidate();
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();

    var clips = [ ['legislative_assembly_screen_initial'],
		          ['number_' + maxAssemblyCandidatesRequired],
                  ['candidates'],
                  ['for_your_vote_to_count'],
                  ['tvs_legislative_assembly_navigation'], 
                  ['tvs_options_menu_press_zero'],
                  ['you_are_in_a_list_of'],
                  ['number_' + maxAssemblyCandidatesRequired],
                  ['candidates'],
                  ['you_are_currently_at_the'],
                  ['ordinal_' + (ballot.getCurrentCandidatePosition() + 1)],
                  ['candidate'],
                  [candidate.getAudioFileName()],
                  ['change_vote_later'] ];

    var instructions = new AudioInstructions(clips, true, true, callback1);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },
  
  // Entering the screen after receiving the informal vote warning.
  entryFromInformalWarningScreen: function () {

    // At end of playing the complete intro sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var instructions = new AudioInstructions(['tvs_legislative_assembly_navigation'], true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var ballot = container.Resolve("assembly");
    var selectionCount = ballot.getHighestSelection();
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();

    var clips = [ ['legislative_assembly_return_from_summary'] ];

    var candidate = ballot.getCurrentCandidate();
    
    if (ballot.isSelected(candidate)) {
      clips = clips.concat([ ['ordinal_' + ballot.getBallotSelectionNumber(candidate)],
                             ['preference'],
                             [candidate.getAudioFileName()] ]);
    } else {
      clips = clips.concat([ [candidate.getAudioFileName()] ]);
    }
    
    clips = clips.concat([ ['you_have_voted_for'], 
		                   ['number_' + selectionCount],
                           ['candidates'],
                           ['you_need_to_vote_for'], 
		                   ['number_' + maxAssemblyCandidatesRequired],
                           ['candidates'],
                           ['for_this_vote_to_be_counted'],
                           ['tvs_legislative_assembly_navigation'],
                           ['tvs_options_menu_press_zero'],
                           [candidate.getAudioFileName()] ]);

    var instructions = new AudioInstructions(clips, true, true, callback1);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },
  
  // Entering the screen after returning from the ballot summary screen.
  entryFromSummaryScreen: function () {

    var container = getContainer();
    var ballot = container.Resolve("assembly");
    var candidate = ballot.getCurrentCandidate();
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();

    // At end of playing the complete intro sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var instructions = new AudioInstructions(['tvs_legislative_assembly_navigation'], true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var selectionCount = ballot.getHighestSelection();
    var clips = [ ['legislative_assembly_return_from_summary'],
                  ['you_have_voted_for'], 
		          ['number_' + selectionCount],
                  ['candidates'],
                  ['you_need_to_vote_for'], 
		          ['number_' + maxAssemblyCandidatesRequired],
                  ['candidates'],
                  ['for_this_vote_to_be_counted'],
                  ['tvs_legislative_assembly_navigation'],
                  ['tvs_options_menu_press_zero'],
                  [candidate.getAudioFileName()] ];

    var instructions = new AudioInstructions(clips, true, true, callback1);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },

  // Play contextual help.
  playContextHelp: function (response, error) {

    // At end of playing the complete context help sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var instructions = new AudioInstructions(['tvs_legislative_assembly_navigation'], true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var ballot = container.Resolve("assembly");
    var candidate = ballot.getCurrentCandidate();
    var selectionCount = ballot.getHighestSelection();
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();

    var clips = [ ['you_are_in_a_list_of'],
                  ['number_' + maxAssemblyCandidatesRequired],
                  ['candidates'],
                  ['you_are_currently_at_the'],
                  ['ordinal_' + (ballot.getCurrentCandidatePosition() + 1)],
                  ['candidate'],
                  ['you_have_voted_for'], 
                  ['number_' + selectionCount],
                  ['candidates'],
                  ['you_need_to_vote_for'], 
                  ['number_' + maxAssemblyCandidatesRequired],
                  ['candidates'],
                  ['for_this_vote_to_be_counted'],
                  ['tvs_legislative_assembly_navigation'],
                  ['tvs_options_menu_press_zero'],
                  [candidate.getAudioFileName()] ];

    var instructions = new AudioInstructions(clips, true, true, callback1);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);  
  },
  
  // Move to another candidate in the list. Explain if already selected. Warn if at either end of the list.
  moveToCandidate: function (candidate, error) {

    var container = getContainer();
    var ballot = container.Resolve("assembly");

    // At end of playing the complete context help sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    	
      var container = getContainer();
      var ballot = container.Resolve("assembly");
      var candidate = ballot.getCurrentCandidate();
      var votingSession = container.Resolve("votingSession");
      var maxAssemblyCandidates = votingSession.getMaximumNumberOfAssemblyCandidates();
    	
      var clips = [ ['you_are_in_a_list_of'],
                    ['number_' + maxAssemblyCandidates],
                    ['candidates'],
                    ['you_are_currently_at_the'],
                    ['ordinal_' + (ballot.getCurrentCandidatePosition() + 1)],
                    ['candidate'],
                    ['tvs_legislative_assembly_navigation'],
                    [candidate.getAudioFileName()] ];
                    
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };
    
    var audioController = container.Resolve("audioController");
    var ballot = container.Resolve("assembly");
    
    var clips = new Array();

    if (error != null) {
      if (error.message == LAST_CANDIDATE_EXCEPTION) {
        clips = clips.concat([ ['alert_bottom_of_list'], 
                               ['last_candidate_in_ballot'] ]);
      }

      if (error.message == FIRST_CANDIDATE_EXCEPTION) {
        clips = clips.concat([ ['alert_top_of_list'], 
                               ['first_candidate_in_ballot'] ]);
      }

      if (candidate == null) {
        candidate = ballot.getCurrentCandidate();
      }
    }

    // If the user has already selected this candidate, then preface their details with their preference number.
    if (ballot.isSelected(candidate)) {
      clips = clips.concat([ ['ordinal_' + ballot.getBallotSelectionNumber(candidate)],
                             ['preference'],
                             [candidate.getAudioFileName()] ]);
    } else {
      clips = clips.concat([ [candidate.getAudioFileName()] ]);
    }

    var instructions = new AudioInstructions(clips, true, true, callback1);
    audioController.playAudioInstructions(instructions);
  },

  // Select the current candidate that has been navigated to.  If already selected, unselect the candidate.
  selectCurrentCandidate: function (candidate, error) {

    var container = getContainer();
    var ballot = container.Resolve("assembly");

    // At end of playing the complete context help sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };

      var container = getContainer();
      var ballot = container.Resolve("assembly");
      var candidate = ballot.getCurrentCandidate();
      var votingSession = container.Resolve("votingSession");
      var maxAssemblyCandidates = votingSession.getMaximumNumberOfAssemblyCandidates();

      var clips = [ ['you_are_in_a_list_of'],
                    ['number_' + maxAssemblyCandidates],
                    ['candidates'],
                    ['you_are_currently_at_the'],
                    ['ordinal_' + (ballot.getCurrentCandidatePosition() + 1)],
                    ['candidate'],
                    ['tvs_legislative_assembly_navigation'],
                    [candidate.getAudioFileName()] ];
                    
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };
    
    var audioController = container.Resolve("audioController");
    var ballot = container.Resolve("assembly");
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();

    if (error != null) {
      if (error.message == CANDIDATE_ALREADY_SELECTED) {
        var instructions = new AudioInstructions(['candidate_already_selected'], true, true, callback1);
        audioController.playAudioInstructions(instructions);
        return;
      }
    }

    if (ballot.isSelected(candidate)) {
      var clips = [ ['preference_number'], 
                    ['number_' + ballot.getBallotSelectionNumber(candidate)], 
                    [candidate.getAudioFileName()], 
                    ['you_have_made'], 
                    ['number_' + ballot.getHighestSelection()], 
                    ['preference_selections'] ];

      if (ballot.getHighestSelection() == maxAssemblyCandidatesRequired) {
        clips = clips.concat([ ['legislative_assembly_selected_all'] ]);
      }

      var instructions = new AudioInstructions(clips, true, true, callback1);
      audioController.playAudioInstructions(instructions);
      
    } else {
    
      var instructions = new AudioInstructions([['removed_selection_for'], 
                [candidate.getAudioFileName()], 
                ['you_have_made'], 
                ['number_' + ballot.getHighestSelection()], 
                ['preference_selections']], true, true, callback1);
      audioController.playAudioInstructions(instructions);
    }
  }
});