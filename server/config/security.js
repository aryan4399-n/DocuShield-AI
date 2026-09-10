const crypto = require('crypto');
function timingSafeEqualText(left, right) { return Boolean(left && right && left.length === right.length && crypto.timingSafeEqual(Buffer.from(left), Buffer.from(right))); }
module.exports = { timingSafeEqualText };
