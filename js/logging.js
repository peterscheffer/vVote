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
 *  Function to attach listeners to elements that log events whenever the user triggers them.  
 *  Purely for development and testing purposes.  Must be removed from the production system.
 * 
 * @author Peter Scheffer
 */

var useLogging = false;

var loggingMessages = new Array();
var propagatingMap = new Array();
var counter = 1;
var sessionID = Math.floor((Math.random()*100000000000));
var laBallotAttached = false;
var lcBallotAttached = false;

function resetLogging () {
  if (useLogging) {
    counter = 1;
    sessionID = Math.floor((Math.random()*100000000000));
    laBallotAttached = false;
    lcBallotAttached = false;
  }
}

function attachLoggingHandlersToLABallot () {

  if (!useLogging || laBallotAttached) {
    return;
  }

  var listOfLoggedElements = 
    [
      ['ballot_option_1','screen=LA&action=BallotOption1'],
      ['ballot_option_2','screen=LA&action=BallotOption2'],
      ['ballot_option_3','screen=LA&action=BallotOption3'],
      ['ballot_option_4','screen=LA&action=BallotOption4'],
      ['ballot_option_5','screen=LA&action=BallotOption5'],
      ['ballot_option_6','screen=LA&action=BallotOption6'],
    ];

  // Attach click event handlers to all of the elements of interest.
  for (var index = 0; index < listOfLoggedElements.length; index++) {
    var elementId = listOfLoggedElements[index][0];
    var message = listOfLoggedElements[index][1];
    var element = document.getElementById(elementId);
    loggingMessages[elementId] = message;
    
    if (element != null) {
      element.addEventListener('click', function(e) {
        var elementId = e.srcElement.id;
        var message = loggingMessages[elementId] + "&counter=" + counter++ + "&session=" + sessionID;
        if (message != null) {
          logThis(message);
        }
      }, false);
    }
  }  
  
  laBallotAttached = true;
}

function attachLoggingHandlersToLCBallot () {

  if (!useLogging || lcBallotAttached) {
    return;
  }

  var listOfLoggedElements = 
    [
      ['ballot_groups_content_1','screen=LC&action=GroupsBallotOption1'],
      ['ballot_groups_content_2','screen=LC&action=GroupsBallotOption2'],
      ['ballot_groups_content_3','screen=LC&action=GroupsBallotOption3'],
      ['ballot_groups_content_4','screen=LC&action=GroupsBallotOption4'],
      ['ballot_groups_content_5','screen=LC&action=GroupsBallotOption5'],
      ['ballot_groups_content_6','screen=LC&action=GroupsBallotOption6'],
      ['council_candidate_ballot_option_1','screen=LC&action=CandidatesBallotOption1'],
      ['council_candidate_ballot_option_2','screen=LC&action=CandidatesBallotOption2'],
      ['council_candidate_ballot_option_3','screen=LC&action=CandidatesBallotOption3'],
      ['council_candidate_ballot_option_4','screen=LC&action=CandidatesBallotOption4'],
      ['council_candidate_ballot_option_5','screen=LC&action=CandidatesBallotOption5'],
      ['council_candidate_ballot_option_6','screen=LC&action=CandidatesBallotOption6'],
      ['council_candidate_ballot_option_7','screen=LC&action=CandidatesBallotOption7'],
      ['council_candidate_ballot_option_8','screen=LC&action=CandidatesBallotOption8'],
      ['council_candidate_ballot_option_9','screen=LC&action=CandidatesBallotOption9'],
      ['council_candidate_ballot_option_10','screen=LC&action=CandidatesBallotOption10'],
      ['council_candidate_ballot_option_11','screen=LC&action=CandidatesBallotOption11'],
      ['council_candidate_ballot_option_12','screen=LC&action=CandidatesBallotOption12'],
      ['council_candidate_ballot_option_13','screen=LC&action=CandidatesBallotOption13'],
      ['council_candidate_ballot_option_14','screen=LC&action=CandidatesBallotOption14'],
      ['council_candidate_ballot_option_15','screen=LC&action=CandidatesBallotOption15'],
      ['council_candidate_ballot_option_16','screen=LC&action=CandidatesBallotOption16'],
      ['council_candidate_ballot_option_17','screen=LC&action=CandidatesBallotOption17'],
      ['council_candidate_ballot_option_18','screen=LC&action=CandidatesBallotOption18'],
      ['council_candidate_ballot_option_19','screen=LC&action=CandidatesBallotOption19'],
      ['council_candidate_ballot_option_20','screen=LC&action=CandidatesBallotOption20'],
      ['council_candidate_ballot_option_21','screen=LC&action=CandidatesBallotOption21']
    ];

  // Attach click event handlers to all of the elements of interest.
  for (var index = 0; index < listOfLoggedElements.length; index++) {
    var elementId = listOfLoggedElements[index][0];
    var message = listOfLoggedElements[index][1];
    var element = document.getElementById(elementId);
    loggingMessages[elementId] = message;
    
    if (element != null) {
      element.addEventListener('click', function(e) {
        var elementId = e.srcElement.id;
        var message = loggingMessages[elementId] + "&counter=" + counter++ + "&session=" + sessionID;
        if (message != null) {
          logThis(message);
        }
      }, false);
    }
  }  

  lcBallotAttached = true;
}

function attachLoggingHandlers () {

  if (!useLogging) {
    return;
  }

  var listOfLoggedElements = 
    [
      ['start_button','screen=Start&action=Start'],
      ['assembly_screen_next_button','screen=LA&action=Next'], 
      ['assembly_screen_back_button','screen=LA&action=Back'], 
      ['assembly_screen_help_button','screen=LA&action=Help'],
      ['assembly_screen_undo_button','screen=LA&action=Undo'],
      ['assembly_screen_quit_button','screen=LA&action=Quit'],
      ['council_screen_next_button','screen=LC&action=Next'], 
      ['council_screen_back_button','screen=LC&action=Back'], 
      ['council_screen_help_button','screen=LC&action=Help'],
      ['council_screen_undo_button','screen=LC&action=Undo'],
      ['council_screen_quit_button','screen=LC&action=Quit'],
      ['atl_button_div','screen=LC&action=SelectATL'],
      ['btl_button_div','screen=LC&action=SelectBTL'],
      ['confirm_submit_button','screen=Confirmation&action=SendVotes'],
      ['submit_button','screen=Confirmation&action=UserConfirmedSendVotes'],
      ['dont_submit_button','screen=Confirmation&action=UserDidntSendVotes'],
      ['review_btn_correct','screen=ReviewReceiptPrintout&action=UserContinued'],
      ['review_btn_help','screen=ReviewReceiptPrintout&action=Help'],
      ['print_receipt_next_button','screen=ReceiptInstructions&action=FinishVoting'],
      ['large_text_size_option','screen=Start&action=LargeSizedText'],
      ['medium_text_size_option','screen=Start&action=MediumSizedText'],
      ['small_text_size_option','screen=Start&action=SmallSizedText'],
      ['black_on_white_option','screen=Start&action=BlackOnWhiteText'],
      ['white_on_black_option','screen=Start&action=WhiteOnBlackText'],
      ['color_option','screen=Start&action=ColourText'],
      ['language_arabic','screen=Start&action=ArabicLanguage'],
      ['language_chinese','screen=Start&action=ChineseLanguage'],
      ['language_english','screen=Start&action=EnglishLanguage'],
      ['audio_switch_button','screen=Start&action=AudioToggled'],
      ['quit_yes_button','screen=LA&action=UserHasQuit'],
      ['quit_no_button','screen=LA&action=UserDidntQuit'],
      ['warning_modal_proceed_button','screen=unknown&action=ProceedAnyway'],
      ['warning_modal_back_button','screen=unknown&action=ReturnFromIncompleteWarning'],
      ['help_modal_back_button','screen=unknown&action=ReturnFromHelp'],
      ['help_modal_help_button','screen=unknown&action=SecondaryHelp'],
      ['more_help_modal_back_button','screen=unknown&action=ReturnFromSecondaryHelp'],
      ['more_help_modal_help_button','screen=unknown&action=TertiaryHelp'],
      ['other_help_modal_back_button','screen=unknown&action=ReturnFromTertiaryHelp'],
      ['video_instructions_button','screen=unknown&action=ReplayVideo'],
      ['submit_incomplete_button','screen=unknown&action=IncompleteVoteHelp'],
      ['htvc_button','screen=unknown&action=HTVCHelp'],
      ['paper_voting_button','screen=unknown&action=PaperVotingHelp'],
      ['confirmation_modal_proceed_button','screen=LC&action=UserProceededToOtherSection'],
      ['confirmation_modal_back_button','screen=LC&action=UserDidntProceededToOtherSection']
    ];
  
  // Some embedded elements intercept the click event. This array maps propagation of click events from the embedded to the parent.
  var listOfPropagatingElements = 
    [['assembly_screen_next_button','assembly_screen_next_button'],
    ['audio_switch_button_off', 'audio_switch_button'],
    ['council_screen_next_button','council_screen_next_button'],
    ['atl_button_title','atl_button_div'],
    ['btl_button_title','btl_button_div']];
  
  // Attach click event handlers to all of the elements of interest.
  for (var index = 0; index < listOfLoggedElements.length; index++) {
    var elementId = listOfLoggedElements[index][0];
    var message = listOfLoggedElements[index][1];
    var element = document.getElementById(elementId);
    loggingMessages[elementId] = message;
    
    if (element != null) {
      element.addEventListener('click', function(e) {
        var elementId = e.srcElement.id;
        var message = loggingMessages[elementId] + "&counter=" + counter++ + "&session=" + sessionID;
        if (message != null) {
          logThis(message);
        }
      }, false);
    }
  }  
  
  // Attach propagating click event handlers to all of the intercepting elements of non-interest.
  for (var index = 0; index < listOfPropagatingElements.length; index++) {
    var elementId1 = listOfPropagatingElements[index][0];
    var elementId2 = listOfPropagatingElements[index][1];
    var element = document.getElementById(elementId1);
    propagatingMap[elementId1] = elementId2;

    if (element != null) {
      element.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var elementId = e.srcElement.id;
        var propagateToElementId = propagatingMap[elementId];
        document.getElementById(propagateToElementId).click();
      }, false);
    }
  }  
}

function logThis (msg) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost/logEvent?' + msg,
    data: '',
    dataType: 'text',
    success: null,
    failure: null
  });
}