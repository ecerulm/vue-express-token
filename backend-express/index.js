const express = require('express');
const bodyParser = require('body-parser')

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf, splat, json , cli} = format
const crypto = require('crypto')

const db = require('./db.js')

const conn = db()
const User = conn.model('User')

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
app.post('/api/reset', (req, res) => {
    // TODO store password as bcrypt hash
    User.collection.drop()
    new User({username: 'aaa', password: 'bbb'}).save().then(savedDoc => logger.info('saved %s', savedDoc))
    res.json({"message": "users created"})
})

app.use(bodyParser.json())


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

        user.comparePassword(password, function(err, isMatch) {
            if (err) return res.status(401).json({message: "error when comparing hashed password"})
            if (!isMatch) {
                return res.status(401).json({message: "Invalid credentials"})
            }
            const randomToken = crypto.randomBytes(16).toString('base64url')
            const hmacTab = crypto.createHmac('sha256', process.env.SECRET).update(randomToken).digest('base64url')

            const token = `${randomToken}:${hmacTab}`
    
            return res.json({token})
        })    
    })
})

logger.info("Define /api/status endpoint")
app.get("/api/status", (req,res,next) => {
    logger.info("status")
    res.json({message: "service running"})
})

app.use((req,res,next) => {
    res.status(404).send("Not found")
})

app.listen(6000, () => {
    logger.info("Listening on port 6000")
})
