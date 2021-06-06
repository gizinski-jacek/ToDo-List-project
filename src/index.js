// import * as code from './code';
// import * as DOM from './DOM';

'use strict'

const containerFolders = document.getElementById('containerFolders');
const containerToDos = document.getElementById('containerToDos');
const dropdownFolders = document.getElementById('dropdownFolders');
const inboxToDos = document.getElementById('Inbox');
const todayToDos = document.getElementById('Today');
const weekToDos = document.getElementById('Week');
const newItem = document.getElementById('newItem');
const header = document.getElementById('header');
const modalNewPage = document.getElementById('modalNewPage');
const modalEditToDo = document.getElementById('modalEditToDo');
const modalEditFolder = document.getElementById('modalEditFolder');
const modalNewMenu = document.getElementById('modalNewMenu');
const modalNewToDo = document.getElementById('modalNewToDo');
const modalNewFolder = document.getElementById('modalNewFolder');
const newToDoBtn = document.getElementById('newToDoBtn');
const newFolderBtn = document.getElementById('newFolderBtn');
const confirms = document.querySelectorAll('.confirm');
const confirmEdit = document.querySelectorAll('.confirmEdit');
const cancels = document.querySelectorAll('.cancel');
const buttonsX = document.querySelectorAll('.button-X');
const editToDo = document.getElementById('editToDo');
const editFolder = document.getElementById('editFolder');
const selectList = document.querySelectorAll('.selectList');

newItem.onclick = () => {
    modalClose(modalNewPage);
    modalNewToDo.style.display = 'flex';
}

newToDoBtn.onclick = () => {
    modalClose(modalNewPage);
    modalNewToDo.style.display = 'flex';
}

newFolderBtn.onclick = () => {
    modalClose(modalNewPage);
    modalNewFolder.style.display = 'flex';
}

window.onclick = (e) => {
    let check1 = e.target == modalNewPage;
    let check2 = e.target == modalEditToDo;
    let check3 = e.target == modalEditFolder;
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
    modalNewToDo.style.display = 'none';
    modalNewFolder.style.display = 'none';
    modalEditToDo.style.display = 'none';
    modalEditFolder.style.display = 'none';
    if (modal !== undefined) {
        modal.style.display = 'flex';
    }
}

confirms.forEach(confirm => {
    confirm.onclick = (e) => {
        let form = e.target.parentElement.parentElement;
        if (form[0].value == '') {
            alert('No ToDo name provided!');
        } else if (form[2].value == '') {
            alert('No Date provided!');
        } else {
            if (form.id == 'modalNewToDo') {
                if (libraryToDos.find(p => p.title === form[0].value)) {
                    alert('ToDo already exists! Provide unique name.');
                } else {
                    saveToDoData(form);
                }
            } else if (form.id == 'modalNewFolder') {
                if (libraryFolders.find(p => p.title === form[0].value)) {
                    alert('Folder already exists! Provide unique name.');
                } else {
                    saveFolderData(form);
                }
            }
        }
    }
})

confirmEdit.forEach(confirm => {
    confirm.onclick = (e) => {
        let form = e.target.parentElement.parentElement;
        if (form[0].value == '') {
            alert('No ToDo name provided!');
        } else {
            if (form.id == 'editToDo') {
                editToDoData(form);
            } else if (form.id == 'editFolder') {
                editFolderData(form);
            }
        }
    }
})

const editToDoData = (data) => {
    let arr = data.className.split('__');
    let todoIndex = libraryToDos.findIndex(todo => (todo.title === arr[0]) && (todo.targetFolder === arr[1]));
    libraryToDos[todoIndex].updateAllData(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value);
    displayToDos();
    saveCloseClear();
}

const editFolderData = (data) => {
    let folderIndex = libraryFolders.findIndex(folder => folder.title === data.className);
    libraryFolders[folderIndex].updateTitle = data[0].value;
    libraryToDos.forEach(todo => {
        if (todo.targetFolder === data.className) {
            todo.updateTargetFolder = data[0].value;
        }
    })
    updateCurrentOpenFolder(data[0].value);
    displayFolders();
    displayToDos();
    saveCloseClear();
}

inboxToDos.addEventListener('click', (e) => {
    updateCurrentOpenFolder(e.target.id);
    displayToDos();
})

todayToDos.addEventListener('click', (e) => {
    updateCurrentOpenFolder(e.target.id);
    displayToDos();
})

weekToDos.addEventListener('click', (e) => {
    updateCurrentOpenFolder(e.target.id);
    displayToDos();
})

dropdownFolders.onclick = () => {
    containerFolders.classList.toggle('show');
}

const saveToDoData = (data) => {
    let title = data[0].value;
    let description = data[1].value;
    let dueDate = data[2].value;
    let priority = data[3].value;
    let targetFolder = data[4].value;
    new ToDo(title, description, dueDate, priority, targetFolder);
    displayToDos();
    saveCloseClear();
}

// const checkDateFormat = (date) => {
//     let dateArray = date.split(/[\s\-]+/);
//     let year = dateArray[0];
//     let month = dateArray[1].padStart(2, 0);
//     let day = dateArray[2].padStart(2, 0);
//     let today = new Date();
//     if (year == undefined || month == undefined || day == undefined) {
//         alert('Wrong date format');
//         return false;
//     } else if ((year < today.getFullYear()) || (year > 9999)) {
//         alert('Wrong year');
//         return false;
//     } else if ((month < 1) || (month > 12)) {
//         alert('Wrong month');
//         return false;
//     } else if ((day < 1) || (day > new Date(year, month, 0).getDate())) {
//         alert('Wrong day');
//         return false;
//     } else {
//         return true;
//     }
// }

const saveFolderData = (data) => {
    new Folder(data[0].value);
    updateSelectList();
    displayFolders();
    saveCloseClear();
}

const displayFolders = () => {
    containerFolders.innerHTML = '';
    libraryFolders.forEach(item => {
        containerFolders.append(createFolderContainer(item));
    })
}

const displayToDos = () => {
    containerToDos.innerHTML = '';
    let h3 = document.createElement('h3');
    h3.textContent = currentOpenFolder;
    containerToDos.append(h3);

    let filteredList = filterToDoList();
    filteredList.forEach(todo => {
        containerToDos.append(createToDoContainer(todo));
    })
}

let currentOpenFolder = containerToDos.className;

const updateCurrentOpenFolder = (id) => {
    containerToDos.className = id;
    currentOpenFolder = id;
}

const filterToDoList = () => {
    let today = new Date();
    let dateFormat = new Date(today.getTime() - (today.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
    let newList = [];
    if (currentOpenFolder === 'Inbox') {
        return libraryToDos;
    } else if (currentOpenFolder === 'Today') {
        newList = libraryToDos.filter(item => item.dueDate == dateFormat);
        return newList;
    // } else if (currentOpenFolder === 'Week') {
    //     newList = libraryToDos.filter(item => item.dueDate >= dateFormat);
    //     console.log(newList);
    //     return newList;
    } else {
        newList = libraryToDos.filter(item => item.targetFolder === currentOpenFolder);
        return newList;
    }
}



const createPara = (text) => {
    let para = document.createElement('p');
    para.textContent = text;
    return para;
}

const createToDoContainer = (item) => {
    let main = document.createElement('div');
    main.id = 'todo__' + item.title + '__' + item.targetFolder;
    main.classList.add('todo', 'priority'+item.priority);
    main.addEventListener('click', (e) => {
        e.currentTarget.querySelectorAll('.moreDetails')[0].classList.toggle('show');
    })
    
    let cont1 = document.createElement('div');
    cont1.classList.add('fewDetails');

    let sub1 = document.createElement('div');
    sub1.append(createPara(item.dueDate));
    sub1.append(createPara(item.title));

    let sub2 = document.createElement('div');
    sub2.classList.add('controls');
    sub2.append(createEditBtn());
    sub2.append(createDelBtn());

    cont1.append(sub1);
    cont1.append(sub2);
    
    let cont2 = document.createElement('div');
    cont2.classList.add('moreDetails');
    cont2.append(createPara(item.description));
    cont2.append(createPara('Folder: ' + item.targetFolder));

    main.append(cont1);
    main.append(cont2);

    return main;
}

const createFolderContainer = (item) => {
    let main = document.createElement('div');
    main.id = 'folder__' + item.title;
    main.textContent = item.title;
    main.classList.add('folder');
    main.addEventListener('click', () => {
        updateCurrentOpenFolder(item.title);
        displayToDos();
    })
    let sub = document.createElement('div');
    sub.classList.add('controls');
    sub.append(createEditBtn());
    sub.append(createDelBtn());
    
    main.append(sub);
    
    return main;
}

const createDelBtn = () => {
    const deleteBtn = document.createElement('input');
    deleteBtn.setAttribute('type', 'image');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.src = 'imgs/delete-64.png';
    deleteBtn.alt = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
        deleteItem(e.target.closest('.folder, .todo'));
        saveAllLibraries();
        e.stopPropagation();
    })
    return deleteBtn;
}

const createEditBtn = () => {
    const editBtn = document.createElement('input');
    editBtn.setAttribute('type', 'image');
    editBtn.classList.add('editBtn');
    editBtn.src = 'imgs/edit-64.png';
    editBtn.alt = 'Edit';
    editBtn.addEventListener('click', (e) => {
        editItem(e.target.closest('.folder, .todo'));
        saveAllLibraries();
        e.stopPropagation();
    })
    return editBtn;
}

const clearForms = () => {
    document.querySelectorAll('form').forEach(form => {
        form.reset();
    })
}

const saveCloseClear = () => {
    saveAllLibraries();
    modalClose();
    clearForms();
}

const deleteItem = (el) => {
    let arr = el.id.split('__');
    if (arr[0] == 'todo') {
        let todoIndex = libraryToDos.findIndex(todo => (todo.title === arr[1]) && (todo.targetFolder === arr[2]));
        libraryToDos.splice(todoIndex, 1);
    } else if (arr[0] == 'folder') {
        let folderIndex = libraryFolders.findIndex(folder => folder.title === arr[1])
        libraryFolders.splice(folderIndex, 1);
    }
    el.remove();
}

const editItem = (el) => {
    let arr = el.id.split('__');
    if (arr[0] == 'todo') {
        let findToDO = libraryToDos.find(todo => (todo.title === arr[1]) && (todo.targetFolder === arr[2]));
        loadEditToDo(findToDO);
        modalEditToDo.style.display = 'flex';
        editToDo.className = arr[1] + '__' + arr[2];
    } else if (arr[0] == 'folder') {
        let findFolder = libraryFolders.find(folder => folder.title === arr[1]);
        loadEditFolder(findFolder);
        modalEditFolder.style.display = 'flex';
        editFolder.className = arr[1];
    }
}

const updateSelectList = () => {
    selectList.forEach(select => {
        select.innerHTML = '';
        let inbox = document.createElement('option');
        inbox.value = 'Inbox';
        inbox.textContent = 'Inbox';
        select.append(inbox);
        libraryFolders.forEach(folder => {
            let option = document.createElement('option');
            option.value = folder.title;
            option.textContent = folder.title;
            select.append(option);
        })
    })
}

const loadEditToDo = (item) => {
    editToDo[0].value = item.title;
    editToDo[1].value = item.description;
    editToDo[2].value = item.dueDate;
    editToDo[3].value = item.priority;
    updateSelectList();
}

const loadEditFolder = (item) => {
    editFolder[0].value = item.title;
}

class Folder {
    constructor(title) {
        this.title = title;
        libraryFolders.push(this);
        saveLibraryFolders();
    }
    set updateTitle(updateTitle) {
        this.title = updateTitle;
    }
}

class ToDo {
    constructor(title, description, dueDate, priority, targetFolder) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.targetFolder = targetFolder;
        libraryToDos.push(this);
        saveLibraryToDos();
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
    set updateTargetFolder(updateTargetFolder) {
        this.targetFolder = updateTargetFolder;
    }
    updateAllData(data0, data1, data2, data3, data4) {
        this.updateTitle = data0;
        this.updateDescription = data1;
        this.updateDueDate = data2;
        this.updatePriority = data3;
        this.targetFolder = data4;
    }
}

const saveAllLibraries = () => {
    saveLibraryToDos();
    saveLibraryFolders();
}

const saveLibraryToDos = () => {
    localStorage.setItem('libraryToDos', JSON.stringify(libraryToDos));
}

const saveLibraryFolders = () => {
    localStorage.setItem('libraryFolders', JSON.stringify(libraryFolders));
}

const libraryToDos = JSON.parse(localStorage.getItem('libraryToDos')) || [];
const libraryFolders = JSON.parse(localStorage.getItem('libraryFolders')) || [];

const loadDefaults = () => {
    let new123test = new Folder('Kitchen');
    let new234test = new Folder('House');
    let new345test = new Folder('Gym');

    let new666 = new ToDo('Jake Mail', 'Send Email to Jake about upcoming project', '2025-01-01', 'High', 'Inbox');
    let new667 = new ToDo('Basement', 'Clean trash from basement', '2027-02-02', 'Medium', 'House');
    let new778 = new ToDo('Lightbulb', 'Replace kitchen lightbulb', '2021-06-08', 'Low', 'Kitchen');
    let new889 = new ToDo('Carpet', 'Clean the carpet', new Date().toISOString().split("T")[0], 'Low', 'House');
    let new989 = new ToDo('Gym', 'Renew gym membership', new Date().toISOString().split("T")[0], 'Medium', 'Gym');
}

if ((!localStorage.getItem('libraryToDos')) && (!localStorage.getItem('libraryFolders'))) {
    loadDefaults();
}

// Should I populate with defaults if user decides to delete all folder and todos?
if ((libraryToDos.length === 0) && (libraryFolders.length === 0)) {
    loadDefaults();
}

displayFolders();
displayToDos();
clearForms();
updateSelectList();
