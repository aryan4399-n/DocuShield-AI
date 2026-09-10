const router = require('express').Router();
const { requireAdmin } = require('../middleware/admin.middleware');
router.use(requireAdmin);
module.exports = router;
