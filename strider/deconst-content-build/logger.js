var winston = require('winston');

var transports = [
  new (winston.transports.Console)({
    level: process.env.DECONST_BUILD_LOG_LEVEL || 'info',
    colorize: true,
    timestamp: true
  })
];

module.exports = new (winston.Logger)({ transports: transports });
