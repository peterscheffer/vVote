/**
 *  Drag and Drop functionality to allow user to swap preference selections  
 *  by dragging and dropping ballot boxes in the graphical interface.
 *
 *  NOTE - THIS IS IMPORTANT.  The default browser behaviour is that you can interrupt dragging a ballot box
 *  by touching another box at the same time. The browser drops the dragged box where it was when the 2nd
 *  box was touched. The only successful way to prevent this is to REMOVE all touchend event handlers from the
 *  the ballot boxes with "unbind('touchend')", and destroying the "draggable" behaviour while one box is in motion. 
 *  Then once the user releases the dragged box, re-attach the draggable behaviour to all ballot boxes again.
 * 
 * @author <a href="mailto:peter.scheffer@vec.vic.gov.au">Peter Scheffer</a>
 * 
 */

// Drag and Drop event handling.
var addEvent = (function () {

  if (document.addEventListener) {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();

// Cancel event.
function cancel(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }
  return false;
}

var boxBeingDragged = null;
var boxPositionX = null;
var boxPositionY = null;

// Define a Draggable Ballot object for touch screen devices.
function DraggableBallot () {}

DraggableBallot.prototype.setDragFunction = function (ballotOption, ballot) {

  var ballotBoxIDs = new Array();
  var dragging = false;

  $(ballotOption).draggable({
    drag: function(event, ui) {

      if (boxBeingDragged == null) {
        var object = $('#' + event.srcElement.id);
        boxPositionX = event.srcElement.clientLeft;
        boxPositionY = event.srcElement.clientTop;
    
      } else if (boxBeingDragged != null && boxBeingDragged != event.srcElement.id) {
        event.preventDefault();
        return false;
      }
      
    
      if ($(this).html() == "") {
        var element = $('#' + this.id);
        if (element != null && element.click != null) {
          element.click();
        }
        return;
      }
      
      boxBeingDragged = event.srcElement.id;
    }
  });

  $(ballotOption).mouseup(function (event) {
    var element = document.getElementById(this.id);

    if (boxBeingDragged != null) {
      $("#" + boxBeingDragged).css({ 'top' : boxPositionY, 'left' : boxPositionX });
      boxBeingDragged = null;
      boxX = null;
      boxY = null;
    }
  });

  $(ballotOption).droppable({
    drop: function( event, ui ) {
      var container = getContainer();
      var ballotManager = container.Resolve('ballotManager');
      ballotManager.ballotOptionSwapped(ballot, event.srcElement.id, event.target.id);
      $(ballotOption).mouseup();
    }
  });
}