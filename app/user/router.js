const router = require("express").Router()
const {viewSignin, actionSignin, actionLogout} = require('./controller')
router.get('/', viewSignin);
router.post('/', actionSignin);
router.get('/logout', actionLogout);


module.exports = router;
