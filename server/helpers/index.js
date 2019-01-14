const jwt = require('jsonwebtoken')
require('dotenv').config()



module.exports = {
    validateEmail: function (email) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email)
    },
    generateJsonToken: function (user) {
        return jwt.sign(user, process.env.jwt_secret)
    }
}