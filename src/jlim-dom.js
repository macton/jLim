/**
 * jLim DOM
 *
 * @fileOverview
 *    DOM related methods for jLim.
 *    Released under MIT license.
 * @package jLim
 * @requires jLim Core
 * @author Victor Villaverde Laan
 * @link http://www.freelancephp.net/jlim-dom-plugin/
 */
(function ($) {

$.fn.extend(
	/**
	 * @lends jLim.fn
	 */
	{
		/**
		* Get or set attribute value
		* @param {String} name
		* @param {Mixed} [value] Set new value
		* @return {This|Mixed}
		*/
		attr: function (name, value) {
			// getter
			if (typeof value == 'undefined') {
				if (typeof name == 'string') {
					// getter
					return this.length ? this.get(0)[name] : null;
				} else {
					// setter multiple attrs
					for (var key in name) {
						this.attr(key, name[key]);
					}

					return this;
				}
			}

			// setter
			return this.each(function () {
				if (typeof this[name] != 'undefined') {
					if (value === null) {
						this.removeAttribute(name);
					} else {
						this[name] = value;
					}
				}
			});
		},

		/**
		* Remove given attribute
		* @param {String} name
		* @return {This}
		*/
		removeAttr: function (name) {
			return this.attr(name, null);
		},

		/**
		* Get or set html of selected elements
		* @param {String} [html] Set new html
		* @return {This|String}
		*/
		html: function (html) {
			// getter
			if (typeof html == 'undefined')
				return this.length ? this.get(0).innerHTML : null;

			// setter
			try {
				this.each(function () {
					this.innerHTML = html;
				});
			} catch (e) {
				this.empty().append(html);
			}

			return this;
		},

		/**
		* Empty all content of selected elements
		* @return {This}
		*/
		empty: function () {
			var el;

			for (var x = 0, l = this.size(); x < l; x++) {
				el = this[x];

				while (el.firstChild)
					el.removeChild(el.firstChild);
			}

			return this;
		},

		/**
		* GEt or set text of selected elements
		* @param {String} [text] Set new text
		* @return {This|String}
		*/
		text: function (text) {
			// getter
			if (typeof text == 'undefined')
				return this.length ? this.get(0).innerText : null;

			// setter, first empty element content and then add text
			return this.empty().each(function () {
				var textNode = document.createTextNode(text);
				$(this).append(textNode);
			});
		},

		/**
		* Remove selected elements
		* @return {This}
		*/
		remove: function () {
			return this.each(function () {
				this.parentNode.removeChild(this);
			});
		},

		/**
		* Append content to selected elements
		* @param {String|DOMElement|DOMElement[]|jLim.fn.init} content
		* @return {This}
		*/
		append: function (content) {
			var $content = $(content);

			return this.each(function (i) {
				var target = this;

				// clone content when more then one targets
				if (i > 0) $content = $content.clone();

				// add each content element as child of target
				$content.each(function (i) {
					target.appendChild($content.get(i));
				})
			});
		},

		/**
		* Prepend content to selected elements
		* @param {String|DOMElement|DOMElement[]|jLim.fn.init} content
		* @return {This}
		*/
		prepend: function (content) {
			var $content = $(content);

			return this.each(function (i) {
				// clone content when more then one targets
				if (i > 0) $content = $content.clone();

				if (this.childNodes.length > 0) {
					$content.insertBefore(this.childNodes[0]);
				} else {
					$(this).append($content);
				}
			});
		},

		/**
		* Append selected elements to given target
		* @param {String|DOMElement|DOMElement[]|jLim.fn.init} content
		* @return {This}
		*/
		appendTo: function (target) {
			$(target).append(this);
			return this;
		},

		/**
		* Prepend selected elements to given target
		* @param {String|DOMElement|DOMElement[]|jLim.fn.init} target
		* @return {This}
		*/
		prependTo: function (target) {
			$(target).prepend(this);
			return this;
		},

		/**
		* Insert selected elements after given target
		* @param {String|DOMElement|DOMElement[]|jLim.fn.init} target
		* @return {This}
		*/
		insertAfter: function (target) {
			var $target = $(target),
				self = this;

			$target.each(function(i) {
				// clone self when more then one targets
				var $content = (i > 0) ? self.clone() : self,
					target = this;

				// set other content element
				$content.each(function (i) {
					if (i == 0) {
						// set first element after target
						target.parentNode.insertBefore(this, target.nextSibling);
					} else {
						// set other elements
						var prev = $content.get(i - 1);
						prev.parentNode.insertBefore(this, prev.nextSibling);
					}
				});
			});

			return this;
		},

		/**
		* Insert selected elements before given target
		* @param {String|DOMElement|DOMElement[]|jLim.fn.init} target
		* @return {This}
		*/
		insertBefore: function (target) {
			var $target = $(target),
				self = this;

			$target.each(function (i) {
				// clone self when more then one targets
				var $content = (i > 0) ? self.clone() : self;

				// set first element before target
				this.parentNode.insertBefore($content.get(0), this);

				// insert other elements after the first
				$content.slice(1).insertAfter($content.get(0));
			});

			return this;
		},

		/**
		* Insert content after selected elements
		* @param {String|DOMElement|DOMElement[]|jLim.fn.init} content
		* @return {This}
		*/
		after: function (content) {
			$(content).insertAfter(this);
			return this;
		},

		/**
		* Insert content before selected elements
		* @param {String|DOMElement|DOMElement[]|jLim.fn.init} content
		* @return {This}
		*/
		before: function (content) {
			$(content).insertBefore(this);
			return this;
		},

		/**
		* Replace selected elements with the given content
		* @param {String|DOMElement|DOMElement[]|jLim.fn.init} content
		* @return {This}
		*/
		replaceWith: function (content) {
			var $content = $(content);

			return this.each(function (i) {
				// clone content when more then one targets
				$content = (i > 0) ? $content.clone() : $content;

				// replace with first element
				this.parentNode.replaceChild($content.get(0), this);

				// insert other elements after the first
				$content.slice(1).insertAfter($content.get(0));
			});
		},

		/**
		* Clone selected elements
		* @return {jLim.fn.init} Instance of the clone
		*/
		clone: function () {
			var els = [];

			this.each(function () {
				var clone;

				if (typeof this.cloneNode != 'undefined') {
					// clone DOM node
					clone = this.cloneNode(true);
				} else if (typeof this == 'object') {
					// clone object or array
					clone = $.extend({}, this);
				} else {
					clone = this;
				}

				els.push(clone);
			});

			return this.chain(els);
		}
	}
);

})(jLim);