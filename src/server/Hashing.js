const sha256 = require('crypto-js/sha256')



const getSha256 = (text) => sha256(text).toString();

module.exports = getSha256