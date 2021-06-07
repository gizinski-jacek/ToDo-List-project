// import * as code from './code';
// import * as DOM from './DOM';

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
    let check1 = e.target == modalNew;
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
    let todoIndex = libraryToDos.findIndex(todo => (todo.title === arr[0]) && (todo.targetFolder === arr[1]));
    libraryToDos[todoIndex].updateAllData(
        editToDoTitle.value, 
        editToDoDescription.value,
        editToDoDueDate.value, 
        editToDoPriority.value,
        editToDoTargetFolder.value
        );
    displayToDos();
    saveCloseClear();
}

const editFolderData = () => {
    let folderIndex = libraryFolders.findIndex(folder => folder.title === editFolder.className);
    libraryFolders[folderIndex].updateTitle = editFolderTitle.value;
    libraryToDos.forEach(todo => {
        if (todo.targetFolder === editFolder.className) {
            todo.updateTargetFolder = editFolderTitle.value;
        }
    })
    displayToDos();
    displayFolders();
    saveCloseClear();
}

confirmNew.forEach(confirm => {
    confirm.onclick = (e) => {
        if (e.target.closest('form') == modalNewToDo) {
            if (newToDoTitle.value == '') {
                alert('No title provided!');
            } else if (newToDoDueDate.value == '') {
                alert('No date provided!');
            } else if (libraryToDos.find(todo => todo.title === newToDoTitle.value)) {
                alert('ToDo already exists! Provide unique title.');
            } else {
                saveNewToDoData();
            }
        }
        if (e.target.closest('form') == modalNewFolder) {
            if (newFolderTitle.value == '') {
                alert('No title provided!');
            } else if (libraryFolders.find(folder => folder.title === newFolderTitle.value)) {
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
    displayToDos();
    saveCloseClear();
}

const saveNewFolderData = () => {
    new Folder(newFolderTitle.value);
    updateSelectList();
    displayFolders();
    saveCloseClear();
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

const displayFolders = () => {
    containerFolders.innerHTML = '';
    libraryFolders.forEach(item => {
        containerFolders.append(createFolderContainer(item));
    })
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

const deleteItem = (el) => {
    let arr = el.id.split('__');
    if (arr[0] == 'todo') {
        let todoIndex = libraryToDos.findIndex(todo => (todo.title === arr[1]) && (todo.targetFolder === arr[2]));
        libraryToDos.splice(todoIndex, 1);
    } else if (arr[0] == 'folder') {
        let folderIndex = libraryFolders.findIndex(folder => folder.title === arr[1])
        libraryFolders.splice(folderIndex, 1);
        libraryToDos.forEach(todo => {
            if (todo.targetFolder === arr[1]) {
                todo.updateTargetFolder = 'Inbox';
            }
        })
    }
    saveAllLibraries();
    updateSelectList();
    displayToDos();
    displayFolders();
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
    saveAllLibraries();
    updateSelectList();
    displayToDos();
    displayFolders();
}

const loadEditToDo = (item) => {
    editToDoTitle.value = item.title;
    editToDoDescription.value = item.description;
    editToDoDueDate.value = item.dueDate;
    editToDoPriority.value = item.priority;
}

const loadEditFolder = (item) => {
    editFolderTitle.value = item.title;
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
    main.id = 'todo__' + item.title + '__' + item.targetFolder;
    main.classList.add('todo', 'priority' + item.priority);
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
        this.updateTargetFolder = data4;
    }
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

const libraryToDos = JSON.parse(localStorage.getItem('libraryToDos')) || [];
const libraryFolders = JSON.parse(localStorage.getItem('libraryFolders')) || [];

const loadDefaults = () => {
    new Folder('Kitchen');
    new Folder('House');
    new Folder('Gym');

    new ToDo('Jake Mail', 'Send Email to Jake about upcoming project', '2025-01-01', 'High', 'Inbox');
    new ToDo('Basement', 'Clean trash from basement', '2027-02-02', 'Medium', 'House');
    new ToDo('Lightbulb', 'Replace kitchen lightbulb', '2021-06-08', 'Low', 'Kitchen');
    new ToDo('Carpet', 'Clean the carpet', new Date().toISOString().split("T")[0], 'Low', 'House');
    new ToDo('Gym', 'Renew gym membership', new Date().toISOString().split("T")[0], 'Medium', 'Gym');
}

if ((!localStorage.getItem('libraryToDos')) && (!localStorage.getItem('libraryFolders'))) {
    loadDefaults();
}

// Should I populate with defaults if user decides to delete all folder and todos?
if ((libraryToDos.length === 0) && (libraryFolders.length === 0)) {
    loadDefaults();
}

updateCurrentOpenFolder();
displayFolders();
displayToDos();
clearForms();
updateSelectList();
