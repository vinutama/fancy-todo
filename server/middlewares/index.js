const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {OAuth2Client} = require('google-auth-library')
const CLIENT_ID = process.env.CLIENT_ID
const client = new OAuth2Client(CLIENT_ID)
const Project = require('../models/Project')

module.exports = {
    isLogin: function (req, res, next) {
        let token = req.headers.token
        if (token) {
            let decoded = jwt.verify(token, process.env.jwt_secret)
            User
                .findOne({ email: decoded.email })
                .then((user) => {
                    if (user) {
                        req.currentUser = {
                            id: user._id,
                            name: user.name,
                            email: user.email
                        }
                        next()
                    } else {
                        res.status(400).json({
                            msg: `Please login first!`
                        })
                    }
                })
                .catch((err) => {
                    res.status(500).json(err.message)
                })
        }
    },
    googleLogin: function(req, res, next) {
        client.verifyIdToken({
            idToken: req.body.gToken,
            audience: CLIENT_ID
        }, function(err, result) {
            if(err) {
                console.log(err)
                res.send(500).json(err)
            } else {
                const payload = result.getPayload()
                console.log(payload)
                let user = {
                    email: payload.email,
                    name: payload.name
                }
                req.currentUser = user
                next()
            }
        })
    },
    checkProjectMaster: function(req, res, next) {
        Project
            .findOne({ _id: req.params.id })
            .then(project => {
                if (String(project.master) === String(req.currentUser.id)) {
                    next()
                } else {
                    res.status(401).json({
                        msg: `Unauthorized User`
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`
                })
            })
    },
    checkMembers: function(req, res, next) {
        Project
            .findOne({ _id: req.params.projectId })
            .then(project => {
                let filtered = project.members.filter(val => {
                    return String(val) === String(req.currentUser.id)
                })
                if (filtered.length) {
                    console.log('masuk next')
                    next()
                } else {
                    res.status(401).json({
                        msg: `You're not allowed to invite because you're not part of this project`
                    })
                }
            })
            .catch(err => {
                res.status(401).json({
                    msg: `Please login first`
                })
            })
    }
}