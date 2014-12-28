/**
 * The non-visual interface of the vVote application is driven by commands that are mapped onto specific user behaviour.
 * In this listing, commands are mapped onto gesture triggers created by hand gestures made on the touch screen interface.
 * 
 * @author <a href="mailto:peter.scheffer@vec.vic.gov.au">Peter Scheffer</a>
 * 
 */

var legislativeAssemblyBallot = new LegislativeAssemblyBallot();
var belowTheLineCouncilBallot = new BelowTheLineCouncilBallot();
var aboveTheLineCouncilBallot = new AboveTheLineCouncilBallot(); 
var audioController = new AudioController();

var blindInterfaceGestureCommands = {
    test_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'unavailableOption', screen: 'gesture_2', callback: audioController.unavailableOption },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    start_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'unavailableOption', screen: 'gesture_2', callback: audioController.unavailableOption },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'enterScreen', screen: 'welcome_screen', callback: audioController.enterScreen },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    welcome_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'unavailableOption', screen: 'gesture_2', callback: audioController.unavailableOption },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'enterScreen', screen: 'two_ballots_screen', callback: audioController.enterScreen }
    },
    two_ballots_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'enterScreen', screen: 'legislative_council_screen', callback: audioController.enterScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'enterScreen', screen: 'legislative_assembly_candidate_vote_screen', callback: audioController.enterScreen },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'playAssemblyBallotSummary', screen: 'legislative_assembly_summary_screen', callback: audioController.playAssemblyBallotSummary }
    },
    legislative_assembly_candidate_vote_screen : {
        gesture_1  : { request: 'unavailableOption', ballot: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'moveToPreviousCandidate', ballot: legislativeAssemblyBallot, callback: audioController.moveToCandidate },
        gesture_3  : { request: 'unavailableOption', ballot: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', ballot: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'selectCandidate', ballot: legislativeAssemblyBallot, callback: audioController.selectCurrentCandidate },
        gesture_6  : { request: 'enterScreen', screen: 'steve_moran_candidate_policy', callback: audioController.enterScreen },
        gesture_7  : { request: 'unavailableOption', ballot: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'moveToNextCandidate', ballot: legislativeAssemblyBallot, callback: audioController.moveToCandidate },
        gesture_9  : { request: 'unavailableOption', ballot: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'enterScreen', screen: 'help_screen', callback: audioController.enterScreen },
        gesture_12 : { request: 'enterScreen', screen: 'two_ballots_screen', callback: audioController.enterBallotSelectionScreen }
    },
    legislative_assembly_summary_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'enterScreen', screen: 'legislative_assembly_candidate_vote_screen', callback: audioController.enterScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'playCouncilBallotSummary', screen: 'legislative_council_summary_screen', callback: audioController.playCouncilBallotSummary },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    steve_moran_candidate_policy : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'enterScreen', screen: 'steve_moran_candidate_how_to_vote', callback: audioController.enterScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'enterScreen', screen: 'steve_moran_candidate_policy', callback: audioController.enterScreen },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'enterScreen', screen: 'legislative_assembly_candidate_vote_screen', callback: audioController.enterScreen },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    steve_moran_candidate_how_to_vote : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'useHowToVoteCard', ballot: legislativeAssemblyBallot, callback: audioController.usedHowToVoteCard },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'enterScreen', screen: 'legislative_assembly_candidate_vote_screen', callback: audioController.enterScreen },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    legislative_council_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'enterScreen', screen: 'legislative_council_group_vote_screen', callback: audioController.enterScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'enterScreen', screen: 'legislative_council_candidate_vote_screen', callback: audioController.enterScreen },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    legislative_council_group_vote_screen : {
        gesture_1  : { request: 'unavailableOption', ballot: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'moveToPreviousGroup', ballot: aboveTheLineCouncilBallot, callback: audioController.moveToGroup },
        gesture_3  : { request: 'unavailableOption', ballot: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', ballot: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'selectCandidate', ballot: aboveTheLineCouncilBallot, callback: audioController.selectCurrentGroup },
        gesture_6  : { request: 'enterScreen', screen: 'family_first_candidate_policy', callback: audioController.enterScreen },
        gesture_7  : { request: 'unavailableOption', ballot: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'moveToNextGroup', ballot: aboveTheLineCouncilBallot, callback: audioController.moveToGroup },
        gesture_9  : { request: 'unavailableOption', ballot: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'enterScreen', screen: 'help_screen', callback: audioController.enterScreen },
        gesture_12 : { request: 'enterScreen', screen: 'two_ballots_screen', callback: audioController.enterBallotSelectionScreen }
    },
    legislative_council_summary_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'enterScreen', screen: 'legislative_council_screen', callback: audioController.enterScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'enterScreen', screen: 'finalise_voting_screen', callback: audioController.enterScreen },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    legislative_council_candidate_vote_screen : {
        gesture_1  : { request: 'unavailableOption', ballot: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'moveToPreviousCandidate', ballot: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        gesture_3  : { request: 'unavailableOption', ballot: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'moveToPreviousGroupCandidate', ballot: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        gesture_5  : { request: 'selectCandidate', ballot: belowTheLineCouncilBallot, callback: audioController.selectCurrentCandidate },
        gesture_6  : { request: 'moveToNextGroupCandidate', ballot: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        gesture_7  : { request: 'unavailableOption', ballot: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'moveToNextCandidate', ballot: belowTheLineCouncilBallot, callback: audioController.moveToCandidate },
        gesture_9  : { request: 'unavailableOption', ballot: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'enterScreen', screen: 'help_screen', callback: audioController.enterScreen },
        gesture_12 : { request: 'enterScreen', screen: 'two_ballots_screen', callback: audioController.enterBallotSelectionScreen }
    },
    family_first_candidate_policy : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'enterScreen', screen: 'family_first_how_to_vote', callback: audioController.enterScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'enterScreen', screen: 'family_first_candidate_policy', callback: audioController.enterScreen },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'enterScreen', screen: 'legislative_council_group_vote_screen', callback: audioController.enterScreen },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    family_first_how_to_vote : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_2  : { request: 'useVoteTicket', ballot: belowTheLineCouncilBallot, callback: audioController.usedVoteTicket },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'enterScreen', screen: 'legislative_council_group_vote_screen', callback: audioController.enterScreen },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    finalise_voting_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'enterScreen', screen: 'two_ballots_screen', callback: audioController.enterBallotSelectionScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'finishedVoting', screen: 'finished_voting_screen', callback: audioController.finishedVoting },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    finished_voting_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'unavailableOption', screen: 'gesture_2', callback: audioController.unavailableOption },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'enterScreen', screen: 'start_screen', callback: audioController.enterScreen }
    },
    options_menu_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'unavailableOption', screen: 'gesture_2', callback: audioController.unavailableOption },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'goBackOneStep', screen: 'previous_screen', callback: audioController.enterScreen }
    },
    ballot_options_menu_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'unavailableOption', screen: 'gesture_2', callback: audioController.unavailableOption },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'goBackOneStep', screen: 'previous_screen', callback: audioController.enterScreen }
    },
    confirm_end_voting_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'enterScreen', screen: 'voting_ended_screen', callback: audioController.enterScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'enterScreen', screen: 'two_ballots_screen', callback: audioController.enterScreen },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    voting_ended_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'enterScreen', screen: 'start_screen', callback: audioController.enterScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    confirm_clear_ballot_screen : {
        gesture_1  : { request: 'confirmClearBallot', ballot: audioController.getCurrentBallot(), callback: audioController.confirmClearBallot },
        gesture_2  : { request: 'enterScreen', screen: 'options_menu_screen', callback: audioController.enterScreen },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'unavailableOption', screen: 'gesture_12', callback: audioController.unavailableOption }
    },
    help_screen : {
        gesture_1  : { request: 'unavailableOption', screen: 'gesture_1', callback: audioController.unavailableOption },
        gesture_2  : { request: 'unavailableOption', screen: 'gesture_2', callback: audioController.unavailableOption },
        gesture_3  : { request: 'unavailableOption', screen: 'gesture_3', callback: audioController.unavailableOption },
        gesture_4  : { request: 'unavailableOption', screen: 'gesture_4', callback: audioController.unavailableOption },
        gesture_5  : { request: 'unavailableOption', screen: 'gesture_5', callback: audioController.unavailableOption },
        gesture_6  : { request: 'unavailableOption', screen: 'gesture_6', callback: audioController.unavailableOption },
        gesture_7  : { request: 'unavailableOption', screen: 'gesture_7', callback: audioController.unavailableOption },
        gesture_8  : { request: 'unavailableOption', screen: 'gesture_8', callback: audioController.unavailableOption },
        gesture_9  : { request: 'unavailableOption', screen: 'gesture_9', callback: audioController.unavailableOption },
        gesture_10 : { request: 'unavailableOption', screen: 'gesture_10', callback: audioController.unavailableOption },
        gesture_11 : { request: 'unavailableOption', screen: 'gesture_11', callback: audioController.unavailableOption },
        gesture_12 : { request: 'goBackOneStep', screen: 'previous_screen', callback: audioController.enterScreen }
    }
};