// import * as code from './code';
// import * as DOM from './DOM';

'use strict'

const projectsContainer = document.getElementById('projectsContainer');
const tasksContainer = document.getElementById('tasksContainer');
const projectsDropdown = document.getElementById('projectsDropdown');
const inbox = document.getElementById('Inbox');
const newItem = document.getElementById('newItem');
const header = document.getElementById('header');
const modalNewPage = document.getElementById('modalNewPage');
const modalEditTask = document.getElementById('modalEditTask');
const modalEditProj = document.getElementById('modalEditProj');
const modalNewMenu = document.getElementById('modalNewMenu');
const modalNewTask = document.getElementById('modalNewTask');
const modalNewProject = document.getElementById('modalNewProject');
const newTaskBtn = document.getElementById('newTaskBtn');
const newProjectBtn = document.getElementById('newProjectBtn');
const confirms = document.querySelectorAll('.confirm');
const confirmEdit = document.querySelectorAll('.confirmEdit');
const cancels = document.querySelectorAll('.cancel');
const buttonsX = document.querySelectorAll('.button-X');
const editTask = document.getElementById('editTask');
const editProj = document.getElementById('editProj');

newItem.onclick = () => {
    modalClose(modalNewPage);
    modalNewTask.style.display = 'flex';
}

newTaskBtn.onclick = () => {
    modalClose(modalNewPage);
    modalNewTask.style.display = 'flex';
}

newProjectBtn.onclick = () => {
    modalClose(modalNewPage);
    modalNewProject.style.display = 'flex';
}

window.onclick = (e) => {
    let check1 = e.target == modalNewPage;
    let check2 = e.target == modalEditTask;
    let check3 = e.target == modalEditProj;
    if (check1 || check2 || check3) {
        modalClose();
    }
}

buttonsX.forEach(cancel => {
    cancel.onclick = () => {
        modalClose();
    }
})

cancels.forEach(cancel => {
    cancel.onclick = () => {
        modalClose();
    }
})

const modalClose = (modal = undefined) => {
    modalNewPage.style.display = 'none';
    modalNewTask.style.display = 'none';
    modalNewProject.style.display = 'none';
    modalEditTask.style.display = 'none';
    modalEditProj.style.display = 'none';
    if (modal !== undefined) {
        modal.style.display = 'flex';
    }
}

confirms.forEach(confirm => {
    confirm.onclick = (e) => {
        let form = e.target.parentElement.parentElement;
        if (form[0].value == '') {
            alert('No task name provided!');
        } else {
            if (form.id == 'modalNewTask') {
                saveTaskData(form);
            } else if (form.id == 'modalNewProject') {
                saveProjectData(form);
            }
        }
    }
})

confirmEdit.forEach(confirm => {
    confirm.onclick = (e) => {
        let form = e.target.parentElement.parentElement;
        if (form[0].value == '') {
            alert('No task name provided!');
        } else {
            if (form.id == 'editTask') {
                editTaskData(form);
            } else if (form.id == 'editProj') {
                editProjectData(form);
            }
        }
    }
})

const editTaskData = (data) => {
    console.log(data)
    let taskIndex = tasksList.findIndex(task => task.title == data.className);
    tasksList[taskIndex].updateAllData(data[0].value, data[1].value, data[2].value, data[3].value);
    saveAllLib();
    displayTasks();
    modalClose();
    clearAllForms();
}

const editProjectData = (data) => {
    let projIndex = projectsList.findIndex(proj => proj.title == data.className);
    projectsList[projIndex].updateTitle = data[0].value;
    tasksList.forEach(task => {
        if (task.targetProject == data.className) {
            task.updateTargetProject = data[0].value;;
        }
    })
    saveAllLib();
    displayProjects();
    modalClose();
    clearAllForms();
}

inbox.addEventListener('click', (e) => {
    updateCurrentOpenProject(e.target.id);
    displayTasks();
})

projectsDropdown.onclick = () => {
    projectsContainer.classList.toggle('show');
}

// 1...2,,,3   4---5
// 2010-13-35
// 2022-01-01
const saveTaskData = (data) => {
    let title = data[0].value;
    let description = data[1].value;
    let dueDate = data[2].value;
    let priority = data[3].value;
    let targetProject = currentOpenProject;
    let dateArray = data[2].value.split(/[\s\,\.\-]+/)
    if (checkDateFormat(dateArray[0], dateArray[1], dateArray[2]) == false) {
        alert('Wrong date!');
    } else {
        new Task(title, description, dueDate, priority, targetProject);
        saveAllLib();
        displayTasks();
        modalClose();
        clearAllForms();
    }
}

const checkDateFormat = (year, month, day) => {
    let today = new Date();
    if (year == undefined || month == undefined || day == undefined) {
        return false;
    }
    if (new Date(year, month, day) < new Date()) {
        return false;
    }
    if ((year < today.getFullYear()) || (year > 9999)) {
        return false;
    }
    if ((month < 1) || (month > 12)) {
        return false;
    }
    if ((day < 1) || (day > 31)) {
        return false;
    }
}

const saveProjectData = (data) => {
    new Project(data[0].value);
    saveAllLib();
    displayProjects();
    modalClose();
    clearAllForms();
}

const displayProjects = () => {
    projectsContainer.innerHTML = '';
    projectsList.forEach(item => {
        projectsContainer.append(createProjectContainer(item));
    })
}

const displayTasks = () => {
    tasksContainer.innerHTML = '';
    let h3 = document.createElement('h3');
    h3.textContent = currentOpenProject;
    tasksContainer.append(h3);
    if (currentOpenProject == 'Inbox') {
        tasksList.forEach(item => {
            tasksContainer.append(createTaskContainer(item));
        })
    } else {
        let newList = filterTaskList(currentOpenProject);
        newList.forEach(item => {
            tasksContainer.append(createTaskContainer(item));
        })
    }
}

let currentOpenProject = tasksContainer.className;

const updateCurrentOpenProject = (id) => {
    tasksContainer.className = id;
    currentOpenProject = id;
    return currentOpenProject;
}

const filterTaskList = (projID) => {
    return tasksList.filter(item => item.targetProject == projID);
}

const createPara = (text) => {
    let para = document.createElement('p');
    para.textContent = text;
    return para;
}

const createTaskContainer = (item) => {
    let div = document.createElement('div');
    div.id = 'task__' + item.title;
    div.classList.add('task');

    let cont = document.createElement('div');
    cont.append(createPara(item.title))
    cont.append(createPara(item.description))
    cont.append(createPara(item.dueDate))
    cont.append(createPara(item.priority))
    cont.append(createPara(item.targetProject))

    div.append(cont);
    div.append(createEditButton());
    div.append(createDeleteButton());

    return div;
}

const createProjectContainer = (item) => {
    let div = document.createElement('div');
    div.id = 'project__' + item.title;
    div.classList.add('project');

    let cont = document.createElement('button');
    cont.setAttribute('type', 'button');
    cont.textContent = item.title;
    cont.addEventListener('click', () => {
        updateCurrentOpenProject(item.title);
        displayTasks();
    })

    div.append(cont);
    div.append(createEditButton());
    div.append(createDeleteButton());

    return div;
}

const createDeleteButton = () => {
    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.textContent = 'x';
    deleteBtn.addEventListener('click', (e) => {
        deleteItem(e.target.parentElement);
        saveAllLib();
    })
    
    return deleteBtn;
}

const createEditButton = () => {
    const editBtn = document.createElement('button');
    editBtn.setAttribute('type', 'button');
    editBtn.classList.add('editBtn');
    editBtn.textContent = '?';
    editBtn.addEventListener('click', (e) => {
        editItem(e.target.parentElement);
        saveAllLib();
    })

    return editBtn;
}

const clearAllForms = () => {
    document.querySelectorAll('form').forEach(form => {
        form.reset();
    })
}

const deleteItem = (el) => {
    let arr = el.id.split('__');
    if (arr[0] == 'task') {
        let taskIndex = tasksList.findIndex(task => task.title == arr[1])
        tasksList.splice(taskIndex, 1);
    } else if (arr[0] == 'project') {
        let projIndex = projectsList.findIndex(proj => proj.title == arr[1])
        projectsList.splice(projIndex, 1);
    }
    el.remove();
}

const editItem = (el) => {
    let arr = el.id.split('__');
    if (arr[0] == 'task') {
        let findTask = tasksList.find(task => task.title == arr[1])
        loadEditTask(findTask);
        modalEditTask.style.display = 'flex';
        editTask.className = arr[1];
    } else if (arr[0] == 'project') {
        let findProj = projectsList.find(proj => proj.title == arr[1])
        loadEditProject(findProj);
        modalEditProj.style.display = 'flex';
        editProj.className = arr[1];
    }
}

const loadEditTask = (item) => {
    editTask[0].value = item.title;
    editTask[1].value = item.description;
    editTask[2].value = item.dueDate;
    editTask[3].value = item.priority;
}

const loadEditProject = (item) => {
    editProj[0].value = item.title;
}

const projectsList = [];
const tasksList = [];

const saveAllLib = () => {
    saveProjLib();
    saveTaskLib();
}

const saveProjLib = () => {
    localStorage.setItem('projectsList', JSON.stringify(projectsList));
}

const saveTaskLib = () => {
    localStorage.setItem('tasksList', JSON.stringify(tasksList));
}

// function loadLib() {
//     return JSON.parse(localStorage.getItem('tasksList'));
// }

class Project {
    constructor(title) {
        this.title = title;
        projectsList.push(this);
        saveProjLib();
    }
    set updateTitle(updateTitle) {
        this.title = updateTitle;
    }
}

class Task {
    constructor(title, description, dueDate, priority, targetProject) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.targetProject = targetProject;
        tasksList.push(this);
        saveTaskLib();
    }
    set updateTitle(updateTitle) {
        this.title = updateTitle;
    }
    set updateDescription(updateDescription) {
        this.description = updateDescription;
    }
    set updatePriority(updatePriority) {
        this.priority = updatePriority;
    }
    set updateDueDate(updateDueDate) {
        this.dueDate = updateDueDate;
    }
    set updateTargetProject(updateTargetProject) {
        this.targetProject = updateTargetProject;
    }
    updateAllData(data0, data1, data2, data3) {
        this.updateTitle = data0;
        this.updateDescription = data1;
        this.updateDueDate = data2;
        this.updatePriority = data3;
    }
}

let new123test = new Project(11);
let new234test = new Project('As');
let new345test = new Project('as');

let new666 = new Task(555, 555, '2022-01-01', 'high', 'Inbox');
let new667 = new Task(666, 666, '2024-04-04', 'medium', '11');
let new778 = new Task(777, 777, '2026-07-07', 'low', 'As');
let new889 = new Task(888, 888, '2028-10-10', 'medium', 'as');
let new989 = new Task(989, 989, '2028-10-10', 'low', 'as');

displayProjects();
displayTasks();
clearAllForms();