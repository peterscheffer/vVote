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
 * Legislative Assembly Ballot View class.  This class is responsible for maintaining 
 * the UI logic of the assembly ballot screen. 
 * 
 * @author Peter Scheffer
 */ 

var LegislativeAssemblyBallotView = Class.extend({    

  init: function () {

    $('#assembly_ballot_container').bind('scroll resize',  function() {   
      var container = getContainer();
      var assemblyBallotView = container.Resolve('assemblyBallotView');
      assemblyBallotView.checkBtnVis();
    });
    
    this.hasSeenVideo = false;
    this.upArrowHeld;
    this.downArrowHeld;
    this.downArrowOff = true;
    this.upArrowOff = true;
  },
  
  reset: function () {
    this.init();
    $('#ballot_help_modal_container').hide();
    $('#ballot_help_modal_background').hide();
    $("#warning_modal_header").hide();
    $("#warning_modal_footer").hide();
    $('#warning_modal_container').hide();
    $('#warning_modal_background').hide();
    $('#assembly_ballot_content_inner').scrollTop(0);          
    $('#assembly_ballot_container').scrollTop(0);          
  },
  
  checkBtnVis: function() {
  
    var innerHeight = $('#assembly_ballot_container')[0].scrollHeight;
    var outerHeight = $('#assembly_ballot_container').height();

    if (innerHeight > outerHeight) {

      var maxTopPos = innerHeight - outerHeight;

      var topPos = $('#assembly_ballot_container').scrollTop();

      if (topPos > 0) {
        $('#assembly_button_scroll_up').css('visibility', 'visible');
      } else {
        $('#assembly_button_scroll_up').css('visibility', 'hidden');
      } 
      
      var divHeight = innerHeight - outerHeight;

      if (topPos < maxTopPos) {
        $('#assembly_button_scroll_down').css('visibility', 'visible');
      } else {
        $('#assembly_button_scroll_down').css('visibility', 'hidden');
      }

    } else {
       $('#assembly_button_scroll_up').css('visibility', 'hidden');
       $('#assembly_button_scroll_down').css('visibility', 'hidden');
    }    
  },

  /**
   * Detach all button handlers for this screen and all popup screens within this context.
   */
  detachButtonHandlers: function () {
    $('#ballot_help_modal_help_button').off('click');
    $('#ballot_help_modal_back_button').off('click');
    $('#warning_modal_help_button').off('click');
    $('#warning_modal_back_button').off('click');
    $('#warning_modal_proceed_button').off('click');    
    $('#assembly_button_scroll_up').off('click');
    $('#assembly_button_scroll_down').off('click');
    $('#assembly_instruction_ok_button').off('click');
    $('#assembly_screen_next_button').off('click');
    $('#assembly_screen_quit_button').off('click');
    $('#assembly_screen_back_button').off('click');
    $('#assembly_screen_undo_button').off('click');
    $('#clear_ballot_button').off('click');
    $('#confirm_clear_back_button').off('click');
    $('#confirm_clear_ok_button').off('click');
    $('#switch_to_audio_option').off('click');
  },
  
  /**
   * Attach all button handlers for this screen and all popup screens within this context.
   */
  attachButtonHandlers: function () {

    /**
     * HELP SCREENS
     */
    $('#ballot_help_modal_back_button').click(function() {
      $('#ballot_help_modal_container').hide();
      $('#ballot_help_modal_background').hide();
      $('#ballot_help_modal_header').hide();
      $('#ballot_help_modal_footer').hide();
    }); 
    
    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var uncontestedDistrict = votingSession.getDistrictIsUncontested();

    if (!uncontestedDistrict) {
      $('#ballot_help_modal_help_button').show();
    } else {
      $('#ballot_help_modal_help_button').hide();
    }
    
    $('#clear_ballot_button').click(function() {
      $('#confirm_clear_ballot_modal_background').show();
      $('#confirm_clear_ballot_modal_container').show();
      $('#confirm_clear_ballot_modal_header').show();
      $('#confirm_clear_ballot_modal_footer').show();
    });
    
    $('#confirm_clear_back_button').click(function() {
      $('#confirm_clear_ballot_modal_background').hide();
      $('#confirm_clear_ballot_modal_container').hide();
      $('#confirm_clear_ballot_modal_header').hide();
      $('#confirm_clear_ballot_modal_footer').hide();
    });
    
    $('#confirm_clear_ok_button').click(function() {
      var container = getContainer();
      var legislativeAssemblyBallot = container.Resolve("assembly");
      legislativeAssemblyBallot.reset();
      
      var visualView = container.Resolve("visualView");
      visualView.clearBallot(legislativeAssemblyBallot);
          
      $('#confirm_clear_ballot_modal_background').hide();
      $('#confirm_clear_ballot_modal_container').hide();
      $('#confirm_clear_ballot_modal_header').hide();
      $('#confirm_clear_ballot_modal_footer').hide();

      $('#ballot_help_modal_container').hide();
      $('#ballot_help_modal_background').hide();
      $('#ballot_help_modal_header').hide();
      $('#ballot_help_modal_footer').hide();
    });

    $("#assembly_screen_help_button").click(function() {     

      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $('#ballot_help_modal_background').show();
      $('#ballot_help_modal_container').show();
      $('#ballot_help_modal_header').show();
      $('#ballot_help_modal_footer').show();
      
      var assemblyBallotView = container.Resolve('assemblyBallotView');
      assemblyBallotView.setHelpMessage();
    });   
    
    $("#switch_to_audio_option").click(function() {
          
      $('#confirm_clear_ballot_modal_background').hide();
      $('#confirm_clear_ballot_modal_container').hide();
      $('#confirm_clear_ballot_modal_header').hide();
      $('#confirm_clear_ballot_modal_footer').hide();

      $('#ballot_help_modal_container').hide();
      $('#ballot_help_modal_background').hide();
      $('#ballot_help_modal_header').hide();
      $('#ballot_help_modal_footer').hide();

      $('#warning_modal_container').hide();
      $('#warning_modal_background').hide();
      $('#warning_modal_header').hide();
      $('#warning_modal_footer').hide();
        
      switchToAudioInterface();
    });
    
    /**
     * WARNING SCREEN
     */
    $('#warning_modal_back_button').click(function() { 
      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $('#warning_modal_container').hide();
      $('#warning_modal_background').hide();
      $("#warning_modal_header").hide();
      $("#warning_modal_footer").hide();
    }); 
    
    $('#warning_modal_proceed_button').click(function() {
      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $('#warning_modal_container').hide();
      $('#warning_modal_background').hide();
      $("#warning_modal_header").hide();
      $("#warning_modal_footer").hide();

      // if region is uncontested, go straight to the confirmation screen.
      var votingSession = container.Resolve('votingSession');
      var regionIsUncontested = votingSession.getRegionIsUncontested();
        
      // if region ballot is contested, go straight to confirmation screen.
      if (regionIsUncontested) {
        var visualView = container.Resolve('visualView');
        visualView.displaySection('legislative_assembly_candidate_vote_screen', 'confirm_selections_screen');    
        
      } else {
        // if already visited, go straight to L.C screen, else display choice fork.
        var screenFactory = container.Resolve("screenFactory");
        var screenObject = screenFactory.getInstance('atl_btl_choice_screen');
        if (screenObject.hasVisited()) {
          var visualView = container.Resolve('visualView');
          visualView.displaySection('legislative_assembly_candidate_vote_screen', 'legislative_council_combined_screen');    
        } else {
          var visualView = container.Resolve('visualView');
          visualView.displaySection('legislative_assembly_candidate_vote_screen', 'atl_btl_choice_screen');    
        }
      }
    });

    $("#warning_modal_help_button").click(function() { 
      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $('#ballot_help_modal_background').show();
      $('#ballot_help_modal_container').show();
      $('#ballot_help_modal_header').show();
      $('#ballot_help_modal_footer').show();

      var assemblyBallotView = container.Resolve('assemblyBallotView');
      assemblyBallotView.setHelpMessage();
    }); 

    $('#assembly_button_scroll_up').bind("touchstart", function() {
      var container = getContainer();
      var assemblyBallotView = container.Resolve('assemblyBallotView');
      if (assemblyBallotView.upArrowOff) {
        assemblyBallotView.upArrowOff = false;
        assemblyBallotView.holdUpArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var assemblyBallotView = container.Resolve('assemblyBallotView');
      assemblyBallotView.upArrowOff = true;
      window.clearTimeout(assemblyBallotView.upArrowHeld);
    });

    $('#assembly_button_scroll_down').bind("touchstart", function() {
      var container = getContainer();
      var assemblyBallotView = container.Resolve('assemblyBallotView');
      if (assemblyBallotView.downArrowOff) {
        assemblyBallotView.downArrowOff = false;
        assemblyBallotView.holdDownArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var assemblyBallotView = container.Resolve('assemblyBallotView');
      assemblyBallotView.downArrowOff = true;
      window.clearTimeout(assemblyBallotView.downArrowHeld);
    });

    /**
     * NAVIGATION BUTTONS
     */
    $('#assembly_screen_undo_button').click(function() {
      // scroll the ballot to the box that was just unselected.
      var container = getContainer();
      var ballotManager = container.Resolve('ballotManager');    
      var ballotBoxId = ballotManager.getHighestCandidateBallotBoxId(LEGISLATIVE_ASSEMBLY_BALLOT);
      var boxPosition = $('#' + ballotBoxId)[0].offsetTop;
      $('#assembly_ballot_container').animate({scrollTop:  boxPosition}, 0);

      window.setTimeout(function(){
        ballotManager.undoAction(LEGISLATIVE_ASSEMBLY_BALLOT);
      }, 500); 
    }); 

    $("#assembly_screen_quit_button").click(function() {     

      $('#assembly_ballot_content_inner').scrollTop(0);          
      $('#assembly_ballot_container').scrollTop(0);

      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      var visualView = container.Resolve('visualView');
      var assemblyBallotView = container.Resolve('assemblyBallotView');
      visualView.displayQuitConfirmation(assemblyBallotView.quitApplication, 
        'legislative_assembly_candidate_vote_screen',
        function () { 
          var container = getContainer();
          var visualView = container.Resolve('visualView');
          visualView.closeQuitConfirmation();
        });
    });   
    
    $('#assembly_popup_back_button').click(function() {    
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      var visualView = container.Resolve('visualView');
      visualView.displaySection('legislative_assembly_candidate_vote_screen', 'start_screen');
    }); 
    
    $('#assembly_screen_back_button').click(function() {    
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      var visualView = container.Resolve('visualView');
      visualView.displaySection('legislative_assembly_candidate_vote_screen', 'start_screen');
    }); 

    $('#assembly_screen_next_button').click(function() {

      $('#assembly_ballot_content_inner').scrollTop(0);          
      $('#assembly_ballot_container').scrollTop(0);          

      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();
      
      var legislativeAssemblyBallot = container.Resolve('assembly'); 
      var numCandidatesSelected = legislativeAssemblyBallot.getHighestSelection();      

      var votingSession = container.Resolve("votingSession");
      var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();
      
      if (numCandidatesSelected < maxAssemblyCandidatesRequired) {
        $('#warning_modal_background').show();
        $('#warning_modal_container').show();
        $("#warning_modal_header").show();
        $("#warning_modal_footer").show();

        if (audioController.getUsingAudioMode()) {
          var audioClips = getVisualUiIntroductionAudio('informal_vote_warning');
          if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
            audioController.playTranslatedAudio(audioClips, false);
          }
        }

        var assemblyBallotView = container.Resolve('assemblyBallotView');
        assemblyBallotView.setInformalWarning();
        
      } else {
      
        // if region is uncontested, go straight to the confirmation screen.
        var votingSession = container.Resolve('votingSession');
        var regionIsUncontested = votingSession.getRegionIsUncontested();
        
        if (regionIsUncontested) {
          var visualView = container.Resolve('visualView');
          visualView.displaySection('legislative_assembly_candidate_vote_screen', 'confirm_selections_screen');    
        } else {
          // if already visited, go straight to L.C screen, else display choice fork.
          var screenFactory = container.Resolve("screenFactory");
          var screenObject = screenFactory.getInstance('atl_btl_choice_screen');
          if (screenObject.hasVisited()) {
            var visualView = container.Resolve('visualView');
            visualView.displaySection('legislative_assembly_candidate_vote_screen', 'legislative_council_combined_screen');    
          } else {
            var visualView = container.Resolve('visualView');
            visualView.displaySection('legislative_assembly_candidate_vote_screen', 'atl_btl_choice_screen');    
          }
        }      
      }
    });

    /**
     * STANDARD CLOSE BUTTONS
     */
    $('#assembly_instruction_ok_button').click(function() { 
      // Play screen intro audio.
      var container = getContainer();
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('legislative_assembly_candidate_vote_screen');
      var assemblyBallotView = container.Resolve('assemblyBallotView');      
      var hasSeenVideo = assemblyBallotView.getHasSeenVideo();

      // If this is the first time seeing the gesture video, hide the popup and play the intro audio for L.A.
      if (!hasSeenVideo) {
        var audioController = container.Resolve("audioController");    
        var audioClips = getVisualUiIntroductionAudio('legislative_assembly_candidate_vote_screen');
        if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
          audioController.playTranslatedAudio(audioClips, false);
        }

        assemblyBallotView.setHasSeenVideo(true);
      }

      $('#assembly_instruction_container').hide();
      $('#assembly_instruction_background').hide();
      $('#assembly_instruction_footer').hide();

      var visualView = container.Resolve('visualView');
      visualView.stopVideo("assembly_instructions_video");
    }); 
  },
  
  setHasSeenVideo: function (hasSeen) {
    this.hasSeenVideo = hasSeen;
  },
  
  getHasSeenVideo: function () {
    return this.hasSeenVideo;
  },
  
  setHelpMessage: function () {
    var container = getContainer();
    var legislativeAssemblyBallot = container.Resolve('assembly'); 
    var numCandidatesSelected = legislativeAssemblyBallot.getHighestSelection();

    var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
    var headingString = $.i18n._(languageDictionary['assembly_help_modal_title']);
    $('#ballot_help_modal_title').html(headingString);

    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();
        
    var warningString = '';

    // If the user has not selected ANY candidates.
    if (numCandidatesSelected == 0) {
    
      var assemblyHelpString1 = null; 
      var assemblyHelpString2 = null; 
      var assemblyHelpString3 = null;

      var container = getContainer();
      var votingSession = container.Resolve("votingSession");
      var isUncontested = votingSession.getDistrictIsUncontested();

      if (!isUncontested) {
        assemblyHelpString1 = $.i18n._(languageDictionary['assembly_help_message_1a']);
        assemblyHelpString2 = $.i18n._(languageDictionary['assembly_help_message_2a']);
        assemblyHelpString3 = $.i18n._(languageDictionary['assembly_help_message_3a']);
      } else {
        assemblyHelpString1 = $.i18n._(languageDictionary['uncontested_assembly_help_message_1a']);
        assemblyHelpString2 = $.i18n._(languageDictionary['uncontested_assembly_help_message_2a']);
        assemblyHelpString3 = $.i18n._(languageDictionary['uncontested_assembly_help_message_3a']);
      }

      if (getLanguageDirection() == "rtl") {
        warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + assemblyHelpString1 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + assemblyHelpString2 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + assemblyHelpString3 + '</p>';
      } else {
        warningString = '<p class="invert_color warning_text">' + assemblyHelpString1 + '</p>' +
          '<p class="invert_color warning_text">' + assemblyHelpString2 + '</p>' +
          '<p class="invert_color warning_text">' + assemblyHelpString3 + '</p>';
      }
      
    // If the user has not selected enough candidates.
    } else if (numCandidatesSelected < maxAssemblyCandidatesRequired) {

      var missingCandidateCount = maxAssemblyCandidatesRequired - numCandidatesSelected;
      var assemblyHelpString1 = "";

      // Determine language plurality differences.          
      if (missingCandidateCount == 1) {
        assemblyHelpString1 = vsprintf(languageDictionary['assembly_help_message_1b_single'], [missingCandidateCount]);
      } else if (missingCandidateCount == 2) {
        assemblyHelpString1 = vsprintf(languageDictionary['assembly_help_message_1b_dual'], [missingCandidateCount]);
      } else {
        assemblyHelpString1 = vsprintf(languageDictionary['assembly_help_message_1b_multiple'], [missingCandidateCount]);
      }
      
      var assemblyHelpString2 = $.i18n._(languageDictionary['assembly_help_message_2b']);

      if (getLanguageDirection() == "rtl") {
        warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + assemblyHelpString1 + '</p>' +
          '<p class="invert_color warning_text">' + assemblyHelpString2 + '</p>';
      } else {
        warningString = '<p class="invert_color warning_text">' + assemblyHelpString1 + '</p>' +
          '<p class="invert_color warning_text">' + assemblyHelpString2 + '</p>';
      }

    // If the user has selected enough candidates.
    } else {

      var assemblyHelpString1 = $.i18n._(languageDictionary['assembly_help_message_1c']);
      var assemblyHelpString2 = $.i18n._(languageDictionary['assembly_help_message_2c']);
      var assemblyHelpString3 = $.i18n._(languageDictionary['assembly_help_message_3c']);

      if (getLanguageDirection() == "rtl") {
        warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + assemblyHelpString1 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + assemblyHelpString2 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + assemblyHelpString3 + '</p>';      
      } else {
        warningString = '<p class="invert_color warning_text">' + assemblyHelpString1 + '</p>' +
          '<p class="invert_color warning_text">' + assemblyHelpString2 + '</p>' +
          '<p class="invert_color warning_text">' + assemblyHelpString3 + '</p>';      
      }
    }

    $('#ballot_help_modal_message').html(warningString);
  },
  
  setMoreHelpMessage: function () {

    var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
    var headingString = $.i18n._(languageDictionary['assembly_more_help_modal_title']);
    $('#more_help_modal_title').html(headingString);

    var moreHelpString1 = null;
    var moreHelpString2 = null;
    var moreHelpString3 = null;
    var moreHelpString4 = null;

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var isUncontested = votingSession.getDistrictIsUncontested();

    if (!isUncontested) {    
      moreHelpString1 = $.i18n._(languageDictionary['assembly_more_help_message_1']);
      moreHelpString2 = $.i18n._(languageDictionary['assembly_more_help_message_2']);
      moreHelpString3 = $.i18n._(languageDictionary['assembly_more_help_message_3']);
      moreHelpString4 = $.i18n._(languageDictionary['assembly_more_help_message_4']);
    } else {
      moreHelpString1 = $.i18n._(languageDictionary['uncontested_assembly_more_help_message_1']);
      moreHelpString2 = $.i18n._(languageDictionary['uncontested_assembly_more_help_message_2']);
      moreHelpString3 = $.i18n._(languageDictionary['uncontested_assembly_more_help_message_3']);
      moreHelpString4 = $.i18n._(languageDictionary['uncontested_assembly_more_help_message_4']);
    }

    if (getLanguageDirection() == "rtl") {
      var messageString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + moreHelpString1 + '</p>';
      messageString += '<ol><li class="invert_color" style="text-align: right;" DIR="RTL">' + moreHelpString2 + '</li>';
      messageString += '<li class="invert_color" style="text-align: right;" DIR="RTL">' + moreHelpString3 + '</li>';      
      messageString += '<li class="invert_color" style="text-align: right;" DIR="RTL">' + moreHelpString4 + '</li></ol>';
      $('#more_help_modal_message').html(messageString);
    } else {
      var messageString = '<p class="invert_color warning_text" style="text-align: left;" DIR="LTR">' + moreHelpString1 + '</p>';
      messageString += '<ol><li class="invert_color" style="text-align: left;" DIR="LTR">' + moreHelpString2 + '</li>';
      messageString += '<li class="invert_color" style="text-align: left;" DIR="LTR">' + moreHelpString3 + '</li>';      
      messageString += '<li class="invert_color" style="text-align: left;" DIR="LTR">' + moreHelpString4 + '</li></ol>';
      $('#more_help_modal_message').html(messageString);
    }
  },

  showGestureVideo: function () {
    $('#assembly_instruction_background').show();
    $('#assembly_instruction_container').show();
    $('#assembly_instruction_footer').show();

    var visualView = container.Resolve('visualView');
    visualView.playVideo("assembly_instructions_video", "videos/gesture_demonstration.ogv");
  },

  quitApplication: function() {  

    var container = getContainer();
    var visualView = container.Resolve('visualView');
    visualView.closeQuitConfirmation();

    var visualController = container.Resolve("visualController");
    visualController.quitApplication();
  },

  setInformalWarning: function () {

    // Check that the user has selected the required number of candidates to safely continue, else display warning.
    var container = getContainer();
    var legislativeAssemblyBallot = container.Resolve('assembly'); 
    var numCandidatesSelected = legislativeAssemblyBallot.getHighestSelection();
    var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();

    // If the user hasn't selected ANY candidates.
    if (numCandidatesSelected == 0) {
    
      var headingString = $.i18n._(languageDictionary['assembly_no_candidates']);
      var missingCandidateCount = maxAssemblyCandidatesRequired - numCandidatesSelected;
    
//      $('#warning_modal_title').html(headingString);
    
      var proceedWarningString1 = $.i18n._(languageDictionary['proceed_warning_string_1a']);
      var proceedWarningString2 = $.i18n._(languageDictionary['proceed_warning_string_2a']);
      var proceedWarningString3 = $.i18n._(languageDictionary['proceed_warning_string_3a']);
    
      var warningString;
    
      if (getLanguageDirection() == "rtl") {
        warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + proceedWarningString1 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + proceedWarningString2 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + proceedWarningString3 + '</p>';
      } else {
        warningString = '<p class="invert_color warning_text">' + proceedWarningString1 + '</p>' +
          '<p class="invert_color warning_text">' + proceedWarningString2 + '</p>' +
          '<p class="invert_color warning_text">' + proceedWarningString3 + '</p>';
      }

      $('#warning_modal_message').html(warningString);
      
    // If the user hasn't selected enough candidates.
    } else if (numCandidatesSelected < maxAssemblyCandidatesRequired) {
    
      var missingCandidateCount = maxAssemblyCandidatesRequired - numCandidatesSelected;
      var headingString = "";

      // Determine language plurality differences.          
      if (missingCandidateCount == 1) {
        headingString = vsprintf(languageDictionary['assembly_missing_candidates_single'], [missingCandidateCount]);
      } else if (missingCandidateCount == 2) {
        headingString = vsprintf(languageDictionary['assembly_missing_candidates_dual'], [missingCandidateCount]);
      } else {
        headingString = vsprintf(languageDictionary['assembly_missing_candidates_multiple'], [missingCandidateCount]);
      }
    
//      $('#warning_modal_title').html(headingString);

      var proceedWarningString1 = $.i18n._(languageDictionary['proceed_warning_string_1b']);
      var proceedWarningString2 = $.i18n._(languageDictionary['proceed_warning_string_2b']);
      var proceedWarningString3 = $.i18n._(languageDictionary['proceed_warning_string_3b']);

      if (getLanguageDirection() == "rtl") {
        warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + proceedWarningString1 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + proceedWarningString2 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + proceedWarningString3 + '</p>';
      } else {
        warningString = '<p class="invert_color warning_text">' + proceedWarningString1 + '</p>' +
          '<p class="invert_color warning_text">' + proceedWarningString2 + '</p>' +
          '<p class="invert_color warning_text">' + proceedWarningString3 + '</p>';
      }
    
      $('#warning_modal_message').html(warningString);
    }
  },
  
  // Smoothly scroll ballot when hold down arrow button.
  holdDownArrow: function () {

    var container = getContainer();
    var assemblyBallotView = container.Resolve('assemblyBallotView');

    window.clearTimeout(assemblyBallotView.upArrowHeld);
  
    if (assemblyBallotView.downArrowOff) {
      return;
    }

    var innerHeight = $('#assembly_ballot_container')[0].scrollHeight;
    var outerHeight = $('#assembly_ballot_container').height();

    if (innerHeight > outerHeight) {
      var maxTopPos = innerHeight - outerHeight;
      var topPos = $('#assembly_ballot_container').scrollTop();

      if (topPos >= maxTopPos) {
        window.clearTimeout(assemblyBallotView.downArrowHeld);
        return;
      }
    }

    var topVal = $('#assembly_ballot_container').scrollTop();
    $('#assembly_ballot_container').animate({scrollTop: topVal + 40}, 10, "linear");
    assemblyBallotView.downArrowHeld = window.setTimeout(function () { assemblyBallotView.holdDownArrow(); }, 100);
  },

  // Smoothly scroll ballot when hold down arrow button.
  holdUpArrow: function () {

    var container = getContainer();
    var assemblyBallotView = container.Resolve('assemblyBallotView');

    window.clearTimeout(assemblyBallotView.downArrowHeld);

    if (assemblyBallotView.upArrowOff) {
      return;
    }
  
    var topPos = $('#assembly_ballot_container').scrollTop();
    if (topPos = 0) {
      window.clearTimeout(assemblyBallotView.upArrowHeld);
      return;
    }

    var topVal = $('#assembly_ballot_container').scrollTop();
    $('#assembly_ballot_container').animate({scrollTop: topVal - 40}, 10, "linear");
    assemblyBallotView.upArrowHeld = window.setTimeout(function () { assemblyBallotView.holdUpArrow(); }, 100);
  }
});

