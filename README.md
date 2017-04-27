# yargs-promise

Use the headless yargs parser with promises!

## Install

npm

```
npm install --save yargs-promise
```

yarn

```
yarn add --save yargs-promise
```

## Usage

Instead of using a callback with  [yargs.parse](http://yargs.js.org/docs/#methods-parseargs-context-parsecallback), use a promise chain: `parser.parse(text).then().catch()`.

Examples:

```js
const yargs = require('yargs');
const YargsPromise = require('yargs-promise');

// create the customized yargs parser
const parser = new YargsPromise(yargs);

// setup command & command handler
parser
  .command('hello <name>', 'hello world parser' , ()=>{}, (argv) => {
    // resolve stuff
    argv.resolve(yourData, argv); // pass back argv if you need it

    // reject stuff
    argv.reject(yourErrorData, argv); // pass back argv if you need it

    // or do nothing and reject/resolve will be handled internally
    // however { data } will not be present in resolved or rejected responses
    console.log('testing argv', argv);
  })
  .help();

// parse text input and use the returned promise
parser.parse('hello world')
  .then(({argv, output, data}) => {
    // `output` exists if there was console output from yargs and if this was
    // resolved in internal parser callback

    // `data` exists if the promise was resolved in command handler

    // `argv` exists if the promise was resolved in internal parser callback
    // otherwise it will need to be passed as the 2nd argument to
    // context.resolve(data, argv)
  })
  .catch((error, argv, data) => {
    // `error` exists if there was an internal error from yargs

    // `argv` exists if the promise was rejected in internal parser callback
    // otherwise it will need to be passed as the 2nd argument to
    // context.reject(data, argv)

    if (error) {
      // built in error validation
    }
    if (data) {
      // rejected from command handler
    }

    // argv contains parsed input
  });

```

Customizing context example

```js
const yargs = require('yargs');
const YargsPromise = require('yargs-promise');

const parser = new YargsPromise(
  yargs,
  // customize context
  {
    customContextMethod: () => {},
    foo: 'bar'
  }
);

parser
  .command('hello <name>', 'hello world parser' , ()=>{}, (argv) => {
    // argv now contains
    argv.customContextMethod();
    console.log(argv.foo);
  })
  .help();
```

### How it works

This library does three things:

- wraps the yargs.parse in a new Promise
  - no more callbacks
- attaches that Promises `resolve` & `reject` methods on the context passed to yargs.parse
  - this enables you to call `argv.resolve` or `argv.reject` in command handler function
- handles default behavior
  - from Error validation
  - output from internal commands like `.help()`
  - unhandled output from custom handler

Checkout the source code or tests for more information.

### Why

Building chatbots requires parsing and handling text input. This wraps up the most common needs I've come across for handling errors, simple commands, and commands with handlers.
