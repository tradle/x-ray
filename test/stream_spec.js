/* global it describe */

/**
 * Module Dependencies
 */

const expect = require('expect.js')
const EventEmitter = require('events')
const streamHelper = require('../lib/stream')

function createStream () {
  const instance = new EventEmitter()
  instance._data = ''
  instance._open = true
  instance.on('write', function (chunk) { instance._data += chunk })
  instance.once('end', function () { instance._open = false })

  instance.write = function write (chunk) { instance.emit('write', String(chunk) || '') }
  instance.error = function error (err) { instance.emit('error', err) }
  instance.end = function end (chunk) {
    if (!instance._open) return
    instance.emit('write', chunk)
    instance.emit('end')
  }

  return instance
}

function getSessionResult () {
  const events = Array.prototype.slice.call(arguments)
  const stream = createStream()
  const helper = streamHelper.array(stream)
  events.forEach(function (data, index) { helper(data, index === events.length - 1) })
  while (stream._open) { /* wait for stream to close */ }
  return JSON.stringify(JSON.parse(stream._data))
}

/**
 * Tests
 */

describe('stream.array helper', function () {
  it('accepts non-empty arrays', function () {
    const result = getSessionResult([1, 2], [3])
    expect(result).to.be('[1,2,3]')
  })
  it('accepts one non-empty array', function () {
    const result = getSessionResult([1])
    expect(result).to.be('[1]')
  })
  it('accepts one empty array', function () {
    const result = getSessionResult([])
    expect(result).to.be('[]')
  })
  it('accepts one single value', function () {
    const result = getSessionResult(1)
    expect(result).to.be('[1]')
  })
  it('accepts multiple values', function () {
    const result = getSessionResult(1, 2, 3)
    expect(result).to.be('[1,2,3]')
  })
  it('accepts one empty array at the end', function () {
    const result = getSessionResult([1, 2], [3], [])
    expect(result).to.be('[1,2,3]')
  })
  it('accepts multiple empty arrays', function () {
    const result = getSessionResult([], [], [], [])
    expect(result).to.be('[]')
  })
  it('accepts arrays', function () {
    const result = getSessionResult([1], [], [], [2], [])
    expect(result).to.be('[1,2]')
  })
  it('accepts all weird things', function () {
    const result = getSessionResult([], [1], [2], [], [], 3, 4, [])
    const result2 = getSessionResult([], [1], [2], [], [], 3, 4, [], [])
    const result3 = getSessionResult([], [], [1], [2], [], [], 3, 4, [], [])
    const result4 = getSessionResult([1], [2], [], [], 3, 4, [], [])
    const result5 = getSessionResult([1, 2, 3, 4])
    expect(result).to.be('[1,2,3,4]')
    expect(result2).to.be('[1,2,3,4]')
    expect(result3).to.be('[1,2,3,4]')
    expect(result4).to.be('[1,2,3,4]')
    expect(result5).to.be('[1,2,3,4]')
  })
})
