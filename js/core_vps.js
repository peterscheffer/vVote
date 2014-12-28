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
 * Core functionality to drive the VPS application.
 * 
 * @author Peter Scheffer
 */

var isAndroid = false;

if (navigator.userAgent.indexOf("Android") > 0) {
  isAndroid = true;
}

// Should we be logging user actions?
var useLogging = false;

// The configuration data specific to languages.
var languagesConfig = new Array();

// The range of available languages.
var languageOptions = new Array();

// Default language.
var languageSelection = "english";

// Language before switch.
var previousLanguageSelection = null;

// The list of language dictionaries, according to language.
var dictionaryOptions = new Array();

// The list of onscreen elements that need conversion.
var textForConversionArray = new Array();

var alertDelayedTimeout;

var DELAYED_TIMEOUT_PERIOD = 5000;

var barcodeTimeout = null;

// Get the current language selection.
function getCurrentLanguageSelection () {
  return languageSelection;
}

function setCurrentLanguageSelection (language) {
  languageSelection = language;
}

/**
 * Load audio configuration data into the application.
 */
// Get all audio clip configuration information.
function getAudioConfiguration() {
  try {
    $.getJSON('data/audio_config.txt', function(data) {
      $(document).trigger("receivedAudioConfig", data);
    })
    .error(function () { alert('ERROR: JSON Audio Configuration is not valid.'); });
  } catch (error) {
    alert("Error reading audio configuration: " + error);
  }
}

// Once we have the data and the document is ready, load the audio array.
function receivedAudioConfig(event, data) {
  audioArray = data["clips"];
}

/**
 * Load language data into the application.
 */
// Get all language data.
function getLanguageData() {
  try {
    $.getJSON('data/language_config.txt', function(data) {
      $(document).trigger("receivedLanguageConfig", data);
    })
    .error(function () { alert('ERROR: JSON Language Data is not valid.'); });
  } catch (error) {
    alert("Error reading language data: " + error);
  }
}

// Once we have the data and the document is ready, load the language dictionaries.
function receivedLanguageConfig(event, data) {

  languagesConfig = data["languages"];
  var index = 1;
  for (key in languagesConfig) {
    var language = languagesConfig[key]["language"];
    languageOptions[index++] = language;
    
    var language_dictionary = languagesConfig[key]["dictionary"];
    for (key2 in data["dictionaries"]) {
      var dictionary = data["dictionaries"][key]["dictionary"];
      if (dictionary == language_dictionary) {
        dictionaryOptions[language] = data["dictionaries"][key]["translations"];
      }
    }
    
    if (language != null && dictionaryOptions[language] == null) {
      alert("Dictionary missing in configuration file for " + language);
      return;
    }
  }
  
  var textLabelsForConversion = data["conversion_labels"];
  for (key in textLabelsForConversion) {
    textForConversionArray.push(key);
  }
  
  for (var index = 1; index <= languageOptions.length; index++) {
    var language = languageOptions[index];
    $("#language").append("<option value='" + index + "'>" + language + "</option>");
  }  
}

$(document).ready(function() {

  // Configure event listeners.  We need to trigger an event to load the candidate
  // data at a time that coincides with the document and JSON data being loaded.
  $(document).bind("receivedAudioConfig", receivedAudioConfig);
  $(document).bind("receivedLanguageConfig", receivedLanguageConfig);

  // Get the configuration data.
  getAudioConfiguration();
  getLanguageData();
});

function getBarcodeForQuarantine() {

  $.ajax({
    type: 'POST',
    timeout: SCAN_TIMEOUT,
    url: "/servlet/getBarcode",
    success: function(response){ 
      handleQuarantineQRscan(response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (textStatus === "timeout") {
        getBarcodeForQuarantine();
      } else if (jqXHR.status == 500) {
        window.setTimeout(function () { getBarcodeForQuarantine(); }, 10500);
      } else {
//        noWebcam('unknown webcam error occurred: ' + textStatus + ':' + errorThrown + ':' + jqXHR.responseText);
      }
    }
  });
}

function handleQuarantineQRscan (qrData) {

  // qrCode comes null if no code were detected
  if (qrCode === null) { //expect a lot of nulls
    // Do nothing
  } else {
    var qrData = qrCode.split(";");
    if (qrData.length != 11) {
      showInvalidQrAlert();
      return;
    }
    
    var district = qrData[0];
    var signature = qrData[4];

    var clips = [ ['alert_scanned_okay'] ];
    var instructions = new AudioInstructions(clips, false, true, null);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);

// TODO: perform quarantine here.
    
  }
}

function getBarcodeForAudit () {

  $.ajax({
    type: 'POST',
    timeout: SCAN_TIMEOUT,
    url: "/servlet/getBarcode",
    success: function(response){ 
      handleAuditQRscan(response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (textStatus === "timeout") {
        getBarcodeForAudit();
      } else if (jqXHR.status == 500) {
        window.setTimeout(function () { getBarcodeForQuarantine(); }, 10500);
      } else {
//        noWebcam('unknown webcam error occurred: ' + textStatus + ':' + errorThrown + ':' + jqXHR.responseText);
      }
    }
  });
}

function handleAuditQRscan (qrCode) {
  // qrCode comes null if no code were detected
  if (qrCode === null) { //expect a lot of nulls
    // Do nothing
  } else {
    var qrData = qrCode.split(";");
    if (qrData.length != 11) {
      showInvalidQrAlert();
      return;
    }
    
    var district = qrData[0];
    var serialCode = qrData[2];
    var signature = qrData[4];
    
    var clips = [ ['alert_scanned_okay'] ];
    var instructions = new AudioInstructions(clips, false, true, null);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);

    var msg = {};
    msg.type = "audit";
    msg.serialNo = serialCode;
    msg.serialSig = signature;
    msg.district = district;
    var auditSlipMessage = "msg=" + encodeURIComponent(JSON.stringify(msg));
    var auditURL = "http://localhost:8060/servlet/MBBPODProxy";
    
    showAuditWait();

    $.ajax({
      type: 'POST',
      timeout: MBB_TIMEOUT,
      url: auditURL,
      data: auditSlipMessage,
      dataType: "json",
      success: function (response) {

// TODO: check the response for "this slip has already been scanned" etc.

        // check response 
        if (response == null) {
          showAuditWarning();
        } else {
          showAuditSuccess();
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        showAuditFailure();
      }
    });
  }
}

// Show the error warning.
function showInvalidQrAlert () {
  $('#details_pane').hide();
  $('#invalid_qr_alert').show();
}

// Hide the error warning.
function hideInvalidQrAlert () {
  $('#details_pane').show();
  $('#invalid_qr_alert').hide();
}

function alertFailure (x, t, m) {
  if (t === "timeout") {
    alertFailureToConnect();
  } else {
    alert(t);
  }
}

function showVpsMbbTimeoutAlert () {

  window.clearTimeout(alertDelayedTimeout);

  $('#vps_content').hide();
  $('#mbb_timeout_modal_container').show();
}

// Hide the timeout warning.
function hideVpsMbbTimeoutAlert () {

  window.clearTimeout(alertDelayedTimeout);

  $('#mbb_timeout_modal_message').html("This is taking longer than expected. Please wait.");
  $('#mbb_timeout_modal_back_button').html("Cancel");

  $('#vps_content').show();
  $('#mbb_timeout_modal_container').hide();
}