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
 * TvsBallotOptionsVisualScreen - The visual screen class for the TVS ballot options screen for the visual interface.
 * 
 * @author Peter Scheffer
 */
 
var TvsBallotOptionsVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    
    this._super(visualScreenManager, 'tvs_ballot_options_menu_screen', 
      this.initialiseAudioStartScreen, 
      this.exitStartScreen,
      this.switchToBallotScreen);
  },
  
  initialiseAudioStartScreen: function () {
  
  },
  
  exitStartScreen: function () {

  },

  // Switch from Audio UI to Visual UI.  
  switchToBallotScreen: function () {
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('start_screen');
    screenObject.setHasVisited(true);
    
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();
    
    var ballot = audioController.getCurrentBallot();    
    if (ballot.ballotType == LEGISLATIVE_COUNCIL_GROUP_BALLOT) {
      var ballotScreen = screenFactory.getInstance("legislative_council_combined_screen");
      ballotScreen.switchToCouncilScreen();
    } else if (ballot.ballotType == LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT) {
      var ballotScreen = screenFactory.getInstance("legislative_council_combined_screen");
      ballotScreen.switchToCouncilScreen();
    } else if (ballot.ballotType == LEGISLATIVE_ASSEMBLY_BALLOT) {
      var ballotScreen = screenFactory.getInstance("legislative_assembly_candidate_vote_screen");
      ballotScreen.switchToAssemblyScreen();
    }    
  }  
});