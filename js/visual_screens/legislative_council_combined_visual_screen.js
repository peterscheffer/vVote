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
 * LegislativeCouncilCombinedVisualScreen - The visual screen class for the legislative council screen for the visual interface.
 * 
 * @author Peter Scheffer
 */

var LegislativeCouncilCombinedVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");                     
    this._super(visualScreenManager, 'legislative_council_combined_screen', 
      this.initialiseLegislativeCouncilCombinedScreen,
      this.exitLegislativeCouncilCombinedScreen,
      this.switchToCouncilScreen);
  },
  
  initialiseLegislativeCouncilCombinedScreen: function () {

    var votingSession = container.Resolve("votingSession");
    var region = votingSession.getRegion();
    $('#lc_region_title').html(region);

    var visualView = container.Resolve("visualView");
    var visualController = container.Resolve("visualController");
    var combinedCouncilView = container.Resolve("combined");

    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('legislative_council_combined_screen');
    
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var belowTheLineCouncilBallot = container.Resolve("btl");

    screenObject.addCouncilGroupDataToPage();
    screenObject.addCouncilCandidateDataToPage();
   
    var groups = aboveTheLineCouncilBallot.getGroups();        
    for (var index = 1; index <= aboveTheLineCouncilBallot.getNumberOfPartyGroups(); index++) {
      var group = aboveTheLineCouncilBallot.getGroupByIndex(index - 1);
      var selectionNumber = aboveTheLineCouncilBallot.getBallotSelectionNumber(group);
      visualView.setBallotSelectionNumber(group, selectionNumber);
    }

    var candidates = belowTheLineCouncilBallot.getCandidates();
    for (var index2 = 0; index2 < candidates.length; index2++) {
      var candidate = candidates[index2];
      var selectionNumber = belowTheLineCouncilBallot.getBallotSelectionNumber(candidate);
      visualView.setBallotSelectionNumber(candidate, selectionNumber);
    }

    $("#ballot_combined_gesture_video").show(400);       
    $("#ballot_combined_gesture_video").css('visibility', 'visible');
    
    visualView.playVideo("ballot_combined_gesture_video", "videos/lc_combined.ogv");
    
    combinedCouncilView.attachButtonHandlers();

    attachLoggingHandlersToLCBallot();

    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('legislative_council_combined_screen');

    // Play audio instructions for this screen if it's the first time visiting it.
    var audioController = container.Resolve("audioController");    
    var visualScreenManager = container.Resolve("visualScreenManager");
    var aboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine();
    
    if (aboveOrBelow == "above") {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('legislative_council_combined_screen');

      if (audioController.getUsingAudioMode() && !screenObject.hasVisited()) {
        var audioClips = getVisualUiIntroductionAudio('legislative_council_combined_atl_screen');
        if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
          audioController.playTranslatedAudio(audioClips, false);
        }
      }
    } else {
      var screenFactory = container.Resolve("screenFactory");
      var screenObject = screenFactory.getInstance('legislative_council_combined_screen');

      if (audioController.getUsingAudioMode() && !screenObject.hasVisited()) {
        var audioClips = getVisualUiIntroductionAudio('legislative_council_combined_btl_screen');
        if (audioClips != null && audioClips.length > 0 && audioController.getUsingAudioMode()) {
          audioController.playTranslatedAudio(audioClips, false);
        }
      }
    }


    var visualScreenManager = container.Resolve("visualScreenManager");
    var userVotedAboveOrBelow = visualScreenManager.getUserVotedAboveOrBelowTheLine(); 
    if (userVotedAboveOrBelow == "above") {
      (new CombinedCouncilView()).displayAboveTheLineSection();
    } else {
      (new CombinedCouncilView()).displayBelowTheLineSection();
    }
  },
  
  // Build the Above The Line Council Ballot page using party group data.
  addCouncilGroupDataToPage : function() {

    var container = getContainer();
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var parties = aboveTheLineCouncilBallot.getPartyGroupListing();

    var ballotWidth = 0;
    var adjustmentFactor = 0;
    var totalAdjustmentFactor = 0;
    
    if ($("#font_size_styles").attr('href') == "css/styles_medium.css") { 
      adjustmentFactor = 170;
    } else {
      adjustmentFactor = 250;
    }

    // Clear previous content
    $('#ballot_groups_content_inner').html("");

    for (var index = 0 ; index < parties.length; index++) {
      var party = parties[index];
      
      try {
        var id = party.getId();
        var name = party.getName();
        var hasBallotBox = party.getHasBallotBox();
        var unnamed = party.getIsUnnamed();
        var translations = dataContainer.Resolve("partyTranslationsData");
        var audioFileName = party.getAudioFileName();
        var language = getCurrentLanguageSelection();
        var nameTranslation = translations.getPreferredName(language, name);
        var audioTranslationFile = translations.getAudioFile(language, name);

        var p = document.createElement("p");
        p.id = "council_party_popup_" + index;
        p.innerHTML = "<p>" + nameTranslation + "</p><p>" + name + "</p>";
        p.className = 'bubble';

        var n = document.createElement("div");
        n.id = 'ballot_paper_group_' + (index + 1);
        n.className = 'group_ballot';
        n.style.cssFloat = 'left';

        var groupLetter = document.createElement("div");

        if (hasBallotBox) {
          groupLetter.innerHTML = party.getBallotBoxLetter();
        } else {
          groupLetter.innerHTML = "&nbsp;";
        }
        
        groupLetter.className = 'group_letter';

        var m = document.createElement("div");
        m.id = 'ballot_aggregate_' + (index + 1);
        m.className = 'ballot group_box';

        m.appendChild(groupLetter);
        
        if (hasBallotBox) {
          var l = document.createElement("div");
          l.id = party.getBallotBoxId();
          l.title = name;
          l.className = 'ballot_box atl_box';
          m.appendChild(l);          
          party.setBallotBoxId(l.id);
        } else {
          var l = document.createElement("div");
          l.id = party.getBallotBoxId();
          l.title = name;
          l.className = 'ballot_box atl_box';
          l.style.border = 'none';
          m.appendChild(l);          
        }

        var k = document.createElement("div");
        k.className = 'group_name_lc group_box_name';
        k.id = 'group_candidate_name_' + index;
        k.innerHTML = name;
        
        var isUngrouped = party.getIsUngrouped();
        
        // If they don't have a ballot box (haven't provided a ticket), then they don't get a name above the line.
        if (!hasBallotBox && !isUngrouped) {
          k.style.visibility = 'hidden';
        } else if (unnamed == true) {
          k.style.visibility = 'hidden';
        }
        
        if (language != "english") {
          k.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioTranslationFile + "', '" + audioFileName + "'], '" + p.id + "', 'legislative_council_group_screen');");
        } else {
          k.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioFileName + "'], '" + p.id + "', 'legislative_council_group_screen');");
        }
        
        m.appendChild(k);
        n.appendChild(m);
        m.appendChild(p);
        
        var spacerDiv = document.createElement("div");
        spacerDiv.className = 'atl_btl_spacer_div';
        n.appendChild(spacerDiv);

        $('#ballot_groups_content_inner').append(n);
        $('#' + party.getBallotBoxId()).bind('touchstart', function () {
          (container.Resolve('ballotManager')).ballotOptionPressed(LEGISLATIVE_COUNCIL_GROUP_BALLOT, this.id);
        });

      } catch (error) {
        continue;
      }
    }

    var j = document.createElement("div");
    j.setAttribute('style', 'width: 100px');
    j.innerHTML = '&nbsp;';
    $('#ballot_groups_content_inner').append(j);
  },
  
  // Build the Below The Line Council Ballot page using region candidate data.
  addPartyGroupCandidatesToPage : function(partyGroup, candidateIndex, partyIndex) {

    var id = partyGroup.getId();
    var name = partyGroup.getName();
    var isUngrouped = partyGroup.getIsUngrouped();

    var ungroupedTitleSet = false;
    var candidates = partyGroup.getCandidates();

    for (var index = 0; index < candidates.length; index++) {
      candidateIndex++;
      var candidate = candidates[index];

      if (!(candidate.typeOf && candidate.typeOf() == "Candidate")) {
        continue;
      }

      var audioFileName = candidate.getAudioFileName();        
      var container = getContainer();
      var translations = dataContainer.Resolve("partyTranslationsData");
      var language = getCurrentLanguageSelection();
      var nameTranslation = translations.getPreferredName(language, candidate.getPartyName());
      var audioTranslationFile = translations.getAudioFile(language, candidate.getPartyName());
      var englishAudioTranslationFile = translations.getAudioFile("english", candidate.getPartyName());
      
      if (nameTranslation == null || nameTranslation == "") {
        nameTranslation = "&nbsp;";
      }
      
      var candidatePartyName = candidate.getPartyName();
      if (candidatePartyName == null || candidatePartyName == "") {
        candidatePartyName = "&nbsp;";
      }
      
      var candidateRegion = candidate.getRegion();
      if (candidateRegion == null || candidateRegion == "") {
        candidateRegion = "&nbsp;";
      }

      var p = document.createElement("p");
      p.id = "council_candidate_popup_" + candidateIndex;
      p.innerHTML = "<p>" + nameTranslation + "</p><p>" + candidate.getName() + "</p><p>" + candidatePartyName + "</p><p>" + candidateRegion + "</p>";
      p.className = 'bubble';

      if (isUngrouped && !ungroupedTitleSet) {
        ungroupedTitleSet = true;
        var m = document.createElement("h3");
        m.innerHTML = candidate.getPartyName();
        m.setAttribute('style', 'margin-bottom:15px');
      }

      var l = document.createElement("div");
      l.id = 'ballot_candidate_aggregate_' + index;
      l.className = 'btl_ballot';

      var k = document.createElement("div");

      k.id = candidate.getBallotBoxId();
      k.title = candidate.getName() + ' for ' + candidate.getPartyName();
      k.className = 'ballot_box btl_box';

      var j = document.createElement("div");
      j.className = 'candidate_details';

      var i = document.createElement("div");
      i.id = 'candidate_name';
      i.className = 'candidate_name_lc';
      i.innerHTML = candidate.getName();
      if (language != "english") {
        i.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioTranslationFile + "', '" + audioFileName + "'], '" + p.id + "', 'legislative_council_candidate_screen');");
      } else {
        i.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioFileName + "'], '" + p.id + "', 'legislative_council_candidate_screen');");
      }

      var h = document.createElement("div");
      h.id = 'candidate_party';
      h.className = 'candidate_party_lc';
      h.innerHTML = candidate.getPartyName();
      if (language != "english") {
        h.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioTranslationFile + "', '" + audioFileName + "'], '" + p.id + "', 'legislative_council_candidate_screen');");
      } else {
        h.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioFileName + "'], '" + p.id + "', 'legislative_council_candidate_screen');");
      }

      var g = document.createElement("div");
      g.id = 'candidate_region';
      g.className = 'candidate_region_lc';
      g.innerHTML = candidate.getRegion();
      if (language != "english") {
        g.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioTranslationFile + "', '" + audioFileName + "', '" + englishAudioTranslationFile + "'], '" + p.id + "', 'legislative_council_candidate_screen');");
      } else {
        g.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioFileName + "'], '" + p.id + "', 'legislative_council_candidate_screen');");
      }

      j.appendChild(i);
      j.appendChild(document.createElement("br"));
 
      if (candidate.getPartyName() != null && candidate.getPartyName() != "") {
        j.appendChild(h);
        j.appendChild(document.createElement("br"));
      }
      
      j.appendChild(g);

      l.appendChild(k);
      l.appendChild(j);

      $('#ballot_paper_group_' + partyIndex).append(l);
      $('#ballot_paper_group_' + partyIndex).append(p);
      $('#' + candidate.getBallotBoxId()).bind('touchstart', function () {
        (container.Resolve('ballotManager')).ballotOptionPressed(LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT, this.id);
      });
    }

    return candidateIndex;
  },
  
  // Build the Below The Line Council Ballot page using candidate data.
  addCouncilCandidateDataToPage : function() {
    
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var votingSession = container.Resolve("votingSession");
    var maximumNumberOfGroups = votingSession.getMaximumNumberOfGroups();

    var belowTheLineCouncilBallot = container.Resolve("btl");
    var parties = belowTheLineCouncilBallot.getPartyGroups();
    
    var ballotWidth = 0;

    // Clear previous content
    $('#ballot_candidates_content_inner').html("");

    var index = 1;
    for (var index2 = 1; index2 < parties.length; index2++) {
      var party = parties[index2];
      index = this.addPartyGroupCandidatesToPage(party, index, index2);
      
      ballotWidth = ballotWidth + $("#ballot_paper_group_" + index2).width();
    }
    
    ballotWidth = ballotWidth + 500;        // margin/padding inclusion.

    if ($("#font_size_styles").attr('href') == "css/styles_medium.css") { 
      $('#ballot_combined_content').width(1850);
      $('#ballot_groups_content_inner').width(ballotWidth + 200);
      $('#atl_btl_switch_bar').width(ballotWidth + 400);
      $('#btl_atl_switch_bar').width(ballotWidth + 400);
    } else {
      $('#ballot_combined_content').width(1800);
      $('#ballot_groups_content_inner').width(ballotWidth + 300);
      $('#atl_btl_switch_bar').width(ballotWidth + 600);
      $('#btl_atl_switch_bar').width(ballotWidth + 600);
    }

    var f = document.createElement("div");
    f.setAttribute('style', 'width: 100px');
    f.innerHTML = '&nbsp;';
    $('#ballot_candidates_content_inner').append(f);
  },
  
  exitLegislativeCouncilCombinedScreen: function () {
    var visualView = container.Resolve("visualView");
    visualView.stopVideo('ballot_combined_gesture_video');
    var combinedBallotView = container.Resolve('combined');
    combinedBallotView.detachButtonHandlers();
    $("#ballot_combined_content").scrollLeft(0);
    $("#ballot_combined_content").scrollTop(0);
  },
  
  // Switch from Audio UI to Visual UI.  
  switchToCouncilScreen: function () {
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();

    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('legislative_council_combined_screen');
    screenObject.setHasVisited(true);

    var audioScreenManager = container.Resolve("audioScreenManager");

    var userVotedAboveOrBelow = audioScreenManager.getUserVotedAboveOrBelowTheLine(); 
    var visualScreenManager = container.Resolve("visualScreenManager");
    visualScreenManager.setUserVotedAboveOrBelowTheLine(userVotedAboveOrBelow);

    var visualView = container.Resolve("visualView");
    visualView.displaySection('audio_only_screen', 'legislative_council_combined_screen');
    
    if (userVotedAboveOrBelow == "above") {
      $("#atl_button_div").click();
    } else if (userVotedAboveOrBelow == "below") {
      $("#btl_button_div").click();
    }

    // Need to stop audio again for having clicked the switch button.    
    audioController.stopAudio();

    $('#council_instruction_ok_button').click();
  }
});