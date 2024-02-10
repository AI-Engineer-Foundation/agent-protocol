import { type Request, type Response, type NextFunction } from 'express'
import { type VerifyErrors } from 'jsonwebtoken'
import { type ApiConfig } from './src/api'

const authMiddleware = (config: ApiConfig) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (config.jwtSecret !== undefined) {
      jwtAuthorisation(config.jwtSecret, req, res, next)
    } else if (config.apiKeys !== undefined && config.apiKeys.length !== 0) {
      apiKeyAuthorisation(config.apiKeys, req, res, next)
    } else {
      // No authorisation required
      next()
    }
  }
}

const apiKeyAuthorisation = (
  apiKeys: string[],
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers['X-API-KEY'] as string | undefined

  if (apiKey === undefined) {
    res.sendStatus(401)
  } else if (apiKeys.includes(apiKey)) {
    next()
  } else {
    res.sendStatus(403)
  }
}

const jwtAuthorisation = (
  jwtSecret: string,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  import('jsonwebtoken')
    .then(({ verify }) => {
      const authHeader = req.headers.authorization
      if (authHeader === undefined) {
        return res.sendStatus(401)
      }

      const token = authHeader.split(' ')[1]

      verify(token, jwtSecret, (err: VerifyErrors | null, user) => {
        if (err !== null) {
          return res.sendStatus(403)
        }

        // req.user = user
        next()
      })
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

export default authMiddleware
