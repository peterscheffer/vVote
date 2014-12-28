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
 * TranslatedAudioInstructions class manages an translated introductory audio instruction.
 * 
 * @author Peter Scheffer
 */

var TranslatedAudioInstructions = Class.extend({

  // audioClipTags: array of audio tags matching those in audio_view.js
  // repeat: repeat this list of audio clips.
  // interruptible: user can interrupt the audio.
  // callback: what to do when the instructions have finished playing.
  init: function (language, audioClipTags, repeat, interruptible, callback) {
    this.audioClipTags = audioClipTags;
    this.repeat = repeat;
    this.interruptible = interruptible;
    this.callback = callback;
    this.audioClips = new Array();
    this.language = language;
    
    for (var index = 0; index < this.audioClipTags.length; index++) {
      var audioClip = new AudioClip(audioArray[this.language][this.audioClipTags[index]], index);
      this.audioClips[index] = audioClip;
    }
  },

  getAudioClips: function () {
    return this.audioClips;
  },

  getAreRepeated: function () {
    return this.repeat;
  }
});
