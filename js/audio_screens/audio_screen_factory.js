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
 * AudioScreenFactory for manufacturing audio screen objects according to the specified type. 
 * 
 * @author Peter Scheffer
 */
var AudioScreenFactory = Class.extend({
  
  typeOf: function () {
    return "AudioScreenFactory";
  },

  init: function () {

    var containerBuilder = new JsInject.ContainerBuilder();

    containerBuilder.Register("audio_scan_screen", 
    function(c) {
      return new AudioScanScreen();
    }).Reused();

    containerBuilder.Register("audio_start_screen", 
    function(c) {
      return new AudioStartScreen();
    }).Reused();

    containerBuilder.Register("practice_screen", 
    function(c) {
      return new PracticeAudioScreen();
    }).Reused();

    containerBuilder.Register("free_practice_screen", 
    function(c) {
      return new FreePracticeAudioScreen();
    }).Reused();
        
    containerBuilder.Register("tvs_entry_screen", 
    function(c) {
      return new TvsEntryAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_practice_screen", 
    function(c) {
      return new TvsPracticeAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_exit_practice_screen", 
    function(c) {
      return new TvsExitPracticeAudioScreen();
    }).Reused();

    containerBuilder.Register("legislative_assembly_candidate_vote_screen", 
    function(c) {
      return new LegislativeAssemblyAudioScreen();
    }).Reused();

    containerBuilder.Register("uncontested_legislative_assembly_candidate_vote_screen", 
    function(c) {
      return new UncontestedLegislativeAssemblyAudioScreen();
    }).Reused();

    containerBuilder.Register("incomplete_assembly_warning", 
    function(c) {
      return new IncompleteAssemblyAudioScreen();
    }).Reused();

    containerBuilder.Register("legislative_council_group_vote_screen", 
    function(c) {
      return new LegislativeCouncilGroupAudioScreen();
    }).Reused();

    containerBuilder.Register("legislative_council_candidate_vote_screen", 
    function(c) {
      return new LegislativeCouncilCandidateAudioScreen();
    }).Reused();

    containerBuilder.Register("switch_to_btl_warning_screen", 
    function(c) {
      return new SwitchToBtlAudioScreen();
    }).Reused();

    containerBuilder.Register("switch_to_atl_warning_screen", 
    function(c) {
      return new SwitchToAtlAudioScreen();
    }).Reused();
    
    containerBuilder.Register("informal_council_atl_warning", 
    function(c) {
      return new IncompleteCouncilAtlAudioScreen();
    }).Reused();
    
    containerBuilder.Register("informal_council_btl_warning", 
    function(c) {
      return new IncompleteCouncilBtlAudioScreen();
    }).Reused();

    containerBuilder.Register("confirm_assembly_votes_screen", 
    function(c) {
      return new AssemblySummaryAudioScreen();
    }).Reused();

    containerBuilder.Register("confirm_council_votes_screen", 
    function(c) {
      return new CouncilSummaryAudioScreen();
    }).Reused();

    containerBuilder.Register("print_receipt_screen", 
    function(c) {
      return new PrintReceiptAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_print_receipt_screen", 
    function(c) {
      return new TvsPrintReceiptAudioScreen();
    }).Reused();

    containerBuilder.Register("finalise_voting_screen", 
    function(c) {
      return new FinaliseVotingAudioScreen();
    }).Reused();

    containerBuilder.Register("ballot_options_menu_screen", 
    function(c) {
      return new BallotOptionsMenuAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_ballot_options_menu_screen", 
    function(c) {
      return new TvsBallotOptionsMenuAudioScreen();
    }).Reused();
   
    containerBuilder.Register("clear_ballot_screen", 
    function(c) {
      return new ClearBallotAudioScreen();
    }).Reused();

    containerBuilder.Register("quit_system_screen", 
    function(c) {
      return new QuitSystemAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_legislative_assembly_candidate_vote_screen", 
    function(c) {
      return new TvsLegislativeAssemblyAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_uncontested_legislative_assembly_candidate_vote_screen", 
    function(c) {
      return new TvsUncontestedLegislativeAssemblyAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_incomplete_assembly_warning", 
    function(c) {
      return new TvsIncompleteAssemblyAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_legislative_council_group_vote_screen", 
    function(c) {
      return new TvsLegislativeCouncilGroupAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_legislative_council_candidate_vote_screen", 
    function(c) {
      return new TvsLegislativeCouncilCandidateAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_switch_to_btl_warning_screen", 
    function(c) {
      return new TvsSwitchToBtlAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_switch_to_atl_warning_screen", 
    function(c) {
      return new TvsSwitchToAtlAudioScreen();
    }).Reused();
    
    containerBuilder.Register("tvs_informal_council_atl_warning", 
    function(c) {
      return new TvsIncompleteCouncilAtlAudioScreen();
    }).Reused();
    
    containerBuilder.Register("tvs_informal_council_btl_warning", 
    function(c) {
      return new TvsIncompleteCouncilBtlAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_confirm_assembly_votes_screen", 
    function(c) {
      return new TvsAssemblySummaryAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_confirm_council_votes_screen", 
    function(c) {
      return new TvsCouncilSummaryAudioScreen();
    }).Reused();
   
    containerBuilder.Register("tvs_clear_ballot_screen", 
    function(c) {
      return new TvsClearBallotAudioScreen();
    }).Reused();

    containerBuilder.Register("tvs_quit_system_screen", 
    function(c) {
      return new TvsQuitSystemAudioScreen();
    }).Reused();
    
    containerBuilder.Register("confirm_all_votes_screen", 
    function(c) {
      return new ConfirmAllVotesAudioScreen();
    }).Reused();

    this.screens = containerBuilder.Create();
  },
  
  reset: function () {
    this.init();
  },

  // Returns an instance of the associated Screen object for this given screen type (DOM node ID).
  getInstance: function (type) {
    return this.screens.Resolve(type);
  }
});