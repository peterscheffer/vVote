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
 * StartVisualScreen - The visual screen class for the start screen for the visual interface.
 * 
 * @author Peter Scheffer
 */
 
var StartVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    this._super(visualScreenManager, 'start_screen', 
      this.initialiseStartScreen, 
      this.exitStartScreen,
      this.switchToStartScreen);
  },
  
  initialiseStartScreen: function () {    

    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('start_screen');
    if (screenObject.hasVisited()) {
      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
      var buttonMessage = $.i18n._(languageDictionary['start_button_2']);
      $('#start_button').html(buttonMessage);
    }

    $('#language_trigger').show();
  },
  
  exitStartScreen: function () {

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