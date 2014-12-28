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
 * VotingSession class.
 * Represents a voter's voting session once they have scanned their QR code.
 * We use the term "uncontested region" whereas actually this flags a by-election. 
 * It's just simpler to understand the term "uncontested region" to mean "there's no region ballot in this voting session".
 * 
 * @author Peter Scheffer
 */
var VotingSession = Class.extend({
  
  init: function () {
    this.region = null;
    this.district = null;
    this.districtAudioFile = null;
    this.districtIsUncontested = null;
    this.regionIsUncontested = null;
    this.uncontestMessage = null;
    this.uncontestMessageAudio = null;
    this.vote = null;
    this.language = null;
    this.timeout = null;
    this.inactivityTimer = null;
    this.inactivityCounterTimeout = null;
    this.auiInactivityTimer = null;
    this.auiInactivityCounterTimeout = null;
    this.userAlertedOfTimeout = null;
    this.countdownTimeout = null;
    this.inactivityResetTimer = null;
    this.inactivityCounterReset = null;
    this.countdownReset = null;
    this.isVisualMode = false;
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
  
  // flag for whether the district is uncontested.
  setDistrictIsUncontested: function (districtIsUncontested) {
    this.districtIsUncontested = districtIsUncontested;
  },
  
  // flag for whether the district is uncontested.
  getDistrictIsUncontested: function () {
    return this.districtIsUncontested;
  },
  
  // flag for whether the region is uncontested.
  setRegionIsUncontested: function (regionIsUncontested) {
    this.regionIsUncontested = regionIsUncontested;
  },
  
  // flag for whether the region is uncontested.
  getRegionIsUncontested: function () {
    return this.regionIsUncontested;
  },

  // reason why the ballot is uncontested. 
  // must pass in language type to select the correct message.
  getUncontestedMessage: function (language) {
    var languageDictionary = dictionaryOptions[language];
    var uncontestedMessage = $.i18n._(languageDictionary['district_uncontested']);
    return uncontestedMessage;
  },

  // The number of candidates listed in the assembly ballot.
  setMaximumNumberOfAssemblyCandidates: function (maximumAssemblyCandidates) {
    this.maximumAssemblyCandidates = maximumAssemblyCandidates;
  },
  
  // The number of candidates listed in the assembly ballot.
  getMaximumNumberOfAssemblyCandidates: function () {
    return this.maximumAssemblyCandidates;
  },
  
  // The number of candidates listed in the council ballot.
  setMaximumNumberOfCouncilCandidates: function (maximumNumberOfCouncilCandidates) {
    this.maximumNumberOfCouncilCandidates = maximumNumberOfCouncilCandidates;
  },
  
  // The number of candidates listed in the council ballot.
  getMaximumNumberOfCouncilCandidates: function () {
    return this.maximumNumberOfCouncilCandidates;
  },
  
  // The number of groups listed in the council ballot.
  setMaximumNumberOfGroups: function (maximumNumberOfGroups) {
    this.maximumNumberOfGroups = maximumNumberOfGroups;
  },
  
  // The number of groups listed in the council ballot.
  getMaximumNumberOfGroups: function () {
    return this.maximumNumberOfGroups;
  },
  
  // QR candidate list signature.
  setSignature: function (signature) {
    this.signature = signature;
  },
  
  // QR candidate list signature.
  getSignature: function () {
    return this.signature;
  },
  
  // Start EVM signature.
  setStartEvmSignature: function (startEvmSignature) {
    this.startEvmSignature = startEvmSignature;
  },
  
  // Start EVM signature.
  getStartEvmSignature: function () {
    return this.startEvmSignature;
  },
  
  // Confirmation vote submission signature.
  setConfirmationSignature: function (confirmationSignature) {
    this.confirmationSignature = confirmationSignature;
  },
  
  // Confirmation vote submission signature.
  getConfirmationSignature: function () {
    return this.confirmationSignature;
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
  
  getVote: function () {
    return this.vote;
  },
  
  setFontSize: function (fontSize) {
    this.fontSize = fontSize;
  },
  
  getFontSize: function () {
    return this.fontSize;
  },
  
  setQrFontSize: function (fontSize) {
    this.qrFontSize = fontSize;
  },
  
  getQrFontSize: function () {
    return this.qrFontSize;
  },
  
  setDistrictAudioFile: function (districtAudioFile) {
    this.districtAudioFile = districtAudioFile;
  },
  
  getDistrictAudioFile: function () {
    return this.districtAudioFile;
  },
  
  setRegionAudioFile: function (regionAudioFile) {
    this.regionAudioFile = regionAudioFile;
  },
  
  getRegionAudioFile: function () {
    return this.regionAudioFile;
  },
  
  setLanguage: function (language) {
    this.language = language;
  },
  
  getLanguage: function () {
    return this.language;
  },
  
  setTimeout: function (timeout) {
    this.timeout = timeout;
  },
  
  getTimeout: function () {
    return this.timeout;
  },
  
  setInactivityTimer: function (inactivityTimer) {
    this.inactivityTimer = inactivityTimer;
  },
  
  getInactivityTimer: function () {
    return this.inactivityTimer;
  },
  
  setInactivityCounterTimer: function (inactivityCounterTimeout) {
    this.inactivityCounterTimeout = inactivityCounterTimeout;
  },
  
  getInactivityCounterTimer: function () {
    return this.inactivityCounterTimeout;
  },
  
  setAuiInactivityCounterTimer: function (auiInactivityCounterTimeout) {
    this.auiInactivityCounterTimeout = auiInactivityCounterTimeout;
  },
  
  getAuiInactivityCounterTimer: function () {
    return this.auiInactivityCounterTimeout;
  },
  
  setAuiInactivityTimer: function (auiInactivityTimer) {
    this.auiInactivityTimer = auiInactivityTimer;
  },
  
  getAuiInactivityTimer: function () {
    return this.auiInactivityTimer;
  },
  
  setUserAlertedOfTimeout: function (userAlertedOfTimeout) {
    this.userAlertedOfTimeout = userAlertedOfTimeout;
  },
  
  getUserAlertedOfTimeout: function () {
    return this.userAlertedOfTimeout;
  },
  
  setCountdownTimeout: function (countdownTimeout) {
    this.countdownTimeout = countdownTimeout;
  },
  
  getCountdownTimeout: function () {
    return this.countdownTimeout;
  },
  
  setInactivityResetTimer: function (inactivityResetTimer) {
    this.inactivityResetTimer = inactivityResetTimer;
  },
  
  getInactivityResetTimer: function () {
    return this.inactivityResetTimer;
  },
  
  setInactivityCounterReset: function (inactivityCounterReset) {
    this.inactivityCounterReset = inactivityCounterReset;
  },
  
  getInactivityCounterReset: function () {
    return this.inactivityCounterReset;
  },
  
  setCountdownReset: function (countdownReset) {
    this.countdownReset = countdownReset;
  },
  
  getCountdownReset: function () {
    return this.countdownReset;
  },
  
  setIsVisualMode: function(isVisualMode) {
    this.isVisualMode = isVisualMode;
  },
  
  getIsVisualMode: function () {
    return this.isVisualMode;
  }
});