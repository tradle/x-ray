/**
 * Module Dependencies
 */
const sts = require('stream-to-string')

/**
 * Export `streamToPromise`
 */

module.exports = streamToPromise

/**
 * Convert a readStream from xray.stream() into
 * a Promise resolved with written string
 *
 * @param {Stream} strem
 * @return {Promise}
 */
function streamToPromise (stream) {
  return sts(stream).then(function (resStr) {
    return JSON.parse(resStr)
  })
}
