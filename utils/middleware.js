const logger = require('./logger')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }

    next()
}

const userExtractor = (request, response, next) => {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    request.user = decodedToken.id.toString()

    next()
}

const requestLogger = (request, response, next) => {
    logger.info(request.method, request.path)
    logger.info(request.body)
    logger.info('---------')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        const customErrorMessage = error.message.replace('Path', 'Value').replace(/\(`.+`\) /, '')
        return response.status(400).json({ error: customErrorMessage })
    }
    else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'Invalid token' })
    }

    next(error)
}

module.exports = { 
    requestLogger, 
    unknownEndpoint, 
    errorHandler, 
    tokenExtractor, 
    userExtractor
}