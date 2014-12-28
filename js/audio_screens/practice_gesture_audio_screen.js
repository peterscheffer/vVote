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
 * PracticeAudioScreen - The audio screen class for the guided gesture practice for the blind interface.
 * 
 * @author Peter Scheffer
 */

var PracticeAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {

    // At end of playing the complete context help sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var clips = [ ['practice_swipe_up'] ];
                    
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };
  
    var clips = new Array();
    clips = clips.concat([ ['practice_screen'], ['practice_swipe_up'] ]);
    var instructions = new AudioInstructions(clips, true, true, callback1);

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);

    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance('practice_screen');
    
    screen.failedToGestureTimeout = window.setTimeout(function () { screen.failedToGesture(); }, 100000);    
  }, 
  
  failedToGesture: function () {  
    var clips = [ ['user_failed_gestures'] ];
    var container = getContainer();

    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance('practice_screen');
    window.clearTimeout(screen.failedToGestureTimeout);

    var clips = [ ['gvs_timeout_no_gestures'] ];

    var instructions = new AudioInstructions(clips, false, false, null);     
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
    
    window.setTimeout(function () {
      var audioController = container.Resolve("audioController");
      var audioScreenManager = container.Resolve("audioScreenManager");
      audioScreenManager.execute({ 
        request: 'enterScreen', 
        data: 'tvs_entry_screen', 
        callback: audioController.enterBlindUiScreen 
      });
    }, 7000);
  },
  
  practiceGesture: function (response, error) {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var audioScreenManager = container.Resolve("audioScreenManager");    
    
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance('practice_screen');
    window.clearTimeout(screen.failedToGestureTimeout);

    // At end of playing the complete context help sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var clips = [ [audioScreenManager.getNextPracticeGesture(response)] ];
                    
      var instructions = new AudioInstructions(clips, false, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };
    
    var clips = new Array();

    // If the user got the gesture wrong, tell them and ask them to do it again.
    if (response == 'failed gestures') {
      clips = clips.concat(['user_failed_gestures']);
      var instructions = new AudioInstructions(clips, false, false, null);
      audioController.playAudioInstructions(instructions);
      window.setTimeout(this.clearFailure, 3000);
      return;

    } else if (response == 'go to tvs') {
      audioScreenManager.execute({ 
        request: 'enterScreen', 
        data: 'tvs_entry_screen', 
        callback: audioController.enterBlindUiScreen 
      });
      
      return;      

    } else if (response == 'error') {
      clips = clips.concat(['gesture_incorrect'], [audioScreenManager.getCurrentPracticeGesture()]);
      
    // If double finger press, we are done with guided practice and move to the next screen.
    } else if (response == 'practice_three_finger_press_hold') {

      audioScreenManager.execute({ 
        request: 'enterScreen', 
        data: 'free_practice_screen', 
        callback: audioController.enterBlindUiScreen 
      });
      
      return;

    } else {
      clips = clips.concat(['gesture_correct'], [audioScreenManager.getNextPracticeGesture(response)]);
    }
    
    var instructions = new AudioInstructions(clips, true, true, callback1);
    audioController.playAudioInstructions(instructions);
    
    this.failedToGestureTimeout = window.setTimeout(this.failedToGesture, 65000);
  },
  
  clearFailure: function () {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var audioScreenManager = container.Resolve("audioScreenManager");
    audioScreenManager.clearGestureFailure();

    var clips = [ ['gesture_incorrect'], [audioScreenManager.getCurrentPracticeGesture()] ];
    var instructions = new AudioInstructions(clips, true, false, null);
    audioController.playAudioInstructions(instructions);
  }
}); 
