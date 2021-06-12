// import * as code from './code';
// import * as DOM from './DOM';
import { DateTime } from 'luxon';

'use strict'

const inboxToDos = document.getElementById('Inbox');
const todayToDos = document.getElementById('Today');
const weekToDos = document.getElementById('Week');
const containerToDos = document.getElementById('containerToDos');
const containerFolders = document.getElementById('containerFolders');
const dropdownFolders = document.getElementById('dropdownFolders');

const newItem = document.getElementById('newItem');
const newToDoBtn = document.getElementById('newToDoBtn');
const newFolderBtn = document.getElementById('newFolderBtn');

const modalNew = document.getElementById('modalNew');
const modalNewToDo = document.getElementById('modalNewToDo');
const modalNewFolder = document.getElementById('modalNewFolder');
const modalEditToDo = document.getElementById('modalEditToDo');
const modalEditFolder = document.getElementById('modalEditFolder');

const confirmNew = document.querySelectorAll('.confirmNew');
const confirmEdit = document.querySelectorAll('.confirmEdit');
const cancels = document.querySelectorAll('.cancel');
const buttonsX = document.querySelectorAll('.button-X');
const editToDo = document.getElementById('editToDo');
const editFolder = document.getElementById('editFolder');
const selectList = document.querySelectorAll('.selectList');

const newToDoTitle = document.getElementById('newToDoTitle');
const newToDoDescription = document.getElementById('newToDoDescription');
const newToDoDueDate = document.getElementById('newDueDate');
const newToDoPriority = document.getElementById('newPriority');
const newToDoTargetFolder = document.getElementById('newTargetFolder');
const newFolderTitle = document.getElementById('newFolderTitle');

const editToDoTitle = document.getElementById('editToDoTitle');
const editToDoDescription = document.getElementById('editToDoDescription');
const editToDoDueDate = document.getElementById('editDueDate');
const editToDoPriority = document.getElementById('editPriority');
const editToDoTargetFolder = document.getElementById('editTargetFolder');
const editFolderTitle = document.getElementById('editFolderTitle');

let currentOpenFolder;

const updateCurrentOpenFolder = (id = 'Inbox') => {
    containerToDos.className = id;
    currentOpenFolder = id;
}

newItem.onclick = () => {
    modalClose(modalNew);
    modalNewToDo.style.display = 'flex';
}

newToDoBtn.onclick = () => {
    modalClose(modalNew);
    modalNewToDo.style.display = 'flex';
}

newFolderBtn.onclick = () => {
    modalClose(modalNew);
    modalNewFolder.style.display = 'flex';
}

window.onclick = (e) => {
    if (e.target == modalNew || e.target == modalEditToDo || e.target == modalEditFolder) {
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

const modalClose = (modal = undefined) => {
    modalNew.style.display = 'none';
    modalNewToDo.style.display = 'none';
    modalNewFolder.style.display = 'none';
    modalEditToDo.style.display = 'none';
    modalEditFolder.style.display = 'none';
    if (modal !== undefined) {
        modal.style.display = 'flex';
    }
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

confirmNew.forEach(confirm => {
    confirm.onclick = (e) => {
        if (e.target.closest('form') == modalNewToDo) {
            if (newToDoTitle.value == '') {
                alert('No title provided!');
            } else if (newToDoDueDate.value == '') {
                alert('No date provided!');
            } else if (libraryToDos.find(todo => todo.getTitle === newToDoTitle.value)) {
                alert('ToDo already exists! Provide unique title.');
            } else {
                saveNewToDoData();
            }
        }
        if (e.target.closest('form') == modalNewFolder) {
            if (newFolderTitle.value == '') {
                alert('No title provided!');
            } else if (libraryFolders.find(folder => folder.getTitle === newFolderTitle.value)) {
                alert('Folder already exists! Provide unique title.');
            } else {
                saveNewFolderData();
            }
        }
    }
})

const saveNewToDoData = () => {
    let title = newToDoTitle.value;
    let description = newToDoDescription.value;
    let dueDate = newToDoDueDate.value;
    let priority = newToDoPriority.value;
    let targetFolder = newToDoTargetFolder.value;
    new ToDo(title, description, dueDate, priority, targetFolder);
    saveAllLibraries();
    displayFolders();
    displayToDos();
    saveCloseClear();
    counterUpdate();
}

const saveNewFolderData = () => {
    new Folder(newFolderTitle.value);
    saveAllLibraries();
    displayFolders();
    saveCloseClear();
    updateSelectList();
    counterUpdate();
}

const displayToDos = () => {
    containerToDos.innerHTML = '';
    let h3 = document.createElement('h3');
    h3.textContent = currentOpenFolder;
    containerToDos.append(h3);

    let filteredList = filterToDoList(currentOpenFolder);
    filteredList.forEach(todo => {
        containerToDos.append(createToDoContainer(todo));
    })
}

const displayFolders = () => {
    containerFolders.innerHTML = '';
    libraryFolders.forEach(item => {
        containerFolders.append(createFolderContainer(item));
    })
}

const filterToDoList = (id) => {
    let daily = DateTime.now().toISO().split('T')[0];
    let weekly = DateTime.now().plus({ weeks: 1 }).toISO().split('T')[0];
    let newList = [];
    if (id === 'Inbox') {
        return libraryToDos;
    } else if (id === 'Today') {
        newList = libraryToDos.filter(item => item.getDueDate == daily);
        return newList;
    } else if (id === 'Week') {
        newList = libraryToDos.filter(item => item.getDueDate >= daily && item.getDueDate <= weekly);
        return newList;
    } else {
        newList = libraryToDos.filter(item => item.getTargetFolder === id);
        return newList;
    }
}

confirmEdit.forEach(confirm => {
    confirm.onclick = (e) => {
        if (e.target.closest('form') == editToDo) {
            if (editToDoTitle.value == '') {
                alert('No title provided!');
            } else if (editToDoDueDate.value == '') {
                alert('No date provided!');
            } else {
                editToDoData();
            }
        }
        if (e.target.closest('form') == editFolder) {
            if (editFolderTitle.value == '') {
                alert('No title provided!');
            } else {
                editFolderData();
            }
        }
    }
})

const editToDoData = () => {
    let arr = editToDo.className.split('__');
    let todoIndex = libraryToDos.findIndex(todo => (todo.getTitle === arr[0]) && (todo.getTargetFolder === arr[1]));
    libraryToDos[todoIndex].setTitle = editToDoTitle.value;
    libraryToDos[todoIndex].setDescription = editToDoDescription.value;
    libraryToDos[todoIndex].setDueDate = editToDoDueDate.value;
    libraryToDos[todoIndex].setPriority = editToDoPriority.value;
    libraryToDos[todoIndex].setTargetFolder = editToDoTargetFolder.value;
    saveAllLibraries();
    displayToDos();
    saveCloseClear();
    updateSelectList();
    counterUpdate();
}

const editFolderData = () => {
    let folderIndex = libraryFolders.findIndex(folder => folder.getTitle === editFolder.className);
    libraryFolders[folderIndex].setTitle = editFolderTitle.value;
    libraryToDos.forEach(todo => {
        if (todo.getTargetFolder === editFolder.className) {
            todo.setTargetFolder = editFolderTitle.value;
        }
    })
    if (currentOpenFolder === editFolder.className) {
        updateCurrentOpenFolder(editFolderTitle.value)
    }
    saveAllLibraries();
    displayToDos();
    displayFolders();
    saveCloseClear();
    updateSelectList();
    counterUpdate();
}

const editItem = (el) => {
    if (el.classList.contains('todo')) {
        let arr = el.id.split('__');
        let findToDO = libraryToDos.find(todo => (todo.getTitle === arr[0]) && (todo.getTargetFolder === arr[1]));
        loadEditToDo(findToDO);
        modalEditToDo.style.display = 'flex';
        editToDo.className = arr[0] + '__' + arr[1];
    } else if (el.classList.contains('folder')) {
        let findFolder = libraryFolders.find(folder => folder.getTitle === el.id);
        loadEditFolder(findFolder);
        modalEditFolder.style.display = 'flex';
        editFolder.className = el.id;
    }
}

const loadEditToDo = (item) => {
    editToDoTitle.value = item.getTitle;
    editToDoDescription.value = item.getDescription;
    editToDoDueDate.value = item.getDueDate;
    editToDoPriority.value = item.getPriority;
    editToDoTargetFolder.value = item.getTargetFolder;
}

const loadEditFolder = (item) => {
    editFolderTitle.value = item.getTitle;
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
            option.value = folder.getTitle;
            option.textContent = folder.getTitle;
            select.append(option);
        })
    })
}

const counterUpdate = () => {
    let allCounters = document.querySelectorAll('.counter');
    allCounters.forEach(counter => {
        let id = counter.closest('div').id;
        let count = filterToDoList(id).length;
        counter.textContent = count;
    })
}

const deleteItem = (el) => {
    if (el.classList.contains('todo')) {
        let arr = el.id.split('__');
        let todoIndex = libraryToDos.findIndex(todo => (todo.getTitle === arr[0]) && (todo.getTargetFolder === arr[1]));
        libraryToDos.splice(todoIndex, 1);
    } else if (el.classList.contains('folder')) {
        let folderIndex = libraryFolders.findIndex(folder => folder.getTitle === el.id)
        libraryFolders.splice(folderIndex, 1);
        libraryToDos.forEach(todo => {
            if (todo.getTargetFolder === el.id) {
                todo.setTargetFolder = 'Inbox';
            }
        })
    }
    updateCurrentOpenFolder();
    saveAllLibraries();
    displayToDos();
    displayFolders();
    updateSelectList();
    counterUpdate();
}

const changeStatus = (target) => {
    let arr = target.id.split('__');
    let todoIndex = libraryToDos.findIndex(todo => (todo.getTitle === arr[0]) && (todo.getTargetFolder === arr[1]));
    libraryToDos[todoIndex].setStatus = libraryToDos[todoIndex].getStatus;
    displayToDos();
}

const checkOutdated = () => {
    libraryToDos.forEach(todo => {
        todo.checkOutdated = todo.getDueDate;
    })
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

const createPara = (text) => {
    let para = document.createElement('p');
    para.textContent = text;
    return para;
}

const createToDoContainer = (item) => {
    let main = document.createElement('div');
    main.id = item.getTitle + '__' + item.getTargetFolder;
    main.classList.add('todo', 'priority' + item.getPriority);
    if (item.getStatus) {
        main.classList.add('completed')
    }
    if (item.checkOutdated) {
        main.classList.add('outdated');
    }

    let contFew = document.createElement('div');
    contFew.classList.add('fewDetails');

    let div1 = document.createElement('div');
    let check = document.createElement('div');
    check.classList.add('checkCompleted');
    check.addEventListener('click', (e) => {
        changeStatus(e.target.closest('.todo'));
    })
    div1.append(check);
    div1.append(createPara(item.getDueDate + '\u00A0\u00A0\u00A0' + item.getTitle));

    let div2 = document.createElement('div');
    div2.classList.add('controls');
    div2.append(createDetailsBtn());
    div2.append(createEditBtn());
    div2.append(createDelBtn());

    contFew.append(div1);
    contFew.append(div2);

    let contMore = document.createElement('div');
    contMore.classList.add('moreDetails');
    contMore.append(createPara(item.getDescription));
    contMore.append(createPara('Folder: ' + item.getTargetFolder));

    main.append(contFew);
    main.append(contMore);

    return main;
}

const createFolderContainer = (item) => {
    let main = document.createElement('div');
    main.id = item.getTitle;
    main.textContent = item.getTitle;
    main.classList.add('folder');
    main.addEventListener('click', () => {
        updateCurrentOpenFolder(item.getTitle);
        displayToDos();
    })
    let sub = document.createElement('span');
    sub.classList.add('controls');
    sub.append(createEditBtn());
    sub.append(createDelBtn());
    sub.append(createCounter());

    main.append(sub);

    return main;
}

const createCounter = () => {
    const counter = createPara(0);
    counter.classList.add('counter');
    return counter;
}

const createDetailsBtn = () => {
    const detailsBtn = document.createElement('div');
    detailsBtn.classList.add('detailsBtn');
    detailsBtn.textContent = 'Details';
    detailsBtn.addEventListener('click', (e) => {
        e.target.closest('.todo').querySelectorAll('.moreDetails')[0].classList.toggle('show');
    })
    return detailsBtn;
}

const createDelBtn = () => {
    const deleteBtn = document.createElement('input');
    deleteBtn.setAttribute('type', 'image');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.src = 'imgs/delete-64.png';
    deleteBtn.alt = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
        deleteItem(e.target.closest('.folder, .todo'));
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
        e.stopPropagation();
    })
    return editBtn;
}

class ToDo {
    constructor(title, description, dueDate, priority, targetFolder) {
        this._title = title;
        this._description = description;
        this._priority = priority;
        this._dueDate = dueDate;
        this._targetFolder = targetFolder;
        this._completed = false;
        this._outdated = dueDate < DateTime.now().toISO().split('T')[0];

        libraryToDos.push(this);
        saveLibraryToDos();
    }

    set setTitle(setTitle) {
        this._title = setTitle;
    }
    set setDescription(setDescription) {
        this._description = setDescription;
    }
    set setPriority(setPriority) {
        this._priority = setPriority;
    }
    set setDueDate(setDueDate) {
        this._dueDate = setDueDate;
        checkOutdated(setDueDate);
    }
    set setTargetFolder(setTargetFolder) {
        this._targetFolder = setTargetFolder;
    }
    set setStatus(status) {
        this._completed = !status;
    }
    set checkOutdated(date) {
        this._outdated = date < DateTime.now().toISO().split('T')[0];
    }

    get getTitle() {
        return this._title;
    }
    get getDescription() {
        return this._description;
    }
    get getPriority() {
        return this._priority;
    }
    get getDueDate() {
        return this._dueDate;
    }
    get getTargetFolder() {
        return this._targetFolder;
    }
    get getStatus() {
        return this._completed;
    }
    get checkOutdated() {
        return this._outdated;
    }
}

class Folder {
    constructor(title) {
        this._title = title;

        libraryFolders.push(this);
        saveLibraryFolders();
    }

    set setTitle(setTitle) {
        this._title = setTitle;
    }

    get getTitle() {
        return this._title;
    }
}

const saveLibraryToDos = () => {
    localStorage.setItem('libraryToDos', JSON.stringify(libraryToDos));
}

const saveLibraryFolders = () => {
    localStorage.setItem('libraryFolders', JSON.stringify(libraryFolders));
}

const saveAllLibraries = () => {
    saveLibraryToDos();
    saveLibraryFolders();
}

const loadLibraryToDos = () => {
    let stringData = JSON.parse(localStorage.getItem('libraryToDos'));
    let parsedData = stringData.map(data => {
        data.__proto__ = ToDo.prototype;
        return data;
    });
    return parsedData;
}

const loadLibraryFolders = () => {
    let stringData = JSON.parse(localStorage.getItem('libraryFolders'));
    let parsedData = stringData.map(data => {
        data.__proto__ = Folder.prototype;
        return data;
    });
    return parsedData;
}

const libraryToDos = JSON.parse(localStorage.getItem('libraryToDos')) ? loadLibraryToDos() : [];
const libraryFolders = JSON.parse(localStorage.getItem('libraryFolders')) ? loadLibraryFolders() : [];

const loadDefaults = () => {
    new Folder('Kitchen');
    new Folder('House');
    new Folder('Gym');

    new ToDo('Jake Mail', 'Send Email to Jake about upcoming project', DateTime.now().plus({ days: 1 }).toISO().split('T')[0], 'High', 'Inbox');
    new ToDo('Basement', 'Clean trash from basement', DateTime.now().plus({ weeks: 1 }).toISO().split('T')[0], 'Medium', 'House');
    new ToDo('Lightbulb', 'Replace kitchen lightbulb', DateTime.now().toISO().split('T')[0], 'Low', 'Kitchen');
    new ToDo('Carpet', 'Clean the carpet', DateTime.now().minus({ days: 1 }).toISO().split('T')[0], 'Low', 'House');
    new ToDo('Gym', 'Renew gym membership', DateTime.now().minus({ weeks: 1 }).toISO().split('T')[0], 'Medium', 'Gym');
}

if ((!localStorage.getItem('libraryToDos')) && (!localStorage.getItem('libraryFolders'))) {
    loadDefaults();
}

// Should I populate with defaults if user decides to delete all folders and todos?
if ((libraryToDos.length === 0) && (libraryFolders.length === 0)) {
    loadDefaults();
}

updateCurrentOpenFolder();
checkOutdated();
displayFolders();
displayToDos();
clearForms();
updateSelectList();
counterUpdate();
