import express from "express"
import { ILabel } from "../interfaces/label"

export function validatePDFAPI(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { return_address, language, name, order } = req.body as ILabel
    if (!return_address || !language || !name || !order) {
        return res.status(400).json({ error: 'some fields are missing' });
    }
    next();
}