class YargsPromise {
  constructor(yargs, ctx) {
    this.ctx = ctx || {};
    this.yargs = yargs;
    this.parse = this.parse.bind(this);
    this.command = this.yargs.command;
    this.commandDir = this.yargs.commandDir;
  }

  parse(msg) {
    const yargs = this.yargs;
    return new Promise((resolve, reject) => {
      let context = Object.assign({}, this.ctx);
      // the following context methods use `data`
      // to distinguish themselves as resolve/reject
      // calls inside of command handlers
      context.resolve = function(data, argv) {
        return resolve({ data, argv });
      };

      context.reject = function(data, argv) {
        return reject({ data, argv });
      };

      yargs.parse(msg, context, function(error, argv, output) {
        // the reject/resolve calls below are from
        // internal yarg behavior.
        if (error) {
          // reject built in validation error
          return reject({argv, error});
        }
        // resolve built in output
        return resolve({argv, output});
      });
    });
  }
}

module.exports = YargsPromise;
