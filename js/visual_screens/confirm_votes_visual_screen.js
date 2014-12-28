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
 * ConfirmVotesVisualScreen - The visual screen class for the 
 * confirm votes screen for switching to the visual interface.
 * 
 * @author Peter Scheffer
 */

var ConfirmVotesVisualScreen = Screen.extend({
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    var audioScreenManager = container.Resolve("audioScreenManager");
    audioScreenManager.setMajorBlindInterfaceScreen('confirm_all_votes_screen');
    this._super(visualScreenManager, 'confirm_all_votes_screen',   
      this.initialiseConfirmVotesScreen, 
      this.exitConfirmVotesScreen,
      this.switchToConfirmScreen);
  },

  initialiseConfirmVotesScreen: function () {

  },
  
  exitConfirmVotesScreen: function () {

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