/**
 * 2019/4/15 下午10:37
 */
let log4js = require('log4js');
log4js.configure({
    appenders: {base: {type: 'file', filename: './log/tmp.log'}},
    categories: {default: {appenders: ['base'], level: 'debug'}}
});

let logger = log4js.getLogger();
logger.level = 'info';

global.logger = logger

module.exports = logger
