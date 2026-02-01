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
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: false 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Project', projectSchema);