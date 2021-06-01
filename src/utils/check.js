const isValue = v => v || v === 0;
const isFunction = v => typeof v === 'function';
const isString = v => typeof v === 'string';
const isNumber = v => typeof v === 'number';
const isUndefined = v => typeof v === 'undefined';
const isDefined = v => typeof v !== 'undefined';
const isBoolean = v => typeof v === 'boolean';
const ceil10 = v => Math.ceil(v / 10) * 10;
const asHalfPixel = n => Math.ceil(n) + 0.5;
const diffDomain = d => d[1] - d[0];
const isObjectType = v => typeof v === 'object';
const isEmpty = o => (
  isUndefined(o) || o === null || (isString(o) && o.length === 0) || (isObjectType(o) && Object.keys(o).length === 0)
);
const notEmpty = o => !isEmpty(o);

/**
 * Check if is array
 * @param {Array} arr
 * @returns {Boolean}
 * @private
 */
const isArray = arr => arr && arr.constructor === Array;

/**
 * Check if is object
 * @param {Object} obj
 * @returns {Boolean}
 * @private
 */
const isObject = obj => obj && !obj.nodeType && isObjectType(obj) && !isArray(obj);

const getOption = (options, key, defaultValue) => (
  isDefined(options[key]) ? options[key] : defaultValue
);

const hasValue = (dict, value) => {
  let found = false;

  Object.keys(dict).forEach(key => (dict[key] === value) && (found = true));

  return found;
};

const hasKey = (dict, key) => {
  let found = false;

  (dict.hasOwnProperty(key)) && (found = true);

  return found;
};

const inArray = (array, val) => {
  let found = false;

  (isArray(array) && array.indexOf(val) !== -1) && (found = true);

  return found;
};

/**
 * Call function with arguments
 * @param {Function} fn Function to be called
 * @param {*} args Arguments
 * @return {Boolean} true: fn is function, false: fn is not function
 * @private
 */
const callFn = (fn, ...args) => {
  const isFn = isFunction(fn);

  isFn && fn.call(...args);
  return isFn;
};

/**
 * Replace tag sign to html entity
 * @param {String} str
 * @return {String}
 * @private
 */
const sanitise = str => (isString(str) ? str.replace(/</g, '&lt;').replace(/>/g, '&gt;') : str);

const extend = (target = {}, source) => {
  for (const p in source) {
    target[p] = source[p];
  }

  return target;
};

/**
 * Return first letter capitalized
 * @param {String} str
 * @return {String} capitalized string
 * @private
 */
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Merge object returning new object
 * @param {Object} target
 * @param {Object} objectN
 * @returns {Object} merged target object
 * @private
 * @example
 *  var target = { a: 1 };
 *  utils.extend(target, { b: 2, c: 3 });
 *  target;  // { a: 1, b: 2, c: 3 };
 */
const merge = (target, ...objectN) => {
  if (!objectN.length || (objectN.length === 1 && !objectN[0])) {
    return target;
  }

  const source = objectN.shift();

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const value = source[key];

      if (isObject(value)) {
        !target[key] && (target[key] = {});

        target[key] = merge(target[key], value);
      } else {
        target[key] = isArray(value)
          ? value.concat() : value;
      }
    });
  }

  return extend(target, ...objectN);
};

/**
 * Convert to array
 * @param {Object} v
 * @returns {Array}
 * @private
 */
const toArray = v => [].slice.call(v);

/**
 * Get css rules for specified stylesheets
 * @param {Array} styleSheets The stylesheets to get the rules from
 * @returns {Array}
 * @private
 */
const getCssRules = styleSheets => {
  let rules = [];

  styleSheets.forEach(sheet => {
    try {
      if (sheet.cssRules && sheet.cssRules.length) {
        rules = rules.concat(toArray(sheet.cssRules));
      }
    } catch (e) {
      console.error(`Error while reading rules from ${sheet.href}: ${e.toString()}`);
    }
  });

  return rules;
};

const dcDeepClone = (item) => {
  if (!item) { return item; } // null, undefined values check

  let types = [Number, String, Boolean];
  let result;

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item);
    }
  });

  if (typeof result === 'undefined') {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = [];
      item.forEach(function (child, index, array) {
        result[index] = dcDeepClone(child);
      });
    } else if (isObjectType(item)) {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode === 'function') {
        result = item.cloneNode(true);
      } else if (!item.prototype) { // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          // it is an object literal
          result = {};
          for (var i in item) {
            result[i] = dcDeepClone(item[i]);
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        // eslint-disable-next-line no-constant-condition
        if (false && item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor();
        } else {
          result = item;
        }
      }
    } else {
      result = item;
    }
  }
  return result;
};

const browserIsIE = () => { // ie?
  return (!!window.ActiveXObject || 'ActiveXObject' in window);
};

const getTextSize = (fontSize, text) => {
  let span = document.createElement('span');
  let result = {};
  result.width = span.offsetWidth;
  result.height = span.offsetHeight;
  span.style.visibility = 'hidden';
  span.style.fontSize = fontSize;
  // span.style.fontFamily = fontFamily;
  span.style.display = 'inline-block';
  document.body.appendChild(span);
  if (typeof span.textContent !== 'undefined') {
    span.textContent = text;
  } else {
    span.innerText = text;
  }
  result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
  result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
  document.body.removeChild(span);
  return result;
};

const isInteger = (val) => {
  let func = Number.isInteger || function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };

  return func(val);
};

const getQueryVariable = function (variable) {
  var curLocation = window.location.href;
  var queryIndex = curLocation.indexOf('?');
  var query = curLocation.slice(queryIndex + 1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return (false);
};

export {
  asHalfPixel,
  callFn,
  capitalize,
  ceil10,
  diffDomain,
  extend,
  getCssRules,
  getOption,
  hasValue,
  isArray,
  isBoolean,
  isDefined,
  isEmpty,
  isFunction,
  isNumber,
  isObject,
  isObjectType,
  isString,
  isUndefined,
  isValue,
  notEmpty,
  merge,
  sanitise,
  toArray,
  hasKey,
  inArray,
  dcDeepClone,
  browserIsIE,
  getTextSize,
  isInteger,
  getQueryVariable
};
