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
jLim.fn.extend(
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

			jLim.ajax({
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

jLim.extend(
	/**
	 * @lends jLim
	 */
	{
		/**
		* Make querystring outof object or array of values
		* @param {Object|Array} obj Keys/values
		* @return {String} The querystring
		*/
		param: function (obj) {
			var s = [];

			jLim.each( obj, function (k, v) {
				s.push(encodeURIComponent(k) +'='+ encodeURIComponent(v));
			});

			return s.join('&');
		},

		/**
		* Default ajax settings
		* @property {Object} ajaxSettings
		*/
		ajaxSettings: {
			url: '',
			type: 'GET',
			async: true,
			cache: true,
			data: null,
			contentType: 'application/x-www-form-urlencoded',
			success: null,
			error: null,
			complete: null
		},

		/**
		* Change the default ajax settings
		* @param {Object} settings Overwrite the default settings, see ajaxSettings
		*/
		ajaxSetup: function (settings) {
			jLim.extend(jLim.ajaxSettings, settings);
		},

		/**
		* Ajax call
		* @param {Object} [options] Overwrite the default settings for this call, see ajaxSettings
		* @return {XMLHttpRequest|ActiveXObject}
		*/
		ajax: function (options) {
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
				opts = jLim.extend({}, jLim.ajaxSettings, options),
				ready = function () {
					if (xhr.readyState == 4) {
						if (xhr.status == 200) {
							if (jLim.isFunction(opts.success))
								opts.success.call(opts, xhr.responseText, xhr.status, xhr);
						} else {
							if (jLim.isFunction(opts.error))
								opts.error.call(opts, xhr, xhr.status);
						}

						if (jLim.isFunction(opts.complete))
							opts.complete.call(opts, xhr, xhr.status);
					}
				};

			if (!opts.cache)
				opts.url += ((opts.url.indexOf('?') > -1) ? '&' : '?') + '_nocache='+ (new Date()).getTime();

			if ( opts.data ) {
				if (opts.type == 'GET') {
					opts.url += ((opts.url.indexOf('?') > -1) ? '&' : '?') + jLim.param(opts.data);
					opts.data = null;
				} else {
					opts.data = jLim.param(opts.data);
				}
			}

			// set request
			xhr.open(opts.type, opts.url, opts.async);
			xhr.setRequestHeader('Content-type', opts.contentType);

			if (opts.async) {
				xhr.onreadystatechange = ready;
				xhr.send(opts.data);
			} else {
				xhr.send(opts.data);
				ready();
			}

			return xhr;
		},

		/**
		* Ajax GET request
		* @param {String} url
		* @param {String|Object} [data] Containing GET values
		* @param {Function} [success] Callback when request was succesfull
		* @return {XMLHttpRequest|ActiveXObject}
		*/
		get: function (url, data, success) {
			if (jLim.isFunction(data)) {
				success = data;
				data = null;
			}

			return jLim.ajax({
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
			if (jLim.isFunction(data)) {
				success = data;
				data = null;
			}

			return jLim.ajax({
				url: url,
				type: 'POST',
				data: data,
				success: success
			});
		}
	}
);