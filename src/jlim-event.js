/**
 * jLim Event
 *
 * @fileOverview
 *    Event handling methods for jLim, supporting:
 *    - Using custom events, f.e. $().bind('customEvent', func);
 *    - Using event delegation
 *    - Using namespace in event names (only one level, f.e. "click:form")
 *    - quick methods for default event types, like .click(), .blur() etc.
 *    Released under MIT license.
 * @package jLim
 * @requires jLim Core
 * @author Victor Villaverde Laan
 * @link http://www.freelancephp.net/jlim-event-plugin/
 */
(function (window, $) {

$.fn.extend(
	/**
	 * @lends jLim.fn
	 */
	{
		/**
		 * Add function to event
		 * @param {String} eventName Event name
		 * @param {Function} fn Function to add to event
		 * @param {Number} [insertIndex] Insert function at given index
		 * @return {This}
		 */
		bind: function (eventName, fn, insertIndex) {
			var events = eventName.split(' ');

			return this.each(function () {
				// set handlers
				for (var key in events)
					eventHandlers(this, events[key], fn, insertIndex);
			});
		},

		/**
		 * Remove function from event
		 * @param {String} eventName Event name
		 * @param {Function} [fn] Function to remove from event listener
		 * @return {This}
		 */
		unbind: function (eventName, fn) {
			var events = eventName.split(' ');

			return this.each(function () {
				for (var name in events) {
					var handlers = eventHandlers(this, events[name]) || [], // reference
						fns, x, k;

					// remove given function form event
					if ($.isArray(handlers)) {
						for (x = 0; x < handlers.length; x++) {
							if (handlers[x] === fn || !fn)
								handlers.splice(x--, 1); // decline index (x--) when removing array item
						}
					} else {
						for (k in handlers) {
							fns = handlers[k];

							for (x = 0; x < fns.length; x++) {
								if (fns[x] === fn || !fn)
									fns.splice(x--, 1); // decline index (x--) when removing array item
							}
						}
					}
				}
			});
		},

		/**
		 * Trigger event
		 * @param {String} eventName Event name
		 * @param {Arrat} args Extra params
		 * @return {This}
		 */
		trigger: function (eventName, args) {
			var events = eventName.split(' '),
				params = [getEvent()].concat(args);

			return this.each(function () {
				for (var key in events) {
					if ($.isFunction(this['on'+ events[key]])) {
						this['on'+ events[key]].call(this);
					} else {
						triggerEvent(this, events[key], params);
					}
				}
			});
		},

		/**
		 * Delegate event handlers to a parent element
		 * @param {String} selector
		 * @param {String} eventName Event name
		 * @param {Function} fn Function to add to event
		 * @return {This}
		 */
		delegate: function (selector, eventName, fn) {
			return this.bind(eventName, function (e) {
				jLim(this).find(selector).each(function () {
					if (this === e.target) {
						if ($.isFunction(fn))
							fn.call(e.target, e);
					}
				});
			});
		}
	}
);

$.each(['load', 'unload', 'scroll', 'resize', 'error', 'blur', 'change', 'focus', 'select', 'submit', 'keydown', 'keypress', 'keyup',
			'click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'], function (i, eventName) {
	/**
	 * Create core functions of the default events
	 *
	 * @name jLim.fn[eventName]
	 * @function
	 * @param {Function} fn
	 * @param {Number} [insertIndex] Insert function at given index
	 * @return {This}
     *
	 * @exports $.fn[eventName] as jLim.fn.load
	 * @exports $.fn[eventName] as jLim.fn.unload
	 * @exports $.fn[eventName] as jLim.fn.scroll
	 * @exports $.fn[eventName] as jLim.fn.resize
	 * @exports $.fn[eventName] as jLim.fn.error
	 * @exports $.fn[eventName] as jLim.fn.blur
	 * @exports $.fn[eventName] as jLim.fn.change
	 * @exports $.fn[eventName] as jLim.fn.focus
	 * @exports $.fn[eventName] as jLim.fn.select
	 * @exports $.fn[eventName] as jLim.fn.submit
	 * @exports $.fn[eventName] as jLim.fn.keydown
	 * @exports $.fn[eventName] as jLim.fn.keypress
	 * @exports $.fn[eventName] as jLim.fn.keyup
	 * @exports $.fn[eventName] as jLim.fn.click
	 * @exports $.fn[eventName] as jLim.fn.dblclick
	 * @exports $.fn[eventName] as jLim.fn.mousedown
	 * @exports $.fn[eventName] as jLim.fn.mousemove
	 * @exports $.fn[eventName] as jLim.fn.mouseout
	 * @exports $.fn[eventName] as jLim.fn.mouseover
	 * @exports $.fn[eventName] as jLim.fn.mouseup
	 */
	$.fn[eventName] = function (fn, insertIndex) {
		return fn ? this.bind(eventName, fn, insertIndex): this.trigger(eventName);
	};
});

/**
 * Prepare event object for cross-browser compatibility
 * @private
 * @param {EventObject} evt
 * @return {EventObject} Made cross-browser compatible
 */
function getEvent(evt) {
	if (!evt)
		evt = window.event || {};

	// Copy event object
	var e = $.extend({}, evt);

	// Reference to original event object
	e.originalEvent = evt;

	// The source element
	e.target = evt.target || evt.srcElement;

	// keyCode, charCode, which
	if (evt.charCode) {
		e.keyCode = evt.charCode;
		e.which = evt.charCode;
	} else if (evt.keyCode) {
		e.charCode = evt.keyCode;
		e.which = evt.keyCode;
	} else if (evt.which) {
		e.keyCode = evt.which;
		e.charCode = evt.which;
	}

	// Prevent triggering the default action of the event
	e.preventDefault = function () {
		// IE
		evt.returnValue = false;

		// Standard
		if (evt.preventDefault)
			evt.preventDefault();

		e.isDefaultPrevented = true;
	};
	e.isDefaultPrevented = false;

	// Prevent event bubbling
	e.stopPropagation = function () {
		// IE
		evt.cancelBubble = true;

		// Standard
		if (evt.stopPropagation)
			evt.stopPropagation();

		e.isPropagationStopped = true;
	};
	e.isPropagationStopped = false;

	return e;
};

/**
 * Get or set event handlers
 * @private
 * @param {DOMElement} target
 * @param {String} eventName
 * @param {Function} [fn] Set function as event handler
 * @param {Number} [insertIndex] Insert function at given index
 */
function eventHandlers(target, eventName, fn, insertIndex) {
	var name = $.trim((eventName || '').replace(':', '.')),
		eName = name.substr(0, name.indexOf('.') > -1 ? name.indexOf('.') : name.length),
		nameSpace = name.substr(eName.length + 1) || '__default',
		handlers = target.__jLimEventHandlers || {},
		wrapFunc = function (event) {
			if ($.isFunction(curFunc))
				curFunc.call(target);

			triggerEvent(target, eName, [getEvent(event)]);
		},
		curFunc;

	// getter
	if (!fn) {
		// check eventHandlers property
		if (!handlers || !handlers[eName])
			return null;

		return $.trim(eventName) == eName || nameSpace == '__default' ? handlers[eName] : handlers[eName][nameSpace];
	}

	// init handlers prop not exists
	if (!handlers)
		handlers = {};

	// set wrapper function on first use of target
	if (!handlers[eName]) {
		curFunc = target['on'+ eName];
		target['on'+ eName] = wrapFunc;
	}

	// init event when not exists
	if (!handlers[eName])
		handlers[eName] = {};

	// init namespace when not exists
	if (!handlers[eName][nameSpace])
		handlers[eName][nameSpace] = [];

	// add handler function
	if (typeof insertIndex == 'undefined') {
		handlers[eName][nameSpace].push(fn);
	} else {
		handlers[eName][nameSpace].splice(insertIndex, 0, fn);
	}

	// set prop
	target.__jLimEventHandlers = handlers;
}

/**
 * Trigger event function
 * @private
 * @param {DOMElement} target
 * @param {String} eventName
 * @param {Array} args
 */
function triggerEvent(target, eventName, args) {
	var handlers = eventHandlers(target, eventName),
		fns;

	// loop through handlers
	for (var k in handlers) {
		fns = handlers[k];

		if ($.isArray(fns)) {
			for(var i in fns) {
				fns[i].apply(target, args);
			}
		} else {
			fns.apply(target, args);
		}
	}
};

})(window, jLim);