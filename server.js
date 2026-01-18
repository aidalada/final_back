const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Project = require('./models/Project'); 

const app = express();

app.use(express.json()); 
app.use(cors());       
app.use(express.static('public')); 

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error', err));



app.post('/projects', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ message: "Ошибка валидации: " + err.message });
    }
});


app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});


app.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Проект не найден" });
        res.json(project);
    } catch (err) {
        res.status(400).json({ message: "Некорректный ID" });
    }
});


app.put('/projects/:id', async (req, res) => {
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
});


app.delete('/projects/:id', async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Проект не найден" });
        res.json({ message: "Проект успешно удален" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка при удалении" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));