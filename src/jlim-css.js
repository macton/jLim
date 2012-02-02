/**
 * jLim CSS
 *
 * @fileOverview
 *    CSS related methods for jLim.
 *    Released under MIT license.
 * @package jLim
 * @requires jLim Core
 * @author Victor Villaverde Laan
 * @link http://www.freelancephp.net/jlim-css-plugin/
 */
jLim.fn.extend(
	/**
	 * @lends jLim.fn
	 */
	{
		/**
		* Add class to selected elements
		* @param {String} value
		* @return {This}
		*/
		addClass: function (value) {
			return this.each(function () {
				if (!jLim( this ).hasClass(value))
					this.className += ' '+ value;
			});
		},

		/**
		* Remove class from selected elements
		* @param {String} value
		* @return {This}
		*/
		removeClass: function (value) {
			return this.each(function () {
				this.className = this.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
			});
		},

		/**
		* Check if first element has given class
		* @param {String} value
		* @return {Boolean}
		*/
		hasClass: function (value) {
			return (this.length && this.get(0).className.match(new RegExp( '(\\s|^)' + value + '(\\s|$)')));
		},

		/**
		* Set style(s) of the style attribute
		* @param {String|Object} style
		* @param {Mixed} [value] Set new value
		* @return {This|String}
		*/
		style: function (style, value) {
			var key;

			// getter
			if (typeof value == 'undefined') {
				if (typeof style == 'string') {
					// getter
					key = jLim.toCamelCase(style);
					return this.length ? this.get(0).style[key] : null;
				} else {
					// setter multiple styles
					for (key in style)
						this.style(key, style[key]);

					return this;
				}
			}

			// setter
			key = jLim.toCamelCase(style);

			return this.each(function () {
				if (typeof this.style[key] != 'undefined')
					this.style[key] = value;
			});
		}
	}
);

jLim.extend(
	/**
	 * @lends jLim
	 */
	{
		/**
		* Convert dashed names to CamelCase
		* F.e. border-bottom-width to borderBottomWidth
		* @param {String} str
		* @return {String} CamelCased
		*/
		toCamelCase: function(str) {
			return str.replace(/(\-[a-z])/g, function($1) {
				return $1.toUpperCase().replace('-', '');
			});
		}
	}
);
