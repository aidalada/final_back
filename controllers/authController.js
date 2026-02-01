const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const newUser = new User({ email, password, role });
        await newUser.save();
        res.status(201).json({ message: "Пользователь создан" });
    } catch (err) {
        res.status(400).json({ message: "Ошибка регистрации: " + err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Неверный email или пароль" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};