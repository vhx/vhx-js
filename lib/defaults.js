if (window.location.href.match(/crystal/)) {
  const _VHX_DEFAULTS = {
    HOST: 'api.crystal.dev',
    PROTOCOL: 'http://',
    API_VERSION: require('../package.json').version,
    TIMEOUT: '30000',
    TOKEN_HOST: 'crystal.dev'
  };
}

if (window.location.href.match(/vhx/)) {
  const _VHX_DEFAULTS = {
    HOST: 'api.vhx.tv',
    PROTOCOL: 'https://',
    API_VERSION: require('../package.json').version,
    TIMEOUT: '30000',
    TOKEN_HOST: 'vhx.tv'
  };
}

if (window.location.href.match(/vhxqa1|vhxqa2|vhxqa3|vhxqa4/)) {
  let current_host = window.location.href.match(/vhxqa1|vhxqa2|vhxqa3|vhxqa4/)[0];

  const _VHX_DEFAULTS = {
    HOST: current_host,
    PROTOCOL: 'https://',
    API_VERSION: require('../package.json').version,
    TIMEOUT: '30000',
    TOKEN_HOST: `${current_host}.com`
  };
}

module.exports = _VHX_DEFAULTS;
