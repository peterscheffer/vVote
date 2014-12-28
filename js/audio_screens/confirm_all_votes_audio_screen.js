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
 * ConfirmAllVotesAudioScreen - The audio screen class for the confirm all votes screen for the blind interface.
 * 
 * @author Peter Scheffer
 */

var ConfirmAllVotesAudioScreen = AudioScreen.extend({  
  init: function () {
    this._super();
  },
  
  initialEntry: function () {

    // At the end of playing nav gestures, repeat.
    var callback1 = function () {
      var container = getContainer();
      var audioController = container.Resolve("audioController");    
      audioController.repeatInstructionsTimeout = window.setTimeout(function () { audioController.repeatInstructions(); }, 5000);
    };

    var clips = [ ['confirm_all_votes_screen'] ];
    var instructions = new AudioInstructions(clips, true, true, callback1);
    var container = getContainer();
    var audioController = container.Resolve("audioController");
    audioController.playAudioInstructions(instructions);
  },
  
  submitVote: function () {

    var request = jsonifyVote();
    var submitVoteMessage = "msg=" + encodeURIComponent(request);
    var submitURL = "http://localhost:8060/servlet/MBBProxy";

    $.ajax({
      type: 'POST',
      timeout: MBB_TIMEOUT,
      url: submitURL,
      data: submitVoteMessage,
      success: this.printBallot,
      error: playGvsSubmitFailureAlert
    });
  },
  
  printBallot: function (response) {

    var error = response["ERROR"];
    if (error != null && error != "") {
      playGvsSubmitFailureAlert();
      return;
      
    } else {

      var confirmationSignature = response["sigs"];
      
      var container = getContainer();
      var votingSession = container.Resolve("votingSession");
      votingSession.setConfirmationSignature(confirmationSignature);

      var audioScreenManager = container.Resolve("audioScreenManager");
      var audioController = container.Resolve("audioController");
      
      audioScreenManager.execute({ 
        request: 'enterScreen', 
        data: 'print_receipt_screen', 
        callback: audioController.enterBlindUiScreen 
      });
    }
  }
}); 
