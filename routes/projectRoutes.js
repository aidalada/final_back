const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

router.post('/', authenticate, authorizeAdmin, projectController.createProject);
router.put('/:id', authenticate, authorizeAdmin, projectController.updateProject);
router.delete('/:id', authenticate, authorizeAdmin, projectController.deleteProject);

module.exports = router;