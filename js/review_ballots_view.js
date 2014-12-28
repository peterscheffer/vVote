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
 * Review Ballots View class.  This class is responsible for maintaining 
 * the UI logic of the review ballots screen. 
 * 
 * @author Peter Scheffer
 */ 
var ReviewBallotsView = Class.extend({    
  
  // Initialiser is called by the Constructor
  init: function () {

    // Play audio instructions for this screen if it's the first time visiting it.
    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('review_ballots_screen');
    var audioController = container.Resolve("audioController");    
    if (!screenObject.hasVisited() && audioController.getUsingAudioMode()) {
      var audioClips = getVisualUiIntroductionAudio('review_ballots_screen');
      if (audioClips != null && audioClips.length > 0) {
        var container = getContainer();
        audioController.playTranslatedAudio(audioClips, false);
      }
    }    

    $('#ballot_scrollable_inner').bind('scroll resize', function() { 
      var container = getContainer();
      var reviewBallotsView = container.Resolve('review');
      reviewBallotsView.checkBtnVis();
    });
    
    this.checkBtnVis();
  },

  /**
   * Detach all button handlers for this screen and all popup screens within this context.
   */
  detachButtonHandlers: function () {
    $('#help_modal_back_button').off('click');
//    $('#help_modal_help_button').off('click');
    $('#more_help_modal_back_button').off('click');
    $('#review_button_scroll_up').off('click');
    $('#review_button_scroll_down').off('click');
//    $('#more_help_modal_help_button').off('click');
  },
  
  /**
   * Attach all button handlers for this screen and all popup screens within this context.
   */
  attachButtonHandlers : function() {

    $("#review_front_ballot").bind("scroll",  function() {

    });    
    
    $("#review_btn_correct").click(function() { 

      var visualView = container.Resolve('visualView');
      visualView.stopVideo("review_ballot_instructions_video");
     
      $('#ballot_container').scrollTop(0);
      $('#ballot_scrollable_inner').scrollTop(0);

      // Interrupt intro audio.
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      (container.Resolve('visualView')).displaySection('review_ballots_screen', 'print_receipt_screen');
    });
        
    $("#review_btn_help").click(function() { 

      // Interrupt intro audio.
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $('#help_modal_background').show();
      $('#help_modal_container').show();

      var reviewView = container.Resolve("review");
      reviewView.setHelpMessage();
    });
    
    $("#review_btn_again").click(function() { 
    
      var container = getContainer();
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('review_ballots_screen');
      screenObject.printBallot();
    });
    
    $("#review_btn_explain").click(function() {
      $('#more_help_modal_background').show();
      $('#more_help_modal_container').show();

      // Interrupt intro audio.
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
      var headingString = $.i18n._(languageDictionary['review_ballot_more_help_modal_title']);
      $('#more_help_modal_title').html(headingString);

      var reviewMessage1 = $.i18n._(languageDictionary['review_ballot_help_message_1']);
      var reviewMessage2 = $.i18n._(languageDictionary['review_ballot_help_message_2']);
      var reviewMessage3 = $.i18n._(languageDictionary['review_ballot_help_message_3']);
      
      var messageString = "";

      if (getLanguageDirection() == "rtl") {
        messageString = '<p class="invert_color" style="text-align: right;" DIR="RTL">' + reviewMessage1 + '</p>' +
          '<p class="invert_color" style="text-align: right;" DIR="RTL">' + reviewMessage2 + '</p>' +
          '<p class="invert_color" style="text-align: right;" DIR="RTL">' + reviewMessage3 + '</p>';
      } else {
        messageString = '<p class="invert_color">' + reviewMessage1 + '</p>' +
          '<p class="invert_color">' + reviewMessage2 + '</p>' +
          '<p class="invert_color">' + reviewMessage3 + '</p>';
      }
      
      $('#more_help_modal_message').html(messageString);
/*
      var seeSlipsButton = $.i18n._(languageDictionary['review_ballot_see_slips_button']);
      $('#more_help_modal_help_button').html(seeSlipsButton);
*/      
      $('#review_speaker_icon').hide();
    });
    
    /**
     * HELP SCREENS
     */
    $("#help_modal_back_button").click(function() { 
      $('#help_modal_panel').scrollTop(0);          
      $("#help_modal_container").hide();
      $("#help_modal_background").hide(); 
/*
      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
      var moreHelpButton = $.i18n._(languageDictionary['more_help_modal_help_button']);
      $('#more_help_modal_help_button').html(moreHelpButton);
*/
    }); 
/*
    $('#more_help_modal_help_button').click(function() {     
      $('#more_help_modal_background').hide();
      $('#more_help_modal_container').hide();
      $('#compare_slips').show();
    });  
*/    
    $('#review_ballot_instruction_ok_button').click(function() {
      $('#more_help_modal_background').show();
      $('#more_help_modal_container').show();
      $('#compare_slips').hide();
    });

    $('#more_help_modal_back_button').click(function() { 
      $('#more_help_modal_background').hide();
      $('#more_help_modal_container').hide();
      $('#review_speaker_icon').show();
    }); 
    
    $("#review_button_scroll_up").click(function() { 
     
      var contInner = $('#ballot_scrollable_inner');
      var totalHeight = contInner.height() + 500;
      
      if (contInner.scrollTop() > 0) {     
        var scrollPos = (contInner.scrollTop() - 100 >= 0) ? contInner.scrollTop() - 100 : 0;
        contInner.animate({scrollTop:  scrollPos}, 0, 'linear',  function() {
          container.Resolve('review').checkBtnVis(); 
        });
      }   
    }); 
    
    $("#review_button_scroll_down").click(function() {  
      
      var cont = $('#ballot_container');
      var contInner = $('#ballot_scrollable_inner');
      var maxTopPos = cont.height() + contInner.height();

      if (cont.scrollTop() < maxTopPos) {
        var scrollPos = (contInner.scrollTop() + 100 < maxTopPos) ? contInner.scrollTop() + 100 : maxTopPos;
        contInner.animate({scrollTop:  scrollPos}, 0, 'linear',  function() {
          container.Resolve('review').checkBtnVis();
        });
      }   
    }); 
  },
  
  checkBtnVis: function() {

    var cont = $('#ballot_container');
    var contInner = $('#ballot_scrollable_inner');

    if (contInner.scrollTop() == 0) {
      $('#review_button_scroll_up').hide();
    } else {
      $('#review_button_scroll_up').show();
    }

    var maxTopPos = cont.height() + contInner.height();
    if (contInner.scrollTop() < (maxTopPos - 5)) {
      $('#review_button_scroll_down').show();
    } else {
      $('#review_button_scroll_down').hide();
    }  
  },
  
  setHelpMessage: function () {
    
    var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
    var headingString = $.i18n._(languageDictionary['review_ballot_help_modal_title']);
    $('#more_help_modal_title').html(headingString);

    var reviewMessage1 = $.i18n._(languageDictionary['review_ballot_help_message_1']);
    var reviewMessage2 = $.i18n._(languageDictionary['review_ballot_help_message_2']);
    var reviewMessage3 = $.i18n._(languageDictionary['review_ballot_help_message_3']);

    var messageString = "";

    if (getLanguageDirection() == "rtl") {
      messageString = '<p class="invert_color" style="text-align: right;" DIR="RTL">' + reviewMessage1 + '</p>' +
        '<p class="invert_color" style="text-align: right;" DIR="RTL">' + reviewMessage2 + '</p>' +
        '<p class="invert_color" style="text-align: right;" DIR="RTL">' + reviewMessage3 + '</p>';
    } else {
      messageString = '<p class="invert_color" style="text-align: left;" DIR="LTR">' + reviewMessage1 + '</p>' +
        '<p class="invert_color" style="text-align: left;" DIR="LTR">' + reviewMessage2 + '</p>' +
        '<p class="invert_color" style="text-align: left;" DIR="LTR">' + reviewMessage3 + '</p>';
    }
      
    $('#more_help_modal_message').html(messageString);
  }
});