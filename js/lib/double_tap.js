/*!
 * jQuery Double Tap Plugin.
 *
 * Copyright (c) 2010 Raul Sanchez (http://www.sanraul.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
 
(function($){
	// Determine if we on iPhone or iPad
	var isiOS = false;
	var agent = navigator.userAgent.toLowerCase();
	if(agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0){
		   isiOS = true;
	}
 
	$.fn.doubletap = function(onDoubleTapCallback, onTapCallback, delay){
		var eventName, action;
		delay = delay == null? 500 : delay;
		eventName = isiOS == true? 'touchend' : 'click';
 
		$(this).bind(eventName, function(event){
			var now = new Date().getTime();
			/** the first time this will make delta a negative number */
			var lastTouch = $(this).data('lastTouch') || now + 1;
						
			var delta = now - lastTouch;
			clearTimeout(action);
			if (delta < delay && delta > 0) {
				$(this).data('lastTouch', now);
				if(onDoubleTapCallback != null && typeof onDoubleTapCallback == 'function'){
					onDoubleTapCallback(event);
					// prevents triple tap.
					$(this).data('lastTouch', null);
				}
			}else{
				$(this).data('lastTouch', now);
				action = setTimeout(function(evt){
					if(onTapCallback != null && typeof onTapCallback == 'function'){
						onTapCallback(evt);
					}
					clearTimeout(action);   // clear the timeout
				}, delay, [event]);
			}
		});
	};
})(jQuery);
