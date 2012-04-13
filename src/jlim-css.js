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
(function ($) {

$.fn.extend(
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
				if (!$(this).hasClass(value))
					this.className = this.className.length > 0 ? this.className +' '+ value : value;
			});
		},

		/**
		 * Remove class from selected elements
		 * @param {String} value
		 * @return {This}
		 */
		removeClass: function (value) {
			var exp = new RegExp('(\\s|^)' + value + '(\\s|$)');

			return this.each(function () {
				var className = this.className.replace(exp, ' ');
				this.className = $.trim(className);
			});
		},

		/**
		 * Check if first element has given class
		 * @param {String} value
		 * @return {Boolean}
		 */
		hasClass: function (value) {
			return value && this.length && this.get(0).className.match(new RegExp( '(\\s|^)' + value + '(\\s|$)'));
		},

		/**
		 * Set or get css value
		 * @param {String|Object} cssProperty
		 * @param {Mixed} [value] Set new value
		 * @return {This|String}
		 */
		css: function (cssProperty, value) {
			var d = window.document,
				key;

			// getter
			if (typeof value == 'undefined') {
				if (typeof cssProperty == 'string') {
					// getter
					if (this.length) {
						if (d.defaultView && d.defaultView.getComputedStyle) {
							key = cssProperty.toLowerCase();
							return d.defaultView.getComputedStyle(this.get(0), '').getPropertyValue(key);
						} else if (this.get(0).currentStyle) {
							key = $.toCamelCase(cssProperty);
							return this.get(0).currentStyle[key];
						}
					}

					return null;
				} else {
					// setter multiple styles
					for (key in cssProperty)
						this.css(key, cssProperty[key]);

					return this;
				}
			}

			// setter
			return this.each(function () {
				if (!this.style.cssText)
					this.style.cssText +=  ';';

				this.style.cssText += cssProperty + ':' + value;
			});
		},

		/**
		 * Set or get style(s) of the style attribute
		 * @deprecated
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
					key = $.toCamelCase(style);
					return this.length ? this.get(0).style[key] : null;
				} else {
					// setter multiple styles
					for (key in style)
						this.style(key, style[key]);

					return this;
				}
			}

			// setter
			key = $.toCamelCase(style);

			return this.each(function () {
				if (typeof this.style[key] != 'undefined')
					this.style[key] = value;
			});
		}
	}
);

$.extend(
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

})(jLim);