var mongoose = require('mongoose')
var Schema = mongoose.Schema
var helpers = require('../helpers/index')
var bcrypt = require('bcryptjs')

var userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name must be filled']
    },
    email: {
        type: String,
        required: [true, 'Email must be filled'],
        validate: [
            {
                validator: helpers.validateEmail, msg: `Please fill valid format email!`,
                
            },
            {
                validator: function (email) {
                    return new Promise(function (resolve, reject) {
                        User.findOne({ email: email })
                            .then(function (found) {
                                if (found) {
                                    reject(false)
                                } else {
                                    resolve(true)
                                }
                            })
                    })
                }, msg: `Email already exists`
            }
        ]
    },
    password: {
        type: String,
        required: [true, 'Password must be filled'],
        minlength: [7, 'Password must have minimal input 7 characters']
    },
    isGoogle: {
        type: Boolean,
        default: false
    }

})

userSchema.pre('save', function(next) {
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
    next()
})

var User = mongoose.model('User', userSchema)
module.exports = User