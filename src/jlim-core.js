/**
 * jLim Core
 *
 * @fileOverview
 *    Contains basic methods for jLim framework.
 *    Released under MIT license.
 * @package jLim
 * @requires DOMReady and SimpleSelector
 * @author Victor Villaverde Laan
 * @link http://www.freelancephp.net/jlim-small-javascript-framework/
 * @link https://github.com/freelancephp/jLim
 */
(function (window) {

/**
 * jLim factory function
 * @namespace jLim
 * @param {String|DOMElement|DOMElement[]} selector
 * @param {String|DOMElement|DOMElement[]} [context=document] !! Will be ignored if selector is not a string !!
 * @return {jLim.fn.init} New instance
 */
function jLim(selector, context) {
	return new jLim.fn.init(selector, context);
};

/**
 * Make jLim global
 * @ignore
 */
window.jLim = jLim;

if (!window.$) {
	/**
	* Add short name for jLim method
	* @function
	*/
	window.$ = jLim;
}

/**
 * jLim functions
 * @namespace jLim.fn
 */
jLim.fn = {

	/**
	 * @property {DOMElement[]} els Selected elements
	 */
	els: [],

	/**
	 * @property {String|DOMElement|DOMElement[]} selector Selector used for selection
	 */
	selector: [],

	/**
	 * @property {String|DOMElement|DOMElement[]} context Context used for the selection
	 */
	context: [],

	/**
	 * Set elements for given selection.
	 * @constructor
	 * @param {String|DOMElement|DOMElement[]} selector
	 * @param {String|DOMElement|DOMElement[]} [context=document] !! Will be ignored if selector is not a string !!
	 */
	init: function (selector, context) {
		// set selector and context property
		this.selector = selector || document;
		this.context = context || document;

		// get elements by selector
		if (typeof selector == 'string'){
			// trim spaces at the begin and end
			selector = jLim.trim(selector);

			if (selector == 'body' && ! context){
				// set body
				this.els = document.body;
			} else if (selector.substr( 0, 1 ) == '<'){
				// create element
				this.els = jLim.create(selector);
			} else {
				// find elements
				this.els = jLim.selector(selector, context);
			}
		} else if (jLim.isFunction(selector)){
			// set DOM ready function
			jLim.ready( selector );
		} else if (selector instanceof jLim.fn.init){
			this.els = selector.get();
		} else {
			this.els = selector;
		}

		// make sure elements property is an array
		if (!jLim.isArray(this.els)) {
			this.els = this.els ? [this.els] : [];
		} else {
			// remove doubles
			this.els = jLim.clearDuplicates(this.els);
		}

		// support for using jLim object as an array
		// set indices
		for (var i in this.els)
			this[i] = this.els[i];

		// set length property
		this.length = this.els.length;
	},

	/**
	 * Get element (return all current elements when no index is given)
	 * @param {Integer} index
	 * @return {DOMElement|DOMElement[]}
	 */
	get: function (index) {
		if (typeof index == 'undefined')
			return this.els;

		var el = (index === -1)
				? this.els.slice(index)
				: this.els.slice(index, +index + 1);

		return el.length ? el[0] : null;
	},

	/**
	 * Get count of current elements
	 * @return {Integer}
	 */
	size: function () {
		return this.els.length;
	},

	/**
	 * Call function for each element
	 * @param {Function} fn
	 * @param {Array} args
	 * @return {This}
	 */
	each: function (fn) {
		jLim.each(this.els, fn);
		return this;
	},

	/**
	 * Find elements within the current elements (context)
	 * @param {String} selector
	 * @return {jLim.fn.init} Instance of new selection
	 */
	find: function (selector) {
		return this.chain(selector, this.els);
	},

	/**
	 * Add to the current elements in a new created jLim object
	 * @param {String|DOMElement|DOMElement[]} selector When selector is not a string the context will be ignored
	 * @param {String|DOMElement|DOMElement[]} [context]
	 * @return {jLim.fn.init} Instance of new selection
	 */
	add: function (selector, context) {
		var $new = this.chain(selector, context),
			els = this.els.concat($new.get());

		$new.els = jLim.clearDuplicates(els);
		return $new;
	},

	/**
	 * Set one of current elements as new jLim object
	 * @param {Integer} index  Negative integer also possible, -1 means last item
	 * @return {jLim.fn.init} Instance of new selection
	 */
	eq: function (index) {
		return this.chain(this.get(index));
	},

	/**
	 * Set slice of current elements as new jLim object
	 * @param {Integer} start Like the first param of the standard Array.slice() function
	 * @param {Integer} end Like the second param of the standard Array.slice() function
	 * @return {jLim.fn.init} Instance of new selection
	 */
	slice: function (start, end) {
		var els = this.els.slice(start, end || this.els.length);
		return this.chain(els);
	},

	/**
	 * Chain completely new jLim object
	 * @param {String|DOMElement|DOMElement[]} selector When selector is not a string the context will be ignored
	 * @param {String|DOMElement|DOMElement[]} [context]
	 * @return {jLim.fn.init} Instance of new selection
	 */
	chain: function (selector, context) {
		var $new = jLim(selector, context);
		$new.prevjLim = this;
		return $new;
	},

	/**
	 * Set pointer to previous jLim object
	 * @return {jLim.fn.init} Previous jLim object in the chain
	 */
	end: function () {
		return this.prevjLim || jLim(null);
	}

};

/**
 * @memberOf jLim.fn
 * @deprecated Use .chain() method instead
 */
jLim.fn.$ = jLim.fn.chain;

/**
 * @class jLim.fn.init
 * @exports jLim.fn as this.prototype
 */
jLim.fn.init.prototype = jLim.fn;

/**
 * For extending objects
 * @memberOf jLim
 * @memberOf jLim.fn
 * @return {Object|Array}
 */
jLim.extend = jLim.fn.extend = function () {
	// target is current object if only one argument
	var i = 0,
		target = this,
		deep = false,
		obj, empty, item, x;

	// check extending recursive (deep)
	if (typeof arguments[0] === 'boolean') {
		deep = true;
		i = 1;

		if (arguments.length > 2){
			i = 2;
			target = arguments[1];
		}
	} else if (arguments.length > 1){
		i = 1;
		target = arguments[0];
	}

	// loop through all source objects
	for (x = i; x < arguments.length; x++) {
		obj = arguments[x];

		// copy object items (properties and methods)
		for (item in obj){
			if (obj[item] === target)
				continue;

			if (deep && typeof obj[item] == 'object' && obj[item] !== null) {
				// item is also object, make copy
				empty = jLim.isArray(obj[item]) ? [] : {};
				target[item] = jLim.extend(deep, target[item] || empty, obj[item]);
			} else {
				// copy property or method
				target[item] = obj[item];
			}
		}
	}

	// return modified target
	return target;
};

jLim.extend(
	/**
	 * @lends jLim
	 */
	{
		/**
		 * Selector method
		 * @param {String} selector
		 * @param {String|DOMElement|DOMElement[]} [context=document]
		 * @return {DOMElement|DOMElement[]|Array}
		 */
		selector: function (selector, context) {
			return $$(selector, context);
		},

		/**
		 * Add callbacks for when DOM is ready
		 * @param {Function} fn
		 */
		ready: function (fn) {
			DOMReady.add(fn, [jLim]);
		},

		/**
		 * Create DOM element
		 * @param {String} html
		 * @return {DOMElement|DOMElement[]}
		 */
		create: function (html) {
			var ph = document.createElement('div'),
				els = [];

			ph.innerHTML = html;

			// get created elements
			els = ph.childNodes;

			// return element or array of elements
			return els.length == 1 ? els[0] : els;
		},

		/**
		 * Each function for arrays and objects
		 * @param {Object|Array} obj
		 * @param {Function} fn
		 */
		each: function (obj, fn) {
			var item, retVal;

			// call given function for each item
			for (item in obj) {
				retVal = fn.call(obj[item], item, obj[item]);

				// do not continue further when return value is false
				if (retVal === false)
					break;
			}
		},

		/**
		 * Trim spaces (also tabs and linefeeds)
		 * @param {String} str
		 * @return {String}
		 */
		trim: function (str) {
			return str.replace(/^\s+/, '').replace(/\s+$/, '');
		},

		/**
		 * Check if item exists in array
		 * @param {Array} arr
		 * @param {Mixed} item
		 * @return {Boolean}
		 */
		itemExists: function (arr, item) {
			for (var j = 0, max = arr.length; j < max; j++) {
				if (arr[j] === item)
					return true;
			}

			return false;
		},

		/**
		 * Return array without duplicate entries
		 * @param {Array} arr
		 * @return {Array}
		 */
		clearDuplicates: function (arr) {
			var a = [];

			for (var i = 0, max = arr.length; i < max; i++) {
				if (!jLim.itemExists(a, arr[i]))
					a.push(arr[i]);
			}

			return a;
		},

		/**
		 * Check if argument is array
		 * @param {Mixed} obj
		 * @return {Boolean}
		 */
		isArray: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		},

		/**
		 * Check if argument is function
		 * @param {Mixed} obj
		 * @return {Boolean}
		 */
		isFunction: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Function]';
		}
	}
);

})(window);