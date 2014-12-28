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
 * Above The Line Council Ballot class.  This class is responsible for maintaining 
 * the data and state of the ballot. The Council Ballot can be voted either "above the line" 
 * or "below the line".  An above the line vote allows only one group selection.
 * 
 * @author Peter Scheffer
 */
 
var AboveTheLineCouncilBallot = Ballot.extend({

  init: function () {

    this.ballotType = LEGISLATIVE_COUNCIL_GROUP_BALLOT;

    // Record whether the user has visited this ballot.  
    this.hasVisited = false;
    
    // Position of user in the current ballot listing of groups.
    this.currentGroupPosition = 0;
    
    // The one selected group option.
    this.groupSelection = null;
  },

  clear : function() {
    this.groupSelection = null;
    this.reset();
  },
  
  reset : function() {
    this.currentGroupPosition = 0;  
    this.groupSelection = null;
    this.hasVisited = false;
  },
  
  resetCurrentCandidatePosition: function () {
    this.currentGroupPosition = 0;
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
  
  getCandidates: function () {
    return this.partyGroups;
  },

  setPartyGroupListing: function(data) {
    this.partyGroupListing = data;    
    this.partyGroups = new Array();
    this.fullListOfPartyGroups = new Array();
    
    var ticketedPartyCounter = 0;

    // Process party group data into object lists.
    for (var index = 0; index < data.length; index++) {
      var partyData = data[index];

      var groupBallotPosition = partyData['groupBallotPosition'] - 1;
      var partyGroup = new PartyGroup(
        partyData['id'],
        partyData['preferredName'],
        partyData['hasBallotBox'],
        partyData['audio'],
        partyData['ballotBoxLetter'],
        groupBallotPosition);
        
      var isUngrouped = partyData['ungrouped'];
      partyGroup.setIsUngrouped(isUngrouped);

      var isUnnamed = partyData['unnamed'];
      partyGroup.setIsUnnamed(isUnnamed);
      
      try {
        // zero based index of parties/groups that must have a ballot box.
        if (partyGroup.getHasBallotBox()) {
          this.partyGroups[ticketedPartyCounter++] = partyGroup;
        }
        
        // Create a list of "displayed" groups that matches how the ballot should appear.
        // This includes groups that are not visible, but their position and spacing creates the correct
        // positioning and layout for the candidates listed below the line.
        this.fullListOfPartyGroups[groupBallotPosition] = partyGroup;
        
       } catch (error) {
        continue;
      }
    }
  },
  
  getNumberOfPartyGroups: function () {
    return this.fullListOfPartyGroups.length;
  },
  
  getPartyGroupListing: function () {
    return this.fullListOfPartyGroups;
  },
  
  getGroups: function() {
    return this.partyGroups;
  },
  
  getTicketedGroups: function () {
    return this.partyGroups;
  },

  // Retrieve a party group by ordinal according to listing in candidates array.
  getGroupByIndex: function(index) {
    return this.partyGroups[index];
  },

  // Retrieve candidate according to the shuffle order defined on the ballot receipt.  
  getPartiesInShuffleOrder: function(index) {

    var atlShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      atlShuffleOrderArray[index2] = Number(this.shuffleOrder.substring(index1, index1+2));
      index2++;
    }

    var ticketedGroups = this.getTicketedGroups();
    var ticketedGroupCount = ticketedGroups.length;
    
    var parties = new Array();
    for (var index = 0; index < ticketedGroupCount; index++) {
      var shuffledIndex = atlShuffleOrderArray[index];
      var shuffledParty = ticketedGroups[shuffledIndex];
      
      if (!shuffledParty.getIsUngrouped() && shuffledParty.getHasBallotBox()) {
        parties[index] = shuffledParty;
      }
    }
    
    return parties;
  },

  // Retrieve candidate according to the shuffle order defined on the ballot receipt.  
  getCandidateByShuffleOrder: function(index) {
    
    var atlShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      atlShuffleOrderArray[index2] = Number(this.shuffleOrder.substring(index1, index1+2));
      index2++;
    }

    var shuffledIndex = atlShuffleOrderArray[index];
    var candidate = this.partyGroups[shuffledIndex];
    return candidate;
  },
  
  // Return a group according to its ballot box ID.
  getGroupByBallotId: function (ballotBoxId) {    
    for (key in this.partyGroups) {
      try {
        var group = this.partyGroups[key];
        if (group.getBallotBoxId() == ballotBoxId) {
          return group;
        }
      } catch (error) {
        continue;
      }
    }
    
    return null;  
  },
  
  // Return the ballot box ID for a group.
  getBallotBoxId: function (group) {
    for (key in this.partyGroups) {
      try {
        var agroup = this.partyGroups[key];
        if (agroup == group) {
          return group.getBallotBoxId();
        }
      } catch (error) {
        continue;
      }
    }    
  },
  
  // Select the specified group.
  selectGroup: function (group) {
    // Check if the user has already made a selection.
    if (this.groupSelection != null) {
      throw new Error(MAXIMUM_GROUPS_SELECTED);
    }
    
    this.groupSelection = group;       
    return group;
  },
  
  // Unselect the one selected group.
  unselectGroup: function () {
    this.groupSelection = null;
  },
  
  setBallotSelection: function (group) {
    this.groupSelection = group;  
  },  
  
  // Check if this candidate has been selected.
  isSelected: function (group) {
    return this.groupSelection == group;
  },
  
  // Check if this group selection is the same as the last group selection.
  isLastGroupSelection: function (group) {
    if (this.groupSelection == group) {
      return true;
    }
  
    return false;
  },
  
  // zero-based index means adjustment is required.
  setCurrentGroupPosition: function (currentGroupPosition) {
    this.currentGroupPosition = currentGroupPosition - 1;
  },
  
  // zero-based index means adjustment is required.
  getCurrentGroupPosition: function () {
    return this.currentGroupPosition + 1;
  },
  
  // Move right to next group in ballot. Returns the next group. Used in the blind navigation UI.
  moveToNextGroup: function () {
    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();
    
    if (this.currentGroupPosition < maxCouncilGroups - 1) {
    
      // If we are not voicing unticketed/ungrouped groups in the ATL in the AUI, then you cannot navigate to them.
      if (!WE_ARE_VOICING_UNTICKETED_GROUPS) {

        var originalGroupPosition = this.currentGroupPosition;
    
        // Check that the next group is not UNGROUPED. This group is not navigable.
        // If the next group is UNGROUPED, it is the last group in the ballot, so technically at the end of the list.
        var nextGroup = this.fullListOfPartyGroups[++this.currentGroupPosition];
        
        if (nextGroup.getIsUngrouped()) {
          --this.currentGroupPosition;
          throw new Error(LAST_GROUP_EXCEPTION);
        }

        // If the next group has no ticket (no ballot box) then see if there's one after that that does.
        if (!nextGroup.getHasBallotBox()) {
          while (nextGroup != null && 
                !nextGroup.getHasBallotBox() && 
                !nextGroup.getIsUngrouped() && 
                (this.currentGroupPosition + 1 < maxCouncilGroups)) {
            nextGroup = this.fullListOfPartyGroups[++this.currentGroupPosition];
          }
          
          if (nextGroup == null || !nextGroup.getHasBallotBox() || nextGroup.getIsUngrouped()) {
            this.currentGroupPosition = originalGroupPosition;
            throw new Error(LAST_GROUP_EXCEPTION);
          } else {
            return nextGroup;
          }
        }
        
        this.currentGroupPosition = originalGroupPosition;
      }

      this.currentGroupPosition++;
      var group = this.fullListOfPartyGroups[this.currentGroupPosition];
      return group;
    } else {
      throw new Error(LAST_GROUP_EXCEPTION);
    }
  },
  
  // Move left to previous group in ballot. Returns the previous group. 
  // Used in the blind navigation UI.
  moveToPreviousGroup: function () {
    
    if (this.currentGroupPosition > 0) {

      // If we are not voicing unticketed/ungrouped groups in the ATL in the AUI, then you cannot navigate to them.
      if (!WE_ARE_VOICING_UNTICKETED_GROUPS) {

        var originalGroupPosition = this.currentGroupPosition;

        var previousGroup = this.fullListOfPartyGroups[--this.currentGroupPosition];
    
        // If the previous group has no ticket (no ballot box) then see if there's one before that that does.
        if (!previousGroup.getHasBallotBox()) {
          while (previousGroup != null && 
                !previousGroup.getHasBallotBox() &&
                (this.currentGroupPosition > 0)) {
            previousGroup = this.fullListOfPartyGroups[--this.currentGroupPosition];
          }
          
          if (previousGroup == null || !previousGroup.getHasBallotBox()) {
            this.currentGroupPosition = originalGroupPosition;
            throw new Error(FIRST_GROUP_EXCEPTION);
          } else {
            return previousGroup;
          }
        }
        
        this.currentGroupPosition = originalGroupPosition;
      }

      this.currentGroupPosition--;
      var group = this.fullListOfPartyGroups[this.currentGroupPosition];
      return group;
    } else {
      throw new Error(FIRST_GROUP_EXCEPTION);
    }
  },
  
  // Remove selection for one group, and replace with selection for the other group, 
  // according to which has already been selected.  
  swapSelections: function (group1, group2) {
    if (this.groupSelection == group1) {
      this.groupSelection = group2;
    } else {
      this.groupSelection = group1;
    }
  },
  
  // Return the current group that the user has navigated to. Used in the blind navigation UI.
  getCurrentGroup: function () {
    // zero-based index requires -1.
    var currentGroup = this.fullListOfPartyGroups[this.currentGroupPosition];    
    return currentGroup;
  },
  
  // Check if this group has already been selected.
  isAlreadySelected: function (group) {
    if (this.groupSelection == group) {
      return true;
    }
    
    return false;
  },
  
  // Navigate the user to the last selected candidate.
  goToLastSelectedCandidate: function () {
    
    if (this.getSelection() == null) {
      return;
    }

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();
    
    for (var index = 0; index < maxCouncilGroups; index++) {
      if (this.partyGroups[index].getBallotBoxId() == this.getSelection().getBallotBoxId()) {
        this.currentGroupPosition = index;
        return;
      }
    }
  },
  
  // Returns the currently selected group preference, if one has been selected.
  getSelection: function () {
    return this.groupSelection;
  },
  
  // Returns the preference number according to ballot box ID, or empty string if not selected.
  getPreferenceNumber: function (ballotBoxId) {
    
    if (this.groupSelection == null) {
      return "";
    }
    
    if (this.getGroupByBallotId(ballotBoxId).getId() == this.groupSelection.getId()) {
      return 1;
    } else {
      return "";
    }
  },
  
  // This returns an array of preferences ordered by their shuffled position, as natural numbers.
  // e.g. if the first preference is for the 7th candidate in the shuffled list, then array[7] = 1.
  getPreferencesInShuffleOrder: function () {
    
    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();

    var atlShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      atlShuffleOrderArray[Number(this.shuffleOrder.substring(index1, index1+2))] = index2;
      index2++;
    }
   
    var preferenceList = new Array();
    var ticketedGroups = this.getTicketedGroups();
    var ticketedGroupCount = ticketedGroups.length;
    var selection = this.getSelection();

    if (selection != null) {
      for (var preferenceIndex = 0; preferenceIndex < ticketedGroupCount; preferenceIndex++) {     
        var groupCandidate = ticketedGroups[preferenceIndex];
        if (groupCandidate instanceof PartyGroup) {
          if (selection.id == groupCandidate.id) {
            preferenceList[atlShuffleOrderArray[preferenceIndex]] = 1;
            break;
          }
        }
      }
    }

    for (var preferenceIndex = 0; preferenceIndex < ticketedGroupCount; preferenceIndex++) {     
      if (preferenceList[atlShuffleOrderArray[preferenceIndex]] == null) {
        preferenceList[atlShuffleOrderArray[preferenceIndex]] = null;
      }
    }
    
    return preferenceList;    
  },
  
  // This returns an array of preferences ordered by their shuffled position, as text strings.
  // e.g. if the first preference is for the 7th candidate in the shuffled list, then array[7] = 1.
  getTextualPreferencesInShuffleOrder: function () {

    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var maxCouncilGroups = votingSession.getMaximumNumberOfGroups();
    
    var atlShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      atlShuffleOrderArray[Number(this.shuffleOrder.substring(index1, index1+2))] = index2;
      index2++;
    }
   
    var preferenceList = new Array();

    for (var preferenceIndex = 0; preferenceIndex < maxCouncilGroups; preferenceIndex++) {     
      var groupCandidate = this.partyGroups[preferenceIndex];
      if (groupCandidate instanceof PartyGroup && !groupCandidate.getIsUngrouped() && groupCandidate.getHasBallotBox()) {
        for (var index2 = 0; index2 < atlShuffleOrderArray.length; index2++) {      
          var selection = this.getSelection();
          if (selection != null && selection.id == groupCandidate.id) {
            preferenceList[atlShuffleOrderArray[preferenceIndex]] = "1";
            break;
          }
        }
      }
    }

    var ticketedGroups = this.getTicketedGroups();
    var ticketedGroupCount = ticketedGroups.length;
    
    for (var preferenceIndex = 0; preferenceIndex < ticketedGroupCount; preferenceIndex++) {
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
    
    var atlShuffleOrderArray = new Array();
    var index2 = 0;
    for (var index1 = 0; index1 < this.shuffleOrder.length; index1 += 2) {
      atlShuffleOrderArray[Number(this.shuffleOrder.substring(index1, index1+2))] = index2;
      index2++;
    }
   
    var preferenceList = new Array();
    var selection = this.getSelection();
    var ballotPosition = selection.getBallotPosition();
    if (selection != null) {
      preferenceList[1] = atlShuffleOrderArray[ballotPosition];
    }
    
    return preferenceList;    
  },

  // Returns the highest selection number.
  getHighestSelection: function () {
    return (this.getSelection() == null ? "0" : "1");
  },
  
  // Get the preference selection number for a specific group.  
  getBallotSelectionNumber: function (group) {
    return (this.groupSelection == group ? "1" : null);
  },
  
  // Above the line ballot preference selection. Business Rules:
  // 1. user can select only one party group.
  // 2. re-pressing the last selected option undoes the selection.
  ballotOptionPressed: function(selection) {
  
    var group = this.getGroupByBallotId(selection);
  
    // If user pressed the same ballot option, undo the selection.
    if (this.isAlreadySelected(group)) {
      if (this.isLastGroupSelection(group)) {
        this.unselectGroup();
      }
      return;
    }
  
    if (this.getHighestSelection() > 0) {
      var currentlySelected = this.getSelection();
      this.unselectGroup();
    }
  
    this.selectGroup(group);
  },

  // Swap two ballot options by dragging one onto the other.
  ballotOptionSwapped: function(selection1, selection2) {
  
    var group1 = this.getGroupByBallotId(selection1);
    var group2 = this.getGroupByBallotId(selection2);
    this.swapSelections(group1, group2);
  },
  
  isInformal: function () {
    if (this.groupSelection == null) {
      return true;
    } else {
      return false;
    }
  }  
});