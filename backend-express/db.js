const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf, splat, json , cli} = format
const mongoose = require('mongoose')
const { Schema } = mongoose;
const bcrypt = require('bcrypt')


const userSchema = new Schema({
    username: {type: String, required: true, index: { unique: true}}, 
    password: {type: String, required: true}
})

userSchema.pre('save', function(next) { 
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    
    // generate a salt
    bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(user.password, salt)
    }).then((hash) => {
        user.password = hash
        return next()
    }).catch((err) => {
        return next(err)
    })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password).then((isMatch) => {
        return callback(null, isMatch)
    }).catch((err) => {
        return callback(err)
    })
}

const logger = createLogger({
    format: combine(
        timestamp(),
        splat(),
        cli()
    ),
    transports: [ new transports.Console() ]
})

module.exports = function connectionFactory() { 
    // multiple connections: https://mongoosejs.com/docs/connections.html#multiple_connections
    logger.info("Get new mongoose connection")
    const conn = mongoose.createConnection("mongodb://localhost:27017/test")
    conn.model('User', userSchema)
    return conn
}
