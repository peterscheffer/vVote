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
 * Typical Controller pattern.  This class is responsible for controlling the behaviour of the UI.
 * It retrieves data from the data model and updates the UI (audio) with the most appropriate data.
 * 
 * @author Peter Scheffer
 */
var AudioController = Class.extend({
  
  init: function () {
    this.audioMode = true;
    this.currentInstructions = null;
    this.repeatTranslatedAudio = false;
  },
  
  reset: function () {
    this.setUsingAudioMode(true);
  },
  
  getQueuedClips: function () {
    return this.queuedClips;
  },
  
  // Turn on or off the instructional audio in the visual UI.
  switchUsingAudioMode: function () {
    this.audioMode = !this.audioMode;
    var container = getContainer();
    var visualView = container.Resolve('visualView');
    var audioSwitchButton = visualView.getDocumentNode('audio_switch_button_off');
    
    if (this.audioMode == true) {
      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
      var labelString = $.i18n._(languageDictionary['audio_switch_button_off']);
      $('#audio_switch_button_off').html(labelString);

      var audioController = container.Resolve("audioController");    
      var audioClips = getVisualUiIntroductionAudio('turn_audio_on');
      if (audioClips != null && audioClips.length > 0) {
        audioController.playTranslatedAudio(audioClips, false);
      }
    } else {
      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
      var labelString = $.i18n._(languageDictionary['audio_switch_button_on']);
      $('#audio_switch_button_off').html(labelString);
      
      var audioController = container.Resolve("audioController");    
      var audioClips = getVisualUiIntroductionAudio('turn_audio_off');
      if (audioClips != null && audioClips.length > 0) {
        audioController.playTranslatedAudio(audioClips, false);
      }
    }
  },
  
  setUsingAudioMode: function (audioMode) {
    this.audioMode = audioMode;
  },
  
  getUsingAudioMode: function () {
    return this.audioMode;
  },
  
  // Plays the next segment in the Assembly ballot summary list of segmented audio.
  skipToNextAssemblySegment: function () {
    // 9 is the start of candidate preference summary audio clips.  
    // 3 is the number of audio clips in each segment of "[pref] [X] [person name]"

    var container = getContainer();
    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    audioClip.skipToClip(9, 3);
  },
  
  // Plays the next segment in the Council ballot summary list of segmented audio.
  skipToNextCouncilSegment: function () {

    var container = getContainer();
    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    var audioScreenManager = container.Resolve("audioScreenManager");
    var userVotedAboveOrBelow = audioScreenManager.getUserVotedAboveOrBelowTheLine(); 

    // 7 is the start of candidate preference summary audio clips.  
    // 3 is the number of audio clips in each segment of "[pref] [X] [person name]"
    if (userVotedAboveOrBelow == 'below') {
      audioClip.skipToClip(7, 3);
    } else if (userVotedAboveOrBelow == 'above') {
      audioClip.skipToClip(7, 3);
    }
  },
  
  skipToNextShuffledSegment: function () {
    var container = getContainer();
    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    audioClip.skipToClip(0, 6);
  },
  
  // Stops the current sequence of audio, if any, that is being played.
  stopAudio: function () {
  
    var audioElement = document.getElementById("complete_audio");
    if (audioElement != null) {
      audioElement.pause();
      audioElement.src = " ";
    }    
    
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.setCurrentInstructions(null);
    clearInterval(audioController.repeatInstructionsTimeout);
    
    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    if (audioClip != null) {
      audioClip.cancelCallback();
      if (audioClip.audio != null) {
        audioClip.audio.src = " ";
        audioClip.audio.load();
      }
      audioClip = null;
    }
    
    // Cancel the queued clips.
    if (this.queuedClips != null && this.queuedClips.length > 0) {
    
      for (var index = 0; index < this.queuedClips.length; index++) {
        var clip = this.queuedClips[index];
        if (clip != null && clip.audio != null) {
          clip.audio.pause();
          clip.audio.src = " ";
          clip.audio.load();
          clip = null;
          this.queuedClips[index] = null;
        }
      }
      clipIndex = 0;
    }
  },
  
  // instructions is an array of AudioClips that need to be played in order.
  playAudioInstructions: function (instructions) {
  
    // Need to check if current audio instructions can be interrupted.
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var currentInstructions = audioController.getCurrentInstructions();
    if (currentInstructions != null && currentInstructions.typeOf == "AudioInstructions" && 
        currentInstructions.getIsInterruptible() == false) {
      return;
    }

    clearInterval(audioController.repeatInstructionsTimeout);
    audioController.stopAudio();
    audioController.setCurrentInstructions(instructions);

    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    if (audioClip != null) {
      audioClip.cancelCallback();
      if (audioClip.audio != null) {
console.log("************************* stopping audio " + audioClip.clipName);
        audioClip.audio.pause();
        audioClip.audio.src = " ";
        audioClip.audio.load();
      }
      audioClip = null;
    }

    // If a new set of clips have been started, cancel the queued clips.
    if (this.queuedClips != null && this.queuedClips.length > 0) {
    
      for (var index = 0; index < this.queuedClips.length; index++) {
        var clip = this.queuedClips[index];
        if (clip != null && clip.audio != null) {
          clip.audio.src = " ";
          clip.audio.load();
          clip = null;
          this.queuedClips[index] = null;
        }
      }
      clipIndex = 0;
    }

    this.queuedClips = new Array();
    this.queuedClips = instructions.getAudioClips().slice(0);
    var audioClip = this.queuedClips[0];
    audioClip.play();
console.log("************************* playing audio " + audioClip.clipName);
    currentAudio.setAudioClip(audioClip);
  },
  
  // Plays the audio according to language selection.
  playTranslatedAudio: function (clips, repeat) {

    var container = getContainer();
    var currentAudio = container.Resolve("currentAudio");
    var audioClip = currentAudio.getAudioClip();
    var audioController = container.Resolve("audioController");
    clearInterval(audioController.repeatInstructionsTimeout);
    audioController.stopAudio();
    audioController.setTranslatedAudioIsRepeated(repeat);

    // If a new set of clips have been started, cancel the queued clips.
    if (this.queuedClips != null && this.queuedClips.length > 0) {
      if (audioClip != null) {
        audioClip.cancelCallback();
        if (audioClip.audio != null) {
          audioClip.audio.src = " ";
          audioClip.audio.load();
        }
        audioClip = null;
      }
    
      for (var index = 0; index < this.queuedClips.length; index++) {
        var clip = this.queuedClips[index];
        if (clip != null && clip.audio != null) {
          clip.audio.src = " ";
          clip.audio.load();
          clip = null;
          this.queuedClips[index] = null;
        }
      }
      clipIndex = 0;
    }

    this.queuedClips = new Array();
    var accumulatedLength = 0;
    for (var index = 0; index < clips.length; index++) {
      var audioClip = new AudioClip(clips[index], index);     
      this.queuedClips[index] = audioClip;  
      if (index == 0) {
        audioClip.play();
      }
    }
  },
  
  replayIntroAudio: function (screen) {
    var audioClips = getVisualUiIntroductionAudio(screen);
    if (audioClips != null && audioClips.length > 0) {
      this.playTranslatedAudio(audioClips, false);
    }
  },
  
  setCurrentInstructions: function (instructions) {
    if (this.currentInstructions != null) {
      this.currentInstructions.callback = null;
      this.currentInstructions = null;
    }
    this.currentInstructions = instructions;
  },
  
  getCurrentInstructions: function () {
    return this.currentInstructions;
  },
  
  setTranslatedAudioIsRepeated: function (repeat) {
    this.repeatTranslatedAudio = repeat;
  },
  
  setInstructionsAreNotRepeated: function () {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.setCurrentInstructions(null);
  },
  
  getInstructionsAreRepeated: function () {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var instructions = audioController.getCurrentInstructions();
    if (instructions == null) {      
      return this.repeatTranslatedAudio;
    }
    
    return instructions.getAreRepeated();
  },

  repeatInstructions: function () {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(audioController.getCurrentInstructions());
  },

  getCurrentBallot: function () {
    return this.currentBallot;
  },
  
  setCurrentBallot: function (currentBallot) {
    this.currentBallot = currentBallot;
  },
  
  enterScreen: function (target, error, screen) {
    var audioClips = [ screen ];

    if (audioClips == null) {
       return;
    }

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var instructions = new AudioInstructions(audioClips, true, true, null);
    audioController.playAudioInstructions(instructions);
  },
  
  // First entry of audio screen.
  enterBlindUiScreen: function (target, error, audio_screen) {
    if (error != null) {
      alert("Unknown error: " + error);
      return;
    }
    
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance(audio_screen);
    screen.initialEntry();
  },
  
  returnToMajorScreen: function (target, error) {
  
    var container = getContainer();
    var audioScreenManager = container.Resolve("audioScreenManager");
    var targetScreen = audioScreenManager.getScreenPriorToOptionsMenu();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance(targetScreen);
    
    // Use entryFromInformalWarningScreen because it plays "You are back in the ..."
    screen.entryFromInformalWarningScreen();
  },
  
  returnFromTimeout: function (target, error) {
    if (error != null) {
      alert("Unknown error: " + error);
      return;
    }
    
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance(target);
    screen.initialEntry();
  },
  
  entryFromInformalWarningScreen: function (target, error, screen) {
    if (error != null) {
      alert("Unknown error: " + error);
      return;
    }
    
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance(screen);
    screen.entryFromInformalWarningScreen();
  },
  
  entryFromSummaryScreen: function (target, error, screen) {
    if (error != null) {
      alert("Unknown error: " + error);
      return;
    }
    
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance(screen);
    screen.entryFromSummaryScreen();
  },
  
  playContextHelp: function (screen, error, ballot) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var audioScreen = audioScreenFactory.getInstance(screen);
    audioScreen.playContextHelp(screen, error);
    return;
  },

  moveToCandidate: function (candidate, error, ballot) {
  
    if (ballot.getType() == LEGISLATIVE_ASSEMBLY_BALLOT) {
      var container = getContainer();
      var audioScreenFactory = container.Resolve("audioScreenFactory");
      var screen;
      if (gvsMode == true) {
        screen = audioScreenFactory.getInstance('legislative_assembly_candidate_vote_screen');
      } else {
        screen = audioScreenFactory.getInstance('tvs_legislative_assembly_candidate_vote_screen');
      }
      screen.moveToCandidate(candidate, error);
      return;
    } else if (ballot.getType() == LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT) {
      var container = getContainer();
      var audioScreenFactory = container.Resolve("audioScreenFactory");
      var screen;
      if (gvsMode == true) {
        screen = audioScreenFactory.getInstance('legislative_council_candidate_vote_screen');
      } else {
        screen = audioScreenFactory.getInstance('tvs_legislative_council_candidate_vote_screen');
      }
      screen.moveToCandidate(candidate, error);
      return;
    }
  },

  moveToGroup: function (group, error, ballot) {
    if (ballot.getType() == LEGISLATIVE_COUNCIL_GROUP_BALLOT) {
      var container = getContainer();
      var audioScreenFactory = container.Resolve("audioScreenFactory");
      var screen;
      if (gvsMode == true) {
        screen = audioScreenFactory.getInstance('legislative_council_group_vote_screen');
      } else {
        screen = audioScreenFactory.getInstance('tvs_legislative_council_group_vote_screen');
      }
      screen.moveToGroup(group, error);
      return;
    }
  },

  selectCurrentCandidate: function (candidate, error, ballot) {

    if (ballot.getType() == LEGISLATIVE_ASSEMBLY_BALLOT) {
      var container = getContainer();
      var audioScreenFactory = container.Resolve("audioScreenFactory");
      
      var screen;
      if (gvsMode == true) {
        screen = audioScreenFactory.getInstance('legislative_assembly_candidate_vote_screen');
      } else {
        screen = audioScreenFactory.getInstance('tvs_legislative_assembly_candidate_vote_screen');
      }
      
      screen.selectCurrentCandidate(candidate, error);
      return;
      
    } else if (ballot.getType() == LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT) {
      var container = getContainer();
      var audioScreenFactory = container.Resolve("audioScreenFactory");
      var screen;

      if (gvsMode == true) {
        screen = audioScreenFactory.getInstance('legislative_council_candidate_vote_screen');
      } else {
        screen = audioScreenFactory.getInstance('tvs_legislative_council_candidate_vote_screen');
      }
      
      screen.selectCurrentCandidate(candidate, error);
      return;
    } 
  },
  
  selectCurrentGroup: function (group, error, ballot) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen;
    if (gvsMode == true) {
      screen = audioScreenFactory.getInstance('legislative_council_group_vote_screen');
    } else {
      screen = audioScreenFactory.getInstance('tvs_legislative_council_group_vote_screen');
    }
    screen.selectCurrentGroup(group, error);
    return;
  },

  // Announce the user's action to identify an invalid option.
  unavailableOption: function (response, error, number) {
      
    // play context help for the current screen after telling user which gesture they just incorrectly made.
    // if no context help, then play initialEntry.
    var callback1 = function () {
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      var audioScreenManager = container.Resolve("audioScreenManager");
      var lastAudioScreen = audioScreenManager.getCurrentBlindInterfaceScreen();
      var audioScreenFactory = container.Resolve("audioScreenFactory");
      var audioScreen = audioScreenFactory.getInstance(lastAudioScreen);
      if (audioScreen != null && audioScreen.playContextHelp != null) {
        audioScreen.playContextHelp();
      } else {
        audioScreen.initialEntry();
      }
    };
    
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    // Get the current instructions to continue playing them after alerting the user about the unavailable option.
    var oldInstructions = audioController.getCurrentInstructions();
    
    // Set up "unavailable option"
    if (gvsMode) {
      var instructions = new AudioInstructions([response, 'unavailable_option'], true, true, callback1);
      audioController.playAudioInstructions(instructions);
    } else {
      var instructions = new AudioInstructions([response], true, true, callback1);
      audioController.playAudioInstructions(instructions);
    }
  },
  
  requestClearBallot: function (response, error, ballot) {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    if (error != null) {
      var instructions = new AudioInstructions(['unavailable_option'], false, true, null);
      audioController.playAudioInstructions(instructions);
    } else {
      var instructions = new AudioInstructions(['confirm_clear_ballot'], false, true, null);
      audioController.playAudioInstructions(instructions);
    }
  },
  
  confirmClearBallot: function (response, error, ballot) {

    var callback1 = function () {
      var container = getContainer();
      var audioScreenManager = container.Resolve("audioScreenManager");
      var audioController = container.Resolve("audioController");
      
      if (gvsMode) {
        audioScreenManager.execute({ 
          request: 'enterScreen', 
          data: 'ballot_options_menu_screen', 
          callback: audioController.enterBlindUiScreen
        });
      } else {
        audioScreenManager.execute({ 
          request: 'enterScreen', 
          data: 'tvs_ballot_options_menu_screen', 
          callback: audioController.enterBlindUiScreen
        });
      }
    };

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var instructions = new AudioInstructions(['ballot_cleared'], false, true, callback1);
    audioController.playAudioInstructions(instructions);
  },
  
  setPlaybackRate: function (response, error, ballot) {
      
    var callback1 = function () {
      var container = getContainer();
      var audioScreenManager = container.Resolve("audioScreenManager");
      var audioController = container.Resolve("audioController");
      
      if (gvsMode) {
        audioScreenManager.execute({ 
          request: 'enterScreen', 
          data: 'ballot_options_menu_screen', 
          callback: audioController.enterBlindUiScreen
        });
      } else {
        audioScreenManager.execute({ 
          request: 'enterScreen', 
          data: 'tvs_ballot_options_menu_screen', 
          callback: audioController.enterBlindUiScreen
        });
      }
    };

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var instructions = new AudioInstructions([response], true, true, callback1);
    audioController.playAudioInstructions(instructions);
  },
  
  setPlaybackRateNormal: function (response, error, ballot) {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var instructions = new AudioInstructions(['speaking_rate_normal'], false, true, null);
    audioController.playAudioInstructions(instructions);
  },
  
  setPlaybackRateMedium: function (response, error, ballot) {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var instructions = new AudioInstructions(['speaking_rate_medium'], false, true, null);
    audioController.playAudioInstructions(instructions);
  },
  
  setPlaybackRateFast: function (response, error, ballot) {
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var instructions = new AudioInstructions(['speaking_rate_fast'], false, true, null);
    audioController.playAudioInstructions(instructions);
  },
  
  emptyCallback: function (response, error, ballot) {
    return;
  },
  
  playAssemblyBallotSummaryInShuffleOrder: function (ballot, error, screen) {
    var container = getContainer();
    var audioController = container.Resolve("audioController");

    if (error != null) {
      alert("Unknown error: " + error);
      return;
    }

    var clips = new Array();
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var preferenceOrderList = legislativeAssemblyBallot.getPreferenceOrderList();
    
    if (preferenceOrderList.length == 0) {
      var instructions = new AudioInstructions([['legislative_assembly_ballot_summary'], 
                 ['you_have_voted_for'], 
                 ['number_0'], 
                 ['candidates'], 
                 ['this_vote_will_not_be_counted']], false, true, null);
      audioController.playAudioInstructions(instructions);
      return;
    }

    clips = clips.concat(['legislative_assembly_ballot_summary']);

    var selectionCount = legislativeAssemblyBallot.getHighestSelection();
    clips = clips.concat(['have_voted_in_assembly'], 
                         ['you_have_voted_for'], 
                         ['number_' + selectionCount], 
                         ['candidates']);

    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();
    if (selectionCount < maxAssemblyCandidatesRequired) {
      clips = clips.concat(['this_vote_will_not_be_counted']);
    } else {
      clips = clips.concat(['this_vote_will_be_counted']);
    }

    for (var index = 0; index < preferenceOrderList.length; index++) {
      var selection = preferenceOrderList[index];
      if (selection == null) {
        continue;
      }
      clips = clips.concat(['preference_number'], 
                           ['number_' + (index+1)], 
                           [selection]);
    }

    if (clips != null && clips.length > 0) {
      var instructions = new AudioInstructions(clips, false, true, null);
      audioController.playAudioInstructions(instructions);
    }
  },

  playAssemblyBallotSummary: function (ballot, error, screen) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    if (gvsMode) {
      var screen = audioScreenFactory.getInstance('confirm_assembly_votes_screen');
      screen.initialEntry();
    } else {
      var screen = audioScreenFactory.getInstance('tvs_confirm_assembly_votes_screen');
      screen.initialEntry();
    }
  },
  
  playCouncilBallotSummary: function (ballot, error, screen) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    if (gvsMode) {
      var screen = audioScreenFactory.getInstance('confirm_council_votes_screen');
      screen.initialEntry();
    } else {
      var screen = audioScreenFactory.getInstance('tvs_confirm_council_votes_screen');
      screen.initialEntry();
    }
  },

  switchToVisualInterface: function (audioScreen) {
    var container = getContainer();
    var optionsManager = container.Resolve("optionsManager");
    optionsManager.resetAudioSpeed();

    // Instantiate the screen we are exiting and the one we are entering.
    var screenFactory = new ScreenFactory();      

    // Set up the screen we are entering.
    var screen = screenFactory.getInstance(audioScreen);
    if (screen != null) {
      screen.switchToVisual();
    }
    
    // Play alert to the blind user that they have been switched to the visual UI.    
    var instructions = new AudioInstructions(['switch_to_audio'], false, true, null);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },

  finishedVoting: function (ballot, error, screen) {

    if (error != null) {
      alert("Unknown error: " + error);
      return;
    }

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var clips = blindInterfaceAudio[screen];
    var instructions = new AudioInstructions(clips, false, true, null);
    audioController.playAudioInstructions(instructions);
  },
  
  playShuffleOrder: function (response, error, gesture) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    if (gvsMode) {
      var screen = audioScreenFactory.getInstance('print_receipt_screen');
      screen.playShuffleOrder();
    } else { 
      var screen = audioScreenFactory.getInstance('tvs_print_receipt_screen');
      screen.playShuffleOrder();
    }
    return;  
  },
  
  printBallotAgain: function (response, error, gesture) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    if (gvsMode) {
      var screen = audioScreenFactory.getInstance('print_receipt_screen');
      screen.printBallotAgain();
    } else {
      var screen = audioScreenFactory.getInstance('tvs_print_receipt_screen');
      screen.printBallotAgain();
    }
  },  
  
  freePlayPractice: function (response, error, gesture) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance('free_practice_screen');
    screen.practiceGesture(response, error);
    return;
  },
  
  playPractice: function (response, error, gesture) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance('practice_screen');
    screen.practiceGesture(response, error);
    return;
  },
  
  freeTvsPractice: function (response, error, button) {
    var container = getContainer();
    var audioScreenFactory = container.Resolve("audioScreenFactory");
    var screen = audioScreenFactory.getInstance('tvs_practice_screen');
    screen.practice(response, error);
    return;
  },
  
  playInfoAboutThisBallot: function () {

    var callback1 = function () {   
      var container = getContainer();
      var audioScreenManager = container.Resolve("audioScreenManager");
      var audioController = container.Resolve("audioController");

      if (gvsMode) {
        audioScreenManager.execute({ 
          request: 'enterScreen', 
          data: 'ballot_options_menu_screen', 
          callback: audioController.enterBlindUiScreen
        });
      } else {
        audioScreenManager.execute({ 
          request: 'enterScreen', 
          data: 'tvs_ballot_options_menu_screen', 
          callback: audioController.enterBlindUiScreen
        });
      }     
    };
  
    var clips = new Array();

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var currentBallot = audioController.getCurrentBallot();

    if (currentBallot.getType() == LEGISLATIVE_COUNCIL_GROUP_BALLOT ||
        currentBallot.getType() == LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT) {
      clips = clips.concat(['about_lc_ballot']);
    } else if (currentBallot.getType() == LEGISLATIVE_ASSEMBLY_BALLOT) {
      clips = clips.concat(['about_la_ballot']);
    }
    
    var instructions = new AudioInstructions(clips, true, true, callback1);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);    
  },
  
  playInfoAboutParliament: function () {

    var callback1 = function () {   
      var container = getContainer();
      var audioScreenManager = container.Resolve("audioScreenManager");
      var audioController = container.Resolve("audioController");

      if (gvsMode) {
        audioScreenManager.execute({ 
          request: 'ballot_options_menu_screen', 
          data: 'clear_ballot_screen', 
          callback: audioController.enterBlindUiScreen
        });
      } else {
        audioScreenManager.execute({ 
          request: 'enterScreen', 
          data: 'tvs_ballot_options_menu_screen', 
          callback: audioController.enterBlindUiScreen
        });
      }     
    };
  
    var clips = [ ['about_vic_parliament'] ];
    var instructions = new AudioInstructions(clips, true, true, callback1);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);     
  },
  
  // Return from the options menu to the highest selected candidate.
  returnToLastSelectedCandidate: function () {
  
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var currentBallot = audioController.getCurrentBallot();
    var ballotManager = container.Resolve("ballotManager");
    ballotManager.moveToLastSelectedCandidate(currentBallot);
    audioController.returnToMajorScreen();
  },
  
  // Navigate to the next option in the options menu in the GVS system.
  moveToOption: function (optionNumber) {
  
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
      
      var clips = [ ['options_menu'], ['gvs_options_menu_navigation'], ['options_menu_item_' + optionNumber], ['gvs_double_tap'] ];
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };
    
    var clips = new Array();
      
    if (optionNumber == FIRST_OPTION_EXCEPTION) {
      clips = clips.concat([ ['alert_top_of_list'], ['options_menu_item_1'], ['gvs_double_tap'] ]);
    } else if (optionNumber == LAST_OPTION_EXCEPTION) {
      clips = clips.concat([ ['alert_bottom_of_list'], ['options_menu_item_8'], ['gvs_double_tap'] ]);
    } else {
      clips = clips.concat([ ['options_menu_item_' + optionNumber], ['gvs_double_tap'] ]);
    }
    
    var instructions = new AudioInstructions(clips, true, true, callback1);
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);    
  },
  
  // Trigger an option in the options menu in the GVS system.
  triggerOption: function (optionNumber) {
  
    // Return to the ballot at the highest selected candidate.
    if (optionNumber == 1) {

      var container = getContainer();
      var audioScreenManager = container.Resolve("audioScreenManager");
      var audioController = container.Resolve("audioController");
      audioController.returnToLastSelectedCandidate();
      
      audioScreenManager.execute({ 
        request: 'returnToMajorScreen', 
        data: null, 
        callback: audioController.returnToLastSelectedCandidate
      });
      
    // Static info about this ballot.
    } else if (optionNumber == 2) {
  
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.playInfoAboutThisBallot();

    // Change audio playback speed.
    } else if (optionNumber == 3) {
    
      var container = getContainer();
      var optionsManager = container.Resolve("optionsManager");    
      var audioController = container.Resolve("audioController");

      optionsManager.execute({ 
        request: 'increaseAudioSpeed', 
        data: null, 
        callback: audioController.setPlaybackRate 
      });

    // Clear the ballot.
    } else if (optionNumber == 4) {

      var container = getContainer();
      var audioController = container.Resolve("audioController");
      var audioScreenManager = container.Resolve("audioScreenManager");
      
      audioScreenManager.execute({ 
        request: 'enterScreen', 
        data: 'clear_ballot_screen', 
        callback: audioController.enterBlindUiScreen
      });

    // Quit the system and discard the vote.
    } else if (optionNumber == 5) {

      var container = getContainer();
      var audioController = container.Resolve("audioController");
      var audioScreenManager = container.Resolve("audioScreenManager");
      
      if (gvsMode) {
        audioScreenManager.execute({ 
          request: 'enterScreen', 
          data: 'quit_system_screen', 
          callback: audioController.enterBlindUiScreen
        });
      } else {
        audioScreenManager.execute({ 
          request: 'enterScreen', 
          data: 'tvs_quit_system_screen', 
          callback: audioController.enterBlindUiScreen
        });
      }

    // Switch to the visual system (user enacted) and start from the first screen.
    } else if (optionNumber == 6) {

      var container = getContainer();
      var optionsManager = container.Resolve("optionsManager");
      optionsManager.resetAudioSpeed();
      
      var audioScreenManager = container.Resolve("audioScreenManager");
      audioScreenManager.reset();

      var votingSession = container.Resolve("votingSession");
      window.clearTimeout(votingSession.getAuiInactivityCounterTimer());
      votingSession.setAuiInactivityTimer(0);
      votingSession.setInactivityCounterTimer(window.setTimeout(function () { checkForTimeout(); }, 2000));
      votingSession.setIsVisualMode(true);

      // Set up the screen we are entering.
      var screenFactory = container.Resolve("screenFactory");
      var screen = screenFactory.getInstance('start_screen');
      if (screen != null) {
        screen.switchToVisual();
      }
    
      // Play alert to the blind user that they have been switched to the visual UI.    
      var instructions = new AudioInstructions(['switch_to_audio'], false, true, null);
      var audioController = container.Resolve("audioController");
      audioController.playAudioInstructions(instructions);
      
      switchedToVisualMode = true;

    // Static info about Victorian parliament.
    } else if (optionNumber == 7) {
  
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.playInfoAboutParliament();
  
    // Switch to the TVS system.
    } else if (optionNumber == 8) {

      var container = getContainer();
      var audioController = container.Resolve("audioController");
      var audioScreenManager = container.Resolve("audioScreenManager");

      audioScreenManager.execute({ 
        request: 'enterScreen', 
        data: 'tvs_entry_screen', 
        callback: audioController.enterBlindUiScreen 
      });
    }
  },
  
  quitApplication: function () {
  
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();

    var optionsManager = container.Resolve("optionsManager");
    optionsManager.resetAudioSpeed();
    
    var visualController = container.Resolve("visualController");
    visualController.quitApplication();
    
    var audioScreenManager = container.Resolve("audioScreenManager");
    audioScreenManager.reset();
    
    var optionsManager = container.Resolve("optionsManager");
    optionsManager.reset();

    var screenFactory = new ScreenFactory();      
    var startScreen = screenFactory.getInstance('triage_screen');
    startScreen.enter();
    
    $('#keypad').hide();
  },
  
  cancelRepeatInstructions: function () {
    this.repeatInstructionsTimeout = null;
  },
  
  submitVote: function () {
    
  }
});