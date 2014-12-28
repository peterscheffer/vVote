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
 * TvsPracticeVisualScreen - The visual screen class for the TVS practice screen for the visual interface.
 * 
 * @author Peter Scheffer
 */
 
var TvsPracticeVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    
    this._super(visualScreenManager, 'tvs_practice_screen', 
      this.initialiseAudioStartScreen, 
      this.exitStartScreen,
      this.switchToStartScreen);
  },
  
  initialiseAudioStartScreen: function () {
  
  },
  
  exitStartScreen: function () {

  },

  switchToAudioInterface: function () {
    var container = getContainer();
    var visualView = container.Resolve("visualView");

    var visualScreenManager = container.Resolve("visualScreenManager");
    var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    visualView.displaySection(currentVisualInterfaceScreen, 'audio_only_screen');
    
    var audioController = container.Resolve("audioController");    
    audioController.enterScreen(null, null, 'tvs_practice_screen');
  },

  // Switch from Audio UI to Visual UI.  
  switchToStartScreen: function () {
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('start_screen');
    screenObject.setHasVisited(true);
    
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();

    var visualView = container.Resolve("visualView");
    visualView.displaySection('audio_only_screen', 'start_screen');
  }  
});