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
 * TvsPrintReceiptAudioScreen - The audio screen class for printing the receipt screen for the TVS blind interface.
 * 
 * @author Peter Scheffer
 */

var TvsPrintReceiptAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    window.clearTimeout(votingSession.getAuiInactivityCounterTimer());
    votingSession.setAuiInactivityCounterTimer(null);
    votingSession.setAuiInactivityTimer(0);

    // At end of playing the complete intro sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var clips = [ ['tvs_print_receipt_intro'], ['print_again_press_three'] ];
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };
    
    var ballotIsInformal = false;

    var container = getContainer();
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var belowTheLineCouncilBallot = container.Resolve("btl");
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var audioScreenManager = container.Resolve("audioScreenManager");
    var userVotedAboveOrBelow = audioScreenManager.getUserVotedAboveOrBelowTheLine(); 

    if (userVotedAboveOrBelow == "above") {
      if (aboveTheLineCouncilBallot.isInformal()) {
        ballotIsInformal = true;
      }
    } else if (userVotedAboveOrBelow == "below") {
      if (belowTheLineCouncilBallot.isInformal()) {
        ballotIsInformal = true;
      }
    } else {
      ballotIsInformal = true;
    }
    
    if (legislativeAssemblyBallot.isInformal()) {
      ballotIsInformal = true;
    }

    var clips = new Array();
    if (ballotIsInformal) {
      clips = clips.concat([ ['print_receipt_intro_sent_informal'] ]);
    } else {
      clips = clips.concat([ ['print_receipt_intro_sent_formal'] ]);
    }

    clips = clips.concat([ ['tvs_print_receipt_intro'], ['print_again_press_three'] ]);

    var audioController = container.Resolve("audioController");    
    var instructions = new AudioInstructions(clips, true, true, callback1);
    audioController.playAudioInstructions(instructions);
    
    this.printBallot();
    
    window.clearTimeout(votingSession.getInactivityCounterTimer());
    window.clearTimeout(votingSession.getInactivityCounterReset());
    votingSession.setInactivityCounterReset(window.setTimeout(function () { checkForReset(); }, 2000));
    votingSession.setInactivityResetTimer(0);
  },
  
  printBallot: function () {
    
    // Setup the PDF for printing.
    var container = getContainer();
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var assemblyPreferences = legislativeAssemblyBallot.getTextualPreferencesInShuffleOrder();
    var atlCouncilPreferences = new Array();
    var btlCouncilPreferences = new Array();
    var audioScreenManager = container.Resolve("audioScreenManager");
    var userVotedAboveOrBelow = audioScreenManager.getUserVotedAboveOrBelowTheLine(); 

    if (userVotedAboveOrBelow == "above") {
      var atl = container.Resolve("atl");
      atlCouncilPreferences = atl.getTextualPreferencesInShuffleOrder();

      var container = getContainer();
      var votingSession = container.Resolve("votingSession");
      var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();
      
      // null out the BTL
      for (var index = 0; index < maxCouncilCandidates; index++) {      	
      	btlCouncilPreferences[index] = '';
      }
      
    } else if (userVotedAboveOrBelow == "below") {
      var btl = container.Resolve("btl");
      btlCouncilPreferences = btl.getTextualPreferencesInShuffleOrder();
      var atl = container.Resolve("atl");
      var ticketedGroups = atl.getTicketedGroups();
      var maxCouncilGroups = ticketedGroups.length;
      var votingSession = container.Resolve("votingSession");
      var language = votingSession.getLanguage();
      
      // null out the ATL
      for (var index = 0; index < maxCouncilGroups; index++) {      	
      	atlCouncilPreferences[index] = '';
      }
    }

    buildReceipt(assemblyPreferences, atlCouncilPreferences, btlCouncilPreferences, language);
  },
  
  printBallotAgain: function () {

    this.printBallot();

    // At end of playing the complete intro sequence, play the navigation gestures audio.
    var callback1 = function () {
    
      // At the end of playing nav gestures, repeat.
      var callback2 = function () {
        var container = getContainer();
        var audioController = container.Resolve("audioController");    
        audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
      };
    
      var clips = [ ['print_ballot_again'] ];
      var instructions = new AudioInstructions(clips, true, true, callback2);     
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.repeatInstructionsTimeout = window.setTimeout(function () {
        audioController.playAudioInstructions(instructions);
      }, 5000);
    };    
    var clips = [ ['print_ballot_again'] ];
    var instructions = new AudioInstructions(clips, true, true, callback1);

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },
  
  playShuffleOrder: function () {

    var container = getContainer();
    var audioController = container.Resolve("audioController");    
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var shuffledPreferenceList = legislativeAssemblyBallot.getPreferencesInShuffleOrder();

    var clips = new Array();

    clips = clips.concat(['tvs_print_shuffle_explanation_a']);
    var highestSelectionNumber = legislativeAssemblyBallot.getHighestSelection();
    if (highestSelectionNumber == 0) {
      clips = clips.concat(['have_not_voted_in_assembly']);
    } else {
      for (var index = 0; index < shuffledPreferenceList.length; index++) {
        if (shuffledPreferenceList[index] != null) {
          clips = clips.concat('number_' + shuffledPreferenceList[index]);
        } else {
          clips = clips.concat(['blank']);
        }
      }
    }

    var audioScreenManager = container.Resolve("audioScreenManager");
    var userVotedAboveOrBelow = audioScreenManager.getUserVotedAboveOrBelowTheLine(); 

    if (userVotedAboveOrBelow == "above") {
      clips = clips.concat(['tvs_print_shuffle_explanation_b_atl']);
      var atl = container.Resolve("atl");
      var shuffledPreferenceList = atl.getShuffledPositionInPreferenceOrder();
      var highestSelectionNumber = atl.getHighestSelection();

      if (highestSelectionNumber == 0) {
        clips = clips.concat(['have_not_voted_in_council']);
      } else {
        for (var index = 1; index <= highestSelectionNumber; index++) {
          if (shuffledPreferenceList[index] != null) {
            clips = clips.concat(['preference'],
                                 ['number_' + index],
                                 ['is_in_the'],
                                 ['ordinal_' + (shuffledPreferenceList[index] +1)],
                                 ['position']);
          }
        }
      }

    } else if (userVotedAboveOrBelow == "below") {
      clips = clips.concat(['tvs_print_shuffle_explanation_b_btl']);
      var btl = container.Resolve("btl");
      var shuffledPreferenceList = btl.getShuffledPositionInPreferenceOrder();
      var highestSelectionNumber = btl.getHighestSelection();
      if (highestSelectionNumber > 3) { 
        highestSelectionNumber = 3;
      }

      if (highestSelectionNumber == 0) {
        clips = clips.concat(['have_not_voted_in_council']);
      } else {
        for (var index = 1; index <= highestSelectionNumber; index++) {
          if (shuffledPreferenceList[index] != null) {
            clips = clips.concat(['preference'],
                                 ['number_' + index],
                                 ['is_in_the'],
                                 ['ordinal_' + shuffledPreferenceList[index]],
                                 ['position']);
          }
        }
      }
    }

    clips = clips.concat(['tvs_print_shuffle_explanation_c']);

    var instructions = new AudioInstructions(clips, true, true, null);
    audioController.playAudioInstructions(instructions);
  }
});