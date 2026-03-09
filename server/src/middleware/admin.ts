import type { Response, NextFunction } from "express";  
import type { AuthRequest } from "../types";
import e from "express";

const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if(req.userRole !== 'admin') {
        res.status(403).json({message: 'Access denied. Admin ONLY!'});
        return;

    }
    next();
};
e
export default isAdmin;