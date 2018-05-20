const Application = require('thinkjs');
const babel = require('think-babel');
const watcher = require('think-watcher');
const notifier = require('node-notifier');

const instance = new Application({
  ROOT_PATH: __dirname,
  watcher,
  transpiler: [babel, {
    babelrc: true
  }],
  notifier: notifier.notify.bind(notifier),
  env: 'development'
});

instance.run();
