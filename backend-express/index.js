const express = require('express');
const bodyParser = require('body-parser')

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf, splat, json , cli} = format
const crypto = require('crypto')

const cors = require('cors');
const corsOptions = {
    origin: "http://localhost:3000",
}


const db = require('./db.js');


const conn = db()
const User = conn.model('User')
const Token = conn.model('Token')

require('dotenv').config()

const logger = createLogger({
    format: combine(
        timestamp(),
        splat(),
        cli()
    ),
    transports: [ new transports.Console() ]
})

const app = express()



app.use(bodyParser.json())


app.use(cors(corsOptions))

app.use((req,res,next) => {
    // This has to be after the CORS middleware
    // because the CORS preflight request is an OPTIONS and wont have X-Requested-With or Content-Type
    // and you don't want to reject the preflight request because of that.
    logger.info("Checking for X-Requested-With %s", req.get('X-Requested-With'));

    if (req.get('X-Requested-With') == null) {
        return res.status(401).json({message: "we require X-Requested-With header to make sure that the request triggered SOP policy / CORS"})
    }

    return next()
})

app.post('/api/reset', (req, res) => {
    // This api endpoint is unprotected this is just for testing
    // obviously you would never have an unprotected endpoint to reset the whole database
    User.collection.drop()
    new User({username: 'aaa', password: 'bbb'}).save().then(savedDoc => logger.info('saved %s', savedDoc))
    res.json({"message": "users created"})
})

logger.info("Define /api/login endpoint")
app.post('/api/login', (req,res, next) => {
    logger.info('req.body %s', req.body)
    const username = req.body.username
    const password = req.body.password
    logger.info("Performing authentication for user %s", username)
    User.findOne({username}, (err, user) => {
        if (err) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        if (user === null) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        logger.info('We found the user in the database for %s', username);

        user.comparePassword(password, function(err, isMatch) {
            if (err) return res.status(401).json({message: "error when comparing hashed password"})
            if (!isMatch) {
                return res.status(401).json({message: "Invalid credentials"})
            }
            const randomToken = crypto.randomBytes(16).toString('base64url')
            const hmacTab = crypto.createHmac('sha256', process.env.SECRET).update(randomToken).digest('base64url')

            const token = `${randomToken}.${hmacTab}`

            //TODO: store the token in mongodb 
            new Token({token: randomToken, username: username}).save().then(savedDoc => {
                 res.json({token})
            }).catch(() => {
                res.status(500).json({"message": "couldn't save the token in the store"})
            })
        })    
    })
})

logger.info("Define /api/status endpoint")
app.get("/api/status", (req,res,next) => {
    logger.info("status")
    res.json({message: "service running"})
})




// Add the username to req, by looking up the token into the tokenstore
app.use((req,res,next) => {
    const authorization = req.get('authorization')
    logger.info('authorization header %s', authorization)
    if (authorization == null) {
        req.username = null
        logger.info('no Authorization header')
        return next()
    }


    if (!authorization.startsWith('Bearer ')) {
        return res.status(401).json({message: "Only Bearer token authentication is supported"})
    }

    // TODO first check that the bearer token in the Authorization header is legitimate (verifying the HMAC tag)
    const bearerToken = authorization.substring(authorization.indexOf(' ')+1)

    // split the bearerToken into token : hmactag
    const [token, hmacTag] = bearerToken.split('.')
    logger.info('token: %s hmacTag: %s', token, hmacTag)

    if (!token || !hmacTag) {
        return res.status(401).json({message: "invalid credentials"})
    }

    const expectedHmacTag = crypto.createHmac('sha256', process.env.SECRET).update(token).digest('base64url')

    if (hmacTag.length !== expectedHmacTag.length) {
        return res.status(401).json({message: "invalid credentials"})
    }

    try {
        if (!crypto.timingSafeEqual(Buffer.from(hmacTag), Buffer.from(expectedHmacTag))) {
            logger.info("The tag %s does not match the expected tag %s", hmacTag, expectedHmacTag )
            return res.status(401).json({message: "Invalid credentials the tag does not match"})
        }

    } catch (err) {
        return res.status(500).json({message: "Can't validate the bearer token"})
    }

    Token.findOne({token}, (err, result) => {
        if (err) return res.status(500).json({message: "error communicating with the token store"})

        if (result === null) { // can't find the token in the database
            return res.status(401).json({message: "Invalid credentials"})
        }

        req.username = result.username
        return next()
    })

})

app.get('/api/userinfo', (req,res) => {
    logger.info('userinfo endpoint username: %s', req.username)
    if (!req.username) {
        return res.json({loggedInStatus: false})
    }

    return res.json({loggedInStatus: true, username: req.username})
})


app.post('/api/increaseCounter', (req,res) => {
    if (!req.username) {
        return res.status(403).json({message: "You need a valid bearer token to use this endpoint"})
    }

    // TOOD find the user and increase

    User.findOne({username: req.username}, function(err, user) {
        if (err) return res.status(500).json({message: "Error trying to fetch user from database"})
        if (!user) return res.status(500).json({message: "There is no corresponding user in database"})
        user.counter += 1
        user.save((err,doc) => {
            if (err) return res.status(500).json({message: "Could not save the changes in the database"})
            return res.json({counter: doc.counter})
        })
    })
})

app.use((req,res,next) => {
    res.status(404).send("Not found")
})

app.listen(4000, () => {
    logger.info("Listening on port 4000")
})
