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
 * TvsLegislativeCouncilGroupAudioScreen - The audio screen class for the group council ballot for the TVS blind interface.
 * 
 * @author Peter Scheffer
 */

var TvsLegislativeCouncilGroupAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  // First time entering the screen.
  initialEntry: function () {    

    var container = getContainer();  
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('tvs_legislative_council_group_vote_screen');
    screenObject.setHasVisited(true);

    // At end of playing the complete intro sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var instructions = new AudioInstructions(['tvs_legislative_council_atl_navigation'], false, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var ballot = container.Resolve("atl");
    var group = ballot.getCurrentGroup();
    var unnamed = group.getIsUnnamed();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();
    var regionAudioFile = votingSession.getRegionAudioFile();

    var clips = [ ['tvs_legislative_council_ballot_for'],
                  [regionAudioFile],
                  ['you_need_to_vote_for'],
	              ['number_' + MIN_COUNCIL_GROUPS_REQUIRED],
                  ['group'],
                  ['for_your_vote_to_count'],
                  ['tvs_legislative_council_atl_navigation'], 
                  ['tvs_options_menu_press_zero'],
                  ['tvs_atl_to_btl_switch'],
                  ['you_are_in_a_list_of'],
                  ['number_' + maxCouncilGroups],
                  ['groups'],
                  ['you_are_currently_at_the'],
                  ['ordinal_' + (ballot.getCurrentGroupPosition())],
                  ['group'] ];

    // If this group is UNGROUPED candidates.
    if (group.getIsUngrouped()) {

      clips = clips.concat(['tvs_ungrouped_candidates_information']);

    // If this group doesn't have a ballot box but does have a name.
    } else if (!group.getHasBallotBox() && group.getName() != null && group.getName() != "") {
      
      clips = clips.concat(['group_has_no_ticket']);

    // If this group doesn't have a ballot box (effectively it has no group voting ticket).
    } else if (!group.getHasBallotBox()) {

      clips = clips.concat(['tvs_unnamed_group_information']);

    // Else this is a normal group.
    } else {

      var letter = group.getBallotBoxLetter();
      if (letter != null && letter != "") {
        clips = clips.concat(['group'], ['atl_' + letter]);
      }

      if (unnamed) {
        clips = clips.concat(['tvs_unnamed_group_information']);
      } else {
        clips = clips.concat([group.getAudioFileName()]);
      }
    }

    clips = clips.concat(['change_vote_later']);

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
    
      var instructions = new AudioInstructions(['tvs_legislative_council_atl_navigation'], false, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var ballot = container.Resolve("atl");
    var group = ballot.getCurrentGroup();
    var unnamed = group.getIsUnnamed();
    var selectionCount = ballot.getHighestSelection();

    var clips = [ ['you_are_back_legislative_council_ballot'],
                  ['you_need_to_vote_for'], 
	  	          ['number_' + MIN_COUNCIL_GROUPS_REQUIRED],
                  ['group'],
                  ['for_this_vote_to_be_counted'],
                  ['tvs_legislative_council_atl_navigation'],
                  ['tvs_options_menu_press_zero'] ];

    // If this group is UNGROUPED candidates.
    if (group.getIsUngrouped()) {

      clips = clips.concat(['tvs_ungrouped_candidates_information']);

    // If this group doesn't have a ballot box but does have a name.
    } else if (!group.getHasBallotBox() && group.getName() != null && group.getName() != "") {
      
      clips = clips.concat(['group_has_no_ticket']);

    // If this group doesn't have a ballot box (effectively it has no group voting ticket).
    } else if (!group.getHasBallotBox()) {

      clips = clips.concat(['tvs_unnamed_group_information']);

    // Else this is a normal group.
    } else {

      var letter = group.getBallotBoxLetter();
      if (letter != null && letter != "") {
        clips = clips.concat(['group'], ['atl_' + letter]);
      }

      if (unnamed) {
        clips = clips.concat(['tvs_unnamed_group_information']);
      } else {
        clips = clips.concat([group.getAudioFileName()]);
      }
    }                  

    var instructions = new AudioInstructions(clips, true, true, callback1);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },
  
  // Entering the screen after returning from the ballot summary screen.
  entryFromSummaryScreen: function () {

    var container = getContainer();
    var ballot = container.Resolve("atl");
    var group = ballot.getCurrentGroup();
    var unnamed = group.getIsUnnamed();

    // At end of playing the complete intro sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var instructions = new AudioInstructions(['tvs_legislative_council_atl_navigation'], false, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var selectionCount = ballot.getHighestSelection();

    var clips = [ ['legislative_council_return_from_summary'],
                  ['you_have_voted_for'], 
	  	          ['number_' + selectionCount],
                  ['group'],
                  ['you_need_to_vote_for'], 
	  	          ['number_' + MIN_COUNCIL_GROUPS_REQUIRED],
                  ['group'],
                  ['for_this_vote_to_be_counted'],
                  ['tvs_legislative_council_atl_navigation'],
                  ['tvs_options_menu_press_zero'] ];

    // If this group is UNGROUPED candidates.
    if (group.getIsUngrouped()) {

      clips = clips.concat(['tvs_ungrouped_candidates_information']);

    // If this group doesn't have a ballot box but does have a name.
    } else if (!group.getHasBallotBox() && group.getName() != null && group.getName() != "") {
      
      clips = clips.concat(['group_has_no_ticket']);

    // If this group doesn't have a ballot box (effectively it has no group voting ticket).
    } else if (!group.getHasBallotBox()) {

      clips = clips.concat(['tvs_unnamed_group_information']);

    // Else this is a normal group.
    } else {

      var letter = group.getBallotBoxLetter();
      if (letter != null && letter != "") {
        clips = clips.concat(['group'], ['atl_' + letter]);
      }

      if (unnamed) {
        clips = clips.concat(['tvs_unnamed_group_information']);
      } else {
        clips = clips.concat([group.getAudioFileName()]);
      }
    }

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
    
      var instructions = new AudioInstructions(['tvs_legislative_council_atl_context_help'], false, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var container = getContainer();
    var ballot = container.Resolve("atl");
    var group = ballot.getCurrentGroup();
    var unnamed = group.getIsUnnamed();
    var selectionCount = ballot.getHighestSelection();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();

    var clips = [ ['you_are_in_a_list_of'],
                  ['number_' + maxCouncilGroups],
                  ['groups'],
                  ['you_are_currently_at_the'],
                  ['ordinal_' + (ballot.getCurrentGroupPosition())],
                  ['group'],
                  ['you_have_voted_for'], 
                  ['number_' + selectionCount],
                  ['group'],
                  ['you_need_to_vote_for'], 
                  ['number_' + MIN_COUNCIL_GROUPS_REQUIRED],
                  ['group'],
                  ['for_this_vote_to_be_counted'],
                  ['tvs_legislative_council_atl_navigation'],
                  ['tvs_options_menu_press_zero'] ];

    // If this group is UNGROUPED candidates.
    if (group.getIsUngrouped()) {

      clips = clips.concat(['tvs_ungrouped_candidates_information']);

    // If this group doesn't have a ballot box but does have a name.
    } else if (!group.getHasBallotBox() && group.getName() != null && group.getName() != "") {
      
      clips = clips.concat(['group_has_no_ticket']);

    // If this group doesn't have a ballot box (effectively it has no group voting ticket).
    } else if (!group.getHasBallotBox()) {

      clips = clips.concat(['tvs_unnamed_group_information']);

    // Else this is a normal group.
    } else {

      var letter = group.getBallotBoxLetter();
      if (letter != null && letter != "") {
        clips = clips.concat(['group'], ['atl_' + letter]);
      }

      if (unnamed) {
        clips = clips.concat(['tvs_unnamed_group_information']);
      } else {
        clips = clips.concat([group.getAudioFileName()]);
      }
    }

    var instructions = new AudioInstructions(clips, true, true, callback1);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);  
  },
  
  // Move to another group. Explain if already selected.
  moveToGroup: function (group, error) {

    var container = getContainer();
    var ballot = container.Resolve("atl");
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();

    // At end of playing the complete context help sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };

      var clips = [ ['you_are_in_a_list_of'],
                    ['number_' + maxCouncilGroups],
                    ['groups'],
                    ['you_are_currently_at_the'],
                    ['ordinal_' + (ballot.getCurrentGroupPosition())],
                    ['group'],
                    ['tvs_legislative_council_atl_navigation'] ];

      // If this group is UNGROUPED candidates.
      if (group.getIsUngrouped()) {

        clips = clips.concat(['tvs_ungrouped_candidates_information']);

      // If this group doesn't have a ballot box but does have a name.
      } else if (!group.getHasBallotBox() && group.getName() != null && group.getName() != "") {
      
        clips = clips.concat(['group_has_no_ticket']);

      // If this group doesn't have a ballot box (effectively it has no group voting ticket).
      } else if (!group.getHasBallotBox()) {

        clips = clips.concat(['tvs_unnamed_group_information']);

      // Else this is a normal group.
      } else {

        var letter = group.getBallotBoxLetter();
        if (letter != null && letter != "") {
          clips = clips.concat(['group'], ['atl_' + letter]);
        }

        if (unnamed) {
          clips = clips.concat(['tvs_unnamed_group_information']);
        } else {
          clips = clips.concat([group.getAudioFileName()]);
        }
      }
                    
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    var audioController = container.Resolve("audioController");
    var ballot = container.Resolve("atl");
    var clips = new Array();

    if (error != null) {
      if (error.message == LAST_GROUP_EXCEPTION) {
        clips = clips.concat([ ['alert_bottom_of_list'], 
                               ['last_group_for_ballot'] ]);
      }

      if (error.message == FIRST_GROUP_EXCEPTION) {
        clips = clips.concat([ ['alert_top_of_list'], 
                               ['first_group_for_ballot'] ]);
      }

      if (group == null) {
        group = ballot.getCurrentGroup();
      }
    }

    var unnamed = group.getIsUnnamed();
    var groupIndex = ballot.getCurrentGroupPosition();

    // If the user has already selected this group, then preface their details with their preference number.
    if (ballot.isSelected(group)) {
      
      clips = clips.concat(['ordinal_' + ballot.getBallotSelectionNumber(group)], ['preference']);
      var letter = group.getBallotBoxLetter();
      if (letter != null && letter != "") {
        clips = clips.concat(['group'], ['atl_' + letter]);
      }
      clips = clips.concat([group.getAudioFileName()]);

    } else {

      // If this group is UNGROUPED candidates.
      if (group.getIsUngrouped()) {

        clips = clips.concat(['tvs_ungrouped_candidates_information']);

      // If this group doesn't have a ballot box but does have a name.
      } else if (!group.getHasBallotBox() && group.getName() != null && group.getName() != "") {
      
        clips = clips.concat(['group_has_no_ticket']);

      // If this group doesn't have a ballot box (effectively it has no group voting ticket).
      } else if (!group.getHasBallotBox()) {

        clips = clips.concat(['tvs_unnamed_group_information']);

      // Else this is a normal group.
      } else {

        var letter = group.getBallotBoxLetter();
        if (letter != null && letter != "") {
          clips = clips.concat(['group'], ['atl_' + letter]);
        }

        if (unnamed) {
          clips = clips.concat(['tvs_unnamed_group_information']);
        } else {
          clips = clips.concat([group.getAudioFileName()]);
        }
      }
    }

    var instructions = new AudioInstructions(clips, true, true, callback1);
    audioController.playAudioInstructions(instructions);
  },

  // Select the current group that has been navigated to.
  selectCurrentGroup: function (group, error) {
  
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var ballot = container.Resolve("atl");
    var group = ballot.getCurrentGroup();
    var unnamed = group.getIsUnnamed();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();

    // At end of playing the complete context help sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };

      var container = getContainer();
      var ballot = container.Resolve("atl");
      var group = ballot.getCurrentGroup();
      var unnamed = group.getIsUnnamed();

      var clips = [ ['you_are_in_a_list_of'],
                    ['number_' + maxCouncilGroups],
                    ['groups'],
                    ['you_are_currently_at_the'],
                    ['ordinal_' + (ballot.getCurrentGroupPosition())],
                    ['group'],
                    ['tvs_legislative_council_atl_navigation'] ];

      if (unnamed) {
        clips = clips.concat(['tvs_unnamed_group_information']);
      } else {
        clips = clips.concat([group.getAudioFileName()]);
      }
                    
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };

    if (ballot.getSelection() != null && ballot.getSelection() != group) {
      var clips = [ ['maximum_number_of_groups'],
                    ['you_are_in_a_list_of'],
                    ['number_' + maxCouncilGroups],
                    ['groups'],
                    ['you_are_currently_at_the'],
                    ['ordinal_' + (ballot.getCurrentGroupPosition())],
                    ['group'],
                    ['tvs_legislative_council_atl_navigation'] ];

      if (unnamed) {
        clips = clips.concat(['tvs_unnamed_group_information']);
      } else {
        clips = clips.concat([group.getAudioFileName()]);
      }
                    
      var instructions = new AudioInstructions(clips, true, true, callback1);
      audioController.playAudioInstructions(instructions);
      return;
    }
    
    if (ballot.getType() != LEGISLATIVE_COUNCIL_GROUP_BALLOT) {
      throw UNRECOGNISED_BALLOT;
    }

    // If this group is UNGROUPED candidates.
    if (group.getIsUngrouped()) {

      clips = [ ['tvs_ungrouped_candidates_information'] ];

    // If this group doesn't have a ballot box (effectively it has no group voting ticket).
    } else if (!group.getHasBallotBox()) {

      clips = [ ['tvs_unnamed_group_information'] ];

    } else if (unnamed) {

      clips = clips.concat(['tvs_unnamed_group_information']);

    // Else this is a normal group.
    } else {

      if (ballot.isSelected(group)) {
        clips = [ ['preference_number'], 
                  ['number_1'], 
                  [group.getAudioFileName()],
                  ['atl_selected_all_candidates'], 
                  ['tvs_move_to_summary_confirmation'] ];

      } else {

        clips = [ ['removed_selection_for'], 
                  [group.getAudioFileName()], 
                  ['you_have_made'], 
                  ['number_0'], 
                  ['preference_selections'] ];
      }
    }

    var instructions = new AudioInstructions(clips, true, true, callback1);
    audioController.playAudioInstructions(instructions);
  }
});