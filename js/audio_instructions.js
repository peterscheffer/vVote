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
 * AudioInstructions class manages a sequence of audio files representing a set of instructions.
 * 
 * @author Peter Scheffer
 */

var AudioInstructions = Class.extend({

  // audioClipTags: array of audio tags matching those in audio_view.js
  // repeat: repeat this list of audio clips.
  // interruptible: user can interrupt the audio.
  // callback: what to do when the instructions have finished playing.
  init: function (audioClipTags, repeat, interruptible, callback) {
    this.audioClipTags = audioClipTags;
    this.repeat = repeat;
    this.interruptible = interruptible;
    this.callback = callback;
    this.audioClips = new Array();
    this.typeOf = "AudioInstructions";
    
    // sanitize the clip array to ensure no empty strings.
    for (var index = 0; index < this.audioClipTags.length; index++) {
      if (this.audioClipTags[index] == 0 || this.audioClipTags[index] == null) {
        this.audioClipTags.splice(index, 1);
        index--;
      }
    }

    for (var index = 0; index < this.audioClipTags.length; index++) {
    
      // Search the audio clip array for the tag label.
      var audioFileName = audioArray[this.audioClipTags[index]];
      
      // If it doesn't exist in the array, then the filename is being sent in directly.
      if (audioFileName == null) {
        audioFileName = this.audioClipTags[index];
      }
      
      var audioClip = new AudioClip(audioFileName, index);
      this.audioClips[index] = audioClip;
    }
  },
  
  getIsInterruptible: function () {
    return this.interruptible;
  },

  getAudioClips: function () {
    return this.audioClips;
  },

  getAreRepeated: function () {
    return this.repeat;
  }
});
