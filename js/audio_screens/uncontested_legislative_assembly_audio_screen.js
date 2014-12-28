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
 * UncontestedLegislativeAssemblyAudioScreen - The audio screen class for an uncontested assembly ballot for the blind interface.
 * 
 * @author Peter Scheffer
 */
 
var UncontestedLegislativeAssemblyAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  // First time entering the screen.
  initialEntry: function () {    

    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var audioController = container.Resolve("audioController");
    var screen = audioScreenFactory.getInstance('practice_screen');
    window.clearTimeout(screen.failedToGestureTimeout);

    var votingSession = container.Resolve("votingSession");
    var districtAudioFile = votingSession.getDistrictAudioFile();
    var chosenLanguage = getCurrentLanguageSelection();
    var uncontestedMessage = audioArray[chosenLanguage]['district_not_being_contested'];

    var clips = [ ['district_ballot_for'],
                  [districtAudioFile],
                  [uncontestedMessage],
                  ['press_two_fingers_to_continue'] ];

    var instructions = new AudioInstructions(clips, true, true, null);
    audioController.playAudioInstructions(instructions);
  }  
});