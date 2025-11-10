const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // multer setup

router.post('/items/create', auth, upload.single('image'), itemController.createItem);
router.get('/items', itemController.getAllItems);
router.get('/items/:id', itemController.getItemById);
router.put('/items/:id', auth, itemController.updateItem);
router.delete('/items/:id', auth, itemController.deleteItem);

module.exports = router;
