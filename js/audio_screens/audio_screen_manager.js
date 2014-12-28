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
 *  AudioScreenManager is responsible for maintaining state of each of the 
 *  Screens in the Audio interface. It is driven via the Command pattern - 
 *  requests are sent to the AudioScreenManager via the execute() function, 
 *  and a callback is called immediately after the command is executed, with 
 *  the response from the command sent to the callback function, along with any 
 *  errors that occur.
 * 
 * @author Peter Scheffer
 */

var AudioScreenManager = Class.extend({

  // Initialiser is called by the Constructor
  init: function (usingGesture) {

    this.currentBlindInterfaceScreen = 'audio_start_screen';
    
    this.userVotedAboveOrBelowTheLine = null;
    this.expectedPracticeGesture = 'practice_swipe_up';
    this.failedGestureCount = 0;
    this.userFailedGestures = false;
    this.MAXIMUM_FAILED_GESTURES = 5;
    
    this.optionNumber = 1;
    
    this.expectedGestures = new Array();
    this.expectedGestures['practice_swipe_up'] = 'practice_swipe_down';
    this.expectedGestures['practice_swipe_down'] = 'practice_swipe_left';
    this.expectedGestures['practice_swipe_left'] = 'practice_swipe_right';
    this.expectedGestures['practice_swipe_right'] = 'practice_single_finger_double_tap';
    this.expectedGestures['practice_single_finger_double_tap'] = 'practice_single_finger_press_hold';
    this.expectedGestures['practice_single_finger_press_hold'] = 'practice_double_finger_press_hold';
    this.expectedGestures['practice_double_finger_press_hold'] = 'practice_three_finger_press_hold';
    this.expectedGestures['practice_three_finger_press_hold'] = 'free_practice';    
  },
  
  // Reset the navigation model.
  reset: function () {
    this.init(this.usingGesture);
    this.currentBlindInterfaceScreen = 'audio_start_screen';
    this.majorBlindInterfaceScreen = 'audio_start_screen';
    this.clearGestureFailure();
  },
  
  getCurrentPracticeGesture: function () {
    return this.expectedPracticeGesture;
  },
  
  getNextPracticeGesture: function (current_gesture) {
    return this.expectedGestures[current_gesture];
  },

  // Flag whether the user visited above or below the line in council ballot.  
  setUserVotedAboveOrBelowTheLine: function (userVotedAboveOrBelowTheLine) {
    this.userVotedAboveOrBelowTheLine = userVotedAboveOrBelowTheLine;
  },
  
  // Flag whether the user visited above or below the line in council ballot.  
  getUserVotedAboveOrBelowTheLine: function () {
    return this.userVotedAboveOrBelowTheLine;
  },

  // Switch from the audio UI to the visual UI.  
  switchToVisualInterface: function (currentScreen) {
    this.allowScreenDragging();
    return this.majorBlindInterfaceScreen;
  },

  // Set the current screen that the user is hearing.  
  setCurrentBlindInterfaceScreen: function (currentBlindInterfaceScreen) {
    this.currentBlindInterfaceScreen = currentBlindInterfaceScreen;
  },
  
  // Get the current screen that the user is hearing.  
  getCurrentBlindInterfaceScreen: function () {
    return this.currentBlindInterfaceScreen;
  },
  
  // Get the previous screen that the user is hearing.  
  getPreviousBlindInterfaceScreen: function () {
    return this.previousBlindInterfaceScreen;
  },
  
  // Get the screen that represents the last major action in the navigation model.  
  getMajorBlindInterfaceScreen: function () {
    return this.majorBlindInterfaceScreen;
  },
  
  // Set the screen that represents the last major action in the navigation model.  
  setMajorBlindInterfaceScreen: function (screen) {
    this.majorBlindInterfaceScreen = screen;
  },
  
  freePractice: function (gesture) {
    return gesture;
  },
  
  practice: function (gesture) {
  
    if (this.userFailedGestures == true && gesture == 'practice_single_finger_press_hold') {
      // user is switching to the TVS.
      return 'go to tvs';
      
    } else if (gesture == this.expectedPracticeGesture) {
      this.expectedPracticeGesture = this.expectedGestures[gesture];
      this.failedGestureCount = 0;
      return gesture;    
    }
    
    if (++this.failedGestureCount == this.MAXIMUM_FAILED_GESTURES) {
      this.userFailedGestures = true;
      return 'failed gestures';
    }    
    
    return 'error';
  },
  
  clearGestureFailure: function () {
    this.userFailedGestures = false;
    this.failedGestureCount = 0;
  },

  // Enter a new audio screen.
  // There is lots of redirection going on here, as business rules have been added that are
  // "exceptions" to the standard state machine flow.
  enterScreen: function (command) {

    var container = getContainer();
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var belowTheLineCouncilBallot = container.Resolve("btl");
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var audioController = container.Resolve("audioController");
    var audioScreenManager = container.Resolve("audioScreenManager");

    // Check for informal vote if leaving this screen. Redirect as needed.
    if ((this.currentBlindInterfaceScreen == 'legislative_assembly_candidate_vote_screen') ||
        (this.currentBlindInterfaceScreen == 'tvs_legislative_assembly_candidate_vote_screen')) {
    
      // If we are going into the help screen.
      if (command.data == "ballot_options_menu_screen" || command.data == "tvs_ballot_options_menu_screen") {
        // initialise help menu position.
        this.optionNumber = 1;
        
      // Else not the help screen, but the next screen.
      } else {
        // We reset the list position to zero for when user returns.
        legislativeAssemblyBallot.resetCurrentCandidatePosition();
        
        // if L.A is informal, alert the user.
        if (legislativeAssemblyBallot.isInformal()) {
          if (gvsMode == true) {
            this.currentBlindInterfaceScreen = 'incomplete_assembly_warning';
          } else {
            this.currentBlindInterfaceScreen = 'tvs_incomplete_assembly_warning';
          }

          command.data = this.currentBlindInterfaceScreen;
          command.callback = audioController.enterBlindUiScreen;
          
        // else continue to L.C ballot according to settings.
        } else {
          if (gvsMode) {
            if (audioScreenManager.getUserVotedAboveOrBelowTheLine() == "below") {
              this.currentBlindInterfaceScreen = 'legislative_council_candidate_vote_screen';
            } else {
              this.currentBlindInterfaceScreen = 'legislative_council_group_vote_screen';
            }
          } else {
            if (audioScreenManager.getUserVotedAboveOrBelowTheLine() == "below") {
              this.currentBlindInterfaceScreen = 'tvs_legislative_council_candidate_vote_screen';
            } else {
              this.currentBlindInterfaceScreen = 'tvs_legislative_council_group_vote_screen';
            }
          }
          command.data = this.currentBlindInterfaceScreen;
          command.callback = audioController.enterBlindUiScreen;
        }
      }
    // Check for informal vote if leaving this screen. Redirect as needed.
    } else if (((this.currentBlindInterfaceScreen == 'legislative_council_group_vote_screen') ||
                (this.currentBlindInterfaceScreen == 'tvs_legislative_council_group_vote_screen')) &&
               ((command.data == 'confirm_assembly_votes_screen') || 
                (command.data == 'tvs_confirm_assembly_votes_screen'))) {

      // We reset the list position to zero for when user returns.
      aboveTheLineCouncilBallot.resetCurrentCandidatePosition();
      if (aboveTheLineCouncilBallot.isInformal()) {
        if (gvsMode == true) {
          this.currentBlindInterfaceScreen = 'informal_council_atl_warning';
        } else {
          this.currentBlindInterfaceScreen = 'tvs_informal_council_atl_warning';
        }

        command.data = this.currentBlindInterfaceScreen;
        command.callback = audioController.enterBlindUiScreen;
      } else {
        if (gvsMode) {
          this.currentBlindInterfaceScreen = 'confirm_assembly_votes_screen';
          command.data = 'confirm_assembly_votes_screen';
        } else {
          this.currentBlindInterfaceScreen = 'tvs_confirm_assembly_votes_screen';
          command.data = 'tvs_confirm_assembly_votes_screen';
        }
        command.callback = audioController.playAssemblyBallotSummary;
      }
    // Check for informal vote if leaving this screen. Redirect as needed.
    } else if (((this.currentBlindInterfaceScreen == 'legislative_council_candidate_vote_screen') || 
                (this.currentBlindInterfaceScreen == 'tvs_legislative_council_candidate_vote_screen')) && 
               ((command.data == 'confirm_assembly_votes_screen') ||
                (command.data == 'tvs_confirm_assembly_votes_screen'))) {

      // We reset the list position to zero for when user returns.
      belowTheLineCouncilBallot.resetCurrentCandidatePosition();
      if (belowTheLineCouncilBallot.isInformal()) {
        if (gvsMode == true) {
          this.currentBlindInterfaceScreen = 'informal_council_btl_warning';
        } else {
          this.currentBlindInterfaceScreen = 'tvs_informal_council_btl_warning';
        }

        command.data = this.currentBlindInterfaceScreen;
        command.callback = audioController.enterBlindUiScreen;
      } else {
        if (gvsMode) {
          this.currentBlindInterfaceScreen = 'confirm_assembly_votes_screen';
          command.data = 'confirm_assembly_votes_screen';
        } else {
          this.currentBlindInterfaceScreen = 'tvs_confirm_assembly_votes_screen';
          command.data = 'tvs_confirm_assembly_votes_screen';
        }
        command.callback = audioController.playAssemblyBallotSummary;
      }
    } else if ((this.currentBlindInterfaceScreen == 'incomplete_assembly_warning' ||
                this.currentBlindInterfaceScreen == 'tvs_incomplete_assembly_warning') && 
               (command.data == 'legislative_council_group_vote_screen' ||
                command.data == 'tvs_legislative_council_group_vote_screen')) {
      if (audioScreenManager.getUserVotedAboveOrBelowTheLine() == "below") {
        if (command.data == 'legislative_council_group_vote_screen') {
          this.currentBlindInterfaceScreen = 'legislative_council_candidate_vote_screen';
          command.data = 'legislative_council_candidate_vote_screen';
        } else {
          this.currentBlindInterfaceScreen = 'tvs_legislative_council_candidate_vote_screen';
          command.data = 'tvs_legislative_council_candidate_vote_screen';
        }
      }
    }
    
    // Check if the user already entered the Council ballot and go with ATL or BTL accordingly.
    if (command.data == 'legislative_council_group_vote_screen') {
    
      // Check if this is a byelection, in which case we simply skip the Council ballot.
      var votingSession = container.Resolve("votingSession");
      var audioController = container.Resolve("audioController");
      var audioScreenManager = container.Resolve("audioScreenManager");

      var isUncontested = votingSession.getRegionIsUncontested();
      if (isUncontested) {
        command.data = targetScreen = 'confirm_assembly_votes_screen';
        command.callback = audioController.playAssemblyBallotSummary;
      }

      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('legislative_council_group_vote_screen');
      if (screenObject.hasVisited() && audioScreenManager.getUserVotedAboveOrBelowTheLine() == "below" &&
          this.currentBlindInterfaceScreen != 'switch_to_atl_warning_screen') {
        command.data = 'legislative_council_candidate_vote_screen';
      }
    }
    
    if (command.data == 'tvs_legislative_council_group_vote_screen') {
    
      // Check if this is a byelection, in which case we simply skip the Council ballot.
      var votingSession = container.Resolve("votingSession");
      var audioController = container.Resolve("audioController");
      var audioScreenManager = container.Resolve("audioScreenManager");

      var isUncontested = votingSession.getRegionIsUncontested();
      if (isUncontested) {
        command.data = targetScreen = 'tvs_confirm_assembly_votes_screen';
        command.callback = audioController.playAssemblyBallotSummary;
      } else {
        var screenFactory = container.Resolve("screenFactory");
        var screenObject = screenFactory.getInstance('tvs_legislative_council_group_vote_screen');
        if (screenObject.hasVisited() && audioScreenManager.getUserVotedAboveOrBelowTheLine() == "below" &&
            this.currentBlindInterfaceScreen != 'tvs_switch_to_atl_warning_screen') {
          command.data = 'tvs_legislative_council_candidate_vote_screen';
        }    
      }
    }

    // Check if this is a byelection, in which case we simply skip the Council summary.
    if (command.data == 'confirm_council_votes_screen') {
      var votingSession = container.Resolve("votingSession");
      var audioController = container.Resolve("audioController");
      var isUncontested = votingSession.getRegionIsUncontested();
      if (isUncontested) {
        command.data = targetScreen = 'confirm_all_votes_screen';
        command.callback = audioController.enterBlindUiScreen;
      }
    }

    // Check if this is a byelection, in which case we simply skip the Council summary.
    if (command.data == 'tvs_confirm_council_votes_screen') {
      var votingSession = container.Resolve("votingSession");
      var audioController = container.Resolve("audioController");
      var isUncontested = votingSession.getRegionIsUncontested();
      if (isUncontested) {
        command.data = targetScreen = 'tvs_print_receipt_screen';
        command.callback = audioController.enterBlindUiScreen;
      }
    }

    var targetScreen = command.data;
    
    // Set ballot data model.
    if (targetScreen == 'legislative_council_candidate_vote_screen' ||
        targetScreen == 'tvs_legislative_council_candidate_vote_screen') {

      this.majorBlindInterfaceScreen = targetScreen;
      audioController.setCurrentBallot(belowTheLineCouncilBallot);
      this.userVotedAboveOrBelowTheLine = "below";
      belowTheLineCouncilBallot.setVisited(true);
      aboveTheLineCouncilBallot.reset();

    } else if (targetScreen == 'legislative_council_group_vote_screen' ||
               targetScreen == 'tvs_legislative_council_group_vote_screen') {

      this.majorBlindInterfaceScreen = targetScreen;
      audioController.setCurrentBallot(aboveTheLineCouncilBallot);
      this.userVotedAboveOrBelowTheLine = "above";
      aboveTheLineCouncilBallot.setVisited(true);
      belowTheLineCouncilBallot.reset();

    } else if (targetScreen == 'legislative_assembly_candidate_vote_screen' ||
               targetScreen == 'tvs_legislative_assembly_candidate_vote_screen') {

      this.majorBlindInterfaceScreen = targetScreen;
      audioController.setCurrentBallot(legislativeAssemblyBallot);        
      legislativeAssemblyBallot.setVisited(true);

    } else if ((targetScreen == 'ballot_options_menu_screen') ||
               (targetScreen == 'tvs_ballot_options_menu_screen')) {

      this.screenPriorToOptionsMenu = this.majorBlindInterfaceScreen;
    }

    // If the district ballot is uncontested, redirect to an alternative screen.
    if (targetScreen == 'legislative_assembly_candidate_vote_screen') {
      var votingSession = container.Resolve("votingSession");
      var isUncontested = votingSession.getDistrictIsUncontested();
      if (isUncontested) {
        command.data = targetScreen = 'uncontested_legislative_assembly_candidate_vote_screen';
      }
    }

    // If the district ballot is uncontested, redirect to an alternative screen.
    if (targetScreen == 'tvs_legislative_assembly_candidate_vote_screen') {
      var votingSession = container.Resolve("votingSession");
      var isUncontested = votingSession.getDistrictIsUncontested();
      if (isUncontested) {
        command.data = targetScreen = 'tvs_uncontested_legislative_assembly_candidate_vote_screen';
      }
    }

    // If the district ballot is uncontested, redirect to the council summary screen.
    if (targetScreen == 'confirm_assembly_votes_screen') {
      var votingSession = container.Resolve("votingSession");
      var audioController = container.Resolve("audioController");
      var isUncontested = votingSession.getDistrictIsUncontested();
      if (isUncontested) {
        command.data = targetScreen = 'confirm_council_votes_screen';
        command.callback = audioController.enterBlindUiScreen;
      }
    }

    // If the district ballot is uncontested, redirect to the council summary screen.
    if (targetScreen == 'tvs_confirm_assembly_votes_screen') {
      var votingSession = container.Resolve("votingSession");
      var audioController = container.Resolve("audioController");
      var isUncontested = votingSession.getDistrictIsUncontested();
      if (isUncontested) {
        command.data = targetScreen = 'tvs_confirm_council_votes_screen';
        command.callback = audioController.enterBlindUiScreen;
      }
    }

    // The user has been switched to the TVS version of the AUI,
    // because they couldn't manage the GVS version.
    if (command.data == 'tvs_entry_screen') {
      $('#keypad').show();
      gvsMode = false;
    }

    this.currentBlindInterfaceScreen = targetScreen;
    
    return targetScreen;
  },
  
  // Return from Options Menu.
  returnToMajorScreen: function () {
    var audioScreenManager = container.Resolve("audioScreenManager");
    var targetScreen = audioScreenManager.getScreenPriorToOptionsMenu();
    audioScreenManager.setCurrentBlindInterfaceScreen(targetScreen);
    return targetScreen;
  },
  
  // Return from Timeout Screen.
  returnFromTimeoutScreen: function () {
    var audioScreenManager = container.Resolve("audioScreenManager");
    var targetScreen = audioScreenManager.getCurrentBlindInterfaceScreen();

    return targetScreen;
  },
  
  // Get the screen that appeared previous to the user entering the options menu.
  getScreenPriorToOptionsMenu: function () {
    return this.screenPriorToOptionsMenu;
  },
  
  // Set a list of the matching visual screens.
  setListOfVisualScreens: function(listOfVisualScreens) {
    this.listOfVisualScreens = listOfVisualScreens;
  },
  
  // Get a list of the matching visual screens.
  getListOfVisualScreens: function() {
    if (this.listOfVisualScreens == null) {
      this.listOfVisualScreens = new Array();
    }
    
    return this.listOfVisualScreens;
  },

  // Check whether the audio UI has a visual UI equivalent.  
  audioScreenHasVisualEquivalent: function (screen) {
    return (this.listOfVisualScreens[screen] != null);
  },

  // Play the summary of selected candidates for the legislative assembly.
  playAssemblyBallotSummary: function (screen) {
    this.currentBlindInterfaceScreen = screen;      
    if (this.audioScreenHasVisualEquivalent(this.currentBlindInterfaceScreen)) {
      this.majorBlindInterfaceScreen = this.currentBlindInterfaceScreen;
    }

    var container = getContainer();
    var legislativeAssemblyBallot = container.Resolve("assembly");
    return legislativeAssemblyBallot;      
  },

  // Play the summary of selected candidates for the legislative council.
  playCouncilBallotSummary: function (screen) {
    return screen;
  },

  // Alert the user to an unused button or gesture.  
  unavailableOption: function (action) {
    return action;
  },
  
  skipToNextSegment: function () {
    return;
  },

  // Play the contextual help relevant to the current screen.
  playContextHelp: function (ballot) {
    return this.currentBlindInterfaceScreen;
  },

  // Flag whether the user visited the ballot.
  userVisitedBallot: function (ballot) {
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var belowTheLineCouncilBallot = container.Resolve("btl");
    var legislativeAssemblyBallot = container.Resolve("assembly");
    if (ballot == "above") {
      this.userVotedAboveOrBelowTheLine = "above";
      aboveTheLineCouncilBallot.setVisited(true);
      belowTheLineCouncilBallot.setVisited(false);
    } else if (ballot == "below") {
      this.userVotedAboveOrBelowTheLine = "below";
      aboveTheLineCouncilBallot.setVisited(false);
      belowTheLineCouncilBallot.setVisited(true);
    } else if (ballot == "assembly") {
      legislativeAssemblyBallot.setVisited(true);
    }
  },

  allowScreenDragging: function () {
    document.ontouchmove = function(e) {
      return true;
    }
  },

  moveUpToOption: function () {

    if (--this.optionNumber == 0) {
      this.optionNumber = 1;
      return FIRST_OPTION_EXCEPTION;      
    }
    
    return this.optionNumber;
  },
  
  moveDownToOption: function () {
    if (++this.optionNumber == 9) {
      this.optionNumber = 8;
      return LAST_OPTION_EXCEPTION;
    }
    
    return this.optionNumber;
  },

  // Trigger the option currently navigated to by the user in the options menu.  
  triggerOption: function () {
    return this.optionNumber;
  },
  
  submitVote: function (mode) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    
    if (mode == GVS) {
      var screen = audioScreenFactory.getInstance("confirm_all_votes_screen");
      screen.submitVote();
    } else {
      var screen = audioScreenFactory.getInstance("tvs_confirm_council_votes_screen");
      screen.submitVote();
    }
  },

  // Execute a Command that calls one of this class's methods and then 
  // calls the callback defined in the command.
  execute : function (command){
  
    var response; 
    var originalScreen = command.data;
    var originalCallback = command.callback;

    try {      
      // The enterScreen command can force screen redirection by ignoring the callback.
      if (command.request == 'enterScreen') {
        response = this[command.request](command);
      } else {
        response = this[command.request](command.data);
      }

    } catch (exception) {
      if (exception.message == LAST_OPTION_EXCEPTION ||
          exception.message == FIRST_OPTION_EXCEPTION) {

        // Call the callback that can then handle the exception.
        command.callback(response, exception, command.data);
      }
    }


    command.callback(response, null, command.data);
    command.data = originalScreen;
    command.callback = originalCallback;
  }  
});