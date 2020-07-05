
const toHexString = (bytes) => Array.from(bytes, (byte) => (
  `0${(byte & 0xFF).toString(16)}`
).slice(-2)).join('');
module.exports.toHexString = toHexString;

const generateAESKey = () => {
  const crypto = require('crypto');
  return toHexString(crypto.randomBytes(24));
};
module.exports.generateAESKey = generateAESKey;
