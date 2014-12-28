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
 * LegislativeAssemblyVisualScreen - The visual screen class for the legislative assembly screen for the visual interface.
 * 
 * @author Peter Scheffer
 */
 
var LegislativeAssemblyVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    var audioScreenManager = container.Resolve("audioScreenManager");
    this._super(visualScreenManager, 'legislative_assembly_candidate_vote_screen', 
      this.initialiseLegislativeAssemblyBallotScreen,
      this.exitLegislativeAssemblyScreen,
      this.switchToAssemblyScreen);
  },
  
  initialiseLegislativeAssemblyBallotScreen: function () {
    
    var container = getContainer();
    var votingSession = container.Resolve("votingSession");
    var district = votingSession.getDistrict();
    $('#la_district_title').html(district);

    var isUncontested = votingSession.getDistrictIsUncontested();

    var assemblyBallotView = container.Resolve('assemblyBallotView');
    assemblyBallotView.attachButtonHandlers();
    assemblyBallotView.checkBtnVis();

    var audioController = container.Resolve("audioController");    
    
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('legislative_assembly_candidate_vote_screen');

    if (!isUncontested) {
      var visualView = container.Resolve("visualView");
      var legislativeAssemblyBallot = container.Resolve("assembly");

      screenObject.addAssemblyCandidateDataToPage();

      var candidates = legislativeAssemblyBallot.getCandidates();
      for (var index = 0; index < legislativeAssemblyBallot.getNumberOfCandidates(); index++) {
        var candidate = legislativeAssemblyBallot.getCandidateByIndex(index);
        var selectionNumber = legislativeAssemblyBallot.getBallotSelectionNumber(candidate);
        visualView.setBallotSelectionNumber(candidate, selectionNumber);
      }

      // Play audio instructions for this screen if it's the first time visiting it.
      if (!screenObject.hasVisited() && audioController.getUsingAudioMode()) {
        var audioClips = getVisualUiIntroductionAudio('legislative_assembly_candidate_vote_popup');
        if (audioClips != null && audioClips.length > 0) {
          var container = getContainer();
          audioController.playTranslatedAudio(audioClips, false);
        }
      }  

      $('#assembly_button_scroll_down').show();
      $('#assembly_button_scroll_up').show();
      $('#assembly_ballot_veil').hide();
      $('#assembly_ballot_content_inner').show();
      $('#assembly_speaker_icon').show();

      if (!screenObject.hasVisited()) {
        assemblyBallotView.showGestureVideo();
        $('#assembly_speaker_icon').click(function () {
          var container = getContainer();
          var audioController = container.Resolve("audioController");
          audioController.replayIntroAudio('legislative_assembly_candidate_vote_popup');
        });
      } else {
        $('#assembly_speaker_icon').click(function () {
          var container = getContainer();
          var audioController = container.Resolve("audioController");
          audioController.replayIntroAudio('legislative_assembly_candidate_vote_screen');
        });
      }

      visualView.playVideo("assembly_instructions_video", "videos/gesture_demonstration.ogv");
      
    // If the district is uncontested.
    } else {
      var languageDictionary = dictionaryOptions[getCurrentLanguageSelection()];
      var uncontestedMessage = $.i18n._(languageDictionary['district_uncontested']);
      var nextScreenMessage = $.i18n._(languageDictionary['uncontested_press_next_button']);
      
      $('#assembly_ballot_veil').html("<p>" + uncontestedMessage + "</p><p>" + nextScreenMessage + "</p>");
      $('#assembly_ballot_veil').show();      
      $('#assembly_ballot_content_inner').hide();
      $('#assembly_button_scroll_down').hide();
      $('#assembly_button_scroll_up').hide();
      $('#assembly_instruction_ok_button').click();
      
      $('#assembly_speaker_icon').click(function () {
        var audioClips = getUncontestedMessage();
        var container = getContainer();
        var audioController = container.Resolve("audioController");
        if (audioClips != null && audioClips.length > 0) {
          var container = getContainer();
          audioController.playTranslatedAudio(audioClips, false);
        }
      });

      if (!screenObject.hasVisited() && audioController.getUsingAudioMode()) {
        var audioClips = getUncontestedMessage();
        if (audioClips != null && audioClips.length > 0) {
          var container = getContainer();
          audioController.playTranslatedAudio(audioClips, false);
        }
      }  
    }
  },
  
  // Build the Assembly Ballot page using candidate data.
  addAssemblyCandidateDataToPage : function() {

    // Clear previous content.
    $('#assembly_ballot_content_inner').html("");
    
    var container = getContainer();
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var candidates = legislativeAssemblyBallot.getCandidates();
    
    var containerHeight = 0;
    
    for (var index = 0; index < candidates.length; index++) {
    
      var candidate = candidates[index];

      try {
        var id = candidate.getId();
        var name = candidate.getName();
        var party = candidate.getPartyName();
        var audioFileName = candidate.getAudioFileName();

        var m = document.createElement("div");
        m.id = 'ballot_group_aggregate_' + (index+1);
        m.className = 'ballot ballot_aggregate';

        var l = document.createElement("div");
        l.id = candidate.getBallotBoxId();
        l.title = name + " for " + party;
        l.className = 'ballot_box';
  
        var translations = dataContainer.Resolve("partyTranslationsData");
        var language = getCurrentLanguageSelection();
        var nameTranslation = translations.getPreferredName(language, party);
        var audioTranslationFile = translations.getAudioFile(language, party);
        var englishAudioTranslationFile = translations.getAudioFile("english", party);
        
        if (nameTranslation == null || nameTranslation == "") {
          nameTranslation = "&nbsp;";
        }

        if (party == null || party == "") {
          party = "&nbsp;";
        }

        var p = document.createElement("p");
        p.id = "assembly_party_popup_" + index;
        p.innerHTML = "<p>" + nameTranslation + "</p><p>" + name + "</p><p>" + party + "</p>";
        p.className = 'bubble';

        var i = document.createElement("div");
        i.id = 'candidate_name';
        i.className = 'candidate_name la';
        i.innerHTML = name;
        if (language != "english") {
          i.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioTranslationFile + "', '" + audioFileName + "'], '" + p.id + "', 'legislative_assembly_candidate_vote_screen');");
        } else {
          i.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioFileName + "'], '" + p.id + "', 'legislative_assembly_candidate_vote_screen');");
        }

        var h = document.createElement("div");
        h.id = 'candidate_party';
        h.className = 'candidate_party la';
        h.innerHTML = party;
        if (language != "english") {
          h.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioTranslationFile + "', '" + audioFileName + "'], '" + p.id + "', 'legislative_assembly_candidate_vote_screen');");
        } else {
          h.setAttribute('onclick', "(getContainer().Resolve('visualView')).showTranslationPopup(event, ['" + audioFileName + "'], '" + p.id + "', 'legislative_assembly_candidate_vote_screen');");
        }

        m.appendChild(l);
        m.appendChild(i);
        m.appendChild(document.createElement("br"));
        m.appendChild(h);
        m.appendChild(p);

        $('#assembly_ballot_content_inner').append(m);
        $('#' + candidate.getBallotBoxId()).bind('touchstart', function () {
          (container.Resolve('ballotManager')).ballotOptionPressed(LEGISLATIVE_ASSEMBLY_BALLOT, this.id);
        });

      } catch (error) {
        continue;
      }

      var aggregateHeight = $('#ballot_group_aggregate_' + (index + 1)).height();
      var topMargin = $('.ballot_aggregate').css('margin-top');
      topMargin = topMargin.substring(0, topMargin.length - 2);
      containerHeight = containerHeight + Number(aggregateHeight);
    }
      
    $('#assembly_ballot_content_inner').height(containerHeight);
  },

  exitLegislativeAssemblyScreen: function () {  
    var visualView = container.Resolve("visualView");
    visualView.stopVideo('ballot_gesture_video');
    var assemblyBallotView = container.Resolve('assemblyBallotView');
    assemblyBallotView.detachButtonHandlers();
  },  
  
  // Switch from Audio UI to Visual UI.  
  switchToAssemblyScreen: function () {
    var screenFactory = container.Resolve("screenFactory");
    var screenObject = screenFactory.getInstance('legislative_assembly_candidate_vote_screen');
    screenObject.setHasVisited(true);
    
    var audioController = container.Resolve("audioController");
    audioController.stopAudio();
    audioController.cancelRepeatInstructions();

    var visualView = container.Resolve("visualView");
    visualView.displaySection('audio_only_screen', 'legislative_assembly_candidate_vote_screen');
    $('#assembly_instruction_ok_button').click();
  }  
});