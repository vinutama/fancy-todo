var mongoose = require('mongoose')
var Schema = mongoose.Schema

var taskSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    deadline: {
        type: Date
    },
    status: {
        type: String,
        enum: ['on-progress', 'finish']
    },
    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    projectId: {
        type: Schema.Types.ObjectId, ref: `Project`,
        default: null
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
})

var Task = mongoose.model('Task', taskSchema)

module.exports = Task