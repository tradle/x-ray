/* global it, describe */

/**
 * Module Dependencies
 */

const params = require('../lib/params')
const expect = require('expect.js')

/**
 * Tests
 */

describe('params', function () {
  describe('1 arguments', function () {
    it("should be a selector if it's a string", function () {
      const arg = params('#hi')
      expect(arg.source).to.be(null)
      expect(arg.context).to.be(null)
      expect(arg.selector).to.be('#hi')
    })

    it("should be a selector if it's an object", function () {
      const arg = params({ hi: 'hi' })
      expect(arg.source).to.be(null)
      expect(arg.context).to.be(null)
      expect(arg.selector).to.eql({
        hi: 'hi'
      })
    })

    it("should be a selector if it's an array", function () {
      const arg = params(['hi'])
      expect(arg.source).to.be(null)
      expect(arg.context).to.be(null)
      expect(arg.selector).to.eql(['hi'])
    })
  })

  describe('2 arguments', function () {
    it('should support attribute selectors', function () {
      const arg = params('@attr', { hi: 'hi' })
      expect(arg.source).to.be(null)
      expect(arg.context).to.be('@attr')
      expect(arg.selector).to.eql({
        hi: 'hi'
      })
    })

    it('should support selectors', function () {
      const arg = params('.hi', { hi: 'hi' })
      expect(arg.source).to.be(null)
      expect(arg.context).to.be('.hi')
      expect(arg.selector).to.eql({
        hi: 'hi'
      })
    })

    it('should support urls with object selectors', function () {
      const arg = params('https://google.com', { hi: 'hi' })
      expect(arg.source).to.be('https://google.com')
      expect(arg.context).to.be(null)
      expect(arg.selector).to.eql({
        hi: 'hi'
      })
    })

    it('should support urls with string selectors', function () {
      const arg = params('https://google.com', 'hi')
      expect(arg.source).to.be('https://google.com')
      expect(arg.context).to.be(null)
      expect(arg.selector).to.eql('hi')
    })

    it('should support urls with array selectors', function () {
      const arg = params('https://google.com', ['hi'])
      expect(arg.source).to.be('https://google.com')
      expect(arg.context).to.be(null)
      expect(arg.selector).to.eql(['hi'])
    })

    it('should support HTML strings with object selectors', function () {
      const arg = params('<h2>hi</h2>', { hi: 'hi' })
      expect(arg.source).to.be('<h2>hi</h2>')
      expect(arg.context).to.be(null)
      expect(arg.selector).to.eql({
        hi: 'hi'
      })
    })

    it('should support HTML strings with string selectors', function () {
      const arg = params('<h2>hi</h2>', 'hi')
      expect(arg.source).to.be('<h2>hi</h2>')
      expect(arg.context).to.be(null)
      expect(arg.selector).to.eql('hi')
    })

    it('should support HTML strings with array selectors', function () {
      const arg = params('<h2>hi</h2>', ['hi'])
      expect(arg.source).to.be('<h2>hi</h2>')
      expect(arg.context).to.be(null)
      expect(arg.selector).to.eql(['hi'])
    })
  })

  describe('3 arguments', function () {
    it('should support a source, context, and selector', function () {
      const arg = params('http://google.com', '#hi', { hi: 'hi' })
      expect(arg.source).to.be('http://google.com')
      expect(arg.context).to.be('#hi')
      expect(arg.selector).to.eql({ hi: 'hi' })
    })
  })
})
