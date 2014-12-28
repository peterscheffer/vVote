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
 * Abstract Class definition of a Ballot.  Provides most basic required functions to be defined.
 * These methods must be over-ridden by all subclasses.
 * 
 * @author Peter Scheffer
 */
var Ballot = Class.extend({
  
  typeOf: function () {
    return "Ballot";
  },

  getType: function() {
    return this.ballotType;
  },
  
  getShuffleOrder: function () {
    alert('getShuffleOrder() not implemented in this subclass');
  },
    
  setShuffleOrder: function (shuffleOrder) {
    alert('setShuffleOrder() not implemented in this subclass');
  },
  
  init: function() {
    alert('init() not implemented in this subclass');
  },
  
  clear: function() {
    alert('clear() not implemented in this subclass');
  },
  
  reset: function() {
    alert('reset() not implemented in this subclass');
  },
  
  isSelected: function() {
    alert('isSelected() not implemented in this subclass');
  },
  
  getBallotSelectionNumber: function () {
    alert('getBallotSelectionNumber() not implemented in this subclass');
  },
  
  getHighestSelection: function () {
    alert('getHighestSelection() not implemented in this subclass');
  },
  
  getPreferenceOrderList: function () {
    alert('getPreferenceOrderList() not implemented in this subclass');
  },
  
  getSelection: function () {
    alert('getSelection() not implemented in this subclass');
  }    
});