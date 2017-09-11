/**
 * @created_at 06-08-17.
 * @author Felipe Narváez <fn.narvaezmichea@gmail.com>
 */

module.exports.extend = function (obj) {
  let sources = Array.prototype.slice.call(arguments, 1),
    i, len, source, key;

  for (i = 0, len = sources.length; i < len; i += 1) {
    source = sources[i];
    if (!source) {
      continue;
    }

    for (key in source) {
      if (source.hasOwnProperty(key)) {
        obj[key] = source[key];
      }
    }
  }
  return obj;
};
