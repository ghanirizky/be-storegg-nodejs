const router = require("express").Router()
const {index, viewCreate, actionCreate, viewEdit, actionEdit, actionDelete, actionStatus} = require('./controller')

router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', actionEdit);
router.delete('/edit/:id', actionDelete);
router.put('/status/:id', actionStatus);

module.exports = router;
