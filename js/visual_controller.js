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
 * Typical Controller pattern.  This class is responsible for controlling the behaviour of the UI.
 * It retrieves data from the data model and updates the UI (visual) with the most appropriate data.
 * 
 * @author Peter Scheffer
 */

var VisualController = Class.extend({
  
  init: function () {
    this.hasScannedQR = false;
  },

  reset: function () {
    this.init();
    this.resetColorsAndTextSize();
  },
  
  initialiseBallotExplanationScreen: function () {
    var container = getContainer();
    var visualView = container.Resolve("visualView");
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var belowTheLineCouncilBallot = container.Resolve("btl");

    visualView.setBallotExplanationText();    

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var districtIsUncontested = votingSession.getDistrictIsUncontested();
    var regionIsUncontested = votingSession.getRegionIsUncontested();
    
    if (!districtIsUncontested) {
    
      for (var index = 0; index < legislativeAssemblyBallot.getNumberOfCandidates(); index++) {
        var candidate = legislativeAssemblyBallot.getCandidateByIndex(index);
        var selectionNumber = legislativeAssemblyBallot.getBallotSelectionNumber(candidate);
        if (selectionNumber == null || selectionNumber == '') {
          selectionNumber = "&nbsp;";
        }
        visualView.setShuffleBallotSelectionNumber(candidate, selectionNumber);
      }
    }

    if (!regionIsUncontested) {
    
      var visualScreenManager = container.Resolve("visualScreenManager");
      var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 
    
      if (userVotedAboveOrBelow == "below") {
        for (var index = 0; index < belowTheLineCouncilBallot.getNumberOfCandidates(); index++) {
          var candidate = belowTheLineCouncilBallot.getCandidateByIndex(index);
          var selectionNumber = belowTheLineCouncilBallot.getBallotSelectionNumber(candidate);
          if (selectionNumber == null || selectionNumber == '') {
            selectionNumber = "&nbsp;";
          }
          visualView.setShuffleBallotSelectionNumber(candidate, selectionNumber);
        }
      }
    }
  },

  setCurrentBallot: function (currentBallot) {
    this.currentBallot = currentBallot;
  },
  
  getCurrentBallot: function (currentBallot) {
    return this.currentBallot;
  },
  
  initialiseAboutVvoteScreen: function () {
    var container = getContainer();
    var visualView = container.Resolve("visualView");
    visualView.playVideo("about_vvote_video", "videos/script1_1.mp4");
  },
  
  initialiseVotingCompletedScreen: function () {
    var container = getContainer();
    var visualView = container.Resolve("visualView");
    visualView.playVideo("tear_slip_video", "videos/rips.ogv");
  },  
  
  initialiseShowMeHowScreen: function () {
    var container = getContainer();
    var visualView = container.Resolve("visualView");    
    visualView.playVideo("show_me_how_video", "videos/show_me_how.ogv");
  },

  initialiseLegislativeCouncilSummaryScreen: function () {
    var container = getContainer();
    var visualView = container.Resolve("visualView");
    visualView.setCouncilSummaryScreenText();
  },
  
  resetColorsAndTextSize: function () {
    if($("#font_color_styles").attr('href') != "css/styles_black_on_white.css") { 
      $("#font_color_styles").attr('href', "css/styles_black_on_white.css");
      window.setTimeout(function() {
        $(document).trigger("stylesChanged");
      },10); 
    }

    $("#bow_selected").html("&#10004");
    $("#wob_selected").html("");

    if($("#font_size_styles").attr('href') != "css/styles_medium.css") { 
      $("#font_size_styles").attr('href', "css/styles_medium.css");
      window.setTimeout(function() {
        $(document).trigger("stylesChanged");
      },10); 
    }

    $("#large_selected").html("");
    $("#medium_selected").html("&#10004");

    $('.speaker_icon').attr("src", "images/speaker_icon.png");
  },
  
  showStartScreen: function () {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();
    $("#triage_screen").css('visibility', 'hidden');
    $("#triage_screen").hide();
    $("#start_screen").css('visibility', 'visible');
    $("#start_screen").show();
  },
 
  // Reset all app models.
  quitApplication: function () {

    var container = getContainer();
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var belowTheLineCouncilBallot = container.Resolve("btl");
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var visualController = container.Resolve("visualController");
    var visualScreenManager = container.Resolve("visualScreenManager");
    var audioScreenManager = container.Resolve("audioScreenManager");
    var audioController = container.Resolve("audioController");
    var screenFactory = container.Resolve("screenFactory");
    var assemblyBallotView = container.Resolve("assemblyBallotView");
    var combinedBallotView = container.Resolve('combined');
    var votingSession = container.Resolve('votingSession');
    var readbackSession = container.Resolve('readbackSession');
    var optionsManager = container.Resolve('optionsManager');
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();
    
    window.clearTimeout(votingSession.getInactivityCounterTimer());
    window.clearTimeout(votingSession.getInactivityCounterReset());

    // reset data models.
    changeLanguage("english");
    audioController.reset();
    audioScreenManager.reset();
    aboveTheLineCouncilBallot.init();
    belowTheLineCouncilBallot.init();
    legislativeAssemblyBallot.init();
    visualController.reset();
    assemblyBallotView.reset();
    combinedBallotView.reset();
    resetLogging();
    votingSession.reset();
    readbackSession.reset();
    optionsManager.reset();
    switchedToVisualMode = false;    

    // Reset screen objects.
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('legislative_assembly_candidate_vote_screen');
    screenObject.setHasVisited(false);
    var screenObject = screenFactory.getInstance('legislative_council_combined_screen');
    screenObject.setHasVisited(false);
    var screenObject = screenFactory.getInstance('confirm_selections_screen');
    screenObject.setHasVisited(false);
    var screenObject = screenFactory.getInstance('review_ballots_screen');
    screenObject.setHasVisited(false);
    var screenObject = screenFactory.getInstance('start_screen');
    screenObject.setHasVisited(false);
    var screenObject = screenFactory.getInstance('atl_btl_choice_screen');
    screenObject.setHasVisited(false);
    var screenObject = screenFactory.getInstance('print_receipt_screen');
    screenObject.setHasVisited(false);
    
    // Hide any remaining screens.
    $("#timeout_screen").css('visibility', 'hidden');
    $("#timeout_screen").hide();
    $("#confirm_discard_screen").css('visibility', 'hidden');
    $("#confirm_discard_screen").hide();
    $("#audio_only_screen").css('visibility', 'hidden');
    $("#audio_only_screen").hide();
    $("#start_screen").css('visibility', 'hidden');
    $("#start_screen").hide();
    $('#language_trigger').hide();
    $('#return_to_audio_button').hide();

    gvsMode = false;
    tvsMode = false;

    displayFirstScreen();  

    var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    visualScreenManager.reset();
  }  
});