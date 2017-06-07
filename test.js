const VhxApi = require('./dist/index.js');

const vhx = new VhxApi('-5m6LEssx4g8Lw1D18LSoPyJtKRFEtZJ', {
  host: 'api.crystal.dev',
  protocol: 'http://'
});

vhx.collections.all(console.log);