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
 * ConfirmSelectionsVisualScreen - The visual screen class for both ballots' summary screen for the visual interface.
 * 
 * @author Peter Scheffer
 */

var ConfirmSelectionsVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    this._super(visualScreenManager, 'confirm_selections_screen',   
      this.initialiseConfirmSelectionsScreen, 
      this.exitConfirmSelectionsScreen,
      this.switchToConfirmScreen);
  },

  // Part of entering this screen is to check if the user was switched from the AUI to the VUI.
  // If so, it's a requirement to audibly play the summary to the blind user.
  initialiseConfirmSelectionsScreen: function () {
    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('confirm_selections_screen');
    screenObject.setSelectionSummaryScreenText();

    var confirmSelectionsView = container.Resolve("confirmSelectionsView");
    confirmSelectionsView.checkInformalMessages();
    confirmSelectionsView.attachButtonHandlers();

    $('#assembly_ballot_container').scrollTop(0);
    $('#assembly_ballot_summary_container').scrollTop(0);
    $('#council_ballot_summary_container').scrollTop(0);

    // Play audio instructions for this screen if it's the first time visiting it.
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('confirm_selections_screen');

    var audioController = container.Resolve("audioController");    
    if (!screenObject.hasVisited() && audioController.getUsingAudioMode()) {
      var audioClips = getVisualUiIntroductionAudio('confirm_selections_screen');
      if (audioClips != null && audioClips.length > 0) {
        var container = getContainer();
        audioController.playTranslatedAudio(audioClips, false);
      }
    }    

    // At the end of playing the audio summary, display the button to continue.
    var callback1 = function () {
      // Hide veil to allow interaction.      
      $('#confirmation_veil').hide();
      $('#confirmation_screen_quit_button').show();
      $('#confirmation_screen_help_button').show();
      $('#confirm_submit_button').show();
    };

    $('#assembly_confirmation_veil').hide();

    // Check for uncontested district or by-election.

    // If the district is uncontested, veil the Assembly ballot summary and display a message.
    var votingSession = container.Resolve("votingSession");
    var districtIsUncontested = votingSession.getDistrictIsUncontested();
    var regionIsUncontested = votingSession.getRegionIsUncontested();
    var visualView = container.Resolve('visualView');

    // If the district is uncontested, veil the assembly summary.
    if (districtIsUncontested) {      
      $('#assembly_confirmation_veil').show();
      $('#assembly_ballot_summary_up_section').hide();
      $('#assembly_ballot_summary_down_section').hide();
      $('#assembly_informal_vote').hide();

      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
      var uncontestedMessage = $.i18n._(languageDictionary['district_uncontested']);
      $('#assembly_confirmation_veil').html(uncontestedMessage);

    } else {
      $('#assembly_confirmation_veil').hide();
      $('#assembly_ballot_summary_up_section').show();
      $('#assembly_ballot_summary_down_section').show();
      $('#assembly_informal_vote').show();
    }

    // If the region is uncontested, hide the council summary and centre the district ballot.
    if (regionIsUncontested) {      
      $('#council_ballot_summary_background').hide();
      $('#assembly_ballot_summary_background').css('float', 'center');
    } else {
      $('#council_ballot_summary_background').show();
      $('#assembly_ballot_summary_background').css('float', 'left');
    }
    
    // if the user has been switched from the Audio UI, play the audio summary presentation.
    if (switchedToVisualMode == true) {
    
      // Place a veil over the screen so that the EO can't interfere with the app while the summary audio is playing.
      $('#confirmation_veil').show();
      $('#confirmation_screen_quit_button').hide();
      $('#confirmation_screen_help_button').hide();
      $('#confirm_submit_button').hide();
    
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      var votingSession = container.Resolve("votingSession");
      var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();

      // Play the Assembly summary first.
      var clips = new Array();
      var legislativeAssemblyBallot = container.Resolve("assembly");
      var preferenceOrderList = legislativeAssemblyBallot.getPreferenceOrderList();

      var selectionCount = legislativeAssemblyBallot.getHighestSelection();
      clips = clips.concat(['legislative_assembly_ballot_summary'],
                           ['have_voted_in_assembly'], 
                           ['you_have_voted_for'], 
                           ['number_' + selectionCount], 
                           ['candidates']);

      if (selectionCount < maxAssemblyCandidatesRequired) {
        clips = clips.concat(['this_vote_will_not_be_counted']);
      } else {
        clips = clips.concat(['this_vote_will_be_counted']);
      }

      for (var index = 0; index < preferenceOrderList.length; index++) {
        var selection = preferenceOrderList[index];
        if (selection == null) {
          continue;
        }
        
        clips = clips.concat(['preference_number'], 
                             ['number_' + (index+1)], 
                             [selection.getAudioFileName()]);
      }
      
      // Play the Council summary second.
      var audioScreenManager = container.Resolve("audioScreenManager");
      var visualScreenManager = container.Resolve("visualScreenManager");
      var belowTheLineCouncilBallot = container.Resolve("btl");
      var aboveTheLineCouncilBallot = container.Resolve("atl");
      
      aboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine();

      // This "if" is superfluous? (no longer possible to skip the L.C ballot.)
      if (!aboveTheLineCouncilBallot.getVisited() && !belowTheLineCouncilBallot.getVisited() && aboveOrBelow == null) {
        clips = clips.concat(['have_not_voted_in_council'], 
                             ['this_vote_will_not_be_counted']);
      } else {
   
        if (aboveOrBelow == "above") {
              
          var selectedGroup = aboveTheLineCouncilBallot.getSelection();        
          if (selectedGroup != null) {            
            clips = clips.concat(['legislative_council_group_summary'], 
                                 ['you_have_voted_for'], 
                                 ['number_1'], 
                                 ['group'], 
                                 ['this_vote_will_be_counted'], 
                                 ['preference_number'], 
                                 ['number_1'], 
                                 [selectedGroup.getAudioFileName()]);
          } else {
            clips = clips.concat(['legislative_council_group_summary'], 
                                 ['you_have_voted_for'], 
                                 ['number_0'], 
                                 ['groups'], 
                                 ['this_vote_will_not_be_counted']);
          }
               
        } else if (aboveOrBelow == "below") {
              
          var selectionCount = belowTheLineCouncilBallot.getHighestSelection();
          clips = clips.concat(['legislative_council_candidate_summary'], 
                               ['you_have_voted_for'], 
                               ['number_' + selectionCount], 
                               ['candidates']);      
                
          if (selectionCount < MIN_COUNCIL_CANDIDATES_REQUIRED) {
            clips = clips.concat(['this_vote_will_not_be_counted']);
          } else {
            clips = clips.concat(['this_vote_will_be_counted']);
          }

          var preferenceOrderList = belowTheLineCouncilBallot.getPreferenceOrderList();
          for (var index = 0; index < preferenceOrderList.length; index++) {
            var selection = preferenceOrderList[index];
            if (selection == null) {
              continue;
            }
                 
            clips = clips.concat(['preference_number'], 
                                 ['number_' + (index+1)], 
                                 [selection.getAudioFileName()]);
          }
        } else {
          throw UNRECOGNISED_BALLOT;
        }
      }
      
      if (clips != null && clips.length > 0) {
        var instructions = new AudioInstructions(clips, false, true, callback1);
        audioController.playAudioInstructions(instructions);
      }

    // If the user hasn't switched from the Audio UI, just show the page as normal.
    } else {
      
      $('#confirmation_veil').hide();
    }    
    
    confirmSelectionsView.checkBtnVis();
  },

  setSelectionSummaryScreenText : function() {

    var container = getContainer();
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var visualView = container.Resolve("visualView");
    var visualScreenManager = container.Resolve("visualScreenManager");

    $('#assembly_preference_selections_legal_order').html("");

    // Display Legislative Assembly Summary
    var candidates = legislativeAssemblyBallot.getCandidates();
    for (var index = 0; index <= candidates.length; index++) {
      var candidate = candidates[index];
      
      if (!(candidate instanceof AssemblyCandidate)) {
        continue;
      }

      var translations = dataContainer.Resolve("partyTranslationsData");
      var audioFileName = candidate.getAudioFileName();
      var language = getCurrentLanguageSelection();
      var candidatePartyName = candidate.getPartyName();
      var nameTranslation = translations.getPreferredName(language, candidatePartyName);
      var audioTranslationFile = translations.getAudioFile(language, candidatePartyName);
      var englishAudioTranslationFile = translations.getAudioFile("english", candidatePartyName);
      var preferenceNumber = legislativeAssemblyBallot.getBallotSelectionNumber(candidate);
      
      // Do not show unvoted candidates.
      if (preferenceNumber == null || preferenceNumber == "") {
        continue;
      }

      var popupHTML = "<div id=\"assembly_summary_popup_" + index + "\" class=\"bubble\"><p>" + nameTranslation + "</p><p>" + candidate.getName() + "</p><p>" + candidatePartyName + "</p></div>";
      $('#assembly_preference_selections_legal_order').append(popupHTML);

      var clickHandler = "";
      if (language != "english") {
        clickHandler = "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioTranslationFile + "', '" + audioFileName + "', '" + englishAudioTranslationFile + "'], 'assembly_summary_popup_" + index + "', 'assembly_summary_screen');";
      } else {
        clickHandler = "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioFileName + "'], 'assembly_summary_popup_" + index + "', 'assembly_summary_screen');";
      }

      var assemblySummaryEntry = "<div class=\"summary_ballot ballot_aggregate\" id=\"ballot_aggregate_" + index + "\"" +
        " onclick=\"" + clickHandler + "\">" + 
        "<div class=\"summary_ballot_box\" draggable=\"false\" id=\"ballot_option_" + index + "_legal\" title=\"" + candidate.getName() + 
        " for " + candidate.getPartyName() + "\">" + preferenceNumber + "</div>" + "<div style=\"float: left; width: 80%;\"><div class=\"summary_candidate_name\" id=\"candidate_name\">" + candidate.getName() + "</div>";

      if (candidate.getPartyName() != null && candidate.getPartyName().length > 0) {
        assemblySummaryEntry = assemblySummaryEntry + "<br/>" + "<div class=\"summary_candidate_party\" id=\"candidate_party\">" + candidate.getPartyName() + "</div></div></div><br/>";
      } else {
        assemblySummaryEntry = assemblySummaryEntry + "</div></div><br/>";
      }
      
      $('#assembly_preference_selections_legal_order').append(assemblySummaryEntry);
    }

    // Display Legislative Council Summary
    $('#council_preference_selections_legal_order').html("");

    var aboveOrBelowTheLineVote = visualScreenManager.getUserVotedAboveOrBelowTheLine();
    if (aboveOrBelowTheLineVote == "above") {
    
      var aboveTheLineCouncilBallot = container.Resolve("atl");
      var group = aboveTheLineCouncilBallot.getSelection();
      
      if (group == null) {
        return;
      }
     
      if (group instanceof PartyGroup) {
        var hasBallotBox = group.hasBallotBox;
        if (hasBallotBox) {

          var translations = dataContainer.Resolve("partyTranslationsData");
          var audioFileName = translations.getAudioFile("english", group.getName());
          var language = getCurrentLanguageSelection();
          var nameTranslation = translations.getPreferredName(language, group.getName());
          var audioTranslationFile = translations.getAudioFile(language, group.getName());
          var englishAudioTranslationFile = translations.getAudioFile("english", candidatePartyName);

          var popupHTML = "<div id=\"council_summary_popup_" + index + "\" class=\"bubble\"><p>" + nameTranslation + "</p><p>" + group.getName() + "</p></div>";
          $('#council_preference_selections_legal_order').append(popupHTML);

          var clickHandler = "";
          if (language != "english") {
            clickHandler = "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioTranslationFile + "', '" + audioFileName + "'], 'council_summary_popup_" + index + "', 'council_summary_screen');";
          } else {
            clickHandler = "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioFileName + "'], 'council_summary_popup_" + index + "', 'council_summary_screen');";
          }

          $('#council_preference_selections_legal_order').append("<div class=\"summary_ballot aggregate\" id=\"ballot_aggregate_" + index + "\"" + 
            " onclick=\"" + clickHandler + "\">" +
            "<div class=\"summary_ballot_box\" draggable=\"false\" id=\"ballot_groups_content_" + index + "_legal\" title=\"" + group.getName() + 
            "\">1</div>" + "<div style=\"float: left; width: 80%;\"><div class=\"summary_candidate_name\" id=\"candidate_name\">" + group.getName() + "</div></div></div>");
        } else {
          $('#council_preference_selections_legal_order').append("<div class=\"summary_ballot aggregate\" id=\"ballot_aggregate_" + index + "\"></div>");
        }
      }

    } else {

      var belowTheLineCouncilBallot = container.Resolve("btl");
      var candidates = belowTheLineCouncilBallot.getCandidates();
      for (var index = 0; index < candidates.length; index++) {
      
        var candidate = candidates[index];
        if (!(candidate instanceof CouncilCandidate)) {
          continue;
        }

        var translations = dataContainer.Resolve("partyTranslationsData");
        var audioFileName = candidate.getAudioFileName();
        var language = getCurrentLanguageSelection();
        var candidatePartyName = candidate.getPartyName();
        var nameTranslation = translations.getPreferredName(language, candidate.getPartyName());
        var audioTranslationFile = translations.getAudioFile(language, candidate.getPartyName());
        var preferenceNumber = belowTheLineCouncilBallot.getBallotSelectionNumber(candidate);
      
        // Do not show unvoted candidates.
        if (preferenceNumber == null || preferenceNumber == "") {
          continue;
        }

        var popupHTML = "<div id=\"council_summary_popup_" + index + "\" class=\"bubble\"><p>" + nameTranslation + "</p><p>" + candidate.getName() + "</p><p>" + candidatePartyName + "</p></div>";
        $('#council_preference_selections_legal_order').append(popupHTML);

        var clickHandler = "";
        if (language != "english") {
          clickHandler = "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioTranslationFile + "', '" + audioFileName + "'], 'council_summary_popup_" + index + "', 'council_summary_screen');";
        } else {
          clickHandler = "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioFileName + "'], 'council_summary_popup_" + index + "', 'council_summary_screen');";
        }
        
        var councilSummaryEntry = "<div class=\"summary_ballot ballot_aggregate\" id=\"ballot_aggregate_" + index + "\"" + 
          " onclick=\"" + clickHandler + "\">" +
          "<div class=\"summary_ballot_box\" draggable=\"false\" id=\"" + candidate.getBallotBoxId() + "_legal\" title=\"" + 
          candidate.getName() + " for " + candidate.getPartyName() + "\">" + preferenceNumber + "</div>" + "<div style=\"float: left; width: 80%;\"><div class=\"summary_candidate_name\" id=\"candidate_name\">" + candidate.getName() + "</div>";

        if (candidate.getPartyName() != null && candidate.getPartyName().length > 0) {
          councilSummaryEntry = councilSummaryEntry + "<br/>" + "<div class=\"summary_candidate_party\" id=\"candidate_party\">" + candidate.getPartyName() + "</div></div></div><br/>";
        } else {
          councilSummaryEntry = councilSummaryEntry + "</div></div><br/>";
        }

        $('#council_preference_selections_legal_order').append(councilSummaryEntry);
      }
    }
  },
  
  exitConfirmSelectionsScreen: function () {

    // Unhide content on exit if it is hidden.
    if (switchedToVisualMode == true) {    
      $('#confirmation_veil').hide();
      $('#confirmation_screen_quit_button').show();
      $('#confirmation_screen_help_button').show();
      $('#confirm_submit_button').show();
    }
    
    var confirmSelectionsView = container.Resolve('confirmSelectionsView');
    confirmSelectionsView.detachButtonHandlers();
  },
  
  // Switch from Audio UI to Visual UI.  
  switchToConfirmScreen: function () {
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();

    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('confirm_selections_screen');
    screenObject.setHasVisited(true);
  
    var audioScreenManager = container.Resolve("audioScreenManager");
    var aboveOrBelow = audioScreenManager.getUserVotedAboveOrBelowTheLine();
    var visualScreenManager = container.Resolve("visualScreenManager");
    visualScreenManager.setUserVotedAboveOrBelowTheLine(aboveOrBelow);
  
    var visualView = container.Resolve("visualView");
    visualView.displaySection('audio_only_screen', 'confirm_selections_screen');
  }    
});