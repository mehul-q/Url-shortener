const router = require('express').Router();
const { shorten } = require('../controllers/urlController');

router.post('/shorten', shorten);

module.exports = router;