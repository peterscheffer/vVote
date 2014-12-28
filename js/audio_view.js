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
 * The primary list of audio clip files that represent the voice instructions played to 
 * users in the non-visual interface.
 * 
 * @author Peter Scheffer
 */

// Need to return audio clip as an array, because that is what audioClip is expecting.
function getVisualUiIntroductionAudio (segment) {
  var chosenLanguage = getCurrentLanguageSelection();
  if (audioArray[chosenLanguage] == null) {
      alert("Error: audio not configured correctly.  Missing " + chosenLanguage);
      return;
  }
  return [ audioArray[chosenLanguage][segment] ];
}

function getUncontestedMessage () {
  var chosenLanguage = getCurrentLanguageSelection();
  var audioClips = new Array();
  audioClips = audioClips.concat(audioArray[chosenLanguage]['district_not_being_contested']);
  audioClips = audioClips.concat(audioArray[chosenLanguage]['no_district_please_continue_region']);
  return audioClips;
}