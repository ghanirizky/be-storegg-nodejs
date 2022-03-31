const router = require('express').Router();
const {index} = require('./controller')
/* GET home page. */
router.get('/',index);

module.exports = router;
