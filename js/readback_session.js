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
 * ReadbackSession class.
 * Represents a voter's readback session once they have scanned a voted candidate list or preferences receipt.
 * 
 * @author Peter Scheffer
 */
var ReadbackSession = Class.extend({
  
  init: function () {
    this.region = null;
    this.district = null;
    this.vote = null;
    this.signature = null;
    this.serialCode = null;
    this.scannedPreferencesReceipt = false;
    this.scannedCandidateSlip = false;
    this.dateVoted = null;
    this.locationVoted = null;
  },
  
  reset: function () {
    this.init();
  },
  
  setDistrict: function (district) {
    this.district = district;
  },
  
  getDistrict: function () {
    return this.district;
  },
  
  setRegion: function (region) {
    this.region = region;
  },
  
  getRegion: function () {
    return this.region;
  },

  // QR candidate list signature.
  setSignature: function (signature) {
    this.signature = signature;
  },
  
  // QR candidate list signature.
  getSignature: function () {
    return this.signature;
  },
  
  // QR candidate list serial number.
  setSerialCode: function (serialCode) {
    this.serialCode = serialCode;
  },
  
  // QR candidate list serial number.
  getSerialCode: function () {
    return this.serialCode;
  },
  
  // Store a retrieved vote for playback.
  setVote: function (data) {
    this.vote = data;
  },

  // Get JSON vote data.  
  getVote: function () {
    return this.vote;
  },
  
  // Set if the user has already scanned a preferences receipt.  
  setScannedPreferencesReceipt: function (scannedPreferencesReceipt) {
    this.scannedPreferencesReceipt = scannedPreferencesReceipt;
  },
  
  // Check if the user has already scanned a preferences receipt.  
  getScannedPreferencesReceipt: function () {
    return this.scannedPreferencesReceipt;
  },
  
  // Set if the user has already scanned a candidate slip.  
  setScannedCandidateSlip: function (scannedCandidateSlip) {
    this.scannedCandidateSlip = scannedCandidateSlip;
  },

  // Check if the user has already scanned a candidate slip.  
  getScannedCandidateSlip : function () {
    return this.scannedCandidateSlip;
  },
  
  // Set the date that this slip was voted on.
  setDateVoted : function (dateVoted) {
    this.dateVoted = dateVoted;
  },
  
  // Get the date that this slip was voted on.
  getDateVoted : function () {
    return this.dateVoted;
  },
  
  // Set the location that this slip was voted at.
  setLocationVoted : function (locationVoted) {
    this.locationVoted = locationVoted;
  },
  
  // Get the location that this slip was voted at.
  getLocationVoted : function () {
    return this.locationVoted;
  }
});