        const token = localStorage.getItem('token')
        if(!token) {
            $('.logout').hide()
            $('.register').show()
            $('.login').show()
            $('#listTodo').hide()
            $('#listDoneTodo').hide()
            $('#userLogin').hide()
            $('#desc').hide()
            $('#listProject').hide()
        } else {
            $('.logout').show()
            $('.register').hide()
            $('.login').hide()
            $('#listTodo').show()
            $('#listDoneTodo').show()
            $('#userLogin').show()
            $('#desc').show()
            getListTodo()
            getListProject()
            $('#listProject').show()
        }
        $('.register').click((event) => {
            event.preventDefault()
            $('#formRegister').show()
            $('#formLogin').hide()
        })
        $('.home').click((event) => {
            event.preventDefault()
            $('#formRegister').hide()
            $('#formLogin').hide()
            $('#listTodo').show()
        })
        $('.login').click((event) => {
            event.preventDefault()
            $('#formRegister').hide()
            $('#formLogin').show()
        })
        $('#clickRegister').click((event) => {
            event.preventDefault()
            $.ajax({
                url: `http://localhost:3000/users`,
                method: `POST`,
                data: {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    password: $('#password').val()
                }
            })
            .done((user) => {
                $('#name').val(''),
                $('#email').val(''),
                $('#password').val('')
                var toastHTML = `<span>Register Success please login!</span>`;
                M.toast({html: toastHTML});
            })
            .fail((err) => {
                var toastHTML = `<span>${err.responseJSON}</span>`;
                M.toast({html: toastHTML});
            })
        })
        $('#clickLogin').click((event) => {
            event.preventDefault()
            $.ajax({
                url: `http://localhost:3000/users/login`,
                method: `POST`,
                data: {
                    email: $('#emailLogin').val(),
                    password: $('#passwordLogin').val()
                }
            })
            .done((userLogin) => {
                localStorage.setItem('token', userLogin.token)
                localStorage.setItem('name', userLogin.name)
                localStorage.setItem('email', userLogin.email)
                getListTodo()
                $('#formLogin').hide()
                $('.logout').show()
                $('.register').hide()
                $('.login').hide()
                $('#userLogin').show()
                $('#listTodo').show()
                $('#listDoneTodo').show()
                var toastHTML = `<span>Welcome back!, ${userLogin.name}</span>`;
                M.toast({html: toastHTML});
            })
            .catch((err) => {
                console.log(err)
            })
        })
        $('#clickLogout').click((event) => {
            event.preventDefault()
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('User signed out.');
            localStorage.clear()
        });
            var toastHTML = `<span>Successfully Logout!</span>`;
            M.toast({html: toastHTML});
            $('#listTodo').hide()
            $('.login').show()
            $('.logout').hide()
            $('.register').show()
            $('#formNewTodo').hide()
            $('#userLogin').hide()
            $('#listdoneTodo').hide()
            $('#desc').hide()
            
        })
        function getListTodo () {
            $('#listTodo').empty()
            $('#listDoneTodo').empty()
            $.ajax({
                url: `http://localhost:3000/tasks`,
                method: `GET`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done((tasks) => {
                $.each(tasks, function(index, task) {
                    let condition = statusTodo(task.deadline, task.status)
                    if (condition === 'danger') {
                        $('#listTodo').append(`
                        <div class="card red darken-1">
                        <div class="card-content white-text">
                        <span class="card-title">${task.name}</span>
                        <p>${task.description}</p>
                        <p>Deadline: ${moment(new Date(task.deadline)).format('DD-MMMM-YYYY')}</p>
                        </div>
                        <div class="card-action">
                        <a class="waves-effect waves-light btn grey edit" id="${task._id}">Edit</a>
                        <hr>
                        <a class="waves-effect waves-light btn red delete" id="${task._id}">Delete</a>
                        <hr>
                        <a class="waves-effect waves-light btn green finish" id="${task._id}">Finish</a>
                        </div>
                        </div>`)
                    } else if (condition === 'warning') {
                        $('#listTodo').append(`
                        <div class="card yellow darken-1">
                        <div class="card-content black-text">
                        <span class="card-title">${task.name}</span>
                        <p>${task.description}</p>
                        <p>Deadline: ${moment(new Date(task.deadline)).format('DD-MMMM-YYYY')}</p>
                        </div>
                        <div class="card-action">
                        <a class="waves-effect waves-light btn grey edit" id="${task._id}">Edit</a>
                        <hr>
                        <a class="waves-effect waves-light btn red delete" id="${task._id}">Delete</a>
                        <hr>
                        <a class="waves-effect waves-light btn green finish" id="${task._id}">Finish</a>
                        </div>
                        </div>`)
                    } else if (condition === 'save') {
                        $('#listTodo').append(`
                        <div class="card green darken-1">
                        <div class="card-content black-text">
                        <span class="card-title">${task.name}</span>
                        <p>${task.description}</p>
                        <p>Deadline: ${moment(new Date(task.deadline)).format('DD-MMMM-YYYY')}</p>
                        </div>
                        <div class="card-action">
                        <a class="waves-effect waves-light btn grey edit" id="${task._id}">Edit</a>
                        <hr>
                        <a class="waves-effect waves-light btn red delete" id="${task._id}">Delete</a>
                        <hr>
                        <a class="waves-effect waves-light btn green finish" id="${task._id}">Finish</a>
                        </div>
                        </div>`)
                    } else if(condition === 'finish') {
                        $('#listDoneTodo').append(`
                        <div class="col s12">
                        <div class="card grey darken-1">
                        <div class="card-content black-text">
                        <span class="card-title">${task.name}</span>
                        <p>${task.description}</p>
                        <p>Deadline: ${moment(new Date(task.deadline)).format('DD-MMMM-YYYY')}</p>
                        </div>
                        <div class="card-action">
                        <a class="waves-effect waves-light btn red delete" id="${task._id}">Delete</a>
                        <hr>
                        <a class="waves-effect waves-light btn green finish" id="${task._id}">Finish</a>
                        <hr>
                        <a class="waves-effect waves-light btn orange undo" id="${task._id}">Undo Finish</a>
                        </div>
                        </div>
                        </div>`)
                    }
                    
                })
            })
            .fail((err) => {
                console.log(err)
            })
            
        }
        function statusTodo(deadline, status) {
            let deadlineDay = deadline.slice(8,10)
            let deadlineMonth = deadline.slice(5,7)
            let deadlineYear = deadline.slice(0,4)
            let today = new Date().getDate()
            let thisMonth =  new Date().getMonth() + 1
            let thisYear = new Date().getFullYear()
            var oneDay = 24*60*60*1000;
            var calcDays = Math.abs(deadlineDay) - today
            var diffDays = Math.round(calcDays/oneDay)
            console.log(diffDays, 'diff day')
            console.log(status, 'statustodo')
            console.log(deadlineDay, 'deadline, day')
            console.log(deadlineMonth, 'deadline month')
            console.log(deadlineYear, 'deadline year')
            console.log(today, 'today')
            if(deadlineDay[0]==0) {
                deadlineDay = deadlineDay[1]
            }
            if(deadlineMonth[0]==0){
                deadlineMonth = deadlineMonth[1]
            }
            if(status==='on-progress') {
                if(Number(deadlineYear) > thisYear) {
                    return 'save'
                } else if (Number(deadlineMonth) > thisMonth) {
                    return 'save'
                } else if (Number(deadlineDay) - today <= 2) {
                    return 'danger'
                } else if (Number(deadlineDay) - today <= 7) {
                    return 'warning'
                } else {
                    return 'save'
                }
            } else {
                return 'finish'
            }
        }
        $('#clickNewTodo').click((event) => {
            event.preventDefault()
            $('#listTodo').hide()
            $('#listDoneTodo').hide()
            $('#formNewTodo').show()
        })
        $('#submitTodo').click((event) => {
            event.preventDefault()
            $.ajax({
                url: `http://localhost:3000/tasks`,
                method: `POST`,
                headers: {
                    token: localStorage.getItem('token')
                },
                data: {
                    name: $('#nameTodo').val(),
                    description: $('#descTodo').val(),
                    deadline: $('#deadlineTodo').val(),
                    status: $('#statusTodo').val()
                }
            })
            .done((newTodo) => {
                getListTodo()
                $('#listTodo').show()
                $('#formNewTodo').hide()
            })
            .fail((err) => {
                console.log(err)
            })
            
        })
        
        function deleteTodo (id) {
            $('.delete').click((event) => {
                event.preventDefault()
                $.ajax({
                    url: `http://localhost:3000/tasks/${id}`,
                    method: `DELETE`,
                    headers: {
                        token: localStorage.getItem('token')
                    }
                })
                .done((deleted) => {
                    var toastHTML = `<span>${deleted.msg}</span>`;
                    M.toast({html: toastHTML});
                    getListTodo()
                    $('#listTodo').show()
                })
                .fail((err) => {
                    console.log(err)
                })
            })
        }
        $('#listTodo').on('click', '.delete', event => {
            const id = $(event.currentTarget).attr('id')
            deleteTodo(id)
        })
        $('#listDoneTodo').on('click', '.delete', event => {
            const id = $(event.currentTarget).attr('id')
            deleteTodo(id)
        })
        $('#listTodo').on('click', '.edit', event => {
            const id = $(event.currentTarget).attr('id')
         
            $.ajax({
                url: `http://localhost:3000/tasks/${id}`,
                method: `GET`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done((task) => {
                $(document).ready(function(){
                    $('select').formSelect();
                  });
                $('#updateTodo').append(`
                <div class="container">
                <h4>Edit Your Todo</h4>
                <form id="formEditTodo">
                <div class="input-field col s12">
                <input id="editNameTodo" type="text" value="${task.name}">
                <label for="editNameTodo">Name</label>
                </div>
                <div class="input-field col s12">
                <input id="editDescTodo" type="text" value="${task.description}">
                <label for="editDescTodo">Description</label>
                </div>
                <div class="input-field col s12">
                <input id="editDeadlineTodo" type="date">
                <label for="editDeadlineTodo">Deadline</label>
                </div>
                <div class="input-field col s12">
                    <select id="editStatusTodo">
                    <option value="" disabled selected>Choose your status todo</option>
                    <option value="on-progress">Doing</option>
                    <option value="finish">Done</option>
                    </select>
                </div>
                <a class="waves-effect waves-light btn red" onclick="editTodo('${task._id}')"><i class="material-icons right">edit</i>Edit</a>
                </form> 
                </div>
                `)
            })
        })
        
        function editTodo (id) {
            $.ajax({
                url: `http://localhost:3000/tasks/${id}`,
                method: `PUT`,
                headers: {
                    token: localStorage.getItem('token')
                },
                data: {
                    name: $('#editNameTodo').val(),
                    description: $('#editDescTodo').val(),
                    deadline: $('#editDeadlineTodo').val(),
                    status: $('#editStatusTodo').val()
                }
            })
            .done((newTodo) => {
                getListTodo()
                $('#listTodo').show()
                $('#updateTodo').hide()
                $('#formEditTodo').hide()
            })
            .fail((err) => {
                console.log(err)
            })
        }
        $('#listTodo').on('click', '.finish', event => {
            const id = $(event.currentTarget).attr('id')
            completeTodo(id)
        })
        function completeTodo (id) {
            $.ajax({
                url: `http://localhost:3000/tasks/${id}`,
                method: `GET`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done((task) => {
                return $.ajax({
                    url: `http://localhost:3000/tasks/${task._id}`,
                    method: `PUT`,
                    headers: {
                        token: localStorage.getItem('token')
                    },
                    data: {
                        name: task.name,
                        description: task.description,
                        deadline: task.deadline,
                        status: 'finish'
                    }
                })
                .done((response) => {
                    var toastHTML = `<span>This todo with title ${task.name} finished!</span>`;
                    M.toast({html: toastHTML});
                    getListTodo()
                    $('#listTodo').show()
                    $('#listDoneTodo').show()
                })
            })
            .fail((err) => {
                console.log(err)
            })
        }
        $('#listDoneTodo').on('click', '.undo', event => {
            const id = $(event.currentTarget).attr('id')
            uncompleteTodo(id)
        })
        function uncompleteTodo (id) {
            $.ajax({
                url: `http://localhost:3000/tasks/${id}`,
                method: `GET`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done((task) => {
                return $.ajax({
                    url: `http://localhost:3000/tasks/${task._id}`,
                    method: `PUT`,
                    headers: {
                        token: localStorage.getItem('token')
                    },
                    data: {
                        name: task.name,
                        description: task.description,
                        deadline: task.deadline,
                        status: 'on-progress'
                    }
                })
                .done((response) => {
                    var toastHTML = `<span>This todo with title ${task.name} on progress!</span>`;
                    M.toast({html: toastHTML});
                    getListTodo()
                    $('#listTodo').show()
                    $('#listDoneTodo').show()
                })
            })
            .fail((err) => {
                console.log(err)
            })
        }
        $('#myListTodo').on('click', e => {
            e.preventDefault()
            getListTodo()
            $('#todos').show()
            $('#projects').hide()
            $('#clickNewProject').hide()
            $('#clickNewTodo').show()
        })

        $('#myListProject').on('click', e => {
            e.preventDefault()
            $('#todos').hide()
            getListProject()
            $('#projects').show()
            $('#clickNewProject').show()
            $('#clickNewTodo').hide()
        })
        $('#clickNewProject').on('click', e => {
            e.preventDefault()
            $('#projects').hide()
            $('#formNewProject').show()
        })
        $('#submitProject').on('click', e => {
            e.preventDefault()
            $.ajax({
                url: `http://localhost:3000/projects`,
                method: `POST`,
                headers: {
                    token: localStorage.getItem('token')
                },
                data: {
                    name: $('#nameProject').val()
                }
            })
            .done(project => {
                
                getListProject()
                $('#projects').show()
                $('#listProject').show()
                $('#formNewProject').hide()
            
            })
            .fail(err => {
                console.log(err)
            })
        })
        function getListProject () {
            $('#listProject').empty()
            $.ajax({
                url: `http://localhost:3000/projects`,
                method: `GET`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            
            .done(projects => {
                projects.forEach(project => {
                    $('#listProject').append(`
                    <div class="card blue darken-1">
                        <div class="card-content white-text">
                        <span class="card-title">${project.name}</span>
                        <p>Project Master: ${project.master.name}</p>
                        <p>Created: ${moment(new Date(project.createdAt)).format('DD-MMMM-YYYY')}</p>
                        </div>
                        <div class="card-action">
                        <a class="waves-effect waves-light btn red delete" onclick="deleteProject('${project._id}')">Delete</a>
                        <a class="waves-effect waves-light btn green" onclick="projectDetail('${project._id}')">Detail Project</a>
                        </div>
                    </div>
                    `)
                })
               
            })
            .fail(err => {
                console.log(err)
            })
        }
        function deleteProject(id) {
            $.ajax({
                url: `http://localhost:3000/projects/${id}`,
                method: `DELETE`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(res => {
                var toastHTML = `<span>${res.msg}</span>`;
                M.toast({html: toastHTML});
                getListProject()
                $('#projects').show()
            })
            .fail(err => {
                var toastHTML = `<span>${err.responseJSON}</span>`;
                M.toast({html: toastHTML});
            })
        }
        
        function projectDetail(id) {
            $.ajax({
                url: `http://localhost:3000/projects/${id}`,
                method: `GET`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(project => {
                $('#projects').hide()
                $('#detailProject').show()
                $('#detailProj').append(`
                <div class="card blue darken-1">
                <div class="card-content white-text">
            
                <div class="row">
                <span class="card-title">${project.name}</span>
                <div class="col s12 m6 l6">
                <div class="card grey darken-1" style="margin-top: 15px;" id="todoOnProject">
            
                </div>
                </div>
                <div class="col s12 m6 l6">
                <div class="card grey darken-1">
                <p>Project Master: ${project.master.name}</p>
                <p>Created: ${moment(new Date(project.createdAt)).format('DD-MMMM-YYYY')}</p>
                <ul id="listMember">
                Member Lists
                </ul>
                </div>
                </div>
                </div>
                </div>
                <div class="card-action">
                <a class="waves-effect waves-light btn green" onclick="deleteProject('${project._id}')">Add new todo</a>
                <a class="waves-effect waves-light btn modal-trigger black" href="#triggerInvite">Invite new member</a>
                <a class="waves-effect waves-light btn red delete" onclick="deleteProject('${project._id}')">Delete</a>
                </div>
                </div>`)
                project.members.forEach((val, index) => {
                    $('#listMember').append(`<li>${index+1}. ${val.name}</li>`)
                })
                $('#detailProj').show()
            })
            .fail(err => {
                var toastHTML = `<span>${err.responseJSON}</span>`;
                M.toast({html: toastHTML});
            })
        }
        function listUser() {
            $.ajax({
                url: `http://localhost:3000/users`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(users => {
                
            })
            .fail(err => {
                var toastHTML = `<span>${err.responseJSON}</span>`;
                M.toast({html: toastHTML});
            })
        }
        