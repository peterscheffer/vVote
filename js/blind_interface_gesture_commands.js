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
 * The non-visual interface of the vVote application is driven by commands that are mapped onto specific user behaviour.
 * In this listing, commands are mapped onto gesture triggers created by hand gestures made on the touch screen interface.
 * 
 * @author Peter Scheffer
 */

var BlindInterfaceGestureNavigation = Class.extend({
  getCommand: function (screen, gesture) {
    if (!gvsMode) {
      return;
    }
    var command = this.blindInterfaceCommands[screen][gesture];
    return command;
  },
  
  init: function () {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var optionsManager = container.Resolve("optionsManager");    
    var ballotManager = container.Resolve("ballotManager");    
    var audioScreenManager = container.Resolve("audioScreenManager");    
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var belowTheLineCouncilBallot = container.Resolve("btl");
    var visualController = container.Resolve("visualController");
    var visualScreenManager = container.Resolve("visualScreenManager");

    this.blindInterfaceCommands = 
    { 
      audio_start_screen : 
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'enterScreen', data: 'practice_screen', callback: audioController.enterBlindUiScreen },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_left                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_5', callback: audioController.unavailableOption },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_6', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      practice_screen : 
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'practice', data: 'practice_single_finger_press_hold', callback: audioController.playPractice },
        two_finger_hold           : { manager: audioScreenManager, request: 'practice', data: 'practice_double_finger_press_hold', callback: audioController.playPractice },
        three_finger_hold         : { manager: audioScreenManager, request: 'practice', data: 'practice_three_finger_press_hold', callback: audioController.playPractice },
        four_finger_hold          : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_assembly_candidate_vote_screen', callback: audioController.enterBlindUiScreen },
        swipe_right               : { manager: audioScreenManager, request: 'practice', data: 'practice_swipe_right', callback: audioController.playPractice },
        swipe_left                : { manager: audioScreenManager, request: 'practice', data: 'practice_swipe_left', callback: audioController.playPractice },
        swipe_up                  : { manager: audioScreenManager, request: 'practice', data: 'practice_swipe_up', callback: audioController.playPractice },
        swipe_down                : { manager: audioScreenManager, request: 'practice', data: 'practice_swipe_down', callback: audioController.playPractice },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'practice', data: 'practice_single_finger_double_tap', callback: audioController.playPractice }
      },
      
      free_practice_screen : 
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'freePractice', data: 'gesture_1', callback: audioController.freePlayPractice },
        two_finger_hold           : { manager: audioScreenManager, request: 'freePractice', data: 'gesture_2', callback: audioController.freePlayPractice },
        three_finger_hold         : { manager: audioScreenManager, request: 'freePractice', data: 'gesture_9', callback: audioController.freePlayPractice },
        four_finger_hold          : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_assembly_candidate_vote_screen', callback: audioController.enterBlindUiScreen },
        swipe_right               : { manager: audioScreenManager, request: 'freePractice', data: 'gesture_4', callback: audioController.freePlayPractice },
        swipe_left                : { manager: audioScreenManager, request: 'freePractice', data: 'gesture_5', callback: audioController.freePlayPractice },
        swipe_up                  : { manager: audioScreenManager, request: 'freePractice', data: 'gesture_6', callback: audioController.freePlayPractice },
        swipe_down                : { manager: audioScreenManager, request: 'freePractice', data: 'gesture_7', callback: audioController.freePlayPractice },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'freePractice', data: 'gesture_8', callback: audioController.freePlayPractice }
      },
      
      legislative_assembly_candidate_vote_screen : 
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'playContextHelp', data: legislativeAssemblyBallot, callback: audioController.playContextHelp },
        two_finger_hold           : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen },
        three_finger_hold         : { manager: audioScreenManager, request: 'enterScreen', data: 'ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_left                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_5', callback: audioController.unavailableOption },
        swipe_up                  : { manager: ballotManager, request: 'moveToPreviousCandidate', data: legislativeAssemblyBallot, callback: audioController.moveToCandidate },
        swipe_down                : { manager: ballotManager, request: 'moveToNextCandidate', data: legislativeAssemblyBallot, callback: audioController.moveToCandidate },
        single_finger_double_tap  : { manager: ballotManager, request: 'selectCandidate', data: legislativeAssemblyBallot, callback: audioController.selectCurrentCandidate },
      },
      
      uncontested_legislative_assembly_candidate_vote_screen : 
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_left                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_5', callback: audioController.unavailableOption },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_6', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption },
      },
      
      incomplete_assembly_warning :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_assembly_candidate_vote_screen', callback: audioController.entryFromInformalWarningScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_6', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      legislative_council_group_vote_screen : 
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'playContextHelp', data: aboveTheLineCouncilBallot, callback: audioController.playContextHelp },
        two_finger_hold           : { manager: audioScreenManager, request: 'enterScreen', data: 'confirm_assembly_votes_screen', callback: audioController.enterBlindUiScreen },
        three_finger_hold         : { manager: audioScreenManager, request: 'enterScreen', data: 'ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        four_finger_hold          : { manager: audioScreenManager, request: 'enterScreen', data: 'switch_to_btl_warning_screen', callback: audioController.enterBlindUiScreen },
        swipe_right               : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_left                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_5', callback: audioController.unavailableOption },
        swipe_up                  : { manager: ballotManager, request: 'moveToPreviousGroup', data: aboveTheLineCouncilBallot, callback: audioController.moveToGroup },
        swipe_down                : { manager: ballotManager, request: 'moveToNextGroup', data: aboveTheLineCouncilBallot, callback: audioController.moveToGroup },
        single_finger_double_tap  : { manager: ballotManager, request: 'selectCandidate', data: aboveTheLineCouncilBallot, callback: audioController.selectCurrentGroup },
      },
      
      informal_council_atl_warning :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'enterScreen', data: 'confirm_assembly_votes_screen', callback: audioController.playAssemblyBallotSummary },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_group_vote_screen', callback: audioController.entryFromInformalWarningScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_6', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      switch_to_btl_warning_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_candidate_vote_screen', callback: audioController.enterBlindUiScreen },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_6', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      legislative_council_candidate_vote_screen : 
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'playContextHelp', data: belowTheLineCouncilBallot, callback: audioController.playContextHelp },
        two_finger_hold           : { manager: audioScreenManager, request: 'enterScreen', data: 'confirm_assembly_votes_screen', callback: audioController.playAssemblyBallotSummary },
        three_finger_hold         : { manager: audioScreenManager, request: 'enterScreen', data: 'ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        four_finger_hold          : { manager: audioScreenManager, request: 'enterScreen', data: 'switch_to_atl_warning_screen', callback: audioController.enterBlindUiScreen },
        swipe_right               : { manager: ballotManager, request: 'moveToNextGroupCandidate', data: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        swipe_left                : { manager: ballotManager, request: 'moveToPreviousGroupCandidate', data: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        swipe_up                  : { manager: ballotManager, request: 'moveToPreviousCandidate', data: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        swipe_down                : { manager: ballotManager, request: 'moveToNextCandidate', data: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        single_finger_double_tap  : { manager: ballotManager, request: 'selectCandidate', data: belowTheLineCouncilBallot, callback: audioController.selectCurrentCandidate },
      },
      
      informal_council_btl_warning :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'playAssemblyBallotSummary', data: 'confirm_assembly_votes_screen', callback: audioController.playAssemblyBallotSummary },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_candidate_vote_screen', callback: audioController.entryFromInformalWarningScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_6', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      switch_to_atl_warning_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_candidate_vote_screen', callback: audioController.enterBlindUiScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_5', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      confirm_assembly_votes_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'enterScreen', data: 'confirm_council_votes_screen', callback: audioController.enterBlindUiScreen },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_assembly_candidate_vote_screen', callback: audioController.entryFromSummaryScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'playAssemblyBallotSummary', data: 'confirm_assembly_votes_screen', callback: audioController.playAssemblyBallotSummary },
        swipe_down                : { manager: audioScreenManager, request: 'skipToNextSegment', data: 'gesture_7', callback: audioController.skipToNextAssemblySegment },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      confirm_council_votes_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'enterScreen', data: 'confirm_all_votes_screen', callback: audioController.enterBlindUiScreen },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'legislative_council_group_vote_screen', callback: audioController.entryFromSummaryScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'playCouncilBallotSummary', data: 'confirm_council_votes_screen', callback: audioController.playCouncilBallotSummary },
        swipe_down                : { manager: audioScreenManager, request: 'skipToNextSegment', data: 'gesture_7', callback: audioController.skipToNextCouncilSegment },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      confirm_all_votes_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'submitVote', data: GVS, callback: audioController.submitVote },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'confirm_assembly_votes_screen', callback: audioController.enterBlindUiScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      print_receipt_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'playContextHelp', data: null, callback: audioController.playShuffleOrder },
        two_finger_hold           : { manager: audioScreenManager, request: 'enterScreen', data: 'finalise_voting_screen', callback: audioController.enterBlindUiScreen },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'unavailableOption', data: null, callback: audioController.printBallotAgain },
        swipe_left                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_5', callback: audioController.unavailableOption },
        swipe_up                  : { manager: audioScreenManager, request: 'playContextHelp', data: null, callback: audioController.playShuffleOrder },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      finalise_voting_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_left                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_5', callback: audioController.unavailableOption },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_6', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      ballot_options_menu_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'enterScreen', data: 'clear_ballot_screen', callback: audioController.enterBlindUiScreen },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_4', callback: audioController.unavailableOption },
        swipe_left                : { manager: audioScreenManager, request: 'returnToMajorScreen', data: null, callback: audioController.returnToMajorScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'moveUpToOption', data: null, callback: audioController.moveToOption },
        swipe_down                : { manager: audioScreenManager, request: 'moveDownToOption', data: 'gesture_7', callback: audioController.moveToOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'triggerOption', data: 'gesture_8', callback: audioController.triggerOption }
      },
      
      clear_ballot_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: optionsManager, request: 'confirmClearBallot', data: 'gesture_4', callback: audioController.confirmClearBallot },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_6', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      },
      
      quit_system_screen :
      {
        one_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_1', callback: audioController.unavailableOption },
        two_finger_hold           : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_2', callback: audioController.unavailableOption },
        three_finger_hold         : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_9', callback: audioController.unavailableOption },
        four_finger_hold          : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_3', callback: audioController.unavailableOption },
        swipe_right               : { manager: optionsManager, request: 'requestEndVoting', data: null, callback: audioController.quitApplication },
        swipe_left                : { manager: audioScreenManager, request: 'enterScreen', data: 'ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        swipe_up                  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_6', callback: audioController.unavailableOption },
        swipe_down                : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_7', callback: audioController.unavailableOption },
        single_finger_double_tap  : { manager: audioScreenManager, request: 'unavailableOption', data: 'gesture_8', callback: audioController.unavailableOption }
      }
    };
  }
});