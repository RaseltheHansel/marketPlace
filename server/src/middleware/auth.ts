import type { Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest} from '../types';


interface JwtPayload { id: string; role: string; }

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
        const token = req.headers?.authorization?.split(' ')[1];
        if(!token) {
            res.status(401).json({message: 'No token'});
            return;
        }
        try{
            const secret = process.env.JWT_SECRET!;
            const decoded = jwt.verify(token, secret) as unknown as JwtPayload;
            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
       
        }catch {
            res.status(401).json({message: 'Invalid token.'});
        }
    };

export default verifyToken;
