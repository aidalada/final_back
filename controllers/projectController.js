const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('category'); 
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

exports.createProject = async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ message: "Ошибка валидации: " + err.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Проект не найден" });
        res.json(project);
    } catch (err) {
        res.status(400).json({ message: "Некорректный ID" });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Проект не найден" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: "Ошибка обновления: " + err.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Проект не найден" });
        res.json({ message: "Проект успешно удален" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка при удалении" });
    }
};