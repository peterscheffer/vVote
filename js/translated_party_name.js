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
 * TranslatedParty class.
 * Represents the audio and visual representation of a party name in a translated language.
 * 
 * @author Peter Scheffer
 */
var TranslatedParty = Class.extend({
  
  init: function (data) {
    this.translations = data["parties"];
  },
  
  getPreferredName : function (language, partyId) {
    var translatedName = "";
    for (key in this.translations) {
      var id = this.translations[key].id;
      if (id == null) {
        continue;
      }
      
      if (id.toLowerCase() == partyId.toLowerCase()) {
        translatedName = this.translations[key]["preferredName"][language];
        break;
      }
    }
    
    return translatedName;
  },
  
  getAudioFile : function (language, partyId) {
  
    if (partyId == null) {
      return "";
    }
  
    var translatedName = "";
    for (key in this.translations) {
      var id = this.translations[key].id;
      if (id == null) {
        continue;
      }
      
      if (id.toLowerCase() == partyId.toLowerCase()) {
        translatedName = this.translations[key]["audio"][language];
        break;
      }
    }
    
    return translatedName;
  }
});