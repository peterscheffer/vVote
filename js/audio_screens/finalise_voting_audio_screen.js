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
 * FinaliseVotingAudioScreen - The audio screen class for the final screen for the blind interface.
 * 
 * @author Peter Scheffer
 */

var FinaliseVotingAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {
        
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var instructions = new AudioInstructions(['finalise_voting'], false, false, null);
    audioController.playAudioInstructions(instructions);
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance("finalise_voting_screen");
    window.setTimeout(function () { screen.resetApplication(); }, 15000);
  },
  
  resetApplication: function () {

    var audioController = container.Resolve("audioController");
    audioController.quitApplication();
  }
});