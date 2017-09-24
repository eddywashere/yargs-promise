const YargsPromise = require('./yargs-promise')

module.exports = function yargsPromise (yargs, ctx) {
  return new YargsPromise(yargs, ctx)
}
