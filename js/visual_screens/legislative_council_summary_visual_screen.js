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
 * LegislativeCouncilSummaryVisualScreen - The visual screen class for the 
 * legislative council summary screen for switching to the visual interface.
 * 
 * @author Peter Scheffer
 */

var LegislativeCouncilSummaryVisualScreen = Screen.extend({
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    var audioScreenManager = container.Resolve("audioScreenManager");
    audioScreenManager.setMajorBlindInterfaceScreen('confirm_council_votes_screen');
    this._super(visualScreenManager, 'confirm_council_votes_screen',   
      this.initialiseConfirmSelectionsScreen, 
      this.exitConfirmSelectionsScreen,
      this.switchToConfirmScreen);
  },

  initialiseConfirmSelectionsScreen: function () {
    var container = getContainer();
    var visualView = container.Resolve("visualView");
    visualView.setSelectionSummaryScreenText();
    var confirmSelectionsView = container.Resolve("confirmSelectionsView");
//    confirmSelectionsView.checkInformalMessages();
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
  },
  
  exitConfirmSelectionsScreen: function () {
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