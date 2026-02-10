const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
router.get('/', categoryController.getAllCategories);
router.post('/', authenticate, authorizeAdmin, categoryController.createCategory);
router.delete('/:id', authenticate, authorizeAdmin, categoryController.deleteCategory);

module.exports = router;