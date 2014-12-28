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
 * Below The Line Council Ballot class.  This class is responsible for maintaining the data and state of the ballot.
 * The Council Ballot can be voted either "above the line" or "below the line".  
 * A below the line vote requires multiple selections of candidates.  
 * A group is made up of multiple parties.  A party is made up of multiple candidates.
 * 
 * @author Peter Scheffer
 */
 
var BelowTheLineCouncilBallot = Ballot.extend({

  init: function () {

    this.ballotType = LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT;

    // Record whether the user has visited this ballot.  
    this.hasVisited = false;
  
    // Record of the number of preferences selections that the user has made in this ballot.
    this.highestSelectionCounter = 0;
    
    // Position of user in the current group listing of candidates.
    this.currentCandidatePosition = 0;
    
    // Position of user in the current ballot listing of groups.
    this.currentGroupPosition = 1;
    
    // List of selections made on this ballot.
    this.ballotSelections = new Array();
  },

  clear : function() {
    this.ballotSelections = new Array();
    this.highestSelectionCounter = 0;
    this.reset();
  },
  
  reset : function() {
    this.ballotSelections = new Array();
    this.highestSelectionCounter = 0;
    this.currentCandidatePosition = 0;
    this.currentGroupPosition = 1;  
    this.hasVisited = false;
  },
  
  resetCurrentCandidatePosition: function () {
    this.currentGroupPosition = 1;
    this.currentCandidatePosition = 0;
  },
  
  setVisited: function (visited) {
    this.hasVisited = visited;
  },
 
  getVisited: function () {
    return this.hasVisited;
  },

  getShuffleOrder: function () {
    return this.shuffleOrder;
  },  

  setShuffleOrder: function (shuffleOrder) {
    this.shuffleOrder = shuffleOrder;
  },
  
  setCandidateNominations: function (data) {
    this.candidateListing = data;

    // List of individual candidates according to their ballot box representation in the application.
    this.partyCandidateBallotBoxes = new Array();
    
    // List of ballot boxes retrieved according to candidate name.
    this.partyCandidateSelections = new Array();

    // List of individual candidates and the party they are representing according to the candidate name.
    this.candidates = new Array();    
    
    // List of parties and their candidates according to the party name.
    this.partyGroups = new Array();
    
    // List of parties for each candidate according to candidate name.
    this.candidateParties = new Array();
    
    // List of candidates for each grouping.
    this.groupCandidates = new Array();

    this.candidateCount = 0;

    // Process candidate data into object lists.
    for (var index = 0; index < data.length; index++) {
      var partyData = data[index];
      var partyName = partyData["preferredName"];
      var partyId = partyData["id"];
      var hasBallotBox = partyData["hasBallotBox"];
      var audioFileName = partyData["audio"];
      var groupBallotPosition = partyData["groupBallotPosition"];
      var ungrouped = partyData["ungrouped"];
      var ballotBoxLetter = partyData['ballotBoxLetter'];

      var partyGroup = new PartyGroup(partyId,
                                      partyName,
                                      hasBallotBox,
                                      audioFileName,
                                      ballotBoxLetter,
                                      groupBallotPosition);

      this.partyGroups[groupBallotPosition] = partyGroup;

      var candidates = partyData["candidates"];
      for (var index2 = 0; index2 < candidates.length; index2++) {
        var candidateData = candidates[index2];

        // Instantiate a Candidate object using JSON data.
        var candidate = new CouncilCandidate(
          candidateData['id'],
      	  candidateData['name'],
      	  candidateData["partyName"], 
      	  partyData["id"],
      	  partyData['groupBallotPosition'], 
      	  candidateData['ballotSequence'], 
          candidateData['ballotPosition'], 
      	  candidateData['audio'],
      	  candidateData['region']);

        // We must use id here in place of ballotPosition, because ballotPosition is relative for each group.
        // zero based index of BTL candidates.
        var ballotPosition = candidateData['ballotPosition'];
        this.candidates[ballotPosition - 1] = candidate;
        this.candidateParties[candidate.getName()] = candidate.getPartyName();
        this.partyCandidateBallotBoxes[candidate.getBallotBoxId()] = candidate;
        this.candidateCount++;

        var partyGroupID = candidate.getPartyGroupID();
        var partyGroup;
      
        partyGroup = this.getPartyGroup(partyGroupID);
        partyGroup.addCandidate(candidate);
      }
    }
  },
  
  getCandidates: function() {
    return this.candidates;
  },
  
  getNumberOfCandidates: function () {
    return this.candidateCount;
  },
  
  // Retrieve candidate according to the shuffle order defined on the ballot receipt.  
  getCandidatesInShuffleOrder: function(index) {
  
    var btlShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      btlShuffleOrderArray[index2] = Number(this.shuffleOrder.substring(index1, index1+2));
      index2++;
    }

    var candidates = new Array();
    for (var index = 0; index < this.candidates.length; index++) {
      var shuffledIndex = btlShuffleOrderArray[index];
      candidates[index] = this.candidates[shuffledIndex];
    }
     
    return candidates;
  },
  
  getPartyGroups: function () {
    return this.partyGroups;
  },
  
  getUngroupedPartyGroup: function () {
    return this.ungroupedPartyGroup;
  },
  
  // The highest selection counter keeps record of how many preference selections the user has made in this ballot.
  getHighestSelection: function() {
    return this.highestSelectionCounter;
  },
  
  // Increase the number of preference selections the user has made.
  incrementHighestSelectionCounter: function() {
    this.highestSelectionCounter++;
  },
  
  // Decrease the number of preference selections the user has made.
  decrementHighestSelectionCounter: function() {
    if (this.highestSelectionCounter >= 0) {
      this.highestSelectionCounter--;
    }
  },
  
  // Retrieve a candidate by ordinal according to listing in candidates array.
  getCandidateByIndex: function(index) {
    return this.candidates[index];
  },

  // Retrieve candidate according to the shuffle order defined on the ballot receipt.  
  getCandidateByShuffleOrder: function(index) {
    
    var councilShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      councilShuffleOrderArray[index2] = Number(this.shuffleOrder.substring(index1, index1+2));
      index2++;
    }

    var shuffledIndex = councilShuffleOrderArray[index];
    var candidate = this.getCandidateByIndex(shuffledIndex);
    return candidate;
  },
    
  // Retrieve a candidate according to the ballot box ID they have been assigned.
  getCandidateByBallotId: function(ballotBoxId) {
    return this.partyCandidateBallotBoxes[ballotBoxId];
  },
  
  // Retrieve the current group the user has selected.
  getCurrentGroup: function() {
    return this.partyGroups[this.currentGroupPosition];
  },
  
  // Retrieve a party group by name from the list of party groups.
  getPartyGroup: function(partyGroupID) {
    for (var index = 1; index <= this.partyGroups.length; index++) {
      var group = this.partyGroups[index];
      if (group == null) {
        continue;
      }
      
      if (group.getId() == partyGroupID) {
        return group;
      }
    }
  },
  
  // List of candidates by group.
  getCandidatesForGroup: function(groupID) {
    if (groupID == null || this.getPartyGroup(groupID) == undefined) {
      throw new Error("Group ID is not available in the list of ballot groups");
    } else {
      var group = this.getPartyGroup(groupID);
      var candidates = group.getCandidates();

      return candidates;
    }
  },

  getCandidatesInLegalOrder: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();
    
    var candidatesArray = new Array();
    var candidateCount = 0;
    for (var partyGroupIndex = 1; partyGroupIndex <= maxCouncilGroups; partyGroupIndex++) {
      var groupCandidate = this.partyGroups[partyGroupIndex];
      var candidates = groupCandidate.getCandidates();
      for (var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++) {
        var candidate = candidates[candidateIndex];
        candidatesArray[candidateCount++] = candidate;
      }
    }

    var ungrouped = this.getUngroupedPartyGroup();
    if (ungrouped != null && ungrouped.getCandidateCount() > 0) {
      var candidates = ungrouped.getCandidates();
      for (var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++) {
        var candidate = candidates[candidateIndex];
        candidatesArray[candidateCount++] = candidate;
      }
    }
    
    return candidatesArray;
  },
  
  // Deprecated: Compare Candidates by their assigned ID to ensure they appear in the ballot in the correct order.
  compareCandidates: function(a,b) {
    if (a.id < b.id) {
       return -1;
    }
    
    if (a.id > b.id) {
      return 1;
    }
    
    return 0;
  },
  
  // Move down to next candidate in group. Used in the blind navigation UI.
  moveToNextCandidate: function () {
    var group = this.getCurrentGroup();
    var candidates = this.getCandidatesForGroup(group.getId());

    if (this.currentCandidatePosition < candidates.length-1) {
      this.currentCandidatePosition++;
      var candidate = candidates[this.currentCandidatePosition];
      return candidate;
    } else {
      throw new Error(LAST_CANDIDATE_EXCEPTION);
    }
  },
  
  // Move up to previous candidate in group. Used in the blind navigation UI.
  moveToPreviousCandidate: function () {
    var group = this.getCurrentGroup();
    var candidates = this.getCandidatesForGroup(group.getId());
    if (this.currentCandidatePosition > 0) {
      this.currentCandidatePosition--;
      var candidate = candidates[this.currentCandidatePosition];
      return candidate;
    } else {
      throw new Error(FIRST_CANDIDATE_EXCEPTION);
    }
  },
  
  // Move right to next group in ballot. Returns the group. Used in the blind navigation UI.
  moveToNextGroup: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();
    
    if (this.currentGroupPosition < maxCouncilGroups) {
      this.currentGroupPosition++;
      this.currentCandidatePosition = 0;
      var group = this.partyGroups[this.currentGroupPosition];
      return group;
    } else {
      throw new Error(LAST_GROUP_EXCEPTION);
    }
  },
  
  // Move left to previous group in ballot. Returns the group. Used in the blind navigation UI.
  moveToPreviousGroup: function () {
    
    if (this.currentGroupPosition > 1) {
      this.currentGroupPosition--;
      this.currentCandidatePosition = 0;
      var group = this.partyGroups[this.currentGroupPosition];
      return group;
    } else {
      throw new Error(FIRST_GROUP_EXCEPTION);
    }
  },

  // Select the specified candidate at the current highest selection counter.
  selectCandidate: function (candidate) {
  
    if (this.ballotSelections[this.highestSelectionCounter-1] != candidate) {
      this.ballotSelections[this.highestSelectionCounter] = candidate;
      this.highestSelectionCounter++;
    }
  },
  
  // Select the current candidate. Used in the blind navigation UI.
  selectCurrentCandidate: function () {
    var currentGroup = this.getCurrentGroup();
    var candidatesForGroup = this.getCandidatesForGroup(currentGroup.getId());
    var currentCandidate = candidatesForGroup[this.currentCandidatePosition];
    this.selectCandidate(currentCandidate);
    
    return currentCandidate;
  },
  
  getCurrentCandidate: function () {
    var currentGroup = this.getCurrentGroup();
    var candidatesForGroup = this.getCandidatesForGroup(currentGroup.getId());
    var currentCandidate = candidatesForGroup[this.currentCandidatePosition];
    return currentCandidate;
  },

  // Set the preference selection for this specific candidate.
  setBallotSelection: function (candidate, index) {
    this.ballotSelections[index-1] = candidate;  
  },
  
  // Unselect a candidate. Only the last selected candidate can be unselected.
  unselectCandidate: function (candidate) {    
    if (this.ballotSelections[this.highestSelectionCounter-1] == candidate) {
      this.highestSelectionCounter--;
      this.ballotSelections[this.highestSelectionCounter] = null;
    }
  },

  // Unselect the most recently selected candidate.  
  unselectLastCandidate: function () {
    if (this.highestSelectionCounter > 0) {
      this.highestSelectionCounter--;
      this.ballotSelections[this.highestSelectionCounter] = null;
    }
  },

  // Remove selection for the current candidate. Used in the blind navigation UI.
  unselectCurrentCandidate: function () {
    var currentGroup = this.getCurrentGroup();
    var candidatesForGroup = this.getCandidatesForGroup(currentGroup.getId());
    var currentCandidate = candidatesForGroup[this.currentCandidatePosition];
    
    if (this.ballotSelections[this.highestSelectionCounter-1] == currentCandidate) {
      this.highestSelectionCounter--;
      this.ballotSelections[this.highestSelectionCounter] = null;
    } else {
      throw new Error("You can only remove selection for the last selected candidate.");
    }
    
    return currentCandidate;
  },
  
  // Swap the preference selection order for two candidates.
  swapSelections: function (candidate1, candidate2) {
    var candidateKey1 = null;
    var candidateKey2 = null;

    for (key in this.ballotSelections) {
      try {
        if (this.ballotSelections[key] == candidate1) {
          candidateKey1 = key;
        } else if (this.ballotSelections[key] == candidate2) {
          candidateKey2 = key;
        }
      } catch (error) {
        continue;
      }      
    }

    if (candidateKey1 != null) {
      this.ballotSelections[candidateKey1] = candidate2;
    }
    
    if (candidateKey2 != null) {
      this.ballotSelections[candidateKey2] = candidate1;
    }
    
  },
  
  // Check if this candidate has been selected.
  isSelected: function (candidate) {
    return this.isAlreadySelected(candidate);
  },
  
  // Check if this candidate has already been selected.
  isAlreadySelected: function (candidate) {
    for (key in this.ballotSelections) {
      try {
        if (this.ballotSelections[key].id == candidate.id) {
          return true;
        }
      } catch (error) {
        continue;
      }      
    }
    return false;
  },
  
  // Retrieve the last candidate that was selected.
  getLastSelectedCandidate: function () {
    return this.ballotSelections[this.highestSelectionCounter-1];
  },
  
  // Navigate the user to the last selected candidate.
  goToLastSelectedCandidate: function () {
    var candidate = this.getLastSelectedCandidate();   
    if (candidate == null) {
      return;
    }

    for (var index1 = 1; index1 <= this.partyGroups.length; index1++) {
      this.currentGroupPosition = index1;
      var group = this.partyGroups[index1];
      var candidates = this.getCandidatesForGroup(group.getId());
      for (var index2 = 0; index2 < candidates.length; index2++) {
        if (candidates[index2].getBallotBoxId() == candidate.getBallotBoxId()) {
          this.currentGroupPosition = index1;
          this.currentCandidatePosition = index2;
          return;
        }
      }
    }
  },
  
  // Check if this candidate selection is the same as the last candidate selection.
  isLastCandidateSelection: function (candidate) {
    if (this.ballotSelections[this.highestSelectionCounter-1] == candidate) {
      return true;
    }
  
    return false;
  },
  
  // Get the candidate that the user has navigated to.
  getCurrentCandidate: function () {
    var currentGroup = this.getCurrentGroup();
    var candidatesForGroup = this.getCandidatesForGroup(currentGroup.getId());
    var currentCandidate = candidatesForGroup[this.currentCandidatePosition];  
    
    return currentCandidate;
  },
  
  getCurrentCandidatePosition: function () {
    return this.currentCandidatePosition;
  },
  
  getCurrentGroupPosition: function () {
    return this.currentGroupPosition;
  },
  
  // Get the preference selection number for a specific candidate.
  getBallotSelectionNumber: function (candidate) {
    for (key in this.ballotSelections) {
      try {
        if ((typeof this.ballotSelections[key]) != "function" && this.ballotSelections[key] == candidate) {
          return Number(key)+1;
        }
      } catch (error) {
        continue;
      }            
    }  

    return null;
  },
  
  // Return a list of ballot box IDs according to their preference selection order.
  getPreferenceOrderList: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();

    var preferenceOrderList = new Array();
    
    for (var index = 0; index < maxCouncilCandidates; index++) {
      var selection = this.ballotSelections[index];
      if (selection == undefined) {
        continue;
      }
      
      preferenceOrderList[index] = selection;
    }
    
    return preferenceOrderList;
  },
  
  // This returns an array of preferences ordered by their shuffled position.
  // e.g. if the first preference is for the 7th candidate in the shuffled list, then array[7] = 1.
  getPreferencesInShuffleOrder: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();
    
    var btlShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      btlShuffleOrderArray[Number(this.shuffleOrder.substring(index1, index1+2))] = index2;
      index2++;
    }
   
    var preferenceList = new Array();
    for (var preferenceIndex = 0; preferenceIndex < maxCouncilCandidates; preferenceIndex++) {
     
      var selection = this.ballotSelections[preferenceIndex];
      if (selection == undefined) {
        continue;
      }

      for (var index2 = 0; index2 < btlShuffleOrderArray.length; index2++) {      
        if (selection.overallPosition - 1 == index2) {
          preferenceList[btlShuffleOrderArray[index2]] = preferenceIndex + 1;
          break;
        }
      }
    }
    
    for (var preferenceIndex = 0; preferenceIndex < maxCouncilCandidates; preferenceIndex++) {
      if (preferenceList[preferenceIndex] == undefined) {
        preferenceList[preferenceIndex] = null;
      }
    }    
    
    return preferenceList;    
  },
  
  // This returns an array of preferences ordered by their shuffled position.
  // e.g. if the first preference is for the 7th candidate in the shuffled list, then array[7] = 1.
  getTextualPreferencesInShuffleOrder: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();
    
    var btlShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      btlShuffleOrderArray[Number(this.shuffleOrder.substring(index1, index1+2))] = index2;
      index2++;
    }
   
    var preferenceList = new Array();
    // This is due to a bug in the browser which was initialising preferenceIndex to 1 if written as an inline for loop declaration.
    for (var preferenceIndex = 0; preferenceIndex < maxCouncilCandidates; preferenceIndex++) {
     
      var selection = this.ballotSelections[preferenceIndex];
      if (selection == undefined) {
        continue;
      }

      for (var index2 = 0; index2 < btlShuffleOrderArray.length; index2++) {      
        if (selection.overallPosition - 1 == index2) {
          preferenceList[btlShuffleOrderArray[index2]] = Number(preferenceIndex + 1).toString();
          break;
        }
      }
    }
    
    for (var preferenceIndex = 0; preferenceIndex < maxCouncilCandidates; preferenceIndex++) {
      if (preferenceList[preferenceIndex] == undefined) {
        preferenceList[preferenceIndex] = "";
      }
    }    
    
    return preferenceList;    
  },

  // This returns an array of all preferences, ordered by preference number (ascending)
  // and showing the position in the shuffled list that they appear.
  // e.g. If the first preference is for the 8th candidate in the shuffled list, then array[1] = 8.
  getShuffledPositionInPreferenceOrder: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();

    var btlShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      btlShuffleOrderArray[Number(this.shuffleOrder.substring(index1, index1+2))] = index2;
      index2++;
    }

    var preferenceList = new Array();
    
    for (var preferenceIndex = 0; preferenceIndex < maxCouncilCandidates; preferenceIndex++) {
     
      var selection = this.ballotSelections[preferenceIndex];
      if (selection == undefined) {
        continue;
      }

      for (var index2 = 0; index2 < btlShuffleOrderArray.length; index2++) {      
        if (selection.overallPosition - 1 == index2) {
          preferenceList[preferenceIndex + 1] = btlShuffleOrderArray[index2] + 1;
          break;
        }
      }
    }
    
    return preferenceList;    
  },
  
  // Below the line ballot preference selection. Business Rules:
  // 1. numbering is increased sequentially on every selection.
  // 2. re-pressing the last selected option undoes the selection.
  ballotOptionPressed: function(selection) {
  
    var candidate = this.getCandidateByBallotId(selection);
  
    // If user pressed the same ballot option, undo the selection.
    if (this.isAlreadySelected(candidate)) {
      if (this.isLastCandidateSelection(candidate)) {
        this.unselectCandidate(candidate);
      }
  
      return;
    }
  
    this.selectCandidate(candidate);
  },
  
  // Swap two ballot options by dragging one onto the other.
  ballotOptionSwapped: function(selection1, selection2) {
  
    var candidate1 = this.getCandidateByBallotId(selection1);
    var candidate2 = this.getCandidateByBallotId(selection2);
    this.swapSelections(candidate1, candidate2);
  },

  isInformal: function () {
    if (this.highestSelectionCounter < MIN_COUNCIL_CANDIDATES_REQUIRED) {
      return true;
    } else {
      return false;
    }
  }
});