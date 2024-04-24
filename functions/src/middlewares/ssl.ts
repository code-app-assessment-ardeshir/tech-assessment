import express from 'express'

export function forceSecure(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.secure || req.headers.host?.includes('localhost') || req.headers.host?.startsWith('127.0.0.1')) {
        next()
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`)
    }
  }