const router = require("express").Router()
const {index, actionStatus} = require('./controller')

router.get('/', index);
router.put('/status/:id', actionStatus);

module.exports = router;
