/**
 * Module Dependencies
 */

const URL = require('url').URL

/**
 * Export `absolute`
 */

module.exports = absolute

/**
 * Selector
 */

const selector = [
  'a[href]',
  'img[src]',
  'script[src]',
  'link[href]',
  'source[src]',
  'track[src]',
  'img[src]',
  'frame[src]',
  'iframe[src]'
].join(',')

/**
 * Checks if a given string is a valid URL
 *
 * @param {String} src
 * @return {Boolean}
 */

function isValidUrl (src) {
  try {
    // eslint-disable-next-line
    new URL(src, 'http://foo.co')
    return true
  } catch (e) {
    return false
  }
}

/**
 * Change all the URLs into absolute urls
 *
 * @param {String} path
 * @param {Cheerio} $
 * @return {$}
 */

function absolute (path, $) {
  const parts = new URL(path)
  let remote = parts.protocol + '//' + parts.host
  // apply <base> tag transformation
  const base = $('head').find('base')
  let href
  if (base.length === 1) {
    href = base.attr('href')
    if (href) {
      remote = href
    }
  }
  $(selector).each(abs)

  function abs (i, el) {
    const $el = $(el)
    let key = null
    let src = null

    const hasHref = $el.attr('href')
    const hashSrc = $el.attr('src')

    if (hasHref) {
      key = 'href'
      src = hasHref
    } else if (hashSrc) {
      key = 'src'
      src = hashSrc
    } else {
      return
    }

    src = src.trim()

    if (~src.indexOf('://')) {
      return
    } else if (isValidUrl(src)) {
      src = (new URL(
        src,
        new URL(href && src.indexOf('/') !== 0 ? href : parts.pathname, remote)
      )).toString()
    }

    $el.attr(key, src)
  }

  return $
}
