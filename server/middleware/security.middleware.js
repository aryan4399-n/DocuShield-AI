const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('../config/env');
function configureSecurity(app) { app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } })); app.use(cors({ origin: env.corsOrigin })); app.use(expressJson()); app.use(require('express').urlencoded({ extended: true, limit: '1mb' })); app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false })); }
function expressJson() { return require('express').json({ limit: '1mb' }); }
module.exports = { configureSecurity };
