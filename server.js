const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); 
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json()); 
app.use(cors());       
app.use(express.static('public')); 

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error', err));


app.use('/auth', authRoutes); 
app.use('/projects', projectRoutes);
app.use('/categories', categoryRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));