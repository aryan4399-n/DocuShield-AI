const router = require('express').Router();
const controller = require('../controllers/application.controller');
router.get('/:applicationId', controller.get);
module.exports = router;
