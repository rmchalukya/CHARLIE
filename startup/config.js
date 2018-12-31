const config = require('config');

module.exports = function () {
    //READ ENV VARIABLES
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}