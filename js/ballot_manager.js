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
 *  BallotManager is responsible for driving the state of each of the Ballots. 
 *  It is utilised via the Command pattern - requests are sent   
 *  to the BallotManager via the execute() function, and a callback is 
 *  called immediately after the command is executed, with the response from the 
 *  command sent to the callback function, along with any errors that occur.
 *
 *  Ballot subclasses are all expected to implement the same interface (superclass Ballot),   
 *  since the BallotManager operates as a Delegate, passing on function calls to  
 *  each specific Ballot according to name.
 * 
 * @author Peter Scheffer
 */

var BallotManager = Class.extend({
  init: function () {
    this.groupChanged = false;
    this.lastButtonTime = null;
  },
  
  // Flag to indicate whether the user navigated to a different group.
  groupHasChanged: function () {
    return this.groupChanged;
  },
  
  // Navigate to the next logical candidate in the ballot 
  // according to the ballot's internal navigation.
  moveToNextCandidate: function (ballot){
    if (ballot == null) {
      new Error(NULL_POINTER_EXCEPTION);
    }

    this.groupChanged = false;
    var candidate = ballot.moveToNextCandidate();
    return candidate;
  },

  // Navigate to the previous logical candidate in the ballot 
  // according to the ballot's internal navigation.
  moveToPreviousCandidate: function (ballot){
  
    if (ballot == null) {
      new Error(NULL_POINTER_EXCEPTION);
    }

    this.groupChanged = false;
    var candidate = ballot.moveToPreviousCandidate();
    return candidate;
  },

  // Navigate to the next logical group and the first candidate in  
  // the group in the ballot according to the ballot's internal navigation.
  moveToNextGroupCandidate: function (ballot){
  
    if (ballot == null) {
      new Error(NULL_POINTER_EXCEPTION);
    }

    this.groupChanged = true;
    var group = ballot.moveToNextGroup();
    var candidates = group.getCandidates();
    return candidates[0];
  },

  // Navigate to the previous logical group and the first candidate in  
  // the group in the ballot according to the ballot's internal navigation.
  moveToPreviousGroupCandidate: function (ballot){
  
    if (ballot == null) {
      new Error(NULL_POINTER_EXCEPTION);
    }

    this.groupChanged = true;
    var group = ballot.moveToPreviousGroup();
    var candidates = group.getCandidates();
    return candidates[0];
  },
  
  // Navigate the user to the last candidate (or group) they selected.
  moveToLastSelectedCandidate: function (ballot) {
    ballot.goToLastSelectedCandidate();
  },

  // Navigate to the next logical group in the ballot according to 
  // the ballot's internal navigation.
  moveToNextGroup: function (ballot){
  
    if (ballot == null) {
      new Error(NULL_POINTER_EXCEPTION);
    }

    var group = ballot.moveToNextGroup();
    return group;
  },

  // Navigate to the previous logical group in the ballot according to 
  // the ballot's internal navigation.
  moveToPreviousGroup: function (ballot){
  
    if (ballot == null) {
      new Error(NULL_POINTER_EXCEPTION);
    }

    var group = ballot.moveToPreviousGroup();
    return group;
  },

  // Tell the user that their gesture caused no action (no model updates occur.)
  showUnavailableOption: function (ballot) {
    return ballot;
  },

  // Select the candidate that has been navigated to by the user  
  // according to the ballot's internal navigation.
  selectCandidate: function (ballot) {

    var container = getContainer();
    if (ballot == null) {
      throw new Error(NULL_POINTER_EXCEPTION);
    }

    if (ballot.getType() == LEGISLATIVE_COUNCIL_GROUP_BALLOT) {

      var aboveTheLineCouncilBallot = container.Resolve("atl");
      var currentGroup = aboveTheLineCouncilBallot.getCurrentGroup();
      if (currentGroup.getHasBallotBox() == false) {
        return;
      }
      
      if (aboveTheLineCouncilBallot.isAlreadySelected(currentGroup)) {
        aboveTheLineCouncilBallot.unselectGroup(currentGroup);
        return currentGroup;
      } else {
        aboveTheLineCouncilBallot.selectGroup(currentGroup);
        return currentGroup;
      }
      
    } else if (ballot.getType() == LEGISLATIVE_ASSEMBLY_BALLOT || 
               ballot.getType() == LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT) {
      var currentCandidate = ballot.getCurrentCandidate();
      if (ballot.isAlreadySelected(currentCandidate)) {
        if (ballot.isLastCandidateSelection(currentCandidate)) {
          ballot.unselectCurrentCandidate(currentCandidate);
          return currentCandidate;
        } else {
          throw new Error(CANDIDATE_ALREADY_SELECTED);
        }
      } else {
        ballot.selectCurrentCandidate();
        return currentCandidate;
      }
    } else {
      throw new Error(UNRECOGNISED_BALLOT);
    }
  },
  
  // Tell the user that their gesture caused no action (no model updates occur.)
  unavailableOption: function (ballot) {
    return ballot;
  },
  
  getHighestCandidateBallotBoxId: function (ballot) {

    var ballotBoxId = null;
  
    if (ballot == LEGISLATIVE_COUNCIL_GROUP_BALLOT) {
      var aboveTheLineCouncilBallot = container.Resolve("atl");
      var currentlySelected = aboveTheLineCouncilBallot.getSelection();
      ballotBoxId = currentlySelected.getBallotBoxId();
    
    } else if (ballot == LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT) {
      var belowTheLineCouncilBallot = container.Resolve("btl");
      var candidate = belowTheLineCouncilBallot.getLastSelectedCandidate();
      ballotBoxId = candidate.getBallotBoxId();
    
    } else if (ballot == LEGISLATIVE_ASSEMBLY_BALLOT) {
      var legislativeAssemblyBallot = container.Resolve("assembly");
      var candidate = legislativeAssemblyBallot.getLastSelectedCandidate();
      ballotBoxId = candidate.getBallotBoxId();
    }
    
    return ballotBoxId;
  },
  
  // Undo user action on ballot paper.  If they selected an option, unselect it.  
  undoAction: function(ballot) {
    
    var container = getContainer();
    var visualView = container.Resolve("visualView");
 
    if (ballot == LEGISLATIVE_COUNCIL_GROUP_BALLOT) {
      var aboveTheLineCouncilBallot = container.Resolve("atl");
      var currentlySelected = aboveTheLineCouncilBallot.getSelection();
      if (currentlySelected != null) {
        var selectionNumber = aboveTheLineCouncilBallot.getBallotSelectionNumber(currentlySelected);
        visualView.setBallotSelectionNumber(currentlySelected, null);
        aboveTheLineCouncilBallot.unselectGroup();
      }
      
    } else if (ballot == LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT) {
      var belowTheLineCouncilBallot = container.Resolve("btl");
      var candidate = belowTheLineCouncilBallot.getLastSelectedCandidate();
      if (candidate != null) {
        visualView.setBallotSelectionNumber(candidate, null);
        belowTheLineCouncilBallot.unselectLastCandidate();
      }
      
    } else if (ballot == LEGISLATIVE_ASSEMBLY_BALLOT) {
      var legislativeAssemblyBallot = container.Resolve("assembly");
      var candidate = legislativeAssemblyBallot.getLastSelectedCandidate();
      if (candidate != null) {
        visualView.setBallotSelectionNumber(candidate, null);
        legislativeAssemblyBallot.unselectLastCandidate();
      }
    } else {
      throw new Error(UNRECOGNISED_BALLOT);
    }
  },
  
  // Select or unselect the currently navigated candidate or group
  // according to the ballot's internal navigation, or whichever ballot box
  // the user pressed on the screen.
  ballotOptionPressed: function(ballot, selection) {

    // debounce code for all of the ballot boxes.
    var currentButtonPressTime = new Date().getTime();

    if (this.lastButtonTime == null) {
      this.lastButtonTime = currentButtonPressTime;
    } else {
      var minimumButtonPressInterval = 200;
      if ((currentButtonPressTime - this.lastButtonTime) < minimumButtonPressInterval) {
        this.lastButtonTime = currentButtonPressTime;
        return;
      } else {
        this.lastButtonTime = currentButtonPressTime;
      }
    }

    this.lastButton = selection;

    var container = getContainer();
    var visualView = container.Resolve("visualView");

    if (ballot == LEGISLATIVE_COUNCIL_GROUP_BALLOT) {
      
      var aboveTheLineCouncilBallot = container.Resolve("atl");
      var currentlySelected = aboveTheLineCouncilBallot.getSelection();
      if (currentlySelected != null) {
        var selectionNumber = aboveTheLineCouncilBallot.getBallotSelectionNumber(currentlySelected);
        visualView.setBallotSelectionNumber(currentlySelected, null);
      }
      
      aboveTheLineCouncilBallot.ballotOptionPressed(selection);
      var group = aboveTheLineCouncilBallot.getGroupByBallotId(selection);
      if (aboveTheLineCouncilBallot.isSelected(group)) {
        visualView.setBallotSelectionNumber(group, 1);
      } else {
        visualView.setBallotSelectionNumber(group, null);
      }
      
    } else if (ballot == LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT) {

      var belowTheLineCouncilBallot = container.Resolve("btl");
      belowTheLineCouncilBallot.ballotOptionPressed(selection);
      var candidate = belowTheLineCouncilBallot.getCandidateByBallotId(selection);
      var selectionNumber = belowTheLineCouncilBallot.getBallotSelectionNumber(candidate);
      visualView.setBallotSelectionNumber(candidate, selectionNumber);

    } else if (ballot == LEGISLATIVE_ASSEMBLY_BALLOT) {

      var legislativeAssemblyBallot = container.Resolve("assembly");
      legislativeAssemblyBallot.ballotOptionPressed(selection);
      var candidate = legislativeAssemblyBallot.getCandidateByBallotId(selection);
      var selectionNumber = legislativeAssemblyBallot.getBallotSelectionNumber(candidate);
      visualView.setBallotSelectionNumber(candidate, selectionNumber);

    } else {
      throw new Error(UNRECOGNISED_BALLOT);
    }  
  },  

  // Swap two candidate preference selections in the UI.
  ballotOptionSwapped: function(ballot, selection1, selection2) {
    
    var container = getContainer();
    var visualView = container.Resolve("visualView");

    ballot.ballotOptionSwapped(selection1, selection2);    
    if (ballot.getType() == LEGISLATIVE_COUNCIL_GROUP_BALLOT) {
      var group1 = ballot.getGroupByBallotId(selection1);
      var group2 = ballot.getGroupByBallotId(selection2);
      
      var group1 = ballot.getGroupByBallotId(selection1);
      try {
        var selectionNumber = ballot.getBallotSelectionNumber(group1);
        visualView.setBallotSelectionNumber(group1, selectionNumber);
      } catch (error) {
        visualView.setBallotSelectionNumber(group1, null);
      }

      var group2 = ballot.getGroupByBallotId(selection2);
      try {
        var selectionNumber = ballot.getBallotSelectionNumber(group2);
        visualView.setBallotSelectionNumber(group2, selectionNumber);
      } catch (error) {
        visualView.setBallotSelectionNumber(group2, null);
      }
      
    } else if (ballot.getType() == LEGISLATIVE_ASSEMBLY_BALLOT ||
               ballot.getType() == LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT) {

      var candidate1 = ballot.getCandidateByBallotId(selection1);
      try {
        var selectionNumber = ballot.getBallotSelectionNumber(candidate1);
        visualView.setBallotSelectionNumber(candidate1, selectionNumber);
      } catch (error) {
        visualView.setBallotSelectionNumber(candidate1, null);
      }

      var candidate2 = ballot.getCandidateByBallotId(selection2);
      try {
        var selectionNumber = ballot.getBallotSelectionNumber(candidate2);
        visualView.setBallotSelectionNumber(candidate2, selectionNumber);
      } catch (error) {
        visualView.setBallotSelectionNumber(candidate2, null);
      }
    } else {
      throw new Error(UNRECOGNISED_BALLOT);
    }
  },

  // Execute a Command that calls one of this class's methods and then 
  // calls the callback defined in the command.
  execute : function (command){
    try {
      var response = this[command.request](command.data);      
      
      command.callback(response, null, command.data);
      
    } catch (exception) {
      if (exception.message == LAST_CANDIDATE_EXCEPTION ||
          exception.message == FIRST_CANDIDATE_EXCEPTION ||
          exception.message == LAST_GROUP_EXCEPTION ||
          exception.message == FIRST_GROUP_EXCEPTION ||
          exception.message == MAXIMUM_GROUPS_SELECTED ||
          exception.message == MAXIMUM_CANDIDATES_SELECTED ||
          exception.message == CANDIDATE_ALREADY_SELECTED) {

        // Call the callback that can then handle the exception.
        command.callback(response, exception, command.data);
        
      } else {
        console.log(exception);
      }
    }
  }
});