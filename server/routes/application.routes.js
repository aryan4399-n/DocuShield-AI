const router = require('express').Router();
const controller = require('../controllers/application.controller');
const { upload } = require('../middleware/upload.middleware');
const documentFields = [
  'governmentId',
  'addressProof',
  'panCard',
  'photo',
  'supporting'
].map(name => ({ name, maxCount: 1 }));

router.post('/submit', upload.fields(documentFields), controller.submit);
router.get('/:applicationId', controller.get);
router.get('/:applicationId/status', controller.get);
router.get('/:applicationId/report', controller.report);
module.exports = router;
