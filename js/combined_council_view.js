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
 * Combined Council View class.  This class is responsible for maintaining 
 * the UI logic of the combined ballot screen. 
 * Importatnt to note that the id's and styles are specifically used for the Combined Council Screen. 
 * 
 * @author Peter Scheffer
 */ 
var CombinedCouncilView = Class.extend({    
  
  init: function () {
    $('#ballot_help_modal_panel').scrollTop(0);          
    $('#ballot_help_modal_container').hide();
    $('#ballot_help_modal_background').hide();
    $('#warning_modal_container').hide();
    $('#warning_modal_background').hide();
    $("#warning_modal_header").hide();
    $("#warning_modal_footer").hide();
    $("#confirmation_modal_container").hide();
    $("#confirmation_modal_background").hide();
    $("#confirmation_modal_header").hide();
    $("#confirmation_modal_footer").hide();
    
    this.alreadyHeardAtlAudio = false;
    this.alreadyHeardBtlAudio = false;

    this.upArrowHeld;
    this.downArrowHeld;
    this.downArrowOff = true;
    this.upArrowOff = true;
    this.rightArrowOff = true;
    this.leftArrowOff = true;
    this.switchTime = null;

    $('#ballot_combined_content').bind('scroll resize', function() { 
      var container = getContainer();
      var combinedCouncilView = container.Resolve('combined');
      combinedCouncilView.checkBtnVis();
    });
  },

  reset: function () {
    this.init();
    $("#ballot_combined_content").scrollLeft(0);
    $("#ballot_combined_content").scrollTop(0);
  },

  displayAboveTheLineSection: function () {
    
    $("#atl_btl_switch_bar").show();
    $("#btl_atl_switch_bar").hide();

    $(".btl_box").css('visibility', 'hidden');
    $(".atl_box").css('visibility', 'visible');

    $('#ballot_combined_content').animate({scrollTop:  0}, 0);

    var container = getContainer();
    var belowTheLineCouncilBallot = container.Resolve("btl"); 
    belowTheLineCouncilBallot.clear();

    var visualScreenManager = container.Resolve("visualScreenManager");
    visualScreenManager.setUserVotedAboveOrBelowTheLine("above"); 
    $('#ballot_groups_content').find('.btl_box').html("");

    var combinedCouncilView = container.Resolve("combined"); 
    combinedCouncilView.checkBtnVis();     
    combinedCouncilView.setAlreadyHeardAtlAudio(true);
  },
  
  displayBelowTheLineSection: function () {
    
    $("#btl_atl_switch_bar").show();
    $("#atl_btl_switch_bar").hide();

    $(".btl_box").css('visibility', 'visible');
    $(".atl_box").css('visibility', 'hidden');

    var container = getContainer();
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    aboveTheLineCouncilBallot.clear();

    var visualScreenManager = container.Resolve("visualScreenManager");
    visualScreenManager.setUserVotedAboveOrBelowTheLine("below"); 
    $('#ballot_groups_content').find('.atl_box').html("");

    var combinedCouncilView = container.Resolve("combined"); 
    combinedCouncilView.checkBtnVis();     
    combinedCouncilView.setAlreadyHeardBtlAudio(true);
  },
  
  /**
   * Detach all button handlers for this screen and all popup screens within this context.
   */
  detachButtonHandlers: function () {
    $('#ballot_help_modal_help_button').off('click');
    $('#ballot_help_modal_back_button').off('click');
    $('#submit_incomplete_button').off('click');
    $('#warning_modal_help_button').off('click');
    $('#warning_modal_back_button').off('click');
    $('#warning_modal_proceed_button').off('click');
    $('#atl_button_div').off('click');
    $('#btl_button_div').off('click');
    $('#council_screen_undo_button').off('click');
    $('#council_screen_back_button').off('click');
    $('#council_screen_next_button').off('click');
    $('#council_instruction_ok_button').off('click');
    $('#btnLeft').off('click');
    $('#btnRight').off('click');
    $('#btnUp').off('click');
    $('#btnDown').off('click');
    $('#clear_ballot_button').off('click');
    $('#confirm_clear_back_button').off('click');
    $('#confirm_clear_ok_button').off('click');
    $('#switch_to_audio_option').off('click');
  },
  
  /**
   * Attach all button handlers for this screen and all popup screens within this context.
   */
  attachButtonHandlers : function() {

    /**
     * HELP SCREENS
     */
    $('#ballot_help_modal_back_button').click(function() { 
      $('#ballot_help_modal_container').hide();
      $('#ballot_help_modal_background').hide();
      $('#ballot_help_modal_header').hide();
      $('#ballot_help_modal_footer').hide();
    }); 
    
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
      var visualView = container.Resolve("visualView");
      var visualScreenManager = container.Resolve("visualScreenManager");
      var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 

      if (userVotedAboveOrBelow == "above") {
        var aboveTheLineCouncilBallot = container.Resolve("atl");
        aboveTheLineCouncilBallot.clear();
        visualView.clearBallot(aboveTheLineCouncilBallot);
      } else {
        var belowTheLineCouncilBallot = container.Resolve("btl");
        belowTheLineCouncilBallot.clear();
        visualView.clearBallot(belowTheLineCouncilBallot);
      }
          
      $('#confirm_clear_ballot_modal_background').hide();
      $('#confirm_clear_ballot_modal_container').hide();
      $('#confirm_clear_ballot_modal_header').hide();
      $('#confirm_clear_ballot_modal_footer').hide();

      $('#ballot_help_modal_container').hide();
      $('#ballot_help_modal_background').hide();
      $('#ballot_help_modal_header').hide();
      $('#ballot_help_modal_footer').hide();
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
    $("#warning_modal_back_button").click(function() { 
      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $("#warning_modal_container").hide();
      $("#warning_modal_background").hide();
      $("#warning_modal_header").hide();
      $("#warning_modal_footer").hide();
      $("#warning_modal_help_button").show();

      var visualScreenManager = container.Resolve("visualScreenManager");
      var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 
    }); 
    
    $("#warning_modal_proceed_button").click(function() {      
      // Interrupt intro audio.
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $("#warning_modal_container").hide();
      $("#warning_modal_background").hide();
      $("#warning_modal_header").hide();
      $("#warning_modal_footer").hide();
      $("#warning_modal_help_button").show();   
      
      var visualView = container.Resolve('visualView');
      visualView.displaySection('legislative_council_combined_screen', 'confirm_selections_screen');
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

      var combinedBallotView = container.Resolve('combined');
      combinedBallotView.setHelpMessage();
    }); 

    /**
     * MORE HELP SCREEN
     */
    $('#paper_voting_button').click(function() { 
      $('#paper_voting_modal_background').show();
      $('#paper_voting_modal_container').show();
    }); 

    $('#submit_incomplete_button').click(function() { 
      $('#incomplete_vote_modal_background').show();
      $('#incomplete_vote_modal_container').show();
      
      checkIncompleteVoteScrollButtons();
    }); 

    $("#council_screen_help_button").click(function() {  
      // Interrupt intro audio.
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $('#ballot_help_modal_background').show();
      $('#ballot_help_modal_container').show();
      $('#ballot_help_modal_header').show();
      $('#ballot_help_modal_footer').show();
      
      var combinedBallotView = container.Resolve('combined');
      combinedBallotView.setHelpMessage();
    });   

    var combinedBallotView = container.Resolve('combined');

    $('#atl_btl_switch_bar').bind('touchstart', combinedBallotView.pressingAtlSwitchBar);
    $('#atl_btl_switch_bar').bind('touchend', combinedBallotView.unpressingAtlSwitchBar);

    $('#btl_atl_switch_bar').bind('touchstart', combinedBallotView.pressingBtlSwitchBar);
    $('#btl_atl_switch_bar').bind('touchend', combinedBallotView.unpressingBtlSwitchBar);

    $('#council_screen_undo_button').click(function() { 
      
      var visualScreenManager = container.Resolve("visualScreenManager");
      var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 
      var ballotManager = container.Resolve('ballotManager');
      var ballotBoxId = null;

      // If the user is switching from ATL to BTL.
      if (userVotedAboveOrBelow == "above") {
 
        var ballotBoxId = ballotManager.getHighestCandidateBallotBoxId(LEGISLATIVE_COUNCIL_GROUP_BALLOT);
        
        // scroll the ballot to the box that was just unselected.
        var boxPositionLeft = $('#' + ballotBoxId)[0].offsetParent.offsetLeft - 550;
        $('#ballot_combined_content').animate({scrollLeft: boxPositionLeft}, 0);

        var boxPositionTop = $('#' + ballotBoxId)[0].offsetTop - 200;
        $('#ballot_combined_content').animate({scrollTop: boxPositionTop}, 0);

      } else if (userVotedAboveOrBelow == "below") {

        var ballotBoxId = ballotManager.getHighestCandidateBallotBoxId(LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT);

        // scroll the ballot to the box that was just unselected.
        var boxPositionLeft = $('#' + ballotBoxId)[0].offsetParent.offsetLeft - 550;
        $('#ballot_combined_content').animate({scrollLeft: boxPositionLeft}, 0);

        var boxPositionTop = $('#' + ballotBoxId)[0].offsetTop - 200;
        $('#ballot_combined_content').animate({scrollTop: boxPositionTop}, 0);
      }      

      // If the user is switching from ATL to BTL.
      if (userVotedAboveOrBelow == "above") {

        window.setTimeout(function(){
          ballotManager.undoAction(LEGISLATIVE_COUNCIL_GROUP_BALLOT);
        }, 500); 

      } else if (userVotedAboveOrBelow == "below") {

        window.setTimeout(function(){
          ballotManager.undoAction(LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT);
        }, 500); 
      }
    }); 
    
    $("#council_screen_quit_button").click(function() { 

      // Interrupt intro audio.
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      var visualView = container.Resolve('visualView');
      var combined = container.Resolve('combined');
      visualView.displayQuitConfirmation(combined.quitApplication, 
        'legislative_council_combined_screen',
        function () { 
          var container = getContainer();
          var visualView = container.Resolve('visualView');
          visualView.closeQuitConfirmation();
        });
    });   
    
    $("#council_screen_back_button").click(function() { 

      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $("#ballot_combined_content").scrollLeft(0);
      $("#ballot_combined_content").scrollTop(0);

      var votingSession = container.Resolve("votingSession");
      var visualView = container.Resolve('visualView');

      visualView.displaySection('legislative_council_combined_screen', 'legislative_assembly_candidate_vote_screen');
    }); 
      
    $("#council_screen_next_button").click(function() {         

      $("#ballot_combined_content").scrollLeft(0);
      $("#ballot_combined_content").scrollTop(0);
      
      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      var councilBallotView = container.Resolve('combined');

      var visualScreenManager = container.Resolve("visualScreenManager");
      var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 

      // If the User opted to vote BTL.
      if (userVotedAboveOrBelow == "below") {
        var belowTheLineCouncilBallot = container.Resolve("btl"); 
        var numCandidatesSelected = belowTheLineCouncilBallot.getHighestSelection();

        // If the User failed to select the minimum number of candidates.
        if (numCandidatesSelected < MIN_COUNCIL_CANDIDATES_REQUIRED) {
          if (audioController.getUsingAudioMode()) {
            var audioClips = getVisualUiIntroductionAudio('informal_vote_warning');
            if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
              audioController.playTranslatedAudio(audioClips, false);
            }
          }
  
          $('#warning_modal_background').show();
          $('#warning_modal_container').show();
          $("#warning_modal_header").show();
          $("#warning_modal_footer").show();

          var combinedBallotView = container.Resolve('combined');
          combinedBallotView.setInformalWarning();
                    
        // Else User has completed this ballot.
        } else {

          // proceed - change to new screen when this one is completed.
          var visualView = container.Resolve('visualView');
          visualView.displaySection('legislative_council_combined_screen', 'confirm_selections_screen');
        }
  
      // If the User opted to vote ATL.
      } else if (userVotedAboveOrBelow == "above") {
        
        var aboveTheLineCouncilBallot = container.Resolve("atl");
        var atlSelection = aboveTheLineCouncilBallot.getSelection();
        
        // If the User failed to select the minimum number of groups.
        if (atlSelection == null) {
          if (audioController.getUsingAudioMode()) {
            var audioClips = getVisualUiIntroductionAudio('informal_vote_warning');
            if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
              audioController.playTranslatedAudio(audioClips, false);
            }
          }

          $('#warning_modal_background').show();
          $('#warning_modal_container').show();
          $("#warning_modal_header").show();
          $("#warning_modal_footer").show();

          var combinedBallotView = container.Resolve('combined');
          combinedBallotView.setInformalWarning();

        // Else User has completed this ballot.
        } else {

          // proceed - change to new screen when this one is completed.       
          var visualView = container.Resolve('visualView');
          visualView.displaySection('legislative_council_combined_screen', 'confirm_selections_screen');
        }

      // Else the User failed to choose either ATL or BTL.        
      } else {
        if (audioController.getUsingAudioMode()) {
          var audioClips = getVisualUiIntroductionAudio('informal_vote_warning');
          if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
            audioController.playTranslatedAudio(audioClips, false);
          }
        }
  
        $('#warning_modal_background').show();
        $('#warning_modal_container').show();
        $("#warning_modal_header").show();
        $("#warning_modal_footer").show();
        $('#warning_modal_help_button').hide();
  
        var combinedBallotView = container.Resolve('combined');
        combinedBallotView.setInformalWarning();
      }
    }); 

    $('#btnRight').bind("touchstart", function() {
      var container = getContainer();
      var combinedBallotView = container.Resolve('combined');
      if (combinedBallotView.rightArrowOff) {
        combinedBallotView.rightArrowOff = false;
        combinedBallotView.holdRightArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var combinedBallotView = container.Resolve('combined');
      combinedBallotView.rightArrowOff = true;
      window.clearTimeout(combinedBallotView.rightArrowHeld);
    });

    $('#btnLeft').bind("touchstart", function() {
      var container = getContainer();
      var combinedBallotView = container.Resolve('combined');
      if (combinedBallotView.leftArrowOff) {
        combinedBallotView.leftArrowOff = false;
        combinedBallotView.holdLeftArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var combinedBallotView = container.Resolve('combined');
      combinedBallotView.leftArrowOff = true;
      window.clearTimeout(combinedBallotView.leftArrowHeld);
    });

    $('#btnUp').bind("touchstart", function() {
      var container = getContainer();
      var combinedBallotView = container.Resolve('combined');
      if (combinedBallotView.upArrowOff) {
        combinedBallotView.upArrowOff = false;
        combinedBallotView.holdUpArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var combinedBallotView = container.Resolve('combined');
      combinedBallotView.upArrowOff = true;
      window.clearTimeout(combinedBallotView.upArrowHeld);
    });

    $('#btnDown').bind("touchstart", function() {
      var container = getContainer();
      var combinedBallotView = container.Resolve('combined');
      if (combinedBallotView.downArrowOff) {
        combinedBallotView.downArrowOff = false;
        combinedBallotView.holdDownArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var combinedBallotView = container.Resolve('combined');
      combinedBallotView.downArrowOff = true;
      window.clearTimeout(combinedBallotView.downArrowHeld);
    });
  },

  switchToAtl: function() {

      $(".btl_box").css('visibility', 'visible');
      $(".atl_box").css('visibility', 'hidden');

      // Play screen intro audio.
      var container = getContainer();
      var audioController = container.Resolve("audioController");    
      var combinedCouncilView = container.Resolve("combined");
      audioController.stopAudio();

      combinedCouncilView.checkBtnVis(); 
 
      var visualScreenManager = container.Resolve("visualScreenManager");
      var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 
 
      // If the user is switching from ATL to BTL.
      if (userVotedAboveOrBelow == "below") {

        var belowTheLineCouncilBallot = container.Resolve("btl");
        var numberSelected = belowTheLineCouncilBallot.getHighestSelection();
        
        if (numberSelected == 0) {
          // If user hasn't selected any candidates, then just switch without warning.
          if (audioController.getUsingAudioMode() && !combinedCouncilView.getAlreadyHeardAtlAudio()) {
            var audioClips = getVisualUiIntroductionAudio('legislative_council_combined_atl_screen');
            if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
              audioController.playTranslatedAudio(audioClips, false);
              combinedCouncilView.setAlreadyHeardAtlAudio(true);
            }
          }
        
          var combinedCouncilView = container.Resolve("combined");
          combinedCouncilView.displayAboveTheLineSection();
          
          return;
        }

        // attach handlers to confirmation dialog
        $('#confirmation_modal_back_button').click(function () {
          // Interrupt intro audio.
          var audioController = container.Resolve('audioController');
          audioController.stopAudio();

          $("#confirmation_modal_container").hide();
          $("#confirmation_modal_background").hide();
          $("#confirmation_modal_header").hide();
          $("#confirmation_modal_footer").hide();
        });
  
        $('#confirmation_modal_help_button').click(function () {
          // Interrupt intro audio.
          var audioController = container.Resolve('audioController');
          audioController.stopAudio();

          $("#confirmation_modal_container").hide();
          $("#confirmation_modal_background").hide();
          $("#confirmation_modal_header").hide();
          $("#confirmation_modal_footer").hide();
        });
  
        $('#confirmation_modal_proceed_button').click(function () {
          // Interrupt intro audio.
          var audioController = container.Resolve('audioController');
          audioController.stopAudio();

          $("#atl_btl_switch_bar").show();
          $("#btl_atl_switch_bar").hide();

          $("#confirmation_modal_container").hide();
          $("#confirmation_modal_background").hide();
          $("#confirmation_modal_header").hide();
          $("#confirmation_modal_footer").hide();

          if (audioController.getUsingAudioMode() && !combinedCouncilView.getAlreadyHeardAtlAudio()) {
            var audioClips = getVisualUiIntroductionAudio('legislative_council_combined_atl_screen');
            if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
              audioController.playTranslatedAudio(audioClips, false);
              combinedCouncilView.setAlreadyHeardAtlAudio(true);
            }
          }
  
          combinedCouncilView.displayAboveTheLineSection();
        });
        
        combinedCouncilView.setConfirmationMessage();
  
        $("#confirmation_modal_background").show();
        $("#confirmation_modal_container").show();
        $("#confirmation_modal_header").show();
        $("#confirmation_modal_footer").show();
        
      } else {

        $("#atl_btl_switch_bar").show();
        $("#btl_atl_switch_bar").hide();

        if (audioController.getUsingAudioMode() && !combinedCouncilView.getAlreadyHeardAtlAudio()) {
          var audioClips = getVisualUiIntroductionAudio('legislative_council_combined_atl_screen');
          if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
            audioController.playTranslatedAudio(audioClips, false);
            combinedCouncilView.setAlreadyHeardAtlAudio(true);
          }
        }
        
        var combinedCouncilView = container.Resolve("combined");
        combinedCouncilView.displayAboveTheLineSection();
      }
  },

  switchToBtl: function() {

      // Play screen intro audio.
      var container = getContainer();
      var audioController = container.Resolve("audioController");    
      audioController.stopAudio();

      var combinedCouncilView = container.Resolve("combined");
      combinedCouncilView.checkBtnVis(); 

      var visualScreenManager = container.Resolve("visualScreenManager");
      var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 
 
      // If the user is switching from ATL to BTL.
      if (userVotedAboveOrBelow == "above") {

        var aboveTheLineCouncilBallot = container.Resolve("atl");
        var atlSelection = aboveTheLineCouncilBallot.getSelection();
        
        // If user hasn't selected any groups, then just switch without warning.
        if (atlSelection == null) {
          if (audioController.getUsingAudioMode() && !combinedCouncilView.getAlreadyHeardBtlAudio()) {
            var audioClips = getVisualUiIntroductionAudio('legislative_council_combined_btl_screen');
            if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
              audioController.playTranslatedAudio(audioClips, false);
              combinedCouncilView.setAlreadyHeardBtlAudio(true);
            }
          }
        
          var combinedCouncilView = container.Resolve("combined");
          combinedCouncilView.displayBelowTheLineSection();
      
          $(".btl_box").css('visibility', 'visible');
          $(".atl_box").css('visibility', 'hidden');
          
          return;
        }
  
        // attach handlers to confirmation dialog
        $('#confirmation_modal_back_button').click(function () {
          $("#confirmation_modal_container").hide();
          $("#confirmation_modal_background").hide();
          $("#confirmation_modal_header").hide();
          $("#confirmation_modal_footer").hide();
        });
  
        $('#confirmation_modal_help_button').click(function () {
          $("#confirmation_modal_container").hide();
          $("#confirmation_modal_background").hide();
          $("#confirmation_modal_header").hide();
          $("#confirmation_modal_footer").hide();
        });
  
        $('#confirmation_modal_proceed_button').click(function () {
          $("#confirmation_modal_container").hide();
          $("#confirmation_modal_background").hide();
          $("#confirmation_modal_header").hide();
          $("#confirmation_modal_footer").hide();
    
          $("#atl_btl_switch_bar").show();
          $("#btl_atl_switch_bar").hide();

          if (audioController.getUsingAudioMode() && !combinedCouncilView.getAlreadyHeardBtlAudio()) {
            var audioClips = getVisualUiIntroductionAudio('legislative_council_combined_btl_screen');
            if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
              audioController.playTranslatedAudio(audioClips, false);
              combinedCouncilView.setAlreadyHeardBtlAudio(true);
            }
          }
  
          combinedCouncilView.displayBelowTheLineSection();
      
          $(".btl_box").css('visibility', 'visible');
          $(".atl_box").css('visibility', 'hidden');
        });
        
        combinedCouncilView.setConfirmationMessage();
  
        $("#confirmation_modal_background").show();
        $("#confirmation_modal_container").show();
        $("#confirmation_modal_header").show();
        $("#confirmation_modal_footer").show();
  
      } else {

        $("#atl_btl_switch_bar").show();
        $("#btl_atl_switch_bar").hide();

        if (audioController.getUsingAudioMode() && !combinedCouncilView.getAlreadyHeardBtlAudio()) {
          var audioClips = getVisualUiIntroductionAudio('legislative_council_combined_btl_screen');
          if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
            audioController.playTranslatedAudio(audioClips, false);
            combinedCouncilView.setAlreadyHeardBtlAudio(true);
          }
        }
        
        var combinedCouncilView = container.Resolve("combined");
        combinedCouncilView.displayBelowTheLineSection();
      }
  },
  
  setConfirmationMessage: function () {
      
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 
 
    // If the user is switching from ATL to BTL.
    if (userVotedAboveOrBelow == "above") {
      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
      var headingString = $.i18n._(languageDictionary['candidate_voting_modal_title']);
      $('#confirmation_modal_title').html(headingString);
  
      var confirmMessage1 = $.i18n._(languageDictionary['candidate_voting_modal_message_1']);
      var confirmMessage2 = $.i18n._(languageDictionary['candidate_voting_modal_message_2']);
  
      var confirmMessage;
      
      if (getLanguageDirection() == "rtl") {
        confirmMessage = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + confirmMessage1 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + confirmMessage2 + '</p>';
      } else {
        confirmMessage = '<p class="invert_color warning_text">' + confirmMessage1 + '</p>' +
          '<p class="invert_color warning_text">' + confirmMessage2 + '</p>';
      }
        
      $('#confirmation_modal_message').html(confirmMessage);
    } else {
      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
      var headingString = $.i18n._(languageDictionary['group_voting_modal_title']);
      $('#confirmation_modal_title').html(headingString);
  
      var confirmMessage1 = $.i18n._(languageDictionary['group_voting_modal_message_1']);
      var confirmMessage2 = $.i18n._(languageDictionary['group_voting_modal_message_2']);
 
      var confirmMessage;
  
      if (getLanguageDirection() == "rtl") {
        confirmMessage = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + confirmMessage1 + '</p>' +
          '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + confirmMessage2 + '</p>';
      } else {
        confirmMessage = '<p class="invert_color warning_text">' + confirmMessage1 + '</p>' +
          '<p class="invert_color warning_text">' + confirmMessage2 + '</p>';
      }
        
      $('#confirmation_modal_message').html(confirmMessage);
    }
  },

  setInformalWarning: function () {

      var councilBallotView = container.Resolve('combined');
      var visualScreenManager = container.Resolve("visualScreenManager");
      var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 
      var audioController = container.Resolve('audioController');
      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
  
      var warningString = '';
      var councilWarningString1 = '';
      var councilWarningString2 = '';
      var councilWarningString3 = '';
      
      // If the User opted to vote BTL.
      if (userVotedAboveOrBelow == "below") {
        var belowTheLineCouncilBallot = container.Resolve("btl"); 
        var numCandidatesSelected = belowTheLineCouncilBallot.getHighestSelection();
        
        // If the User failed to select the minimum number of candidates.
        if (numCandidatesSelected < MIN_COUNCIL_CANDIDATES_REQUIRED) {
  
          if (audioController.getUsingAudioMode()) {
            var audioClips = getVisualUiIntroductionAudio('informal_vote_warning');
            if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
              audioController.playTranslatedAudio(audioClips, false);
            }
          }

          var missingCandidateCount = MIN_COUNCIL_CANDIDATES_REQUIRED - numCandidatesSelected;
          var headingString = "";

          // Determine language plurality differences.          
          if (missingCandidateCount == 1) {
            headingString = vsprintf(languageDictionary['council_candidates_warning_modal_title_single'], [missingCandidateCount]);
          } else if (missingCandidateCount == 2) {
            headingString = vsprintf(languageDictionary['council_candidates_warning_modal_title_dual'], [missingCandidateCount]);
          } else {
            headingString = vsprintf(languageDictionary['council_candidates_warning_modal_title_multiple'], [missingCandidateCount]);
          }
          
          councilHelpString1 = vsprintf(languageDictionary['council_candidates_warning_message_1'], [MIN_COUNCIL_CANDIDATES_REQUIRED]);
          councilHelpString2 = $.i18n._(languageDictionary['council_candidates_warning_message_2']);
  
          if (getLanguageDirection() == "rtl") {
            warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString1 + '</p>' +
              '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString2 + '</p>';
          } else {
            warningString = '<p class="invert_color warning_text">' + councilHelpString1 + '</p>' +
              '<p class="invert_color warning_text">' + councilHelpString2 + '</p>';
          }
        }
  
      // If the User opted to vote ATL.
      } else if (userVotedAboveOrBelow == "above") {
        
        var aboveTheLineCouncilBallot = container.Resolve("atl");
        var atlSelection = aboveTheLineCouncilBallot.getSelection();
        var headingString = $.i18n._(languageDictionary['council_groups_warning_modal_title']);
        
        // If the User failed to select the minimum number of groups.
        if (atlSelection == null) {

          councilHelpString1 = vsprintf(languageDictionary['council_groups_warning_message_1'], [MIN_COUNCIL_GROUPS_REQUIRED]);
          councilHelpString2 = $.i18n._(languageDictionary['council_groups_warning_message_2']);
          councilHelpString3 = $.i18n._(languageDictionary['council_groups_warning_message_3']);
          
          if (getLanguageDirection() == "rtl") {
            warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString1 + '</p>' +
              '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString2 + '</p>' +
              '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString3 + '</p>';
          } else {
            warningString = '<p class="invert_color warning_text">' + councilHelpString1 + '</p>' +
              '<p class="invert_color warning_text">' + councilHelpString2 + '</p>' +
              '<p class="invert_color warning_text">' + councilHelpString3 + '</p>';
          }
        }

      // Else the User failed to choose either ATL or BTL.        
      } else {
        if (audioController.getUsingAudioMode()) {
          var audioClips = getVisualUiIntroductionAudio('informal_vote_warning');
          if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
            audioController.playTranslatedAudio(audioClips, false);
          }
        }

        var councilWarningString1 = sprintf(languageDictionary["council_warning_message_1"], MIN_COUNCIL_GROUPS_REQUIRED, MIN_COUNCIL_CANDIDATES_REQUIRED);
        var councilWarningString2 = $.i18n._(languageDictionary['council_warning_message_2']);
        
        if (getLanguageDirection() == "rtl") {
          warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilWarningString1 + '</p>' +
            '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilWarningString2 + '</p>';
        } else {
          warningString = '<p class="invert_color warning_text">' + councilWarningString1 + '</p>' +
            '<p class="invert_color warning_text">' + councilWarningString2 + '</p>';
        }
      }
      
      $('#warning_modal_message').html(warningString);
  },
  
  setHelpMessage: function () {

    var visualScreenManager = container.Resolve("visualScreenManager");
    var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 

    var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
    var headingString = $.i18n._(languageDictionary['council_help_modal_title']);
    $('#ballot_help_modal_title').html(headingString);

    var warningString = '';
    var councilHelpString1 = '';
    var councilHelpString2 = '';
    var councilHelpString3 = '';
    
    if (userVotedAboveOrBelow == "below") {
      var belowTheLineCouncilBallot = container.Resolve("btl"); 
      var numCandidatesSelected = belowTheLineCouncilBallot.getHighestSelection();
      
      if (numCandidatesSelected < MIN_COUNCIL_CANDIDATES_REQUIRED) {
        
        var missingCandidateCount = MIN_COUNCIL_CANDIDATES_REQUIRED - numCandidatesSelected;
        var councilHelpString1 = "";

        // Determine language plurality differences.          
        if (missingCandidateCount == 1) {
          councilHelpString1 = vsprintf(languageDictionary['council_btl_selected_help_message_1_single'], [missingCandidateCount]);
        } else if (missingCandidateCount == 2) {
          councilHelpString1 = vsprintf(languageDictionary['council_btl_selected_help_message_1_dual'], [missingCandidateCount]);
        } else {
          councilHelpString1 = vsprintf(languageDictionary['council_btl_selected_help_message_1_multiple'], [missingCandidateCount]);
        }
        
        councilHelpString2 = vsprintf(languageDictionary['council_btl_selected_help_message_2'], [MIN_COUNCIL_CANDIDATES_REQUIRED]);
        councilHelpString3 = $.i18n._(languageDictionary['council_btl_selected_help_message_3']);

        if (getLanguageDirection() == "rtl") {
          warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString1 + '</p>' +
            '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString2 + '</p>' +
            '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString2 + '</p>';
        } else {
          warningString = '<p class="invert_color warning_text" style="text-align: left;" DIR="LTR">' + councilHelpString1 + '</p>' +
            '<p class="invert_color warning_text" style="text-align: left;" DIR="LTR">' + councilHelpString2 + '</p>' +
            '<p class="invert_color warning_text" style="text-align: left;" DIR="LTR">' + councilHelpString2 + '</p>';
        }          
      } else {
        
        councilHelpString1 = $.i18n._(languageDictionary['council_btl_completed_help_message_1']);
        councilHelpString2 = $.i18n._(languageDictionary['council_btl_completed_help_message_2']);
        councilHelpString3 = $.i18n._(languageDictionary['council_btl_completed_help_message_3']);
        
        if (getLanguageDirection() == "rtl") {
          warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString1 + '</p>' +
            '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString2 + '</p>' +
            '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString3 + '</p>';
        } else {
          warningString = '<p class="invert_color warning_text">' + councilHelpString1 + '</p>' +
            '<p class="invert_color warning_text">' + councilHelpString2 + '</p>' +
            '<p class="invert_color warning_text">' + councilHelpString3 + '</p>';
        }
      }

    } else if (userVotedAboveOrBelow == "above") {
      
      var aboveTheLineCouncilBallot = container.Resolve("atl");
      var atlSelection = aboveTheLineCouncilBallot.getSelection();
      
      if (atlSelection == null) {
        councilHelpString1 = $.i18n._(languageDictionary['council_atl_selected_help_message_1']);
        councilHelpString2 = $.i18n._(languageDictionary['council_atl_selected_help_message_2']);
        councilHelpString3 = $.i18n._(languageDictionary['council_atl_selected_help_message_3']);
        
        if (getLanguageDirection() == "rtl") {
          warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString1 + '</p>' +
            '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString2 + '</p>' +
            '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString3 + '</p>';
        } else {
          warningString = '<p class="invert_color warning_text">' + councilHelpString1 + '</p>' +
            '<p class="invert_color warning_text">' + councilHelpString2 + '</p>' +
            '<p class="invert_color warning_text">' + councilHelpString3 + '</p>';
        }          
      } else {
        
        councilHelpString1 = $.i18n._(languageDictionary['council_atl_completed_help_message_1']);
        councilHelpString2 = $.i18n._(languageDictionary['council_atl_completed_help_message_2']);
        councilHelpString3 = $.i18n._(languageDictionary['council_atl_completed_help_message_3']);        
      }
      
    } else {

      councilHelpString1 = $.i18n._(languageDictionary['council_unselected_help_message_1']);
      councilHelpString2 = $.i18n._(languageDictionary['council_unselected_help_message_2']);
    }

    if (getLanguageDirection() == "rtl") {
      warningString = '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString1 + '</p>' +
        '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString2 + '</p>' +
        '<p class="invert_color warning_text" style="text-align: right;" DIR="RTL">' + councilHelpString3 + '</p>';
    } else {
      warningString = '<p class="invert_color warning_text">' + councilHelpString1 + '</p>' +
        '<p class="invert_color warning_text">' + councilHelpString2 + '</p>' +
        '<p class="invert_color warning_text">' + councilHelpString3 + '</p>';
    }
        
    $('#ballot_help_modal_message').html(warningString);
  },
  
  getAlreadyHeardBtlAudio: function () {
    return this.alreadyHeardBtlAudio;
  },

  setAlreadyHeardBtlAudio: function (alreadyHeardBtlAudio) {
    return this.alreadyHeardBtlAudio = alreadyHeardBtlAudio;
  },
  
  getAlreadyHeardAtlAudio: function () {
    return this.alreadyHeardAtlAudio;
  },

  setAlreadyHeardAtlAudio: function (alreadyHeardAtlAudio) {
    return this.alreadyHeardAtlAudio = alreadyHeardAtlAudio;
  },

  quitApplication : function() {  

    var container = getContainer();
    var visualView = container.Resolve('visualView');
    visualView.closeQuitConfirmation();
       
    var visualController = container.Resolve("visualController");
    visualController.quitApplication();
  },
  
  checkBtnVis: function() {

    var combined = container.Resolve('combined');
    var visualScreenManager = container.Resolve('visualScreenManager');

    if ($('#ballot_combined_content').scrollLeft() == 0) {
      $('#btnLeft').hide();
    } else if ($('#ballot_combined_content').scrollLeft() > 0) {       
      $('#btnLeft').show();           
    }

    var maxLeftPos = $('#ballot_groups_content_inner')[0].clientWidth - window.innerWidth - 200;
    var leftPos = $('#ballot_combined_content').scrollLeft();

    if (leftPos >= maxLeftPos) {
      $('#btnRight').hide();
    } else {
      $('#btnRight').show();
    }

    var innerHeight = $('#ballot_combined_content')[0].scrollHeight;
    var outerHeight = $('#ballot_combined_content').height();

    var maxTopPos = innerHeight - outerHeight - 2;
    var topPos = $('#ballot_combined_content').scrollTop();

    if (topPos > 0) {
      $('#btnUp').css('visibility', 'visible');
    } else {
      $('#btnUp').css('visibility', 'hidden');
    } 

    if (topPos >= maxTopPos) {
      $('#btnDown').css('visibility', 'hidden');
    } else {
      $('#btnDown').css('visibility', 'visible');
    }     
  },
  
  // Smoothly scroll ballot when hold down arrow button.
  holdDownArrow: function () {

    var container = getContainer();
    var combinedCouncilView = container.Resolve('combined');

    window.clearTimeout(combinedCouncilView.upArrowHeld);
  
    if (combinedCouncilView.downArrowOff) {
      return;
    }

    var topPos = $('#ballot_combined_content').scrollTop();

    var innerHeight = $('#ballot_combined_content')[0].scrollHeight;
    var outerHeight = $('#ballot_combined_content').height();
    var maxTopPos = innerHeight - outerHeight - 1;
    
    if (topPos < maxTopPos) {
      $('#ballot_combined_content').animate({scrollTop: topPos + 100}, 10, "linear", function() {
        combinedCouncilView.checkBtnVis(); 
      });
    }
      
    combinedCouncilView.downArrowHeld = window.setTimeout(function () { combinedCouncilView.holdDownArrow(); }, 100);
  },

  // Smoothly scroll ballot when hold down arrow button.
  holdUpArrow: function () {

    var container = getContainer();
    var combinedCouncilView = container.Resolve('combined');

    window.clearTimeout(combinedCouncilView.downArrowHeld);

    if (combinedCouncilView.upArrowOff) {
      return;
    }
  
    var topPos = $('#ballot_combined_content').scrollTop();
            
    if (topPos > 0) {
      $('#ballot_combined_content').animate({scrollTop:  topPos - 100}, 0, 'linear', function() {
        combinedCouncilView.checkBtnVis(); 
      });
    }   

    combinedCouncilView.upArrowHeld = window.setTimeout(function () { combinedCouncilView.holdUpArrow(); }, 100);
  },
  
  // Smoothly scroll ballot when hold down arrow button.
  holdLeftArrow: function () {

    var container = getContainer();
    var combinedCouncilView = container.Resolve('combined');

    window.clearTimeout(combinedCouncilView.rightArrowHeld);

    if (combinedCouncilView.leftArrowOff) {
      return;
    }
  
    var leftPos = $('#ballot_combined_content').scrollLeft();
      
    if (leftPos > 0) {
      $('#ballot_combined_content').animate({scrollLeft:  leftPos - 100}, 0, 'linear', function() {       
        combinedCouncilView.checkBtnVis(); 
      });
    }   

    combinedCouncilView.leftArrowHeld = window.setTimeout(function () { combinedCouncilView.holdLeftArrow(); }, 100);
  },

  // Smoothly scroll ballot when hold down arrow button.
  holdRightArrow: function () {

    var container = getContainer();
    var combinedCouncilView = container.Resolve('combined');

    window.clearTimeout(combinedCouncilView.leftArrowHeld);

    if (combinedCouncilView.rightArrowOff) {
      return;
    }

    var maxLeftPos = $('#ballot_groups_content_inner')[0].clientWidth - window.innerWidth + 100;
    var leftPos = $('#ballot_combined_content').scrollLeft();
      
    if (maxLeftPos - leftPos < 100) {
      $('#ballot_combined_content').animate({scrollLeft:  maxLeftPos}, 0, 'linear', function() {       
        combinedCouncilView.checkBtnVis();
      });
    } else if (leftPos <= maxLeftPos - 100) {
      $('#ballot_combined_content').animate({scrollLeft:  leftPos + 100}, 0, 'linear', function() {       
        combinedCouncilView.checkBtnVis();
      });
    } else {
      $('#ballot_combined_content').animate({scrollLeft:  maxLeftPos}, 0, 'linear', function() {       
        combinedCouncilView.checkBtnVis();
      });
    }

    combinedCouncilView.rightArrowHeld = window.setTimeout(function () { combinedCouncilView.holdRightArrow(); }, 100);
  },

  pressingBtlSwitchBar: function () {  
    var container = getContainer();
    var combinedCouncilView = container.Resolve('combined');

    if (combinedCouncilView.switchTime != null) {
      var now = new Date().getTime();
      if (now - combinedCouncilView.switchTime > 200) {
        combinedCouncilView.switchToAtl();
        combinedCouncilView.switchTime = null;
        return;
      }    
    } else {
      combinedCouncilView.switchTime = new Date().getTime();
    }

    switchTimeout = window.setTimeout(function(){
    	var container = getContainer();
    	var combinedCouncilView = container.Resolve('combined');
    	combinedCouncilView.pressingBtlSwitchBar();
    }, 50); 
  },

  pressingAtlSwitchBar: function () {  
    var container = getContainer();
    var combinedCouncilView = container.Resolve('combined');
    
    if (combinedCouncilView.switchTime != null) {
      var now = new Date().getTime();
      if (now - combinedCouncilView.switchTime > 200) {
        combinedCouncilView.switchToBtl();
        combinedCouncilView.switchTime = null;
        return;
      }
    } else {
      combinedCouncilView.switchTime = new Date().getTime();
    }

    switchTimeout = window.setTimeout(function() {
  	var container = getContainer();
   	var combinedCouncilView = container.Resolve('combined');
    	combinedCouncilView.pressingAtlSwitchBar();
    }, 50); 
  },

  unpressingBtlSwitchBar: function () {  
    var container = getContainer();
    var combinedCouncilView = container.Resolve('combined');
    combinedCouncilView.switchTime = null;
    window.clearTimeout(switchTimeout);
  },

  unpressingAtlSwitchBar: function () {  
    var container = getContainer();
    var combinedCouncilView = container.Resolve('combined');
    combinedCouncilView.switchTime = null;
    window.clearTimeout(switchTimeout);
  }
});

var switchTimeout = null;