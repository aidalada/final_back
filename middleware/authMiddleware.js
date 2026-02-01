const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: "Нет токена доступа" });
    }

    const token = authHeader.split(' ')[1]; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(403).json({ message: "Неверный или просроченный токен" });
    }
};

exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Доступ запрещен: требуются права администратора" });
    }
    next();
};