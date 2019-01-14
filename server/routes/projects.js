const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const { isLogin, checkProjectMaster, checkMembers} = require('../middlewares')

router.use(isLogin)

/*create new project*/
router.post('/', projectController.create)

/*find all projects logged in users*/
router.get('/', projectController.findProjectLoginUser)

/*find one project*/
router.get('/:id', projectController.findOneProject)


/*delete project*/
router.delete('/:id', checkProjectMaster, projectController.deleteProject)

/*invite member*/
router.put('/:userId/:projectId', checkMembers, projectController.inviteMember)

/*add task to project*/
router.post('/task/:projectId', checkMembers, projectController.addTaskToProject)

module.exports = router