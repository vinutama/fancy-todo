const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
    name: {
        type: String
    },
    members: [
        {
            type: Schema.Types.ObjectId, ref: `User`
        }
    ],
    master: {
        type: Schema.Types.ObjectId, ref: `User`
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project