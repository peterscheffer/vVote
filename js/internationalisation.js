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
 * This file represents a mapping of translated text passages so that the application can switch from one language
 * into another relatively easily.  The tag used to identify a passage maps onto a HTML element ID in the web page.
 * In several passages there are variable place holders whose positioning is integral to correct presentation of the text.
 * Note that some languages read from right to left and need to have relevent transformations applied.
 * 
 * @author Peter Scheffer
 */

// Change the language to selection - an index for dictionaryOptions representing the desired language choice.
function changeLanguage (selection) {

  if (selection != "english") {
    previousLanguageSelection = selection;
  }
  
  languageSelection = selection;
  $.i18n.setDictionary(dictionaryOptions[selection]);
    
  for (var index = 0; index < textForConversionArray.length; index++) {
    try {
      var element = document.getElementById(textForConversionArray[index]);
      element.innerHTML = $.i18n._(textForConversionArray[index]);
    } catch (error) {
        
      var missingFieldAlert = "Missing page element for translation for " + textForConversionArray[index] + ": " + error;

      // Alert the missing language tag ID per Craig request.
      alert(missingFieldAlert)
        
      console.log(missingFieldAlert);
      continue;
    }
  }

  var container = getContainer();
  var votingSession = container.Resolve("votingSession"); 
  var currentFontSize = votingSession.getFontSize();
  var languageConfig = getLanguageConfig(selection);
  
  if (languageConfig != null) {
    if (currentFontSize == LARGE) {
      var language_font_stylesheet = languageConfig["stylesheet_large"];
      try {
        
        // Test that the .css file exists.
        $.ajax({
          url: language_font_stylesheet,
          type:'HEAD',
          error: function () {
            setDefaultFontCss("css/styles_large.css");
          },
          success: function () {
            setFontCss(language_font_stylesheet);
          }
        });
    
      } catch (error) { 
        setDefaultFontCss("css/styles_large.css");
      }
    } else {
      var language_font_stylesheet = languageConfig["stylesheet_medium"];
      try {
        
        // Test that the .css file exists.
        $.ajax({
          url: language_font_stylesheet,
          type:'HEAD',
          error: function () {
            setDefaultFontCss("css/styles_medium.css");
          },
          success: function () {
            setFontCss(language_font_stylesheet);
          }
        });
    
      } catch (error) {
        setDefaultFontCss("css/styles_medium.css");
      }
    } 
  }

  var languageDirection = getLanguageDirection();
  if (languageDirection == "rtl") {
    $(".internationalisation").attr("DIR", "RTL");
    $(".internationalisation").css("text-align",'right');
  } else {
    $(".internationalisation").attr("DIR", "LTR");
    $(".internationalisation").css("text-align",'left');
  }
}

function selectLanguage (element) {

  $("#language_listing li").map(function() {
    $("#" + this.id).removeClass('language_selected');
  });

  $('#' + element + '1').addClass('language_selected');
  $('#' + element + '2').addClass('language_selected');
}

function getLanguageConfig (languageSelection) {
  for (key in languagesConfig) {
    var language = languagesConfig[key]["language"];
    if (language == languageSelection) {
      return languagesConfig[key];
    }
  }
}

function getLanguageDirection () {
  var languageSelection = getCurrentLanguageSelection();
  var languageConfig = getLanguageConfig(languageSelection);
  var languageDirection = languageConfig["direction"];
  return languageDirection;
}

function setDefaultFontCss (fontCssUrl) {
  $("#font_size_styles").attr('href', fontCssUrl);
  window.setTimeout(function() {
    $(document).trigger("stylesChanged");
  }, 100);
}

function setFontCss (fontCssUrl) {
  $("#font_size_styles").attr('href', fontCssUrl);
  window.setTimeout(function() {
    $(document).trigger("stylesChanged");
  }, 100);
}

// Returns only English text based upon the label provided.
function getText (label) {
  return dictionaryOptions["english"][label];
}

// Dynamically inserted text strings need to be converted here when user switches language.
function checkForLanguageChange (event) {
  if (event.type == 'hold') {    
    var container = getContainer();
    var visualView = container.Resolve('visualView');
    
    if (languageSelection == "english") {
      visualView.revertLanguage();
    } else {
      visualView.switchLanguage();
    }
    
    var visualScreenManager = container.Resolve('visualScreenManager');
    var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    
    // If L.A, convert L.A messages.
    if (currentVisualInterfaceScreen == 'legislative_assembly_candidate_vote_screen') {
      var assemblyBallotView = container.Resolve('assemblyBallotView');
      assemblyBallotView.setHelpMessage();
      assemblyBallotView.setInformalWarning();
      
    // else convert L.C messages.
    } else if (currentVisualInterfaceScreen == 'legislative_council_combined_screen') {
      var combinedBallotView = container.Resolve('combined');
      combinedBallotView.setHelpMessage();
      combinedBallotView.setInformalWarning();
      combinedBallotView.setConfirmationMessage();
      
    // else convert confirm screen messages.
    } else if (currentVisualInterfaceScreen == 'confirm_selections_screen') {
      var confirmSelectionsView = container.Resolve("confirmSelectionsView");
      confirmSelectionsView.setHelpMessage();

    // else convert review ballots screen messages.
    } else if (currentVisualInterfaceScreen == 'review_ballots_screen') {
      var reviewBallotsView = container.Resolve("review");
      reviewBallotsView.setHelpMessage();
    }
  }
}
