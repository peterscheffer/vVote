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
 * CouncilCandidate class.
 * Represents an electoral council candidate.
 * 
 * @author Peter Scheffer
 */
var CouncilCandidate = Class.extend({
  
  init: function (id,                            // The index ID in the JSON data that is used for candidate list iteration.
                  name,                          // The candidate's full name in <SURNAME, First Name> order.
                  partyName,                     // The full party name that the candidate belongs to.
                  partyGroupID,                  // The ID of the group to which the candidate belongs in the upper house ballot.
                  groupPosition,                 // Position of the group on the ballot.
                  ballotPosition,                // The position on the ballot below the line that this candidate appears in their grouping.
                  overallPosition,               // The overall (legal) position on the ballot.
                  audioFileName,                 // File system path to the audio representation of the candidate name & party name.
                  region) {                      // The candidate's electoral region
    this.ballotBoxId = 'council_candidate_ballot_option_' + groupPosition + '_' + ballotPosition;
    this.id = id;
    this.name = name;
    this.partyName = partyName;
    this.partyGroupID = partyGroupID;
    this.ballotPosition = ballotPosition;
    this.overallPosition = overallPosition;
    this.audioFileName = audioFileName;
    this.region = region;
    this.groupPosition = groupPosition;
  },
  
  typeOf: function () {
    return "Candidate";
  },
  
  getName: function () {
    return this.name;
  },
  
  getPartyName: function () {
    return this.partyName;
  },
  
  getPartyGroupID: function () {
    return this.partyGroupID;
  },
    
  getAudioFileName: function() {
    return this.audioFileName;
  },
  
  getBallotBoxId: function() {
    return this.ballotBoxId;
  },
  
  getRegion: function () {
    return this.region;
  },
  
  getBallotPosition: function () {
    return this.ballotPosition;
  },
  
  getOverallPosition: function () {
    return this.overallPosition;
  },
  
  getGroupPosition: function () {
    return this.groupPosition;
  }
});