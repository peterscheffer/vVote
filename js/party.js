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
 * Party class.
 * Represents a political party.
 * Consists of a list of candidates.
 * 
 * @author Peter Scheffer
 */
var Party = Class.extend({
  
  init: function(name) {
    this.name = name;
    this.candidates = new Array();
    this.candidateCounter = 0;
  },
  
  typeOf: function () {
    return "Party";
  },
  
  getName: function() {
    return this.name;
  },
  
  addCandidate: function(candidate) {
    this.candidates[this.candidateCounter++] = candidate;
  },
  
  getCandidateCount: function() {
  	return this.candidateCounter;
  },
  
  getCandidates: function() {
    return this.candidates;
  }
});