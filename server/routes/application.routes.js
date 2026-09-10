const router = require('express').Router();
const controller = require('../controllers/application.controller');
const { upload } = require('../middleware/upload.middleware');
router.post('/submit', upload.any(), controller.submit);
router.get('/:applicationId', controller.get);
router.get('/:applicationId/status', controller.get);
router.get('/:applicationId/report', controller.report);
module.exports = router;
