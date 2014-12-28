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
 * ScreenFactory for manufacturing screen objects according to the specified type.  
 * 
 * @author Peter Scheffer
 */
var ScreenFactory = Class.extend({
  
  typeOf: function () {
    return "ScreenFactory";
  },

  init: function () {

    var containerBuilder = new JsInject.ContainerBuilder();

    containerBuilder.Register("language_screen", 
    function(c) {
      return new LanguageVisualScreen();
    }).Reused();

    containerBuilder.Register("reset_screen", 
    function(c) {
      return new ResetVisualScreen();
    }).Reused();

    containerBuilder.Register("invalid_qr_screen", 
    function(c) {
      return new InvalidQrVisualScreen();
    }).Reused();

    containerBuilder.Register("failed_submit_screen", 
    function(c) {
      return new FailedSubmitVisualScreen();
    }).Reused();

    containerBuilder.Register("error_screen", 
    function(c) {
      return new ErrorVisualScreen();
    }).Reused();

    containerBuilder.Register("timeout_screen", 
    function(c) {
      return new TimeoutVisualScreen();
    }).Reused();

    containerBuilder.Register("aui_timeout_screen", 
    function(c) {
      return new AuiTimeoutVisualScreen();
    }).Reused();

    containerBuilder.Register("timeout_lock_screen", 
    function(c) {
      return new TimeoutLockVisualScreen();
    }).Reused();

    containerBuilder.Register("timeout_unlock_screen", 
    function(c) {
      return new TimeoutUnlockVisualScreen();
    }).Reused();

    containerBuilder.Register("confirm_discard_screen", 
    function(c) {
      return new ConfirmDiscardVisualScreen();
    }).Reused();

    containerBuilder.Register("start_screen", 
    function(c) {
      return new StartVisualScreen();
    }).Reused();

    containerBuilder.Register("audio_mode_scan_qr_code_screen", 
    function(c) {
      return new AudioModeScanVisualScreen();
    }).Reused();

    containerBuilder.Register("scan_qr_code_screen", 
    function(c) {
      return new ScanVisualScreen();
    }).Reused();
    
    containerBuilder.Register("confirm_scan_screen", 
    function(c) {
      return new ConfirmScanVisualScreen();
    }).Reused();

    containerBuilder.Register("confirm_audio_switch_visual_screen", 
    function(c) {
      return new ConfirmAudioSwitchVisualScreen();
    }).Reused();

    containerBuilder.Register("audio_start_screen", 
    function(c) {
      return new AudioStartVisualScreen();
    }).Reused();

    containerBuilder.Register("legislative_assembly_candidate_vote_screen", 
    function(c) {
      return new LegislativeAssemblyVisualScreen();
    }).Reused();

    containerBuilder.Register("atl_btl_choice_screen", 
    function(c) {
      return new AtlBtlChoiceVisualScreen();
    }).Reused();

    containerBuilder.Register("tvs_legislative_assembly_candidate_vote_screen", 
    function(c) {
      return new LegislativeAssemblyVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("incomplete_assembly_warning", 
    function(c) {
      return new LegislativeAssemblyWarningVisualScreen();
    }).Reused();

    containerBuilder.Register("legislative_council_combined_screen", 
    function(c) {
      return new LegislativeCouncilCombinedVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("legislative_council_group_vote_screen", 
    function(c) {
      return new LegislativeCouncilCombinedVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_legislative_council_group_vote_screen", 
    function(c) {
      return new LegislativeCouncilCombinedVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("legislative_council_candidate_vote_screen", 
    function(c) {
      return new LegislativeCouncilCombinedVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_legislative_council_candidate_vote_screen", 
    function(c) {
      return new LegislativeCouncilCombinedVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("informal_council_atl_warning", 
    function(c) {
      var screen = new LegislativeCouncilWarningVisualScreen();
      screen.setReturnScreen("informal_council_atl_warning");
      return screen;
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_informal_council_atl_warning", 
    function(c) {
      var screen = new LegislativeCouncilWarningVisualScreen();
      screen.setReturnScreen("tvs_informal_council_atl_warning");
      return screen;
    }).Reused();
    
    // Audio only screen.
    containerBuilder.Register("informal_council_btl_warning", 
    function(c) {
      var screen = new LegislativeCouncilWarningVisualScreen();
      screen.setReturnScreen("informal_council_btl_warning");
      return screen;
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_informal_council_btl_warning", 
    function(c) {
      var screen = new LegislativeCouncilWarningVisualScreen();
      screen.setReturnScreen("informal_council_btl_warning");
      return screen;
    }).Reused();

    containerBuilder.Register("council_atl_screen", 
    function(c) {
      return new LegislativeCouncilCombinedVisualScreen();
    }).Reused();

    containerBuilder.Register("council_btl_screen", 
    function(c) {
      return new LegislativeCouncilCombinedVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("switch_to_btl_warning_screen", 
    function(c) {
      var screen = new LegislativeCouncilWarningVisualScreen();
      screen.setReturnScreen("council_atl_screen");
      return screen;
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_switch_to_btl_warning_screen", 
    function(c) {
      var screen = new LegislativeCouncilWarningVisualScreen();
      screen.setReturnScreen("council_atl_screen");
      return screen;
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("switch_to_atl_warning_screen", 
    function(c) {
      var screen = new LegislativeCouncilWarningVisualScreen();
      screen.setReturnScreen("council_btl_screen");
      return screen;
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_switch_to_atl_warning_screen", 
    function(c) {
      var screen = new LegislativeCouncilWarningVisualScreen();
      screen.setReturnScreen("council_btl_screen");
      return screen;
    }).Reused();
    
    // Audio only screen.
    containerBuilder.Register("confirm_assembly_votes_screen", 
    function(c) {
      return new LegislativeAssemblySummaryVisualScreen();
    }).Reused();
    
    // Audio only screen.
    containerBuilder.Register("confirm_all_votes_screen", 
    function(c) {
      return new ConfirmVotesVisualScreen();
    }).Reused();    
    
    // Audio only screen.
    containerBuilder.Register("tvs_confirm_assembly_votes_screen", 
    function(c) {
      return new LegislativeAssemblySummaryVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("confirm_council_votes_screen", 
    function(c) {
      return new LegislativeCouncilSummaryVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_confirm_council_votes_screen", 
    function(c) {
      return new LegislativeCouncilSummaryVisualScreen();
    }).Reused();

    containerBuilder.Register("confirm_selections_screen", 
    function(c) {
      return new ConfirmSelectionsVisualScreen();
    }).Reused();

    containerBuilder.Register("review_ballots_screen", 
    function(c) {
      return new ReviewBallotsVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("print_receipt_screen", 
    function(c) {
      return new PrintReceiptVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_print_receipt_screen", 
    function(c) {
      return new PrintReceiptVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("audio_only_screen", 
    function(c) {
      return new AudioOnlyScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("triage_screen", 
    function(c) {
      return new TriageVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("practice_screen", 
    function(c) {
      return new PracticeVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_entry_screen", 
    function(c) {
      return new TvsEntryVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_practice_screen", 
    function(c) {
      return new TvsPracticeVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("tvs_exit_practice_screen", 
    function(c) {
      return new TvsPracticeVisualScreen();
    }).Reused();

    // Audio only screen.
    containerBuilder.Register("ballot_options_menu_screen", 
    function(c) {
      return new BallotOptionsVisualScreen();
    }).Reused();
   
    // Audio only screen.
    containerBuilder.Register("tvs_ballot_options_menu_screen", 
    function(c) {
      return new TvsBallotOptionsVisualScreen();
    }).Reused();
    
    containerBuilder.Register("scan_error_visual_screen", 
    function(c) {
      return new ScanErrorVisualScreen();
    }).Reused();

    containerBuilder.Register("mbb_timeout_screen", 
    function(c) {
      return new MbbTimeoutVisualScreen();
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