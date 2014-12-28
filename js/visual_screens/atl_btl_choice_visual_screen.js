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
 * AtlBtlChoiceVisualScreen - The visual screen class for the ATL/BTL fork choice screen for the visual interface.
 * 
 * @author Peter Scheffer
 */
 
var AtlBtlChoiceVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    this._super(visualScreenManager, 'atl_btl_choice_screen', 
      this.initialiseAtlBtlChoiceScreen, 
      this.exitAtlBtlChoiceScreen,
      null);
  },
  
  initialiseAtlBtlChoiceScreen: function () {    
    var container = getContainer();
    var visualView = container.Resolve('visualView');
    visualView.playVideo("lc_fork_video", "videos/lc_fork.ogv");
    var screenFactory = container.Resolve("screenFactory");
    var switchScreen = screenFactory.getInstance("atl_btl_choice_screen");
    switchScreen.attachButtonHandlers();

    var audioController = container.Resolve("audioController");
    if (audioController.getUsingAudioMode()) {
      var audioClips = getVisualUiIntroductionAudio('legislative_council_combined_screen');
      if (audioClips != null && audioClips.length > 0) {
        var container = getContainer();
        audioController.playTranslatedAudio(audioClips, false);
      }
    }
  },
  
  exitAtlBtlChoiceScreen: function () {
    var visualView = container.Resolve('visualView');
    visualView.stopVideo("lc_fork_video");
    var screenFactory = container.Resolve("screenFactory");
    var switchScreen = screenFactory.getInstance("atl_btl_choice_screen");
    switchScreen.detachButtonHandlers();
  },

  /**
   * Detach all button handlers for this screen and all popup screens within this context.
   */
  detachButtonHandlers: function () {
    $('#help_modal_help_button').off('click');
    $('#help_modal_back_button').off('click');
    $('#more_help_modal_help_button').off('click');
    $('#more_help_modal_back_button').off('click');
    $('#other_help_modal_back_button').off('click');    
    $('#paper_voting_modal_no_button').off('click');
    $('#paper_voting_modal_yes_button').off('click');
    $('#incomplete_vote_modal_back_button').off('click');
    $('#paper_voting_button').off('click');
    $('#submit_incomplete_button').off('click');
    $('#fork_instruction_ok_button').off('click');
    $('#video_instructions_button').off('click');
    $('#atl_btl_choice_back_button').off('click');
  },
  
  /**
   * Attach all button handlers for this screen and all popup screens within this context.
   */
  attachButtonHandlers : function() {

    /**
     * HELP SCREENS
     */
    $('#help_modal_back_button').click(function() { 
      $('#help_modal_container').hide();
      $('#help_modal_background').hide();
      $('#help_modal_header').hide();
      $('#help_modal_footer').hide();
    }); 
    
    $('#atl_btl_choice_back_button').click(function() {    
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      //  If they back out of this screen, then we want them to see it again.
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('atl_btl_choice_screen');
      screenObject.setHasVisited(false);

      var visualView = container.Resolve('visualView');
      visualView.displaySection('atl_btl_choice_screen', 'legislative_assembly_candidate_vote_screen');
    }); 

    $("#atl_btl_choice_help_button").click(function() {  

      // Interrupt intro audio.
      var container = getContainer();
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();

      $('#help_modal_background').show();
      $('#help_modal_container').show();
      $('#help_modal_header').show();
      $('#help_modal_footer').show();
      
      var screenFactory = container.Resolve("screenFactory");
      var switchScreen = screenFactory.getInstance("atl_btl_choice_screen");
      switchScreen.setHelpMessage();
    });   
  },
  
  setHelpMessage: function () {

    var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
    var headingString = $.i18n._(languageDictionary['atl_btl_switch_help_title']);
    $('#help_modal_title').html(headingString);

    var messageString1 = $.i18n._(languageDictionary['atl_btl_switch_message_1']);
    var messageString2 = $.i18n._(languageDictionary['atl_btl_switch_message_2']);
    var messageString3 = $.i18n._(languageDictionary['atl_btl_switch_message_3']);

    var messageString = '<p class="invert_color warning_text">' + messageString1 + '</p>' +
      '<p class="invert_color warning_text">' + messageString2 + '</p>' +
      '<p class="invert_color warning_text">' + messageString3 + '</p>';

    $('#help_modal_message').html(messageString);
  }
});