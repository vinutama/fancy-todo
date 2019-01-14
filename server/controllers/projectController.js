const Project = require('../models/Project')
const Task = require('../models/Task')
const User = require('../models/User')
const moment = require('moment')

module.exports = {
    create: function(req, res) {
        let newProject = {
            name: req.body.name,
            members: req.currentUser.id,
            master: req.currentUser.id,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        Project
            .create(newProject)
            .then(project => {
                res.status(201).json(project)
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`
                })
            })
    },
    findProjectLoginUser: function(req, res) {
        Project
            .find({ members: req.currentUser.id })
            .populate('members', '-password')
            .populate('master', '-password')
            .sort('-updatedAt')
            .then(projects => {
                res.status(200).json(projects)
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`
                })
            })
    },
    findOneProject: function(req, res) {
        Project
            .findOne({ _id: req.params.id })
            .populate('members', '-password')
            .populate('master', '-password')
            .then(project => {
                res.status(200).json(project)
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`
                })
            })
    },
    deleteProject: function(req, res) {
        Project
            .findOneAndDelete({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    msg: `Successfully deleted this project`
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`
                })
            })
    },
    inviteMember: function(req, res) {
        User
            .findOne({ _id: req.params.userId })
            .then(user => {
                return Project
                    .findOneAndUpdate({ _id: req.params.projectId }, { $push: { members: user._id }}, { new: true })
            })
            .then(newProject => {
                res.status(200).json(newProject)
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`
                })
            })
    },
    addTaskToProject: function(req, res) {
        console.log('masuk controller')
       Project
        .findOne({ _id: req.params.projectId })
        .then(project => {
            let newTask = {
                name: req.body.name,
                description: req.body.description,
                deadline: moment(new Date(req.body.deadline)).format('DD-MMM-YY hh:mm'),
                status: req.body.status,
                userId: req.currentUser.id,
                projectId: project._id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            console.log(newTask)
            return Task
                    .create(newTask)
        })
        .then(newTask => {
            res.status(201).json(newTask)
        })
        .catch(err => {
            res.status(500).json({
                msg: `Internal server error`
            })
        })
    }
}