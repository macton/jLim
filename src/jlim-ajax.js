/**
 * jLim Ajax
 *
 * @fileOverview
 *    Ajax related methods for jLim
 *    Based on SimpleAjax (see http://www.freelancephp.net/simpleajax-small-ajax-javascript-object/)
 *    Released under MIT license.
 * @package jLim
 * @requires jLim Core
 * @author Victor Villaverde Laan
 * @link http://www.freelancephp.net/jlim-ajax-plugin/
 */
(function ($, SimpleAjax) {

$.fn.extend(
	/**
	 * @lends jLim.fn
	 */
	{
		/**
		* Set content loaded by an ajax call
		* @param {String} url The url of the ajax call (include GET vars in querystring)
		* @param {String} [data] The POST data, when set method will be set to POST
		* @param {Function} [complete] Callback when loading is completed
		* @return {This}
		*/
		load: function (url, data, complete) {
			var self = this;

			$.ajax({
				url: url,
				type: data ? 'POST' : 'GET',
				data: data || null,
				complete: complete || null,
				success: function (html) {
					self.html(html);
				}
			});

			return this;
		}
	}
);

$.extend(
	/**
	 * @lends jLim
	 */
	{

		/**
		* Default ajax settings
		* @property {Object} ajaxSettings
		*/
		ajaxSettings: SimpleAjax.settings,

		/**
		* Change the default ajax settings
		* @param {Object} settings Overwrite the default settings, see ajaxSettings
		*/
		ajaxSetup: function (settings) {
			$.extend($.ajaxSettings, settings);
		},

		/**
		* Ajax call
		* @param {Object} [options] Overwrite the default settings for this call, see ajaxSettings
		* @return {XMLHttpRequest|ActiveXObject}
		*/
		ajax: function (options) {
			SimpleAjax.call(options);
			return SimpleAjax.xhr;
		},

		/**
		* Ajax GET request
		* @param {String} url
		* @param {String|Object} [data] Containing GET values
		* @param {Function} [success] Callback when request was succesfull
		* @return {XMLHttpRequest|ActiveXObject}
		*/
		get: function (url, data, success) {
			if ($.isFunction(data)) {
				success = data;
				data = null;
			}

			return $.ajax({
				url: url,
				type: 'GET',
				data: data,
				success: success
			});
		},

		/**
		* Ajax POST request
		* @param {String} url
		* @param {String|Object} [data] Containing post values
		* @param {Function} [success] Callback when request was succesfull
		* @return {XMLHttpRequest|ActiveXObject}
		*/
		post: function (url, data, success) {
			if ($.isFunction(data)) {
				success = data;
				data = null;
			}

			return $.ajax({
				url: url,
				type: 'POST',
				data: data,
				success: success
			});
		}
	}
);


})(jLim, SimpleAjax);