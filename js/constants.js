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
 */

var WE_ARE_VOICING_UNTICKETED_GROUPS = true;
var DEFAULT_IMAGE_DIRECTORY = "images/";
var MIN_COUNCIL_CANDIDATES_REQUIRED = 5;
var MIN_COUNCIL_GROUPS_REQUIRED = 1;
var LAST_CANDIDATE_EXCEPTION = "Last candidate available in the list";
var FIRST_CANDIDATE_EXCEPTION = "First candidate available in the list";
var LAST_GROUP_EXCEPTION = "Last group available in the list";
var FIRST_GROUP_EXCEPTION = "First group available in the list";
var CANDIDATE_ALREADY_SELECTED = "This candidate has already been selected";
var NULL_POINTER_EXCEPTION = "Null pointer error";
var ALPHABET = [ "", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
var MAXIMUM_GROUPS_SELECTED = "The maximum number of group selection preferences has already been made.";
var MAXIMUM_CANDIDATES_SELECTED = "The maximum number of candidate selection preferences have already been made.";
var LEGISLATIVE_ASSEMBLY_BALLOT = "LEGISLATIVE_ASSEMBLY_BALLOT";
var LEGISLATIVE_COUNCIL_GROUP_BALLOT = "LEGISLATIVE_COUNCIL_GROUP_BALLOT";
var LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT = "LEGISLATIVE_COUNCIL_CANDIDATE_BALLOT";
var UNRECOGNISED_BALLOT = "Invalid ballot type was provided";
var FIRST_OPTION_EXCEPTION = "First option in the list";
var LAST_OPTION_EXCEPTION = "Last option in the list";
var MBB_TIMEOUT = 60000;
var SCAN_TIMEOUT = 10500;

var MEDIUM = "medium";
var LARGE = "large";
var COLOR = "color";
var BLACK_ON_WHITE = "bow";
var WHITE_ON_BLACK  = "wob";
var VIS = "visual interface";
var GVS = "gesture interface";
var TVS = "tvs interface";

var FONT_SIZE = new Array();
FONT_SIZE[1] = MEDIUM;
FONT_SIZE[2] = LARGE;

var COLOR_CONTRAST = new Array();
COLOR_CONTRAST[1] = COLOR;
COLOR_CONTRAST[2] = BLACK_ON_WHITE;
COLOR_CONTRAST[3] = WHITE_ON_BLACK;

var INTERFACE = new Array();
INTERFACE[1] = VIS;
INTERFACE[2] = GVS;
INTERFACE[3] = TVS;

// screen unlock PIN.
var PIN = "5302";

// 2 minutes until timeout lock due to inactivity in VIS.
var INACTIVITY_TIMEOUT_PERIOD = 120000;

// 10 minutes until timeout lock due to inactivity in AUI.
var AUI_INACTIVITY_TIMEOUT_PERIOD = 180000;

// 10 second countdown to locking the screen.
var AUI_COUNTDOWN_PERIOD = 10000;

// period the app is allowed to delay before notifying the user.
var DELAYED_TIMEOUT_PERIOD = 5000;

// the app resets after this period.
var INACTIVITY_RESET_PERIOD = 180000;

// Message from MBB indicating that the CL QR has already been used to startEVM.
var START_EVM_ERROR = "Exception when sending message to MBB";

// Message from MBB indicating that the CL QR has already been used to startEVM.
var EVM_STARTED_ALREADY = "StartEVM message previously sent";

// Message from MBB indicating that the CL QR has already been used to startEVM.
var EVM_STARTED_NO_CONSENSUS = "Consensus was not reached within the timeout";

// Message from MBB indicating that the CL QR has timed out.
var BALLOT_ALREADY_TIMED_OUT = "Ballot has already timedout";
