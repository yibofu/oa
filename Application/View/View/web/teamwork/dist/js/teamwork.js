/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Application/View/View/web/teamwork/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = $;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(15);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function(a,b){ true?module.exports=b():"function"==typeof define&&define.amd?define(b):a.moment=b()}(this,function(){"use strict";function a(){return sd.apply(null,arguments)}function b(a){sd=a}function c(a){return a instanceof Array||"[object Array]"===Object.prototype.toString.call(a)}function d(a){return null!=a&&"[object Object]"===Object.prototype.toString.call(a)}function e(a){var b;for(b in a)return!1;return!0}function f(a){return void 0===a}function g(a){return"number"==typeof a||"[object Number]"===Object.prototype.toString.call(a)}function h(a){return a instanceof Date||"[object Date]"===Object.prototype.toString.call(a)}function i(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function j(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function k(a,b){for(var c in b)j(b,c)&&(a[c]=b[c]);return j(b,"toString")&&(a.toString=b.toString),j(b,"valueOf")&&(a.valueOf=b.valueOf),a}function l(a,b,c,d){return sb(a,b,c,d,!0).utc()}function m(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],meridiem:null,rfc2822:!1,weekdayMismatch:!1}}function n(a){return null==a._pf&&(a._pf=m()),a._pf}function o(a){if(null==a._isValid){var b=n(a),c=ud.call(b.parsedDateParts,function(a){return null!=a}),d=!isNaN(a._d.getTime())&&b.overflow<0&&!b.empty&&!b.invalidMonth&&!b.invalidWeekday&&!b.nullInput&&!b.invalidFormat&&!b.userInvalidated&&(!b.meridiem||b.meridiem&&c);if(a._strict&&(d=d&&0===b.charsLeftOver&&0===b.unusedTokens.length&&void 0===b.bigHour),null!=Object.isFrozen&&Object.isFrozen(a))return d;a._isValid=d}return a._isValid}function p(a){var b=l(NaN);return null!=a?k(n(b),a):n(b).userInvalidated=!0,b}function q(a,b){var c,d,e;if(f(b._isAMomentObject)||(a._isAMomentObject=b._isAMomentObject),f(b._i)||(a._i=b._i),f(b._f)||(a._f=b._f),f(b._l)||(a._l=b._l),f(b._strict)||(a._strict=b._strict),f(b._tzm)||(a._tzm=b._tzm),f(b._isUTC)||(a._isUTC=b._isUTC),f(b._offset)||(a._offset=b._offset),f(b._pf)||(a._pf=n(b)),f(b._locale)||(a._locale=b._locale),vd.length>0)for(c=0;c<vd.length;c++)d=vd[c],e=b[d],f(e)||(a[d]=e);return a}function r(b){q(this,b),this._d=new Date(null!=b._d?b._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),wd===!1&&(wd=!0,a.updateOffset(this),wd=!1)}function s(a){return a instanceof r||null!=a&&null!=a._isAMomentObject}function t(a){return a<0?Math.ceil(a)||0:Math.floor(a)}function u(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=t(b)),c}function v(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;d<e;d++)(c&&a[d]!==b[d]||!c&&u(a[d])!==u(b[d]))&&g++;return g+f}function w(b){a.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+b)}function x(b,c){var d=!0;return k(function(){if(null!=a.deprecationHandler&&a.deprecationHandler(null,b),d){for(var e,f=[],g=0;g<arguments.length;g++){if(e="","object"==typeof arguments[g]){e+="\n["+g+"] ";for(var h in arguments[0])e+=h+": "+arguments[0][h]+", ";e=e.slice(0,-2)}else e=arguments[g];f.push(e)}w(b+"\nArguments: "+Array.prototype.slice.call(f).join("")+"\n"+(new Error).stack),d=!1}return c.apply(this,arguments)},c)}function y(b,c){null!=a.deprecationHandler&&a.deprecationHandler(b,c),xd[b]||(w(c),xd[b]=!0)}function z(a){return a instanceof Function||"[object Function]"===Object.prototype.toString.call(a)}function A(a){var b,c;for(c in a)b=a[c],z(b)?this[c]=b:this["_"+c]=b;this._config=a,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)}function B(a,b){var c,e=k({},a);for(c in b)j(b,c)&&(d(a[c])&&d(b[c])?(e[c]={},k(e[c],a[c]),k(e[c],b[c])):null!=b[c]?e[c]=b[c]:delete e[c]);for(c in a)j(a,c)&&!j(b,c)&&d(a[c])&&(e[c]=k({},e[c]));return e}function C(a){null!=a&&this.set(a)}function D(a,b,c){var d=this._calendar[a]||this._calendar.sameElse;return z(d)?d.call(b,c):d}function E(a){var b=this._longDateFormat[a],c=this._longDateFormat[a.toUpperCase()];return b||!c?b:(this._longDateFormat[a]=c.replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a])}function F(){return this._invalidDate}function G(a){return this._ordinal.replace("%d",a)}function H(a,b,c,d){var e=this._relativeTime[c];return z(e)?e(a,b,c,d):e.replace(/%d/i,a)}function I(a,b){var c=this._relativeTime[a>0?"future":"past"];return z(c)?c(b):c.replace(/%s/i,b)}function J(a,b){var c=a.toLowerCase();Hd[c]=Hd[c+"s"]=Hd[b]=a}function K(a){return"string"==typeof a?Hd[a]||Hd[a.toLowerCase()]:void 0}function L(a){var b,c,d={};for(c in a)j(a,c)&&(b=K(c),b&&(d[b]=a[c]));return d}function M(a,b){Id[a]=b}function N(a){var b=[];for(var c in a)b.push({unit:c,priority:Id[c]});return b.sort(function(a,b){return a.priority-b.priority}),b}function O(b,c){return function(d){return null!=d?(Q(this,b,d),a.updateOffset(this,c),this):P(this,b)}}function P(a,b){return a.isValid()?a._d["get"+(a._isUTC?"UTC":"")+b]():NaN}function Q(a,b,c){a.isValid()&&a._d["set"+(a._isUTC?"UTC":"")+b](c)}function R(a){return a=K(a),z(this[a])?this[a]():this}function S(a,b){if("object"==typeof a){a=L(a);for(var c=N(a),d=0;d<c.length;d++)this[c[d].unit](a[c[d].unit])}else if(a=K(a),z(this[a]))return this[a](b);return this}function T(a,b,c){var d=""+Math.abs(a),e=b-d.length,f=a>=0;return(f?c?"+":"":"-")+Math.pow(10,Math.max(0,e)).toString().substr(1)+d}function U(a,b,c,d){var e=d;"string"==typeof d&&(e=function(){return this[d]()}),a&&(Md[a]=e),b&&(Md[b[0]]=function(){return T(e.apply(this,arguments),b[1],b[2])}),c&&(Md[c]=function(){return this.localeData().ordinal(e.apply(this,arguments),a)})}function V(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function W(a){var b,c,d=a.match(Jd);for(b=0,c=d.length;b<c;b++)Md[d[b]]?d[b]=Md[d[b]]:d[b]=V(d[b]);return function(b){var e,f="";for(e=0;e<c;e++)f+=z(d[e])?d[e].call(b,a):d[e];return f}}function X(a,b){return a.isValid()?(b=Y(b,a.localeData()),Ld[b]=Ld[b]||W(b),Ld[b](a)):a.localeData().invalidDate()}function Y(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Kd.lastIndex=0;d>=0&&Kd.test(a);)a=a.replace(Kd,c),Kd.lastIndex=0,d-=1;return a}function Z(a,b,c){ce[a]=z(b)?b:function(a,d){return a&&c?c:b}}function $(a,b){return j(ce,a)?ce[a](b._strict,b._locale):new RegExp(_(a))}function _(a){return aa(a.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e}))}function aa(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function ba(a,b){var c,d=b;for("string"==typeof a&&(a=[a]),g(b)&&(d=function(a,c){c[b]=u(a)}),c=0;c<a.length;c++)de[a[c]]=d}function ca(a,b){ba(a,function(a,c,d,e){d._w=d._w||{},b(a,d._w,d,e)})}function da(a,b,c){null!=b&&j(de,a)&&de[a](b,c._a,c,a)}function ea(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function fa(a,b){return a?c(this._months)?this._months[a.month()]:this._months[(this._months.isFormat||oe).test(b)?"format":"standalone"][a.month()]:c(this._months)?this._months:this._months.standalone}function ga(a,b){return a?c(this._monthsShort)?this._monthsShort[a.month()]:this._monthsShort[oe.test(b)?"format":"standalone"][a.month()]:c(this._monthsShort)?this._monthsShort:this._monthsShort.standalone}function ha(a,b,c){var d,e,f,g=a.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],d=0;d<12;++d)f=l([2e3,d]),this._shortMonthsParse[d]=this.monthsShort(f,"").toLocaleLowerCase(),this._longMonthsParse[d]=this.months(f,"").toLocaleLowerCase();return c?"MMM"===b?(e=ne.call(this._shortMonthsParse,g),e!==-1?e:null):(e=ne.call(this._longMonthsParse,g),e!==-1?e:null):"MMM"===b?(e=ne.call(this._shortMonthsParse,g),e!==-1?e:(e=ne.call(this._longMonthsParse,g),e!==-1?e:null)):(e=ne.call(this._longMonthsParse,g),e!==-1?e:(e=ne.call(this._shortMonthsParse,g),e!==-1?e:null))}function ia(a,b,c){var d,e,f;if(this._monthsParseExact)return ha.call(this,a,b,c);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;d<12;d++){if(e=l([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}}function ja(a,b){var c;if(!a.isValid())return a;if("string"==typeof b)if(/^\d+$/.test(b))b=u(b);else if(b=a.localeData().monthsParse(b),!g(b))return a;return c=Math.min(a.date(),ea(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a}function ka(b){return null!=b?(ja(this,b),a.updateOffset(this,!0),this):P(this,"Month")}function la(){return ea(this.year(),this.month())}function ma(a){return this._monthsParseExact?(j(this,"_monthsRegex")||oa.call(this),a?this._monthsShortStrictRegex:this._monthsShortRegex):(j(this,"_monthsShortRegex")||(this._monthsShortRegex=re),this._monthsShortStrictRegex&&a?this._monthsShortStrictRegex:this._monthsShortRegex)}function na(a){return this._monthsParseExact?(j(this,"_monthsRegex")||oa.call(this),a?this._monthsStrictRegex:this._monthsRegex):(j(this,"_monthsRegex")||(this._monthsRegex=se),this._monthsStrictRegex&&a?this._monthsStrictRegex:this._monthsRegex)}function oa(){function a(a,b){return b.length-a.length}var b,c,d=[],e=[],f=[];for(b=0;b<12;b++)c=l([2e3,b]),d.push(this.monthsShort(c,"")),e.push(this.months(c,"")),f.push(this.months(c,"")),f.push(this.monthsShort(c,""));for(d.sort(a),e.sort(a),f.sort(a),b=0;b<12;b++)d[b]=aa(d[b]),e[b]=aa(e[b]);for(b=0;b<24;b++)f[b]=aa(f[b]);this._monthsRegex=new RegExp("^("+f.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+e.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+d.join("|")+")","i")}function pa(a){return qa(a)?366:365}function qa(a){return a%4===0&&a%100!==0||a%400===0}function ra(){return qa(this.year())}function sa(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return a<100&&a>=0&&isFinite(h.getFullYear())&&h.setFullYear(a),h}function ta(a){var b=new Date(Date.UTC.apply(null,arguments));return a<100&&a>=0&&isFinite(b.getUTCFullYear())&&b.setUTCFullYear(a),b}function ua(a,b,c){var d=7+b-c,e=(7+ta(a,0,d).getUTCDay()-b)%7;return-e+d-1}function va(a,b,c,d,e){var f,g,h=(7+c-d)%7,i=ua(a,d,e),j=1+7*(b-1)+h+i;return j<=0?(f=a-1,g=pa(f)+j):j>pa(a)?(f=a+1,g=j-pa(a)):(f=a,g=j),{year:f,dayOfYear:g}}function wa(a,b,c){var d,e,f=ua(a.year(),b,c),g=Math.floor((a.dayOfYear()-f-1)/7)+1;return g<1?(e=a.year()-1,d=g+xa(e,b,c)):g>xa(a.year(),b,c)?(d=g-xa(a.year(),b,c),e=a.year()+1):(e=a.year(),d=g),{week:d,year:e}}function xa(a,b,c){var d=ua(a,b,c),e=ua(a+1,b,c);return(pa(a)-d+e)/7}function ya(a){return wa(a,this._week.dow,this._week.doy).week}function za(){return this._week.dow}function Aa(){return this._week.doy}function Ba(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")}function Ca(a){var b=wa(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")}function Da(a,b){return"string"!=typeof a?a:isNaN(a)?(a=b.weekdaysParse(a),"number"==typeof a?a:null):parseInt(a,10)}function Ea(a,b){return"string"==typeof a?b.weekdaysParse(a)%7||7:isNaN(a)?null:a}function Fa(a,b){return a?c(this._weekdays)?this._weekdays[a.day()]:this._weekdays[this._weekdays.isFormat.test(b)?"format":"standalone"][a.day()]:c(this._weekdays)?this._weekdays:this._weekdays.standalone}function Ga(a){return a?this._weekdaysShort[a.day()]:this._weekdaysShort}function Ha(a){return a?this._weekdaysMin[a.day()]:this._weekdaysMin}function Ia(a,b,c){var d,e,f,g=a.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],d=0;d<7;++d)f=l([2e3,1]).day(d),this._minWeekdaysParse[d]=this.weekdaysMin(f,"").toLocaleLowerCase(),this._shortWeekdaysParse[d]=this.weekdaysShort(f,"").toLocaleLowerCase(),this._weekdaysParse[d]=this.weekdays(f,"").toLocaleLowerCase();return c?"dddd"===b?(e=ne.call(this._weekdaysParse,g),e!==-1?e:null):"ddd"===b?(e=ne.call(this._shortWeekdaysParse,g),e!==-1?e:null):(e=ne.call(this._minWeekdaysParse,g),e!==-1?e:null):"dddd"===b?(e=ne.call(this._weekdaysParse,g),e!==-1?e:(e=ne.call(this._shortWeekdaysParse,g),e!==-1?e:(e=ne.call(this._minWeekdaysParse,g),e!==-1?e:null))):"ddd"===b?(e=ne.call(this._shortWeekdaysParse,g),e!==-1?e:(e=ne.call(this._weekdaysParse,g),e!==-1?e:(e=ne.call(this._minWeekdaysParse,g),e!==-1?e:null))):(e=ne.call(this._minWeekdaysParse,g),e!==-1?e:(e=ne.call(this._weekdaysParse,g),e!==-1?e:(e=ne.call(this._shortWeekdaysParse,g),e!==-1?e:null)))}function Ja(a,b,c){var d,e,f;if(this._weekdaysParseExact)return Ia.call(this,a,b,c);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),d=0;d<7;d++){if(e=l([2e3,1]).day(d),c&&!this._fullWeekdaysParse[d]&&(this._fullWeekdaysParse[d]=new RegExp("^"+this.weekdays(e,"").replace(".",".?")+"$","i"),this._shortWeekdaysParse[d]=new RegExp("^"+this.weekdaysShort(e,"").replace(".",".?")+"$","i"),this._minWeekdaysParse[d]=new RegExp("^"+this.weekdaysMin(e,"").replace(".",".?")+"$","i")),this._weekdaysParse[d]||(f="^"+this.weekdays(e,"")+"|^"+this.weekdaysShort(e,"")+"|^"+this.weekdaysMin(e,""),this._weekdaysParse[d]=new RegExp(f.replace(".",""),"i")),c&&"dddd"===b&&this._fullWeekdaysParse[d].test(a))return d;if(c&&"ddd"===b&&this._shortWeekdaysParse[d].test(a))return d;if(c&&"dd"===b&&this._minWeekdaysParse[d].test(a))return d;if(!c&&this._weekdaysParse[d].test(a))return d}}function Ka(a){if(!this.isValid())return null!=a?this:NaN;var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=Da(a,this.localeData()),this.add(a-b,"d")):b}function La(a){if(!this.isValid())return null!=a?this:NaN;var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")}function Ma(a){if(!this.isValid())return null!=a?this:NaN;if(null!=a){var b=Ea(a,this.localeData());return this.day(this.day()%7?b:b-7)}return this.day()||7}function Na(a){return this._weekdaysParseExact?(j(this,"_weekdaysRegex")||Qa.call(this),a?this._weekdaysStrictRegex:this._weekdaysRegex):(j(this,"_weekdaysRegex")||(this._weekdaysRegex=ye),this._weekdaysStrictRegex&&a?this._weekdaysStrictRegex:this._weekdaysRegex)}function Oa(a){return this._weekdaysParseExact?(j(this,"_weekdaysRegex")||Qa.call(this),a?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(j(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=ze),this._weekdaysShortStrictRegex&&a?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)}function Pa(a){return this._weekdaysParseExact?(j(this,"_weekdaysRegex")||Qa.call(this),a?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(j(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=Ae),this._weekdaysMinStrictRegex&&a?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)}function Qa(){function a(a,b){return b.length-a.length}var b,c,d,e,f,g=[],h=[],i=[],j=[];for(b=0;b<7;b++)c=l([2e3,1]).day(b),d=this.weekdaysMin(c,""),e=this.weekdaysShort(c,""),f=this.weekdays(c,""),g.push(d),h.push(e),i.push(f),j.push(d),j.push(e),j.push(f);for(g.sort(a),h.sort(a),i.sort(a),j.sort(a),b=0;b<7;b++)h[b]=aa(h[b]),i[b]=aa(i[b]),j[b]=aa(j[b]);this._weekdaysRegex=new RegExp("^("+j.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+i.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+h.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+g.join("|")+")","i")}function Ra(){return this.hours()%12||12}function Sa(){return this.hours()||24}function Ta(a,b){U(a,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),b)})}function Ua(a,b){return b._meridiemParse}function Va(a){return"p"===(a+"").toLowerCase().charAt(0)}function Wa(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"}function Xa(a){return a?a.toLowerCase().replace("_","-"):a}function Ya(a){for(var b,c,d,e,f=0;f<a.length;){for(e=Xa(a[f]).split("-"),b=e.length,c=Xa(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=Za(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&v(e,c,!0)>=b-1)break;b--}f++}return null}function Za(a){var b=null;if(!Fe[a]&&"undefined"!=typeof module&&module&&module.exports)try{b=Be._abbr,__webpack_require__(18)("./"+a),$a(b)}catch(a){}return Fe[a]}function $a(a,b){var c;return a&&(c=f(b)?bb(a):_a(a,b),c&&(Be=c)),Be._abbr}function _a(a,b){if(null!==b){var c=Ee;if(b.abbr=a,null!=Fe[a])y("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),c=Fe[a]._config;else if(null!=b.parentLocale){if(null==Fe[b.parentLocale])return Ge[b.parentLocale]||(Ge[b.parentLocale]=[]),Ge[b.parentLocale].push({name:a,config:b}),null;c=Fe[b.parentLocale]._config}return Fe[a]=new C(B(c,b)),Ge[a]&&Ge[a].forEach(function(a){_a(a.name,a.config)}),$a(a),Fe[a]}return delete Fe[a],null}function ab(a,b){if(null!=b){var c,d=Ee;null!=Fe[a]&&(d=Fe[a]._config),b=B(d,b),c=new C(b),c.parentLocale=Fe[a],Fe[a]=c,$a(a)}else null!=Fe[a]&&(null!=Fe[a].parentLocale?Fe[a]=Fe[a].parentLocale:null!=Fe[a]&&delete Fe[a]);return Fe[a]}function bb(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return Be;if(!c(a)){if(b=Za(a))return b;a=[a]}return Ya(a)}function cb(){return Ad(Fe)}function db(a){var b,c=a._a;return c&&n(a).overflow===-2&&(b=c[fe]<0||c[fe]>11?fe:c[ge]<1||c[ge]>ea(c[ee],c[fe])?ge:c[he]<0||c[he]>24||24===c[he]&&(0!==c[ie]||0!==c[je]||0!==c[ke])?he:c[ie]<0||c[ie]>59?ie:c[je]<0||c[je]>59?je:c[ke]<0||c[ke]>999?ke:-1,n(a)._overflowDayOfYear&&(b<ee||b>ge)&&(b=ge),n(a)._overflowWeeks&&b===-1&&(b=le),n(a)._overflowWeekday&&b===-1&&(b=me),n(a).overflow=b),a}function eb(a){var b,c,d,e,f,g,h=a._i,i=He.exec(h)||Ie.exec(h);if(i){for(n(a).iso=!0,b=0,c=Ke.length;b<c;b++)if(Ke[b][1].exec(i[1])){e=Ke[b][0],d=Ke[b][2]!==!1;break}if(null==e)return void(a._isValid=!1);if(i[3]){for(b=0,c=Le.length;b<c;b++)if(Le[b][1].exec(i[3])){f=(i[2]||" ")+Le[b][0];break}if(null==f)return void(a._isValid=!1)}if(!d&&null!=f)return void(a._isValid=!1);if(i[4]){if(!Je.exec(i[4]))return void(a._isValid=!1);g="Z"}a._f=e+(f||"")+(g||""),lb(a)}else a._isValid=!1}function fb(a){var b,c,d,e,f,g,h,i,j={" GMT":" +0000"," EDT":" -0400"," EST":" -0500"," CDT":" -0500"," CST":" -0600"," MDT":" -0600"," MST":" -0700"," PDT":" -0700"," PST":" -0800"},k="YXWVUTSRQPONZABCDEFGHIKLM";if(b=a._i.replace(/\([^\)]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").replace(/^\s|\s$/g,""),c=Ne.exec(b)){if(d=c[1]?"ddd"+(5===c[1].length?", ":" "):"",e="D MMM "+(c[2].length>10?"YYYY ":"YY "),f="HH:mm"+(c[4]?":ss":""),c[1]){var l=new Date(c[2]),m=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][l.getDay()];if(c[1].substr(0,3)!==m)return n(a).weekdayMismatch=!0,void(a._isValid=!1)}switch(c[5].length){case 2:0===i?h=" +0000":(i=k.indexOf(c[5][1].toUpperCase())-12,h=(i<0?" -":" +")+(""+i).replace(/^-?/,"0").match(/..$/)[0]+"00");break;case 4:h=j[c[5]];break;default:h=j[" GMT"]}c[5]=h,a._i=c.splice(1).join(""),g=" ZZ",a._f=d+e+f+g,lb(a),n(a).rfc2822=!0}else a._isValid=!1}function gb(b){var c=Me.exec(b._i);return null!==c?void(b._d=new Date(+c[1])):(eb(b),void(b._isValid===!1&&(delete b._isValid,fb(b),b._isValid===!1&&(delete b._isValid,a.createFromInputFallback(b)))))}function hb(a,b,c){return null!=a?a:null!=b?b:c}function ib(b){var c=new Date(a.now());return b._useUTC?[c.getUTCFullYear(),c.getUTCMonth(),c.getUTCDate()]:[c.getFullYear(),c.getMonth(),c.getDate()]}function jb(a){var b,c,d,e,f=[];if(!a._d){for(d=ib(a),a._w&&null==a._a[ge]&&null==a._a[fe]&&kb(a),null!=a._dayOfYear&&(e=hb(a._a[ee],d[ee]),(a._dayOfYear>pa(e)||0===a._dayOfYear)&&(n(a)._overflowDayOfYear=!0),c=ta(e,0,a._dayOfYear),a._a[fe]=c.getUTCMonth(),a._a[ge]=c.getUTCDate()),b=0;b<3&&null==a._a[b];++b)a._a[b]=f[b]=d[b];for(;b<7;b++)a._a[b]=f[b]=null==a._a[b]?2===b?1:0:a._a[b];24===a._a[he]&&0===a._a[ie]&&0===a._a[je]&&0===a._a[ke]&&(a._nextDay=!0,a._a[he]=0),a._d=(a._useUTC?ta:sa).apply(null,f),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[he]=24)}}function kb(a){var b,c,d,e,f,g,h,i;if(b=a._w,null!=b.GG||null!=b.W||null!=b.E)f=1,g=4,c=hb(b.GG,a._a[ee],wa(tb(),1,4).year),d=hb(b.W,1),e=hb(b.E,1),(e<1||e>7)&&(i=!0);else{f=a._locale._week.dow,g=a._locale._week.doy;var j=wa(tb(),f,g);c=hb(b.gg,a._a[ee],j.year),d=hb(b.w,j.week),null!=b.d?(e=b.d,(e<0||e>6)&&(i=!0)):null!=b.e?(e=b.e+f,(b.e<0||b.e>6)&&(i=!0)):e=f}d<1||d>xa(c,f,g)?n(a)._overflowWeeks=!0:null!=i?n(a)._overflowWeekday=!0:(h=va(c,d,e,f,g),a._a[ee]=h.year,a._dayOfYear=h.dayOfYear)}function lb(b){if(b._f===a.ISO_8601)return void eb(b);if(b._f===a.RFC_2822)return void fb(b);b._a=[],n(b).empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,j=0;for(e=Y(b._f,b._locale).match(Jd)||[],c=0;c<e.length;c++)f=e[c],d=(h.match($(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&n(b).unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),j+=d.length),Md[f]?(d?n(b).empty=!1:n(b).unusedTokens.push(f),da(f,d,b)):b._strict&&!d&&n(b).unusedTokens.push(f);n(b).charsLeftOver=i-j,h.length>0&&n(b).unusedInput.push(h),b._a[he]<=12&&n(b).bigHour===!0&&b._a[he]>0&&(n(b).bigHour=void 0),n(b).parsedDateParts=b._a.slice(0),n(b).meridiem=b._meridiem,b._a[he]=mb(b._locale,b._a[he],b._meridiem),jb(b),db(b)}function mb(a,b,c){var d;return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&b<12&&(b+=12),d||12!==b||(b=0),b):b}function nb(a){var b,c,d,e,f;if(0===a._f.length)return n(a).invalidFormat=!0,void(a._d=new Date(NaN));for(e=0;e<a._f.length;e++)f=0,b=q({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._f=a._f[e],lb(b),o(b)&&(f+=n(b).charsLeftOver,f+=10*n(b).unusedTokens.length,n(b).score=f,(null==d||f<d)&&(d=f,c=b));k(a,c||b)}function ob(a){if(!a._d){var b=L(a._i);a._a=i([b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],function(a){return a&&parseInt(a,10)}),jb(a)}}function pb(a){var b=new r(db(qb(a)));return b._nextDay&&(b.add(1,"d"),b._nextDay=void 0),b}function qb(a){var b=a._i,d=a._f;return a._locale=a._locale||bb(a._l),null===b||void 0===d&&""===b?p({nullInput:!0}):("string"==typeof b&&(a._i=b=a._locale.preparse(b)),s(b)?new r(db(b)):(h(b)?a._d=b:c(d)?nb(a):d?lb(a):rb(a),o(a)||(a._d=null),a))}function rb(b){var e=b._i;f(e)?b._d=new Date(a.now()):h(e)?b._d=new Date(e.valueOf()):"string"==typeof e?gb(b):c(e)?(b._a=i(e.slice(0),function(a){return parseInt(a,10)}),jb(b)):d(e)?ob(b):g(e)?b._d=new Date(e):a.createFromInputFallback(b)}function sb(a,b,f,g,h){var i={};return f!==!0&&f!==!1||(g=f,f=void 0),(d(a)&&e(a)||c(a)&&0===a.length)&&(a=void 0),i._isAMomentObject=!0,i._useUTC=i._isUTC=h,i._l=f,i._i=a,i._f=b,i._strict=g,pb(i)}function tb(a,b,c,d){return sb(a,b,c,d,!1)}function ub(a,b){var d,e;if(1===b.length&&c(b[0])&&(b=b[0]),!b.length)return tb();for(d=b[0],e=1;e<b.length;++e)b[e].isValid()&&!b[e][a](d)||(d=b[e]);return d}function vb(){var a=[].slice.call(arguments,0);return ub("isBefore",a)}function wb(){var a=[].slice.call(arguments,0);return ub("isAfter",a)}function xb(a){for(var b in a)if(Re.indexOf(b)===-1||null!=a[b]&&isNaN(a[b]))return!1;for(var c=!1,d=0;d<Re.length;++d)if(a[Re[d]]){if(c)return!1;parseFloat(a[Re[d]])!==u(a[Re[d]])&&(c=!0)}return!0}function yb(){return this._isValid}function zb(){return Sb(NaN)}function Ab(a){var b=L(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._isValid=xb(b),this._milliseconds=+k+1e3*j+6e4*i+1e3*h*60*60,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=bb(),this._bubble()}function Bb(a){return a instanceof Ab}function Cb(a){return a<0?Math.round(-1*a)*-1:Math.round(a)}function Db(a,b){U(a,0,0,function(){var a=this.utcOffset(),c="+";return a<0&&(a=-a,c="-"),c+T(~~(a/60),2)+b+T(~~a%60,2)})}function Eb(a,b){var c=(b||"").match(a);if(null===c)return null;var d=c[c.length-1]||[],e=(d+"").match(Se)||["-",0,0],f=+(60*e[1])+u(e[2]);return 0===f?0:"+"===e[0]?f:-f}function Fb(b,c){var d,e;return c._isUTC?(d=c.clone(),e=(s(b)||h(b)?b.valueOf():tb(b).valueOf())-d.valueOf(),d._d.setTime(d._d.valueOf()+e),a.updateOffset(d,!1),d):tb(b).local()}function Gb(a){return 15*-Math.round(a._d.getTimezoneOffset()/15)}function Hb(b,c,d){var e,f=this._offset||0;if(!this.isValid())return null!=b?this:NaN;if(null!=b){if("string"==typeof b){if(b=Eb(_d,b),null===b)return this}else Math.abs(b)<16&&!d&&(b=60*b);return!this._isUTC&&c&&(e=Gb(this)),this._offset=b,this._isUTC=!0,null!=e&&this.add(e,"m"),f!==b&&(!c||this._changeInProgress?Xb(this,Sb(b-f,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,a.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?f:Gb(this)}function Ib(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}function Jb(a){return this.utcOffset(0,a)}function Kb(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(Gb(this),"m")),this}function Lb(){if(null!=this._tzm)this.utcOffset(this._tzm,!1,!0);else if("string"==typeof this._i){var a=Eb($d,this._i);null!=a?this.utcOffset(a):this.utcOffset(0,!0)}return this}function Mb(a){return!!this.isValid()&&(a=a?tb(a).utcOffset():0,(this.utcOffset()-a)%60===0)}function Nb(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Ob(){if(!f(this._isDSTShifted))return this._isDSTShifted;var a={};if(q(a,this),a=qb(a),a._a){var b=a._isUTC?l(a._a):tb(a._a);this._isDSTShifted=this.isValid()&&v(a._a,b.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function Pb(){return!!this.isValid()&&!this._isUTC}function Qb(){return!!this.isValid()&&this._isUTC}function Rb(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}function Sb(a,b){var c,d,e,f=a,h=null;return Bb(a)?f={ms:a._milliseconds,d:a._days,M:a._months}:g(a)?(f={},b?f[b]=a:f.milliseconds=a):(h=Te.exec(a))?(c="-"===h[1]?-1:1,f={y:0,d:u(h[ge])*c,h:u(h[he])*c,m:u(h[ie])*c,s:u(h[je])*c,ms:u(Cb(1e3*h[ke]))*c}):(h=Ue.exec(a))?(c="-"===h[1]?-1:1,f={y:Tb(h[2],c),M:Tb(h[3],c),w:Tb(h[4],c),d:Tb(h[5],c),h:Tb(h[6],c),m:Tb(h[7],c),s:Tb(h[8],c)}):null==f?f={}:"object"==typeof f&&("from"in f||"to"in f)&&(e=Vb(tb(f.from),tb(f.to)),f={},f.ms=e.milliseconds,f.M=e.months),d=new Ab(f),Bb(a)&&j(a,"_locale")&&(d._locale=a._locale),d}function Tb(a,b){var c=a&&parseFloat(a.replace(",","."));return(isNaN(c)?0:c)*b}function Ub(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function Vb(a,b){var c;return a.isValid()&&b.isValid()?(b=Fb(b,a),a.isBefore(b)?c=Ub(a,b):(c=Ub(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c):{milliseconds:0,months:0}}function Wb(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(y(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=Sb(c,d),Xb(this,e,a),this}}function Xb(b,c,d,e){var f=c._milliseconds,g=Cb(c._days),h=Cb(c._months);b.isValid()&&(e=null==e||e,f&&b._d.setTime(b._d.valueOf()+f*d),g&&Q(b,"Date",P(b,"Date")+g*d),h&&ja(b,P(b,"Month")+h*d),e&&a.updateOffset(b,g||h))}function Yb(a,b){var c=a.diff(b,"days",!0);return c<-6?"sameElse":c<-1?"lastWeek":c<0?"lastDay":c<1?"sameDay":c<2?"nextDay":c<7?"nextWeek":"sameElse"}function Zb(b,c){var d=b||tb(),e=Fb(d,this).startOf("day"),f=a.calendarFormat(this,e)||"sameElse",g=c&&(z(c[f])?c[f].call(this,d):c[f]);return this.format(g||this.localeData().calendar(f,this,tb(d)))}function $b(){return new r(this)}function _b(a,b){var c=s(a)?a:tb(a);return!(!this.isValid()||!c.isValid())&&(b=K(f(b)?"millisecond":b),"millisecond"===b?this.valueOf()>c.valueOf():c.valueOf()<this.clone().startOf(b).valueOf())}function ac(a,b){var c=s(a)?a:tb(a);return!(!this.isValid()||!c.isValid())&&(b=K(f(b)?"millisecond":b),"millisecond"===b?this.valueOf()<c.valueOf():this.clone().endOf(b).valueOf()<c.valueOf())}function bc(a,b,c,d){return d=d||"()",("("===d[0]?this.isAfter(a,c):!this.isBefore(a,c))&&(")"===d[1]?this.isBefore(b,c):!this.isAfter(b,c))}function cc(a,b){var c,d=s(a)?a:tb(a);return!(!this.isValid()||!d.isValid())&&(b=K(b||"millisecond"),"millisecond"===b?this.valueOf()===d.valueOf():(c=d.valueOf(),this.clone().startOf(b).valueOf()<=c&&c<=this.clone().endOf(b).valueOf()))}function dc(a,b){return this.isSame(a,b)||this.isAfter(a,b)}function ec(a,b){return this.isSame(a,b)||this.isBefore(a,b)}function fc(a,b,c){var d,e,f,g;return this.isValid()?(d=Fb(a,this),d.isValid()?(e=6e4*(d.utcOffset()-this.utcOffset()),b=K(b),"year"===b||"month"===b||"quarter"===b?(g=gc(this,d),"quarter"===b?g/=3:"year"===b&&(g/=12)):(f=this-d,g="second"===b?f/1e3:"minute"===b?f/6e4:"hour"===b?f/36e5:"day"===b?(f-e)/864e5:"week"===b?(f-e)/6048e5:f),c?g:t(g)):NaN):NaN}function gc(a,b){var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),f=a.clone().add(e,"months");return b-f<0?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)||0}function hc(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function ic(){if(!this.isValid())return null;var a=this.clone().utc();return a.year()<0||a.year()>9999?X(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):z(Date.prototype.toISOString)?this.toDate().toISOString():X(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function jc(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var a="moment",b="";this.isLocal()||(a=0===this.utcOffset()?"moment.utc":"moment.parseZone",b="Z");var c="["+a+'("]',d=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY",e="-MM-DD[T]HH:mm:ss.SSS",f=b+'[")]';return this.format(c+d+e+f)}function kc(b){b||(b=this.isUtc()?a.defaultFormatUtc:a.defaultFormat);var c=X(this,b);return this.localeData().postformat(c)}function lc(a,b){return this.isValid()&&(s(a)&&a.isValid()||tb(a).isValid())?Sb({to:this,from:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function mc(a){return this.from(tb(),a)}function nc(a,b){return this.isValid()&&(s(a)&&a.isValid()||tb(a).isValid())?Sb({from:this,to:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function oc(a){return this.to(tb(),a)}function pc(a){var b;return void 0===a?this._locale._abbr:(b=bb(a),null!=b&&(this._locale=b),this)}function qc(){return this._locale}function rc(a){switch(a=K(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":case"date":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a&&this.weekday(0),"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this}function sc(a){return a=K(a),void 0===a||"millisecond"===a?this:("date"===a&&(a="day"),this.startOf(a).add(1,"isoWeek"===a?"week":a).subtract(1,"ms"))}function tc(){return this._d.valueOf()-6e4*(this._offset||0)}function uc(){return Math.floor(this.valueOf()/1e3)}function vc(){return new Date(this.valueOf())}function wc(){var a=this;return[a.year(),a.month(),a.date(),a.hour(),a.minute(),a.second(),a.millisecond()]}function xc(){var a=this;return{years:a.year(),months:a.month(),date:a.date(),hours:a.hours(),minutes:a.minutes(),seconds:a.seconds(),milliseconds:a.milliseconds()}}function yc(){return this.isValid()?this.toISOString():null}function zc(){return o(this)}function Ac(){
return k({},n(this))}function Bc(){return n(this).overflow}function Cc(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}}function Dc(a,b){U(0,[a,a.length],0,b)}function Ec(a){return Ic.call(this,a,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)}function Fc(a){return Ic.call(this,a,this.isoWeek(),this.isoWeekday(),1,4)}function Gc(){return xa(this.year(),1,4)}function Hc(){var a=this.localeData()._week;return xa(this.year(),a.dow,a.doy)}function Ic(a,b,c,d,e){var f;return null==a?wa(this,d,e).year:(f=xa(a,d,e),b>f&&(b=f),Jc.call(this,a,b,c,d,e))}function Jc(a,b,c,d,e){var f=va(a,b,c,d,e),g=ta(f.year,0,f.dayOfYear);return this.year(g.getUTCFullYear()),this.month(g.getUTCMonth()),this.date(g.getUTCDate()),this}function Kc(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)}function Lc(a){var b=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")}function Mc(a,b){b[ke]=u(1e3*("0."+a))}function Nc(){return this._isUTC?"UTC":""}function Oc(){return this._isUTC?"Coordinated Universal Time":""}function Pc(a){return tb(1e3*a)}function Qc(){return tb.apply(null,arguments).parseZone()}function Rc(a){return a}function Sc(a,b,c,d){var e=bb(),f=l().set(d,b);return e[c](f,a)}function Tc(a,b,c){if(g(a)&&(b=a,a=void 0),a=a||"",null!=b)return Sc(a,b,c,"month");var d,e=[];for(d=0;d<12;d++)e[d]=Sc(a,d,c,"month");return e}function Uc(a,b,c,d){"boolean"==typeof a?(g(b)&&(c=b,b=void 0),b=b||""):(b=a,c=b,a=!1,g(b)&&(c=b,b=void 0),b=b||"");var e=bb(),f=a?e._week.dow:0;if(null!=c)return Sc(b,(c+f)%7,d,"day");var h,i=[];for(h=0;h<7;h++)i[h]=Sc(b,(h+f)%7,d,"day");return i}function Vc(a,b){return Tc(a,b,"months")}function Wc(a,b){return Tc(a,b,"monthsShort")}function Xc(a,b,c){return Uc(a,b,c,"weekdays")}function Yc(a,b,c){return Uc(a,b,c,"weekdaysShort")}function Zc(a,b,c){return Uc(a,b,c,"weekdaysMin")}function $c(){var a=this._data;return this._milliseconds=df(this._milliseconds),this._days=df(this._days),this._months=df(this._months),a.milliseconds=df(a.milliseconds),a.seconds=df(a.seconds),a.minutes=df(a.minutes),a.hours=df(a.hours),a.months=df(a.months),a.years=df(a.years),this}function _c(a,b,c,d){var e=Sb(b,c);return a._milliseconds+=d*e._milliseconds,a._days+=d*e._days,a._months+=d*e._months,a._bubble()}function ad(a,b){return _c(this,a,b,1)}function bd(a,b){return _c(this,a,b,-1)}function cd(a){return a<0?Math.floor(a):Math.ceil(a)}function dd(){var a,b,c,d,e,f=this._milliseconds,g=this._days,h=this._months,i=this._data;return f>=0&&g>=0&&h>=0||f<=0&&g<=0&&h<=0||(f+=864e5*cd(fd(h)+g),g=0,h=0),i.milliseconds=f%1e3,a=t(f/1e3),i.seconds=a%60,b=t(a/60),i.minutes=b%60,c=t(b/60),i.hours=c%24,g+=t(c/24),e=t(ed(g)),h+=e,g-=cd(fd(e)),d=t(h/12),h%=12,i.days=g,i.months=h,i.years=d,this}function ed(a){return 4800*a/146097}function fd(a){return 146097*a/4800}function gd(a){if(!this.isValid())return NaN;var b,c,d=this._milliseconds;if(a=K(a),"month"===a||"year"===a)return b=this._days+d/864e5,c=this._months+ed(b),"month"===a?c:c/12;switch(b=this._days+Math.round(fd(this._months)),a){case"week":return b/7+d/6048e5;case"day":return b+d/864e5;case"hour":return 24*b+d/36e5;case"minute":return 1440*b+d/6e4;case"second":return 86400*b+d/1e3;case"millisecond":return Math.floor(864e5*b)+d;default:throw new Error("Unknown unit "+a)}}function hd(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*u(this._months/12):NaN}function id(a){return function(){return this.as(a)}}function jd(a){return a=K(a),this.isValid()?this[a+"s"]():NaN}function kd(a){return function(){return this.isValid()?this._data[a]:NaN}}function ld(){return t(this.days()/7)}function md(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function nd(a,b,c){var d=Sb(a).abs(),e=uf(d.as("s")),f=uf(d.as("m")),g=uf(d.as("h")),h=uf(d.as("d")),i=uf(d.as("M")),j=uf(d.as("y")),k=e<=vf.ss&&["s",e]||e<vf.s&&["ss",e]||f<=1&&["m"]||f<vf.m&&["mm",f]||g<=1&&["h"]||g<vf.h&&["hh",g]||h<=1&&["d"]||h<vf.d&&["dd",h]||i<=1&&["M"]||i<vf.M&&["MM",i]||j<=1&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,md.apply(null,k)}function od(a){return void 0===a?uf:"function"==typeof a&&(uf=a,!0)}function pd(a,b){return void 0!==vf[a]&&(void 0===b?vf[a]:(vf[a]=b,"s"===a&&(vf.ss=b-1),!0))}function qd(a){if(!this.isValid())return this.localeData().invalidDate();var b=this.localeData(),c=nd(this,!a,b);return a&&(c=b.pastFuture(+this,c)),b.postformat(c)}function rd(){if(!this.isValid())return this.localeData().invalidDate();var a,b,c,d=wf(this._milliseconds)/1e3,e=wf(this._days),f=wf(this._months);a=t(d/60),b=t(a/60),d%=60,a%=60,c=t(f/12),f%=12;var g=c,h=f,i=e,j=b,k=a,l=d,m=this.asSeconds();return m?(m<0?"-":"")+"P"+(g?g+"Y":"")+(h?h+"M":"")+(i?i+"D":"")+(j||k||l?"T":"")+(j?j+"H":"")+(k?k+"M":"")+(l?l+"S":""):"P0D"}var sd,td;td=Array.prototype.some?Array.prototype.some:function(a){for(var b=Object(this),c=b.length>>>0,d=0;d<c;d++)if(d in b&&a.call(this,b[d],d,b))return!0;return!1};var ud=td,vd=a.momentProperties=[],wd=!1,xd={};a.suppressDeprecationWarnings=!1,a.deprecationHandler=null;var yd;yd=Object.keys?Object.keys:function(a){var b,c=[];for(b in a)j(a,b)&&c.push(b);return c};var zd,Ad=yd,Bd={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},Cd={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},Dd="Invalid date",Ed="%d",Fd=/\d{1,2}/,Gd={future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},Hd={},Id={},Jd=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,Kd=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Ld={},Md={},Nd=/\d/,Od=/\d\d/,Pd=/\d{3}/,Qd=/\d{4}/,Rd=/[+-]?\d{6}/,Sd=/\d\d?/,Td=/\d\d\d\d?/,Ud=/\d\d\d\d\d\d?/,Vd=/\d{1,3}/,Wd=/\d{1,4}/,Xd=/[+-]?\d{1,6}/,Yd=/\d+/,Zd=/[+-]?\d+/,$d=/Z|[+-]\d\d:?\d\d/gi,_d=/Z|[+-]\d\d(?::?\d\d)?/gi,ae=/[+-]?\d+(\.\d{1,3})?/,be=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,ce={},de={},ee=0,fe=1,ge=2,he=3,ie=4,je=5,ke=6,le=7,me=8;zd=Array.prototype.indexOf?Array.prototype.indexOf:function(a){var b;for(b=0;b<this.length;++b)if(this[b]===a)return b;return-1};var ne=zd;U("M",["MM",2],"Mo",function(){return this.month()+1}),U("MMM",0,0,function(a){return this.localeData().monthsShort(this,a)}),U("MMMM",0,0,function(a){return this.localeData().months(this,a)}),J("month","M"),M("month",8),Z("M",Sd),Z("MM",Sd,Od),Z("MMM",function(a,b){return b.monthsShortRegex(a)}),Z("MMMM",function(a,b){return b.monthsRegex(a)}),ba(["M","MM"],function(a,b){b[fe]=u(a)-1}),ba(["MMM","MMMM"],function(a,b,c,d){var e=c._locale.monthsParse(a,d,c._strict);null!=e?b[fe]=e:n(c).invalidMonth=a});var oe=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,pe="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),qe="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),re=be,se=be;U("Y",0,0,function(){var a=this.year();return a<=9999?""+a:"+"+a}),U(0,["YY",2],0,function(){return this.year()%100}),U(0,["YYYY",4],0,"year"),U(0,["YYYYY",5],0,"year"),U(0,["YYYYYY",6,!0],0,"year"),J("year","y"),M("year",1),Z("Y",Zd),Z("YY",Sd,Od),Z("YYYY",Wd,Qd),Z("YYYYY",Xd,Rd),Z("YYYYYY",Xd,Rd),ba(["YYYYY","YYYYYY"],ee),ba("YYYY",function(b,c){c[ee]=2===b.length?a.parseTwoDigitYear(b):u(b)}),ba("YY",function(b,c){c[ee]=a.parseTwoDigitYear(b)}),ba("Y",function(a,b){b[ee]=parseInt(a,10)}),a.parseTwoDigitYear=function(a){return u(a)+(u(a)>68?1900:2e3)};var te=O("FullYear",!0);U("w",["ww",2],"wo","week"),U("W",["WW",2],"Wo","isoWeek"),J("week","w"),J("isoWeek","W"),M("week",5),M("isoWeek",5),Z("w",Sd),Z("ww",Sd,Od),Z("W",Sd),Z("WW",Sd,Od),ca(["w","ww","W","WW"],function(a,b,c,d){b[d.substr(0,1)]=u(a)});var ue={dow:0,doy:6};U("d",0,"do","day"),U("dd",0,0,function(a){return this.localeData().weekdaysMin(this,a)}),U("ddd",0,0,function(a){return this.localeData().weekdaysShort(this,a)}),U("dddd",0,0,function(a){return this.localeData().weekdays(this,a)}),U("e",0,0,"weekday"),U("E",0,0,"isoWeekday"),J("day","d"),J("weekday","e"),J("isoWeekday","E"),M("day",11),M("weekday",11),M("isoWeekday",11),Z("d",Sd),Z("e",Sd),Z("E",Sd),Z("dd",function(a,b){return b.weekdaysMinRegex(a)}),Z("ddd",function(a,b){return b.weekdaysShortRegex(a)}),Z("dddd",function(a,b){return b.weekdaysRegex(a)}),ca(["dd","ddd","dddd"],function(a,b,c,d){var e=c._locale.weekdaysParse(a,d,c._strict);null!=e?b.d=e:n(c).invalidWeekday=a}),ca(["d","e","E"],function(a,b,c,d){b[d]=u(a)});var ve="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),we="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),xe="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),ye=be,ze=be,Ae=be;U("H",["HH",2],0,"hour"),U("h",["hh",2],0,Ra),U("k",["kk",2],0,Sa),U("hmm",0,0,function(){return""+Ra.apply(this)+T(this.minutes(),2)}),U("hmmss",0,0,function(){return""+Ra.apply(this)+T(this.minutes(),2)+T(this.seconds(),2)}),U("Hmm",0,0,function(){return""+this.hours()+T(this.minutes(),2)}),U("Hmmss",0,0,function(){return""+this.hours()+T(this.minutes(),2)+T(this.seconds(),2)}),Ta("a",!0),Ta("A",!1),J("hour","h"),M("hour",13),Z("a",Ua),Z("A",Ua),Z("H",Sd),Z("h",Sd),Z("k",Sd),Z("HH",Sd,Od),Z("hh",Sd,Od),Z("kk",Sd,Od),Z("hmm",Td),Z("hmmss",Ud),Z("Hmm",Td),Z("Hmmss",Ud),ba(["H","HH"],he),ba(["k","kk"],function(a,b,c){var d=u(a);b[he]=24===d?0:d}),ba(["a","A"],function(a,b,c){c._isPm=c._locale.isPM(a),c._meridiem=a}),ba(["h","hh"],function(a,b,c){b[he]=u(a),n(c).bigHour=!0}),ba("hmm",function(a,b,c){var d=a.length-2;b[he]=u(a.substr(0,d)),b[ie]=u(a.substr(d)),n(c).bigHour=!0}),ba("hmmss",function(a,b,c){var d=a.length-4,e=a.length-2;b[he]=u(a.substr(0,d)),b[ie]=u(a.substr(d,2)),b[je]=u(a.substr(e)),n(c).bigHour=!0}),ba("Hmm",function(a,b,c){var d=a.length-2;b[he]=u(a.substr(0,d)),b[ie]=u(a.substr(d))}),ba("Hmmss",function(a,b,c){var d=a.length-4,e=a.length-2;b[he]=u(a.substr(0,d)),b[ie]=u(a.substr(d,2)),b[je]=u(a.substr(e))});var Be,Ce=/[ap]\.?m?\.?/i,De=O("Hours",!0),Ee={calendar:Bd,longDateFormat:Cd,invalidDate:Dd,ordinal:Ed,dayOfMonthOrdinalParse:Fd,relativeTime:Gd,months:pe,monthsShort:qe,week:ue,weekdays:ve,weekdaysMin:xe,weekdaysShort:we,meridiemParse:Ce},Fe={},Ge={},He=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Ie=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Je=/Z|[+-]\d\d(?::?\d\d)?/,Ke=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],Le=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],Me=/^\/?Date\((\-?\d+)/i,Ne=/^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;a.createFromInputFallback=x("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),a.ISO_8601=function(){},a.RFC_2822=function(){};var Oe=x("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var a=tb.apply(null,arguments);return this.isValid()&&a.isValid()?a<this?this:a:p()}),Pe=x("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var a=tb.apply(null,arguments);return this.isValid()&&a.isValid()?a>this?this:a:p()}),Qe=function(){return Date.now?Date.now():+new Date},Re=["year","quarter","month","week","day","hour","minute","second","millisecond"];Db("Z",":"),Db("ZZ",""),Z("Z",_d),Z("ZZ",_d),ba(["Z","ZZ"],function(a,b,c){c._useUTC=!0,c._tzm=Eb(_d,a)});var Se=/([\+\-]|\d\d)/gi;a.updateOffset=function(){};var Te=/^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,Ue=/^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;Sb.fn=Ab.prototype,Sb.invalid=zb;var Ve=Wb(1,"add"),We=Wb(-1,"subtract");a.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",a.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var Xe=x("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(a){return void 0===a?this.localeData():this.locale(a)});U(0,["gg",2],0,function(){return this.weekYear()%100}),U(0,["GG",2],0,function(){return this.isoWeekYear()%100}),Dc("gggg","weekYear"),Dc("ggggg","weekYear"),Dc("GGGG","isoWeekYear"),Dc("GGGGG","isoWeekYear"),J("weekYear","gg"),J("isoWeekYear","GG"),M("weekYear",1),M("isoWeekYear",1),Z("G",Zd),Z("g",Zd),Z("GG",Sd,Od),Z("gg",Sd,Od),Z("GGGG",Wd,Qd),Z("gggg",Wd,Qd),Z("GGGGG",Xd,Rd),Z("ggggg",Xd,Rd),ca(["gggg","ggggg","GGGG","GGGGG"],function(a,b,c,d){b[d.substr(0,2)]=u(a)}),ca(["gg","GG"],function(b,c,d,e){c[e]=a.parseTwoDigitYear(b)}),U("Q",0,"Qo","quarter"),J("quarter","Q"),M("quarter",7),Z("Q",Nd),ba("Q",function(a,b){b[fe]=3*(u(a)-1)}),U("D",["DD",2],"Do","date"),J("date","D"),M("date",9),Z("D",Sd),Z("DD",Sd,Od),Z("Do",function(a,b){return a?b._dayOfMonthOrdinalParse||b._ordinalParse:b._dayOfMonthOrdinalParseLenient}),ba(["D","DD"],ge),ba("Do",function(a,b){b[ge]=u(a.match(Sd)[0],10)});var Ye=O("Date",!0);U("DDD",["DDDD",3],"DDDo","dayOfYear"),J("dayOfYear","DDD"),M("dayOfYear",4),Z("DDD",Vd),Z("DDDD",Pd),ba(["DDD","DDDD"],function(a,b,c){c._dayOfYear=u(a)}),U("m",["mm",2],0,"minute"),J("minute","m"),M("minute",14),Z("m",Sd),Z("mm",Sd,Od),ba(["m","mm"],ie);var Ze=O("Minutes",!1);U("s",["ss",2],0,"second"),J("second","s"),M("second",15),Z("s",Sd),Z("ss",Sd,Od),ba(["s","ss"],je);var $e=O("Seconds",!1);U("S",0,0,function(){return~~(this.millisecond()/100)}),U(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),U(0,["SSS",3],0,"millisecond"),U(0,["SSSS",4],0,function(){return 10*this.millisecond()}),U(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),U(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),U(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),U(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),U(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),J("millisecond","ms"),M("millisecond",16),Z("S",Vd,Nd),Z("SS",Vd,Od),Z("SSS",Vd,Pd);var _e;for(_e="SSSS";_e.length<=9;_e+="S")Z(_e,Yd);for(_e="S";_e.length<=9;_e+="S")ba(_e,Mc);var af=O("Milliseconds",!1);U("z",0,0,"zoneAbbr"),U("zz",0,0,"zoneName");var bf=r.prototype;bf.add=Ve,bf.calendar=Zb,bf.clone=$b,bf.diff=fc,bf.endOf=sc,bf.format=kc,bf.from=lc,bf.fromNow=mc,bf.to=nc,bf.toNow=oc,bf.get=R,bf.invalidAt=Bc,bf.isAfter=_b,bf.isBefore=ac,bf.isBetween=bc,bf.isSame=cc,bf.isSameOrAfter=dc,bf.isSameOrBefore=ec,bf.isValid=zc,bf.lang=Xe,bf.locale=pc,bf.localeData=qc,bf.max=Pe,bf.min=Oe,bf.parsingFlags=Ac,bf.set=S,bf.startOf=rc,bf.subtract=We,bf.toArray=wc,bf.toObject=xc,bf.toDate=vc,bf.toISOString=ic,bf.inspect=jc,bf.toJSON=yc,bf.toString=hc,bf.unix=uc,bf.valueOf=tc,bf.creationData=Cc,bf.year=te,bf.isLeapYear=ra,bf.weekYear=Ec,bf.isoWeekYear=Fc,bf.quarter=bf.quarters=Kc,bf.month=ka,bf.daysInMonth=la,bf.week=bf.weeks=Ba,bf.isoWeek=bf.isoWeeks=Ca,bf.weeksInYear=Hc,bf.isoWeeksInYear=Gc,bf.date=Ye,bf.day=bf.days=Ka,bf.weekday=La,bf.isoWeekday=Ma,bf.dayOfYear=Lc,bf.hour=bf.hours=De,bf.minute=bf.minutes=Ze,bf.second=bf.seconds=$e,bf.millisecond=bf.milliseconds=af,bf.utcOffset=Hb,bf.utc=Jb,bf.local=Kb,bf.parseZone=Lb,bf.hasAlignedHourOffset=Mb,bf.isDST=Nb,bf.isLocal=Pb,bf.isUtcOffset=Qb,bf.isUtc=Rb,bf.isUTC=Rb,bf.zoneAbbr=Nc,bf.zoneName=Oc,bf.dates=x("dates accessor is deprecated. Use date instead.",Ye),bf.months=x("months accessor is deprecated. Use month instead",ka),bf.years=x("years accessor is deprecated. Use year instead",te),bf.zone=x("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",Ib),bf.isDSTShifted=x("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",Ob);var cf=C.prototype;cf.calendar=D,cf.longDateFormat=E,cf.invalidDate=F,cf.ordinal=G,cf.preparse=Rc,cf.postformat=Rc,cf.relativeTime=H,cf.pastFuture=I,cf.set=A,cf.months=fa,cf.monthsShort=ga,cf.monthsParse=ia,cf.monthsRegex=na,cf.monthsShortRegex=ma,cf.week=ya,cf.firstDayOfYear=Aa,cf.firstDayOfWeek=za,cf.weekdays=Fa,cf.weekdaysMin=Ha,cf.weekdaysShort=Ga,cf.weekdaysParse=Ja,cf.weekdaysRegex=Na,cf.weekdaysShortRegex=Oa,cf.weekdaysMinRegex=Pa,cf.isPM=Va,cf.meridiem=Wa,$a("en",{dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===u(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),a.lang=x("moment.lang is deprecated. Use moment.locale instead.",$a),a.langData=x("moment.langData is deprecated. Use moment.localeData instead.",bb);var df=Math.abs,ef=id("ms"),ff=id("s"),gf=id("m"),hf=id("h"),jf=id("d"),kf=id("w"),lf=id("M"),mf=id("y"),nf=kd("milliseconds"),of=kd("seconds"),pf=kd("minutes"),qf=kd("hours"),rf=kd("days"),sf=kd("months"),tf=kd("years"),uf=Math.round,vf={ss:44,s:45,m:45,h:22,d:26,M:11},wf=Math.abs,xf=Ab.prototype;return xf.isValid=yb,xf.abs=$c,xf.add=ad,xf.subtract=bd,xf.as=gd,xf.asMilliseconds=ef,xf.asSeconds=ff,xf.asMinutes=gf,xf.asHours=hf,xf.asDays=jf,xf.asWeeks=kf,xf.asMonths=lf,xf.asYears=mf,xf.valueOf=hd,xf._bubble=dd,xf.get=jd,xf.milliseconds=nf,xf.seconds=of,xf.minutes=pf,xf.hours=qf,xf.days=rf,xf.weeks=ld,xf.months=sf,xf.years=tf,xf.humanize=qd,xf.toISOString=rd,xf.toString=rd,xf.toJSON=rd,xf.locale=pc,xf.localeData=qc,xf.toIsoString=x("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",rd),xf.lang=Xe,U("X",0,0,"unix"),U("x",0,0,"valueOf"),Z("x",Zd),Z("X",ae),ba("X",function(a,b,c){c._d=new Date(1e3*parseFloat(a,10))}),ba("x",function(a,b,c){c._d=new Date(u(a))}),a.version="2.18.1",b(tb),a.fn=bf,a.min=vb,a.max=wb,a.now=Qe,a.utc=l,a.unix=Pc,a.months=Vc,a.isDate=h,a.locale=$a,a.invalid=p,a.duration=Sb,a.isMoment=s,a.weekdays=Xc,a.parseZone=Qc,a.localeData=bb,a.isDuration=Bb,a.monthsShort=Wc,a.weekdaysMin=Zc,a.defineLocale=_a,a.updateLocale=ab,a.locales=cb,a.weekdaysShort=Yc,a.normalizeUnits=K,a.relativeTimeRounding=od,a.relativeTimeThreshold=pd,a.calendarFormat=Yb,a.prototype=bf,a});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)(module)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(0),
    __webpack_require__(9),
    __webpack_require__(10)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
    $,
    _,
    Toast
){
    // var BaseUrl = 'http://fnji.test.com';
    var BaseUrl = 'http://oa.fnji.com/Manage';
    var ErrorEnum = {
        DataError: {
            code: 'DATA_ERROR',
            data: '数据异常'
        },
        NetworkError: {
            code: 'NETWORK_ERROR',
            data: '网络异常'
        },
        ParamError: {
            code: 'PARAM_ERROR',
            data: '参数错误'
        }
    };
    function Api(path, defaultOptions){
        this.url = BaseUrl + path;
        this.defaultOptions = defaultOptions || {};
    }
    Api.prototype.ajaxPromise = function(params, options){
        console.log(this.defaultOptions)
        var dfd = $.Deferred();
        var opts = {
            url: this.url,
            dataType: 'json'
        };
        if (params) opts.data = params;
        opts = _.assign(opts, this.defaultOptions, options);

        $.ajax(opts)
            .done(function(result){
                if (!result){
                    dfd.reject(ErrorEnum.DataError);
                } else if (result.error === 0) {
                    dfd.resolve(result.result);
                } else {
                    dfd.reject(result);
                }
            })
            .fail(function(){
                dfd.reject(ErrorEnum.NetworkError);
            });

        return dfd.promise();
    };
    Api.prototype.ajax = function(params, options){
        Toast.showLoadingToast();
        return this.ajaxPromise(params, options)
            .fail(function(error){
                console.log(error);
                alert(error.data);
            })
            .always(function(){
                Toast.hideLoadingToast();
            });
    };

    return {
        Api: Api,
        // getMemberInfoApi: new Api('/s/member/getMemberInfo'),
        // loginApi: new Api('/s/member/login', {type: 'POST'}),
        // getWxLoginInfoApi: new Api('/s/member/getWxLoginInfo'),
        // logoutApi: new Api('/s/member/logOut'),
        // sendVerifyCodeApi: new Api('/s/member/sendVerifyCode'),
        // registerApi: new Api('/s/member/reg', {type: 'POST'}),
        // resetPassApi: new Api('/s/member/forgot',{type: 'POST'}),
        //
        // addAddressApi: new Api('/s/member-address/add', {type: 'POST'}),
        // modAddressApi: new Api('/s/member-address/mod', {type: 'POST'}),
        // getProvinceApi: new Api('/s/common/getProvince'),
        // getCityApi: new Api('/s/common/getCity')

        getTeamworkList: new Api('/Teamwork/teamwork', {type: 'POST'}),//获取团队协作列表
        addTeamworkList: new Api('/Teamwork/add', {type: 'POST'}),//添加团队协作
        getOperatorList: new Api('/Teamwork/operatorName', {type: 'POST'}),//获取操作人员列表
        getTeamworkInfo: new Api('/Teamwork/check', {type: 'GET'}),//获取一条数据
        updateTeamworkInfo: new Api('/Teamwork/update', {type: 'POST'}),//修改一条数据
        deleteTeamworkInfo: new Api('/Teamwork/delete', {type: 'GET'}),//删除数据
        getTeamworkStatus: new Api('/Teamwork/status'),//获取状态列表
        getFileUpload: new Api('/Teamwork/upload', {type: 'POST', processData: false,
            contentType: false} ),//获取上传文件路径
        getDownload: new Api('/Teamwork/download', {type: 'POST'}),//获取下载接口
        updateThose: new Api('/Teamwork/updateStatus', {type: 'POST'}),//批量修改状态
        closeThose: new Api('/Teamwork/close', {type: 'POST'}),//批量关闭
        cancelClosedThose: new Api('/Teamwork/cancelClosed', {type: 'POST'}),//批量取消关闭
        getClosedList: new Api('/Teamwork/alreadyClosed', {type: 'POST'}),//获取关闭列表
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chinese (China) [zh-cn]
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng

;(function (global, factory) {
    true ? factory(__webpack_require__(2)) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var zhCn = moment.defineLocale('zh-cn', {
    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY年MMMD日',
        LL : 'YYYY年MMMD日',
        LLL : 'YYYY年MMMD日Ah点mm分',
        LLLL : 'YYYY年MMMD日ddddAh点mm分',
        l : 'YYYY年MMMD日',
        ll : 'YYYY年MMMD日',
        lll : 'YYYY年MMMD日 HH:mm',
        llll : 'YYYY年MMMD日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' ||
                meridiem === '上午') {
            return hour;
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        } else {
            // '中午'
            return hour >= 11 ? hour : hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        var hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        } else if (hm < 900) {
            return '早上';
        } else if (hm < 1130) {
            return '上午';
        } else if (hm < 1230) {
            return '中午';
        } else if (hm < 1800) {
            return '下午';
        } else {
            return '晚上';
        }
    },
    calendar : {
        sameDay : '[今天]LT',
        nextDay : '[明天]LT',
        nextWeek : '[下]ddddLT',
        lastDay : '[昨天]LT',
        lastWeek : '[上]ddddLT',
        sameElse : 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            case 'M':
                return number + '月';
            case 'w':
            case 'W':
                return number + '周';
            default:
                return number;
        }
    },
    relativeTime : {
        future : '%s内',
        past : '%s前',
        s : '几秒',
        m : '1 分钟',
        mm : '%d 分钟',
        h : '1 小时',
        hh : '%d 小时',
        d : '1 天',
        dd : '%d 天',
        M : '1 个月',
        MM : '%d 个月',
        y : '1 年',
        yy : '%d 年'
    },
    week : {
        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return zhCn;

})));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(a){"use strict";if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0),__webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("object"==typeof exports)module.exports=a(require("jquery"),require("moment"));else{if("undefined"==typeof jQuery)throw"bootstrap-datetimepicker requires jQuery to be loaded first";if("undefined"==typeof moment)throw"bootstrap-datetimepicker requires Moment.js to be loaded first";a(jQuery,moment)}}(function(a,b){"use strict";if(!b)throw new Error("bootstrap-datetimepicker requires Moment.js to be loaded first");var c=function(c,d){var e,f,g,h,i,j,k,l={},m=!0,n=!1,o=!1,p=0,q=[{clsName:"days",navFnc:"M",navStep:1},{clsName:"months",navFnc:"y",navStep:1},{clsName:"years",navFnc:"y",navStep:10},{clsName:"decades",navFnc:"y",navStep:100}],r=["days","months","years","decades"],s=["top","bottom","auto"],t=["left","right","auto"],u=["default","top","bottom"],v={up:38,38:"up",down:40,40:"down",left:37,37:"left",right:39,39:"right",tab:9,9:"tab",escape:27,27:"escape",enter:13,13:"enter",pageUp:33,33:"pageUp",pageDown:34,34:"pageDown",shift:16,16:"shift",control:17,17:"control",space:32,32:"space",t:84,84:"t",delete:46,46:"delete"},w={},x=function(){return void 0!==b.tz&&void 0!==d.timeZone&&null!==d.timeZone&&""!==d.timeZone},y=function(a){var c;return c=void 0===a||null===a?b():b.isDate(a)||b.isMoment(a)?b(a):x()?b.tz(a,j,d.useStrict,d.timeZone):b(a,j,d.useStrict),x()&&c.tz(d.timeZone),c},z=function(a){if("string"!=typeof a||a.length>1)throw new TypeError("isEnabled expects a single character string parameter");switch(a){case"y":return i.indexOf("Y")!==-1;case"M":return i.indexOf("M")!==-1;case"d":return i.toLowerCase().indexOf("d")!==-1;case"h":case"H":return i.toLowerCase().indexOf("h")!==-1;case"m":return i.indexOf("m")!==-1;case"s":return i.indexOf("s")!==-1;default:return!1}},A=function(){return z("h")||z("m")||z("s")},B=function(){return z("y")||z("M")||z("d")},C=function(){var b=a("<thead>").append(a("<tr>").append(a("<th>").addClass("prev").attr("data-action","previous").append(a("<span>").addClass(d.icons.previous))).append(a("<th>").addClass("picker-switch").attr("data-action","pickerSwitch").attr("colspan",d.calendarWeeks?"6":"5")).append(a("<th>").addClass("next").attr("data-action","next").append(a("<span>").addClass(d.icons.next)))),c=a("<tbody>").append(a("<tr>").append(a("<td>").attr("colspan",d.calendarWeeks?"8":"7")));return[a("<div>").addClass("datepicker-days").append(a("<table>").addClass("table-condensed").append(b).append(a("<tbody>"))),a("<div>").addClass("datepicker-months").append(a("<table>").addClass("table-condensed").append(b.clone()).append(c.clone())),a("<div>").addClass("datepicker-years").append(a("<table>").addClass("table-condensed").append(b.clone()).append(c.clone())),a("<div>").addClass("datepicker-decades").append(a("<table>").addClass("table-condensed").append(b.clone()).append(c.clone()))]},D=function(){var b=a("<tr>"),c=a("<tr>"),e=a("<tr>");return z("h")&&(b.append(a("<td>").append(a("<a>").attr({href:"#",tabindex:"-1",title:d.tooltips.incrementHour}).addClass("btn").attr("data-action","incrementHours").append(a("<span>").addClass(d.icons.up)))),c.append(a("<td>").append(a("<span>").addClass("timepicker-hour").attr({"data-time-component":"hours",title:d.tooltips.pickHour}).attr("data-action","showHours"))),e.append(a("<td>").append(a("<a>").attr({href:"#",tabindex:"-1",title:d.tooltips.decrementHour}).addClass("btn").attr("data-action","decrementHours").append(a("<span>").addClass(d.icons.down))))),z("m")&&(z("h")&&(b.append(a("<td>").addClass("separator")),c.append(a("<td>").addClass("separator").html(":")),e.append(a("<td>").addClass("separator"))),b.append(a("<td>").append(a("<a>").attr({href:"#",tabindex:"-1",title:d.tooltips.incrementMinute}).addClass("btn").attr("data-action","incrementMinutes").append(a("<span>").addClass(d.icons.up)))),c.append(a("<td>").append(a("<span>").addClass("timepicker-minute").attr({"data-time-component":"minutes",title:d.tooltips.pickMinute}).attr("data-action","showMinutes"))),e.append(a("<td>").append(a("<a>").attr({href:"#",tabindex:"-1",title:d.tooltips.decrementMinute}).addClass("btn").attr("data-action","decrementMinutes").append(a("<span>").addClass(d.icons.down))))),z("s")&&(z("m")&&(b.append(a("<td>").addClass("separator")),c.append(a("<td>").addClass("separator").html(":")),e.append(a("<td>").addClass("separator"))),b.append(a("<td>").append(a("<a>").attr({href:"#",tabindex:"-1",title:d.tooltips.incrementSecond}).addClass("btn").attr("data-action","incrementSeconds").append(a("<span>").addClass(d.icons.up)))),c.append(a("<td>").append(a("<span>").addClass("timepicker-second").attr({"data-time-component":"seconds",title:d.tooltips.pickSecond}).attr("data-action","showSeconds"))),e.append(a("<td>").append(a("<a>").attr({href:"#",tabindex:"-1",title:d.tooltips.decrementSecond}).addClass("btn").attr("data-action","decrementSeconds").append(a("<span>").addClass(d.icons.down))))),h||(b.append(a("<td>").addClass("separator")),c.append(a("<td>").append(a("<button>").addClass("btn btn-primary").attr({"data-action":"togglePeriod",tabindex:"-1",title:d.tooltips.togglePeriod}))),e.append(a("<td>").addClass("separator"))),a("<div>").addClass("timepicker-picker").append(a("<table>").addClass("table-condensed").append([b,c,e]))},E=function(){var b=a("<div>").addClass("timepicker-hours").append(a("<table>").addClass("table-condensed")),c=a("<div>").addClass("timepicker-minutes").append(a("<table>").addClass("table-condensed")),d=a("<div>").addClass("timepicker-seconds").append(a("<table>").addClass("table-condensed")),e=[D()];return z("h")&&e.push(b),z("m")&&e.push(c),z("s")&&e.push(d),e},F=function(){var b=[];return d.showTodayButton&&b.push(a("<td>").append(a("<a>").attr({"data-action":"today",title:d.tooltips.today}).append(a("<span>").addClass(d.icons.today)))),!d.sideBySide&&B()&&A()&&b.push(a("<td>").append(a("<a>").attr({"data-action":"togglePicker",title:d.tooltips.selectTime}).append(a("<span>").addClass(d.icons.time)))),d.showClear&&b.push(a("<td>").append(a("<a>").attr({"data-action":"clear",title:d.tooltips.clear}).append(a("<span>").addClass(d.icons.clear)))),d.showClose&&b.push(a("<td>").append(a("<a>").attr({"data-action":"close",title:d.tooltips.close}).append(a("<span>").addClass(d.icons.close)))),a("<table>").addClass("table-condensed").append(a("<tbody>").append(a("<tr>").append(b)))},G=function(){var b=a("<div>").addClass("bootstrap-datetimepicker-widget dropdown-menu"),c=a("<div>").addClass("datepicker").append(C()),e=a("<div>").addClass("timepicker").append(E()),f=a("<ul>").addClass("list-unstyled"),g=a("<li>").addClass("picker-switch"+(d.collapse?" accordion-toggle":"")).append(F());return d.inline&&b.removeClass("dropdown-menu"),h&&b.addClass("usetwentyfour"),z("s")&&!h&&b.addClass("wider"),d.sideBySide&&B()&&A()?(b.addClass("timepicker-sbs"),"top"===d.toolbarPlacement&&b.append(g),b.append(a("<div>").addClass("row").append(c.addClass("col-md-6")).append(e.addClass("col-md-6"))),"bottom"===d.toolbarPlacement&&b.append(g),b):("top"===d.toolbarPlacement&&f.append(g),B()&&f.append(a("<li>").addClass(d.collapse&&A()?"collapse in":"").append(c)),"default"===d.toolbarPlacement&&f.append(g),A()&&f.append(a("<li>").addClass(d.collapse&&B()?"collapse":"").append(e)),"bottom"===d.toolbarPlacement&&f.append(g),b.append(f))},H=function(){var b,e={};return b=c.is("input")||d.inline?c.data():c.find("input").data(),b.dateOptions&&b.dateOptions instanceof Object&&(e=a.extend(!0,e,b.dateOptions)),a.each(d,function(a){var c="date"+a.charAt(0).toUpperCase()+a.slice(1);void 0!==b[c]&&(e[a]=b[c])}),e},I=function(){var b,e=(n||c).position(),f=(n||c).offset(),g=d.widgetPositioning.vertical,h=d.widgetPositioning.horizontal;if(d.widgetParent)b=d.widgetParent.append(o);else if(c.is("input"))b=c.after(o).parent();else{if(d.inline)return void(b=c.append(o));b=c,c.children().first().after(o)}if("auto"===g&&(g=f.top+1.5*o.height()>=a(window).height()+a(window).scrollTop()&&o.height()+c.outerHeight()<f.top?"top":"bottom"),"auto"===h&&(h=b.width()<f.left+o.outerWidth()/2&&f.left+o.outerWidth()>a(window).width()?"right":"left"),"top"===g?o.addClass("top").removeClass("bottom"):o.addClass("bottom").removeClass("top"),"right"===h?o.addClass("pull-right"):o.removeClass("pull-right"),"static"===b.css("position")&&(b=b.parents().filter(function(){return"static"!==a(this).css("position")}).first()),0===b.length)throw new Error("datetimepicker component should be placed within a non-static positioned container");o.css({top:"top"===g?"auto":e.top+c.outerHeight(),bottom:"top"===g?b.outerHeight()-(b===c?0:e.top):"auto",left:"left"===h?b===c?0:e.left:"auto",right:"left"===h?"auto":b.outerWidth()-c.outerWidth()-(b===c?0:e.left)})},J=function(a){"dp.change"===a.type&&(a.date&&a.date.isSame(a.oldDate)||!a.date&&!a.oldDate)||c.trigger(a)},K=function(a){"y"===a&&(a="YYYY"),J({type:"dp.update",change:a,viewDate:f.clone()})},L=function(a){o&&(a&&(k=Math.max(p,Math.min(3,k+a))),o.find(".datepicker > div").hide().filter(".datepicker-"+q[k].clsName).show())},M=function(){var b=a("<tr>"),c=f.clone().startOf("w").startOf("d");for(d.calendarWeeks===!0&&b.append(a("<th>").addClass("cw").text("#"));c.isBefore(f.clone().endOf("w"));)b.append(a("<th>").addClass("dow").text(c.format("dd"))),c.add(1,"d");o.find(".datepicker-days thead").append(b)},N=function(a){return d.disabledDates[a.format("YYYY-MM-DD")]===!0},O=function(a){return d.enabledDates[a.format("YYYY-MM-DD")]===!0},P=function(a){return d.disabledHours[a.format("H")]===!0},Q=function(a){return d.enabledHours[a.format("H")]===!0},R=function(b,c){if(!b.isValid())return!1;if(d.disabledDates&&"d"===c&&N(b))return!1;if(d.enabledDates&&"d"===c&&!O(b))return!1;if(d.minDate&&b.isBefore(d.minDate,c))return!1;if(d.maxDate&&b.isAfter(d.maxDate,c))return!1;if(d.daysOfWeekDisabled&&"d"===c&&d.daysOfWeekDisabled.indexOf(b.day())!==-1)return!1;if(d.disabledHours&&("h"===c||"m"===c||"s"===c)&&P(b))return!1;if(d.enabledHours&&("h"===c||"m"===c||"s"===c)&&!Q(b))return!1;if(d.disabledTimeIntervals&&("h"===c||"m"===c||"s"===c)){var e=!1;if(a.each(d.disabledTimeIntervals,function(){if(b.isBetween(this[0],this[1]))return e=!0,!1}),e)return!1}return!0},S=function(){for(var b=[],c=f.clone().startOf("y").startOf("d");c.isSame(f,"y");)b.push(a("<span>").attr("data-action","selectMonth").addClass("month").text(c.format("MMM"))),c.add(1,"M");o.find(".datepicker-months td").empty().append(b)},T=function(){var b=o.find(".datepicker-months"),c=b.find("th"),g=b.find("tbody").find("span");c.eq(0).find("span").attr("title",d.tooltips.prevYear),c.eq(1).attr("title",d.tooltips.selectYear),c.eq(2).find("span").attr("title",d.tooltips.nextYear),b.find(".disabled").removeClass("disabled"),R(f.clone().subtract(1,"y"),"y")||c.eq(0).addClass("disabled"),c.eq(1).text(f.year()),R(f.clone().add(1,"y"),"y")||c.eq(2).addClass("disabled"),g.removeClass("active"),e.isSame(f,"y")&&!m&&g.eq(e.month()).addClass("active"),g.each(function(b){R(f.clone().month(b),"M")||a(this).addClass("disabled")})},U=function(){var a=o.find(".datepicker-years"),b=a.find("th"),c=f.clone().subtract(5,"y"),g=f.clone().add(6,"y"),h="";for(b.eq(0).find("span").attr("title",d.tooltips.prevDecade),b.eq(1).attr("title",d.tooltips.selectDecade),b.eq(2).find("span").attr("title",d.tooltips.nextDecade),a.find(".disabled").removeClass("disabled"),d.minDate&&d.minDate.isAfter(c,"y")&&b.eq(0).addClass("disabled"),b.eq(1).text(c.year()+"-"+g.year()),d.maxDate&&d.maxDate.isBefore(g,"y")&&b.eq(2).addClass("disabled");!c.isAfter(g,"y");)h+='<span data-action="selectYear" class="year'+(c.isSame(e,"y")&&!m?" active":"")+(R(c,"y")?"":" disabled")+'">'+c.year()+"</span>",c.add(1,"y");a.find("td").html(h)},V=function(){var a,c=o.find(".datepicker-decades"),g=c.find("th"),h=b({y:f.year()-f.year()%100-1}),i=h.clone().add(100,"y"),j=h.clone(),k=!1,l=!1,m="";for(g.eq(0).find("span").attr("title",d.tooltips.prevCentury),g.eq(2).find("span").attr("title",d.tooltips.nextCentury),c.find(".disabled").removeClass("disabled"),(h.isSame(b({y:1900}))||d.minDate&&d.minDate.isAfter(h,"y"))&&g.eq(0).addClass("disabled"),g.eq(1).text(h.year()+"-"+i.year()),(h.isSame(b({y:2e3}))||d.maxDate&&d.maxDate.isBefore(i,"y"))&&g.eq(2).addClass("disabled");!h.isAfter(i,"y");)a=h.year()+12,k=d.minDate&&d.minDate.isAfter(h,"y")&&d.minDate.year()<=a,l=d.maxDate&&d.maxDate.isAfter(h,"y")&&d.maxDate.year()<=a,m+='<span data-action="selectDecade" class="decade'+(e.isAfter(h)&&e.year()<=a?" active":"")+(R(h,"y")||k||l?"":" disabled")+'" data-selection="'+(h.year()+6)+'">'+(h.year()+1)+" - "+(h.year()+12)+"</span>",h.add(12,"y");m+="<span></span><span></span><span></span>",c.find("td").html(m),g.eq(1).text(j.year()+1+"-"+h.year())},W=function(){var b,c,g,h=o.find(".datepicker-days"),i=h.find("th"),j=[],k=[];if(B()){for(i.eq(0).find("span").attr("title",d.tooltips.prevMonth),i.eq(1).attr("title",d.tooltips.selectMonth),i.eq(2).find("span").attr("title",d.tooltips.nextMonth),h.find(".disabled").removeClass("disabled"),i.eq(1).text(f.format(d.dayViewHeaderFormat)),R(f.clone().subtract(1,"M"),"M")||i.eq(0).addClass("disabled"),R(f.clone().add(1,"M"),"M")||i.eq(2).addClass("disabled"),b=f.clone().startOf("M").startOf("w").startOf("d"),g=0;g<42;g++)0===b.weekday()&&(c=a("<tr>"),d.calendarWeeks&&c.append('<td class="cw">'+b.week()+"</td>"),j.push(c)),k=["day"],b.isBefore(f,"M")&&k.push("old"),b.isAfter(f,"M")&&k.push("new"),b.isSame(e,"d")&&!m&&k.push("active"),R(b,"d")||k.push("disabled"),b.isSame(y(),"d")&&k.push("today"),0!==b.day()&&6!==b.day()||k.push("weekend"),J({type:"dp.classify",date:b,classNames:k}),c.append('<td data-action="selectDay" data-day="'+b.format("L")+'" class="'+k.join(" ")+'">'+b.date()+"</td>"),b.add(1,"d");h.find("tbody").empty().append(j),T(),U(),V()}},X=function(){var b=o.find(".timepicker-hours table"),c=f.clone().startOf("d"),d=[],e=a("<tr>");for(f.hour()>11&&!h&&c.hour(12);c.isSame(f,"d")&&(h||f.hour()<12&&c.hour()<12||f.hour()>11);)c.hour()%4===0&&(e=a("<tr>"),d.push(e)),e.append('<td data-action="selectHour" class="hour'+(R(c,"h")?"":" disabled")+'">'+c.format(h?"HH":"hh")+"</td>"),c.add(1,"h");b.empty().append(d)},Y=function(){for(var b=o.find(".timepicker-minutes table"),c=f.clone().startOf("h"),e=[],g=a("<tr>"),h=1===d.stepping?5:d.stepping;f.isSame(c,"h");)c.minute()%(4*h)===0&&(g=a("<tr>"),e.push(g)),g.append('<td data-action="selectMinute" class="minute'+(R(c,"m")?"":" disabled")+'">'+c.format("mm")+"</td>"),c.add(h,"m");b.empty().append(e)},Z=function(){for(var b=o.find(".timepicker-seconds table"),c=f.clone().startOf("m"),d=[],e=a("<tr>");f.isSame(c,"m");)c.second()%20===0&&(e=a("<tr>"),d.push(e)),e.append('<td data-action="selectSecond" class="second'+(R(c,"s")?"":" disabled")+'">'+c.format("ss")+"</td>"),c.add(5,"s");b.empty().append(d)},$=function(){var a,b,c=o.find(".timepicker span[data-time-component]");h||(a=o.find(".timepicker [data-action=togglePeriod]"),b=e.clone().add(e.hours()>=12?-12:12,"h"),a.text(e.format("A")),R(b,"h")?a.removeClass("disabled"):a.addClass("disabled")),c.filter("[data-time-component=hours]").text(e.format(h?"HH":"hh")),c.filter("[data-time-component=minutes]").text(e.format("mm")),c.filter("[data-time-component=seconds]").text(e.format("ss")),X(),Y(),Z()},_=function(){o&&(W(),$())},aa=function(a){var b=m?null:e;if(!a)return m=!0,g.val(""),c.data("date",""),J({type:"dp.change",date:!1,oldDate:b}),void _();if(a=a.clone().locale(d.locale),x()&&a.tz(d.timeZone),1!==d.stepping)for(a.minutes(Math.round(a.minutes()/d.stepping)*d.stepping).seconds(0);d.minDate&&a.isBefore(d.minDate);)a.add(d.stepping,"minutes");R(a)?(e=a,f=e.clone(),g.val(e.format(i)),c.data("date",e.format(i)),m=!1,_(),J({type:"dp.change",date:e.clone(),oldDate:b})):(d.keepInvalid?J({type:"dp.change",date:a,oldDate:b}):g.val(m?"":e.format(i)),J({type:"dp.error",date:a,oldDate:b}))},ba=function(){var b=!1;return o?(o.find(".collapse").each(function(){var c=a(this).data("collapse");return!c||!c.transitioning||(b=!0,!1)}),b?l:(n&&n.hasClass("btn")&&n.toggleClass("active"),o.hide(),a(window).off("resize",I),o.off("click","[data-action]"),o.off("mousedown",!1),o.remove(),o=!1,J({type:"dp.hide",date:e.clone()}),g.blur(),f=e.clone(),l)):l},ca=function(){aa(null)},da=function(a){return void 0===d.parseInputDate?(!b.isMoment(a)||a instanceof Date)&&(a=y(a)):a=d.parseInputDate(a),a},ea={next:function(){var a=q[k].navFnc;f.add(q[k].navStep,a),W(),K(a)},previous:function(){var a=q[k].navFnc;f.subtract(q[k].navStep,a),W(),K(a)},pickerSwitch:function(){L(1)},selectMonth:function(b){var c=a(b.target).closest("tbody").find("span").index(a(b.target));f.month(c),k===p?(aa(e.clone().year(f.year()).month(f.month())),d.inline||ba()):(L(-1),W()),K("M")},selectYear:function(b){var c=parseInt(a(b.target).text(),10)||0;f.year(c),k===p?(aa(e.clone().year(f.year())),d.inline||ba()):(L(-1),W()),K("YYYY")},selectDecade:function(b){var c=parseInt(a(b.target).data("selection"),10)||0;f.year(c),k===p?(aa(e.clone().year(f.year())),d.inline||ba()):(L(-1),W()),K("YYYY")},selectDay:function(b){var c=f.clone();a(b.target).is(".old")&&c.subtract(1,"M"),a(b.target).is(".new")&&c.add(1,"M"),aa(c.date(parseInt(a(b.target).text(),10))),A()||d.keepOpen||d.inline||ba()},incrementHours:function(){var a=e.clone().add(1,"h");R(a,"h")&&aa(a)},incrementMinutes:function(){var a=e.clone().add(d.stepping,"m");R(a,"m")&&aa(a)},incrementSeconds:function(){var a=e.clone().add(1,"s");R(a,"s")&&aa(a)},decrementHours:function(){var a=e.clone().subtract(1,"h");R(a,"h")&&aa(a)},decrementMinutes:function(){var a=e.clone().subtract(d.stepping,"m");R(a,"m")&&aa(a)},decrementSeconds:function(){var a=e.clone().subtract(1,"s");R(a,"s")&&aa(a)},togglePeriod:function(){aa(e.clone().add(e.hours()>=12?-12:12,"h"))},togglePicker:function(b){var c,e=a(b.target),f=e.closest("ul"),g=f.find(".in"),h=f.find(".collapse:not(.in)");if(g&&g.length){if(c=g.data("collapse"),c&&c.transitioning)return;g.collapse?(g.collapse("hide"),h.collapse("show")):(g.removeClass("in"),h.addClass("in")),e.is("span")?e.toggleClass(d.icons.time+" "+d.icons.date):e.find("span").toggleClass(d.icons.time+" "+d.icons.date)}},showPicker:function(){o.find(".timepicker > div:not(.timepicker-picker)").hide(),o.find(".timepicker .timepicker-picker").show()},showHours:function(){o.find(".timepicker .timepicker-picker").hide(),o.find(".timepicker .timepicker-hours").show()},showMinutes:function(){o.find(".timepicker .timepicker-picker").hide(),o.find(".timepicker .timepicker-minutes").show()},showSeconds:function(){o.find(".timepicker .timepicker-picker").hide(),o.find(".timepicker .timepicker-seconds").show()},selectHour:function(b){var c=parseInt(a(b.target).text(),10);h||(e.hours()>=12?12!==c&&(c+=12):12===c&&(c=0)),aa(e.clone().hours(c)),ea.showPicker.call(l)},selectMinute:function(b){aa(e.clone().minutes(parseInt(a(b.target).text(),10))),ea.showPicker.call(l)},selectSecond:function(b){aa(e.clone().seconds(parseInt(a(b.target).text(),10))),ea.showPicker.call(l)},clear:ca,today:function(){var a=y();R(a,"d")&&aa(a)},close:ba},fa=function(b){return!a(b.currentTarget).is(".disabled")&&(ea[a(b.currentTarget).data("action")].apply(l,arguments),!1)},ga=function(){var b,c={year:function(a){return a.month(0).date(1).hours(0).seconds(0).minutes(0)},month:function(a){return a.date(1).hours(0).seconds(0).minutes(0)},day:function(a){return a.hours(0).seconds(0).minutes(0)},hour:function(a){return a.seconds(0).minutes(0)},minute:function(a){return a.seconds(0)}};return g.prop("disabled")||!d.ignoreReadonly&&g.prop("readonly")||o?l:(void 0!==g.val()&&0!==g.val().trim().length?aa(da(g.val().trim())):m&&d.useCurrent&&(d.inline||g.is("input")&&0===g.val().trim().length)&&(b=y(),"string"==typeof d.useCurrent&&(b=c[d.useCurrent](b)),aa(b)),o=G(),M(),S(),o.find(".timepicker-hours").hide(),o.find(".timepicker-minutes").hide(),o.find(".timepicker-seconds").hide(),_(),L(),a(window).on("resize",I),o.on("click","[data-action]",fa),o.on("mousedown",!1),n&&n.hasClass("btn")&&n.toggleClass("active"),I(),o.show(),d.focusOnShow&&!g.is(":focus")&&g.focus(),J({type:"dp.show"}),l)},ha=function(){return o?ba():ga()},ia=function(a){var b,c,e,f,g=null,h=[],i={},j=a.which,k="p";w[j]=k;for(b in w)w.hasOwnProperty(b)&&w[b]===k&&(h.push(b),parseInt(b,10)!==j&&(i[b]=!0));for(b in d.keyBinds)if(d.keyBinds.hasOwnProperty(b)&&"function"==typeof d.keyBinds[b]&&(e=b.split(" "),e.length===h.length&&v[j]===e[e.length-1])){for(f=!0,c=e.length-2;c>=0;c--)if(!(v[e[c]]in i)){f=!1;break}if(f){g=d.keyBinds[b];break}}g&&(g.call(l,o),a.stopPropagation(),a.preventDefault())},ja=function(a){w[a.which]="r",a.stopPropagation(),a.preventDefault()},ka=function(b){var c=a(b.target).val().trim(),d=c?da(c):null;return aa(d),b.stopImmediatePropagation(),!1},la=function(){g.on({change:ka,blur:d.debug?"":ba,keydown:ia,keyup:ja,focus:d.allowInputToggle?ga:""}),c.is("input")?g.on({focus:ga}):n&&(n.on("click",ha),n.on("mousedown",!1))},ma=function(){g.off({change:ka,blur:blur,keydown:ia,keyup:ja,focus:d.allowInputToggle?ba:""}),c.is("input")?g.off({focus:ga}):n&&(n.off("click",ha),n.off("mousedown",!1))},na=function(b){var c={};return a.each(b,function(){var a=da(this);a.isValid()&&(c[a.format("YYYY-MM-DD")]=!0)}),!!Object.keys(c).length&&c},oa=function(b){var c={};return a.each(b,function(){c[this]=!0}),!!Object.keys(c).length&&c},pa=function(){var a=d.format||"L LT";i=a.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,function(a){var b=e.localeData().longDateFormat(a)||a;return b.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,function(a){return e.localeData().longDateFormat(a)||a})}),j=d.extraFormats?d.extraFormats.slice():[],j.indexOf(a)<0&&j.indexOf(i)<0&&j.push(i),h=i.toLowerCase().indexOf("a")<1&&i.replace(/\[.*?\]/g,"").indexOf("h")<1,z("y")&&(p=2),z("M")&&(p=1),z("d")&&(p=0),k=Math.max(p,k),m||aa(e)};if(l.destroy=function(){ba(),ma(),c.removeData("DateTimePicker"),c.removeData("date")},l.toggle=ha,l.show=ga,l.hide=ba,l.disable=function(){return ba(),n&&n.hasClass("btn")&&n.addClass("disabled"),g.prop("disabled",!0),l},l.enable=function(){return n&&n.hasClass("btn")&&n.removeClass("disabled"),g.prop("disabled",!1),l},l.ignoreReadonly=function(a){if(0===arguments.length)return d.ignoreReadonly;if("boolean"!=typeof a)throw new TypeError("ignoreReadonly () expects a boolean parameter");return d.ignoreReadonly=a,l},l.options=function(b){if(0===arguments.length)return a.extend(!0,{},d);if(!(b instanceof Object))throw new TypeError("options() options parameter should be an object");return a.extend(!0,d,b),a.each(d,function(a,b){if(void 0===l[a])throw new TypeError("option "+a+" is not recognized!");l[a](b)}),l},l.date=function(a){if(0===arguments.length)return m?null:e.clone();if(!(null===a||"string"==typeof a||b.isMoment(a)||a instanceof Date))throw new TypeError("date() parameter must be one of [null, string, moment or Date]");return aa(null===a?null:da(a)),l},l.format=function(a){if(0===arguments.length)return d.format;if("string"!=typeof a&&("boolean"!=typeof a||a!==!1))throw new TypeError("format() expects a string or boolean:false parameter "+a);return d.format=a,i&&pa(),l},l.timeZone=function(a){if(0===arguments.length)return d.timeZone;if("string"!=typeof a)throw new TypeError("newZone() expects a string parameter");return d.timeZone=a,l},l.dayViewHeaderFormat=function(a){if(0===arguments.length)return d.dayViewHeaderFormat;if("string"!=typeof a)throw new TypeError("dayViewHeaderFormat() expects a string parameter");return d.dayViewHeaderFormat=a,l},l.extraFormats=function(a){if(0===arguments.length)return d.extraFormats;if(a!==!1&&!(a instanceof Array))throw new TypeError("extraFormats() expects an array or false parameter");return d.extraFormats=a,j&&pa(),l},l.disabledDates=function(b){if(0===arguments.length)return d.disabledDates?a.extend({},d.disabledDates):d.disabledDates;if(!b)return d.disabledDates=!1,_(),l;if(!(b instanceof Array))throw new TypeError("disabledDates() expects an array parameter");return d.disabledDates=na(b),d.enabledDates=!1,_(),l},l.enabledDates=function(b){if(0===arguments.length)return d.enabledDates?a.extend({},d.enabledDates):d.enabledDates;if(!b)return d.enabledDates=!1,_(),l;if(!(b instanceof Array))throw new TypeError("enabledDates() expects an array parameter");return d.enabledDates=na(b),d.disabledDates=!1,_(),l},l.daysOfWeekDisabled=function(a){if(0===arguments.length)return d.daysOfWeekDisabled.splice(0);if("boolean"==typeof a&&!a)return d.daysOfWeekDisabled=!1,_(),l;if(!(a instanceof Array))throw new TypeError("daysOfWeekDisabled() expects an array parameter");if(d.daysOfWeekDisabled=a.reduce(function(a,b){return b=parseInt(b,10),b>6||b<0||isNaN(b)?a:(a.indexOf(b)===-1&&a.push(b),a)},[]).sort(),d.useCurrent&&!d.keepInvalid){for(var b=0;!R(e,"d");){if(e.add(1,"d"),31===b)throw"Tried 31 times to find a valid date";b++}aa(e)}return _(),l},l.maxDate=function(a){if(0===arguments.length)return d.maxDate?d.maxDate.clone():d.maxDate;if("boolean"==typeof a&&a===!1)return d.maxDate=!1,_(),l;"string"==typeof a&&("now"!==a&&"moment"!==a||(a=y()));var b=da(a);if(!b.isValid())throw new TypeError("maxDate() Could not parse date parameter: "+a);if(d.minDate&&b.isBefore(d.minDate))throw new TypeError("maxDate() date parameter is before options.minDate: "+b.format(i));return d.maxDate=b,d.useCurrent&&!d.keepInvalid&&e.isAfter(a)&&aa(d.maxDate),f.isAfter(b)&&(f=b.clone().subtract(d.stepping,"m")),_(),l},l.minDate=function(a){if(0===arguments.length)return d.minDate?d.minDate.clone():d.minDate;if("boolean"==typeof a&&a===!1)return d.minDate=!1,_(),l;"string"==typeof a&&("now"!==a&&"moment"!==a||(a=y()));var b=da(a);if(!b.isValid())throw new TypeError("minDate() Could not parse date parameter: "+a);if(d.maxDate&&b.isAfter(d.maxDate))throw new TypeError("minDate() date parameter is after options.maxDate: "+b.format(i));return d.minDate=b,d.useCurrent&&!d.keepInvalid&&e.isBefore(a)&&aa(d.minDate),f.isBefore(b)&&(f=b.clone().add(d.stepping,"m")),_(),l},l.defaultDate=function(a){if(0===arguments.length)return d.defaultDate?d.defaultDate.clone():d.defaultDate;if(!a)return d.defaultDate=!1,l;"string"==typeof a&&(a="now"===a||"moment"===a?y():y(a));var b=da(a);if(!b.isValid())throw new TypeError("defaultDate() Could not parse date parameter: "+a);if(!R(b))throw new TypeError("defaultDate() date passed is invalid according to component setup validations");return d.defaultDate=b,(d.defaultDate&&d.inline||""===g.val().trim())&&aa(d.defaultDate),l},l.locale=function(a){if(0===arguments.length)return d.locale;if(!b.localeData(a))throw new TypeError("locale() locale "+a+" is not loaded from moment locales!");return d.locale=a,e.locale(d.locale),f.locale(d.locale),i&&pa(),o&&(ba(),ga()),l},l.stepping=function(a){return 0===arguments.length?d.stepping:(a=parseInt(a,10),(isNaN(a)||a<1)&&(a=1),d.stepping=a,l)},l.useCurrent=function(a){var b=["year","month","day","hour","minute"];if(0===arguments.length)return d.useCurrent;if("boolean"!=typeof a&&"string"!=typeof a)throw new TypeError("useCurrent() expects a boolean or string parameter");if("string"==typeof a&&b.indexOf(a.toLowerCase())===-1)throw new TypeError("useCurrent() expects a string parameter of "+b.join(", "));return d.useCurrent=a,l},l.collapse=function(a){if(0===arguments.length)return d.collapse;if("boolean"!=typeof a)throw new TypeError("collapse() expects a boolean parameter");return d.collapse===a?l:(d.collapse=a,o&&(ba(),ga()),l)},l.icons=function(b){if(0===arguments.length)return a.extend({},d.icons);if(!(b instanceof Object))throw new TypeError("icons() expects parameter to be an Object");return a.extend(d.icons,b),o&&(ba(),ga()),l},l.tooltips=function(b){if(0===arguments.length)return a.extend({},d.tooltips);if(!(b instanceof Object))throw new TypeError("tooltips() expects parameter to be an Object");return a.extend(d.tooltips,b),o&&(ba(),ga()),l},l.useStrict=function(a){if(0===arguments.length)return d.useStrict;if("boolean"!=typeof a)throw new TypeError("useStrict() expects a boolean parameter");return d.useStrict=a,l},l.sideBySide=function(a){if(0===arguments.length)return d.sideBySide;if("boolean"!=typeof a)throw new TypeError("sideBySide() expects a boolean parameter");return d.sideBySide=a,o&&(ba(),ga()),l},l.viewMode=function(a){if(0===arguments.length)return d.viewMode;if("string"!=typeof a)throw new TypeError("viewMode() expects a string parameter");if(r.indexOf(a)===-1)throw new TypeError("viewMode() parameter must be one of ("+r.join(", ")+") value");return d.viewMode=a,k=Math.max(r.indexOf(a),p),L(),l},l.toolbarPlacement=function(a){if(0===arguments.length)return d.toolbarPlacement;if("string"!=typeof a)throw new TypeError("toolbarPlacement() expects a string parameter");if(u.indexOf(a)===-1)throw new TypeError("toolbarPlacement() parameter must be one of ("+u.join(", ")+") value");return d.toolbarPlacement=a,o&&(ba(),ga()),l},l.widgetPositioning=function(b){if(0===arguments.length)return a.extend({},d.widgetPositioning);if("[object Object]"!=={}.toString.call(b))throw new TypeError("widgetPositioning() expects an object variable");if(b.horizontal){if("string"!=typeof b.horizontal)throw new TypeError("widgetPositioning() horizontal variable must be a string");if(b.horizontal=b.horizontal.toLowerCase(),t.indexOf(b.horizontal)===-1)throw new TypeError("widgetPositioning() expects horizontal parameter to be one of ("+t.join(", ")+")");d.widgetPositioning.horizontal=b.horizontal}if(b.vertical){if("string"!=typeof b.vertical)throw new TypeError("widgetPositioning() vertical variable must be a string");if(b.vertical=b.vertical.toLowerCase(),s.indexOf(b.vertical)===-1)throw new TypeError("widgetPositioning() expects vertical parameter to be one of ("+s.join(", ")+")");d.widgetPositioning.vertical=b.vertical}return _(),l},l.calendarWeeks=function(a){if(0===arguments.length)return d.calendarWeeks;if("boolean"!=typeof a)throw new TypeError("calendarWeeks() expects parameter to be a boolean value");return d.calendarWeeks=a,_(),l},l.showTodayButton=function(a){if(0===arguments.length)return d.showTodayButton;if("boolean"!=typeof a)throw new TypeError("showTodayButton() expects a boolean parameter");return d.showTodayButton=a,o&&(ba(),ga()),l},l.showClear=function(a){if(0===arguments.length)return d.showClear;if("boolean"!=typeof a)throw new TypeError("showClear() expects a boolean parameter");return d.showClear=a,o&&(ba(),ga()),l},l.widgetParent=function(b){if(0===arguments.length)return d.widgetParent;if("string"==typeof b&&(b=a(b)),null!==b&&"string"!=typeof b&&!(b instanceof a))throw new TypeError("widgetParent() expects a string or a jQuery object parameter");return d.widgetParent=b,o&&(ba(),ga()),l},l.keepOpen=function(a){if(0===arguments.length)return d.keepOpen;if("boolean"!=typeof a)throw new TypeError("keepOpen() expects a boolean parameter");return d.keepOpen=a,l},l.focusOnShow=function(a){if(0===arguments.length)return d.focusOnShow;if("boolean"!=typeof a)throw new TypeError("focusOnShow() expects a boolean parameter");return d.focusOnShow=a,l},l.inline=function(a){if(0===arguments.length)return d.inline;if("boolean"!=typeof a)throw new TypeError("inline() expects a boolean parameter");return d.inline=a,l},l.clear=function(){return ca(),l},l.keyBinds=function(a){return 0===arguments.length?d.keyBinds:(d.keyBinds=a,l)},l.getMoment=function(a){return y(a)},l.debug=function(a){if("boolean"!=typeof a)throw new TypeError("debug() expects a boolean parameter");return d.debug=a,l},l.allowInputToggle=function(a){if(0===arguments.length)return d.allowInputToggle;if("boolean"!=typeof a)throw new TypeError("allowInputToggle() expects a boolean parameter");return d.allowInputToggle=a,l},l.showClose=function(a){if(0===arguments.length)return d.showClose;if("boolean"!=typeof a)throw new TypeError("showClose() expects a boolean parameter");return d.showClose=a,l},l.keepInvalid=function(a){if(0===arguments.length)return d.keepInvalid;if("boolean"!=typeof a)throw new TypeError("keepInvalid() expects a boolean parameter");
return d.keepInvalid=a,l},l.datepickerInput=function(a){if(0===arguments.length)return d.datepickerInput;if("string"!=typeof a)throw new TypeError("datepickerInput() expects a string parameter");return d.datepickerInput=a,l},l.parseInputDate=function(a){if(0===arguments.length)return d.parseInputDate;if("function"!=typeof a)throw new TypeError("parseInputDate() sholud be as function");return d.parseInputDate=a,l},l.disabledTimeIntervals=function(b){if(0===arguments.length)return d.disabledTimeIntervals?a.extend({},d.disabledTimeIntervals):d.disabledTimeIntervals;if(!b)return d.disabledTimeIntervals=!1,_(),l;if(!(b instanceof Array))throw new TypeError("disabledTimeIntervals() expects an array parameter");return d.disabledTimeIntervals=b,_(),l},l.disabledHours=function(b){if(0===arguments.length)return d.disabledHours?a.extend({},d.disabledHours):d.disabledHours;if(!b)return d.disabledHours=!1,_(),l;if(!(b instanceof Array))throw new TypeError("disabledHours() expects an array parameter");if(d.disabledHours=oa(b),d.enabledHours=!1,d.useCurrent&&!d.keepInvalid){for(var c=0;!R(e,"h");){if(e.add(1,"h"),24===c)throw"Tried 24 times to find a valid date";c++}aa(e)}return _(),l},l.enabledHours=function(b){if(0===arguments.length)return d.enabledHours?a.extend({},d.enabledHours):d.enabledHours;if(!b)return d.enabledHours=!1,_(),l;if(!(b instanceof Array))throw new TypeError("enabledHours() expects an array parameter");if(d.enabledHours=oa(b),d.disabledHours=!1,d.useCurrent&&!d.keepInvalid){for(var c=0;!R(e,"h");){if(e.add(1,"h"),24===c)throw"Tried 24 times to find a valid date";c++}aa(e)}return _(),l},l.viewDate=function(a){if(0===arguments.length)return f.clone();if(!a)return f=e.clone(),l;if(!("string"==typeof a||b.isMoment(a)||a instanceof Date))throw new TypeError("viewDate() parameter must be one of [string, moment or Date]");return f=da(a),K(),l},c.is("input"))g=c;else if(g=c.find(d.datepickerInput),0===g.length)g=c.find("input");else if(!g.is("input"))throw new Error('CSS class "'+d.datepickerInput+'" cannot be applied to non input element');if(c.hasClass("input-group")&&(n=0===c.find(".datepickerbutton").length?c.find(".input-group-addon"):c.find(".datepickerbutton")),!d.inline&&!g.is("input"))throw new Error("Could not initialize DateTimePicker without an input element");return e=y(),f=e.clone(),a.extend(!0,d,H()),l.options(d),pa(),la(),g.prop("disabled")&&l.disable(),g.is("input")&&0!==g.val().trim().length?aa(da(g.val().trim())):d.defaultDate&&void 0===g.attr("placeholder")&&aa(d.defaultDate),d.inline&&ga(),l};return a.fn.datetimepicker=function(b){b=b||{};var d,e=Array.prototype.slice.call(arguments,1),f=!0,g=["destroy","hide","show","toggle"];if("object"==typeof b)return this.each(function(){var d,e=a(this);e.data("DateTimePicker")||(d=a.extend(!0,{},a.fn.datetimepicker.defaults,b),e.data("DateTimePicker",c(e,d)))});if("string"==typeof b)return this.each(function(){var c=a(this),g=c.data("DateTimePicker");if(!g)throw new Error('bootstrap-datetimepicker("'+b+'") method was called on an element that is not using DateTimePicker');d=g[b].apply(g,e),f=d===g}),f||a.inArray(b,g)>-1?this:d;throw new TypeError("Invalid arguments for DateTimePicker: "+b)},a.fn.datetimepicker.defaults={timeZone:"",format:!1,dayViewHeaderFormat:"MMMM YYYY",extraFormats:!1,stepping:1,minDate:!1,maxDate:!1,useCurrent:!0,collapse:!0,locale:b.locale(),defaultDate:!1,disabledDates:!1,enabledDates:!1,icons:{time:"glyphicon glyphicon-time",date:"glyphicon glyphicon-calendar",up:"glyphicon glyphicon-chevron-up",down:"glyphicon glyphicon-chevron-down",previous:"glyphicon glyphicon-chevron-left",next:"glyphicon glyphicon-chevron-right",today:"glyphicon glyphicon-screenshot",clear:"glyphicon glyphicon-trash",close:"glyphicon glyphicon-remove"},tooltips:{today:"Go to today",clear:"Clear selection",close:"Close the picker",selectMonth:"Select Month",prevMonth:"Previous Month",nextMonth:"Next Month",selectYear:"Select Year",prevYear:"Previous Year",nextYear:"Next Year",selectDecade:"Select Decade",prevDecade:"Previous Decade",nextDecade:"Next Decade",prevCentury:"Previous Century",nextCentury:"Next Century",pickHour:"Pick Hour",incrementHour:"Increment Hour",decrementHour:"Decrement Hour",pickMinute:"Pick Minute",incrementMinute:"Increment Minute",decrementMinute:"Decrement Minute",pickSecond:"Pick Second",incrementSecond:"Increment Second",decrementSecond:"Decrement Second",togglePeriod:"Toggle Period",selectTime:"Select Time"},useStrict:!1,sideBySide:!1,daysOfWeekDisabled:!1,calendarWeeks:!1,viewMode:"days",toolbarPlacement:"default",showTodayButton:!1,showClear:!1,showClose:!1,widgetPositioning:{horizontal:"auto",vertical:"auto"},widgetParent:null,ignoreReadonly:!1,keepOpen:!1,focusOnShow:!0,inline:!1,keepInvalid:!1,datepickerInput:".datepickerinput",keyBinds:{up:function(a){if(a){var b=this.date()||this.getMoment();a.find(".datepicker").is(":visible")?this.date(b.clone().subtract(7,"d")):this.date(b.clone().add(this.stepping(),"m"))}},down:function(a){if(!a)return void this.show();var b=this.date()||this.getMoment();a.find(".datepicker").is(":visible")?this.date(b.clone().add(7,"d")):this.date(b.clone().subtract(this.stepping(),"m"))},"control up":function(a){if(a){var b=this.date()||this.getMoment();a.find(".datepicker").is(":visible")?this.date(b.clone().subtract(1,"y")):this.date(b.clone().add(1,"h"))}},"control down":function(a){if(a){var b=this.date()||this.getMoment();a.find(".datepicker").is(":visible")?this.date(b.clone().add(1,"y")):this.date(b.clone().subtract(1,"h"))}},left:function(a){if(a){var b=this.date()||this.getMoment();a.find(".datepicker").is(":visible")&&this.date(b.clone().subtract(1,"d"))}},right:function(a){if(a){var b=this.date()||this.getMoment();a.find(".datepicker").is(":visible")&&this.date(b.clone().add(1,"d"))}},pageUp:function(a){if(a){var b=this.date()||this.getMoment();a.find(".datepicker").is(":visible")&&this.date(b.clone().subtract(1,"M"))}},pageDown:function(a){if(a){var b=this.date()||this.getMoment();a.find(".datepicker").is(":visible")&&this.date(b.clone().add(1,"M"))}},enter:function(){this.hide()},escape:function(){this.hide()},"control space":function(a){a&&a.find(".timepicker").is(":visible")&&a.find('.btn[data-action="togglePeriod"]').click()},t:function(){this.date(this.getMoment())},delete:function(){this.clear()}},debug:!1,allowInputToggle:!1,disabledTimeIntervals:!1,disabledHours:!1,enabledHours:!1,viewDate:!1},a.fn.datetimepicker});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(22);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../achive-build/node_modules/style-loader/index.js!../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./base.css", function() {
		var newContent = require("!!../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../achive-build/node_modules/style-loader/index.js!../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./base.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(3),
    __webpack_require__(0),
    __webpack_require__(4),
    __webpack_require__(16),

    __webpack_require__(7),
    __webpack_require__(31)

], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
    Vue,$,Api,
    TeamworkList

){
    var app = new Vue({
        data: function(){
            return {};
        },
        methods: {

        },components: {
            TeamworkList: TeamworkList,
        },
        mounted: function(){

        },
    });
    app.$mount('#app');

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = _;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(3),
    __webpack_require__(11),
    __webpack_require__(0)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
    Vue,
    LoadingToast,
    $
){
    var $toastOverlay = $('<div/>').appendTo('body');

    return new Vue({
        el: $toastOverlay[0],
        template: '<loading-toast v-show="loadingToast.isShow"></loading-toast>',
        components: {
            LoadingToast: LoadingToast
        },
        data: {
            loadingToast: {
                isShow: false
            }
        },
        methods: {
            showLoadingToast: function(){
                this.loadingToast.isShow = true;
            },
            hideLoadingToast: function(){
                this.loadingToast.isShow = false;
            }
        }
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(12),

    __webpack_require__(13)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
    tpl
){
    return {
        template: tpl
    }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <div class=\"weui-mask_transparent\"></div>\r\n    <div class=\"weui-toast\">\r\n        <i class=\"weui-loading weui-icon_toast\"></i>\r\n        <p class=\"weui-toast__content\">Loading...</p>\r\n    </div>\r\n</div>"

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(14);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../achive-build/node_modules/style-loader/index.js!../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./loading.css", function() {
		var newContent = require("!!../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../achive-build/node_modules/style-loader/index.js!../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./loading.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 15 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(19),
    __webpack_require__(3),
    __webpack_require__(0),
    __webpack_require__(4),
    __webpack_require__(20),
    __webpack_require__(21),
    __webpack_require__(2),
    // 'ELEMENT',

    __webpack_require__(7),
    __webpack_require__(23),
    __webpack_require__(25),
    __webpack_require__(27),
    __webpack_require__(29),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
    tpl,
    Vue,$,
    Api,
    BsDateTimePicker,
    BsDateTimePickers,
    moment
){
    return {
        data: function(){
            return {
                tableData: {page:{}},
                multipleSelection: [],
                editShow: false,
                product: {
                    file: [],
                    oldName: []
                },
                products: {
                    file: [],
                    oldName: []
                },
                isEdit: false,
                btnStatus: 0,
                deleteShow: false,
                deleteId: {},
                deleteNum: [],
                btnClass: 0,
                btnStatus: 0,
                workNum: 0,
                pageInfo: {
                    limit: 10,
                    page: 1,
                    totalPage: 6,
                },
                thePage: 1,
                isPageShow: false,
                isStatusShow: false,
                isPersonShow: false,
                isOperatorShow: false,
                isEmergencyShow: false,
                checkAll: false,
                isIndeterminate: true,
                operatorList: [],
                statusList: [],
                emergencyList: ['一般','紧急','十分紧急'],
                quick: false,
                quickShow: ['全部','一般','紧急','十分紧急'],
                checkInfo: {
                    acceptancetimeStar: '',
                    acceptancetimeEnd: ''
                },
                checkOperator: [{id: null, name: '全部'}],
                checkStatus: [{id: null, develop_status: '全部', statusCount: 0}],
                openOper: false,
                openDes: false,
                openStatus: false,
                openEmergency: false,
                openAcceptancetimeStar: false,
                openAcceptancetimeEnd: false,
                isCheck: false,
                id: '',
                image: '',
                isCheckStatus: false,
                isCheckPerson: false,
                updateId: {},
                btnTheNumber: 0,
                isStatusBtnsShow: true,
                filesOpen: false,
                isIndex: 1,
                filesNumber: 0,
                lookShow: false,
                lookCon: ['全部','关闭'],
                lookConNow: '全部',
                header: []
            }
        },
        methods: {
            changeLookShow: function () {
                  this.lookShow = !this.lookShow;
            },
            filesShow: function (index) {
                var arr = '';
                this.product.file.push(arr);
                this.product.oldName.push(arr);
                // this.products = this.product;
                this.$set(this.products.file, index, this.product.file[index]);
                this.$set(this.products.oldName, index, this.product.oldName[index]);
            },
            takeFiles:function () {
                var that = this;
                that.filesOpen = true;
                if(that.product.file.length===0){
                    var arr = '';
                    that.product.file.push(arr);
                    that.product.oldName.push(arr);
                }
                this.products = this.product;
            },
            closeFiles: function () {
                var that = this;
                that.filesOpen = false;
                var len = that.product.file.length;
                var aaa = [];
                var bbb = [];
                for(var i=0;i<len;i++){
                    if(that.product.file[i].length>0){
                        aaa.push(that.product.file[i]);
                        bbb.push(that.product.oldName[i]);
                    }
                }
                that.product.file = aaa;
                that.product.oldName = bbb;
                if(that.product.file!=[]){
                    that.filesNumber = that.product.file.length;
                }
                that.products = that.product;
                console.log(that.product.file);
            },
            getClosedList: function () {
                var _this = this;
                Api.getClosedList.ajax({pages: _this.pageInfo.limit,pageNum: _this.pageInfo.page})
                    .done(function(data){
                        $(".ischecked").removeClass("is-checked");
                        _this.deleteId = {};
                        _this.updateId = {};
                        _this.tableData = data;
                        lens = _this.tableData.result.length;
                        for(var j=0;j<lens;j++){
                            _this.tableData.result[j].checked = false;
                        }
                        _this.workNum = parseInt(_this.tableData.page.totalRows);
                        _this.checkStatus[0].statusCount = _this.workNum;
                        _this.pageInfo.totalPage = data.page.totalPages;
                    });
            },
            clearTime: function () {
                this.checkInfo.acceptancetimeStar = '';
                this.checkInfo.acceptancetimeEnd = '';
            },
            openQuick: function () {
                this.quick = !this.quick;
                this.openDes = false;
                this.openOper = false;
                this.openStatus = false;
                this.openAcceptancetimeStar = false;
            },
            openDespel: function () {
                this.openDes = !this.openDes;
                this.quick = false;
                this.openOper = false;
                this.openStatus = false;
                this.openAcceptancetimeStar = false;
            },
            openOperator: function () {
                this.openOper = !this.openOper;
                this.quick = false;
                this.openDes = false;
                this.openStatus = false;
                this.openAcceptancetimeStar = false;
            },
            openStatusList: function () {
                this.openStatus = !this.openStatus;
                this.openOper = false;
                this.quick = false;
                this.openDes = false;
                this.openAcceptancetimeStar = false;
            },
            closeQuick: function (num,item,index) {
                if(num==1){
                    if(index!=0){
                        this.checkInfo.emergency = item;
                    }else {
                        this.checkInfo.emergency = '';
                    }
                }else if(num==2){
                    if(index!=0){
                        this.checkInfo.designatedPersonName = item.name;
                        this.checkInfo.designatedPerson = item.id;
                    }else {
                        this.checkInfo.designatedPersonName = '';
                        this.checkInfo.designatedPerson = '';
                    }
                }else if(num==3){
                    if(index!=0){
                        this.checkInfo.operator = item.name;
                        this.checkInfo.operator_name = item.id;
                    }else {
                        this.checkInfo.operator = '';
                        this.checkInfo.operator_name = '';
                    }
                }else if(num==4){
                    if(index!=0){
                        this.checkInfo.statusInfo = item.develop_status;
                        this.checkInfo.status = item.id;
                    }else {
                        this.checkInfo.statusInfo = '';
                        this.checkInfo.status = '';
                    }
                }
                this.quick = false;
                this.openOper = false;
                this.openDes = false;
                this.openStatus = false;
            },
            onCheck: function () {
                var _this = this;
                var info = {};
                info = _this.checkInfo;
                if(_this.checkInfo.acceptancetimeStar.length>0&&
                    _this.checkInfo.acceptancetimeEnd.length==0){
                    return alert("请选择结束时间");
                }else if(_this.checkInfo.acceptancetimeEnd.length>0&&
                    _this.checkInfo.acceptancetimeStar.length==0){
                    return alert("请选择开始时间");
                }
                info.pages = _this.pageInfo.limit;
                console.log(info);
                if(_this.btnTheNumber==0){
                    Api.getTeamworkList.ajax(info)
                        .done(function(data){
                            // data = JSON.parse(data);
                            $(".ischecked").removeClass("is-checked");
                            _this.deleteId = {};
                            _this.updateId = {};
                            _this.tableData = data;
                            console.log(data);
                            _this.tableData = data;
                            lens = _this.tableData.result.length;
                            for(var j=0;j<lens;j++){
                                _this.tableData.result[j].checked = false;
                            }
                            _this.workNum = parseInt(_this.tableData.page.totalRows);
                            _this.pageInfo.totalPage = data.page.totalPages;
                        });
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
            },
            timestampToTime: function(timestamp) {
                var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                return Y+M+D;
            },
            teamworkEdit: function (id) {
                var _this = this;
                _this.btnStatus = 0;
                _this.isEdit = false;
                _this.editShow = true;
                Api.getTeamworkInfo.ajax({id: id})
                    .done(function(data){
                        // data = JSON.parse(data);
                        console.log(data);
                        _this.product = data;
                        if(_this.product.file==null){
                            _this.product.file = [];
                            _this.product.oldName = [];
                            // _this.product.file[0] = '';
                        }else {
                            if(_this.product.file.length>0){
                                _this.filesNumber = _this.product.file.length;
                            }
                        }
                        // if(_this.product.file.length==0){
                        //     _this.product.file = [];
                        // }
                        _this.product.designatedPersonName = _this.product.designatedPerson;
                        _this.product.operator = _this.product.operator_name;
                        _this.product.statusInfo = _this.product.status;
                        var len = _this.operatorList.length;
                        for(var n=0;n<len;n++){
                            if(_this.product.designatedPerson==_this.operatorList[n].name){
                                _this.product.designatedPerson = _this.operatorList[n].id;
                            }
                            if(_this.product.operator_name==_this.operatorList[n].name){
                                _this.product.operator_name = _this.operatorList[n].id;
                            }
                        }
                        var lens = _this.statusList.length;
                        for(var m=0;m<lens;m++){
                            if(_this.product.status==_this.statusList[m].develop_status){
                                _this.product.status = _this.statusList[m].id;
                            }
                        }
                        _this.products = _this.product;
                    });
            },
            teamworkDelete: function (num) {
                this.deleteShow = true;
                var pid = parseInt(this.tableData.result[num].id);
                this.deleteId.id = pid;
                // this.deleteNum.push(num);
                  // this.tableData.splice(num,1);
            },
            teamworksDelete: function () {
                if(this.deleteId.id){
                    this.deleteShow = true;
                }else {
                    alert("请选择想要删除的数据")
                }
            },
            doDelete: function () {
                var that = this;
                // that.deleteNum.forEach(function (t) {
                //     that.tableData.result.splice(t,1);
                // });
                Api.deleteTeamworkInfo.ajax(that.deleteId)
                    .done(function(data){
                        alert("删除成功");
                    });
                this.getList();
                that.deleteId = {};
                that.updateId = {};
                that.deleteNum = [];
                that.deleteShow = false;
            },
            closeDelete: function () {
                this.deleteId = {};
                this.updateId = {};
                this.deleteNum = [];
                this.deleteShow = false;
            },
            doEdit: function () {
                var _this = this;
                if(!_this.product.submitter){
                    return alert("请填写提交人");
                }else if(!_this.product.status){
                    return alert("请选择状态");
                }else if(!_this.product.demand_name){
                    return alert("请填写需求名称");
                }else if(!_this.product.describe){
                    return alert("请填写需求描述");
                }else if(!_this.product.designatedPerson){
                    return alert("请选择指派人");
                }else if(!_this.product.emergency){
                    return alert("请选择优先级");
                }else if(!_this.product.acceptancetime){
                    return alert("请选择预计验收时间");
                }else if(!_this.product.operator_name){
                    return alert("请选择操作人");
                }
                this.isEdit = false;
                this.editShow = false;
                console.log("后面就是");
                console.log(_this.product.file);
                console.log(_this.product);
                console.log("前面就是");
                if(_this.product.id){
                    Api.updateTeamworkInfo.ajax(_this.product)
                        .done(function(data){
                            alert("修改成功");
                        });
                }else {
                    Api.addTeamworkList.ajax(_this.product)
                        .done(function(data){
                            alert("创建成功");
                        });
                }
                this.product = {
                    file: [],
                    oldName: []
                };
                this.products = this.product;
                this.getList();
            },
            closeInfo: function () {
                this.isStatusShow = false;
                this.isPersonShow = false;
                this.isOperatorShow = false;

                this.isEdit = false;
                this.editShow = false;
                this.product = {
                    file: [],
                    oldName: []
                }
                this.products = {
                    file: [],
                    oldName: []
                }
            },
            btnEdit: function () {
                this.btnStatus = 1;
                this.isEdit = true;
            },
            productNew: function () {
                this.btnStatus = 2;
                this.isEdit = true;
                this.editShow = true;
                this.product.file = [];
                this.product.file[0] = '';
                this.product.oldName = [];
                this.product.oldName[0] = '';

                this.products = this.product;
            },
            getList: function () {
                // alert(222);
                var _this = this;
                var lens;
                Api.getTeamworkList.ajax({pages: _this.pageInfo.limit,pageNum: _this.pageInfo.page})
                    .done(function(data){
                        // data = JSON.parse(data);
                        console.log(data);
                        _this.tableData = data;
                        lens = _this.tableData.result.length;
                        for(var j=0;j<lens;j++){
                            _this.tableData.result[j].checked = false;
                        }
                        _this.workNum = parseInt(_this.tableData.page.totalRows);
                        _this.checkStatus[0].statusCount = _this.workNum;
                        _this.pageInfo.totalPage = data.page.totalPages;
                    });
            },
            getPeopleList: function () {
                var _this = this;
                Api.getOperatorList.ajax()
                    .done(function(data){
                        _this.operatorList = data;
                        for(var k=0;k<_this.operatorList.length;k++){
                            console.log(_this.operatorList[k]);
                            _this.checkOperator.push(_this.operatorList[k]);
                        }
                    });
            },
            getStatusList: function () {
                var _this = this;
                Api.getTeamworkStatus.ajax()
                    .done(function(data){
                        _this.statusList = data.result;
                        for(var a=0;a<_this.statusList.length;a++){
                            _this.checkStatus.push(_this.statusList[a]);
                        }
                    });
            },
            chooseBtn: function (n) {
                var _this = this;
                _this.btnClass = n;
                _this.btnStatus = 0;
                _this.btnTheNumber = n;
                if(n==0){
                    _this.isStatusBtnsShow = true;
                    this.getList();
                }else if(n==1){
                    _this.isStatusBtnsShow = false;
                    this.getClosedList();
                }
                _this.lookShow = false;
                _this.lookConNow = _this.lookCon[n];
            },
            statusBtn: function (n,id) {
                var _this = this;
                _this.btnStatus = n;
                _this.checkInfo = {
                    acceptancetimeStar: '',
                    acceptancetimeEnd: ''
                };
                var info = {};
                info.status = id;
                info.pages = _this.pageInfo.limit;
                console.log(info);
                Api.getTeamworkList.ajax(info)
                    .done(function(data){
                        // data = JSON.parse(data);
                        console.log(data);
                        _this.tableData = data;
                        _this.workNum = parseInt(data.page.totalRows);
                        _this.pageInfo.totalPage = data.page.totalPages;
                    });
            },
            pageShow: function (m) {
                var _this = this;
                _this.pageInfo.limit = m;
                _this.isPageShow = !_this.isPageShow;
                _this.getList();
            },
            statusShow: function (id,status) {
                var _this = this;
                _this.product.status = id;
                _this.product.statusInfo = status;
                _this.isStatusShow = false;
            },
            operatorShow: function (id,name) {
                var _this = this;
                _this.product.operator_name = id;
                _this.product.operator = name;
                _this.isOperatorShow = false;
            },
            personShow: function (id,name) {
                var _this = this;
                _this.product.designatedPerson = id;
                _this.product.designatedPersonName = name;
                _this.isPersonShow = !_this.isPersonShow;
            },
            emergencyShow: function (item) {
                var _this = this;
                _this.product.emergency = item;
                _this.isEmergencyShow = false;
            },
            changePageShow: function () {
                var _this = this;
                _this.isPageShow = !_this.isPageShow;
            },
            chooseStatus: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isStatusShow = !_this.isStatusShow;
                }
                _this.isPersonShow = false;
                _this.isOperatorShow = false;
                _this.isEmergencyShow = false;
            },
            choosePerson: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isPersonShow = !_this.isPersonShow;
                }
                _this.isStatusShow = false;
                _this.isOperatorShow = false;
                _this.isEmergencyShow = false;
            },
            chooseOperator: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isOperatorShow = !_this.isOperatorShow;
                }
                _this.isStatusShow = false;
                _this.isPersonShow = false;
                _this.isEmergencyShow = false;
            },
            chooseEmergency: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isEmergencyShow = !_this.isEmergencyShow;
                }
                _this.isStatusShow = false;
                _this.isPersonShow = false;
                _this.isOperatorShow = false;
            },
            prevPage: function () {
                var _this = this;
                if(_this.thePage==1){
                    return;
                }else {
                    _this.thePage-=1;
                    _this.pageInfo.page -= 1;
                }
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
                $(".ischecked").removeClass("is-checked");
                _this.deleteId = {};
                _this.updateId = {};
            },
            nextPage: function () {
                var _this = this;
                if(_this.thePage==_this.pageInfo.totalPage){
                    return;
                }else {
                    _this.thePage+=1;
                    _this.pageInfo.page += 1;
                }
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
                $(".ischecked").removeClass("is-checked");
                _this.deleteId = {};
                _this.updateId = {};
            },
            toThePage: function (item) {
                var _this = this;
                _this.thePage = item;
                _this.pageInfo.page = item;
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
                $(".ischecked").removeClass("is-checked");
                _this.deleteId = {};
                _this.updateId = {};
            },
            handleCheckAllChange: function(val) {
                var that = this;
                that.checkAll = !that.checkAll;
                var len = that.tableData.result.length;
                if(that.checkAll){
                    that.deleteNum = that.tableData.result.id;
                    var arr = that.tableData.result;
                    for(var i=0;i<len;i++){
                        var pid;
                        // pid = parseInt(that.tableData.result[i].id);
                        if(i==0){
                            that.deleteId = {id: that.tableData.result[i].id};
                        }
                        else {
                            pid = that.deleteId.id + ',' + that.tableData.result[i].id;
                            that.deleteId = {id: pid};
                        }
                    }
                    $(".ischecked").addClass("is-checked");
                }else {
                    $(".ischecked").removeClass("is-checked");
                    that.deleteId = {};
                }
                that.updateId = that.deleteId;
            },
            handleCheckedCitiesChange: function(id,index) {
                var that = this;
                if(that.checkAll){
                    that.checkAll = false;
                }
                var isChecked = that.tableData.result[index].checked;
                if($('.ischecked').eq(index).hasClass('is-checked')){
                    $('.ischecked').eq(index).removeClass('is-checked');
                    var array = [];
                    // alert(id);
                    array = that.deleteId.id.split(',');
                    var a = array.indexOf(id);
                    // alert('a='+a);
                    array.splice(a,1);
                    that.deleteId.id = array.join(',');
                }else {
                    if(that.deleteId.id){
                        that.deleteId.id = that.deleteId.id + ',' + id;
                    }else {
                        that.deleteId.id = id;
                    }
                    $('.ischecked').eq(index).addClass('is-checked');
                }
                this.isAllCheck();
                that.updateId = that.deleteId;
                // alert(index);
            },
            isAllCheck: function () {
                var _this = this;
                var array = [];
                // alert(id);
                array = _this.deleteId.id.split(',');
                var len = array.length;
                console.log(len);
                if(len==10){
                    _this.checkAll = true;
                }
            },
            preview: function(index){
                // alert(index);
                var _this = this;
                console.log(_this.product.file);

                var files = document.getElementsByClassName('giveFile')[index].files[0];
                console.log(files);
                if(files){
                    var formData = new FormData();
                    formData.append("file", files);

                    Api.getFileUpload.ajaxPromise(formData,{type: 'POST', processData: false,
                        contentType: false})
                        .done(function (data) {
                            _this.product.file[index] = data.file.file;
                            _this.product.oldName[index] = data.file.name;
                            console.log(_this.product);
                            // _this.product.file = _this.product.file;
                            // _this.product.oldName = _this.product.oldName;
                            // _this.product.file.sort();
                            // _this.product.oldName.sort();

                            _this.$set(_this.products.file, _this.product.file);
                            _this.$set(_this.products.oldName, _this.product.oldName);
                            // _this.$set(_this.products, _this.product.oldName);
                            // _this.$set(_this.products, index, _this.product[index]);
                            // _this.products =  [..._this.product];;
                        });
                }
            },
            downloadInfo: function (id,index) {
                Api.getDownload.ajax({id: id})
                    .done(function(data){
                        console.log(data[index]);
                        window.location.href = 'http://' + data[index];
                    });
            },
            updateStatus: function () {
                var _this = this;
                _this.isCheckStatus = !_this.isCheckStatus;
            },
            takeStatus: function (status,statusInfo,index) {
                if(index!=0){
                    this.updateId.status = status;
                    this.updateId.statusInfo = statusInfo;
                }else {
                    this.updateId.status = '';
                    this.updateId.statusInfo = '';
                }
                this.isCheckStatus = false;
            },
            updatePerson: function () {
                var _this = this;
                _this.isCheckPerson = !_this.isCheckPerson;
            },
            takePerson: function (designatedPerson,designatedPersonName,index) {
                if(index!=0){
                    this.updateId.designatedPerson = designatedPerson;
                    this.updateId.designatedPersonName = designatedPersonName;
                }else {
                    this.updateId.designatedPerson = '';
                    this.updateId.designatedPersonName = '';
                }
                this.isCheckPerson = false;
            },
            doUpdates: function () {
                var _this = this;
                Api.updateThose.ajax(_this.updateId)
                    .done(function(data){
                        $(".ischecked").removeClass("is-checked");
                        _this.deleteId = {};
                        _this.updateId = {};
                    });
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
            },
            doCloseThose: function () {
                var _this = this;
                Api.closeThose.ajax(_this.deleteId)
                    .done(function(data){
                        $(".ischecked").removeClass("is-checked");
                        _this.deleteId = {};
                        _this.updateId = {};
                    });
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
            },
            doCancelClosedThose: function () {
                var _this = this;
                Api.cancelClosedThose.ajax(_this.deleteId)
                    .done(function(data){
                        $(".ischecked").removeClass("is-checked");
                        _this.deleteId = {};
                        _this.updateId = {};
                    });
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
            }
        },
        template: tpl,
        props: {},
        components: {
            BsDateTimePicker: BsDateTimePicker,
            BsDateTimePickers: BsDateTimePickers
        },
        computed: {},
        mounted: function(){
            this.getStatusList();
            this.getPeopleList();
            this.getList();
        },
        filters: {
            dateFormat: function(str){
                return str ? moment(str).format('YYYY-MM-DD') : '';
            }
        }
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./zh-cn": 5,
	"./zh-cn.js": 5
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 18;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <div class=\"main-container\" style=\"padding: 0 10px 0 10px; box-sizing: border-box;\">\r\n        <section class=\"app-main\">\r\n            <div class=\"app-container\">\r\n                <div class=\"filter-container\" style=\"margin-top: 20px;\">\r\n                    <div class=\"el-select filter-item el-select--medium\" style=\"width: 130px;\">\r\n                        <div class=\"el-input el-input--medium el-input--suffix\" @click=\"openQuick\">\r\n                            <input type=\"text\" readonly=\"readonly\" autocomplete=\"off\" placeholder=\"紧急程度\"\r\n                                   class=\"el-input__inner\" v-model=\"checkInfo.emergency\">\r\n                            <span class=\"el-input__suffix\">\r\n                                <span class=\"el-input__suffix-inner\">\r\n                                    <i class=\"el-select__caret el-input__icon el-icon-arrow-up\"></i>\r\n                                </span>\r\n                            </span>\r\n                        </div>\r\n                        <div class=\"el-select-dropdown el-popper\" style=\"min-width: 90px;\" v-if=\"quick\">\r\n                            <div class=\"el-scrollbar\" style=\"\">\r\n                                <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\"\r\n                                     style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                    <ul v-for=\"(item, index) in quickShow\" :key=\"index\" class=\"el-scrollbar__view el-select-dropdown__list\">\r\n                                        <li class=\"el-select-dropdown__item\" @click=\"closeQuick(1,item,index)\">\r\n                                            <span>{{item}}</span>\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-vertical\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"el-select filter-item el-select--medium\" style=\"width: 100px;\">\r\n                        <div class=\"el-input el-input--medium el-input--suffix\" @click=\"openDespel\">\r\n                            <input type=\"text\" readonly=\"readonly\" autocomplete=\"off\" placeholder=\"指派人\"\r\n                                   class=\"el-input__inner\" v-model=\"checkInfo.designatedPersonName\">\r\n                            <span class=\"el-input__suffix\">\r\n                                <span class=\"el-input__suffix-inner\">\r\n                                    <i class=\"el-select__caret el-input__icon el-icon-arrow-up\"></i>\r\n                                </span>\r\n                            </span>\r\n                        </div>\r\n                        <div v-if=\"openDes\" class=\"el-select-dropdown el-popper\" style=\"min-width: 140px;\">\r\n                            <div class=\"el-scrollbar\" style=\"\">\r\n                                <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\"\r\n                                     style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                    <ul v-for=\"(item, index) in checkOperator\" class=\"el-scrollbar__view el-select-dropdown__list\">\r\n                                        <li class=\"el-select-dropdown__item\" @click=\"closeQuick(2,item,index)\">\r\n                                            <span>{{item.name}}</span>\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-vertical\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"el-select filter-item el-select--medium\" style=\"width: 100px;\">\r\n                        <div class=\"el-input el-input--medium el-input--suffix\" @click=\"openStatusList\">\r\n                            <input type=\"text\" readonly=\"readonly\" autocomplete=\"off\" placeholder=\"状态\"\r\n                                   class=\"el-input__inner\" v-model=\"checkInfo.statusInfo\">\r\n                            <span class=\"el-input__suffix\">\r\n                                <span class=\"el-input__suffix-inner\">\r\n                                    <i class=\"el-select__caret el-input__icon el-icon-arrow-up\"></i>\r\n                                </span>\r\n                            </span>\r\n                        </div>\r\n                        <div v-if=\"openStatus\" class=\"el-select-dropdown el-popper\" style=\"min-width: 140px;\">\r\n                            <div class=\"el-scrollbar\" style=\"\">\r\n                                <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\"\r\n                                     style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                    <ul v-for=\"(item, index) in checkStatus\" class=\"el-scrollbar__view el-select-dropdown__list\">\r\n                                        <li class=\"el-select-dropdown__item\" @click=\"closeQuick(4,item,index)\">\r\n                                            <span>{{item.develop_status}}</span>\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-vertical\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"el-select filter-item el-select--medium\" style=\"width: 100px;\">\r\n                        <div class=\"el-input el-input--medium el-input--suffix\" @click=\"openOperator\">\r\n                            <input type=\"text\" readonly=\"readonly\" autocomplete=\"off\" placeholder=\"操作人\"\r\n                                   class=\"el-input__inner\" v-model=\"checkInfo.operator\">\r\n                            <span class=\"el-input__suffix\">\r\n                                <span class=\"el-input__suffix-inner\">\r\n                                    <i class=\"el-select__caret el-input__icon el-icon-arrow-up\"></i>\r\n                                </span>\r\n                            </span>\r\n                        </div>\r\n                        <div v-if=\"openOper\" class=\"el-select-dropdown el-popper\" style=\"min-width: 140px;\">\r\n                            <div class=\"el-scrollbar\" style=\"\">\r\n                                <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\"\r\n                                     style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                    <ul v-for=\"(item, index) in checkOperator\" class=\"el-scrollbar__view el-select-dropdown__list\">\r\n                                        <li class=\"el-select-dropdown__item\" @click=\"closeQuick(3,item,index)\">\r\n                                            <span>{{item.name}}</span>\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-vertical\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"el-select filter-item el-select--medium\" style=\"width: 140px;\">\r\n                        <div class=\"el-input el-input--medium el-input--suffix\">\r\n                            <input type=\"text\" readonly=\"readonly\" autocomplete=\"off\" placeholder=\"预计时间(开始)\"\r\n                                   class=\"el-input__inner\" v-model=\"checkInfo.acceptancetimeStar\">\r\n                            <span class=\"el-input__suffix\">\r\n                                <span class=\"el-input__suffix-inner\">\r\n                                    <i class=\"el-select__caret el-input__icon el-icon-arrow-up\"></i>\r\n                                </span>\r\n                            </span>\r\n                            <bs-date-time-pickers type=\"text\" v-model=\"checkInfo.acceptancetimeStar\" ></bs-date-time-pickers>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"el-select filter-item el-select--medium\" style=\"width: 140px;\">\r\n                        <div class=\"el-input el-input--medium el-input--suffix\">\r\n                            <input type=\"text\" readonly=\"readonly\" autocomplete=\"off\" placeholder=\"预计时间(结束)\"\r\n                                   class=\"el-input__inner\" v-model=\"checkInfo.acceptancetimeEnd\">\r\n                            <span class=\"el-input__suffix\">\r\n                                <span class=\"el-input__suffix-inner\">\r\n                                    <i class=\"el-select__caret el-input__icon el-icon-arrow-up\"></i>\r\n                                </span>\r\n                            </span>\r\n                            <bs-date-time-pickers type=\"text\" v-model=\"checkInfo.acceptancetimeEnd\" ></bs-date-time-pickers>\r\n                        </div>\r\n                    </div>\r\n                    <button @click=\"clearTime\" type=\"button\" class=\"el-button filter-item el-button--success el-button--medium\">\r\n                        <span>清空时间</span>\r\n                    </button>\r\n                    <button @click=\"onCheck\" type=\"button\" class=\"el-button filter-item el-button--primary el-button--medium\">\r\n                        <i class=\"el-icon-search\"></i>\r\n                        <span>搜索</span>\r\n                    </button>\r\n                    <button @click=\"productNew\" type=\"button\" class=\"el-button filter-item el-button--primary el-button--medium\"\r\n                            style=\"margin-left: 10px;\">\r\n                        <i class=\"el-icon-edit\"></i>\r\n                        <span>创建任务</span>\r\n                    </button>\r\n                    <button @click=\"teamworksDelete\" type=\"button\" class=\"el-button filter-item el-button--danger el-button--medium\"\r\n                            style=\"margin-left: 10px;\">\r\n                        <i class=\"el-icon-delete\"></i>\r\n                        <span>批量删除</span>\r\n                    </button>\r\n                    <div class=\"el-select filter-item el-select--medium el-input--primary\" style=\"width: 130px;margin-left: 10px;\">\r\n                        <div class=\"el-dropdown\" @click=\"changeLookShow\">\r\n                            <button type=\"button\" class=\"el-button filter-item el-button--medium el-button--primary\" aria-haspopup=\"list\" aria-controls=\"dropdown-menu-8622\" role=\"button\" tabindex=\"0\">\r\n                                <span>{{lookConNow}}<i class=\"el-icon-arrow-down el-icon--right\"></i></span>\r\n                            </button>\r\n                        </div>\r\n                        <div class=\"el-select-dropdown el-popper\" style=\"min-width: 90px;\" v-if=\"lookShow\">\r\n                            <div class=\"el-scrollbar\" style=\"\">\r\n                                <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\"\r\n                                     style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                    <ul v-for=\"(item, index) in lookCon\" :key=\"index\" class=\"el-scrollbar__view el-select-dropdown__list\">\r\n                                        <li class=\"el-select-dropdown__item\" @click=\"chooseBtn(index)\">\r\n                                            <span>{{item}}</span>\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                </div>\r\n                                <div class=\"el-scrollbar__bar is-vertical\">\r\n                                    <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div v-if=\"isStatusBtnsShow\" class=\"filter-container\" style=\"margin-top: 10px;\">\r\n                    <block v-for=\"(item, index) in checkStatus\">\r\n                        <button @click=\"statusBtn(index,item.id)\" type=\"button\" :class=\"{'el-button--primary': btnStatus==index}\" class=\"el-button filter-item el-button--medium\"\r\n                                style=\"margin-bottom: 10px;\">\r\n                            <!--<i class=\"el-icon-setting\"></i>-->\r\n                            <span>{{item.develop_status}}</span>\r\n                            <span v-if=\"item.statusCount\">({{item.statusCount}})</span>\r\n                            <span v-else>(0)</span>\r\n                        </button>\r\n                    </block>\r\n                </div>\r\n                <div class=\"el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--medium\"\r\n                     style=\"width: 100%; margin-top: 20px; margin-bottom: 20px;\">\r\n                    <div class=\"hidden-columns\">\r\n                        <div></div>\r\n                        <div></div>\r\n                        <div></div>\r\n                        <div></div>\r\n                        <div></div>\r\n                        <div></div>\r\n                        <div></div>\r\n                        <div></div>\r\n                        <div></div>\r\n                        <div></div>\r\n                    </div>\r\n                    <div class=\"el-table__header-wrapper\">\r\n                        <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" class=\"el-table__header\"\r\n                               style=\"width: 100%;\">\r\n                            <colgroup>\r\n                                <col name=\"el-table_8_column_32\" width=\"3%\">\r\n                                <col name=\"el-table_8_column_33\" width=\"5%\">\r\n                                <col name=\"el-table_8_column_34\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_35\" width=\"15%\">\r\n                                <col name=\"el-table_8_column_36\" width=\"9%\">\r\n                                <col name=\"el-table_8_column_37\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_38\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_39\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_40\" width=\"9%\">\r\n                                <col name=\"el-table_8_column_41\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_42\" width=\"9%\">\r\n                                <!--<col name=\"gutter\" width=\"0\">-->\r\n                            </colgroup>\r\n                            <thead class=\"has-gutter\">\r\n                            <tr class=\"\">\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_32  is-center   is-leaf\">\r\n                                    <div class=\"cell\">\r\n                                        <span class=\"el-checkbox__input\" :class=\"{'is-checked': checkAll}\"  @click=\"handleCheckAllChange\">\r\n                                            <span class=\"el-checkbox__inner\"></span>\r\n                                            <input type=\"checkbox\" class=\"el-checkbox__original\" value=\"\">\r\n                                        </span>\r\n                                    </div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_33  is-center   is-leaf\">\r\n                                    <div class=\"cell\">ID</div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_34  is-center   is-leaf\">\r\n                                    <div class=\"cell\">紧急程度</div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_35  is-center  is-leaf\">\r\n                                    <div class=\"cell\">需求模块</div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_36  is-center   is-leaf\">\r\n                                    <div class=\"cell\">预计验收时间</div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_37  is-center  is-leaf\">\r\n                                    <div class=\"cell\">指派人</div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_38  is-center   is-leaf\">\r\n                                    <div class=\"cell\">状态</div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_39  is-center  is-leaf\">\r\n                                    <div class=\"cell\">提交人</div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_40  is-center is-leaf\">\r\n                                    <div class=\"cell\">提交时间</div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\" class=\"el-table_8_column_41   is-center  is-leaf\">\r\n                                    <div class=\"cell\">操作人</div>\r\n                                </th>\r\n                                <th colspan=\"1\" rowspan=\"1\"\r\n                                    class=\"el-table_8_column_42  is-center small-padding fixed-width  is-leaf\">\r\n                                    <div class=\"cell\">操作</div>\r\n                                </th>\r\n                                <th class=\"gutter\" style=\"width: 0px; display: none;\"></th>\r\n                            </tr>\r\n                            </thead>\r\n                        </table>\r\n                    </div>\r\n                    <div class=\"el-table__body-wrapper is-scrolling-none\">\r\n                        <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" class=\"el-table__body\" style=\"width: 100%;\">\r\n                            <colgroup>\r\n                                <col name=\"el-table_8_column_32\" width=\"3%\">\r\n                                <col name=\"el-table_8_column_33\" width=\"5%\">\r\n                                <col name=\"el-table_8_column_34\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_35\" width=\"15%\">\r\n                                <col name=\"el-table_8_column_36\" width=\"9%\">\r\n                                <col name=\"el-table_8_column_37\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_38\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_39\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_40\" width=\"9%\">\r\n                                <col name=\"el-table_8_column_41\" width=\"6%\">\r\n                                <col name=\"el-table_8_column_42\" width=\"9%\">\r\n                            </colgroup>\r\n                            <tbody>\r\n                            <tr class=\"el-table__row\" v-for=\"(item, index) in tableData.result\" :key=\"index\">\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_32 is-center \">\r\n                                    <div class=\"cell\">\r\n                                        <span class=\"el-checkbox__input ischecked\" :class=\"{'is-checked': item.checked}\"  @click=\"handleCheckedCitiesChange(item.id,index)\">\r\n                                            <span class=\"el-checkbox__inner\"></span>\r\n                                            <input type=\"checkbox\" class=\"el-checkbox__original\" value=\"\">\r\n                                        </span>\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_33 is-center \">\r\n                                    <div class=\"cell\">\r\n                                        <span>{{item.id}}</span>\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_34 is-center  status-col\">\r\n                                    <div class=\"cell\">\r\n                                        <span :class=\"{'el-button--danger': item.emergency==='十分紧急','el-button--warning': item.emergency==='紧急'}\" class=\"el-tag el-tag--medium\">{{item.emergency}}</span>\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_35\">\r\n                                    <div class=\"cell\">\r\n                                        <span class=\"link-type\">{{item.demand_name}}</span>\r\n                                        <!--<span class=\"el-tag el-tag--medium\">USA&lt;!&ndash;&ndash;&gt;</span>-->\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_36 is-center \">\r\n                                    <div class=\"cell\">\r\n                                        <span>{{item.acceptancetime}}</span>\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_37 is-center \">\r\n                                    <div class=\"cell\">\r\n                                        <span>{{item.designatedPerson}}</span>\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_38 is-center\">\r\n                                    <div class=\"cell\">\r\n                                        <span>{{item.status}}</span>\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_39 is-center \">\r\n                                    <div class=\"cell\">\r\n                                        <span class=\"link-type\">{{item.submitter}}</span>\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_40 is-center \">\r\n                                    <div class=\"cell\">\r\n                                        <span class=\"link-type\">{{item.submittime}}</span>\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\" class=\"el-table_8_column_41 is-center \">\r\n                                    <div class=\"cell\">\r\n                                        <span class=\"link-type\">{{item.operator_name}}</span>\r\n                                    </div>\r\n                                </td>\r\n                                <td rowspan=\"1\" colspan=\"1\"\r\n                                    class=\"el-table_8_column_42 is-center small-padding fixed-width\">\r\n                                    <div class=\"cell\">\r\n                                        <button type=\"button\" class=\"el-button el-button--primary el-button--mini\" @click=\"teamworkEdit(item.id)\">\r\n                                            <span>查看</span>\r\n                                        </button>\r\n                                        <button type=\"button\" class=\"el-button el-button--danger el-button--mini\" @click=\"teamworkDelete(index)\">\r\n                                            <span>删除</span>\r\n                                        </button>\r\n                                    </div>\r\n                                </td>\r\n                            </tr>\r\n                            </tbody>\r\n                        </table>\r\n                    </div>\r\n                    <div class=\"el-table__column-resize-proxy\" style=\"display: none;\"></div>\r\n                    <div class=\"el-loading-mask\" style=\"display: none;\">\r\n                        <div class=\"el-loading-spinner\">\r\n                            <svg viewBox=\"25 25 50 50\" class=\"circular\">\r\n                                <circle cx=\"50\" cy=\"50\" r=\"20\" fill=\"none\" class=\"path\"></circle>\r\n                            </svg>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"pagination-container\">\r\n                    <div class=\"el-pagination is-background\" style=\"\">\r\n                        <span class=\"el-pagination__total\">共 {{workNum}} 条</span>\r\n                        <span class=\"el-pagination__sizes\">\r\n                            <div class=\"el-select el-select--mini\">\r\n                                <div class=\"el-select-dropdown el-popper\" v-if=\"isPageShow\" style=\"min-width: 110px; transform-origin: center bottom 0px; z-index: 2017; position: absolute; bottom: 35px;\" x-placement=\"top-start\">\r\n                                    <div class=\"el-scrollbar\" style=\"\">\r\n                                        <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\" style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                            <ul class=\"el-scrollbar__view el-select-dropdown__list\"><!---->\r\n                                                <li @click=\"pageShow(10)\" class=\"el-select-dropdown__item\" :class=\"{selected: pageInfo.limit==10}\">\r\n                                                    <span>10条/页</span>\r\n                                                </li>\r\n                                                <li @click=\"pageShow(20)\" class=\"el-select-dropdown__item\" :class=\"{selected: pageInfo.limit==20}\">\r\n                                                    <span>20条/页</span>\r\n                                                </li>\r\n                                                <li @click=\"pageShow(30)\" class=\"el-select-dropdown__item\" :class=\"{selected: pageInfo.limit==30}\">\r\n                                                    <span>30条/页</span>\r\n                                                </li>\r\n                                                <li @click=\"pageShow(50)\" class=\"el-select-dropdown__item\" :class=\"{selected: pageInfo.limit==50}\">\r\n                                                    <span>50条/页</span>\r\n                                                </li>\r\n                                            </ul>\r\n                                        </div>\r\n                                        <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                        </div>\r\n                                        <div class=\"el-scrollbar__bar is-vertical\">\r\n                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                        </div>\r\n                                    </div><!---->\r\n                                    <div x-arrow=\"\" class=\"popper__arrow\" style=\"left: 35px;\"></div>\r\n                                </div>\r\n                                <div @click=\"changePageShow\" class=\"el-input el-input--mini el-input--suffix\"><!---->\r\n                                    <input type=\"text\"\r\n                                           readonly=\"readonly\"\r\n                                           autocomplete=\"off\"\r\n                                           class=\"el-input__inner\"\r\n                                           v-model=\"pageInfo.limit+'条/页'\">\r\n                                    <span class=\"el-input__suffix\">\r\n                                        <span class=\"el-input__suffix-inner\">\r\n                                            <i class=\"el-select__caret el-input__icon el-icon-arrow-up\"></i>\r\n                                        </span>\r\n                                    </span>\r\n                                </div>\r\n                            </div>\r\n                        </span>\r\n                        <button @click=\"prevPage\" type=\"button\" :disabled=\"thePage==1\" class=\"btn-prev\">\r\n                            <i class=\"el-icon el-icon-arrow-left\"></i>\r\n                        </button>\r\n                        <ul class=\"el-pager\" v-for=\"(item, index) in pageInfo.totalPage\" :key=\"index\">\r\n                            <li @click=\"toThePage(item)\" class=\"number\" :class=\"{active: item==thePage}\">{{item}}</li>\r\n                        </ul>\r\n                        <button @click=\"nextPage\" type=\"button\" :disabled=\"thePage==pageInfo.totalPage\" class=\"btn-next\">\r\n                            <i class=\"el-icon el-icon-arrow-right\"></i>\r\n                        </button>\r\n                        <span class=\"el-pagination__total\" style=\"margin-left: 15px;\">共 {{tableData.page.totalPages}} 页</span>\r\n                        <span class=\"el-pagination__sizes\" style=\"margin-left: 100px;\">\r\n                            <div class=\"el-select el-select--mini\">\r\n                                <div class=\"el-select-dropdown el-popper\" v-if=\"isCheckStatus\" style=\"min-width: 110px; transform-origin: center bottom 0px; z-index: 2017; position: absolute; bottom: 35px;\" x-placement=\"top-start\">\r\n                                    <div class=\"el-scrollbar\" style=\"\">\r\n                                        <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\" style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                            <ul v-for=\"(item, index) in checkStatus\" class=\"el-scrollbar__view el-select-dropdown__list\"><!---->\r\n                                                <li @click=\"takeStatus(item.id,item.develop_status,index)\" class=\"el-select-dropdown__item\" :class=\"{selected: updateId.status==item.id}\">\r\n                                                    <span>{{item.develop_status}}</span>\r\n                                                </li>\r\n                                            </ul>\r\n                                        </div>\r\n                                        <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                        </div>\r\n                                        <div class=\"el-scrollbar__bar is-vertical\">\r\n                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                        </div>\r\n                                    </div><!---->\r\n                                    <div x-arrow=\"\" class=\"popper__arrow\" style=\"left: 35px;\"></div>\r\n                                </div>\r\n                                <div @click=\"updateStatus\" class=\"el-input el-input--mini el-input--suffix\"><!---->\r\n                                    <input type=\"text\"\r\n                                           readonly=\"readonly\"\r\n                                           autocomplete=\"off\"\r\n                                           placeholder=\"状态\"\r\n                                           class=\"el-input__inner\"\r\n                                           v-model=\"updateId.statusInfo\">\r\n                                    <span class=\"el-input__suffix\">\r\n                                        <span class=\"el-input__suffix-inner\">\r\n                                            <i class=\"el-select__caret el-input__icon el-icon-arrow-up\"></i>\r\n                                        </span>\r\n                                    </span>\r\n                                </div>\r\n                            </div>\r\n                        </span>\r\n                        <span class=\"el-pagination__sizes\">\r\n                            <div class=\"el-select el-select--mini\">\r\n                                <div class=\"el-select-dropdown el-popper\" v-if=\"isCheckPerson\" style=\"min-width: 110px; transform-origin: center bottom 0px; z-index: 2017; position: absolute; bottom: 35px;\" x-placement=\"top-start\">\r\n                                    <div class=\"el-scrollbar\" style=\"\">\r\n                                        <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\" style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                            <ul v-for=\"(item, index) in checkOperator\" class=\"el-scrollbar__view el-select-dropdown__list\"><!---->\r\n                                                <li @click=\"takePerson(item.id,item.name,index)\" class=\"el-select-dropdown__item\" :class=\"{selected: updateId.designatedPerson==item.id}\">\r\n                                                    <span>{{item.name}}</span>\r\n                                                </li>\r\n                                            </ul>\r\n                                        </div>\r\n                                        <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                        </div>\r\n                                        <div class=\"el-scrollbar__bar is-vertical\">\r\n                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                        </div>\r\n                                    </div><!---->\r\n                                    <div x-arrow=\"\" class=\"popper__arrow\" style=\"left: 35px;\"></div>\r\n                                </div>\r\n                                <div @click=\"updatePerson\" class=\"el-input el-input--mini el-input--suffix\"><!---->\r\n                                    <input type=\"text\"\r\n                                           readonly=\"readonly\"\r\n                                           autocomplete=\"off\"\r\n                                           placeholder=\"指派人\"\r\n                                           class=\"el-input__inner\"\r\n                                           v-model=\"updateId.designatedPersonName\">\r\n                                    <span class=\"el-input__suffix\">\r\n                                        <span class=\"el-input__suffix-inner\">\r\n                                            <i class=\"el-select__caret el-input__icon el-icon-arrow-up\"></i>\r\n                                        </span>\r\n                                    </span>\r\n                                </div>\r\n                            </div>\r\n                        </span>\r\n                        <button style=\"background-color: #409EFF; color: #fff;\" @click=\"doUpdates\" type=\"button\" class=\"el-button filter-item el-button--primary el-button--medium\">\r\n                            <span>确认修改</span>\r\n                        </button>\r\n                        <button v-if=\"btnTheNumber==3\" style=\"background-color: #409EFF; color: #fff;\" @click=\"doCancelClosedThose\" type=\"button\" class=\"el-button filter-item el-button--primary el-button--medium\">\r\n                            <span>取消关闭</span>\r\n                        </button>\r\n                        <button v-else style=\"background-color: #409EFF; color: #fff;\" @click=\"doCloseThose\" type=\"button\" class=\"el-button filter-item el-button--primary el-button--medium\">\r\n                            <span>关 闭</span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n                <div v-if=\"editShow\" class=\"el-dialog__wrapper\" style=\"z-index: 2106;background: rgba(0,0,0,0.5);\">\r\n                <div class=\"el-dialog\" style=\"margin-top: 15vh; width:1000px;\">\r\n                    <div class=\"el-dialog__header\">\r\n                        <button v-if=\"btnStatus==0\" @click=\"btnEdit\" type=\"button\" class=\"el-button filter-item el-button--primary el-button--medium\"\r\n                                style=\"margin-bottom: 10px;\">\r\n                            <!--<i class=\"el-icon-setting\"></i>-->\r\n                            <span>编 辑</span>\r\n                        </button>\r\n                        <button v-else-if=\"btnStatus==1\" type=\"button\" class=\"el-button el-button--default el-button--medium\">\r\n                            <span>编 辑</span>\r\n                        </button>\r\n                        <button v-else-if=\"btnStatus==2\" type=\"button\" class=\"el-button el-button--default el-button--medium\">\r\n                            <span>新 建</span>\r\n                        </button>\r\n                    </div>\r\n                    <div class=\"el-dialog__body\" style=\"padding-top: 10px\">\r\n                        <form action=\"\" style=\"width:100%;\">\r\n                            <table border=\"1\" class=\"product\" style=\"border-right: 5px;border-collapse:collapse;\">\r\n                                <tr style=\"height: 30px;\">\r\n                                    <th width=\"10%\">ID</th>\r\n                                    <th width=\"10%\">\r\n                                        <input v-if=\"product.id\" type=\"text\" v-model=\"product.id\" readonly >\r\n                                        <input v-else type=\"text\" value=\"新建\" readonly >\r\n                                    </th>\r\n                                    <th width=\"10%\">提交人</th>\r\n                                    <th width=\"10%\">\r\n                                        <input v-if=\"isEdit\" type=\"text\" v-model=\"product.submitter\" >\r\n                                        <input v-else type=\"text\" v-model=\"product.submitter\" readonly >\r\n                                    </th>\r\n                                    <th width=\"10%\">状态</th>\r\n                                    <th width=\"30%\" @click=\"chooseStatus\">\r\n                                            <span  style=\"cursor: pointer; width: 100%; float: left;\">\r\n                                                <div class=\"el-select el-select--mini\">\r\n                                                    <div class=\"el-input el-input--mini el-input--suffix\" style=\"cursor: pointer\"><!---->\r\n                                                        <input type=\"text\" v-model=\"product.statusInfo\" readonly placeholder=\"请选择 >\" style=\"width: 100%;cursor: pointer;\">\r\n                                                    </div>\r\n                                                    <div class=\"el-select-dropdown el-popper\" v-if=\"isStatusShow\" style=\"min-width: 110px; transform-origin: center bottom 0px; z-index: 2017; position: absolute; bottom: -280px;\" x-placement=\"top-start\">\r\n                                                        <div class=\"el-scrollbar\" style=\"\">\r\n                                                            <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\" style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                                                <ul v-for=\"(item, index) in statusList\" :key=\"index\" class=\"el-scrollbar__view el-select-dropdown__list\"><!---->\r\n                                                                    <li @click.stop=\"statusShow(item.id,item.develop_status)\" class=\"el-select-dropdown__item\" :class=\"{selected: product.status&&product.status==item.id}\">\r\n                                                                        <span>{{item.develop_status}}</span>\r\n                                                                    </li>\r\n                                                                </ul>\r\n                                                            </div>\r\n                                                            <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                                                <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                                            </div>\r\n                                                            <div class=\"el-scrollbar__bar is-vertical\">\r\n                                                                <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                                            </div>\r\n                                                        </div><!---->\r\n                                                        <div x-arrow=\"\" class=\"popper__arrow\" style=\"left: 35px;\"></div>\r\n                                                    </div>\r\n                                                </div>\r\n                                            </span>\r\n                                    </th>\r\n                                </tr>\r\n                                <tr style=\"height: 30px;\">\r\n                                    <th>需求名称</th>\r\n                                    <th  colspan=\"5\">\r\n                                        <input v-if=\"isEdit\" type=\"text\" v-model=\"product.demand_name\" >\r\n                                        <input v-else type=\"text\" v-model=\"product.demand_name\" readonly >\r\n                                    </th>\r\n                                </tr>\r\n                                <tr style=\"height: 120px;\">\r\n                                    <th>需求描述</th>\r\n                                    <th  colspan=\"5\">\r\n                                        <textarea v-if=\"isEdit\" name=\"\" cols=\"30\" rows=\"10\" v-model=\"product.describe\" ></textarea>\r\n                                        <textarea v-else name=\"\" cols=\"30\" rows=\"10\" v-model=\"product.describe\" readonly ></textarea>\r\n                                    </th>\r\n                                </tr>\r\n                                <tr style=\"height: 30px;\">\r\n                                    <th>附件</th>\r\n                                    <th colspan=\"5\" style=\"position: relative; cursor: pointer;\">\r\n                                        <div v-if=\"isEdit&&product.file[0]&&product.file[0]!=''\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%; line-height: 30px;\">{{filesNumber}}个文件</div>\r\n                                        <div @click=\"takeFiles\" v-else-if=\"isEdit&&product.file[0]==''||isEdit&&!product.file[0]\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%; line-height: 30px;\">请选择文件</div>\r\n                                        <div v-else-if=\"!isEdit&&product.file[0]&&product.file[0]!=''\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%; line-height: 30px;\">{{filesNumber}}个文件</div>\r\n                                        <div v-else-if=\"!isEdit&&product.file[0]==''||!isEdit&&!product.file[0]\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%; line-height: 30px;\">没有上传文件</div>\r\n                                    </th>\r\n                                </tr>\r\n                                <tr style=\"height: 30px;\">\r\n                                    <th>指派人</th>\r\n                                    <th>\r\n                                        <span class=\"el-pagination__sizes\" style=\"cursor: pointer\">\r\n                                            <div class=\"el-select el-select--mini\">\r\n                                                <div class=\"el-select-dropdown el-popper\" v-if=\"isPersonShow\" style=\"min-width: 110px; transform-origin: center bottom 0px; z-index: 2017; position: absolute; bottom: 35px;\" x-placement=\"top-start\">\r\n                                                    <div class=\"el-scrollbar\" style=\"\">\r\n                                                        <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\" style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                                            <ul v-for=\"(item, index) in operatorList\" :key=\"index\" class=\"el-scrollbar__view el-select-dropdown__list\"><!---->\r\n                                                                <li @click=\"personShow(item.id,item.name)\" class=\"el-select-dropdown__item\" :class=\"{selected: product.designatedPerson&&product.designatedPerson==item.id}\">\r\n                                                                    <span>{{item.name}}</span>\r\n                                                                </li>\r\n                                                            </ul>\r\n                                                        </div>\r\n                                                        <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                                        </div>\r\n                                                        <div class=\"el-scrollbar__bar is-vertical\">\r\n                                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                                        </div>\r\n                                                    </div><!---->\r\n                                                    <div x-arrow=\"\" class=\"popper__arrow\" style=\"left: 35px;\"></div>\r\n                                                </div>\r\n                                                <div @click=\"choosePerson\" class=\"el-input el-input--mini el-input--suffix\" style=\"cursor: pointer\"><!---->\r\n                                                    <input type=\"text\" v-model=\"product.designatedPersonName\" readonly placeholder=\"请选择 >\" style=\"cursor: pointer;\">\r\n                                                </div>\r\n                                            </div>\r\n                                        </span>\r\n                                    </th>\r\n                                    <th>优先级</th>\r\n                                    <th>\r\n                                        <span class=\"el-pagination__sizes\" style=\"cursor: pointer\">\r\n                                            <div class=\"el-select el-select--mini\">\r\n                                                <div class=\"el-select-dropdown el-popper\" v-if=\"isEmergencyShow\" style=\"min-width: 110px; transform-origin: center bottom 0px; z-index: 2017; position: absolute; bottom: 35px;\" x-placement=\"top-start\">\r\n                                                    <div class=\"el-scrollbar\" style=\"\">\r\n                                                        <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\" style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                                            <ul v-for=\"(item, index) in emergencyList\" :key=\"index\" class=\"el-scrollbar__view el-select-dropdown__list\"><!---->\r\n                                                                <li @click=\"emergencyShow(item)\" class=\"el-select-dropdown__item\" :class=\"{selected: product.emergency&&product.emergency==item}\">\r\n                                                                    <span>{{item}}</span>\r\n                                                                </li>\r\n                                                            </ul>\r\n                                                        </div>\r\n                                                        <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                                        </div>\r\n                                                        <div class=\"el-scrollbar__bar is-vertical\">\r\n                                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                                        </div>\r\n                                                    </div><!---->\r\n                                                    <div x-arrow=\"\" class=\"popper__arrow\" style=\"left: 35px;\"></div>\r\n                                                </div>\r\n                                                <div @click=\"chooseEmergency\" class=\"el-input el-input--mini el-input--suffix\" style=\"cursor: pointer\"><!---->\r\n                                                    <input type=\"text\" v-model=\"product.emergency\" readonly placeholder=\"请选择 >\" style=\"cursor: pointer;\">\r\n                                                </div>\r\n                                            </div>\r\n                                        </span>\r\n                                    </th>\r\n                                    <!--<th>-->\r\n                                    <!--<input v-if=\"isEdit\" type=\"text\" v-model=\"product.emergency\" >-->\r\n                                    <!--<input v-else type=\"text\" v-model=\"product.emergency\" readonly >-->\r\n                                    <!--</th>-->\r\n                                    <th>预计验收时间</th>\r\n                                    <th style=\"position: relative;\">\r\n                                        <bs-date-time-picker v-if=\"isEdit\" type=\"text\" v-model=\"product.acceptancetime\" ></bs-date-time-picker>\r\n                                        <bs-date-time-picker v-else type=\"text\" v-model=\"product.acceptancetime\" readonly ></bs-date-time-picker>\r\n                                    </th>\r\n                                </tr>\r\n                                <tr style=\"height: 30px;\">\r\n                                    <th>提交时间</th>\r\n                                    <th colspan=\"2\">\r\n                                        <!--<input v-if=\"isEdit\" type=\"text\" v-model=\"product.submitDate\" >-->\r\n                                        <input v-if=\"product.submittime\" :value=\"product.submittime||'请提交'\" readonly>\r\n                                        <input v-else value=\"请提交\" readonly>\r\n                                        <!--<input v-else type=\"text\" v-model=\"product.submitDate\" readonly >-->\r\n                                    </th>\r\n                                    <th>操作人</th>\r\n                                    <th colspan=\"2\" @click=\"chooseOperator\">\r\n                                        <span  style=\"cursor: pointer; width: 100%; float: left;\">\r\n                                            <div class=\"el-select el-select--mini\">\r\n                                                <div class=\"el-select-dropdown el-popper\" v-show=\"isOperatorShow\" style=\"min-width: 110px; transform-origin: center bottom 0px; z-index: 2017; position: absolute; bottom: 35px;\" x-placement=\"top-start\">\r\n                                                    <div class=\"el-scrollbar\" style=\"\">\r\n                                                        <div class=\"el-select-dropdown__wrap el-scrollbar__wrap\" style=\"margin-bottom: -17px; margin-right: -17px;\">\r\n                                                            <ul v-for=\"(item, index) in operatorList\" :key=\"index\" class=\"el-scrollbar__view el-select-dropdown__list\"><!---->\r\n                                                                <li @click.stop=\"operatorShow(item.id,item.name)\" class=\"el-select-dropdown__item\" :class=\"{selected: product.operator_name&&product.operator_name==item.id}\">\r\n                                                                    <span>{{item.name}}</span>\r\n                                                                </li>\r\n                                                            </ul>\r\n                                                        </div>\r\n                                                        <div class=\"el-scrollbar__bar is-horizontal\">\r\n                                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateX(0%);\"></div>\r\n                                                        </div>\r\n                                                        <div class=\"el-scrollbar__bar is-vertical\">\r\n                                                            <div class=\"el-scrollbar__thumb\" style=\"transform: translateY(0%);\"></div>\r\n                                                        </div>\r\n                                                    </div><!---->\r\n                                                    <div x-arrow=\"\" class=\"popper__arrow\" style=\"left: 35px;\"></div>\r\n                                                </div>\r\n                                                <div class=\"el-input el-input--mini el-input--suffix\" style=\"cursor: pointer\"><!---->\r\n                                                    <input type=\"text\" v-model=\"product.operator\" readonly placeholder=\"请选择 >\" style=\"width: 100%;cursor: pointer;\">\r\n                                                </div>\r\n                                            </div>\r\n                                        </span>\r\n                                    </th>\r\n                                </tr>\r\n                            </table>\r\n                        </form>\r\n                    </div>\r\n                    <div class=\"el-dialog__footer\">\r\n                        <div v-if=\"isEdit\" class=\"dialog-footer\">\r\n                            <button v-if=\"product.file.length>0\" @click=\"takeFiles\" type=\"button\" class=\"el-button el-button--success el-button--medium\">\r\n                                <span>查看文件</span>\r\n                            </button>\r\n                            <button @click=\"closeInfo\" type=\"button\" class=\"el-button el-button--default el-button--medium\">\r\n                                <span>取 消</span>\r\n                            </button>\r\n                            <button @click=\"doEdit\" type=\"button\" class=\"el-button el-button--primary el-button--medium\">\r\n                                <span>确 定</span>\r\n                            </button>\r\n                        </div>\r\n                        <div v-else class=\"dialog-footer\"><!--@click=\"downloadInfo(product.id)\"-->\r\n                            <button v-if=\"product.file[0]&&product.file[0]!=''\" @click=\"takeFiles\" type=\"button\" class=\"el-button el-button--success el-button--medium\">\r\n                                <span>查看文件</span>\r\n                            </button>\r\n                            <button @click=\"closeInfo\" type=\"button\" class=\"el-button el-button--primary el-button--medium\">\r\n                                <span>关 闭</span>\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n                <div v-if=\"filesOpen\" class=\"el-dialog__wrapper\" style=\"z-index: 2206;background: rgba(0,0,0,0.5);\">\r\n                    <div class=\"el-dialog\" style=\"margin-top: 15vh; width:500px;\">\r\n                        <div class=\"el-dialog__header\" id=\"filesShow\" v-if=\"isEdit&&product.file[0]!=''\">\r\n                            <div style=\"width: 100%;height: 30px;float: left; margin-bottom: 20px;\" v-for=\"(item, index) in products.oldName\" :key=\"index\">\r\n                                <span style=\"float: left; line-height: 30px;\">文件{{index+1}}：</span>\r\n                                <div style=\"float: left;border-radius: 5px; width: 350px; height: 30px; border: 1px solid #ddd;position: relative;\">\r\n                                    <div style=\"width: 100%; height: 100%; padding: 5px;overflow: hidden\">{{ item=='' ? '请选择文件': item}}</div>\r\n                                    <input name=\"image\" type=\"file\" value=\"\" @change=\"preview(index)\" class=\"giveFile getImgUrl_file\" style=\"opacity: 0; cursor: pointer;position: absolute; width: 100%;height: 100%; top: 0;left: 0;\" >\r\n                                </div>\r\n                                <div v-if=\"index==0\" @click=\"filesShow(isIndex)\" style=\"cursor: pointer; width: 16px; height: 16px; float: right; margin: 7px 20px 7px 0; position: relative; background-image: url('/Application/View/View/web/teamwork/teamwork/image/add.png');background-repeat: no-repeat; background-size: cover;\"></div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"el-dialog__header\" id=\"filesShow\" v-else-if=\"isEdit&&product.file[0]==''\">\r\n                            <div style=\"width: 100%;height: 30px;float: left; margin-bottom: 20px;\" v-for=\"(item, index) in products.oldName\" :key=\"index\">\r\n                                <span style=\"float: left; line-height: 30px;\">文件{{index+1}}：</span>\r\n                                <div style=\"float: left;border-radius: 5px; width: 350px; height: 30px; border: 1px solid #ddd;position: relative;\">\r\n                                    <div style=\"width: 100%; height: 100%; padding: 5px;overflow: hidden\">{{ item=='' ? '请选择文件': item}}</div>\r\n                                    <input name=\"image\" type=\"file\" value=\"\" @change=\"preview(index)\" class=\"giveFile getImgUrl_file\" style=\"opacity: 0; cursor: pointer;position: absolute; width: 100%;height: 100%; top: 0;left: 0;\" >\r\n                                </div>\r\n                                <div v-if=\"index==0\" @click=\"filesShow(isIndex)\" style=\"cursor: pointer; width: 16px; height: 16px; float: right; margin: 7px 20px 7px 0; position: relative; background-image: url('/Application/View/View/web/teamwork/teamwork/image/add.png');background-repeat: no-repeat; background-size: cover;\"></div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"el-dialog__header\" id=\"filesShow\" v-else-if=\"!isEdit&&product.file[0]!=''\">\r\n                            <div style=\"width: 100%;height: 30px;float: left; margin-bottom: 20px;\" v-for=\"(item, index) in products.oldName\" :key=\"index\">\r\n                                <span style=\"float: left; line-height: 30px;\">文件{{index+1}}：</span>\r\n                                <div style=\"float: left;border-radius: 5px; width: 350px; height: 30px; border: 1px solid #ddd;position: relative;\">\r\n                                    <div style=\"width: 100%; height: 100%; padding: 5px;overflow: hidden\">{{ item=='' ? '请选择文件': item}}</div>\r\n                                    <input name=\"image\" type=\"file\" value=\"\" @change=\"preview(index)\" class=\"giveFile getImgUrl_file\" style=\"opacity: 0; cursor: pointer;position: absolute; width: 100%;height: 100%; top: 0;left: 0;\" >\r\n                                </div>\r\n                                <button @click=\"downloadInfo(product.id,index)\" style=\"float: right;width: 40px;height: 30px;line-height: 30px;text-align: center;font-size: 8px;padding: 0;border-radius: 5px;\" type=\"button\" class=\"el-button el-button--primary\">\r\n                                    <span>查看</span>\r\n                                </button>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"el-dialog__footer\" style=\"margin-top: 20px;\">\r\n                            <div class=\"dialog-footer\">\r\n                                <button @click=\"closeFiles\" type=\"button\" class=\"el-button el-button--primary el-button--medium\">\r\n                                    <span>确定</span>\r\n                                </button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div v-if=\"deleteShow\" class=\"el-dialog__wrapper\" style=\" z-index: 2106;background: rgba(0,0,0,0.5);\">\r\n                    <div class=\"el-dialog\" style=\"border-radius: 5px;margin-top: 15vh; width:250px; height: 150px; position: relative;\">\r\n                        <div style=\"width: 100%; height: 100px; text-align: center; line-height: 110px; font-size: 20px;\">是否确认删除</div>\r\n                        <div style=\"width: 100%; height: 100%;\">\r\n                            <button @click=\"doDelete\" type=\"button\" class=\"el-button filter-item el-button--primary el-button--medium\"\r\n                                    style=\"width: 50%; position: absolute; bottom: 0;left: 0; border-radius: 0 0 0 5px\">\r\n                                <!--<i class=\"el-icon-setting\"></i>-->\r\n                                <span>确 定</span>\r\n                            </button>\r\n                            <button @click=\"closeDelete\" type=\"button\" class=\"el-button filter-item el-button--default el-button--medium\"\r\n                                    style=\"width: 50%; position: absolute; bottom: 0;right: 0;border-radius: 0 0 5px 0\">\r\n                                <!--<i class=\"el-icon-setting\"></i>-->\r\n                                <span>取 消</span>\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </section>\r\n    </div>\r\n</div>"

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(0),
    __webpack_require__(2),
    __webpack_require__(6)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
    $,
    moment
){
    var TimeFormat = 'YYYY-MM-DD';

    return {
        template: '<input type="text" class="form-control"/>',
        props: {
            value: {
                type: String
            },
            onChange:{type: Function}
        },
        watch: {
            value: function(newValue){
                $(this.$el).data('DateTimePicker').date(newValue);
                $(this.$el).val(newValue)
            }
        },
        mounted: function(){
            var _this = this;
            var defaultDate = this.value;
            if (defaultDate == undefined){
                defaultDate = moment();
                this.$emit('input', defaultDate.format(TimeFormat));
            }
            $(this.$el).datetimepicker({
                format: TimeFormat,
                defaultDate: defaultDate
            }).on('dp.change', function(e){
                _this.$emit('input', e.date.format(TimeFormat));
                if(_this.onChange)
                    _this.onChange(e.date.format(TimeFormat))
            });
        }
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(0),
    __webpack_require__(2),
    __webpack_require__(6)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
    $,
    moment
){
    var TimeFormat = 'YYYY-MM-DD';

    return {
        template: '<input type="text" class="form-control" style="width: 100%; height: 100%; position: absolute; top: 0;left: 0; opacity: 0;"/>',
        props: {
            value: {
                type: String
            },
            onChange:{type: Function}
        },
        watch: {
            value: function(newValue){
                $(this.$el).data('DateTimePicker').date(newValue);
                $(this.$el).val(newValue)
            }
        },
        mounted: function(){
            var _this = this;
            var defaultDate = this.value;
            if (defaultDate == undefined){
                defaultDate = moment();
                this.$emit('input', defaultDate.format(TimeFormat));
            }
            $(this.$el).datetimepicker({
                format: TimeFormat,
                defaultDate: defaultDate
            }).on('dp.change', function(e){
                _this.$emit('input', e.date.format(TimeFormat));
                if(_this.onChange)
                    _this.onChange(e.date.format(TimeFormat))
            });
        }
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 22 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(24);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../achive-build/node_modules/style-loader/index.js!../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./bootstrap-datetimepicker.min.css", function() {
		var newContent = require("!!../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../achive-build/node_modules/style-loader/index.js!../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./bootstrap-datetimepicker.min.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(26);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../achive-build/node_modules/style-loader/index.js!../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./font-awesome.min.css", function() {
		var newContent = require("!!../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../achive-build/node_modules/style-loader/index.js!../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./font-awesome.min.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(28);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../../achive-build/node_modules/style-loader/index.js!../../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./teamwork-list.css", function() {
		var newContent = require("!!../../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../../achive-build/node_modules/style-loader/index.js!../../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./teamwork-list.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 28 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(30);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../achive-build/node_modules/style-loader/index.js!../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./index.css", function() {
		var newContent = require("!!../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../achive-build/node_modules/style-loader/index.js!../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./index.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(32);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../achive-build/node_modules/style-loader/index.js!../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./teamwork.css", function() {
		var newContent = require("!!../../../../achive-build/node_modules/extract-text-webpack-plugin/dist/loader.js??ref--0-0!../../../../achive-build/node_modules/style-loader/index.js!../../../../achive-build/node_modules/css-loader/index.js??ref--0-2!./teamwork.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 32 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=teamwork.js.map?a1690e2a