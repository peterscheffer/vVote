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
 * AssemblyCandidate class.
 * Represents an electoral assembly candidate.
 * 
 * @author Peter Scheffer
 */
var AssemblyCandidate = Class.extend({
  
  init: function (ballotBoxId,                   // The ballot box ID assigned to the candidate in the application. Unique DOM ID.
                  id,                            // The ID assigned to the candidate in the JSON data that is used for candidate list iteration.
                  name,                          // The candidate's full name in <SURNAME, First Name> format.
                  partyName,                     // The full party name that the candidate belongs to.
                  partyInitials,                 // The party's acronym.
                  ballotPosition,                // The position on the ballot below the line that this candidate appears in their grouping.
                  audioFileName) {               // File system path to the audio representation of the candidate name & party name.
    this.ballotBoxId = 'ballot_option_' + ballotPosition;
    this.id = id;
    this.name = name;
    this.partyName = partyName;
    this.partyInitials = partyInitials;
    this.ballotPosition = ballotPosition;
    this.audioFileName = audioFileName;
  },
  
  typeOf: function () {
    return "Candidate";
  },
  
  getId: function () {
    return this.id;
  },
  
  getName: function () {
    return this.name;
  },
  
  getPartyName: function () {
    return this.partyName;
  },
  
  getPartyInitials: function () {
    return this.partyInitials;
  },
  
  getAudioFileName: function() {
    return this.audioFileName;
  },
  
  getBallotBoxId: function() {
    return this.ballotBoxId;
  },
  
  getBallotPosition: function () {
    return this.ballotPosition;
  }
});