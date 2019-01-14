var express = require('express');
var router = express.Router();
var Auth = require('../middlewares/index')
var taskController = require('../controllers/taskController')

/*middleware checklogin */
router.use(Auth.isLogin)

/*Create new task */
router.post('/', taskController.createTask)

/*Find all task user login */
router.get('/', taskController.findTasks)

/*Find one task user login*/
router.get('/:id', taskController.findOneTask)

/*Delete task*/
router.delete('/:id', taskController.deleteTask)

/*Edit task*/
router.put('/:id', taskController.editTask)


module.exports = router