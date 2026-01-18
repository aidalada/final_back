const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Название обязательно'] 
    },
    description: { 
        type: String, 
        required: [true, 'Описание обязательно'] 
    },
    budget: { 
        type: Number, 
        required: [true, 'Бюджет обязателен'] 
    }
}, { 
    timestamps: true // Это автоматически создаст createdAt и updatedAt
});

module.exports = mongoose.model('Project', projectSchema);