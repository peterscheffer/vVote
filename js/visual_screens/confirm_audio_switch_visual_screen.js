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
 * ConfirmAudioSwitchVisualScreen - The visual screen class to confirm switch to audio for the visual interface.
 * 
 * @author Peter Scheffer
 */
 
var ConfirmAudioSwitchVisualScreen = Screen.extend({  
  init: function () {

    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    
    this._super(visualScreenManager, 'confirm_audio_switch_visual_screen', 
      this.initialiseSwitchToAudioInterface, 
      this.exitStartScreen,
      this.switchToStartScreen);
  },

  initialiseSwitchToAudioInterface: function () {
    var container = getContainer();
    var visualView = container.Resolve("visualView");
    var visualScreenManager = container.Resolve("visualScreenManager");
    var screenFactory = container.Resolve("screenFactory");
    var screen = screenFactory.getInstance("confirm_audio_switch_visual_screen");
    screen.keepVotes = true;
    screen.previousScreen = visualScreenManager.getPreviousVisualInterfaceScreen();
    
    $("#keep_votes_selected").html("&#10004;");
    $("#clear_votes_selected").html("");

    var audioController = container.Resolve("audioController");    
    var audioScreenManager = container.Resolve("audioScreenManager");
    var currentAudioScreen = audioScreenManager.getMajorBlindInterfaceScreen();
    if (currentAudioScreen != null) {
      audioController.enterScreen(null, null, currentAudioScreen);
      audioScreenManager.setCurrentBlindInterfaceScreen(currentAudioScreen);
    } else {
      audioController.enterScreen(null, null, 'confirm_audio_switch_visual_screen');
    }

    $("#select_keep_votes_text").click(function() {
      var container = getContainer();
      var screenFactory = container.Resolve("screenFactory");
      var screen = screenFactory.getInstance("confirm_audio_switch_visual_screen");
      screen.keepVotes = true;

      $("#keep_votes_selected").html("&#10004;");
      $("#clear_votes_selected").html("");
    });

    $("#select_clear_votes_text").click(function() {
      var container = getContainer();
      var screenFactory = container.Resolve("screenFactory");
      var screen = screenFactory.getInstance("confirm_audio_switch_visual_screen");
      screen.keepVotes = false;
      
      $("#clear_votes_selected").html("&#10004;");
      $("#keep_votes_selected").html("");
    });
    
    $("#confirm_audio_switch_button").click(function() {
    
      var container = getContainer();
      var screenFactory = container.Resolve("screenFactory");
      var screen = screenFactory.getInstance("confirm_audio_switch_visual_screen");
    
      if (screen.keepVotes) {
        screen.switchToAudioInterfaceExistingVotes();
      } else {
        screen.switchToAudioInterfaceClearVotes();
      }
    });
    
    $("#confirm_audio_switch_return_button").click(function () {
      
      var container = getContainer();
      var screenFactory = container.Resolve("screenFactory");
      var screen = screenFactory.getInstance("confirm_audio_switch_visual_screen");
      screen.returnFromVisualSwitchConfirmation();
    });
  },
  
  exitStartScreen: function () {
    $("#select_keep_votes_text").off("click");
    $("#select_clear_votes_text").off("click");
    $("#confirm_audio_switch_button").off("click");
    $("#confirm_audio_switch_return_button").off("click");
  },
  
  // Clear all previous votes that were made in the visual interface, then switch to audio interface.
  switchToAudioInterfaceClearVotes : function () {
    var container = getContainer();
    var visualController = container.Resolve("visualController");
    visualController.reset();

    var votingSession = container.Resolve("votingSession");
    window.clearTimeout(votingSession.getInactivityCounterTimer());
    votingSession.setInactivityTimer(0);
    votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));
    votingSession.setIsVisualMode(false);

    var belowTheLineCouncilBallot = container.Resolve("btl");
    belowTheLineCouncilBallot.reset();

    var aboveTheLineCouncilBallot = container.Resolve("atl");
    aboveTheLineCouncilBallot.reset();

    var legislativeAssemblyBallot = container.Resolve("assembly");
    legislativeAssemblyBallot.reset();

    var audioScreenManager = container.Resolve("audioScreenManager");
    audioScreenManager.reset();

    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('audio_start_screen');
    screenObject.switchToAudioInterface();

    var audioScreenManager = container.Resolve("audioScreenManager");
    var visualScreenManager = container.Resolve("visualScreenManager");
    audioScreenManager.setUserVotedAboveOrBelowTheLine(visualScreenManager.getUserVotedAboveOrBelowTheLine());
    audioScreenManager.setCurrentBlindInterfaceScreen('audio_start_screen');

    var audioController = container.Resolve("audioController");
    audioScreenManager.execute({
      request: 'enterScreen',
      data: 'audio_start_screen',
      callback: audioController.enterBlindUiScreen
    });

    $('#keypad').hide();
    gvsMode = true;
  },

  switchToAudioInterfaceExistingVotes : function () {
    var container = getContainer();
    var visualController = container.Resolve("visualController");
    visualController.reset();

    var votingSession = container.Resolve("votingSession");
    window.clearTimeout(votingSession.getInactivityCounterTimer());
    votingSession.setInactivityTimer(0);
    votingSession.setIsVisualMode(false);
    
    $('#keypad').hide();

    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('audio_start_screen');
    screenObject.switchToAudioInterface();

    votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));

    var audioScreenManager = container.Resolve("audioScreenManager");
    var visualScreenManager = container.Resolve("visualScreenManager");
    audioScreenManager.setUserVotedAboveOrBelowTheLine(visualScreenManager.getUserVotedAboveOrBelowTheLine());
    audioScreenManager.setCurrentBlindInterfaceScreen('audio_start_screen');

    var audioController = container.Resolve("audioController");
    audioScreenManager.execute({
      request: 'enterScreen',
      data: 'audio_start_screen',
      callback: audioController.enterBlindUiScreen
    });

    $('#keypad').hide();
    gvsMode = true;
  },

  returnFromVisualSwitchConfirmation: function () {
    var container = getContainer();
    var visualView = container.Resolve("visualView");
    var screenFactory = container.Resolve("screenFactory");
    var screen = screenFactory.getInstance("confirm_audio_switch_visual_screen");
    visualView.displaySection('confirm_audio_switch_visual_screen', screen.previousScreen);

    var votingSession = container.Resolve("votingSession");
    votingSession.setInactivityTimer(0);
    votingSession.setInactivityCounterTimer(window.setTimeout(function () { checkForTimeout(); }, 2000));
  }
});