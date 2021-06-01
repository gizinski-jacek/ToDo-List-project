// import * as code from './code';
// import * as DOM from './DOM';

'use strict'

const projectsContainer = document.getElementById('projectsContainer');
const tasksContainer = document.getElementById('tasksContainer');
const projectsDropdown = document.getElementById('projectsDropdown');
const inboxTasks = document.getElementById('Inbox');
const todayTasks = document.getElementById('Today');
const weekTasks = document.getElementById('Week');
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
const selectList = document.querySelectorAll('.selectList');

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
        clearForms();
    }
})

//
// Awaiting cleanup!
//
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
                if (tasksList.find(p => p.title === form[0].value)) {
                    alert('Task already exists! Provide unique name.');
                } else {
                    saveTaskData(form);
                }
            } else if (form.id == 'modalNewProject') {
                if (projectsList.find(p => p.title === form[0].value)) {
                     alert('Project already exists! Provide unique name.');
                } else {
                    saveProjectData(form);
                }
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
    let arr = data.className.split('__');
    let taskIndex = tasksList.findIndex(task => (task.title === arr[0]) && (task.targetProject === arr[1]));
    tasksList[taskIndex].updateAllData(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value);
    saveCloseClear();
    displayTasks();
}

const editProjectData = (data) => {
    let projIndex = projectsList.findIndex(proj => proj.title === data.className);
    projectsList[projIndex].updateTitle = data[0].value;
    tasksList.forEach(task => {
        if (task.targetProject === data.className) {
            task.updateTargetProject = data[0].value;;
        }
    })
    saveCloseClear();
    // Needed for now
    displayTasks();
    //
    displayProjects();
}

inboxTasks.addEventListener('click', (e) => {
    updateCurrentOpenProject(e.target.id);
    displayTasks();
})

todayTasks.addEventListener('click', (e) => {
    updateCurrentOpenProject(e.target.id);
    displayTasks();
})

weekTasks.addEventListener('click', (e) => {
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
    let targetProject = data[4].value;
    if (checkDateFormat(dueDate)) {
        new Task(title, description, dueDate, priority, targetProject);
        saveCloseClear();
        displayTasks();
    }
}

const checkDateFormat = (date) => {
    let dateArray = date.split(/[\s\,\.\-]+/);
    let year = dateArray[0];
    let month = dateArray[1].padStart(2, 0);
    let day = dateArray[2].padStart(2, 0);
    let today = new Date();
    if (year == undefined || month == undefined || day == undefined) {
        alert('Wrong date format');
        return false;
    } else if ((year < today.getFullYear()) || (year > 9999)) {
        alert('Wrong year');
        return false;
    } else if ((month < 1) || (month > 12)) {
        alert('Wrong month');
        return false;
    } else if ((day < 1) || (day > new Date(year, month, 0).getDate())) {
        alert('Wrong day');
        return false;
    } else {
        return true;
    }
}

const saveProjectData = (data) => {
    new Project(data[0].value);
    saveCloseClear();
    updateSelectList();
    displayProjects();
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

    let filteredList = filterTaskList();
    filteredList.forEach(task => {
        tasksContainer.append(createTaskContainer(task));
    })
}

let currentOpenProject = tasksContainer.className;

const updateCurrentOpenProject = (id) => {
    // tasksContainer.className = id;
    currentOpenProject = id;
}

const filterTaskList = () => {
    let today = new Date();
    let dateFormat = new Date(today.getTime() - (today.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
    let newList = [];
    if (currentOpenProject === 'Inbox') {
        return tasksList;
    } else if (currentOpenProject === 'Today') {
        newList = tasksList.filter(item => item.dueDate == dateFormat);
        return newList;
    // } else if (currentOpenProject === 'Week') {
    //     newList = tasksList.filter(item => item.dueDate >= dateFormat);
    //     console.log(newList);
    //     return newList;
    } else {
        newList = tasksList.filter(item => item.targetProject === currentOpenProject);
        return newList;
    }
}

const createPara = (text) => {
    let para = document.createElement('p');
    para.textContent = text;
    return para;
}

const createTaskContainer = (item) => {
    let div = document.createElement('div');
    div.id = 'task__' + item.title + '__' + item.targetProject;
    div.classList.add('task');

        let cont = document.createElement('div');
        cont.append(createPara(item.title))
        cont.append(createPara(item.description))
        cont.append(createPara(item.dueDate))
        cont.append(createPara(item.priority))
        cont.append(createPara(item.targetProject))

    div.append(cont);
    div.append(createDeleteButton());
    div.append(createEditButton());

    return div;
}

const createProjectContainer = (item) => {
    let div = document.createElement('div');
    div.id = 'project__' + item.title;
        let cont = document.createElement('button');
        cont.setAttribute('type', 'button');
        cont.classList.add('project');
        cont.textContent = item.title;
        cont.addEventListener('click', () => {
            updateCurrentOpenProject(item.title);
            displayTasks();
        })
    div.append(cont);
    div.append(createDeleteButton());
    div.append(createEditButton());

    return div;
}

const createDeleteButton = () => {
    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.textContent = 'Dlt';
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
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', (e) => {
        editItem(e.target.parentElement);
        saveAllLib();
    })
    return editBtn;
}

const clearForms = () => {
    document.querySelectorAll('form').forEach(form => {
        form.reset();
    })
}

const saveCloseClear = () => {
    saveAllLib();
    modalClose();
    clearForms();
}

const deleteItem = (el) => {
    let arr = el.id.split('__');
    if (arr[0] == 'task') {
        let taskIndex = tasksList.findIndex(task => (task.title === arr[1]) && (task.targetProject === arr[2]));
        tasksList.splice(taskIndex, 1);
    } else if (arr[0] == 'project') {
        let projIndex = projectsList.findIndex(proj => proj.title === arr[1])
        projectsList.splice(projIndex, 1);
    }
    el.remove();
}

const editItem = (el) => {
    let arr = el.id.split('__');
    if (arr[0] == 'task') {
        let findTask = tasksList.find(task => (task.title === arr[1]) && (task.targetProject === arr[2]));
        loadEditTask(findTask);
        modalEditTask.style.display = 'flex';
        editTask.className = arr[1] + '__' + arr[2];
    } else if (arr[0] == 'project') {
        let findProj = projectsList.find(proj => proj.title === arr[1]);
        loadEditProject(findProj);
        modalEditProj.style.display = 'flex';
        editProj.className = arr[1];
    }
}

const updateSelectList = () => {
    selectList.forEach(select => {
        select.innerHTML = '';
        let inbox = document.createElement('option');
        inbox.value = 'Inbox';
        inbox.textContent = 'Inbox';
        select.append(inbox);
        projectsList.forEach(proj => {
            let option = document.createElement('option');
            option.value = proj.title;
            option.textContent = proj.title;
            select.append(option);
        })
    })
}

const loadEditTask = (item) => {
    editTask[0].value = item.title;
    editTask[1].value = item.description;
    editTask[2].value = item.dueDate;
    editTask[3].value = item.priority;
    updateSelectList();
}

const loadEditProject = (item) => {
    editProj[0].value = item.title;
}

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
    updateAllData(data0, data1, data2, data3, data4) {
        this.updateTitle = data0;
        this.updateDescription = data1;
        this.updateDueDate = data2;
        this.updatePriority = data3;
        this.targetProject = data4;
    }
}

const saveAllLib = () => {
    saveProjLib();
    saveTaskLib();
}

const saveTaskLib = () => {
    localStorage.setItem('tasksList', JSON.stringify(tasksList));
}

const saveProjLib = () => {
    localStorage.setItem('projectsList', JSON.stringify(projectsList));
}

const tasksList = JSON.parse(localStorage.getItem('tasksList')) || [];
const projectsList = JSON.parse(localStorage.getItem('projectsList')) || [];

const loadDefaults = () => {
    let new123test = new Project('Kitchen');
    let new234test = new Project('House');
    let new345test = new Project('Gym');

    let new666 = new Task('Jake Mail', 'Send Email to Jake about upcoming project', '2025-01-01', 'high', 'Inbox');
    let new667 = new Task('Basement', 'Clean trash from basement', '2027-02-02', 'medium', 'House');
    let new778 = new Task('Lightbulb', 'Replace kitchen lightbulb', '2021-06-08', 'low', 'Kitchen');
    let new889 = new Task('Carpet', 'Clean the carpet', '2021-06-01', 'low', 'House');
    let new989 = new Task('Gym', 'Renew gym membership', '2029-05-05', 'medium', 'Gym');
}

if ((!localStorage.getItem('tasksList')) && (!localStorage.getItem('projectsList'))) {
    loadDefaults();
}

// Should I populate with defaults if user decides to delete all projects and tasks?
if ((tasksList.length === 0) && (projectsList.length === 0)) {
    loadDefaults();
}

displayProjects();
displayTasks();
clearForms();
updateSelectList();
