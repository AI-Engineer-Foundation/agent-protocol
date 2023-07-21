import * as OpenApiValidator from 'express-openapi-validator'
import express from 'express'
import path from 'path'

const app = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: false }))

const spec = path.join(__dirname, '../../openapi.yml');

app.use('/spec', express.static(spec));

app.use(
  OpenApiValidator.middleware({
    apiSpec: '../../openapi.yml',
    validateRequests: true, // (default)
    validateResponses: true, // false by default
    operationHandlers: {
      resolver
    }
  }),
)
