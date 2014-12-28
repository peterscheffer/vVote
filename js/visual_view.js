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
 * VisualView is responsible for updating the visual User Interface.
 *
 * @author Peter Scheffer
 */

var VisualView = Class.extend({

  init : function() {
    // for Back button when the previous screen is programmatic, not hard coded.
    this.previousScreen = "";
    this.VIDEO_START_DELAY = 0;
    this.videoNodeName = null;
  },
  
  getDocumentNode : function(nodeName) {
    return document.getElementById(nodeName);
  },
  
  displayMessage : function(message, opacity) {
    var messageBox = this.getDocumentNode('start_message_box');
    messageBox.style.display = 'block';
    messageBox.style.opacity = opacity;
    var messageDIV = this.getDocumentNode('message');
    messageDIV.innerHTML = message;
  },
  
  // Switch language back to English for support assistant to understand app.
  switchLanguage : function() {
    changeLanguage("english");
  },
  
  // Switches back to the chosen language.
  revertLanguage : function() {
    if (previousLanguageSelection == null) {
      return;
    }
    changeLanguage(previousLanguageSelection);
  },
  
  displayGestureVideo : function() {
    var gestureVideoBox = document.getElementById('gesture_video_box');
    gestureVideoBox.style.display = 'block';
    gestureVideoBox.style.opacity = 1.0;
  },
  
  closeGestureVideoBox : function() {
    var gestureVideoBox = document.getElementById('gesture_video_box');
    gestureVideoBox.style.display = 'none';
  },
  
  closeMessageBox : function() {
    var messageBox = document.getElementById('start_message_box');
    messageBox.style.display = 'none';
    messageBox.style.visibility = 'hidden';
  },

  displayQuitConfirmation : function(yes_callback, screen, no_callback) {
    $('#quit_confirmation_modal_background').show();
    $('#quit_confirmation_modal_container').show();
    $('#quit_confirmation_modal_header').show();
    $('#quit_confirmation_modal_footer').show();

    $('#quit_yes_button').click(function() {
      yes_callback(screen);
      $('#quit_yes_button').off('click');
      $('#quit_no_button').off('click');
    });

    $('#quit_no_button').click(function() {    
      if (no_callback != null) {
        no_callback();
      }
      
      var container = getContainer();
      var visualView = container.Resolve('visualView');
      visualView.closeQuitConfirmation();
      $('#quit_yes_button').off('click');
      $('#quit_no_button').off('click');
    });
  },
  
  closeQuitConfirmation : function() {
    $('#quit_confirmation_modal_background').hide();
    $('#quit_confirmation_modal_container').hide();
    $('#quit_confirmation_modal_header').hide();
    $('#quit_confirmation_modal_footer').hide();
  },
  
  displaySubmitConfirmation : function(screen) {
    $('#submit_confirmation_modal_container').show();
    $('#submit_confirmation_modal_background').show();
    $('#submit_confirmation_header').show();
    $('#submit_confirmation_footer').show();
  },
    
  closeSubmitConfirmation : function() {
    $('#submit_confirmation_modal_container').hide();
    $('#submit_confirmation_modal_background').hide();
    $('#submit_confirmation_header').hide();
    $('#submit_confirmation_footer').hide();
  },
  
  runVideo : function (videoNodeName) {
    var container = getContainer();
    var visualView = container.Resolve("visualView");
    var video = visualView.getDocumentNode(videoNodeName);
    if (video != null) {
      video.play();
    }    
  },
  
  playVideo : function(videoNodeName, videoUrl) {
  
    var container = getContainer();
    var visualView = container.Resolve("visualView");
    visualView.setCurrentVideo(videoNodeName);
    var video = visualView.getDocumentNode(videoNodeName);
    if (video != null) {
      video.src = videoUrl;
    }
    
    window.setTimeout(function () {
      var container = getContainer();
      var visualView = container.Resolve("visualView");
      visualView.runVideo(videoNodeName);
    }, this.VIDEO_START_DELAY);
  },
  
  setCurrentVideo : function (videoNodeName) {
    this.videoNodeName = videoNodeName;
  },
  
  getCurrentVideo : function () {
    return this.videoNodeName;
  },

  playVideoWithCallback : function(videoNodeName, videoUrl, callback) {
    var video = this.getDocumentNode(videoNodeName);
    if (video != null) {
      if (video.currentTime > 0) {
        video.pause();
      }
      video.src = videoUrl;
      video.load();
      video.currentTime = 0;
      video.play();
      video.addEventListener('ended', callback, false);    
    }
  },
  
  stopVideo : function(videoNodeName) {
    var video = this.getDocumentNode(videoNodeName);
    if (video != null) {
      if (video.currentTime > 0) {
        video.currentTime = 0;
        video.pause();
      }
      video.src = " ";
      video = null;
      delete video;
    }
  },
  
  clearBallot : function (ballot) {
    var candidates = ballot.getCandidates();
    for (var key in candidates) {
      var candidate = candidates[key];
      if (candidate.getBallotBoxId) {
        var ballotOptionBox = this.getDocumentNode(candidate.getBallotBoxId());
        if (ballotOptionBox == null) {
          continue;
        }
        
        ballotOptionBox.innerHTML = "";
      }
    }
    
    var container = getContainer();
    if (ballot.ballotType == LEGISLATIVE_ASSEMBLY_BALLOT) {
      var assemblyBallotView = container.Resolve('assemblyBallotView');
      assemblyBallotView.reset();
    } else {
      var combinedCouncilView = container.Resolve("combined"); 
      combinedCouncilView.reset();     
    }
  },
  
  setBallotSelectionNumber : function(candidate, selectionNumber) {

    if (candidate == null) {
      return;
    }

    var ballot_option_box;
    try {  
      ballot_option_box = this.getDocumentNode(candidate.getBallotBoxId());
    } catch (error) {
      console.log(error);
    }
    
    if (ballot_option_box == null) {
      return;
    }

    if (selectionNumber == null) {
      if (ballot_option_box != null) {
        ballot_option_box.innerHTML = "";
      }
    } else {
      if (ballot_option_box != null) {
        ballot_option_box.innerHTML = selectionNumber;
      }
    }
  },

  setShuffleBallotSelectionNumber : function(candidate, selectionNumber) {
    var ballot_option_box = this.getDocumentNode(candidate.getBallotBoxId() + "_shuffle");
    if(selectionNumber == null) {
      ballot_option_box.innerHTML = "";
    } else {
      ballot_option_box.innerHTML = selectionNumber;
    }
  },

  // Responsible for hiding/displaying page sections as if they were pages or screens.
  displaySection: function(hideSectionName, displaySectionName) {

    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    var audioScreenManager = container.Resolve("audioScreenManager");

    // For occasions where multiple previous screens exist, use stored "previous screen" variable.
    if (displaySectionName == 'previous_screen') {
      displaySectionName = this.previousScreen;
    }

    // Instantiate the screen we are exiting and the one we are entering.
    var screenFactory = container.Resolve("screenFactory");

    // Tear down the screen we are exiting.
    var screenObject = screenFactory.getInstance(hideSectionName);
    if (screenObject != null) {
      screenObject.exit();
    }

    // Hide the screen that we are leaving.
    var sectionToHide = this.getDocumentNode(hideSectionName);

    sectionToHide.style.visibility = 'hidden';
    sectionToHide.style.display = 'none';

    // Display the screen that we are entering.
    var sectionToDisplay = this.getDocumentNode(displaySectionName);

    sectionToDisplay.style.visibility = 'visible';
    sectionToDisplay.style.display = 'block';

    // Set up the screen we are entering.
    var screen = screenFactory.getInstance(displaySectionName);
    if (screen != null) {
      screen.enter();
    }

    // Keep track of the screen that we just left for some back buttons to return to.
    this.previousScreen = hideSectionName;
  },
  
  // Display popup LOTE version of candidate/party details, including the i18n translation of audio and textual name.
  showTranslationPopup: function (event, audio, popupId, screenName) {
  
    event.stopPropagation();
  
    if (this.currentTranslationPopup != null) {
      var oldPopup = $("#" + this.currentTranslationPopup);
      oldPopup.hide();
    }
  
    this.currentTranslationPopup = popupId;

    var pTop = 0;
    var pLeft = 0;

    var x = 0;
    var y = 0;
    
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    
    // If this is the council BTL ballot.
    if (screenName == 'legislative_council_candidate_screen') {
      pTop = $('#ballot_combined_content').scrollTop();
      pLeft = $('#ballot_combined_content').scrollLeft();

      // where did the user touch on the screen?
      // top left
      if (event.clientX < (screenWidth / 2) && event.clientY < (screenHeight / 2)) {
        x = event.clientX - 200;
        y = event.clientY + 50;

        $(".bubble").removeClass("topRightPointer");
        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("bottomLeftPointer");
        $(".bubble").addClass("topLeftPointer");
        
      // bottom left
      } else if (event.clientX < (screenWidth / 2) && event.clientY > (screenHeight / 2)) {
        x = event.clientX - 200;
        y = event.clientY - 450;
        
        $(".bubble").removeClass("topRightPointer");
        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("topLeftPointer");
        $(".bubble").addClass("bottomLeftPointer");
        
      // top right
      } else if (event.clientX > (screenWidth / 2) && event.clientY < (screenHeight / 2)) {
        x = event.clientX - 800;
        y = event.clientY + 50;

        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("topLeftPointer");
        $(".bubble").removeClass("bottomLeftPointer");
        $(".bubble").addClass("topRightPointer");
        
      // bottom right
      } else if (event.clientX > (screenWidth / 2) && event.clientY > (screenHeight / 2)) {
        x = event.clientX - 800;
        y = event.clientY - 450;

        $(".bubble").removeClass("topRightPointer");
        $(".bubble").removeClass("topLeftPointer");
        $(".bubble").removeClass("bottomLeftPointer");
        $(".bubble").addClass("bottomRightPointer");
      }

      screenName = 'legislative_council_combined_screen';

      // temporary hack: no LOTE popups for when English is chosen.
      var language = getCurrentLanguageSelection();
      if (language != "english") {
        var popup = $("#" + popupId);
        popup.css({ position: "fixed", top: y, left: x });
        popup.show();  
      }    
    
    // Else if this is the council ATL ballot.
    } else if (screenName == 'legislative_council_group_screen') {
      pTop = $('#ballot_combined_content').scrollTop();
      pLeft = $('#ballot_combined_content').scrollLeft();

      // where did the user touch on the screen?
      // top left
      if (event.clientX < (screenWidth / 2)) {
        x = event.clientX - 200;
        y = event.clientY + 25;

        $(".bubble").removeClass("topRightPointer");
        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("bottomLeftPointer");
        $(".bubble").addClass("topLeftPointer");      
      // top right
      } else {
        x = event.clientX - 800;
        y = event.clientY + 25;

        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("topLeftPointer");
        $(".bubble").removeClass("bottomLeftPointer");
        $(".bubble").addClass("topRightPointer");
      }

      screenName = 'legislative_council_combined_screen';

      // temporary hack: no LOTE popups for when English is chosen.
      var language = getCurrentLanguageSelection();
      if (language != "english") {
        var popup = $("#" + popupId);
        popup.css({ position: "fixed", top: y, left: x });
        popup.show();  
      }    
    
    // Else if this is the assembly ballot.
    } else if (screenName == 'legislative_assembly_candidate_vote_screen') {

      // where did the user touch on the screen?
      // top
      if (event.clientY < (screenHeight / 2)) {
        x = event.clientX - 200;
        y = event.clientY + 50;
      
        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("topRightPointer");
        $(".bubble").removeClass("bottomLeftPointer");
        $(".bubble").addClass("topLeftPointer");

      // bottom
      } else {
        x = event.clientX - 200;
        y = event.clientY - 300;

        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("topLeftPointer");
        $(".bubble").removeClass("topRightPointer");
        $(".bubble").addClass("bottomLeftPointer");
      }

      // temporary hack: no LOTE popups for when English is chosen.
      var language = getCurrentLanguageSelection();
      if (language != "english") {
        var popup = $("#" + popupId);
        popup.css({ position: "absolute", top: y, left: x });
        popup.show();  
      }    
      
    // Else if this is the assembly summary screen.
    } else if (screenName == 'assembly_summary_screen' || screenName == 'council_summary_screen') {
    
      x = event.clientX - 200;
      y = event.clientY - 160;

      // where did the user touch on the screen?
      // top left
      if (event.clientX < (screenWidth / 2) && event.clientY < (screenHeight / 2)) {
        x = pLeft + event.clientX - 230;
        y = pTop + event.clientY + 20;

        $(".bubble").removeClass("topRightPointer");
        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("bottomLeftPointer");
        $(".bubble").addClass("topLeftPointer");
        
      // bottom left
      } else if (event.clientX < (screenWidth / 2) && event.clientY > (screenHeight / 2)) {
        x = pLeft + event.clientX - 230;
        y = pTop + event.clientY - 300;
        
        $(".bubble").removeClass("topRightPointer");
        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("topLeftPointer");
        $(".bubble").addClass("bottomLeftPointer");
        
      // top right
      } else if (event.clientX > (screenWidth / 2) && event.clientY < (screenHeight / 2)) {
        x = pLeft + event.clientX - 800;
        y = pTop + event.clientY + 20;

        $(".bubble").removeClass("bottomRightPointer");
        $(".bubble").removeClass("topLeftPointer");
        $(".bubble").removeClass("bottomLeftPointer");
        $(".bubble").addClass("topRightPointer");
        
      // bottom right
      } else if (event.clientX > (screenWidth / 2) && event.clientY > (screenHeight / 2)) {
        x = pLeft + event.clientX - 800;
        y = pTop + event.clientY - 300;

        $(".bubble").removeClass("topRightPointer");
        $(".bubble").removeClass("topLeftPointer");
        $(".bubble").removeClass("bottomLeftPointer");
        $(".bubble").addClass("bottomRightPointer");
      }

      screenName = 'confirm_selections_screen';

      // temporary hack: no LOTE popups for when English is chosen.
      var language = getCurrentLanguageSelection();
      if (language != "english") {
        var popup = $("#" + popupId);
        popup.css({ position: "absolute", top: y, left: x });
        popup.show();  
      }    
    }

    var container = getContainer();
    var audioController = container.Resolve('audioController');
    var callback1 = function () {
      var container = getContainer();
      var visualView = container.Resolve('visualView')
      visualView.hideTranslationPopup();
    };
    
    var instructions = new AudioInstructions(audio, false, true, callback1);
    audioController.playAudioInstructions(instructions);
    
    $('#' + screenName).bind('touchstart', function () {
      (getContainer().Resolve('visualView')).hideTranslationPopup();
    });
    
    return false;
  },
  
  hideTranslationPopup: function () {
    if (this.currentTranslationPopup != null) {
      var container = getContainer()
      var audioController = container.Resolve('audioController');
      audioController.stopAudio();
      $("#" + this.currentTranslationPopup).hide();
      this.currentTranslationPopup = null;
    }
  }
});