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
 * ScanErrorVisualScreen - The visual screen class to warn user of QR code scan error for the visual interface.
 * It handles the various scenarios: slip already voted, receipt scanned first, etc.
 * 
 * @author Peter Scheffer
 */
 
var ScanErrorVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    
    this._super(visualScreenManager, 'scan_error_visual_screen', 
      this.initialiseScanErrorScreen, 
      this.exitScanErrorScreen,
      null);
      
    this.INACTIVITY_TIMEOUT_PERIOD = 180000;
    this.inactivityResetTimer = 0;
    this.lastInstructionsPlayed = null;
    this.firstSlip = null;    
    this.scannedBoth = false;
  },
  
  initialiseScanErrorScreen: function () {
    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
    errorScreen.checkForReset();
    errorScreen.startAgainTimeout = window.setTimeout(function () { errorScreen.startQrScannerAgain(); }, SCAN_TIMEOUT);
  },
    
  exitScanErrorScreen: function () {
    var container = getContainer();
    var audioController = container.Resolve('audioController');
    audioController.stopAudio();
    var readbackSession = container.Resolve('readbackSession');
    if (readbackSession != null) {
      readbackSession.reset();
    }
    
    var votingSession = container.Resolve("votingSession");
    votingSession.reset();

    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
    errorScreen.removeCandidateHandler();
    errorScreen.removePreferenceHandler();
    errorScreen.removeCandidateThenReceiptHandler();
    errorScreen.removeReceiptThenCandidateHandler();
    
    var assembly = container.Resolve("assembly");
    var atl = container.Resolve("atl");
    var btl = container.Resolve("btl");
    
    assembly.reset();
    atl.reset();
    btl.reset();
  },
 
  // Restart the QR scanner after a pause to see if they scan the "other half".
  startQrScannerAgain: function () {
  
    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
    window.clearTimeout(errorScreen.startAgainTimeout);
    
    // this setTimeout is a safe measure, so we don't call call the barcode servlet again too quickly.
    window.clearTimeout(barcodeTimeout);
    barcodeTimeout = window.setTimeout(function () { getBarcode(processQRcode); }, SCAN_TIMEOUT);  
  },
  
  // add handler to play back candidate list.
  addCandidateHandler: function () {
    var touchContainer = document.getElementById('warn_user_voted');
    var hammer = new Hammer(touchContainer);
    hammer.onhold = scanCandidateListTrigger;
    hammer.ondragstart = scanCandidateListTrigger;
    hammer.ondrag = scanCandidateListTrigger;
    hammer.ondragend = scanCandidateListTrigger;
    this.candidateHandler = hammer.handleEvents;
  },
  
  // remove handler to play back candidate list.
  removeCandidateHandler: function () {
    if (this.candidateHandler != null) {
      var obj = document.getElementById('warn_user_voted');
      obj.removeEventListener('touchstart', this.candidateHandler, false);
      obj.removeEventListener('touchend', this.candidateHandler, false);
      obj.removeEventListener('touchmove', this.candidateHandler, false);
      obj.removeEventListener('touchcancel', this.candidateHandler, false);
    }
  },

  // add handler to play back preference receipt.
  addPreferenceHandler: function () {
    var touchContainer = document.getElementById('warn_user_voted');
    var hammer = new Hammer(touchContainer);
    hammer.onhold = scanReceiptListTrigger;
    hammer.ondragstart = scanReceiptListTrigger;
    hammer.ondrag = scanReceiptListTrigger;
    hammer.ondragend = scanReceiptListTrigger;
    this.preferenceHandler = hammer.handleEvents;
  },
  
  // remove handler to play back preference receipt.
  removePreferenceHandler: function () {
    if (this.preferenceHandler != null) {
      var obj = document.getElementById('warn_user_voted');
      obj.removeEventListener('touchstart', this.preferenceHandler, false);
      obj.removeEventListener('touchend', this.preferenceHandler, false);
      obj.removeEventListener('touchmove', this.preferenceHandler, false);
      obj.removeEventListener('touchcancel', this.preferenceHandler, false);
    }
  },
  
  // add handler to play back preference receipt or entire vote.
  addCandidateThenReceiptHandler: function () {
    var touchContainer = document.getElementById('warn_user_voted');
    var hammer = new Hammer(touchContainer);
    hammer.onhold = scanCandidateThenReceiptTrigger;
    hammer.ondragstart = scanCandidateThenReceiptTrigger;
    hammer.ondrag = scanCandidateThenReceiptTrigger;
    hammer.ondragend = scanCandidateThenReceiptTrigger;
    this.candidateThenReceiptHandler = hammer.handleEvents;
    this.firstSlip = "candidate";
  },
  
  // remove handler to play back preference receipt or entire vote.
  removeCandidateThenReceiptHandler: function () {
    if (this.candidateThenReceiptHandler != null) {
      var obj = document.getElementById('warn_user_voted');
      obj.removeEventListener('touchstart', this.candidateThenReceiptHandler, false);
      obj.removeEventListener('touchend', this.candidateThenReceiptHandler, false);
      obj.removeEventListener('touchmove', this.candidateThenReceiptHandler, false);
      obj.removeEventListener('touchcancel', this.candidateThenReceiptHandler, false);
    }
  },
   
  // add handler to play back candidate list or entire vote.
  addReceiptThenCandidateHandler: function () {
    var touchContainer = document.getElementById('warn_user_voted');
    var hammer = new Hammer(touchContainer);
    hammer.onhold = scanReceiptThenCandidateTrigger;
    hammer.ondragstart = scanReceiptThenCandidateTrigger;
    hammer.ondrag = scanReceiptThenCandidateTrigger;
    hammer.ondragend = scanReceiptThenCandidateTrigger;
    this.receiptThenCandidateHandler = hammer.handleEvents;
    this.firstSlip = "receipt";
  },
  
  // remove handler to play back candidate list or entire vote.
  removeReceiptThenCandidateHandler: function () {
    if (this.receiptThenCandidateHandler != null) {
      var obj = document.getElementById('warn_user_voted');
      obj.removeEventListener('touchstart', this.receiptThenCandidateHandler, false);
      obj.removeEventListener('touchend', this.receiptThenCandidateHandler, false);
      obj.removeEventListener('touchmove', this.receiptThenCandidateHandler, false);
      obj.removeEventListener('touchcancel', this.receiptThenCandidateHandler, false);
    }
  },
 
  // Present info to user about this voting receipt already being voted, and ask what to do.
  displayPreferencesSlipDetails: function () {
    $('#scan_error_message_1').html(getText("scan_error_message_6"));
    $('#scan_error_message_2').html("");
    $('#scan_error_message_3').html(getText("scan_error_message_3"));
    $('#scan_error_message_4').html(getText("scan_error_message_4"));
    $('#scan_error_message_5').html(getText("scan_error_message_5"));

    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");

    var readbackSession = container.Resolve("readbackSession");
    var voterHasScannedCandidateSlip = readbackSession.getScannedCandidateSlip();

    // Listen for interaction gestures. If voter has scanned slip, offer to readback entire vote.
    if (voterHasScannedCandidateSlip) {
      errorScreen.removeCandidateHandler();
      errorScreen.addCandidateThenReceiptHandler();
      errorScreen.scannedBoth = true;

      var clips = ['swipe_right_entire_vote_left_preferences'];
      var instructions = new AudioInstructions(clips, true, true, null);
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.playAudioInstructions(instructions);

      errorScreen.lastInstructionsPlayed = clips;
      
    } else {

      var clips = ['this_preferences_receipt_voted'];
      var instructions = new AudioInstructions(clips, true, true, null);
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.playAudioInstructions(instructions);
    
      errorScreen.addPreferenceHandler();

      errorScreen.lastInstructionsPlayed = clips;
    }
  },
  
  // Present info to user about this candidate slip already being voted, and ask what to do.
  displayCandidateSlipDetails: function () {
    $('#scan_error_message_1').html(getText("scan_error_message_1"));
    $('#scan_error_message_2').html("");
    $('#scan_error_message_3').html(getText("scan_error_message_3"));
    $('#scan_error_message_4').html(getText("scan_error_message_4"));
    $('#scan_error_message_5').html(getText("scan_error_message_5"));
    
    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");

    var readbackSession = container.Resolve("readbackSession");
    var voterHasScannedPreferencesReceipt = readbackSession.getScannedPreferencesReceipt();

    // Listen for interaction gestures. If voter has scanned receipt, offer to readback entire vote.
    if (voterHasScannedPreferencesReceipt) {
      errorScreen.removePreferenceHandler();
      errorScreen.addReceiptThenCandidateHandler();
      errorScreen.scannedBoth = true;

      var clips = ['swipe_right_entire_vote_left_candidate'];
      var instructions = new AudioInstructions(clips, true, true, null);
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.playAudioInstructions(instructions);

      errorScreen.lastInstructionsPlayed = clips;

    } else {

      errorScreen.addCandidateHandler();

      var clips = ['this_candidate_list_voted'];
      var instructions = new AudioInstructions(clips, true, true, null);
      var container = getContainer();
      var audioController = container.Resolve("audioController");
      audioController.playAudioInstructions(instructions);

      errorScreen.lastInstructionsPlayed = clips;
    }
  },
  
  readbackCompleteVote: function () {
    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
    errorScreen.rebuildBallotPreferences();
  },

  // play back vote in printed ballot order.
  readbackPreferencesList: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var uncontestedDistrict = votingSession.getDistrictIsUncontested();
    var audioController = container.Resolve("audioController");
    var readbackSession = container.Resolve("readbackSession");

    var voteData = readbackSession.getVote();
    var votingPreferences = voteData.split(":");
    var assemblyShuffledPreferenceList = votingPreferences[0].split(",");
    var atlShuffledPreferenceList = votingPreferences[1].split(",");
    var btlShuffledPreferenceList = votingPreferences[2].split(",");

    var clips = new Array();
    var laClips = new Array();
    var votedInAssemblyBallot = false;

    if (!uncontestedDistrict) {
      
      laClips = laClips.concat(['your_district_preferences_on_receipt']);
      for (var index = 0; index < assemblyShuffledPreferenceList.length; index++) {
        if (assemblyShuffledPreferenceList[index] != "") {
          laClips = laClips.concat('number_' + assemblyShuffledPreferenceList[index]);
          votedInAssemblyBallot = true;
        } else {
          laClips = laClips.concat(['blank']);
        }
      }
    } else {
      var chosenLanguage = getCurrentLanguageSelection();
      clips = clips.concat(audioArray[chosenLanguage]['district_not_being_contested']);
    }

    // If the user didn't vote in the district ballot.
    if (!uncontestedDistrict) {
      if (!votedInAssemblyBallot) {
        clips = clips.concat(['your_district_vote_is_blank']);
      } else {
        clips = clips.concat(laClips);
      }
    }

    var votedAboveTheLine = false;
    var votedBelowTheLine = false;
    var atlClips = ['your_region_group_preferences_on_receipt'];
    for (var index = 0; index < atlShuffledPreferenceList.length; index++) {
      if (atlShuffledPreferenceList[index] != "") {
        votedAboveTheLine = true;
        atlClips = atlClips.concat('number_' + atlShuffledPreferenceList[index]);
      } else {
        atlClips = atlClips.concat(['blank']);
      }
    }
    
    if (votedAboveTheLine == true) {
      clips = clips.concat(atlClips);
    } else {
      var btlClips = ['your_region_candidate_preferences_on_receipt'];
      for (var index = 0; index < btlShuffledPreferenceList.length; index++) {
        if (btlShuffledPreferenceList[index] != "") {
          votedBelowTheLine = true;
          btlClips = btlClips.concat('number_' + btlShuffledPreferenceList[index]);
        } else {
          btlClips = btlClips.concat(['blank']);
        }
      }
      
      if (votedBelowTheLine == true) {
        clips = clips.concat(btlClips);
      }
    }

    // If the user didn't vote in the region ballot.
    if (!votedAboveTheLine && !votedBelowTheLine) {
      clips = clips.concat(['your_region_vote_is_blank']);
    }

    // At the end of playing instructions, repeat.
    var callback1 = function () {
      var container = getContainer();
      var audioController = container.Resolve("audioController");    
      var screenFactory = container.Resolve("screenFactory");
      var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
      
      var clips;
      if (errorScreen.scannedBoth == true) {
        clips = [ ['right_whole_vote_left_pr_press_quit'] ];
      } else {
        clips = [ ['swipe_right_readback_again'] ];
      }
      
      if (clips != null && clips.length > 0) {
        var instructions = new AudioInstructions(clips, true, true, null);
        audioController.playAudioInstructions(instructions);
      }
    };

    var instructions = new AudioInstructions(clips, false, true, callback1);
    audioController.playAudioInstructions(instructions);
  },
  
  // Present the candidates on the list in shuffled order.
  readbackCandidateList: function () {
  
    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var uncontestedDistrict = votingSession.getDistrictIsUncontested();
    var uncontestedRegion = votingSession.getRegionIsUncontested();

    var clips = new Array();

    // If the district is not uncontested, present it.
    if (!uncontestedDistrict) {
      clips = clips.concat(['your_district_candidate_list']);
    
      // Get LA candidates.
      var assembly = container.Resolve("assembly");

      var candidates = assembly.getCandidatesInShuffleOrder();
      for (var index = 0; index < candidates.length; index++) {
        var candidate = candidates[index];
        clips = clips.concat(candidate.getAudioFileName());
      }
    } else {
      var chosenLanguage = getCurrentLanguageSelection();
      clips = clips.concat(audioArray[chosenLanguage]['district_not_being_contested']);
    }

    // If the region is included (not by-election), present it.
    if (!uncontestedRegion) {

      clips = clips.concat(['your_region_groups_candidate_list']);

      // Get ATL parties.
      var atl = container.Resolve("atl");
      var parties = atl.getPartiesInShuffleOrder();
      for (var index = 0; index < parties.length; index++) {
        var party = parties[index];
        clips = clips.concat(party.getAudioFileName());
      }

      clips = clips.concat(['your_region_candidates_candidate_list']);
    
      // Get BTL candidates.
      var btl = container.Resolve("btl");
      var candidates = btl.getCandidatesInShuffleOrder();
      for (var index = 0; index < candidates.length; index++) {
        var candidate = candidates[index];
        clips = clips.concat(candidate.getAudioFileName());
      }
    }

    // At the end of playing instructions, repeat.
    var callback1 = function () {
      var container = getContainer();
      var audioController = container.Resolve("audioController");    
      var screenFactory = container.Resolve("screenFactory");
      var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
      
      var clips;
      if (errorScreen.scannedBoth == true) {
        clips = [ ['right_whole_vote_left_cl_press_quit'] ];
      } else {
        clips = [ ['swipe_right_readback_again'] ];
      }
      
      if (clips != null && clips.length > 0) {
        var instructions = new AudioInstructions(clips, true, true, null);
        audioController.playAudioInstructions(instructions);
      }
    };

    // Play all candidates on the slip.
    var audioController = container.Resolve("audioController");
    if (clips != null && clips.length > 0) {
      var instructions = new AudioInstructions(clips, false, true, callback1);
      audioController.playAudioInstructions(instructions);
    }
  },
  
  // Reconstruct the entire vote for play back in preference order.
  rebuildBallotPreferences: function () {
    
    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var uncontestedDistrict = votingSession.getDistrictIsUncontested();
    var readbackSession = container.Resolve("readbackSession");
    var voteData = readbackSession.getVote();
    var votingPreferences = voteData.split(":");
    var assemblyShuffledPreferenceList = votingPreferences[0].split(",");
    var atlShuffledPreferenceList = votingPreferences[1].split(",");
    var btlShuffledPreferenceList = votingPreferences[2].split(",");

    // Set LA candidate selections.
    var assembly = container.Resolve("assembly");
    for (var index = 0; index < assemblyShuffledPreferenceList.length; index++) {
      var selection = assemblyShuffledPreferenceList[index];
      var candidate = assembly.getCandidateByShuffleOrder(index);
      if (selection != " " && selection != null) {
        assembly.setBallotSelection(candidate, selection);
      }
    }

    // Set ATL group selection.
    var atl = container.Resolve("atl");
    for (var index = 0; index < atlShuffledPreferenceList.length; index++) {
      var selection = atlShuffledPreferenceList[index];
      var group = atl.getCandidateByShuffleOrder(index);
      if (selection != " " && selection != null) {
        atl.setBallotSelection(group, selection);
      }
    }

    // Set BTL candidate selections.
    var btl = container.Resolve("btl");
    for (var index = 0; index < btlShuffledPreferenceList.length; index++) {
      var selection = btlShuffledPreferenceList[index];
      var candidate = btl.getCandidateByShuffleOrder(index);
      if (selection != " " && selection != null) {
        btl.setBallotSelection(candidate, selection);
      }
    }

    var clips = new Array();
    var laClips = new Array();
    var votedInAssemblyBallot = false;

    if (!uncontestedDistrict) {
      
      var candidatesInPreferenceOrder = assembly.getPreferenceOrderList();
      laClips = laClips.concat(['your_district_preferences']);
      for (var index = 0; index < candidatesInPreferenceOrder.length; index++) {
        var candidate = candidatesInPreferenceOrder[index];
        laClips = laClips.concat(['preference_number'], 
                                 ['number_' + (index+1)], 
                                 [candidate.getAudioFileName()]);

        votedInAssemblyBallot = true;
      }

    } else {
      var chosenLanguage = getCurrentLanguageSelection();
      clips = clips.concat(audioArray[chosenLanguage]['district_not_being_contested']);
    }

    // If the user didn't vote in the district ballot.
    if (!uncontestedDistrict) {
      if (!votedInAssemblyBallot) {
        clips = clips.concat(['your_district_vote_is_blank']);
      } else {
        clips = clips.concat(laClips);
      }
    }

    var votedAboveTheLine = false;
    var votedBelowTheLine = false;
    var group = atl.getSelection();
    var atlClips = ['your_region_group_preferences'];
    if (group != null) {
      votedAboveTheLine = true;
      atlClips = atlClips.concat(['preference_number'], 
                                 ['number_1'], 
                                 [group.getAudioFileName()]);
    }

    if (votedAboveTheLine == true) {
      clips = clips.concat(atlClips);
    } else {
      var btlClips = ['your_region_candidate_preferences'];
      candidatesInPreferenceOrder = btl.getPreferenceOrderList();
      for (var index = 0; index < candidatesInPreferenceOrder.length; index++) {
        var candidate = candidatesInPreferenceOrder[index];
        btlClips = btlClips.concat(['preference_number'], 
                                   ['number_' + (index+1)], 
                                   [candidate.getAudioFileName()]);
        votedBelowTheLine = true;
      }
      
      if (votedBelowTheLine == true) {
        clips = clips.concat(btlClips);
      }
    }

    // If the user didn't vote in the region ballot.
    if (!votedAboveTheLine && !votedBelowTheLine) {
      clips = clips.concat(['your_region_vote_is_blank']);
    }

    // At the end of playing instructions.
    var callback1 = function () {
      var container = getContainer();
      var audioController = container.Resolve("audioController");    
      var screenFactory = container.Resolve("screenFactory");
      var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
      
      var clips = new Array();

      if (errorScreen.firstSlip == "receipt") {
        clips = clips.concat(['swipe_right_entire_vote_left_candidate'], ['or_press_hold_to_quit']);
      } else if (errorScreen.firstSlip == "candidate") {
        clips = clips.concat(['swipe_right_entire_vote_left_preferences'], ['or_press_hold_to_quit']);
      }

      if (clips != null && clips.length > 0) {
        var instructions = new AudioInstructions(clips, true, true, null);
        audioController.playAudioInstructions(instructions);
      }
    };
    
    // Play all candidates on the slip.
    var audioController = container.Resolve("audioController");
    if (clips != null && clips.length > 0) {
      var instructions = new AudioInstructions(clips, false, true, callback1);
      audioController.playAudioInstructions(instructions);
    }
  },
  
  // Timeout interval check for reset to scan screen.
  checkForReset: function () {

    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
    errorScreen.inactivityResetTimer += 2000;
    
    if (errorScreen.inactivityResetTimer >= errorScreen.INACTIVITY_TIMEOUT_PERIOD) {
      window.clearTimeout(errorScreen.inactivityCounterReset);
      errorScreen.inactivityResetTimer = 0;
      errorScreen.resetToScanScreen();
    } else {
      window.clearTimeout(errorScreen.inactivityCounterReset);
      errorScreen.inactivityCounterReset = window.setTimeout(function () { errorScreen.checkForReset(); }, 2000);
    }
  },
  
  resetToScanScreen: function () {
    var container = getContainer();
    var audioController = container.Resolve('audioController');
    audioController.stopAudio();
    var visualView = container.Resolve('visualView');
    var visualScreenManager = container.Resolve('visualScreenManager');
    var currentScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    visualView.displaySection(currentScreen, 'triage_screen'); 
    var screenFactory = container.Resolve("screenFactory");
    var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
    errorScreen.inactivityResetTimer = 0;
    window.clearTimeout(errorScreen.inactivityCounterReset);
  },
  
  gestureNotSupported: function () {

    // At the end of playing instructions, repeat.
    var callback1 = function () {
      var container = getContainer();
      var audioController = container.Resolve("audioController");    
      var screenFactory = container.Resolve("screenFactory");
      var errorScreen = screenFactory.getInstance("scan_error_visual_screen");
      
      var clips = errorScreen.lastInstructionsPlayed;
      if (clips != null && clips.length > 0) {
        var instructions = new AudioInstructions(clips, true, true, null);
        audioController.playAudioInstructions(instructions);
      }
    };

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var clips = ['action_not_supported'];
    if (clips != null && clips.length > 0) {
      var instructions = new AudioInstructions(clips, false, true, callback1);
      audioController.playAudioInstructions(instructions);
    }
  }
});

// Check for voter scanning the "other half" of the vote, either the candidate slip or voting receipt.
function scanSecondHalf (msg) {
  // msg comes null if no code were detected
  if (msg === null) { //expect a lot of nulls
    // Do nothing
  } else {

    var container = getContainer();
    var readbackSession = container.Resolve('readbackSession');
    var scannedSerialNumber = readbackSession.getSerialCode();
    var qrData = msg.split(";");

    try {

      // This might be a receipt.
      if (qrData[0] == "receipt") {

        // If the QR code is being scanned again, ignore it.
        var voterHasScannedPreferencesReceipt = readbackSession.getScannedPreferencesReceipt();
        if (voterHasScannedPreferencesReceipt) {
          return;
        }

        var serialNumber = qrData[3];
        if (scannedSerialNumber != serialNumber) {
          if (typeof QR3 === 'object' && QR3 != null && typeof QR3.start === 'function') {
            QR3.stop();
          }
          alertCodesDontMatch();
          return;
        }
        readPreferenceList(qrData);
        if (typeof QR3 === 'object' && QR3 != null && typeof QR3.start === 'function') {
          QR3.stop();
        }

        var clips = [ ['alert_scanned_okay'] ];
        var instructions = new AudioInstructions(clips, false, true, null);
        var container = getContainer();
        var audioController = container.Resolve("audioController");
        audioController.playAudioInstructions(instructions);
        
        return;
        
      } else {

        // If the QR code is being scanned again, ignore it.
        var voterHasScannedCandidateSlip = readbackSession.getScannedCandidateSlip();
        if (voterHasScannedCandidateSlip) {
          return;
        }

        var serialNumber = qrData[2];
        if (scannedSerialNumber != serialNumber) {
          if (typeof QR3 === 'object' && QR3 != null && typeof QR3.start === 'function') {
            QR3.stop();
          }
          alertCodesDontMatch();
          return;
        }

        readCandidateList(qrData);
      }
    } catch (error) {
      showInvalidQrAlert();
      return;
    }

    // Perform QR code checks.
    checkCandidateSlipQrCode(serialNumber);
    if (typeof QR3 === 'object' && QR3 != null && typeof QR3.start === 'function') {
      QR3.stop();
    }

    var clips = [ ['alert_scanned_okay'] ];
    var instructions = new AudioInstructions(clips, false, true, null);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  }
}

// TODO: Replace this with servlet call code.

// Alert the voter if they scanned two slips of paper that don't match.
function alertCodesDontMatch () {

  var callback1 = function () {
    // this setInterval is a safe measure, so we don't call flash function before it is loaded;
    var registerQRCb3 = setInterval(function() {

      if (typeof QR3 === 'object' && QR3 != null && typeof QR3.start === 'function') {
        clearInterval(registerQRCb3);
        // first param is the function signature we want the SWF to call periodicaly
        // second param is the intervall we want it, in miliseconds (default: half-second)
        // third is an signature for callback if something goes wrong, aka, user has no Webcam (default: null)
        QR3.start( "scanSecondHalf", 20, "noWebcam" );
      }
    }, 20);
  }

  var clips = ['error_matching_candidate_preferences'];
  var instructions = new AudioInstructions(clips, true, true, callback1);
  
  var container = getContainer();
  var audioController = container.Resolve("audioController");
  audioController.playAudioInstructions(instructions);
}