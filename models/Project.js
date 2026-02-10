const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Название обязательно']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
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
    },
    status: {
        type: String,
        enum: ['backlog', 'in_progress', 'review', 'done'],
        default: 'backlog'
    },
    deadline: {
        type: Date
    },
    assignedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    todos: [{
        text: {
            type: String,
            required: true,
            trim: true
        },
        done: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);