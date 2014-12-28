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
 * Functions for reading and handling QR code scanning.
 * 
 * @author Peter Scheffer
 */

// Read the ballot shuffle orders from the QR code and apply accordingly.
function readPreferenceList(qrData) {

  var district = qrData[1];
  var region = qrData[2];
  var serialNumber = qrData[3];
  var dateTime = qrData[4];
  var votingCentre = qrData[5];
  var votingPreferences = qrData[6];
  var districtUncontested = qrData[7];
  var regionUncontested = qrData[8];

  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  votingSession.setDistrict(district);
  votingSession.setRegion(region);
  votingSession.setSerialCode(serialNumber);
  votingSession.setDistrictIsUncontested(districtUncontested);
  votingSession.setRegionIsUncontested(regionUncontested);
  
  var readbackSession = container.Resolve("readbackSession");
  readbackSession.setDateVoted(dateTime);
  readbackSession.setLocationVoted(votingCentre);
  readbackSession.setVote(votingPreferences);
  readbackSession.setScannedPreferencesReceipt(true);
  readbackSession.setSerialCode(serialNumber);
  
  setBallotDrawData(district, region);
  
  handlePreferencesSlipQrScanResponse();
}

// Read the ballot shuffle orders and application settings from the QR code and apply accordingly.
// Returns the serial number in the QR code.
function readCandidateList(qrData) {

  var district = qrData[0];
  var region = qrData[1];
  var serialCode = qrData[2];
  var shuffleOrder = qrData[3].split(":");
  var assemblyShuffleOrder = shuffleOrder[0];
  var atlShuffleOrder = shuffleOrder[1];
  var btlShuffleOrder = shuffleOrder[2];
  var signature = qrData[4];
  var language = languageOptions[qrData[5]];
  var fontSize = FONT_SIZE[qrData[6]];
  var contrast = COLOR_CONTRAST[qrData[7]];
  var userInterface = INTERFACE[qrData[8]];
  var districtUncontested = qrData[9];
  var regionUncontested = qrData[10];

  applyQrCodeSettings(language, fontSize, contrast, userInterface);  

  var container = getContainer();
  var legislativeAssemblyBallot = container.Resolve("assembly");
  var aboveTheLineCouncilBallot = container.Resolve("atl");
  var belowTheLineCouncilBallot = container.Resolve("btl");  
  legislativeAssemblyBallot.setShuffleOrder(assemblyShuffleOrder);
  aboveTheLineCouncilBallot.setShuffleOrder(atlShuffleOrder);
  belowTheLineCouncilBallot.setShuffleOrder(btlShuffleOrder);

  var votingSession = container.Resolve("votingSession");
  votingSession.setDistrict(district);
  votingSession.setRegion(region);
  votingSession.setSerialCode(serialCode);
  votingSession.setSignature(signature);
  votingSession.setLanguage(language);
  votingSession.setDistrictIsUncontested(districtUncontested);
  votingSession.setRegionIsUncontested(regionUncontested);

  setBallotDrawData(district, region);

  var districtIsUncontested = votingSession.getDistrictIsUncontested();

  // Check for AUI option.
  if (userInterface == GVS) {
    gvsMode = true;
    tvsMode = false;
    $('#keypad').hide();
  } else if (userInterface == TVS) {
    tvsMode = true;
    gvsMode = false;
    $('#keypad').show();
  }

  if (language == null || fontSize == null || contrast == null || userInterface == null || atlShuffleOrder == null || btlShuffleOrder == null) {
    throw "invalid_qr_code";
  }
  
  if (!districtIsUncontested && assemblyShuffleOrder == null) {
    throw "invalid_qr_code";
  }

  return serialCode;
}

function applyQrCodeSettings (language, fontSize, contrast, userInterface) {

  var container = getContainer();
  var votingSession = container.Resolve("votingSession"); 
  
  if (fontSize == MEDIUM) {
    votingSession.setFontSize(MEDIUM);
    votingSession.setQrFontSize(MEDIUM);
  } else if (fontSize == LARGE) {
    votingSession.setFontSize(LARGE);
    votingSession.setQrFontSize(LARGE);
  }

  changeLanguage(language);
  
  if (contrast == COLOR) {
    $("#color_option").click();
  } else if (contrast == BLACK_ON_WHITE) {
    $('#black_on_white_option').click();
  } else if (contrast == WHITE_ON_BLACK) {
    $('#white_on_black_option').click();
  }
}

function handlePreferencesSlipQrScanResponse () {

  window.clearTimeout(alertDelayedTimeout);

  var container = getContainer();
  var visualScreenManager = container.Resolve("visualScreenManager");
  var screenFactory = container.Resolve("screenFactory");
  var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
  if (currentVisualInterfaceScreen != 'scan_error_visual_screen') {
    var visualView = container.Resolve("visualView");
    visualView.displaySection(currentVisualInterfaceScreen, 'scan_error_visual_screen');
  }
  var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
  errorScreen.displayPreferencesSlipDetails();
}

function storeVoteInSession(data) {
  var container = getContainer();
  var readbackSession = container.Resolve("readbackSession");
  readbackSession.setVote(data);

  window.clearTimeout(alertDelayedTimeout);
}

function handleCandidateSlipQrScanResponse (data) {

  window.clearTimeout(alertDelayedTimeout);

  var container = getContainer();
  var visualScreenManager = container.Resolve("visualScreenManager");
  var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
  var visualView = container.Resolve("visualView");
  var screenFactory = container.Resolve("screenFactory");
  var audioScreenFactory = container.Resolve("audioScreenFactory");
  var audioScreenManager = container.Resolve("audioScreenManager");
  var audioController = container.Resolve("audioController");
  audioController.cancelRepeatInstructions();

  var readbackSession = container.Resolve("readbackSession");
  readbackSession.setScannedCandidateSlip(true);

  serialNumber = readCandidateList(data);

  // If it hasn't been voted, does it instruct the app to enter GVS, TVS, or VUI?
  if (gvsMode == true) {
    $('#keypad').hide();

    window.clearTimeout(inactivityCounterTimeout);

    // Listen for audio UI gestures.
    var touchContainer = document.getElementById('audio_only_screen');
    var hammer = new Hammer(touchContainer);
    hammer.onhold = blindInterfaceGestureTrigger;
    hammer.ontap = blindInterfaceGestureTrigger;
    hammer.ondoubletap = blindInterfaceGestureTrigger;
    hammer.ontransformstart = blindInterfaceGestureTrigger;
    hammer.ontransform = blindInterfaceGestureTrigger;
    hammer.ontransformend = blindInterfaceGestureTrigger;
    hammer.ondragstart = blindInterfaceGestureTrigger;
    hammer.ondrag = blindInterfaceGestureTrigger;
    hammer.ondragend = blindInterfaceGestureTrigger;
        
    visualView.displaySection(currentVisualInterfaceScreen, 'audio_only_screen');
    
    window.setTimeout(function() {
      audioScreenManager.execute({ 
        request: 'enterScreen', 
        data: 'audio_start_screen', 
        callback: audioController.enterBlindUiScreen 
      });
    }, 1000);
        
  } else if (tvsMode == true) {
    $('#keypad').show();

    window.clearTimeout(inactivityCounterTimeout);

    // Listen for audio UI gestures.
    var touchContainer = document.getElementById('audio_only_screen');
    var hammer = new Hammer(touchContainer);
    hammer.onhold = blindInterfaceGestureTrigger;

    visualView.displaySection(currentVisualInterfaceScreen, 'audio_only_screen');

    window.setTimeout(function() {
      audioScreenManager.execute({ 
        request: 'enterScreen', 
        data: 'tvs_entry_screen', 
        callback: audioController.enterBlindUiScreen 
      });
    }, 1000);
  } else {    
    window.setTimeout(function() {
      visualView.displaySection('triage_screen', 'language_screen');
    }, 1000);
  }
}

function getBarcode(callbackSuccess) {

  $.ajax({
    type: 'POST',
    timeout: SCAN_TIMEOUT,
    url: "/servlet/getBarcode",
    success: function(response){ 
      callbackSuccess(response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (textStatus === "timeout") {
        window.clearTimeout(barcodeTimeout);
        barcodeTimeout = window.setTimout(function () { getBarcode(callbackSuccess); }, SCAN_TIMEOUT);
      } else if (jqXHR.status == 500) {
        window.clearTimeout(barcodeTimeout);
        barcodeTimeout = window.setTimeout(function () { getBarcode(callbackSuccess); }, 500);
      } else {
//        noWebcam('unknown webcam error occurred: ' + textStatus + ':' + errorThrown + ':' + jqXHR.responseText);
      }
    }
  });
}

// QR scan callback function.
function processQRcode (msg) {

  showWaitingAlert();
  
  // msg comes null if no code were detected
  if (msg === null) { //expect a lot of nulls
    // Do nothing
  } else {
      
    // Kill off the waiting getBarcode request.
    window.clearTimeout(barcodeTimeout);
    barcodeTimeout = null;

    var clips = [ ['alert_scanned_okay'], ['please_wait'] ];
    var instructions = new AudioInstructions(clips, false, true, null);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);

    var qrData = msg.split(";");

    // This might be a receipt.
    if (qrData[0] == "receipt") {

      readPreferenceList(qrData);
      hideWaitingAlert();
      
      return;
      
    } else {

      try {
        var district = qrData[0];
        var serialCode = qrData[2];
        var signature = qrData[4];

        readCandidateList(qrData);

        var msg = {};
        msg.type = "startevm";
        msg.serialNo = serialCode;
        msg.serialSig = signature;
        msg.district = district;
        var startEvmMessage = "msg=" + encodeURIComponent(JSON.stringify(msg));
        var startURL = "http://localhost:8060/servlet/MBBProxy";

// TODO: Remove this!
if (using_fake_data) {

  var startURL = "http://localhost/vVote/response.txt";
        $.ajax({
          type: 'GET',
          timeout: MBB_TIMEOUT,
          url: startURL,
          dataType: "json",
          success: function (response) { 
            // Otherwise, we have a valid session.    
            hideWaitingAlert();
            var startEvmSignature = response["sigs"];
            var votingSession = container.Resolve("votingSession");
            votingSession.setStartEvmSignature(startEvmSignature);
            handleCandidateSlipQrScanResponse(qrData);
          }
        });

   return;   
}

        $.ajax({
          type: 'POST',
          timeout: MBB_TIMEOUT,
          url: startURL,
          data: startEvmMessage,
          dataType: "json",
          success: function (response) { 
              
            var container = getContainer();

            console.log("Got a startEVM response: " + response);

            var error = response["ERROR"];
            if (error != null && error != "") {

              // Got a startEVM response. If already voted, then start readback, else do the following.
              if (error == START_EVM_ERROR) {

                // Check that it's not the current session with the QR code left under the scanner.
                var votingSession = container.Resolve("votingSession");
                var currentSerialCode = votingSession.getSerialCode();
                if (currentSerialCode != null && currentSerialCode == serialCode) {
                    
                  var readbackSession = container.Resolve("readbackSession");
                  var voterHasScannedPreferencesReceipt = readbackSession.getScannedPreferencesReceipt();
                  readbackSession.setScannedCandidateSlip(true);
                  
                  // if it's the same serial code, and the user has scanned the PR, then play readback.
                  if (voterHasScannedPreferencesReceipt) {
                    var readbackSession = container.Resolve("readbackSession");
                    readbackSession.setSerialCode(serialCode);
                    
                    var visualScreenManager = container.Resolve("visualScreenManager");
                    var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
                    if (currentVisualInterfaceScreen != 'scan_error_visual_screen') {
                      var visualView = container.Resolve("visualView");
                      visualView.displaySection(currentVisualInterfaceScreen, 'scan_error_visual_screen');
                    }

                    var screenFactory = container.Resolve("screenFactory");
                    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
                    errorScreen.displayCandidateSlipDetails();
                    
                    hideWaitingAlert();
                    return;
                  }
                } 
                
                // if "startEVM" gives "already started" then do readback.
                if (response["WBB_Responses"] != null) {

                  if (response["WBB_Responses"].length > 0) {
                    var mbb_error_message = response["WBB_Responses"][0]["msg"];
                    if (mbb_error_message == EVM_STARTED_ALREADY) {
                      
                      console.log(EVM_STARTED_ALREADY);
                    
                      var readbackSession = container.Resolve("readbackSession");
                      readbackSession.setSerialCode(serialCode);
                    
                      var visualScreenManager = container.Resolve("visualScreenManager");
                      var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
                      if (currentVisualInterfaceScreen != 'scan_error_visual_screen') {
                        var visualView = container.Resolve("visualView");
                        visualView.displaySection(currentVisualInterfaceScreen, 'scan_error_visual_screen');
                      }

                      var screenFactory = container.Resolve("screenFactory");
                      var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
                      errorScreen.displayCandidateSlipDetails();
                    
                      hideWaitingAlert();
                      return;
                    
                    } else if (mbb_error_message == EVM_STARTED_NO_CONSENSUS) {
                      console.log(EVM_STARTED_NO_CONSENSUS);
                      window.clearTimeout(barcodeTimeout);
                      barcodeTimeout = window.setTimeout(function () { getBarcode(processQRcode); }, SCAN_TIMEOUT);
                      hideWaitingAlert();
                      return;
                                          
                    } else if (mbb_error_message == BALLOT_ALREADY_TIMED_OUT) {
                      hideWaitingAlert();
                      showInvalidQrAlert();
                      return;
                    }
                    
                  // No actual error responses from the MBB, just "couldn't connect to MBB"
                  } else {
                    // try scanning the QR code again.
                    window.clearTimeout(barcodeTimeout);
                    barcodeTimeout = window.setTimeout(function () { getBarcode(processQRcode); }, SCAN_TIMEOUT);
                    hideWaitingAlert();

                    var container = getContainer();    
                    var visualScreenManager = container.Resolve("visualScreenManager");
                    var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
                    $("#" + currentVisualInterfaceScreen).show();

                    showMbbTimeoutAlert();
                    return;
                  }
                }

              } else {
                // try scanning the QR code again.
                window.clearTimeout(barcodeTimeout);
                barcodeTimeout = window.setTimeout(function () { getBarcode(processQRcode); }, SCAN_TIMEOUT);
                hideWaitingAlert();
                return;
              }
            }
            
            // Otherwise, we have a valid session.    
            var startEvmSignature = response["sigs"];
            var votingSession = container.Resolve("votingSession");
            votingSession.setStartEvmSignature(startEvmSignature);
            handleCandidateSlipQrScanResponse(qrData);
            hideWaitingAlert();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            hideWaitingAlert();
            if (textStatus === "timeout") {
              alert('Call to startEVM failed due to timeout.');
              console.log('Call to startEVM failed due to timeout.');
            } else {
              alert('unknown error occurred: ' + textStatus + ':' + errorThrown + ':' + jqXHR.responseText);
              console.log('unknown error occurred: ' + textStatus + ':' + errorThrown + ':' + jqXHR.responseText);
            }
            
            window.clearTimeout(barcodeTimeout);            
            barcodeTimeout = window.setTimeout(function () { getBarcode(processQRcode); }, SCAN_TIMEOUT);
          }
        });
      } catch (error) {
        showInvalidQrAlert();
        return;
      }
    }
  }
}