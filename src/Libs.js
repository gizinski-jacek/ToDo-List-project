import { DateTime } from 'luxon';

'use strict'

class ToDo {
    constructor(title, description, dueDate, priority, targetFolder, completed = false) {
        this._title = title;
        this._description = description;
        this._priority = priority;
        this._dueDate = dueDate;
        this._targetFolder = targetFolder;
        this._completed = completed;
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
        this.checkOutdated = setDueDate;
    }
    set setTargetFolder(setTargetFolder) {
        this._targetFolder = setTargetFolder;
    }
    set setStatus(status) {
        this._completed = status;
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

const filterToDoList = (id) => {
    const daily = DateTime.now().toISO().split('T')[0];
    const weekly = DateTime.now().plus({ weeks: 1 }).toISO().split('T')[0];
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

const checkOutdated = () => {
    libraryToDos.forEach(todo => {
        todo.checkOutdated = todo.getDueDate;
    })
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
    const stringData = JSON.parse(localStorage.getItem('libraryToDos'));
    const parsedData = stringData.map(data => {
        data.__proto__ = ToDo.prototype;
        return data;
    });
    return parsedData;
}

const loadLibraryFolders = () => {
    const stringData = JSON.parse(localStorage.getItem('libraryFolders'));
    const parsedData = stringData.map(data => {
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
    new ToDo('Lightbulb', 'Replace kitchen lightbulb', DateTime.now().toISO().split('T')[0], 'Low', 'Kitchen', true);
    new ToDo('Carpet', 'Clean the carpet', DateTime.now().minus({ days: 1 }).toISO().split('T')[0], 'Low', 'House');
    new ToDo('Gym', 'Renew gym membership', DateTime.now().minus({ weeks: 1 }).toISO().split('T')[0], 'Medium', 'Gym');
}

export {
    ToDo,
    Folder,
    saveAllLibraries,
    loadDefaults,
    checkOutdated,
    filterToDoList,
    libraryToDos,
    libraryFolders,
}
