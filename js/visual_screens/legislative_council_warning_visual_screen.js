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
 * LegislativeCouncilWarningVisualScreen - The visual screen class for the legislative council 
 * informal warning screen for switching to the visual interface.
 *
 * This is a duplicate of LegislativeCouncilCombinedVisualScreen and needs to be unified. Ultimately the behaviour
 * duplicates what happens when you switch to L.C screen from audio mode.
 * 
 * @author Peter Scheffer
 */

var LegislativeCouncilWarningVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    this._super(visualScreenManager, 'informal_council_atl_warning', 
      this.initialiseLegislativeCouncilBallotScreen,
      this.exitLegislativeCouncilScreen,
      this.switchToCouncilScreen);
  },
  
  setReturnScreen: function (returnScreen) {
    var audioScreenManager = container.Resolve("audioScreenManager");
    audioScreenManager.setMajorBlindInterfaceScreen(returnScreen);
  },
  
  initialiseLegislativeCouncilBallotScreen: function () {

  },
  
  exitLegislativeCouncilScreen: function () {  

  },  
  
  // Switch from Audio UI to Visual UI.  
  switchToCouncilScreen: function () {
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();

    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('legislative_council_combined_screen');
    screenObject.setHasVisited(true);

    var audioScreenManager = container.Resolve("audioScreenManager");
    var userVotedAboveOrBelow = audioScreenManager.getUserVotedAboveOrBelowTheLine(); 
    var visualScreenManager = container.Resolve("visualScreenManager");
    visualScreenManager.setUserVotedAboveOrBelowTheLine(userVotedAboveOrBelow);

    var visualView = container.Resolve("visualView");
    visualView.displaySection('audio_only_screen', 'legislative_council_combined_screen');
    
    if (userVotedAboveOrBelow == "above") {
      $("#atl_button_div").click();
    } else if (userVotedAboveOrBelow == "below") {
      $("#btl_button_div").click();
    }

    // Need to stop audio again for having clicked the switch button.    
    audioController.stopAudio();
  }    
});
