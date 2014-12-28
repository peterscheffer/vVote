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
 * Candidate class.
 * Represents an electoral candidate.
 * 
 * @author Peter Scheffer
 */
var Candidate = Class.extend({
  
  init: function (ballotBoxId,                   // The ballot box ID assigned to the candidate in the application. Unique DOM ID.
                  id,                            // The index ID in the JSON data that is used for candidate list iteration.
                  name,                          // The candidate's full name in <SURNAME, First Name> order.
                  partyName,                     // The full party name that the candidate belongs to.
                  partyNameAbbreviation,         // An abbreviated version of the party name if the full name is too long.
                  partyNameInitials,             // Initials representing the party.
                  partyGroupName,                // The name of the group to which the candidate belongs in the upper house ballot.
                  partyNameToUse,                // An indication of which party name to use from the above 3 party name options.
                  groupPosition,                 // Position of the group on the ballot.
                  ballotPosition,                // The position on the ballot below the line that this candidate appears in their grouping.
                  audioFileName) {               // File system path to the audio representation of the candidate name & party name.
    this.ballotBoxId = 'council_candidate_ballot_option_' + groupPosition + '_' + ballotPosition;
    this.id = id;
    this.name = name;
    this.partyName = partyName;
    this.partyNameAbbreviation = partyNameAbbreviation;
    this.partyNameInitials = partyNameInitials;
    this.partyGroupName = partyGroupName;
    this.partyNameToUse = partyNameToUse;
    this.ballotPosition = ballotPosition;
    this.audioFileName = audioFileName;
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
  
  getPartyNameAbbreviation: function () {
    return this.partyNameAbbreviation;
  },
  
  getPartNameInitials: function () {
    return this.partyNameInitials;
  },
  
  getPartyNameToUse: function () {
    return this.partyNameToUse;
  },
  
  getPartyGroupName: function () {
    return this.partyGroupName;
  },
    
  getAudioFileName: function() {
    return this.audioFileName;
  },
  
  getBallotBoxId: function() {
    return this.ballotBoxId;
  },
  
  setRegion: function (region) {
    this.region = region;
  },
  
  getRegion: function () {
    return this.region;
  },
  
  getBallotPosition: function () {
    return this.ballotPosition;
  }
});