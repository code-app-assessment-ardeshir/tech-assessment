import express from "express";

export function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
    next()
}