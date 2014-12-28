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
 * IncompleteCouncilAtlAudioScreen - The audio screen class for the incomplete council ATL warning for the blind interface.
 * 
 * @author Peter Scheffer
 */

var IncompleteCouncilAtlAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {
    var clips = new Array();
    clips = clips.concat(['informal_council_atl_warning']);
    var instructions = new AudioInstructions(clips, false, true, null);

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  }
});