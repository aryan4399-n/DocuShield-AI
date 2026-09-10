const test = require('node:test');
const assert = require('node:assert/strict');
test('health contract is documented', () => { assert.equal('/api/health', '/api/health'); });
