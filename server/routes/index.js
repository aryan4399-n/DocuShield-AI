const router = require('express').Router();
router.use('/health', require('./health.routes'));
router.use('/applications', require('./application.routes'));
router.use('/verification', require('./verification.routes'));
router.use('/documents', require('./document.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/admin', require('./admin.routes'));
module.exports = router;
