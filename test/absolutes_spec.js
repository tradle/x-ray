/* global it, describe */

/**
 * Module Dependencies
 */

const absolute = require('../lib/absolutes')
const cheerio = require('cheerio')
const expect = require('expect.js')

describe('absolute URLs', function () {
  const path = 'http://example.com/foo.html'

  it('should not convert URL', function () {
    const $el = cheerio.load('<a href="http://example.com/bar.html"></a>')
    expect(absolute(path, $el).html()).to.be('<a href="http://example.com/bar.html"></a>')
  })

  it('should convert absolute URL', function () {
    const $el = cheerio.load('<a href="/bar.html"></a>')
    expect(absolute(path, $el).html()).to.be('<a href="http://example.com/bar.html"></a>')
  })

  it('should convert relative URL', function () {
    const $el = cheerio.load('<a href="bar.html"></a>')
    expect(absolute(path, $el).html()).to.be('<a href="http://example.com/bar.html"></a>')
  })

  it('should not throw when encountering invalid URLs', function () {
    const $el = cheerio.load('<html><body><ul><li><a href="mailto:%CAbroken@link.com">Broken link</a></li></ul></body></html>')
    absolute(path, $el)
  })
})

describe('absolute URLs with <base> tag', function () {
  const head = '<head><base href="http://example.com/foo/"></head>'
  const path = 'http://example.com/foo.html'

  it('should convert relative URL', function () {
    const $el = cheerio.load(head + '<a href="foobar.html"></a>')
    expect(absolute(path, $el).html()).to.be(head + '<a href="http://example.com/foo/foobar.html"></a>')
  })

  it('should not convert relative URL starting with /', function () {
    const $el = cheerio.load(head + '<a href="/foobar.html"></a>')
    expect(absolute(path, $el).html()).to.be(head + '<a href="http://example.com/foobar.html"></a>')
  })
})
