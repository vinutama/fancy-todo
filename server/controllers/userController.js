const User = require('../models/User')
const helpers = require('../helpers')
const bcrypt = require('bcryptjs')
const Project = require('../models/Project')


module.exports = {
    signUp: function (req, res) {
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        User
            .create(newUser)
            .then((user) => {
               res.status(201).json(user)
            })
            .catch((err) => {
                var emailError = err.errors.email
                var nameError = err.errors.name
                var passError = err.errors.password
                if (nameError) {
                    res.status(400).json(nameError.message)
                } else if (emailError) {
                    res.status(400).json(emailError.message)
                } else if (passError) {
                    res.status(400).json(passError.message)
                }
            })
    },
    signIn: function(req, res) {
        User
            .findOne({ email: req.body.email })
            .then((user) => {
                if(user) {
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                        let token = helpers.generateJsonToken({
                            name: user.name,
                            email: user.email
                        })
                        res.status(200).json({
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            token: token
                        })
                    } else {
                        res.status(400).json({
                            msg: `Wrong password!`
                        })
                    }
                } else {
                    res.status(400).json({
                        msg: `Wrong Email!`
                    })
                }
            })
            .catch((err) => {
                res.status(500).json(err.message)
            })
    },
    googleSignIn: function(req, res) {
        User
            .findOne({ email: req.currentUser.email })
            .then(gUser => {
                if (!gUser) {
                    User
                        .create({
                            name: req.currentUser.name,
                            email: req.currentUser.email,
                            password: process.env.password,
                        })
                        .then(user => {
                            res.status(200).json({
                                msg: `Google Login Success`
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                msg: `Internal server error`
                            })
                        })
                } else {
                    console.log(gUser)
                    const token = helpers.generateJsonToken({
                        email: gUser.email,
                        name: gUser.name
                    })
                    if(token) {
                        res.status(200).json({
                            token: token,
                            msg: `Google Login Success`
                        })
                    } else {
                        res.status(500).json({
                            msg: `Failed login with google`
                        })
                    }
                }
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`
                })
            })
    },
    findAll: function(req, res) {
      Project
        .findOne({ _id: req.params.projectId })
        .then(project => {
            User
                .find({ _id: project.members })
                .then(users => {
                    Project 
                        .find({ _id})
                })
        })
    }
}