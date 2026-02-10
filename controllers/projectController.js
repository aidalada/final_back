const Project = require('../models/Project');
const Category = require('../models/Category');

// Получить все проекты (с популяцией связей)
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('category')
            .populate('assignedUsers', 'email role')
            .populate('comments.user', 'email');

        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Вспомогательная функция пересчёта статуса по todo-листу
function recalcStatusByTodos(project) {
    const total = project.todos ? project.todos.length : 0;
    const done = project.todos ? project.todos.filter(t => t.done).length : 0;

    let status = 'backlog';
    if (total > 0) {
        const percent = (done / total) * 100;
        if (percent === 100) {
            status = 'done';
        } else if (percent > 0) {
            status = 'in_progress';
        }
    }

    project.status = status;
}

function canModifyProject(req, project) {
    if (!req.user) return false;
    if (req.user.role === 'admin') return true;
    if (!project.owner) return false;
    return String(project.owner) === req.user.userId;
}

// Создание проекта (авторизованный пользователь, владелец = текущий пользователь)
exports.createProject = async (req, res) => {
    try {
        const payload = {
            title: req.body.title,
            description: req.body.description,
            budget: req.body.budget,
            category: req.body.category || null,
            deadline: req.body.deadline,
            assignedUsers: req.body.assignedUsers || [],
            owner: req.user.userId
        };

        const newProject = new Project(payload);
        const savedProject = await newProject.save();
        const populated = await Project.findById(savedProject._id)
            .populate('category')
            .populate('assignedUsers', 'email role');

        res.status(201).json(populated || savedProject);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка валидации: ' + err.message });
    }
};

// Получить один проект по ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('category')
            .populate('assignedUsers', 'email role')
            .populate('comments.user', 'email');

        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }
        res.json(project);
    } catch (err) {
        res.status(400).json({ message: 'Некорректный ID' });
    }
};

// Todo внутри проекта (владелец проекта или админ)
exports.addTodo = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Текст задачи обязателен' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        if (!canModifyProject(req, project)) {
            return res.status(403).json({ message: 'Недостаточно прав для изменения задач этого проекта' });
        }

        project.todos.push({ text: text.trim() });
        recalcStatusByTodos(project);
        await project.save();
        res.status(201).json(project.todos);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка добавления задачи: ' + err.message });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { done, text } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        if (!canModifyProject(req, project)) {
            return res.status(403).json({ message: 'Недостаточно прав для изменения задач этого проекта' });
        }

        const todo = project.todos.id(req.params.todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Задача не найдена' });
        }

        if (done !== undefined) todo.done = !!done;
        if (text !== undefined) todo.text = String(text).trim();

        recalcStatusByTodos(project);
        await project.save();
        res.json(project.todos);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка обновления задачи: ' + err.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        if (!canModifyProject(req, project)) {
            return res.status(403).json({ message: 'Недостаточно прав для изменения задач этого проекта' });
        }

        const todo = project.todos.id(req.params.todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Задача не найдена' });
        }

        todo.deleteOne();
        recalcStatusByTodos(project);
        await project.save();
        res.json(project.todos);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка удаления задачи: ' + err.message });
    }
};

// Обновление проекта (владелец или админ)
exports.updateProject = async (req, res) => {
    try {
        const allowedFields = [
            'title',
            'description',
            'budget',
            'category',
            'status',
            'deadline',
            'assignedUsers'
        ];

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        if (!canModifyProject(req, project)) {
            return res.status(403).json({ message: 'Недостаточно прав для изменения этого проекта' });
        }

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                project[field] = req.body[field];
            }
        });

        await project.save();
        const populated = await Project.findById(project._id)
            .populate('category')
            .populate('assignedUsers', 'email role');

        res.json(populated || project);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка обновления: ' + err.message });
    }
};

// Удаление проекта (владелец или админ)
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        if (!canModifyProject(req, project)) {
            return res.status(403).json({ message: 'Недостаточно прав для удаления этого проекта' });
        }

        await project.deleteOne();
        res.json({ message: 'Проект успешно удален' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при удалении' });
    }
};

// Обновление статуса проекта (Kanban, админ)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['backlog', 'in_progress', 'review', 'done'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Некорректный статус' });
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
            .populate('category')
            .populate('assignedUsers', 'email role');

        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        res.json(project);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка обновления статуса: ' + err.message });
    }
};

// Назначение пользователей на проект (админ)
exports.assignUsers = async (req, res) => {
    try {
        const { userIds } = req.body;

        if (!Array.isArray(userIds)) {
            return res.status(400).json({ message: 'userIds должен быть массивом' });
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { assignedUsers: userIds },
            { new: true, runValidators: true }
        )
            .populate('category')
            .populate('assignedUsers', 'email role');

        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        res.json(project);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка назначения пользователей: ' + err.message });
    }
};

// Добавление комментария к проекту (любой авторизованный пользователь)
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Текст комментария обязателен' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        const comment = {
            user: req.user.userId,
            text: text.trim()
        };

        project.comments.push(comment);
        await project.save();

        const populatedProject = await project
            .populate('comments.user', 'email')
            .execPopulate
            ? project.populate('comments.user', 'email').execPopulate()
            : Project.findById(project._id)
                  .populate('comments.user', 'email');

        res.status(201).json(populatedProject.comments);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка добавления комментария: ' + err.message });
    }
};

// Получение комментариев проекта
exports.getComments = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate(
            'comments.user',
            'email'
        );
        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        res.json(project.comments);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка получения комментариев: ' + err.message });
    }
};

// Аналитика по проектам
exports.getAnalyticsSummary = async (req, res) => {
    try {
        const byStatusRaw = await Project.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const byStatus = {
            backlog: 0,
            in_progress: 0,
            review: 0,
            done: 0
        };

        byStatusRaw.forEach((item) => {
            if (item._id) {
                byStatus[item._id] = item.count;
            }
        });

        const byCategory = await Project.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalBudget: { $sum: '$budget' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const categoryIds = byCategory
            .map(c => c._id)
            .filter(id => id);

        const categoriesMap = {};
        if (categoryIds.length) {
            const categories = await Category.find({ _id: { $in: categoryIds } }).select('name');
            categories.forEach(cat => {
                categoriesMap[String(cat._id)] = cat.name;
            });
        }

        const byCategoryWithNames = byCategory.map(c => ({
            name: c._id ? categoriesMap[String(c._id)] || 'Без категории' : 'Без категории',
            totalBudget: c.totalBudget,
            count: c.count
        }));

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const completedThisWeek = await Project.countDocuments({
            status: 'done',
            updatedAt: { $gte: oneWeekAgo }
        });

        res.json({
            byStatus,
            byCategory: byCategoryWithNames,
            completedThisWeek
        });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения аналитики: ' + err.message });
    }
};