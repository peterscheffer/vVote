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
 *  User alerts, timeout checks, system locking and unlocking. 
 * 
 * @author Peter Scheffer
 */

// What was the last screen shown before the timeout lock screen (to return to it.)
var preTimeoutScreen = null;

// Remember the user's contrast preference before changing it for timeout alerts.
var oldStyle = null;

// Timeout interval check and screen lock.
function checkForTimeout () {

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  var inactivityTimer = votingSession.getInactivityTimer();

  if (votingSession.getIsVisualMode() == false) {
    window.clearTimeout(votingSession.getInactivityCounterTimer());
    votingSession.setInactivityTimer(0);
    return;
  }

  inactivityTimer += 2000;
  
  if (inactivityTimer >= INACTIVITY_TIMEOUT_PERIOD) {
    window.clearTimeout(votingSession.getInactivityCounterTimer());
    votingSession.setInactivityTimer(0);
    showTimeoutAlert();
  } else {
    window.clearTimeout(votingSession.getInactivityCounterTimer());
    votingSession.setInactivityCounterTimer(window.setTimeout(function () { checkForTimeout(); },  2000));
    votingSession.setInactivityTimer(inactivityTimer);
  }
}

// Timeout interval check for AUI and screen lock.
function checkForAuiTimeout () {

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");

  if (votingSession.getIsVisualMode() == true) {
    window.clearTimeout(votingSession.getAuiInactivityCounterTimer());
    votingSession.setAuiInactivityTimer(0);
    return;
  }

  var userAlertedOfTimeout = votingSession.getUserAlertedOfTimeout();
  var auiInactivityTimer = votingSession.getAuiInactivityTimer();

  auiInactivityTimer += 2000;

  // If timer measures longer than maximum timeout period, lock the screen.
  if (auiInactivityTimer >= AUI_INACTIVITY_TIMEOUT_PERIOD) {
    auiScreenLocked = true;
    
    window.clearTimeout(votingSession.getAuiInactivityCounterTimer());

    // Stop the current audio.
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();
    
    // Play a message warning the user that the screen is locked.
    var instructions = new AudioInstructions(['screen_automatically_locked'], true, true, null);
    audioController.playAudioInstructions(instructions);    

    var visualScreenManager = container.Resolve('visualScreenManager');
    
    $('#aui_timeout_modal_background').hide();
    $('#aui_timeout_modal_container').hide();

    showTimeoutLockScreen();

    // reset the flag for next time.    
    votingSession.setUserAlertedOfTimeout(false);
    
  // Play timeout alert to the user if T minus 10 seconds.
  } else if (auiInactivityTimer >= (AUI_INACTIVITY_TIMEOUT_PERIOD - AUI_COUNTDOWN_PERIOD) && !userAlertedOfTimeout) {
  
    // Stop the current audio.
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();
    
    window.clearTimeout(votingSession.getAuiInactivityCounterTimer());
    votingSession.setAuiInactivityTimer(auiInactivityTimer);
    votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));
    
    // Play a message warning the user that the screen is about to be locked.
    var instructions;
    
    if (gvsMode == true) {
      instructions = new AudioInstructions(['system_will_timeout_10_seconds'], true, true, null);
    } else {
      instructions = new AudioInstructions(['tvs_system_will_timeout_10_seconds'], true, true, null);
    }

    audioController.playAudioInstructions(instructions);    

    showAuiTimeoutAlert();
    
    votingSession.setUserAlertedOfTimeout(true);
    
  } else {
    window.clearTimeout(votingSession.getAuiInactivityCounterTimer());
    votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));
    votingSession.setAuiInactivityTimer(auiInactivityTimer);
  }
}

// Count backwards from 10, and reset the application if it gets to zero.
function timeoutCountdown () {
  if (timeoutCounter == 0) {
    window.clearTimeout(countdownTimeout);
    showTimeoutLockScreen();
  } else {
    $('#timeout_countdown_message').html(timeoutCounter);
    timeoutCounter = timeoutCounter - 1;
    window.clearTimeout(countdownTimeout);
    countdownTimeout = window.setTimeout(function () { timeoutCountdown(); }, 1000);
  }
}

// Count backwards from 10, and reset the application if it gets to zero.
function auiTimeoutCountdown () {
  if (timeoutCounter == 0) {
    window.clearTimeout(countdownTimeout);
    showTimeoutLockScreen();
  } else {
    $('#aui_timeout_countdown_message').html(timeoutCounter);
    timeoutCounter = timeoutCounter - 1;
    window.clearTimeout(countdownTimeout);
    countdownTimeout = window.setTimeout(function () { auiTimeoutCountdown(); }, 1000);
  }
}

// Show the timeout warning.
function showTimeoutAlert () {
  timeoutCounter = 10;

  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
  preTimeoutScreen = currentScreen;
  visualView.displaySection(currentScreen, 'timeout_screen'); 

  $('#timeout_modal_background').show();
  $('#timeout_modal_container').show();

  oldStyle = $("#font_color_styles").attr('href');
  $("#select_wob").click();

  timeoutCountdown();
}

// Hide the timeout warning.
function hideTimeoutAlert () {

  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var previousScreen = visualScreenManager.getPreviousVisualInterfaceScreen();
  visualView.displaySection('timeout_screen', previousScreen);

  var votingSession = container.Resolve("votingSession");
  window.clearTimeout(countdownTimeout);
  window.clearTimeout(votingSession.getInactivityCounterTimer());
  votingSession.setInactivityCounterTimer(window.setTimeout(function () { checkForTimeout(); }, 2000));
  votingSession.setInactivityTimer(0);

  $('#timeout_modal_background').hide();
  $('#timeout_modal_container').hide();

  if (oldStyle == "css/styles_black_on_white.css") {
    $("#select_bow").click();
  }
}

// Show the timeout warning for AUI.
function showAuiTimeoutAlert () {
  timeoutCounter = 10;

  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
  preTimeoutScreen = currentScreen;
  visualView.displaySection(currentScreen, 'aui_timeout_screen'); 

  $('#aui_timeout_modal_background').show();
  $('#aui_timeout_modal_container').show();

  oldStyle = $("#font_color_styles").attr('href');
  $("#select_wob").click();

  auiTimeoutCountdown();
}

// Hide the AUI timeout warning.
function hideAuiTimeoutAlert () {

  // Stop the current audio.
  var container = getContainer();
  var audioController = container.Resolve("audioController");
  audioController.stopAudio();
  audioController.cancelRepeatInstructions();

  var votingSession = container.Resolve("votingSession");
  window.clearTimeout(countdownTimeout);
  window.clearTimeout(votingSession.getAuiInactivityCounterTimer());
  votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));
  votingSession.setAuiInactivityTimer(0);

  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var previousScreen = visualScreenManager.getPreviousVisualInterfaceScreen();
  visualView.displaySection('aui_timeout_screen', previousScreen);

  $('#aui_timeout_modal_background').hide();
  $('#aui_timeout_modal_container').hide();

  if (oldStyle == "css/styles_black_on_white.css") {
    $("#select_bow").click();
  }

  // reset the flag for next time.    
  votingSession.setUserAlertedOfTimeout(false);

  var callback1 = function () {

    // Play instructions for current screen again.
    var audioScreenManager = container.Resolve("audioScreenManager");
    var currentScreen = audioScreenManager.getCurrentBlindInterfaceScreen();
    audioScreenManager.execute({ 
      request: 'returnFromTimeoutScreen', 
      data: currentScreen, 
      callback: audioController.returnFromTimeout
    });
  };    
  var clips = [ ['returning_to_voting_session'] ];
  var instructions = new AudioInstructions(clips, true, true, callback1);
  audioController.playAudioInstructions(instructions);
}

function showTimeoutLockScreen () {

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");

  window.clearTimeout(votingSession.getInactivityCounterTimer());
  window.clearTimeout(votingSession.getCountdownTimeout());

  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  visualView.displaySection('timeout_screen', 'timeout_lock_screen'); 
}

function hideTimeoutLockScreen () {
  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  visualView.displaySection('timeout_lock_screen', 'timeout_unlock_screen'); 
}

// Timeout interval check and screen lock.
function checkForReset () {

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  var inactivityResetTimer = votingSession.getInactivityResetTimer();

  inactivityResetTimer += 2000;
  
  if (inactivityResetTimer >= INACTIVITY_RESET_PERIOD) {
    window.clearTimeout(votingSession.getInactivityCounterReset());
    votingSession.setInactivityResetTimer(0);
    showResetAlert();
  } else {
    window.clearTimeout(votingSession.getInactivityCounterReset());
    votingSession.setInactivityCounterReset(window.setTimeout(function () { checkForReset(); }, 2000));
    votingSession.setInactivityResetTimer(inactivityResetTimer);
  }
}

// Count backwards from 10, and reset the application if it gets to zero.
function resetCountdown () {

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  
  if (resetCounter == 0) {
    window.clearTimeout(votingSession.getCountdownReset());
    var visualController = container.Resolve('visualController');
    visualController.quitApplication();
    $('#reset_modal_background').hide();
    $('#reset_modal_container').hide();
  } else {
    $('#reset_countdown_message').html(resetCounter);
    resetCounter = resetCounter - 1;
    window.clearTimeout(votingSession.getCountdownReset());
    votingSession.setCountdownReset(window.setTimeout(function () { resetCountdown(); }, 1000));
  }
}

// Hide the timeout warning.
function hideResetAlert () {

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  window.clearTimeout(votingSession.getCountdownReset());

  $('#reset_modal_background').hide();
  $('#reset_modal_container').hide();

  var visualView = container.Resolve('visualView');
  visualView.displaySection('reset_screen', preResetScreen); 

  window.clearTimeout(votingSession.getInactivityCounterReset());
  votingSession.setInactivityCounterReset(window.setTimeout(function () { checkForReset(); }, 2000));
  votingSession.setInactivityResetTimer(0);
}

// Show the reset warning.
function showResetAlert () {

  resetCounter = 10;

  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
  preResetScreen = currentScreen;
  visualView.displaySection(currentScreen, 'reset_screen'); 

  $('#reset_modal_background').show();
  $('#reset_modal_container').show();

  resetCountdown();
}

function showConfirmDiscardScreen () {
  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  visualView.displaySection('timeout_lock_screen', 'confirm_discard_screen'); 
}

function hideConfirmDiscardScreen () {
  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  visualView.displaySection('confirm_discard_screen', 'timeout_lock_screen'); 
}

function unlockScreen () {

  var unlockButtonLabel = $("#unlock_screen_unlock_button").html();
  var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
  var tryAgainMessage = $.i18n._(languageDictionary['try_again']);
  var unlockButton = $.i18n._(languageDictionary['unlock_screen_unlock_button']);
  
  if (unlockButtonLabel == tryAgainMessage) {
    $("#unlock_screen_unlock_button").html(unlockButton);
    $("#unlock_pin").val("");
    $("#unlock_pin").css("color", "#FFFFFF");
    $("#unlock_pin").css("font-size", "90pt");
    $("#hidden_pin").val("");
    
    return;
  }

  var pinValue = $("#hidden_pin").val();
  if (pinValue == PIN) {
    $("#hidden_pin").val("");
    unlockLockScreen();
  } else {
    var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
    var tryAgainMessage = $.i18n._(languageDictionary['try_again']);
    var incorrectPinMessage = $.i18n._(languageDictionary['incorrect_pin']);
    $("#unlock_pin").val(incorrectPinMessage);
    $("#unlock_pin").css("color", "#FF0000");
    $("#unlock_pin").css("font-size", "35pt");
    $("#unlock_screen_unlock_button").html(tryAgainMessage);
  }
}

function deleteDigit () {
  var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
  var incorrectPinMessage = $.i18n._(languageDictionary['incorrect_pin']);
  var pinValue = $("#unlock_pin").val();
  if (pinValue == incorrectPinMessage) {
    return;
  }
  
  $("#unlock_pin").val(pinValue.substring(0, pinValue.length - 1));
  var hiddenPinValue = $("#hidden_pin").val();
  hiddenPinValue = hiddenPinValue.substring(0, hiddenPinValue.length - 1);
  $("#hidden_pin").val(hiddenPinValue);
}

function enterDigit (button) {
  var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
  var incorrectPinMessage = $.i18n._(languageDictionary['incorrect_pin']);
  var pinValue = $("#unlock_pin").val();
  if (pinValue == incorrectPinMessage) {
    return;
  }
  
  var starCount = pinValue.length;
  $("#unlock_pin").val(pinValue + "*");
  
  var buttonValue = $("#" + button.id).html();
  var hiddenPinValue = $("#hidden_pin").val();
  hiddenPinValue = hiddenPinValue + buttonValue;
  $("#hidden_pin").val(hiddenPinValue);
}

function unlockLockScreen () {
  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  visualView.displaySection('timeout_unlock_screen', preTimeoutScreen);

  if (oldStyle == "css/styles_black_on_white.css") {
    $("#select_bow").click();
  }

  var audioController = container.Resolve("audioController");
  audioController.stopAudio();
  audioController.cancelRepeatInstructions();
  
  var votingSession = container.Resolve("votingSession");

  if (auiScreenLocked) {
  
    var callback1 = function () {

      // Play instructions for current screen again.
      var container = getContainer();      
      var audioScreenManager = container.Resolve("audioScreenManager");
      var currentScreen = audioScreenManager.getCurrentBlindInterfaceScreen();
      audioScreenManager.execute({ 
        request: 'returnFromTimeoutScreen', 
        data: currentScreen, 
        callback: audioController.returnFromTimeout
      });
    };    
    
    var clips = [ ['returning_to_voting_session'] ];
    var instructions = new AudioInstructions(clips, true, true, callback1);
    audioController.playAudioInstructions(instructions);
  
    votingSession.setAuiInactivityTimer(0);
    votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));
  } else {
    votingSession.setInactivityTimer(0);
    votingSession.setInactivityCounterTimer(window.setTimeout(function () { checkForTimeout(); }, 2000));
  }
}

function hideUnlockScreen () {
  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  visualView.displaySection('timeout_unlock_screen', 'timeout_lock_screen');
}

// Show the error warning.
function showSubmitErrorAlert (error) {
  console.log("error: " + error);
  $('#submit_error_modal_background').show();
  $('#submit_error_modal_container').show();
  $('#submit_error_modal_header').show();
  $('#submit_error_modal_footer').show();
}

// Hide the error warning.
function hideSubmitErrorAlert () {
  $('#submit_error_modal_background').hide();
  $('#submit_error_modal_container').hide();
  $('#submit_error_modal_header').hide();
  $('#submit_error_modal_footer').hide();
}

// Show the error warning.
function showInvalidQrAlert () {
  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
  visualView.displaySection(currentScreen, 'invalid_qr_screen'); 

  $('#invalid_qr_modal_background').show();
  $('#invalid_qr_modal_container').show();
  $('#invalid_qr_modal_header').show();
  $('#invalid_qr_modal_footer').show();
  
  var audioController = container.Resolve("audioController");
  var instructions = new AudioInstructions(['invalid_qr_code'], true, true, null);
  audioController.playAudioInstructions(instructions);
}

// Hide the error warning.
function hideInvalidQrAlert () {
  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var previousScreen = visualScreenManager.getPreviousVisualInterfaceScreen();
  visualView.displaySection('invalid_qr_screen', previousScreen);

  $('#invalid_qr_modal_background').hide();
  $('#invalid_qr_modal_container').hide();
  $('#invalid_qr_modal_header').hide();
  $('#invalid_qr_modal_footer').hide();
}

// AJAX call timeout when querying MBB.
function alertFailure (x, t, m) {
  if (t === "timeout") {
    alertFailureToConnect();
  } else {
    alert(t);
  }
}

// Show the "taking long time" alert.
function showMbbTimeoutAlert () {

  window.clearTimeout(alertDelayedTimeout);

  var container = getContainer();
  var audioController = container.Resolve("audioController");
  audioController.stopAudio();
  audioController.cancelRepeatInstructions();
  
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
  visualView.displaySection(currentScreen, 'mbb_timeout_screen'); 

  $('#mbb_timeout_modal_background').show();
  $('#mbb_timeout_modal_container').show();
}

// Show the "failed to connect" alert.
function alertFailureToConnect () {
  var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
  var mbbTimeoutFailureMessage = $.i18n._(languageDictionary['mbb_timeout_failure_message']);
  var mbbTimeoutOk = $.i18n._(languageDictionary['mbb_timeout_ok']);

  $('#mbb_timeout_modal_message').html(mbbTimeoutFailureMessage);
  $('#mbb_timeout_modal_back_button').html(mbbTimeoutOk);
}

// Hide the timeout warning.
function hideMbbTimeoutAlert () {

  var container = getContainer();
  var audioController = container.Resolve("audioController");
  var instructions = new AudioInstructions([ ['four_fingers_on_screen'] ], true, true, null);
  audioController.playAudioInstructions(instructions);

  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var previousScreen = visualScreenManager.getPreviousVisualInterfaceScreen();
  visualView.displaySection('mbb_timeout_screen', previousScreen);

  var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
  var mbbTimeoutWarningMessage = $.i18n._(languageDictionary['mbb_timeout_warning_message']);
  var mbbTimeoutCancel = $.i18n._(languageDictionary['mbb_timeout_cancel']);

  $('#mbb_timeout_modal_message').html(mbbTimeoutWarningMessage);
  $('#mbb_timeout_modal_back_button').html(mbbTimeoutCancel);

  $('#mbb_timeout_modal_background').hide();
  $('#mbb_timeout_modal_container').hide();
}
 
// Show the "failed to submit" alert.
function alertFailureToSubmit () {
  var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
  var failedSubmitFailureMessage = $.i18n._(languageDictionary['failed_submit_failure_message']);
  var failedSubmitOk = $.i18n._(languageDictionary['failed_submit_ok']);

  $('#failed_submit_modal_message').html(failedSubmitFailureMessage);
  $('#failed_submit_modal_back_button').html(failedSubmitOk);

  $('#failed_submit_modal_background').show();
  $('#failed_submit_modal_container').show();
}

function hideFailedSubmitAlert () {

  var container = getContainer();
  var visualView = container.Resolve('visualView');
  var visualScreenManager = container.Resolve('visualScreenManager');
  var previousScreen = visualScreenManager.getPreviousVisualInterfaceScreen();
  visualView.displaySection('failed_submit_screen', previousScreen);

  $('#failed_submit_modal_background').hide();
  $('#failed_submit_modal_container').hide();
}

function playGvsSubmitFailureAlert (error) {
  console.log(error);
  var container = getContainer();
  var audioController = container.Resolve("audioController");
  var instructions = new AudioInstructions([ ['failed_submit_swipe_right'] ], true, true, null);
  audioController.playAudioInstructions(instructions);
}

function playTvsSubmitFailureAlert (error) {
  console.log(error);
  var container = getContainer();
  var audioController = container.Resolve("audioController");
  var instructions = new AudioInstructions([ ['failed_submit_press_2'] ], true, true, null);
  audioController.playAudioInstructions(instructions);
}

// Show the please wait warning.
function showWaitingAlert () {
    
  var container = getContainer();    
  var visualScreenManager = container.Resolve("visualScreenManager");
  var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();

  $("#" + currentVisualInterfaceScreen).hide();
  $("#wait_modal_background").show();
  $("#wait_modal_container").show();
}

// Hide the please wait warning.
function hideWaitingAlert () {
  $("#wait_modal_background").hide();
  $("#wait_modal_container").hide();
}
