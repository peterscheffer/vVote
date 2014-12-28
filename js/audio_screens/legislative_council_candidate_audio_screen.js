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
 * LegislativeCouncilCandidateAudioScreen - The audio screen class for the candidate council ballot for the blind interface.
 * 
 * @author Peter Scheffer
 */

var LegislativeCouncilCandidateAudioScreen = AudioScreen.extend({  
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
    
      var instructions = new AudioInstructions(['legislative_council_btl_gestures'], true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var ballot = container.Resolve("btl");
    var candidate = ballot.getCurrentCandidate();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();
    var regionAudioFile = votingSession.getRegionAudioFile();

    var clips = [ ['legislative_council_ballot_for'],
                  [regionAudioFile],
                  ['you_need_to_vote_for'],
	              ['number_' + MIN_COUNCIL_CANDIDATES_REQUIRED],
                  ['candidates'],
                  ['for_your_vote_to_count'],
                  ['legislative_council_btl_gestures'], 
                  ['btl_to_atl_switch'],
                  ['you_are_in_a_list_of'],
                  ['number_' + maxCouncilGroups],
                  ['groups'],
                  ['you_are_currently_at_the'],
                  ['ordinal_' + (ballot.getCurrentGroupPosition())],
                  ['group'],
                  ['and_on_the'],
                  ['ordinal_' + (ballot.getCurrentCandidatePosition() + 1)],
                  ['candidate'] ];

    var currentGroup = ballot.getCurrentGroup();
    var unnamed = currentGroup.getIsUnnamed();
    var letter = currentGroup.getBallotBoxLetter();
    if (letter != null && letter != "") {
      clips = clips.concat(['group'], ['atl_' + letter]);
    }
    
    if (currentGroup.getName() == null || currentGroup.getName() == "" || unnamed) {
      clips = clips.concat(['unnamed_group']);
    } else {
      clips = clips.concat([currentGroup.getAudioFileName()]);
    }
    
    clips = clips.concat([ [candidate.getAudioFileName()], 
                           ['change_vote_later'],
                           ['press_three_fingers_for_options_menu'] ]);

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
    
      var instructions = new AudioInstructions(['legislative_council_btl_gestures'], true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var ballot = container.Resolve("btl");
    var candidate = ballot.getCurrentCandidate();
    var selectionCount = ballot.getHighestSelection();

    var clips = [ ['you_are_back_legislative_council_ballot'],
                  ['you_have_voted_for'], 
	  	          ['number_' + selectionCount],
                  ['candidates'],
                  ['you_need_to_vote_for'], 
	  	          ['number_' + MIN_COUNCIL_CANDIDATES_REQUIRED],
                  ['candidates'],
                  ['for_this_vote_to_be_counted'],
                  ['legislative_council_btl_gestures'] ];
                  
    var currentGroup = ballot.getCurrentGroup();
    var unnamed = currentGroup.getIsUnnamed();
    var letter = currentGroup.getBallotBoxLetter();
    if (letter != null && letter != "") {
      clips = clips.concat(['group'], ['atl_' + letter]);
    }

    if (currentGroup.getName() == null || currentGroup.getName() == "" || unnamed) {
      clips = clips.concat(['unnamed_group']);
    } else {
      clips = clips.concat([currentGroup.getAudioFileName()]);
    }

    clips = clips.concat([ [candidate.getAudioFileName()],
                           ['press_three_fingers_for_options_menu'] ]);

    var instructions = new AudioInstructions(clips, true, true, callback1);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },
  
  // Entering the screen after returning from the ballot summary screen.
  entryFromSummaryScreen: function () {

    var container = getContainer();
    var ballot = container.Resolve("btl");

    // At end of playing the complete intro sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var instructions = new AudioInstructions(['legislative_council_btl_gestures'], true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var candidate = ballot.getCurrentCandidate();
    var selectionCount = ballot.getHighestSelection();

    var clips = [ ['legislative_council_return_from_summary'],
                  ['you_have_voted_for'], 
	  	          ['number_' + selectionCount],
                  ['candidates'],
                  ['you_need_to_vote_for'], 
	  	          ['number_' + MIN_COUNCIL_CANDIDATES_REQUIRED],
                  ['candidates'],
                  ['for_this_vote_to_be_counted'],
                  ['legislative_council_btl_gestures'],
                  [candidate.getAudioFileName()],
                  ['press_three_fingers_for_options_menu'] ];

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
    
      var instructions = new AudioInstructions(['legislative_council_btl_gestures'], true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var ballot = container.Resolve("btl");
    var candidate = ballot.getCurrentCandidate();
    var selectionCount = ballot.getHighestSelection();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();

    var clips = [ ['you_are_in_a_list_of'],
                  ['number_' + maxCouncilCandidates],
                  ['candidates'],
                  ['you_are_currently_at_the'],
                  ['ordinal_' + (ballot.getCurrentGroupPosition())],
                  ['group'],
                  ['and_on_the'],
                  ['ordinal_' + (ballot.getCurrentCandidatePosition() + 1)],
                  ['candidate'],
                  ['you_have_voted_for'], 
                  ['number_' + selectionCount],
                  ['candidates'],
                  ['you_need_to_vote_for'], 
                  ['number_' + MIN_COUNCIL_CANDIDATES_REQUIRED],
                  ['candidates'],
                  ['for_this_vote_to_be_counted'],
                  ['legislative_council_btl_gestures'],
                  [candidate.getAudioFileName()] ];

    var instructions = new AudioInstructions(clips, true, true, callback1);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);  
  },
  
  // Move to another group. Explain if already selected.
  moveToCandidate: function (candidate, error) {

    var container = getContainer();
    var ballot = container.Resolve("btl");
    var audioController = container.Resolve("audioController");
    var currentCandidate = ballot.getCurrentCandidate();
    var currentGroup = ballot.getCurrentGroup();
    var unnamed = currentGroup.getIsUnnamed();

    // At end of playing the complete context help sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };

      var container = getContainer();
      var votingSession = container.Resolve("votingSession");
      var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();

      var currentCandidate = ballot.getCurrentCandidate();
      var clips = [ ['you_are_in_a_list_of'],
                    ['number_' + maxCouncilCandidates],
                    ['candidates'],
                    ['you_are_currently_at_the'],
                    ['ordinal_' + (ballot.getCurrentGroupPosition())],
                    ['group'],
                    ['and_on_the'],
                    ['ordinal_' + (ballot.getCurrentCandidatePosition() + 1)],
                    ['candidate'],
                    ['legislative_council_btl_gestures'],
                    [currentCandidate.getAudioFileName()] ];

      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var clips = new Array();

    if (error != null) {
      if (error.message == LAST_GROUP_EXCEPTION) {
        
        var clips = [ ['alert_right_of_list'], 
                      ['last_group_for_ballot'] ];
        
        if (currentGroup.getName() == null || currentGroup.getName() == "" || unnamed) {
          clips = clips.concat(['unnamed_group']);
        } else {
          clips = clips.concat([currentGroup.getAudioFileName()]);
        }
        
        var instructions = new AudioInstructions(clips, false, true, callback1);
        audioController.playAudioInstructions(instructions);
        return;
      }

      if (error.message == FIRST_GROUP_EXCEPTION) {
        var currentGroup = ballot.getCurrentGroup();
        var clips = [ ['alert_left_of_list'], 
                      ['first_group_for_ballot'] ];

        if (currentGroup.getName() == null || currentGroup.getName() == "" || unnamed) {
          clips = clips.concat(['unnamed_group']);
        } else {
          clips = clips.concat([currentGroup.getAudioFileName()]);
        }

        var instructions = new AudioInstructions(clips, false, true, callback1);
        audioController.playAudioInstructions(instructions);
        return;
      }

      if (error.message == LAST_CANDIDATE_EXCEPTION) {
        clips = clips.concat([ ['alert_bottom_of_list'], 
                               ['last_candidate_in_group'] ]);
      }

      if (error.message == FIRST_CANDIDATE_EXCEPTION) {
        clips = clips.concat([ ['alert_top_of_list'], 
                               ['first_candidate_in_group'] ]);
      }

      if (candidate == null) {
        candidate = ballot.getCurrentCandidate();
      }
    }

    var ballotManager = container.Resolve("ballotManager");
    var groupChanged = ballotManager.groupHasChanged();
    var groupIndex = ballot.getCurrentGroupPosition();
    var currentGroup = ballot.getCurrentGroup();
    var unnamed = currentGroup.getIsUnnamed();
      
    if (groupChanged) {
      var letter = currentGroup.getBallotBoxLetter();
      if (letter != null && letter != "") {
        clips = clips.concat(['group'], ['atl_' + letter]);
      }

      if (currentGroup.getName() == null || currentGroup.getName() == "" || unnamed) {
        clips = clips.concat(['unnamed_group']);
      } else {
        clips = clips.concat([currentGroup.getAudioFileName()]);
      }
    }

    // If the user has already selected this candidate, then include their preference number.
    if (ballot.isSelected(candidate)) {
      clips = clips.concat(['ordinal_' + ballot.getBallotSelectionNumber(candidate)],
                           ['preference'],
                           [candidate.getAudioFileName()]);
    } else {
      clips = clips.concat([candidate.getAudioFileName()]);
    }

    var instructions = new AudioInstructions(clips, false, true, callback1);
    audioController.playAudioInstructions(instructions);
  },

  // Select the current candidate that has been navigated to.
  selectCurrentCandidate: function (candidate, error) {
  
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var ballot = container.Resolve("btl");

    // At end of playing the complete context help sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };

      var container = getContainer();
      var votingSession = container.Resolve("votingSession");
      var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();

      var currentCandidate = ballot.getCurrentCandidate();
      var clips = [ ['you_are_in_a_list_of'],
                    ['number_' + maxCouncilCandidates],
                    ['candidates'],
                    ['you_are_currently_at_the'],
                    ['ordinal_' + (ballot.getCurrentGroupPosition())],
                    ['group'],
                    ['and_on_the'],
                    ['ordinal_' + (ballot.getCurrentCandidatePosition() + 1)],
                    ['candidate'],
                    ['legislative_council_btl_gestures'],
                    [currentCandidate.getAudioFileName()] ];
                    
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

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
                    [candidate.getAudioFileName()] ];

      if (ballot.getHighestSelection() == MIN_COUNCIL_CANDIDATES_REQUIRED) {
        clips = clips.concat([ ['btl_selected_all_candidates'], ['move_to_summary_confirmation'] ]);
      }

      var instructions = new AudioInstructions(clips, true, true, callback1);
      audioController.playAudioInstructions(instructions);

    } else {

      var clips = [ ['removed_selection_for'], 
                    [candidate.getAudioFileName()], 
                    ['you_have_made'], 
                    ['number_' + ballot.getHighestSelection()], 
                    ['preference_selections'] ];
                    
      var instructions = new AudioInstructions(clips, true, true, callback1);
      audioController.playAudioInstructions(instructions);
    }
  }
});