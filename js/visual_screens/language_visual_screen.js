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
 * LanguageVisualScreen - The visual screen class for the language selection screen for the visual interface.
 * 
 * @author Peter Scheffer
 */
 
var LanguageVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    this._super(visualScreenManager, 'language_screen', 
      this.initialiseLanguageScreen, 
      this.exitLanguageScreen,
      this.switchToLanguageScreen);

    this.upArrowHeld;
    this.downArrowHeld;
    this.downArrowOff = true;
    this.upArrowOff = true;
  },

  initialiseLanguageScreen: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    votingSession.setInactivityResetTimer(0);
    votingSession.setIsVisualMode(true);
    votingSession.setInactivityCounterTimer(window.setTimeout(function () { checkForTimeout(); }, 2000));
    
    $('#language_listing').bind('scroll resize',  function() {   
      var container = getContainer();
      var screenFactory = container.Resolve('screenFactory');
      var languageScreen = screenFactory.getInstance("language_screen");
      languageScreen.checkBtnVis();
    });

    $('#languages_button_scroll_up').bind("touchstart", function() {
      var container = getContainer();
      var screenFactory = container.Resolve('screenFactory');
      var languageScreen = screenFactory.getInstance("language_screen");
      if (languageScreen.upArrowOff) {
        languageScreen.upArrowOff = false;
        languageScreen.holdUpArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var screenFactory = container.Resolve('screenFactory');
      var languageScreen = screenFactory.getInstance("language_screen");
      languageScreen.upArrowOff = true;
      window.clearTimeout(languageScreen.upArrowHeld);
    });

    $('#languages_button_scroll_down').bind("touchstart", function() {
      var container = getContainer();
      var screenFactory = container.Resolve('screenFactory');
      var languageScreen = screenFactory.getInstance("language_screen");
      if (languageScreen.downArrowOff) {
        languageScreen.downArrowOff = false;
        languageScreen.holdDownArrow();
      }
    }).bind('touchend', function() {
      var container = getContainer();
      var screenFactory = container.Resolve('screenFactory');
      var languageScreen = screenFactory.getInstance("language_screen");
      languageScreen.downArrowOff = true;
      window.clearTimeout(languageScreen.downArrowHeld);
    });

    $('#language_listing').html("");
    var index = 1;  	
    for (var key in languagesConfig) {
      var languageName = languagesConfig[key]["name"];
      if (languageName == null) {
        continue;
      }

      var languageNameInEnglish = languagesConfig[key]["language"];
      if (languageName == null) {
        continue;
      }

      languageNameInEnglish = languageNameInEnglish.charAt(0).toUpperCase() + languageNameInEnglish.slice(1);

      var languageDictionaryName = languagesConfig[key]["dictionary"];
      if (languageDictionaryName == null) {
        continue;
      }

      var addLanguage = '<li id="' + languageDictionaryName + '1" onclick="changeLanguage(languageOptions[' + index + ']); selectLanguage(\'' + languageDictionaryName + '\');">' + languageNameInEnglish + '</li>' + 
                        '<li id="' + languageDictionaryName + '2" onclick="changeLanguage(languageOptions[' + index + ']); selectLanguage(\'' + languageDictionaryName + '\');">' + languageName + '</li>';
      $('#language_listing').append(addLanguage);
      
      index++;
    }

    var languageSelection = getCurrentLanguageSelection();

    for (var key in languagesConfig) {
      var languageNameInEnglish = languagesConfig[key]["language"];
      var languageDictionaryName = languagesConfig[key]["dictionary"];
      if (languageNameInEnglish.toLowerCase() == languageSelection.toLowerCase()) {
        $('#' + languageDictionaryName + '1').addClass('language_selected');
        $('#' + languageDictionaryName + '2').addClass('language_selected');
        var languagePosition = $('#' + languageDictionaryName + '1')[0].offsetTop;
        $('#language_listing').animate({scrollTop: languagePosition}, 0);
      }
    }  
    
    var container = getContainer();
    var screenFactory = container.Resolve('screenFactory');
    var languageScreen = screenFactory.getInstance("language_screen");
    languageScreen.checkBtnVis();    
  },
  
  checkBtnVis: function() {
  
    var innerHeight = $('#language_listing')[0].scrollHeight;
    var outerHeight = $('#language_listing').height();

    if (innerHeight > outerHeight) {

      var maxTopPos = innerHeight - outerHeight;

      var topPos = $('#language_listing').scrollTop();

      if (topPos > 0) {
        $('#languages_button_scroll_up').css('visibility', 'visible');
      } else {
        $('#languages_button_scroll_up').css('visibility', 'hidden');
      } 
      
      var divHeight = innerHeight - outerHeight;

      if (topPos < maxTopPos) {
        $('#languages_button_scroll_down').css('visibility', 'visible');
      } else {
        $('#languages_button_scroll_down').css('visibility', 'hidden');
      }

    } else {
       $('#languages_button_scroll_up').css('visibility', 'hidden');
       $('#languages_button_scroll_down').css('visibility', 'hidden');
    }    
  },
  
  exitLanguageScreen: function () {
    $('#languages_button_scroll_up').off('click');
    $('#languages_button_scroll_down').off('click');
  },

  // Switch from Audio UI to Visual UI.  
  switchToLanguageScreen: function () {

  },
  
  // Smoothly scroll ballot when hold down arrow button.
  holdDownArrow: function () {

    var container = getContainer();
    var screenFactory = container.Resolve('screenFactory');
    var languageScreen = screenFactory.getInstance("language_screen");

    window.clearTimeout(languageScreen.upArrowHeld);
  
    if (languageScreen.downArrowOff) {
      return;
    }

    var innerHeight = $('#language_listing')[0].scrollHeight;
    var outerHeight = $('#language_listing').height();

    if (innerHeight > outerHeight) {
      var maxTopPos = innerHeight - outerHeight;
      var topPos = $('#language_listing').scrollTop();

      if (topPos >= maxTopPos) {
        window.clearTimeout(languageScreen.downArrowHeld);
        return;
      }
    }

    var topVal = $('#language_listing').scrollTop();
    $('#language_listing').animate({scrollTop: topVal + 40}, 10, "linear");
    languageScreen.downArrowHeld = window.setTimeout(function () { languageScreen.holdDownArrow(); }, 100);
  },

  // Smoothly scroll ballot when hold down arrow button.
  holdUpArrow: function () {

    var container = getContainer();
    var screenFactory = container.Resolve('screenFactory');
    var languageScreen = screenFactory.getInstance("language_screen");

    window.clearTimeout(languageScreen.downArrowHeld);

    if (languageScreen.upArrowOff) {
      return;
    }
  
    var topPos = $('#language_listing').scrollTop();
    if (topPos = 0) {
      window.clearTimeout(languageScreen.upArrowHeld);
      return;
    }

    var topVal = $('#language_listing').scrollTop();
    $('#language_listing').animate({scrollTop: topVal - 40}, 10, "linear");
    languageScreen.upArrowHeld = window.setTimeout(function () { languageScreen.holdUpArrow(); }, 100);
  }
});