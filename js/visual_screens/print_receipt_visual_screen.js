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
 * PrintReceiptVisualScreen - The visual screen class for the print receipt screen for the visual interface.
 * 
 * @author Peter Scheffer
 */

var PrintReceiptVisualScreen = Screen.extend({
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    var audioScreenManager = container.Resolve("audioScreenManager");
    audioScreenManager.setMajorBlindInterfaceScreen('print_receipt_screen');
    this._super(visualScreenManager, 'print_receipt_screen', 
      this.initialisePrintReceiptScreen,
      this.exitVotingCompletedScreen,
      this.switchToPrintReceiptScreen);
  },
  
  initialisePrintReceiptScreen: function () {

    var container = getContainer();

    var visualView = container.Resolve('visualView');
    visualView.playVideo("shred_instructions_video", "videos/shred.ogv");

    var audioController = container.Resolve("audioController");    

    // Play audio instructions for this screen if it's the first time visiting it.
    var screenFactory = container.Resolve("screenFactory");
    var reviewBallotsScreen = screenFactory.getInstance('print_receipt_screen');

    if (!reviewBallotsScreen.hasVisited() && audioController.getUsingAudioMode()) {
      var audioClips = getVisualUiIntroductionAudio('print_receipt_screen');
      if (audioClips != null && audioClips.length > 0) {
        var container = getContainer();
        audioController.playTranslatedAudio(audioClips, true);
      }
    }

    if (!reviewBallotsScreen.hasVisited()) {
      reviewBallotsScreen.printBallot();
    }
  },
  
  exitVotingCompletedScreen: function () {

  },
  
  printBallot: function () {
    
    // Setup the PDF for printing.
    var ballotPreferenceOrder = "";
    var container = getContainer();
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var assemblyPreferences = legislativeAssemblyBallot.getTextualPreferencesInShuffleOrder();
    var atlCouncilPreferences = new Array();
    var btlCouncilPreferences = new Array();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 

    if (userVotedAboveOrBelow == "above") {
      var atl = container.Resolve("atl");
      atlCouncilPreferences = atl.getTextualPreferencesInShuffleOrder();

      var container = getContainer();
      var votingSession = container.Resolve("votingSession");
      var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();
      
      // null out the BTL
      for (var index = 0; index < maxCouncilCandidates; index++) {      	
      	btlCouncilPreferences[index] = '';
      }
      
    } else if (userVotedAboveOrBelow == "below") {
      var btl = container.Resolve("btl");
      btlCouncilPreferences = btl.getTextualPreferencesInShuffleOrder();
      var atl = container.Resolve("atl");
      var ticketedGroups = atl.getTicketedGroups();
      var maxCouncilGroups = ticketedGroups.length;
      var votingSession = container.Resolve("votingSession");
      var language = votingSession.getLanguage();
      
      // null out the ATL
      for (var index = 0; index < maxCouncilGroups; index++) {      	
      	atlCouncilPreferences[index] = '';
      }
    }

    buildReceipt(assemblyPreferences, atlCouncilPreferences, btlCouncilPreferences, language);
  },
  
  // Switch from Audio UI to Visual UI.  
  switchToPrintReceiptScreen: function () {
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();

    var visualView = container.Resolve("visualView");
    visualView.displaySection('audio_only_screen', 'print_receipt_screen');
  }  
});