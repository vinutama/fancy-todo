const Task = require('../models/Task')
var moment = require('moment')
const Project = require('../models/Project')

module.exports = {
    createTask: function (req, res) {
        let newTask = {
            name: req.body.name,
            description: req.body.description,
            deadline: moment(new Date(req.body.deadline)).format('DD-MMM-YY hh:mm'),
            status: req.body.status,
            userId: req.currentUser.id,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        Task
            .create(newTask)
            .then((task) => {
                res.status(201).json(task)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    },
    findTasks: function(req, res) {
        Task
            .find({ userId: req.currentUser.id })
            .sort('-updatedAt')
            .populate('userId', '-password')
            .then((tasks) => {
                res.status(200).json(tasks)
            })
            .catch((err) => {
                res.status(500).json(err.message)
            })
    },
    findOneTask: function(req, res) {
        Task
            .findOne({ _id: req.params.id })
            .populate('userId', '-password')
            .then((task) => {
                res.status(200).json(task)
            })
            .catch((err) => {
                res.status(500).json(err.message)
            })
    },
    deleteTask: function (req, res) {
        Task
            .findByIdAndDelete({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    msg: `Task deleted!`
                })
            })
            .catch((err) => {
                res.status(500).json(err.message)
            })
    },
    editTask: function(req, res) {
        let updateTask = {
            name: req.body.name,
            description: req.body.description,
            deadline: moment(new Date(req.body.deadline)).format('DD-MMM-YY hh:mm'),
            status: req.body.status,
            userId: req.currentUser.id
        }
        Task
            .findByIdAndUpdate({ _id: req.params.id }, updateTask)
            .then((prevData) => {
                return Task
                         .findOne({ _id: req.params.id })
                         .then((newTask) => {
                             res.status(200).json(newTask)
                         })
            })
            .catch((err) => {
                res.status(500).json(err.message)
            })
    },
    

}