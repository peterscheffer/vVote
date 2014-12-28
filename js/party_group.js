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
 * Party Group class.
 * Represents a party group on a ballot - above the line grouping.
 * Consists of a list of parties or candidates.
 * Contains its own list of candidates that represents each of the candidates for each of its parties.
 * 
 * @author Peter Scheffer
 */
var PartyGroup = Class.extend({
  
  init: function(id, name, hasBallotBox, audioFile, ballotBoxLetter, ballotPosition) {
    this.id = id;
    this.name = name;
    this.hasBallotBox = hasBallotBox;
    this.ballotBoxLetter = ballotBoxLetter;
    this.audioFileName = audioFile;
    this.ballotPosition = ballotPosition;
    this.candidates = new Array();
    this.candidateCounter = 0;
    this.partyCounter = 0;
    this.ballotBoxId = "ballot_groups_content_" + id;
    this.isUngrouped = false;
    this.isUnnamed = false;
  },
  
  typeOf: function () {
    return "PartyGroup";
  },
  
  setId: function(id) {
    this.id = id;
  },
  
  getId: function() {
    return this.id;
  },
  
  getName: function() {
    return this.name;
  },
  
  setHasBallotBox: function (hasBallotBox) {
    this.hasBallotBox = hasBallotBox;
  },
  
  getHasBallotBox: function () {
    return this.hasBallotBox;
  },

  addCandidate: function(candidate) {
    if (candidate == null) {
      return;
    }

    // zero based index.
    var position = candidate.getBallotPosition();
    this.candidates[position - 1] = candidate;
    this.candidateCounter++
  },
  
  getCandidates: function() {
    return this.candidates;
  },
  
  getCandidateCount: function() {
    return this.candidateCounter;
  },
  
  setBallotBoxId: function(ballotBoxId) {
    this.ballotBoxId = ballotBoxId;
  },
  
  getBallotBoxId: function() {
    return this.ballotBoxId;
  },

  setAudioFileName: function(audioFile) {
    this.audioFileName = audioFile;
  },
    
  getAudioFileName: function() {
    return this.audioFileName;
  },
  
  setIsUngrouped: function (ungrouped) {
    this.isUngrouped = ungrouped;
  },
  
  getIsUngrouped: function () {
    return this.isUngrouped;
  },
  
  setIsUnnamed: function (unnamed) {
    this.unnamed = unnamed;
  },
  
  getIsUnnamed: function () {
    return this.unnamed;
  },
  
  getBallotPosition: function () {
    return this.ballotPosition;
  },
  
  getBallotBoxLetter: function () {
    return this.ballotBoxLetter;
  }
});