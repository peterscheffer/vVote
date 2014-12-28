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
 * LegislativeAssemblyWarningVisualScreen - The visual screen class for the legislative assembly 
 * informal warning screen for switching to the visual interface.
 *
 * This is a duplicate of LegislativeAssemblyVisualScreen and needs to be unified. Ultimately the behaviour
 * duplicates what happens when you switch to L.A screen from audio mode.
 * 
 * @author Peter Scheffer
 */

var LegislativeAssemblyWarningVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    var audioScreenManager = container.Resolve("audioScreenManager");
    audioScreenManager.setMajorBlindInterfaceScreen('legislative_assembly_candidate_vote_screen');
    this._super(visualScreenManager, 'incomplete_assembly_warning', 
      this.initialiseLegislativeAssemblyBallotScreen,
      this.exitLegislativeAssemblyScreen,
      this.switchToAssemblyScreen);
  },
  
  initialiseLegislativeAssemblyBallotScreen: function () {
      
  },
  
  exitLegislativeAssemblyScreen: function () {  

  },  
  
  // Switch from Audio UI to Visual UI.  
  switchToAssemblyScreen: function () {
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('legislative_assembly_candidate_vote_screen');
    screenObject.setHasVisited(true);
    
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();

    var visualView = container.Resolve("visualView");
    visualView.displaySection('audio_only_screen', 'legislative_assembly_candidate_vote_screen');
    $('#assembly_instruction_ok_button').click();
  }    
});
