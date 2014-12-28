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
 *  The boot menu currently allows the user to select what "app" this device will be.
 *  It performs validation checks on the JSON configuration data to ensure that it meets basic content and format requirements. 
 * 
 * @author Peter Scheffer
 */

var languageFileIsValid = false;
var audioFileIsValid = false;
var mediaFileIsValid = false;
var stagingFileIsValid = false;
var candidateFileIsValid = false;

// Get all language data configuration information.
function getLanguageData() {

  try {
      
    var randomSeed = new Date().getTime();
  
    $.getJSON('data/language_config.txt?t=' + randomSeed, function(languageData) {
      
      // Validate the JSON with a schema.
      $.ajax({
        type: 'GET',
        url: 'validation/language_config_schema.txt?t=' + randomSeed,
        data: '',
        dataType: 'json',
        success: function (schemaFile) {
          var valid = tv4.validate(languageData, schemaFile);
          if (valid) {
            languageFileIsValid = true;
            checkIsAllValid();
            console.log("language data successfully validated.");
          } else {
            successful = false;
            displayError("Missing key for: " + tv4.error.dataPath + "<br/>" + tv4.error.message + "<br/>in language configuration file.");
            return false;
          }          
        },        
        error: function (xhr, status, error) {
          alertFailure(xhr, error.message);
          return false;
        }
      });
    })
    .error(function () { 
      displayError('ERROR: JSON Language Data is missing or not valid.'); 
      return false;
    });
  } catch (error) {
    displayError("Error reading language data: " + error);
    return false;
  }

  return true;
}

// Get all media data configuration information.
function getMediaData() {

  try {
      
    var randomSeed = new Date().getTime();

    $.getJSON('data/media_config.txt?t=' + randomSeed, function(mediaData) {
      checkMediaFilePresence(mediaData);

      // Validate the JSON with a schema.
      $.ajax({
        type: 'GET',
        url: 'validation/media_config_schema.txt?t=' + randomSeed,
        data: '',
        dataType: 'json',
        success: function (schemaFile) {
          var valid = tv4.validate(mediaData, schemaFile);
          if (valid) {
            mediaFileIsValid = true;
            checkIsAllValid();
            console.log("media data successfully validated.");
          } else {
            displayError("Missing key for: " + tv4.error.dataPath + "<br/>" + tv4.error.message + "<br/>in media configuration file.");
            return false;
          }          
        },        
        error: function (xhr, status, error) {
          alertFailure(xhr, error.message);
          return false;
        }
      });
    })
    .error(function () { 
      displayError('ERROR: JSON Media Data is missing or not valid.'); 
      return false;
    });
  } catch (error) {
    displayError("Error reading media data: " + error);
    return false;
  }

  return true;
}

// Get all audio clip configuration information.
function getAudioConfiguration() {

  try {
      
    var randomSeed = new Date().getTime();

    // Get the JSON audio configuration file.
    $.getJSON('data/audio_config.txt?t=' + randomSeed, function(audioData) {
      receivedAudioConfig(audioData);

      // Validate the JSON with a schema.
      $.ajax({
        type: 'GET',
        url: 'validation/audio_config_schema.txt?t=' + randomSeed,
        data: '',
        dataType: 'json',
        success: function (schemaFile) {
          var valid = tv4.validate(audioData, schemaFile);
          if (valid) {
            audioFileIsValid = true;
            checkIsAllValid();
            console.log("audio data successfully validated.");
          } else {
            displayError("Missing key for: " + tv4.error.dataPath + "<br/>" + tv4.error.message + "<br/>in audio configuration file.");
            return false;
          }          
        },        
        error: function (xhr, status, error) {
          alertFailure(xhr, error.message);
          return false;
        }
      });
    })
    .error(function () { 
      displayError('ERROR: JSON Audio Configuration is missing or not valid.'); 
      return false;
    });
  } catch (error) {
    displayError("Error reading audio configuration: " + error);
    return false;
  }
  
  return true;
}

// Get all nominations data.
function getNominationsData() {
  
  try {
      
    var randomSeed = new Date().getTime();

    // Get the JSON nominations file.
    $.getJSON('bundle/region_district_candidate_data.txt?t=' + randomSeed, function(nominationsData) {

      // Validate the JSON with a schema.
      $.ajax({
        type: 'GET',
        url: 'validation/ballot_draw_schema.txt?t=' + randomSeed,
        data: '',
        dataType: 'json',
        success: function (schemaFile) {
          var valid = tv4.validate(nominationsData, schemaFile);
          if (valid) {
            candidateFileIsValid = true;
            checkIsAllValid();
            console.log("nominations data successfully validated.");
          } else {
            displayError("Missing key for: " + tv4.error.dataPath + "<br/>" + tv4.error.message + "<br/>in nominations candidate data file.");
            return false;
          }          
        },        
        error: function (xhr, status, error) {
          alertFailure(xhr, error.message);
          return false;
        }
      });
    })
    .error(function (error) { 
      displayError('ERROR: JSON Nominations data file is missing or not valid: ' + error); 
      return false;
    });
  } catch (error) {
    displayError("Error reading nominations data file: " + error);
    return false;
  }
  
  return true;
}

// Get all staging configuration information.
function getStagingConfigData() {

  try {
      
    var randomSeed = new Date().getTime();
  
    $.getJSON('data/stagingconfig.json?t=' + randomSeed, function(stagingData) {
      
      // Validate the JSON with a schema.
      $.ajax({
        type: 'GET',
        url: 'validation/staging_config_schema.txt?t=' + randomSeed,
        data: '',
        contentType: 'application/json',
        dataType: 'json',
        success: function (schemaFile) {
          var valid = tv4.validate(stagingData, schemaFile);
          if (valid) {
            languageFileIsValid = true;
            checkIsAllValid();
            console.log("staging configuration data successfully validated.");
          } else {
            successful = false;
            displayError("Missing key for: " + tv4.error.dataPath + "<br/>" + tv4.error.message + "<br/>in staging configuration file.");
            return false;
          }          
        },        
        error: function (xhr, status, error) {
          alertFailure(xhr, error.message);
          return false;
        }
      });
    })
    .error(function () { 
      displayError('ERROR: JSON Staging Configuration Data is missing or not valid.'); 
      return false;
    });
  } catch (error) {
    displayError("Error reading staging configuration data: " + error);
    return false;
  }

  return true;
}

function receivedAudioConfig(data) {
  var audioArray = data["clips"];
  checkAudioFilePresence(audioArray);
}

// Check that every audio file is present and non-empty.
function checkAudioFilePresence (audioArray) {
  for (key in audioArray) {
    var content = audioArray[key];
    if (typeof content === 'string') {
      checkForFile(content);
    } else if (typeof content === 'object') {
      for (key2 in content) {
        var content2 = content[key2];
        if (typeof content2 === 'string') {
          checkForFile(content2);
        }
      }
    }
  }
}

// Check that every image/video file is present and non-empty.
function checkMediaFilePresence (mediaArray) {
  var imagesArray = mediaArray["images"];
  for (key in imagesArray) {
    var filename = imagesArray[key]["filename"];
    if (typeof filename === 'string') {
      checkForFile(filename);
    }
  }

  var videosArray = mediaArray["videos"];
  for (key in videosArray) {
    var filename = videosArray[key]["filename"];
    if (typeof filename === 'string') {
      checkForFile(filename);
    }
  }
}

// Check header of media files for presence/non-zero length.
function checkForFile (fileUrl) {
  var xhr = $.ajax({
    type: "HEAD",
    async: true,
    url: fileUrl,
    success: function(message, text, response) {
      var fileLength = xhr.getResponseHeader('Content-Length');
      if (fileLength == 0) {
        displayError('Media file is zero length: ' + fileUrl);
        return false;
      }
    },
    error: function (error) {
      displayError('Missing media file: ' + fileUrl);
      return false;
    }
  });
  
  return true;
}

function alertFailure (xhr, error) {
  if (xhr.statusText == "OK") {
    if (xhr.isRejected()) {
      displayError("JSON was rejected: " + error);
    }
  } else {
    displayError(error);
  }
}

function checkBundle () {
  languageFileIsValid = false;
  audioFileIsValid = false;
  mediaFileIsValid = false;
  candidateFileIsValid = false;
  stagingFileIsValid = false;

  getAudioConfiguration();
  getLanguageData();
  getMediaData();
  getStagingConfigData();
  getNominationsData();
}

function checkIsAllValid () {
  if ((languageFileIsValid == true) &&
      (audioFileIsValid == true) &&
      (mediaFileIsValid == true) &&
      (stagingFileIsValid == true) &&
      (candidateFileIsValid == true)) {
    alert("app is ready to go.");
  }  
}

function displayError (errorMessage) {
  showPopup(errorMessage);
}

function hidePopup () {
  $('#error_message_popup').hide();
}

function showPopup (message) {
  $('#error_message_popup').show();
  $('#error_message').html(message);
}

function hidePolling () {
  $('#polling_message_popup').hide();
}

function showPolling (message) {
  $('#polling_message_popup').show();
  $('#polling_message').html(message);
}

function checkTabletType () {
  try {
    $.getJSON('data/stagingconfig.json', function(jsonData) {
      // TODO: set whether the device is "proofing" tablet or not here.
      var tabletType = "proofing";
      var pollTime = "poll time";
      
      if (tabletType != "proofing") {
        showPolling("Waiting for live configuration to become available after [" + pollTime + "].");
      }
    })
    .error(function () { alert('ERROR: Staging Config data is not valid.'); });
  } catch (error) {
    alert("Error staging configuration data: " + error);
  }
}
