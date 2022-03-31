const router = require("express").Router();
const { index, viewCreate, actionCreate, viewEdit, actionEdit, actionDelete, actionStatus} = require("./controller");
const multer = require('multer')
const os = require('os')

router.get("/", index);
router.get("/create", viewCreate);
router.post('/create', multer({dest: os.tmpdir()}).single('image'), actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', multer({dest: os.tmpdir()}).single('image'), actionEdit);
router.delete('/edit/:id', actionDelete);
router.put('/status/:id', actionStatus);

module.exports = router;
