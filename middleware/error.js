
const winston = require('winston');

module.exports = function (err, req, res, next) {

    res.status(500).send('Something failed');
    // error
    // warn
    // info
    // verbose
    // debug
    // silly
    winston.error(err.stack, err);
}