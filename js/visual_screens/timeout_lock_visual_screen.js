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
 * TimeoutLockVisualScreen - The visual screen class for the timeout lock screen for the visual interface.
 * 
 * @author Peter Scheffer
 */
 
var TimeoutLockVisualScreen = Screen.extend({  
  init: function () {
    var container = getContainer();
    var visualScreenManager = container.Resolve("visualScreenManager");
    var visualController = container.Resolve("visualController");
    this._super(visualScreenManager, 'timeout_lock_screen', 
      this.initialiseTimeoutLockScreen, 
      this.exitTimeoutLockScreen,
      null);
  },
  
  initialiseTimeoutLockScreen: function () {
    $('#timeout_modal_background').hide();
    $('#timeout_modal_container').hide();

    $('#timeout_lock_modal_background').show();
    $('#timeout_lock_modal_container').show();

    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var lockScreen = screenFactory.getInstance("timeout_lock_screen");
    lockScreen.lockoutCounter = 0;
    lockScreen.lockoutCountup();
  },
  
  exitTimeoutLockScreen: function () {
    $('#timeout_lock_modal_background').hide();
    $('#timeout_lock_modal_container').hide();
  },
  
  // Display the time for which this device has been locked.
  lockoutCountup: function () {
    var container = getContainer();
    var screenFactory = container.Resolve("screenFactory");
    var lockScreen = screenFactory.getInstance("timeout_lock_screen");
    lockScreen.lockoutCounter = Number(lockScreen.lockoutCounter) + 1;
    $('#timeout_lock_countup_timer').html(lockScreen.convertSecondsToTime(lockScreen.lockoutCounter));
    window.clearTimeout(lockScreen.lockoutCounterTimeout);
    this.lockoutCounterTimeout = window.setTimeout(function () { lockScreen.lockoutCountup(); }, 1000);
  },

  convertSecondsToTime: function (seconds) {  
    var hours = Math.floor(seconds / (60 * 60));
    var divisorMinutes = seconds % (60 * 60);
    var minutes = Math.floor(divisorMinutes / 60);
    var divisorSeconds = divisorMinutes % 60;
    var seconds = Math.ceil(divisorSeconds);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    
    return hours + ":" + minutes + ":" + seconds;
  }
});