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
 * Legislative Assembly Ballot class.  This class is responsible for 
 * maintaining the data and state of the ballot.
 * 
 * @author Peter Scheffer
 */

var LegislativeAssemblyBallot = Ballot.extend({
 
  init: function () {

    this.ballotType = LEGISLATIVE_ASSEMBLY_BALLOT;

    // Record whether the user has visited this ballot.  
    this.hasVisited = false;
  
    // Record of the number of preferences selections that the user has made in this ballot.
    this.highestSelectionCounter = 0;
    
    // Position of user in the current group listing of candidates.
    this.currentCandidatePosition = 0;
    
    // List of selections made on this ballot.
    this.ballotSelections = new Array();

    // List of individual candidates according to their ballot box representation in the application.
    this.partyCandidateBallotBoxes = new Array();
    
    // List of ballot boxes retrieved according to candidate name.
    this.partyCandidateSelections = new Array();

    // List of individual candidates and the party they are representing according to the candidate name.
    this.candidateList = new Array();    
    
    // List of parties and their candidates according to the party name.
    this.partyCandidates = new Array();
    
    // List of parties for each candidate according to candidate name.
    this.candidateParties = new Array();
  },

  clear: function() {
    this.ballotSelections = new Array();
    this.highestSelectionCounter = 0;
    this.reset();
  },
  
  reset: function() {
    this.hasVisited = false;
    this.currentCandidatePosition = 0;
    this.highestSelectionCounter = 0;
    this.ballotSelections = new Array();
    this.partyCandidateSelections = new Array();
  },
  
  setVisited: function (visited) {
    this.hasVisited = visited;
  },
 
  getVisited: function () {
    return this.hasVisited;
  },

  setShuffleOrder: function (shuffleOrder) {
    this.shuffleOrder = shuffleOrder;
  },

  getShuffleOrder: function () {
    return this.shuffleOrder;
  },  

  setCandidateNominations: function (data) {
   
    this.candidateListing = data;

    // Process candidate data into object lists.
    for (var index = 0; index < data.length; index++) {
      var candidateData = data[index];
      var candidate = new AssemblyCandidate(index, 
            candidateData['id'], 
            candidateData['name'], 
            candidateData['partyName'], 
            candidateData['partyInitials'], 
            candidateData['ballotPosition'], 
            candidateData['audio']);
            
      // zero based index of L.A candidates.
      var ballotPosition = candidateData['ballotPosition'];
      this.candidateList[ballotPosition - 1] = candidate;
      this.partyCandidateBallotBoxes[candidate.getBallotBoxId()] = candidate;
      this.candidateParties[candidate.getName()] = candidate.getPartyName();
      this.partyCandidateSelections[candidate.getName()] = candidate.getBallotBoxId();    
    }  
  },
  
  getCandidates: function() {
    return this.candidateList;
  },
  
  getCandidateListing: function() {
    return this.candidateListing;
  },
  
  getNumberOfCandidates: function() {
    return this.candidateList.length;
  },
  
  // The highest selection counter keeps record of how many preference 
  // selections the user has made in this ballot.
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
  
  // Retrieve the representative party by candidate name.
  getPartyByCandidateName: function(candidateName) {
    if (candidateName == undefined || this.candidateParties[candidateName] == undefined) {
      throw new Error("Party Name is not available in the list of ballot candidates for: " + candidateName);
    } else {
      return this.candidateParties[candidateName];
    }
  },
    
  // Retrieve a candidate by ordinal according to listing in candidates array.
  getCandidateByIndex: function(index) {
    return this.candidateList[index];
  },

  // Retrieve candidate according to the shuffle order defined on the ballot receipt.  
  getCandidateByShuffleOrder: function(index) {

    var assemblyShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      assemblyShuffleOrderArray[index2] = Number(this.shuffleOrder.substring(index1, index1+2));
      index2++;
    }

    var shuffledIndex = assemblyShuffleOrderArray[index];
    var candidate = this.getCandidateByIndex(shuffledIndex);
    return candidate;
  },
  
  // Retrieve candidate according to the shuffle order defined on the ballot receipt.  
  getCandidatesInShuffleOrder: function() {
  
    var assemblyShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      assemblyShuffleOrderArray[index2] = Number(this.shuffleOrder.substring(index1, index1+2));
      index2++;
    }

    var candidates = new Array();
    for (var index = 0; index < this.candidateList.length; index++) {
      var shuffledIndex = assemblyShuffleOrderArray[index];
      candidates[index] = this.candidateList[shuffledIndex];
    }
     
    return candidates;
  },
  
  // Retrieve a candidate by according to the ballot box ID they have been assigned.
  getCandidateByBallotId: function(ballotBoxId) {
    return this.partyCandidateBallotBoxes[ballotBoxId];
  },
    
  // Move down to next candidate in the ball.o Used in the blind navigation UI.
  moveToNextCandidate: function () {
    if (this.currentCandidatePosition < this.candidateList.length-1) {
      this.currentCandidatePosition++;
      var candidate = this.candidateList[this.currentCandidatePosition];
      return candidate;
    } else {
      throw new Error(LAST_CANDIDATE_EXCEPTION);
    }
  },
  
  // Move up to previous candidate in the ballot. Used in the blind navigation UI.
  moveToPreviousCandidate: function () {
    if (this.currentCandidatePosition > 0) {
      this.currentCandidatePosition--;
      var candidate = this.candidateList[this.currentCandidatePosition];
      return candidate;
    } else {
      throw new Error(FIRST_CANDIDATE_EXCEPTION);
    }
  },
  
  // Select the specified candidate at the current highest selection counter.
  selectCandidate: function (candidate) {  

    if (this.ballotSelections[this.highestSelectionCounter-1] != candidate) {
      this.ballotSelections[this.highestSelectionCounter] = candidate;
      this.incrementHighestSelectionCounter();
    }

  },
  
  // Select the current candidate. Used in the blind navigation UI.
  selectCurrentCandidate: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidates = votingSession.getMaximumNumberOfAssemblyCandidates();

    if (this.highestSelectionCounter == maxAssemblyCandidates) {
      throw new Error(MAXIMUM_CANDIDATES_SELECTED);
    }
    var currentCandidate = this.getCurrentCandidate();
    this.selectCandidate(currentCandidate);
    
    return currentCandidate;
  },
  
  setBallotSelection: function (candidate, index) {
    this.ballotSelections[index-1] = candidate;  
  },
  
  // Unselect a candidate. Only the last selected candidate can be unselected.
  unselectCandidate: function (candidate) {    
    if (this.ballotSelections[this.highestSelectionCounter-1] == candidate) {
      this.decrementHighestSelectionCounter();
      this.ballotSelections[this.highestSelectionCounter] = null;
    }
  },
  
  unselectLastCandidate: function () {
    if (this.highestSelectionCounter > 0) {
      this.highestSelectionCounter--;
      this.ballotSelections[this.highestSelectionCounter] = null;
    }
  },

  // Remove selection for the current candidate. Used in the blind navigation UI.
  unselectCurrentCandidate: function () {

    var currentCandidate = this.getCurrentCandidate();

    if (this.ballotSelections[this.highestSelectionCounter-1] == currentCandidate) {
      this.decrementHighestSelectionCounter();
      this.ballotSelections[this.highestSelectionCounter] = null;
    } else {
      throw new Error("You can only remove selection for the last selected candidate.");
    }
    
    return currentCandidate;
  },
  
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
  
  getLastSelectedCandidate: function () {
    return this.ballotSelections[this.highestSelectionCounter-1];
  },
  
  // Navigate the user to the last selected candidate.
  goToLastSelectedCandidate: function () {
    var candidate = this.getLastSelectedCandidate();   
    if (candidate == null) {
      return;
    }
    
    for (var index = 0; index < this.candidateList.length; index++) {
      if (this.candidateList[index].getBallotBoxId() == candidate.getBallotBoxId()) {
        this.currentCandidatePosition = index;
        return;
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
  
  resetCurrentCandidatePosition: function () {
    this.currentCandidatePosition = 0;
  },
  
  // Get the position of the current candidate in the ballot navigation.
  getCurrentCandidatePosition: function () {
    return this.currentCandidatePosition;
  },
  
  // Get the candidate that the user has navigated to.
  getCurrentCandidate: function () {
    return this.candidateList[this.currentCandidatePosition];
  },

  // Get the preference selection number for a specific candidate.  
  getBallotSelectionNumber: function (candidate) {
    for (key in this.ballotSelections) {
      try {
        if (this.ballotSelections[key] == candidate) {
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
    var maxAssemblyCandidates = votingSession.getMaximumNumberOfAssemblyCandidates();

    var preferenceOrderList = new Array();
    
    for (var index = 0; index < maxAssemblyCandidates; index++) {
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
    var maxAssemblyCandidates = votingSession.getMaximumNumberOfAssemblyCandidates();
    
    var assemblyShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      assemblyShuffleOrderArray[Number(this.shuffleOrder.substring(index1, index1+2))] = index2;
      index2++;
    }
   
    var preferenceList = new Array();
    
    for (var preferenceIndex = 0; preferenceIndex < maxAssemblyCandidates; preferenceIndex++) {
     
      var selection = this.ballotSelections[preferenceIndex];
      if (selection == undefined) {
        continue;
      }

      for (var index2 = 0; index2 < assemblyShuffleOrderArray.length; index2++) {      
        if (selection.ballotPosition - 1 == index2) {
          preferenceList[assemblyShuffleOrderArray[index2]] = preferenceIndex + 1;
          break;
        }
      }
    }
    
    for (var preferenceIndex = 0; preferenceIndex < maxAssemblyCandidates; preferenceIndex++) {
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
    var maxAssemblyCandidates = votingSession.getMaximumNumberOfAssemblyCandidates();
    
    var assemblyShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      assemblyShuffleOrderArray[Number(this.shuffleOrder.substring(index1, index1+2))] = index2;
      index2++;
    }
   
    var preferenceList = new Array();
    
    for (var preferenceIndex = 0; preferenceIndex < maxAssemblyCandidates; preferenceIndex++) {
     
      var selection = this.ballotSelections[preferenceIndex];
      if (selection == undefined) {
        continue;
      }

      for (var index2 = 0; index2 < assemblyShuffleOrderArray.length; index2++) {      
        if (selection.ballotPosition - 1 == index2) {
          preferenceList[assemblyShuffleOrderArray[index2]] = Number(preferenceIndex + 1).toString();
          break;
        }
      }
    }
    
    for (var preferenceIndex = 0; preferenceIndex < maxAssemblyCandidates; preferenceIndex++) {
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

    var assemblyShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      assemblyShuffleOrderArray[Number(this.shuffleOrder.substring(index1, index1+2))] = index2;
      index2++;
    }

    var preferenceList = new Array();

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidates = votingSession.getMaximumNumberOfAssemblyCandidates();
    
    for (var preferenceIndex = 0; preferenceIndex < maxAssemblyCandidates; preferenceIndex++) {
     
      var selection = this.ballotSelections[preferenceIndex];
      if (selection == undefined) {
        continue;
      }

      for (var index2 = 0; index2 < assemblyShuffleOrderArray.length; index2++) {      
        if (selection.ballotPosition - 1 == index2) {
          preferenceList[preferenceIndex + 1] = assemblyShuffleOrderArray[index2] + 1;
          break;
        }
      }
    }
    
    return preferenceList;    
  },

  // Assembly ballot preference selection. Business Rules:
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

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxAssemblyCandidatesRequired = votingSession.getMaximumNumberOfAssemblyCandidates();

    if (this.highestSelectionCounter < maxAssemblyCandidatesRequired) {
      return true;
    } else {
      return false;
    }
  }
});