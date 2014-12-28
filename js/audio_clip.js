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
 * AudioClip class manages the sequencing and playback of audio files.
 * A series of files need to be played in audio, and due to the lack of support in hardware to do this using HTML5,
 * this class takes care of putting the files in the correct order and ensuring that they play one after another.
 * The tags used to name audio clips map onto specific audio files in audio_config.txt
 * 
 * @author Peter Scheffer
 */

var repeatInstructionsTimeout = null;
var clipIndex = 0;
var playback = false;

var AudioClip = Class.extend({
  
  init: function (audioFileName, index) {
    this.index = index;
    this.clipName = audioFileName;
    this.isCancelled = false;
    this.playbackRate = 1;
    this.repeat = false;
    this.audio = null;
  },

  // Play this audio clip.
  play: function () {
    
    this.audio = document.getElementById('complete_audio');
    this.audio.src = this.clipName;
    this.audio.load();
    this.audio.play();
    this.audio.addEventListener('ended', this.clipEnded, false);
    
    var container = getContainer();
    var currentAudio = container.Resolve("currentAudio");
    currentAudio.setAudioClip(this);
    
    // Set the speed of the audio.
    var optionsManager = container.Resolve("optionsManager");
    document.getElementById('complete_audio').playbackRate = optionsManager.getPlaybackRate();
    
    // Set the callback function for when the audio ends.
    var audioController = container.Resolve("audioController");
    var audioInstructions = audioController.getCurrentInstructions();
    if (audioInstructions != null) {
      this.endOfInstructionsCallback = audioInstructions.callback;
    }
  },
  
  // Stop this audio clip from playing.
  stop: function () {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var audioInstructions = audioController.getCurrentInstructions();
    if (audioInstructions != null) {
      var interruptible = audioInstructions.getIsInterruptible();
      if (interruptible == true) {
        this.audio.pause();      
      }
    }
  },
  
  // Cancel the callback function that is waiting to be played.
  cancelCallback: function () {
    var container = getContainer();
    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    if (audioClip.endOfInstructionsCallback != null) {
      audioClip.endOfInstructionsCallback = null;
    }
  },

  // Check if the audio clip has finished playing by monitoring how far through it has played.
  checkCurrentTime: function () {
    var container = getContainer();
    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    var audioController = container.Resolve("audioController");
    if (audioClip.audio != undefined) {
      if (audioClip.audio.currentTime >= (audioClip.audio.duration)) {
        audioClip.audio.currentTime = 0;
        clipEnded();
      } else {
        window.setTimeout(function () { audioClip.checkCurrentTime(); }, 1000);
      }
    }
  },
  
  // Skip forwards a number of clips (one segment) to the start of the next segment 
  // in the current list list of audio clips.  Base is the position from which to 
  // begin the jump, skipCount is the number of clips in a segment.
  skipToClip: function (base, skipCount) {

    var container = getContainer();
    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    var audioController = container.Resolve("audioController");
    var queuedClips = audioController.getQueuedClips();
    
    if (clipIndex >= queuedClips.length || 
        (base + skipCount > queuedClips.length)) {
      return;
    }
    
    this.audio.pause();
    this.currentTimeout = null;
    var startAtFirst = false;

    // The following frees the audio player to play the next clip.
    audioClip.audio.src = " ";
    audioClip.audio.load();

    // If there are more segments to play in the queue, then load and play the next segment.
    if (clipIndex <= base) {
      clipIndex = base;
      startAtFirst = true;
    }    

    var currentPosition = clipIndex - base;
    var currentSegment = Math.floor(currentPosition / skipCount);

    if (!startAtFirst) {
      currentSegment++;
    }
    clipIndex = base + (currentSegment * skipCount);

    if (clipIndex >= queuedClips.length) {
      if (audioClip.endOfInstructionsCallback != null) {
        audioClip.endOfInstructionsCallback();
        return;
      }
    }

    var nextClip = queuedClips[clipIndex];
    if (nextClip != null) {
      nextClip.play();
      this.currentTimeout = window.setTimeout(function () { audioClip.checkCurrentTime(); }, 1000);
    }
  },
  
  // Determine post-play action.
  clipEnded: function () {

    var container = getContainer();
    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    var audioController = container.Resolve("audioController");
    var queuedClips = audioController.getQueuedClips();
    
    if (queuedClips == null) {
      return;
    }
    
    this.currentTimeout = null;

    // The following frees the audio player to play the next clip.
    audioClip.audio.src = " ";
    audioClip.audio.load();

    // What to do at the end of playing a sequence of clips.  Check for callback.
    if (clipIndex == queuedClips.length - 1) {
      if (audioClip.endOfInstructionsCallback != null) {
        audioClip.endOfInstructionsCallback();
        return;
      }

      // Repeat the current screen instructions after a timeout if the user hasn't pressed anything.      
      if (audioController.getInstructionsAreRepeated()) {
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
        return;
      } else {
        audioController.repeatInstructionsTimeout = null;
        audioController.setCurrentInstructions(null);
      }
    }

    // If there are more clips to play in the queue, then load and play the next clip.
    if (clipIndex < queuedClips.length-1) {
      var nextClip = queuedClips[++clipIndex];
      nextClip.play();
console.log("************************* playing audio " + nextClip.clipName);
      this.currentTimeout = window.setTimeout(function () { audioClip.checkCurrentTime(); }, 1000);
    
    } else if (clipIndex == queuedClips.length-1) {
      clipIndex = 0;
      audioController.setCurrentInstructions(null);
    }
  }
});

// Singleton of the current audio clip that is being played.
var CurrentAudio = Class.extend({
  init: function (audioClip) {
    this.audioClip = audioClip;
  },
  
  getAudioClip: function () {
    return this.audioClip;
  },
  
  setAudioClip: function (audioClip) {
    this.audioClip = audioClip;
  }
});    