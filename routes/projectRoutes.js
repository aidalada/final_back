const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', projectController.getAllProjects);
router.get('/analytics/summary', projectController.getAnalyticsSummary);
router.get('/:id', projectController.getProjectById);

router.post('/', authenticate, projectController.createProject);
router.put('/:id', authenticate, projectController.updateProject);
router.delete('/:id', authenticate, projectController.deleteProject);

router.patch(
    '/:id/status',
    authenticate,
    authorizeAdmin,
    projectController.updateStatus
);

router.patch(
    '/:id/assign',
    authenticate,
    authorizeAdmin,
    projectController.assignUsers
);

router.post('/:id/comments', authenticate, projectController.addComment);
router.get('/:id/comments', authenticate, projectController.getComments);

router.post('/:id/todos', authenticate, projectController.addTodo);
router.patch('/:id/todos/:todoId', authenticate, projectController.updateTodo);
router.delete('/:id/todos/:todoId', authenticate, projectController.deleteTodo);

module.exports = router;