/**
 * @created_at 06-08-17.
 * @author Felipe Narváez <fn.narvaezmichea@gmail.com>
 */

const path = require('path');

/**
 * Expose the middleware.
 */

exports = module.exports = intl;

/**
 * Expose the settings
 */
exports.configure = configure;

/**
 * Setup session store with the given `options`.
 *
 * @param {Object} [options]
 */
function intl (options) {
  const {extend} = require(path.join(__dirname, 'utils'));
  const {registerHelpers} = require(path.join(__dirname, 'helpers'));
  let defaults = {
    defaultLocale: 'es',
    formats: {},
    messages: {},
  };
  let intl = extend({}, defaults, options);
  // the actual express middleware function
  return function (req, res, next) {
    // first calculate the correct currentLocale for the request from the list of available locales
    intl.currentLocale = req.acceptsLanguages(options.availableLocales) || defaults.defaultLocale;
    if (Array.isArray(intl.currentLocale)) {
      intl.currentLocale = intl.currentLocale[0] || defaults.defaultLocale;
    }
    if (req.user) {
      req.user.getLanguage().then(lang => {
        intl.currentLocale = lang.code || defaults.defaultLocale;
        res.locals.intl = registerHelpers(intl);
        next();
      }).error(() => {
        res.locals.intl = registerHelpers(intl);
        next();
      });
    } else {
      res.locals.intl = registerHelpers(intl);
      next();
    }
  };
}

/**
 * Setup session store with the given `options`.
 *
 * @param {Array} [availableLocales]
 */
function configure (availableLocales) {
  const areIntlLocalesSupported = require('intl-locales-supported');
  if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!intlLocalesSupported(availableLocales)) {
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and replace the constructors with need with the polyfill's.
      require('intl');
      Intl.NumberFormat   = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl');
    Intl.NumberFormat   = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  }
}
