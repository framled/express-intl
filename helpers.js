/**
 * @created_at 06-08-17.
 * @author Felipe Narváez <fn.narvaezmichea@gmail.com>
 */

const IntlMessageFormat = require('intl-messageformat');
const IntlRelativeFormat = require('intl-relativeformat');
const createFormatCache = require('intl-format-cache');
const path = require('path');
const {extend} = require(path.join(__dirname, 'utils'));

module.exports.registerHelpers = registerHelpers;

// -----------------------------------------------------------------------------

let getNumberFormat = createFormatCache(Intl.NumberFormat);
let getDateTimeFormat = createFormatCache(Intl.DateTimeFormat);
let getMessageFormat = createFormatCache(IntlMessageFormat);
let getRelativeFormat = createFormatCache(IntlRelativeFormat);


function registerHelpers (options) {
  let baseData = extend({}, options);

  let helpers = {
    get: intlGet,
    formatDate: formatDate,
    formatTime: formatTime,
    formatRelative: formatRelative,
    formatNumber: formatNumber,
    formatMessage: formatMessage,
  };
  return extend({}, baseData, helpers);

  // -- Helpers --------------------------------------------------------------

  function intlGet (path, options) {
    let intlData = (options && options.intl) || baseData;

    // Use the path to walk the Intl data to find the object at the given
    // path, and throw a descriptive error if it's not found.
    let obj = getPropertyByPath(intlData.messages[intlData.currentLocale], path);
    if (obj === undefined) {
      console.error('Could not find Intl object:', path);
      return '[' + path + ']';
    }

    return formatMessage(obj, options);
  }

  function formatDate (date, format, options) {
    date = new Date(date);
    assertIsDate(date, 'A date or timestamp must be provided to {{formatDate}}');

    if (!options && typeof format === 'object') {
      options = format;
      format = null;
    }

    let locales = (options && options.locales) || baseData.locales;
    let formatOptions = getFormatOptions('date', format, options);

    return getDateTimeFormat(locales, formatOptions).format(date);
  }

  function formatTime (date, format, options) {
    date = new Date(date);
    assertIsDate(date, 'A date or timestamp must be provided to {{formatTime}}');

    if (!options && typeof format === 'object') {
      options = format;
      format = null;
    }

    let locales = (options && options.locales) || baseData.locales;
    let formatOptions = getFormatOptions('time', format, options);

    return getDateTimeFormat(locales, formatOptions).format(date);
  }

  function formatRelative (date, format, options) {
    date = new Date(date);
    assertIsDate(date, 'A date or timestamp must be provided to {{formatRelative}}');

    if (!options && typeof format === 'object') {
      options = format;
      format = null;
    }

    let locales = (options && options.locales) || baseData.locales;
    let formatOptions = getFormatOptions('relative', format, options);
    let now = (options && options.now) || Date.now();

    // Remove `now` from the options passed to the `IntlRelativeFormat`
    // constructor, because it's only used when calling `format()`.
    formatOptions.now = undefined;

    return getRelativeFormat(locales, formatOptions).format(date, {
      now: now
    });
  }

  function formatNumber (num, format, options) {
    assertIsNumber(num, 'A number must be provided to {{formatNumber}}');

    if (!options && typeof format === 'object') {
      options = format;
      format = null;
    }

    let locales = (options && options.locales) || baseData.locales;
    let formatOptions = getFormatOptions('number', format, options);

    return getNumberFormat(locales, formatOptions).format(num);
  }

  function formatMessage (message, options) {
    if (!(message || typeof message === 'string')) {
      throw new ReferenceError('{{formatMessage}} must be provided a message');
    }

    let intlData = (options && options.intl) || baseData,
      locales = intlData.locales,
      formats = intlData.formats;

    // When `message` is a function, assume it's an IntlMessageFormat
    // instance's `format()` method passed by reference, and call it. This
    // is possible because its `this` will be pre-bound to the instance.
    if (typeof message === 'function') {
      return message(options);
    }

    if (typeof message === 'string') {
      message = getMessageFormat(message, locales, formats);
    }

    return message.format(options);
  }

  // -- Utilities ------------------------------------------------------------

  function assertIsDate (date, errMsg) {
    // Determine if the `date` is valid by checking if it is finite, which
    // is the same way that `Intl.DateTimeFormat#format()` checks.
    if (!isFinite(date)) {
      throw new TypeError(errMsg);
    }
  }

  function assertIsNumber (num, errMsg) {
    if (typeof num !== 'number') {
      throw new TypeError(errMsg);
    }
  }

  function getFormatOptions (type, format, options) {
    let formatOptions, path;

    if (format) {
      if (typeof format === 'string') {
        path = 'formats.' + type + '.' + format;
        formatOptions = getPropertyByPath(options, path) || getPropertyByPath(baseData, path);
        if (!formatOptions) {
          formatOptions = {
            style: format
          };
        }
      }
    }
    formatOptions = extend({}, formatOptions, options);

    return formatOptions;
  }

  function getPropertyByPath (object, path) {
    if (!path || !object) {
      return undefined;
    }
    // Use the path to walk the object at the given
    // path, and return undefined if it's not found
    let result, i, len;
    let obj = object;
    let pathParts = path.split('.');
    try {
      for (i = 0, len = pathParts.length; i < len; i++) {
        result = obj = obj[pathParts[i]];
      }
    } catch (e) {
      // do nothing, just return undefined
    }
    return result;
  }

}
