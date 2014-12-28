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
 * Core functionality to drive the vVote application.
 *
 * @author Peter Scheffer
 */

/**
 * The application flags are managed here to define what platform and presentation is applied.
 */

var using_fake_data = false;

// Are we developing the app?
var devMode = getUrlParam('devMode');
if (devMode != "true") {
    devMode = false;
}

// Are we developing on the Android tablet?
var isAndroid = false;

if (navigator.userAgent.indexOf("Android") > 0) {
    isAndroid = true;
}

// touch sensitive device has a specific set of handlers and behaviours.
var isTouchSensitive = testIsTouchSensitive();

// Different behaviour running on a web server instead of directly from the file system.
var run_on_webserver = (location.protocol.indexOf("http") == 0);

// Are we using gesture-based UI?
var usingGesture = true;

// Are we debugging the audio UI and showing all function calling info?
var debugAudio = false;

// flag to test whether the user is currently touching the touch screen.
var touching = null;

// has the application been fully initialised yet?
var appInitialised = false;

// is the app running in GVS mode?
var gvsMode = false;

// is the app running in GVS mode?
var tvsMode = false;

// Is the AUI screen locked?
var auiScreenLocked = false;

// Countdown to 0 timeout warning.
var timeoutCounter = 10;

var lastButtonList = new Array();
var lastButtonTime = null;

var repeatInstructionsTimeout;

var alertDelayedTimeout;

var barcodeTimeout = null;

// Countdown timeout for inactivity for VIS.
var inactivityCounterTimeout;

// Counter for 10 - 0 second count down.
var countdownTimeout;

// Measure the period of inactivity for AUI.
// var auiInactivityTimeout;

// Countdown to 0 timeout warning.
var resetCounter = 10;

// Measure the period of inactivity;
var inactivityCounterReset;

// Counter for 10 - 0 second count down.
var countdownReset;

// What was the last screen shown before the reset lock screen (to return to it.)
var preResetScreen = null;

var screenAssoc = {};

// Array of all audio clips used in the application.
var audioArray = new Array();

// The range of available languages.
var languageOptions = new Array();

// Default language.
var languageSelection = "english";

// Language before switch.
var previousLanguageSelection = null;

// The list of language dictionaries, according to language.
var dictionaryOptions = new Array();

// The configuration data specific to languages.
var languagesConfig = new Array();

// The list of onscreen elements that need conversion.
var textForConversionArray = new Array();

function testIsTouchSensitive() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

// Dependency Injection container for standard app objects.
var container;
var containerBuilder;

// Dependency Injection container for standard app data.
var dataContainer;
var dataContainerBuilder;

// Function to get the dependency injection container.
var getContainer = function() {
    return container;
}
// Function to get the dependency injection container.
var getDataContainer = function() {
    return dataContainer;
}
// Get the current language selection.
function getCurrentLanguageSelection() {
    return languageSelection;
}

// Configure global variables using dependency injection framework.
function setupApplicationContainer() {

    // Screen Factory Singleton.
    containerBuilder.Register("screenFactory", function(c) {
        return new ScreenFactory();
    }).Reused();

    // Audio Screen Factory Singleton.
    containerBuilder.Register("audioScreenFactory", function(c) {
        return new AudioScreenFactory();
    }).Reused();

    // Legislative Assembly (Lower House) Ballot Singleton.
    containerBuilder.Register("assembly", function(c) {
        return new LegislativeAssemblyBallot();
    }).Reused();

    // Legislative Council (Upper House) "Above The Line" Ballot Singleton.
    containerBuilder.Register("atl", function(c) {
        return new AboveTheLineCouncilBallot();
    }).Reused();

    // Legislative Council (Upper House) "Below The Line" Ballot Singleton.
    containerBuilder.Register("btl", function(c) {
        return new BelowTheLineCouncilBallot();
    }).Reused();

    // Combined Council Ballot Screen
    containerBuilder.Register("combined", function(c) {
        var combined = new CombinedCouncilView();
        $(combined).bind("quitCombinedCouncilView", combined.quitCombinedCouncilViewHandler);
        return combined;
    }).Reused();

    // Review Ballots Screen
    containerBuilder.Register("review", function(c) {
        return new ReviewBallotsView();
    }).Reused();

    // Legislative Assembly Ballot Screen
    containerBuilder.Register("assemblyBallotView", function(c) {
        return new LegislativeAssemblyBallotView();
    }).Reused();

    // Confirm Selections Screen
    containerBuilder.Register("confirmSelectionsView", function(c) {
        return new ConfirmSelectionsView();
    }).Reused();

    // Audio Screen Manager Singleton.
    containerBuilder.Register("audioScreenManager", function(c) {
        return new AudioScreenManager(usingGesture);
    }).Reused();

    // Visual Screen Manager Singleton.
    containerBuilder.Register("visualScreenManager", function() {
        return new VisualScreenManager();
    }).Reused();

    // Visual Controller Singleton.
    containerBuilder.Register("visualController", function() {
        return new VisualController();
    }).Reused();

    // Visual View Singleton.
    containerBuilder.Register("visualView", function() {
        return new VisualView();
    }).Reused();

    // Options Manager Singleton.
    containerBuilder.Register("optionsManager", function(c) {
        return new OptionsManager();
    }).Reused();

    // Ballot Manager Singleton.
    containerBuilder.Register("ballotManager", function(c) {
        return new BallotManager();
    }).Reused();

    // Audio Controller Singleton.
    containerBuilder.Register("audioController", function(c) {
        return new AudioController();
    }).Reused();

    // Audio View Singleton.
    containerBuilder.Register("audioView", function(c) {
        return new AudioView();
    }).Reused();

    // Blind Interface Navigation using buttons Singleton.
    containerBuilder.Register("blindInterfaceButtonNavigation", function(c) {
        return new BlindInterfaceButtonNavigation();
    }).Reused();

    // Blind Interface Navigation using gestures Singleton.
    containerBuilder.Register("blindInterfaceGestureNavigation", function(c) {
        return new BlindInterfaceGestureNavigation();
    }).Reused();

    containerBuilder.Register("votingSession", function(c) {
        return new VotingSession();
    }).Reused();

    containerBuilder.Register("readbackSession", function(c) {
        return new ReadbackSession();
    }).Reused();

    containerBuilder.Register("currentAudio", function(c) {
        return new CurrentAudio();
    }).Reused();
}

function displayFirstScreen() {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    if (currentVisualInterfaceScreen != null && currentVisualInterfaceScreen != "") {
        var visualView = container.Resolve('visualView');
        visualView.displaySection(currentVisualInterfaceScreen, 'triage_screen');
    } else {
        var screenFactory = container.Resolve("screenFactory");
        var triageScreen = screenFactory.getInstance("triage_screen");
        triageScreen.initialiseTriageScreen();
    }
}

/**
 * Load candidate data into the application.
 */
// Get all nominations data.
function getNominationsData() {
    try {
        $.getJSON('bundle/region_district_candidate_data.txt', function(data) {
            receivedNominationsData(null, data);
        }).error(function() {
            alert('ERROR: JSON Election Data is not valid.');
        });
    } catch (error) {
        alert("Error reading nominations data: " + error);
    }
}

// Once we have the data and the document is ready, start building the UI.
function receivedNominationsData(event, data) {

    // Store the complete set of nominations data once.
    dataContainerBuilder.Register("nominationsData", function(c) {
        return data;
    }).Reused();

    getPartyTranslationData();
}

/**
 * Load party translation data into the application.
 */
// Get all nominations data.
function getPartyTranslationData() {
    try {
        $.getJSON('bundle/region_district_translation_data.txt', function(data) {
            receivedPartyTranslationData(null, data);
        }).error(function() {
            alert('ERROR: JSON Party Translation Data is not valid.');
        });
    } catch (error) {
        alert("Error reading party translation data: " + error);
    }
}

function receivedPartyTranslationData(event, data) {

    dataContainerBuilder.Register("partyTranslationsData", function(c) {
        var trans = new TranslatedParty(data);
        return trans;
    }).Reused();

    dataContainer = dataContainerBuilder.Create();
}

/**
 * Load audio configuration data into the application.
 */
// Get all audio clip configuration information.
function getAudioConfiguration() {
    try {
        $.getJSON('data/audio_config.txt', function(data) {
            receivedAudioConfig(null, data);
        }).error(function() {
            alert('ERROR: JSON Audio Configuration is not valid.');
        });
    } catch (error) {
        alert("Error reading audio configuration: " + error);
    }
}

// Once we have the data and the document is ready, load the audio array.
function receivedAudioConfig(event, data) {
    audioArray = data["clips"];
}

/**
 * Load language data into the application.
 */
// Get all language data.
function getLanguageData() {
    try {
        $.getJSON('data/language_config.txt', function(data) {
            receivedLanguageConfig(null, data);
        }).error(function() {
            alert('ERROR: JSON Language Data is not valid.');
        });
    } catch (error) {
        alert("Error reading language data: " + error);
    }
}

// Once we have the data and the document is ready, load the language dictionaries.
function receivedLanguageConfig(event, data) {

    languagesConfig = data["languages"];
    var index = 1;
    for (key in languagesConfig) {
        var language = languagesConfig[key]["language"];
        languageOptions[index++] = language;

        var language_dictionary = languagesConfig[key]["dictionary"];
        for (key2 in data["dictionaries"]) {
            var dictionary = data["dictionaries"][key]["dictionary"];
            if (dictionary == language_dictionary) {
                dictionaryOptions[language] = data["dictionaries"][key]["translations"];
            }
        }

        if (language != null && dictionaryOptions[language] == null) {
            alert("Dictionary missing in configuration file for " + language);
            return;
        }
    }

    var textLabelsForConversion = data["conversion_labels"];
    for (key in textLabelsForConversion) {
        textForConversionArray.push(key);
    }

    // initialise on startup with English text strings.
    changeLanguage("english");

    displayFirstScreen();

    getNominationsData();
}

var quit = function(currentScreen) {
    var container = getContainer();
    var visualView = container.Resolve('visualView');
    visualView.closeQuitConfirmation();
    displayFirstScreen();
}

// Utility function to retrieve a parameter from the URL.
function getUrlParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);

    var results = regex.exec(window.location.href);

    if (results == null) {
        return "";
    } else {
        return results[1];
    }
}

function setBallotDrawData(district, region) {

    var container = getContainer();
    var dataContainer = getDataContainer();
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var belowTheLineCouncilBallot = container.Resolve("btl");
    var votingSession = container.Resolve("votingSession");

    var nominationsData = dataContainer.Resolve("nominationsData");
    var regionData = null;

    for (key in nominationsData) {
        var regionName = nominationsData[key]["region"];
        if (regionName == region) {
            regionData = nominationsData[key];
            break;
        }
    }

    var districtsData = regionData["districts"];
    var councilNominationsData = regionData["parties"];
    var regionIsUncontested = regionData["no_race"];
    if (regionIsUncontested == null) {
        regionIsUncontested = false;
    }
    votingSession.setRegionIsUncontested(regionIsUncontested);

    var regionAudioFile = regionData["locationAudio"];
    votingSession.setRegionAudioFile(regionAudioFile);

    var assemblyNominationsData = null;
    var districtObject = null;

    // Find the relevant district. Save the nominations data.
    for (key in districtsData) {
        districtObject = districtsData[key];
        if (districtObject["district"] == district) {
            var districtIsUncontested = districtObject["uncontested"];
            if (districtIsUncontested == null) {
                districtIsUncontested = false;
            }
            votingSession.setDistrictIsUncontested(districtIsUncontested);

            // "failed" is treated the same as uncontested.
            var districtIsFailed = districtObject["failed"];
            if (districtIsFailed != null && districtIsFailed == true) {
                votingSession.setDistrictIsUncontested(districtIsFailed);
            }

            var districtAudioFile = districtObject["locationAudio"];
            votingSession.setDistrictAudioFile(districtAudioFile);

            if (districtIsUncontested == true) {
                votingSession.setMaximumNumberOfAssemblyCandidates(0);
            } else {
                assemblyNominationsData = districtObject["candidates"];
                votingSession.setMaximumNumberOfAssemblyCandidates(assemblyNominationsData.length);
            }

            break;
        }
    }

    if (!districtIsUncontested) {
        legislativeAssemblyBallot.setCandidateNominations(assemblyNominationsData);
    }

    if (!regionIsUncontested) {
        aboveTheLineCouncilBallot.setPartyGroupListing(councilNominationsData);
        belowTheLineCouncilBallot.setCandidateNominations(councilNominationsData);

        var btlCandidateCount = belowTheLineCouncilBallot.getNumberOfCandidates();
        votingSession.setMaximumNumberOfCouncilCandidates(btlCandidateCount);

        var atlGroupCount = aboveTheLineCouncilBallot.getNumberOfPartyGroups();
        votingSession.setMaximumNumberOfGroups(atlGroupCount);
    } else {
        votingSession.setMaximumNumberOfCouncilCandidates(0);
        votingSession.setMaximumNumberOfGroups(0);
    }
}


$(document).ready(function() {

    $('#wrapper > div').each(function(i) {
        loadView($(this).attr('id'));
    }).promise().done(function() {
        //appInit();
    });

    $(document).bind("stylesChanged", stylesChangedHandler);

    $("#btnMedium").click(function() {

        if ($("#font_size_styles").attr('href') != "css/styles_medium.css") {
            $("#font_size_styles").attr('href', "css/styles_medium.css");
            window.setTimeout(function() {
                $(document).trigger("stylesChanged");
            }, 10);
        }
    });

    $("#btnLarge").click(function() {
        if ($("#font_size_styles").attr('href') != "css/styles_large.css") {
            $("#font_size_styles").attr('href', "css/styles_large.css");
            window.setTimeout(function() {
                $(document).trigger("stylesChanged");
            }, 10);
        }
    });

    $('#start_visual_ui').html("Initialising. Please Wait.");

    window.setTimeout(function() {
        appInit();
    }, 1000);
});

$(window).resize(function() {

});

function stylesChangedHandler() {
    var container = getContainer();
    var assemblyBallotView = container.Resolve('assemblyBallotView');
    var confirmSelectionsView = container.Resolve("confirmSelectionsView");
}

// Load each of the screens and popup dialogs used in the application.
function loadView(viewName) {
    $.ajax({
        url : 'views/' + viewName + '.html',
        dataType : 'html',
        timeout : 5000, // 5 seconds
        cache : false,
        success : function(html) {
            $('#' + viewName).html(html);
        },
        statusCode : {
            404 : function() {
                alert("page not found");
            }
        }
    });
}

// Timeout callback for confirm button.  If four finger press in this time frame,
// then skip going to visual and switch to audio UI instead.
var startVisualApp;

// Trigger to initiate the Audio interface.  Hold four fingers on the triage screen.
// Load up the Audio UI triage confirmation screen where visual user can back out
// but the audio asks the user to scan their QR bar code.
function checkForAudioUI(event) {
    if (event.type == 'hold') {
        if (event.fingers == 4) {

            window.clearTimeout(inactivityCounterTimeout);

            gvsMode = true;
            $('#keypad').hide();

            var container = getContainer();
            var audioController = container.Resolve("audioController");
            audioController.stopAudio();
            audioController.cancelRepeatInstructions();

            if (startVisualApp != null) {
                window.clearTimeout(startVisualApp);
            }

            var visualScreenManager = container.Resolve("visualScreenManager");
            var currentVisualScreen = visualScreenManager.getCurrentVisualInterfaceScreen();

            var visualView = container.Resolve('visualView');
            visualView.displaySection(currentVisualScreen, 'audio_mode_scan_qr_code_screen');
        }
    }
}

// Trigger to initiate the Audio interface.  Hold four fingers on the scan confirmation screen.
// This is for when a blind user accidentally scans their QR code from the start triage screen,
// then holds four fingers to trigger the blind UI.  Basically just use the previously scanned
// QR code and don't ask them to scan it again.
function checkForAudioUIFromVisualUI(event) {
    if (event.type == 'hold') {
        if (event.fingers == 4) {

            window.clearTimeout(inactivityCounterTimeout);

            gvsMode = true;
            $('#keypad').hide();

            if (startVisualApp != null) {
                window.clearTimeout(startVisualApp);
            }

            var container = getContainer();
            var audioController = container.Resolve("audioController");
            var visualView = container.Resolve("visualView");
            visualView.displaySection('confirm_scan_screen', 'audio_only_screen');

            var audioScreenManager = container.Resolve("audioScreenManager");
            window.setTimeout(function() {
                audioScreenManager.execute({
                    request : 'enterScreen',
                    data : 'audio_start_screen',
                    callback : audioController.enterBlindUiScreen
                });
            }, 1000);
        }
    }
}

function rightClickTrigger(event) {
    var element = $('#' + event.currentTarget.id)[0];
    if (element != null && element.click != null) {
        element.click();
    }

    event.preventDefault();
    return true;
}

// Dell touchscreen doesn't recognise swipey button presses, so use this handler to deal with it.
function swipeTrigger(event) {
    var clickHandler = event.originalEvent.currentTarget.onclick;
    event.originalEvent.preventDefault();
    if (clickHandler != null) {
        clickHandler();
    } else {
        var element = $('#' + event.originalEvent.currentTarget.id);
        if (element != null && element.click != null) {
            element.click();
        }
    }

    return true;
}

function ignore(event) {
    event.preventDefault();
}

function appInit() {

    if (!appInitialised) {

        appInitialised = true;

        containerBuilder = new JsInject.ContainerBuilder();
        dataContainerBuilder = new JsInject.ContainerBuilder();
        setupApplicationContainer();
        container = containerBuilder.Create();

        var audioScreenManager = container.Resolve("audioScreenManager");
        var visualView = container.Resolve('visualView');
        var listOfVisualScreens = audioScreenManager.getListOfVisualScreens();

        // Add all 'screens' of this app to an array.
        $('#wrapper > div').each(function() {
            listOfVisualScreens[$(this).attr('id')] = this;
        });

        // Capture the right click context menu event trigger and ignore it.
        $('#wrapper').bind('contextmenu', function(e) {
            if (!devMode) {
                e.preventDefault();
            }
        });

        // Add all screen to the audio screen manager.
        audioScreenManager.setListOfVisualScreens(listOfVisualScreens);

        if (isTouchSensitive) {

            // Buttons when simultaneously pressed will switch the UI from AUI -> VUI.
            $('#left_trigger').bind('touchstart', function(event) {
                isTouchingLeftTrigger = true;
            });

            $('#left_trigger').bind('touchend', function(event) {
                isTouchingLeftTrigger = false;
            });

            $('#right_trigger').bind('touchstart', function(event) {
                isTouchingRightTrigger = true;
            });

            $('#right_trigger').bind('touchend', function(event) {
                isTouchingRightTrigger = false;
            });

            // "debounce" code to prevent double triggering by jittery fingers.
            $('.button').each(function() {
                this.addEventListener("touchstart", function(event) {
                    debounce(event);
                });

                this.addEventListener("touchmove", function(event) {
                    debounce(event);
                });

                this.addEventListener("click", function(event) {
                    debounce(event);
                });
            });

            $('.button').each(function() {
                this.addEventListener("touchend", function(event) {
                    clearDebounce();
                });
            });

            // Listen for four-finger hold for switch to audio UI.
            var triageContainer = document.getElementById('triage_veil');
            var triageHandler = new Hammer(triageContainer);
            triageHandler.onhold = checkForAudioUI;

            // Listen for four-finger hold for switch to audio UI.
            var triageContainer = document.getElementById('confirm_triage_veil');
            var confirmTriageHandler = new Hammer(triageContainer);
            confirmTriageHandler.onhold = checkForAudioUIFromVisualUI;

            // Listen for finger hold for switch to English.
            var language_triggerContainer = document.getElementById('language_trigger');
            var language_triggerHandler = new Hammer(language_triggerContainer);
            language_triggerHandler.onhold = checkForLanguageChange;

            // This adds a swipe handler that calls the click handler for every button in the app.
            // It needs to be called after click handlers are dynamically attached to buttons.

            var buttonList = $('button').get();
            for (var index = 0; index < buttonList.length; index++) {
                var visualButton = buttonList[index];
                var visualButtonHammer = new Hammer(visualButton);
                visualButtonHammer.ondragstart = swipeTrigger;

                if (!devMode) {
                    $('#' + visualButton.id).bind('contextmenu', function(e) {
                        rightClickTrigger(e);
                    });
                }
            }

            // This adds a swipe handler that calls the click handler for every div in the app.
            // It needs to be called after click handlers are dynamically attached to buttons.

            var divList = $('div').get();
            for (var index = 0; index < divList.length; index++) {
                var visualDiv = divList[index];
                var visualDivHammer = new Hammer(visualDiv);
                visualDivHammer.ondragstart = swipeTrigger;

                if (!devMode) {
                    $('#' + visualDiv.id).bind('contextmenu', function(e) {
                        rightClickTrigger(e);
                    });
                }
            }

            // Listen for audio UI gestures.
            var touchContainer = document.getElementById('audio_only_screen');
            var hammer = new Hammer(touchContainer);
            hammer.onhold = blindInterfaceGestureTrigger;
            hammer.ontap = blindInterfaceGestureTrigger;
            hammer.ondoubletap = blindInterfaceGestureTrigger;
            hammer.ontransformstart = blindInterfaceGestureTrigger;
            hammer.ontransform = blindInterfaceGestureTrigger;
            hammer.ontransformend = blindInterfaceGestureTrigger;
            hammer.ondragstart = blindInterfaceGestureTrigger;
            hammer.ondrag = blindInterfaceGestureTrigger;
            hammer.ondragend = blindInterfaceGestureTrigger;

            // Setup audio UI to visual UI switch.
            $('#left_trigger').show();
            $('#right_trigger').show();

            // Attach click handler to blind audio buttons.
            $('.blind_button').bind('touchstart', function(event) {
                window.clearTimeout(repeatInstructionsTimeout);
                blindInterfaceButtonTrigger(this.id);
            });
        }

        // Get the configuration data.
        getAudioConfiguration();
        getLanguageData();
    }

    $("#select_medium_text").click(function() {

        var container = getContainer();
        var votingSession = container.Resolve("votingSession");
        votingSession.setFontSize(MEDIUM);
        changeLanguage(languageSelection);

        $("#large_selected").html("");
        $("#medium_selected").html("&#10004");
    });

    $("#select_large_text").click(function() {

        var container = getContainer();
        var votingSession = container.Resolve("votingSession");
        votingSession.setFontSize(LARGE);
        changeLanguage(languageSelection);
        
        $("#large_selected").html("&#10004");
        $("#medium_selected").html("");
    });

    $("#select_bow").click(function() {
        if ($("#font_color_styles").attr('href') != "css/styles_black_on_white.css") {
            $("#font_color_styles").attr('href', "css/styles_black_on_white.css");
            window.setTimeout(function() {
                $(document).trigger("stylesChanged");
            }, 100);
        }

        $('.speaker_icon').attr("src", "images/speaker_icon_black.png");

        $("#wob_selected").html("");
        $("#bow_selected").html("&#10004");
    });

    $("#select_wob").click(function() {
        if ($("#font_color_styles").attr('href') != "css/styles_white_on_black.css") {
            $("#font_color_styles").attr('href', "css/styles_white_on_black.css");
            window.setTimeout(function() {
                $(document).trigger("stylesChanged");
            }, 100);
        }

        $('.speaker_icon').attr("src", "images/speaker_icon.png");

        $("#bow_selected").html("");
        $("#wob_selected").html("&#10004");
    });

    $("#return_to_audio_button").click(function() {

        switchedToVisualMode = false;

        var container = getContainer();

        var visualScreenManager = container.Resolve("visualScreenManager");
        var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
        visualView.displaySection(currentVisualInterfaceScreen, 'audio_only_screen');

        $('#help_modal_background').hide();
        $('#help_modal_container').hide();
        $('#help_modal_header').hide();
        $('#help_modal_footer').hide();

        $('#ballot_help_modal_background').hide();
        $('#ballot_help_modal_container').hide();
        $('#ballot_help_modal_header').hide();
        $('#ballot_help_modal_footer').hide();

        $('#warning_modal_background').hide();
        $('#warning_modal_container').hide();
        $('#warning_modal_header').hide();
        $('#warning_modal_footer').hide();

        var votingSession = container.Resolve("votingSession");
        votingSession.setIsVisualMode(false);
        window.clearTimeout(votingSession.getInactivityCounterTimer());
        votingSession.setInactivityTimer(0);
        votingSession.setAuiInactivityCounterTimer(window.setTimeout(function () { checkForAuiTimeout(); }, 2000));

        var audioScreenManager = container.Resolve("audioScreenManager");
        var lastAudioScreen = audioScreenManager.getCurrentBlindInterfaceScreen();
        var audioScreenFactory = container.Resolve("audioScreenFactory");
        var audioScreen = audioScreenFactory.getInstance(lastAudioScreen);
        if (audioScreen != null) {
            audioScreen.initialEntry();
        }
    });

    $('body').bind('touchstart', function(event) {
        var container = getContainer();
        var votingSession = container.Resolve("votingSession");
        votingSession.setInactivityTimer(0);
        votingSession.setAuiInactivityTimer(0);
    });

    $('#language_trigger').hide();
    
    $('#large_text_size_options').click();

    attachLoggingHandlers();
}

// Convert the vote into a serialised JSON format.
function jsonifyVote() {

    var container = getContainer();
    var legislativeAssemblyBallot = container.Resolve("assembly");
    var assemblyBallotData = legislativeAssemblyBallot.getPreferencesInShuffleOrder();
    var votingSession = container.Resolve("votingSession");
    var serialSig = votingSession.getSignature();
    var serialNo = votingSession.getSerialCode();
    var district = votingSession.getDistrict();
    var region = votingSession.getRegion();
    var maxAssemblyCandidates = votingSession.getMaximumNumberOfAssemblyCandidates();
    var startEvmSignature = votingSession.getStartEvmSignature();

    var preString = '{ "type": "vote", "serialNo": "' + serialNo + '", "races": [';
    var postString = ']}], "serialSig": "' + serialSig + '", "district": "' + district + '", "startEVMSig": "' + startEvmSignature + '" }';
    var dataType = 'text';

    var jsonVoteString = '{"id": "LA","preferences":[';
    for (var index = 0; index < maxAssemblyCandidates; index++) {
        var value = assemblyBallotData[index];
        if (value == '' || value == undefined) {
            jsonVoteString += '" "';
        } else {
            jsonVoteString += '"' + value + '"';
        }
        if (index < maxAssemblyCandidates - 1) {
            jsonVoteString += ",";
        }
    }

    var aboveTheLineCouncilBallot = container.Resolve("atl");
    var aboveTheLineBallotData = aboveTheLineCouncilBallot.getPreferencesInShuffleOrder();

    var ticketedGroups = aboveTheLineCouncilBallot.getTicketedGroups();
    var ticketedGroupCount = ticketedGroups.length;

    jsonVoteString += ']},{"id": "LC_ATL","preferences":[';
    for (var index = 0; index < ticketedGroupCount; index++) {
        var value = aboveTheLineBallotData[index];
        if (value == '' || value == undefined) {
            jsonVoteString += '" "';
        } else {
            jsonVoteString += '"1"';
        }
        if (index < ticketedGroupCount - 1) {
            jsonVoteString += ",";
        }
    }

    var belowTheLineCouncilBallot = container.Resolve("btl");
    var belowTheLineBallotData = belowTheLineCouncilBallot.getPreferencesInShuffleOrder();
    var maxCouncilCandidates = votingSession.getMaximumNumberOfCouncilCandidates();

    jsonVoteString += ']},{"id": "LC_BTL","preferences":[';
    for (var index = 0; index < maxCouncilCandidates; index++) {
        var value = belowTheLineBallotData[index];
        if (value == '' || value == undefined) {
            jsonVoteString += '" "';
        } else {
            jsonVoteString += '"' + value + '"';
        }
        if (index < maxCouncilCandidates - 1) {
            jsonVoteString += ",";
        }
    }

    return preString + jsonVoteString + postString;
}

function switchToVisualInterfaceForSupport() {

    var container = getContainer();
    var audioController = container.Resolve("audioController");
    var audioScreenManager = container.Resolve("audioScreenManager");
    lastAudioScreen = audioScreenManager.getCurrentBlindInterfaceScreen();
    audioController.switchToVisualInterface(lastAudioScreen);

    var votingSession = container.Resolve("votingSession");
    votingSession.setIsVisualMode(true);
    window.clearTimeout(votingSession.getAuiInactivityCounterTimer());
    votingSession.setAuiInactivityTimer(0);

    $('#return_to_audio_button').show();

    switchedToVisualMode = true;
}

// Return to the language selection screen.
function returnToLanguageScreen() {

    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    var visualView = container.Resolve('visualView');
    visualView.displaySection(currentVisualInterfaceScreen, 'language_screen');
}

// switch to audio interface, preserve all votes that were made in the visual interface.
function switchToAudioInterface() {
    switchedToVisualMode = false;

    var container = getContainer();
    var visualController = container.Resolve("visualController");
    visualController.reset();

    var audioScreenManager = container.Resolve("audioScreenManager");
    var visualScreenManager = container.Resolve("visualScreenManager");
    audioScreenManager.setUserVotedAboveOrBelowTheLine(visualScreenManager.getUserVotedAboveOrBelowTheLine());
    
    var currentVisualInterfaceScreen = visualScreenManager.getCurrentVisualInterfaceScreen();
    var visualView = container.Resolve('visualView');
    visualView.displaySection(currentVisualInterfaceScreen, 'confirm_audio_switch_visual_screen');
}

function clearDebounce () {
    lastButtonList = new Array();
}

// This debounce function is for reducing accidental repeat presses of buttons only in the app.
// ballot box debounce is handled by the ballot manager.
function debounce(event) {

    if (event == null) {
        return false;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.srcElement != null && event.srcElement.id.indexOf("undo") > 0) {
        return false;
    }

    // If we're still touching the same button as last time, exit, and remember that it's still the same button.
    if (lastButtonList.pop() && (event.type == "touchstart" || event.type == "click")) {
        lastButtonList.push(event.currentTarget.id);
        return false;
    }

    // Currently pressing this button.
    lastButtonList.push(event.currentTarget.id);
    
    var currentButtonPressTime = new Date().getTime();

    if (lastButtonTime == null) {
        lastButtonTime = currentButtonPressTime;
    } else {
        var minimumButtonPressInterval = 200;
        if ((currentButtonPressTime - lastButtonTime) < minimumButtonPressInterval) {
            lastButtonTime = currentButtonPressTime;
            return false;
        } else {
            lastButtonTime = currentButtonPressTime;
        }
    }

    lastButton = event.currentTarget.id;

    var element = $('#' + event.currentTarget.id);
    if (element != null && element.click != null) {
        element.click();
    }
}

// Open start screen after the settings screen.
function openDistrictScreen () {
  var container = getContainer();
  var votingSession = container.Resolve("votingSession");
  var districtIsUncontested = votingSession.getDistrictIsUncontested();
  var visualView = container.Resolve('visualView');
  visualView.displaySection('start_screen', 'legislative_assembly_candidate_vote_screen');
  $('#language_trigger').show();
}

// Open the languages screen going back from the settings screen.
function openLanguagesScreen () {
  var container = getContainer();
  var visualView = container.Resolve('visualView');
  visualView.displaySection('start_screen', 'language_screen');
  $('#language_trigger').hide();
}