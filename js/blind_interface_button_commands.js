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
 * In this listing, commands are mapped onto button triggers created by a keypad interface on the screen.
 * 
 * @author Peter Scheffer
 */

var BlindInterfaceButtonNavigation = Class.extend({
  getCommand: function (screen, button) {
    var command = this.blindInterfaceCommands[screen][button];
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
      tvs_entry_screen : 
      {
        button_1  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_2  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_practice_screen', callback: audioController.enterBlindUiScreen }
      },
      
      tvs_practice_screen : 
      {
        button_1  : { manager: audioScreenManager, request: 'freePractice', data: 'practice_one_key', callback: audioController.freeTvsPractice },
        button_2  : { manager: audioScreenManager, request: 'freePractice', data: 'practice_two_key', callback: audioController.freeTvsPractice },
        button_3  : { manager: audioScreenManager, request: 'freePractice', data: 'practice_key_not_used', callback: audioController.freeTvsPractice },
        button_4  : { manager: audioScreenManager, request: 'freePractice', data: 'practice_four_key', callback: audioController.freeTvsPractice },
        button_5  : { manager: audioScreenManager, request: 'freePractice', data: 'practice_five_key', callback: audioController.freeTvsPractice },
        button_6  : { manager: audioScreenManager, request: 'freePractice', data: 'practice_six_key', callback: audioController.freeTvsPractice },
        button_7  : { manager: audioScreenManager, request: 'freePractice', data: 'practice_key_not_used', callback: audioController.freeTvsPractice },
        button_8  : { manager: audioScreenManager, request: 'freePractice', data: 'practice_eight_key', callback: audioController.freeTvsPractice },
        button_9  : { manager: audioScreenManager, request: 'freePractice', data: 'practice_key_not_used', callback: audioController.freeTvsPractice },
        button_10 : { manager: audioScreenManager, request: 'freePractice', data: 'practice_star_key', callback: audioController.freeTvsPractice },
        button_11 : { manager: audioScreenManager, request: 'freePractice', data: 'practice_zero_key', callback: audioController.freeTvsPractice },
        button_12 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_exit_practice_screen', callback: audioController.enterBlindUiScreen }
      },
      
      tvs_exit_practice_screen :
      {
        button_1  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_practice_screen', callback: audioController.enterBlindUiScreen },
        button_2  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_assembly_candidate_vote_screen', callback: audioController.enterBlindUiScreen },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption }
      },
      
      tvs_legislative_assembly_candidate_vote_screen : 
      {
        button_1  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_1_error', callback: audioController.unavailableOption },
        button_2  : { manager: ballotManager, request: 'moveToPreviousCandidate', data: legislativeAssemblyBallot, callback: audioController.moveToCandidate },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: ballotManager, request: 'selectCandidate', data: legislativeAssemblyBallot, callback: audioController.selectCurrentCandidate },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: ballotManager, request: 'moveToNextCandidate', data: legislativeAssemblyBallot, callback: audioController.moveToCandidate },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'playContextHelp', data: legislativeAssemblyBallot, callback: audioController.playContextHelp },
        button_11 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        button_12 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen }
      },
      
      tvs_uncontested_legislative_assembly_candidate_vote_screen : 
      {
        button_1  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_1_error', callback: audioController.unavailableOption },
        button_2  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_2_error', callback: audioController.unavailableOption },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        button_12 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen }
      },
      
      tvs_incomplete_assembly_warning :
      {
        button_1  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_assembly_candidate_vote_screen', callback: audioController.entryFromInformalWarningScreen },
        button_2  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        button_12 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen }
      },
      
      tvs_legislative_council_group_vote_screen : 
      {
        button_1  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_1_error', callback: audioController.unavailableOption },
        button_2  : { manager: ballotManager, request: 'moveToPreviousGroup', data: aboveTheLineCouncilBallot, callback: audioController.moveToGroup },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: ballotManager, request: 'selectCandidate', data: aboveTheLineCouncilBallot, callback: audioController.selectCurrentGroup },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_switch_to_btl_warning_screen', callback: audioController.enterBlindUiScreen },
        button_8  : { manager: ballotManager, request: 'moveToNextGroup', data: aboveTheLineCouncilBallot, callback: audioController.moveToGroup },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'playContextHelp', data: aboveTheLineCouncilBallot, callback: audioController.playContextHelp },
        button_11 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        button_12 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_confirm_assembly_votes_screen', callback: audioController.enterBlindUiScreen }
      },
      
      tvs_informal_council_atl_warning :
      {
        button_1  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_group_vote_screen', callback: audioController.entryFromInformalWarningScreen },
        button_2  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_confirm_assembly_votes_screen', callback: audioController.playAssemblyBallotSummary },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_12_error', callback: audioController.unavailableOption }
      },
      
      tvs_switch_to_btl_warning_screen :
      {
        button_1  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen },
        button_2  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_candidate_vote_screen', callback: audioController.enterBlindUiScreen },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_12_error', callback: audioController.unavailableOption }
      },
      
      tvs_legislative_council_candidate_vote_screen : 
      {
        button_1  : { manager: audioScreenManager, request: 'playContextHelp', data: belowTheLineCouncilBallot, callback: audioController.playContextHelp },
        button_2  : { manager: ballotManager, request: 'moveToPreviousCandidate', data: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_4  : { manager: ballotManager, request: 'moveToPreviousGroupCandidate', data: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        button_5  : { manager: ballotManager, request: 'selectCandidate', data: belowTheLineCouncilBallot, callback: audioController.selectCurrentCandidate },
        button_6  : { manager: ballotManager, request: 'moveToNextGroupCandidate', data: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        button_7  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_switch_to_atl_warning_screen', callback: audioController.enterBlindUiScreen },
        button_8  : { manager: ballotManager, request: 'moveToNextCandidate', data: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'playContextHelp', data: belowTheLineCouncilBallot, callback: audioController.playContextHelp },
        button_11 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        button_12 : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_confirm_assembly_votes_screen', callback: audioController.enterBlindUiScreen }
      },
      
      tvs_informal_council_btl_warning :
      {
        button_1  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_candidate_vote_screen', callback: audioController.entryFromInformalWarningScreen },
        button_2  : { manager: audioScreenManager, request: 'playAssemblyBallotSummary', data: 'tvs_confirm_assembly_votes_screen', callback: audioController.playAssemblyBallotSummary },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_12_error', callback: audioController.unavailableOption }
      },
      
      tvs_switch_to_atl_warning_screen :
      {
        button_1  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_candidate_vote_screen', callback: audioController.enterBlindUiScreen },
        button_2  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_group_vote_screen', callback: audioController.enterBlindUiScreen },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_12_error', callback: audioController.unavailableOption }
      },
      
      tvs_confirm_assembly_votes_screen :
      {
        button_1  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_assembly_candidate_vote_screen', callback: audioController.entryFromSummaryScreen },
        button_2  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_confirm_council_votes_screen', callback: audioController.playCouncilBallotSummary },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'skipToNextSegment', data: null, callback: audioController.skipToNextAssemblySegment },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'playAssemblyBallotSummary', data: 'tvs_confirm_assembly_votes_screen', callback: audioController.playAssemblyBallotSummary },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_12_error', callback: audioController.unavailableOption }
      },
      
      tvs_confirm_council_votes_screen :
      {
        button_1  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_legislative_council_group_vote_screen', callback: audioController.entryFromSummaryScreen },
        button_2  : { manager: audioScreenManager, request: 'submitVote', data: TVS, callback: audioController.submitVote },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'skipToNextSegment', data: null, callback: audioController.skipToNextCouncilSegment },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'playCouncilBallotSummary', data: 'tvs_confirm_council_votes_screen', callback: audioController.playCouncilBallotSummary },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_12_error', callback: audioController.unavailableOption }
      },
      
      tvs_print_receipt_screen :
      {
        button_1  : { manager: audioScreenManager, request: 'unavailableOption', data: 'practice_key_not_used', callback: audioController.unavailableOption },
        button_2  : { manager: audioScreenManager, request: 'playContextHelp', data: null, callback: audioController.playShuffleOrder },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: null, callback: audioController.printBallotAgain },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'playContextHelp', data: null, callback: audioController.playShuffleOrder },
        button_12 : { manager: audioScreenManager, request: 'enterScreen', data: 'finalise_voting_screen', callback: audioController.enterBlindUiScreen }
      },
      
      finalise_voting_screen :
      {
        button_1  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_1_error', callback: audioController.unavailableOption },
        button_2  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_2_error', callback: audioController.unavailableOption },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_12_error', callback: audioController.unavailableOption }
      },

      tvs_ballot_options_menu_screen :
      {
        button_1  : { manager: audioScreenManager, request: 'returnToMajorScreen', data: null, callback: audioController.returnToLastSelectedCandidate },
        button_2  : { manager: audioScreenManager, request: 'unavailableOption', data: null, callback: audioController.playInfoAboutThisBallot },
        button_3  : { manager: optionsManager, request: 'increaseAudioSpeed', data: null, callback: audioController.setPlaybackRate },
        button_4  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_clear_ballot_screen', callback: audioController.enterBlindUiScreen },
        button_5  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_quit_system_screen', callback: audioController.enterBlindUiScreen },
        button_6  : { manager: optionsManager, request: 'switchToVisualInterface', data: null, callback: audioController.switchToVisualInterface },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: null, callback: audioController.playInfoAboutThisBallot },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'returnToMajorScreen', data: null, callback: audioController.returnToMajorScreen }
      },

      tvs_clear_ballot_screen :
      {
        button_1  : { manager: optionsManager, request: 'confirmClearBallot', data: null, callback: audioController.confirmClearBallot },
        button_2  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_12_error', callback: audioController.unavailableOption }
      },
      
      tvs_quit_system_screen :
      {
        button_1  : { manager: optionsManager, request: 'requestEndVoting', data: null, callback: audioController.quitApplication },
        button_2  : { manager: audioScreenManager, request: 'enterScreen', data: 'tvs_ballot_options_menu_screen', callback: audioController.enterBlindUiScreen },
        button_3  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_3_error', callback: audioController.unavailableOption },
        button_4  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_4_error', callback: audioController.unavailableOption },
        button_5  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_5_error', callback: audioController.unavailableOption },
        button_6  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_6_error', callback: audioController.unavailableOption },
        button_7  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_7_error', callback: audioController.unavailableOption },
        button_8  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_8_error', callback: audioController.unavailableOption },
        button_9  : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_9_error', callback: audioController.unavailableOption },
        button_10 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_10_error', callback: audioController.unavailableOption },
        button_11 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_11_error', callback: audioController.unavailableOption },
        button_12 : { manager: audioScreenManager, request: 'unavailableOption', data: 'button_12_error', callback: audioController.unavailableOption }
      }
    };
  }
});