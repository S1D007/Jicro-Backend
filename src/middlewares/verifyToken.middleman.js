const jwt = require("jsonwebtoken")
module.exports = async (req, res, next) => {
    const { token } = req.body;
    // 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.id;
        next()
    } catch (e) {
        return res.status(401).json({ message: 'Authentication error: invalid token', error: e });
    }
}