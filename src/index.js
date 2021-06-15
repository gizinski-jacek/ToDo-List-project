import * as DOMman from './DOMman';
import * as Libs from './Libs';

('use strict');

let currentOpenFolder = 'Inbox';

const updateCurrentOpenFolder = (id) => {
    DOMman.containerToDos.className = id;
    currentOpenFolder = id;
};

const setActive = (el) => {
    const folders = document.querySelectorAll('.folder');
    folders.forEach((folder) => {
        folder.classList.remove('active');
    });
    el.classList.add('active');
};

const changeFolder = (id, el) => {
    updateCurrentOpenFolder(id);
    setActive(el);
    displayToDos();
};

window.addEventListener('click', (e) => {
    if (
        e.target == DOMman.modalNew ||
        e.target == DOMman.modalEditToDo ||
        e.target == DOMman.modalEditFolder
    ) {
        modalClose();
    }
});

DOMman.addEventListener('click', () => {
    modalClose(DOMman.modalNew);
    DOMman.modalNewToDo.style.display = 'flex';
});

DOMman.addEventListener('click', () => {
    modalClose(DOMman.modalNew);
    DOMman.modalNewToDo.style.display = 'flex';
});

DOMman.addEventListener('click', () => {
    modalClose(DOMman.modalNew);
    DOMman.modalNewFolder.style.display = 'flex';
});

DOMman.buttonsX.forEach((cancel) => {
    cancel.addEventListener('click', () => {
        modalClose();
    });
});

DOMman.cancels.forEach((cancel) => {
    cancel.addEventListener('click', () => {
        modalClose();
        clearForms();
    });
});

const modalClose = (modal = undefined) => {
    DOMman.modalNew.style.display = 'none';
    DOMman.modalNewToDo.style.display = 'none';
    DOMman.modalNewFolder.style.display = 'none';
    DOMman.modalEditToDo.style.display = 'none';
    DOMman.modalEditFolder.style.display = 'none';
    if (modal !== undefined) {
        modal.style.display = 'flex';
    }
};

DOMman.inboxToDos.addEventListener('click', (e) => {
    changeFolder(e.currentTarget.id, e.currentTarget);
});

DOMman.todayToDos.addEventListener('click', (e) => {
    changeFolder(e.currentTarget.id, e.currentTarget);
});

DOMman.weekToDos.addEventListener('click', (e) => {
    changeFolder(e.currentTarget.id, e.currentTarget);
});

DOMman.dropdownFolders.addEventListener('click', () => {
    DOMman.containerFolders.classList.toggle('show');
});

DOMman.confirmNew.forEach((confirm) => {
    confirm.addEventListener('click', (e) => {
        if (e.target.closest('form') == DOMman.modalNewToDo) {
            if (DOMman.newToDoTitle.value == '') {
                alert('No title provided!');
            } else if (DOMman.newToDoDueDate.value == '') {
                alert('No date provided!');
            } else if (
                Libs.libraryToDos.find(
                    (todo) => todo.getTitle === DOMman.newToDoTitle.value
                )
            ) {
                alert('ToDo already exists! Provide unique title.');
            } else {
                saveNewToDoData();
            }
        }
        if (e.target.closest('form') == DOMman.modalNewFolder) {
            if (DOMman.newFolderTitle.value == '') {
                alert('No title provided!');
            } else if (
                Libs.libraryFolders.find(
                    (folder) => folder.getTitle === DOMman.newFolderTitle.value
                )
            ) {
                alert('Folder already exists! Provide unique title.');
            } else {
                saveNewFolderData();
            }
        }
    });
});

const saveNewToDoData = () => {
    const title = DOMman.newToDoTitle.value;
    const description = DOMman.newToDoDescription.value;
    const dueDate = DOMman.newToDoDueDate.value;
    const priority = DOMman.newToDoPriority.value;
    const targetFolder = DOMman.newToDoTargetFolder.value;
    new Libs.ToDo(title, description, dueDate, priority, targetFolder);
    Libs.saveAllLibraries();
    displayFolders();
    displayToDos();
    saveCloseClear();
    DOMman.counterUpdate();
};

const saveNewFolderData = () => {
    new Libs.Folder(DOMman.newFolderTitle.value);
    Libs.saveAllLibraries();
    displayFolders();
    saveCloseClear();
    DOMman.updateSelectList();
    DOMman.counterUpdate();
};

const displayToDos = () => {
    DOMman.containerToDos.innerHTML = '';
    const filteredList = Libs.filterToDoList(currentOpenFolder);
    filteredList.forEach((todo) => {
        DOMman.containerToDos.append(DOMman.createToDoContainer(todo));
    });
};

const displayFolders = () => {
    DOMman.containerFolders.innerHTML = '';
    Libs.libraryFolders.forEach((item) => {
        DOMman.containerFolders.append(DOMman.createFolderContainer(item));
    });
};

DOMman.confirmEdit.forEach((confirm) => {
    confirm.addEventListener('click', (e) => {
        if (e.target.closest('form').classList.contains('editToDo')) {
            if (DOMman.editToDoTitle.value == '') {
                alert('No title provided!');
            } else if (DOMman.editToDoDueDate.value == '') {
                alert('No date provided!');
            } else {
                editToDoData(e.target.closest('form').id);
            }
        }
        if (e.target.closest('form').classList.contains('editFolder')) {
            if (DOMman.editFolderTitle.value == '') {
                alert('No title provided!');
            } else {
                editFolderData(e.target.closest('form').id);
            }
        }
    });
});

const editToDoData = (id) => {
    Libs.libraryToDos[id].setTitle = DOMman.editToDoTitle.value;
    Libs.libraryToDos[id].setDescription = DOMman.editToDoDescription.value;
    Libs.libraryToDos[id].setDueDate = DOMman.editToDoDueDate.value;
    Libs.libraryToDos[id].setPriority = DOMman.editToDoPriority.value;
    Libs.libraryToDos[id].setTargetFolder = DOMman.editToDoTargetFolder.value;
    Libs.saveAllLibraries();
    displayToDos();
    saveCloseClear();
    DOMman.updateSelectList();
    DOMman.counterUpdate();
};

const editFolderData = (id) => {
    Libs.libraryToDos.forEach((todo) => {
        if (todo.getTargetFolder === Libs.libraryFolders[id].getTitle) {
            todo.setTargetFolder = DOMman.editFolderTitle.value;
        }
    });
    if (currentOpenFolder === Libs.libraryFolders[id].getTitle) {
        updateCurrentOpenFolder(DOMman.editFolderTitle.value);
    }
    Libs.libraryFolders[id].setTitle = DOMman.editFolderTitle.value;

    Libs.saveAllLibraries();
    displayFolders();
    displayToDos();
    saveCloseClear();
    DOMman.updateSelectList();
    DOMman.counterUpdate();
};

const clearForms = () => {
    document.querySelectorAll('form').forEach((form) => {
        form.reset();
    });
};

const saveCloseClear = () => {
    Libs.saveAllLibraries();
    modalClose();
    clearForms();
};

if (
    !localStorage.getItem('libraryToDos') &&
    !localStorage.getItem('libraryFolders')
) {
    Libs.loadDefaults();
}

// Should I populate with defaults if user decides to delete all folders and todos?
if (Libs.libraryToDos.length === 0 && Libs.libraryFolders.length === 0) {
    Libs.loadDefaults();
}

Libs.checkOutdated();
displayFolders();
displayToDos();
clearForms();
DOMman.updateSelectList();
DOMman.counterUpdate();

export {
    updateCurrentOpenFolder,
    displayToDos,
    displayFolders,
    setActive,
    changeFolder,
};
