import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: 'Authorization header missing',
            });

        }

        const token = authHeader.split(' ')[1];

        if (!token) {

            return res.status(401).json({
                success: false,
                message: 'Token missing',
            });

        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });

    }

};
//----------------------------------
export const authorizeRoles = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: `Role (${req.user.role}) is not allowed`,
            });

        }

        next();

    };

};