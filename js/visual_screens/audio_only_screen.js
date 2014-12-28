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
 * AudioOnlyScreen - The visual screen class for the audio only screen.
 * 
 * @author Peter Scheffer
 */

var AudioOnlyScreen = Screen.extend({
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");                     
    this._super(visualScreenManager, 'audio_only_screen', 
      this.initialiseAudioOnlyScreen,
      this.exitAudioOnlyScreen,
      this.switchToAudioOnlyScreen);
  },
  
  initialiseAudioOnlyScreen: function () {
    
  },
  
  exitAudioOnlyScreen: function () {
    
  },
    
  switchToAudioOnlyScreen: function () {
    
  }
});