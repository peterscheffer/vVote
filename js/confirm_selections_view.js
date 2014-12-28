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
 * Confirm Selections View class.  This class is responsible for maintaining 
 * the UI logic of the ballots summary screen. 
 * 
 * @author Peter Scheffer
 */ 
var ConfirmSelectionsView = Class.extend({    

  init: function () {
 
    $('#submit_button').click(function() {
      var container = getContainer();
      var confirmSelectionsView = container.Resolve('confirmSelectionsView');
      confirmSelectionsView.submitVote();
    });
    
    $('#dont_submit_button').click(function() {    
      var container = getContainer();
      var visualView = container.Resolve('visualView');
      visualView.closeSubmitConfirmation();
    });

    $('#assembly_ballot_summary_container').bind('scroll resize',  function() {   
      var container = getContainer();
      var confirmSelectionsView = container.Resolve('confirmSelectionsView');
      confirmSelectionsView.checkBtnVis();
    });

    $('#council_ballot_summary_container').bind('scroll resize',  function() {   
      var container = getContainer();
      var confirmSelectionsView = container.Resolve('confirmSelectionsView');
      confirmSelectionsView.checkBtnVis();
    });
    
    this.upLcArrowHeld;
    this.upLcArrowHeld;
    this.upLaArrowOff = true;
    this.downLaArrowOff = true;
    this.upLcArrowOff = true;
    this.downLcArrowOff = true;
  },
  
  // Set messages and alert colors for warning to user about informal votes.
  checkInformalMessages: function () {
    
    var container = getContainer();
    var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
    var legislativeAssemblyBallot = container.Resolve("assembly");
    if (legislativeAssemblyBallot.isInformal()) {
      
      var informalMessage = $.i18n._(languageDictionary['informal_vote']);
      var notCountedMessage = $.i18n._(languageDictionary['ballot_not_counted']);
      
      $('#assembly_informal_vote').removeClass('green_alert');
      $('#assembly_informal_vote').addClass('red_alert');
      $('#assembly_informal_vote').html(informalMessage);
      $('#assembly_vote_not_counted').removeClass('green_alert');
      $('#assembly_vote_not_counted').addClass('red_alert');
      $('#assembly_vote_not_counted').html(notCountedMessage);

    } else {
      
      var formalMessage = $.i18n._(languageDictionary['formal_vote']);
      var countedMessage = $.i18n._(languageDictionary['ballot_is_counted']);
      
      $('#assembly_informal_vote').removeClass('red_alert');
      $('#assembly_informal_vote').addClass('green_alert');
      $('#assembly_informal_vote').html(formalMessage);
      $('#assembly_vote_not_counted').removeClass('red_alert');
      $('#assembly_vote_not_counted').addClass('green_alert');
      $('#assembly_vote_not_counted').html(countedMessage);
    }
    
    var visualScreenManager = container.Resolve("visualScreenManager");
    if (visualScreenManager.getUserVotedAboveOrBelowTheLine() == "above") {

      var aboveTheLineCouncilBallot = container.Resolve("atl");
      if (aboveTheLineCouncilBallot.isInformal()) {
      
        var informalMessage = $.i18n._(languageDictionary['informal_vote']);
        var notCountedMessage = $.i18n._(languageDictionary['ballot_not_counted']);
      
        $('#council_informal_vote').addClass('red_alert');
        $('#council_informal_vote').removeClass('green_alert');
        $('#council_informal_vote').html(informalMessage);
        $('#council_vote_not_counted').removeClass('green_alert');
        $('#council_vote_not_counted').addClass('red_alert');
        $('#council_vote_not_counted').html(notCountedMessage);

      } else {
      
        var formalMessage = $.i18n._(languageDictionary['formal_vote']);
        var countedMessage = $.i18n._(languageDictionary['ballot_is_counted']);
      
        $('#council_informal_vote').removeClass('red_alert');
        $('#council_informal_vote').addClass('green_alert');
        $('#council_informal_vote').html(formalMessage);
        $('#council_vote_not_counted').removeClass('red_alert');
        $('#council_vote_not_counted').addClass('green_alert');
        $('#council_vote_not_counted').html(countedMessage);
      }
      
    } else {
      
      var belowTheLineCouncilBallot = container.Resolve("btl");
      if (belowTheLineCouncilBallot.isInformal()) {
      
        var informalMessage = $.i18n._(languageDictionary['informal_vote']);
        var notCountedMessage = $.i18n._(languageDictionary['ballot_not_counted']);
      
        $('#council_informal_vote').removeClass('green_alert');
        $('#council_informal_vote').addClass('red_alert');
        $('#council_informal_vote').html(informalMessage);
        $('#council_vote_not_counted').removeClass('green_alert');
        $('#council_vote_not_counted').addClass('red_alert');
        $('#council_vote_not_counted').html(notCountedMessage);
        
      } else {
      
        var formalMessage = $.i18n._(languageDictionary['formal_vote']);
        var countedMessage = $.i18n._(languageDictionary['ballot_is_counted']);
      
        $('#council_informal_vote').removeClass('red_alert');
        $('#council_informal_vote').addClass('green_alert');
        $('#council_informal_vote').html(formalMessage);
        $('#council_vote_not_counted').removeClass('red_alert');
        $('#council_vote_not_counted').addClass('green_alert');
        $('#council_vote_not_counted').html(countedMessage);
      }   
    }
  },
  
  checkBtnVis: function() {
  
    var innerHeight = $('#assembly_ballot_summary_content_inner').outerHeight(true) + $('#summary_district_title').outerHeight(true);
    var outerHeight = $('#assembly_ballot_summary_container').outerHeight(true);
    
    if (innerHeight > outerHeight) {
    
      var maxTopPos = (innerHeight - outerHeight) > 0 ? innerHeight - outerHeight : 0;  
     
      if (maxTopPos > 0) {
        var topPos = $('#assembly_ballot_summary_container').scrollTop();
         
        if (topPos > 0) {
          $('#assembly_summary_button_scroll_up').css('visibility', 'visible');
        } else {
          $('#assembly_summary_button_scroll_up').css('visibility', 'hidden');
        } 

        if (topPos < maxTopPos) {
          $('#assembly_summary_button_scroll_down').css('visibility', 'visible');
        } else {
          $('#assembly_summary_button_scroll_down').css('visibility', 'hidden');
        }
      } else {
        $('#assembly_summary_button_scroll_up').css('visibility', 'hidden');
        $('#assembly_summary_button_scroll_down').css('visibility', 'hidden');
      }    
    } else {
      $('#assembly_summary_button_scroll_up').css('visibility', 'hidden');
      $('#assembly_summary_button_scroll_down').css('visibility', 'hidden');
    }    
  
    var innerHeight = $('#council_ballot_summary_content_inner').outerHeight(true) + $('#summary_region_title').outerHeight(true);
    var outerHeight = $('#council_ballot_summary_container').outerHeight(true);
    
    if (innerHeight > outerHeight) {
    
      var maxTopPos = (innerHeight - outerHeight) > 0 ? innerHeight - outerHeight : 0;  
     
      if (maxTopPos > 0) {
        var topPos = $('#council_ballot_summary_container').scrollTop();
         
        if (topPos > 0) {
          $('#council_summary_button_scroll_up').css('visibility', 'visible');
        } else {
          $('#council_summary_button_scroll_up').css('visibility', 'hidden');
        } 

        if (topPos < maxTopPos) {
          $('#council_summary_button_scroll_down').css('visibility', 'visible');
        } else {
          $('#council_summary_button_scroll_down').css('visibility', 'hidden');
        }
      } else {
        $('#council_summary_button_scroll_up').css('visibility', 'hidden');
        $('#council_summary_button_scroll_down').css('visibility', 'hidden');
      }    
    } else {
      $('#council_summary_button_scroll_up').css('visibility', 'hidden');
      $('#council_summary_button_scroll_down').css('visibility', 'hidden');
    }    
  },

  /**
   * Detach all button handlers for this screen and all popup screens within this context.
   */
  detachButtonHandlers: function () {
    $('#help_modal_help_button').off('click');
    $('#help_modal_back_button').off('click');
    $('#assembly_summary_button_scroll_up').off('click');
    $('#assembly_summary_button_scroll_down').off('click');
    $('#assembly_ballot_summary_up_section').off('click');
    $('#assembly_ballot_summary_down_section').off('click');
    $('#council_summary_button_scroll_up').off('click');
    $('#council_summary_button_scroll_down').off('click');
    $('#council_ballot_summary_up_section').off('click');
    $('#council_ballot_summary_down_section').off('click');
    $('#confirm_selections_screen').off('click');
    $('#confirmation_screen_help_button').off('click');
    $('#confirmation_screen_back_button').off('click');
    $('#confirmation_screen_quit_button').off('click');
    $('#confirm_selections_screen').find("#confirm_submit_button").off('click');
  },
  
  /**
   * Attach all button handlers for this screen and all popup screens within this context.
   */
  attachButtonHandlers: function () {

    /**
     * HELP SCREENS
     */
    $('#help_modal_back_button').click(function() { 

      $('#help_modal_panel').scrollTop(0);          
      $('#help_modal_container').hide();
      $('#help_modal_background').hide();
      $('#help_modal_header').hide();
      $('#help_modal_footer').hide();
    }); 

    $("#confirmation_screen_help_button").click(function() {     

      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $('#help_modal_background').show();
      $('#help_modal_container').show();
      $('#help_modal_header').show();
      $('#help_modal_footer').show();

      var confirmSelectionsView = container.Resolve("confirmSelectionsView");
      confirmSelectionsView.setHelpMessage();
    });   

    $('#assembly_summary_button_scroll_up').bind("touchstart", function() {
      var container = getContainer();
      var confirmSelectionsView = container.Resolve("confirmSelectionsView");
      if (confirmSelectionsView.upLaArrowOff) {
        confirmSelectionsView.upLaArrowOff = false;
        confirmSelectionsView.holdLaUpArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var confirmSelectionsView = container.Resolve("confirmSelectionsView");
      confirmSelectionsView.upLaArrowOff = true;
      window.clearTimeout(confirmSelectionsView.upLaArrowHeld);
    });
 
    $('#assembly_summary_button_scroll_down').bind("touchstart", function() {
      var container = getContainer();
      var confirmSelectionsView = container.Resolve("confirmSelectionsView");
      if (confirmSelectionsView.downLaArrowOff) {
        confirmSelectionsView.downLaArrowOff = false;
        confirmSelectionsView.holdLaDownArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var confirmSelectionsView = container.Resolve('confirmSelectionsView');
      confirmSelectionsView.downLaArrowOff = true;
      window.clearTimeout(confirmSelectionsView.downLaArrowHeld);
    });

    $('#council_summary_button_scroll_up').bind("touchstart", function() {
      var container = getContainer();
      var confirmSelectionsView = container.Resolve("confirmSelectionsView");
      if (confirmSelectionsView.upLcArrowOff) {
        confirmSelectionsView.upLcArrowOff = false;
        confirmSelectionsView.holdLcUpArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var confirmSelectionsView = container.Resolve("confirmSelectionsView");
      confirmSelectionsView.upLcArrowOff = true;
      window.clearTimeout(confirmSelectionsView.upLcArrowHeld);
    });
 
    $('#council_summary_button_scroll_down').bind("touchstart", function() {
      var container = getContainer();
      var confirmSelectionsView = container.Resolve("confirmSelectionsView");
      if (confirmSelectionsView.downLcArrowOff) {
        confirmSelectionsView.downLcArrowOff = false;
        confirmSelectionsView.holdLcDownArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var confirmSelectionsView = container.Resolve('confirmSelectionsView');
      confirmSelectionsView.downLcArrowOff = true;
      window.clearTimeout(confirmSelectionsView.downLcArrowHeld);
    });

    $("#assembly_ballot_summary_up_section").click(function() { 
      var topVal = $('#assembly_ballot_summary_container').scrollTop();
      $('#assembly_ballot_summary_container').animate({scrollTop: topVal - 70}, 0);
    }); 

    $("#assembly_ballot_summary_down_section").click(function() { 
      var topVal = $('#assembly_ballot_summary_container').scrollTop();
      $('#assembly_ballot_summary_container').animate({scrollTop: topVal + 70}, 0);
    }); 

    $("#council_summary_button_scroll_up").click(function() { 
      var topVal = $('#council_ballot_summary_container').scrollTop();
      $('#council_ballot_summary_container').animate({scrollTop: topVal - 70}, 0);
    }); 

    $("#council_summary_button_scroll_down").click(function() { 
      var topVal = $('#council_ballot_summary_container').scrollTop();
      $('#council_ballot_summary_container').animate({scrollTop: topVal + 70}, 0);
    }); 
    
    $("#council_ballot_summary_up_section").click(function() { 
      var topVal = $('#council_ballot_summary_container').scrollTop();
      $('#council_ballot_summary_container').animate({scrollTop: topVal - 70}, 0);
    }); 

    $("#council_ballot_summary_down_section").click(function() { 
      var topVal = $('#council_ballot_summary_container').scrollTop();
      $('#council_ballot_summary_container').animate({scrollTop: topVal + 70}, 0);
    }); 

    $("#confirm_submit_button").click(function() {    

      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      (container.Resolve('visualView')).displaySubmitConfirmation('confirm_selections_screen');
    }); 
    
    $("#confirmation_screen_next_button").click(function() { 

      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $('#help_modal_help_button').show();
    }); 
  
    $("#confirmation_screen_back_button").click(function() { 

      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      var votingSession = container.Resolve("votingSession");
      var regionIsUncontested = votingSession.getRegionIsUncontested();
      var visualView = container.Resolve('visualView');

      // If the region is uncontested, go straight back to the assembly screen.
      if (regionIsUncontested) {
        visualView.displaySection('confirm_selections_screen', 'legislative_assembly_candidate_vote_screen');
      } else {
        visualView.displaySection('confirm_selections_screen', 'legislative_council_combined_screen');
      }

      $("#bad_vote_notice_background").hide();
      $('#help_modal_help_button').show();
    });

    $("#confirmation_screen_quit_button").click(function() {     

      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      (container.Resolve('visualView')).displayQuitConfirmation(
         container.Resolve('confirmSelectionsView').quitApplication, 
         'confirm_selections_screen',
         function () {  });
    });   
  },
  
  setHelpMessage: function () {    
    var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
    var headingString = $.i18n._(languageDictionary['confirm_help_modal_title']);
    $('#help_modal_title').html(headingString);

    var confirmHelpString1 = "";
    var confirmHelpString2 = "";

    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
        
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var belowTheLineCouncilBallot = container.Resolve("btl");
    var councilBallot = null;
    
    if (visualScreenManager.getUserVotedAboveOrBelowTheLine() == "above") {
      councilBallot = aboveTheLineCouncilBallot;
    } else if (visualScreenManager.getUserVotedAboveOrBelowTheLine() == "below") {
      councilBallot = belowTheLineCouncilBallot;
    }

    var votingSession = container.Resolve("votingSession");
    var districtIsUncontested = votingSession.getDistrictIsUncontested();
    var regionIsUncontested = votingSession.getRegionIsUncontested();

    // If district is uncontested, check only the council vote.
    if (districtIsUncontested) {
      // If council vote is completed.
      if (councilBallot != null && !councilBallot.isInformal()) {
        confirmHelpString1 = $.i18n._(languageDictionary['confirm_help_message_1a']);
        confirmHelpString2 = $.i18n._(languageDictionary['confirm_help_message_2a']);
      } else {
        confirmHelpString1 = $.i18n._(languageDictionary['confirm_help_message_1d']);
        confirmHelpString2 = $.i18n._(languageDictionary['confirm_help_message_2b']);
      }
    // if region is "no race", check only the assembly vote.
    } else if (regionIsUncontested) {
      // If assembyl vote is not completed.
      if (legislativeAssemblyBallot.isInformal()) {
        confirmHelpString1 = $.i18n._(languageDictionary['confirm_help_message_1d']);
        confirmHelpString2 = $.i18n._(languageDictionary['confirm_help_message_2c']);
      } else {
        confirmHelpString1 = $.i18n._(languageDictionary['confirm_help_message_1a']);
        confirmHelpString2 = $.i18n._(languageDictionary['confirm_help_message_2a']);
      }
    } else {
      if (legislativeAssemblyBallot.isInformal()) {
        if (councilBallot != null && !councilBallot.isInformal()) {
          // If only council ballot is completed.
          confirmHelpString1 = $.i18n._(languageDictionary['confirm_help_message_1c']);
          confirmHelpString2 = $.i18n._(languageDictionary['confirm_help_message_2c']);
        } else {
          // If neither ballots are completed.
          confirmHelpString1 = $.i18n._(languageDictionary['confirm_help_message_1d']);
          confirmHelpString2 = $.i18n._(languageDictionary['confirm_help_message_2d']);
        }
      } else {
        if (councilBallot != null && !councilBallot.isInformal()) {
          // If both ballots are completed.
          confirmHelpString1 = $.i18n._(languageDictionary['confirm_help_message_1a']);
          confirmHelpString2 = $.i18n._(languageDictionary['confirm_help_message_2a']);
        } else {
          // Only council ballot isn't completed.
          confirmHelpString1 = $.i18n._(languageDictionary['confirm_help_message_1b']);
          confirmHelpString2 = $.i18n._(languageDictionary['confirm_help_message_2b']);
        }
      }
    }

    var messageString = "";
    
    if (getLanguageDirection() == "rtl") {
      messageString = '<p class="invert_color" style="text-align: right;" DIR="RTL">' + confirmHelpString1 + '<p>&nbsp;</p>' +
      '<p class="invert_color" style="text-align: right;" DIR="RTL">' + confirmHelpString2 + '</p>';
    } else {
      messageString = '<p class="invert_color" style="text-align: left;" DIR="LTR">' + confirmHelpString1 + '<p>&nbsp;</p>' +
      '<p class="invert_color" style="text-align: left;" DIR="LTR">' + confirmHelpString2 + '</p>';
    }

    $('#help_modal_message').html(messageString);
  },
  
  submitVote: function () {

    $('#submit_confirmation_modal_container').hide();
    $('#submit_confirmation_modal_background').hide();
    $('#submit_confirmation_header').hide();
    $('#submit_confirmation_footer').hide();
    
    showWaitingAlert();

    var request = jsonifyVote();
    var submitVoteMessage = "msg=" + encodeURIComponent(request);
    var submitURL = "http://localhost:8060/servlet/MBBProxy";

    $.ajax({
      type: 'POST',
      timeout: MBB_TIMEOUT,
      url: submitURL,
      data: submitVoteMessage,
      success: this.displayConfirmationScreen,
      error: showSubmitErrorAlert
    });
  },
  
  quitApplication: function() {  
   
    $("#warning_modal_container").hide();
    $("#warning_modal_background").hide(); 
    $("#warning_modal_header").hide();
    $("#warning_modal_footer").hide();
    
    var container = getContainer();
    var visualView = container.Resolve('visualView');
    visualView.closeQuitConfirmation();

    var visualController = container.Resolve("visualController");
    visualController.quitApplication();
  },
  
  displayConfirmationScreen: function (response) {

    var error = response["ERROR"];
    if (error != null && error != "") {
      showSubmitErrorAlert(error);
      return;
    }

    hideWaitingAlert();

    var confirmationSignature = response["sigs"];

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    votingSession.setConfirmationSignature(confirmationSignature);
    
    var visualView = container.Resolve('visualView');
    visualView.displaySection('confirm_selections_screen', 'print_receipt_screen');           
  },
  
  // Smoothly scroll ballot when hold down arrow button.
  holdLaDownArrow: function () {

    var container = getContainer();
    var confirmSelectionsView = container.Resolve('confirmSelectionsView');

    window.clearTimeout(confirmSelectionsView.upLaArrowHeld);
  
    if (confirmSelectionsView.downLaArrowOff) {
      return;
    }

    var innerHeight = $('#assembly_ballot_summary_container')[0].scrollHeight;
    var outerHeight = $('#assembly_ballot_summary_container').height();

    if (innerHeight > outerHeight) {
      var maxTopPos = innerHeight - outerHeight;
      var topPos = $('#assembly_ballot_summary_container').scrollTop();

      if (topPos >= maxTopPos) {
        window.clearTimeout(confirmSelectionsView.downLaArrowHeld);
        return;
      }
    }

    var topVal = $('#assembly_ballot_summary_container').scrollTop();
    $('#assembly_ballot_summary_container').animate({scrollTop: topVal + 40}, 10, "linear");
    confirmSelectionsView.downLaArrowHeld = window.setTimeout(function () { confirmSelectionsView.holdLaDownArrow(); }, 100);
  },

  // Smoothly scroll ballot when hold down arrow button.
  holdLaUpArrow: function () {

    var container = getContainer();
    var confirmSelectionsView = container.Resolve('confirmSelectionsView');

    window.clearTimeout(confirmSelectionsView.downLaArrowHeld);

    if (confirmSelectionsView.upLaArrowOff) {
      return;
    }
  
    var topPos = $('#assembly_ballot_summary_container').scrollTop();
    if (topPos = 0) {
      window.clearTimeout(confirmSelectionsView.upLaArrowHeld);
      return;
    }

    var topVal = $('#assembly_ballot_summary_container').scrollTop();
    $('#assembly_ballot_summary_container').animate({scrollTop: topVal - 40}, 10, "linear");
    confirmSelectionsView.upLaArrowHeld = window.setTimeout(function () { confirmSelectionsView.holdLaUpArrow(); }, 100);
  },
  
  // Smoothly scroll ballot when hold down arrow button.
  holdLcDownArrow: function () {

    var container = getContainer();
    var confirmSelectionsView = container.Resolve('confirmSelectionsView');

    window.clearTimeout(confirmSelectionsView.upLcArrowHeld);
  
    if (confirmSelectionsView.downLcArrowOff) {
      return;
    }

    var innerHeight = $('#council_ballot_summary_container')[0].scrollHeight;
    var outerHeight = $('#council_ballot_summary_container').height();

    if (innerHeight > outerHeight) {
      var maxTopPos = innerHeight - outerHeight;
      var topPos = $('#council_ballot_summary_container').scrollTop();

      if (topPos >= maxTopPos) {
        window.clearTimeout(confirmSelectionsView.downLcArrowHeld);
        return;
      }
    }

    var topVal = $('#council_ballot_summary_container').scrollTop();
    $('#council_ballot_summary_container').animate({scrollTop: topVal + 40}, 10, "linear");
    confirmSelectionsView.downLcArrowHeld = window.setTimeout(function () { confirmSelectionsView.holdLcDownArrow(); }, 100);
  },

  // Smoothly scroll ballot when hold down arrow button.
  holdLcUpArrow: function () {

    var container = getContainer();
    var confirmSelectionsView = container.Resolve('confirmSelectionsView');

    window.clearTimeout(confirmSelectionsView.downLcArrowHeld);

    if (confirmSelectionsView.upLcArrowOff) {
      return;
    }
  
    var topPos = $('#council_ballot_summary_container').scrollTop();
    if (topPos = 0) {
      window.clearTimeout(confirmSelectionsView.upLcArrowHeld);
      return;
    }

    var topVal = $('#council_ballot_summary_container').scrollTop();
    $('#council_ballot_summary_container').animate({scrollTop: topVal - 40}, 10, "linear");
    confirmSelectionsView.upLcArrowHeld = window.setTimeout(function () { confirmSelectionsView.holdLcUpArrow(); }, 100);
  }
});