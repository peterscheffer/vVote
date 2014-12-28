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
 * This file implements a range of touch behaviour handlers for touch screen devices.
 * 
 * @author Peter Scheffer
 */

// for preventing accidental double tap of blind user UI.
var lastTouchTime = null;

// for preventing accidental touch after trigger via triple click.
var lastTriggerTime = null;

// for returning to the Audio screen after switching to Visual interface.
var lastAudioScreen = "";
var switchedToVisualMode = false;
var swipeEventStartTime = null;
var lastTouchedButton = null;
var waitToCallButtonNumber = null;
var lastTestButton = null;
var isTouchingRightTrigger = false;
var isTouchingLeftTrigger = false;
var isTouchingRightLanguageTrigger = false;
var isTouchingLeftLanguageTrigger = false;
var isSwitchingLanguage = false;

var delayBeforeNextTrigger = 300;
var timeOfLastTrigger = null;

var keypadLocationX = 380;
var keypadLocationY = 350;
var blindButtonWidth = 92;
var blindButtonHeight = 69;
var triggeredButton = null;
var lastTriggeredButton = null;
var blindTouchAreaLeftX = 330;
var blindTouchAreaTopY = 300;
var blindTouchAreaRightX = 658;
var blindTouchAreaBottomY = 624;

// track when a blind button's name was called out.
var lastButtonCalledOutTime = null;
// allow a gap before triggering the button.
var minimumGapBetweenCalloutAndTrigger = 500;
// the last (previous) button called out.
var lastCalledButton = null;
var lastTriggeredID = null;

// Queued Action is a way of reserving an action until a user triggers it.
// In this scenario, the user presses a numbered button, 
// and if its the one they want, they touch the button again to trigger it.
var queuedAction = null;

// Play the audio of the button name to the blind user.
function blindInterfaceButtonPress(button, event) {
  lastTouchTime = event.timeStamp;
  var container = getContainer();
  var audioController = container.Resolve("audioController");
  audioController.playAudio([audioScreenButtons[button]], false);
}

// Trigger the selected readback behaviour based on interaction.
function scanCandidateListTrigger (event) {

  var container = getContainer();
  var screenFactory = container.Resolve("screenFactory");
  var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
  errorScreen.inactivityResetTimer = 0;
  
  if (event.type == 'hold') {
    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
    errorScreen.inactivityResetTimer = 0;
    window.clearTimeout(errorScreen.inactivityCounterReset);

    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualView = container.Resolve("visualView");
    var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    visualView.displaySection(currentScreen, 'triage_screen');

  } else if (event.type == 'dragend') {
    if (event.direction == 'right') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.readbackCandidateList();
      
    } else if (event.direction == 'left') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();

    } else if (event.direction == 'up') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();

    } else if (event.direction == 'down') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();
    }
  } else {

  }
}

// Trigger the selected readback behaviour based on interaction.
function scanReceiptListTrigger (event) {

  var container = getContainer();
  var screenFactory = container.Resolve("screenFactory");
  var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
  errorScreen.inactivityResetTimer = 0;
  
  if (event.type == 'hold') {
    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
    errorScreen.inactivityResetTimer = 0;
    window.clearTimeout(errorScreen.inactivityCounterReset);

    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualView = container.Resolve("visualView");
    var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    visualView.displaySection(currentScreen, 'triage_screen');

  } else if (event.type == 'dragend') {
    if (event.direction == 'right') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.readbackPreferencesList();
      
    } else if (event.direction == 'left') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();

    } else if (event.direction == 'up') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();

    } else if (event.direction == 'down') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();
    }
  } else {

  }
}

// Trigger the selected readback behaviour based on interaction.
function scanCandidateThenReceiptTrigger (event) {

  var container = getContainer();
  var screenFactory = container.Resolve("screenFactory");
  var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
  errorScreen.inactivityResetTimer = 0;
  
  if (event.type == 'hold') {
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualView = container.Resolve("visualView");
    var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    visualView.displaySection(currentScreen, 'triage_screen');

  } else if (event.type == 'dragend') {
    if (event.direction == 'right') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.readbackCompleteVote();
      
    } else if (event.direction == 'left') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.readbackPreferencesList();

    } else if (event.direction == 'up') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();

    } else if (event.direction == 'down') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();
    }
  } else {

  }
}

// Trigger the selected readback behaviour based on interaction.
function scanReceiptThenCandidateTrigger (event) {

  var container = getContainer();
  var screenFactory = container.Resolve("screenFactory");
  var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
  errorScreen.inactivityResetTimer = 0;
  
  if (event.type == 'hold') {
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualView = container.Resolve("visualView");
    var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    visualView.displaySection(currentScreen, 'triage_screen');

  } else if (event.type == 'dragend') {
    if (event.direction == 'right') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.readbackCompleteVote();
      
    } else if (event.direction == 'left') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.readbackCandidateList();

    } else if (event.direction == 'up') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();

    } else if (event.direction == 'down') {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('scan_error_visual_screen');    
      screenObject.gestureNotSupported();
    }
  } else {

  }
}

// Trigger the selected button for the blind user.
function blindInterfaceGestureTrigger(event) {

  if (switchedToVisualMode) {
    return;
  }

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  votingSession.setAuiInactivityTimer(0);

  // Ignore secondary (accidental) triggers that occur immediately after a correct one.
  if (timeOfLastTrigger != null) {
    var date = new Date();
    var timeOfThisTrigger = date.getTime();
    if (timeOfThisTrigger - timeOfLastTrigger < delayBeforeNextTrigger) {
      return;
    }
  }

  var audioController = container.Resolve("audioController");
  var audioScreenManager = container.Resolve("audioScreenManager");
  var ballotManager = container.Resolve("ballotManager");
  var optionsManager = container.Resolve("optionsManager");
  var blindInterfaceGestureNavigation = container.Resolve("blindInterfaceGestureNavigation");

  // Map gesture events onto gesture triggers.
  var gesture = "";

  if (event.type == 'hold') {    
    if (event.fingers == 1) {
      gesture = 'one_finger_hold';
    } else if (event.fingers == 2) {
      gesture = 'two_finger_hold';
    } else if (event.fingers == 3) {
      gesture = 'three_finger_hold';      
    } else if (event.fingers == 4) {
      gesture = 'four_finger_hold';
    }     
  } else if (event.type == 'drag') {

  } else if (event.type == 'dragend') {

    if (event.direction == 'right') {
      gesture = 'swipe_right';
    } else if (event.direction == 'left') {
      gesture = 'swipe_left';
    } else if (event.direction == 'up') {
      gesture = 'swipe_up';
    } else if (event.direction == 'down') {
      gesture = 'swipe_down';
    }

  } else if (event.type == 'doubletap') {
    gesture = 'single_finger_double_tap';
  }
  
  // Pinch/Push gesture. Currently swallow it.
  if (gesture == 'ontransformstart' ||
      gesture == 'ontransform' ||
      gesture == 'ontransformend') {
    return;
  }

  // Trigger for switching from AUI to VIS is to press two separate squares simultaneously on the screen.
  if ((gesture == "two_finger_hold") && (isTouchingRightTrigger && isTouchingLeftTrigger)) {
    isTouchingRightTrigger = false;
    isTouchingLeftTrigger = false;
    switchToVisualInterfaceForSupport();
    return;
  }

  if (gesture == "") {
    return;
  }

  // Cancel all timeouts, alerts, warnings with regards to inactivity.
  userAlertedOfTimeout = false;
  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  window.clearTimeout(repeatInstructionsTimeout);
  window.clearTimeout(votingSession.getAuiInactivityTimer());
  var currentScreen = audioScreenManager.getCurrentBlindInterfaceScreen();

  if (currentScreen != 'print_receipt_screen' && 
      currentScreen != 'tvs_print_receipt_screen' &&
      currentScreen != 'confirm_all_votes_screen') {
    votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));
  }

  // Retrieve specific Command for this screen/gesture combination.
  var command = blindInterfaceGestureNavigation.getCommand(currentScreen, gesture);
  if (command == undefined) {
    return;
  }
  
  var date = new Date();
  timeOfLastTrigger = date.getTime();  
    
  var executionManager = command.manager;
  executionManager.execute(command);
}

// Trigger the selected button for the blind user.  
function blindInterfaceButtonTrigger(button, event) {

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  votingSession.setAuiInactivityTimer(0);

  var audioController = container.Resolve("audioController");
  var audioScreenManager = container.Resolve("audioScreenManager");
  var blindInterfaceButtonNavigation = container.Resolve("blindInterfaceButtonNavigation");

  // Retrieve specific Command for this screen/button combination.
  var currentScreen = audioScreenManager.getCurrentBlindInterfaceScreen();
  var command = blindInterfaceButtonNavigation.getCommand(currentScreen, button);
  if (command == undefined) {
    return;
  }
  
  var executionManager = command.manager;
  executionManager.execute(command);
}

function touchAudioScreen(e) {

  userAlertedOfTimeout = false;
  window.clearTimeout(repeatInstructionsTimeout);
  
  var container = getContainer();
  votingSession.setInactivityTimer(0);

  if (e.type != 'undefined' && e.type == 'click') {
    if (lastTouchTime != null) {

      var thisTouchTime = e.timeStamp;
      var diff = thisTouchTime - lastTouchTime;
      var button = event.target.id;

      if (diff > 0) {
        if (diff < 500 && (queuedAction == button)) {
          lastTouchTime = null;
          blindInterfaceButtonTrigger(queuedAction);
          e.preventDefault();

          return true;
        } else {
          queuedAction = button;
          blindInterfaceButtonPress(button, event)
          lastTouchTime = null;
        }
      }
    } else {
      var button = event.target.id;
      queuedAction = button;
      blindInterfaceButtonPress(button, event)
    }
  }
}

function playButtonNumber () {
  var container = getContainer();
  var audioController = container.Resolve("audioController");
  var number = audioScreenButtons[lastTouchedButton];
  audioController.playAudio([number], false);
}

function preventScreenDragging() {
  document.ontouchmove = function(e) {
    e.preventDefault();
  }
}