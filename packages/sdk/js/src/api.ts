import * as OpenApiValidator from 'express-openapi-validator'
import yaml from 'js-yaml'
import express, { Router } from 'express' // <-- Import Router
import * as core from 'express-serve-static-core'

import spec from '../agent-protocol/schemas/openapi.yml'

export type ApiApp = core.Express

export interface RouteContext {
  workspace: string
}

export type RouteRegisterFn = (app: Router, context: RouteContext) => void

export interface ApiConfig {
  context: RouteContext
  port: number
  callback?: () => void
  routes: RouteRegisterFn[]
}

export const createApi = (config: ApiConfig) => {
  const app = express()

  app.use(express.json())
  app.use(express.text())
  app.use(express.urlencoded({ extended: false }))

  const parsedSpec = yaml.load(spec)

  app.use(
    OpenApiValidator.middleware({
      apiSpec: parsedSpec as any,
      validateRequests: true, // (default)
      validateResponses: true, // false by default
    })
  )

  app.get('/openapi.yaml', (_, res) => {
    res.setHeader('Content-Type', 'text/yaml').status(200).send(spec)
  })

  const router = Router()

  config.routes.map((route) => {
    route(router, config.context)
  })

  app.use('/ap/v1', router)
  app.listen(config.port, config.callback)
}
