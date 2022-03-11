const todos = [];
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Data Berhasil Ditambahkan");
        addBook();
    });
    if(isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;

    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, bookTitle, bookAuthor, bookYear, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function generateId() {
    return + new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    }
};

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOList = document.getElementById("incompleteBookshelfList");
    uncompletedTODOList.innerText = "";

    const completedTODOList = document.getElementById("completeBookshelfList");
    completedTODOList.innerText = "";

    for (bookItem of todos) {
        const todoElement = makeBook(bookItem);

        if (bookItem.isCompleted == false) {
            uncompletedTODOList.append(todoElement);
        } else { 
            completedTODOList.append(todoElement);
    }
    }
});

function makeBook(todoObject) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = todoObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Penulis : " + todoObject.author;

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun : " + todoObject.year;

    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai Dibaca"

    const trashButtonBefore = document.createElement("button");
    trashButtonBefore.classList.add("red");
    trashButtonBefore.innerText = "Hapus Buku";

    const textContainerBefore = document.createElement("div");
    textContainerBefore.classList.add("action");
    textContainerBefore.append(checkButton, trashButtonBefore);

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textTitle, textAuthor, textYear);

    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai di Baca";

    const trashButtonAfter = document.createElement("button");
    trashButtonAfter.classList.add("red");
    trashButtonAfter.innerText = "Hapus Buku";

    const textContainerAfter = document.createElement("div");
    textContainerAfter.classList.add("action");
    textContainerAfter.append(undoButton, trashButtonAfter)

    if (todoObject.isCompleted) {
        undoButton.addEventListener("click", function() {
            undoBookFromCompleted(todoObject.id);
        })
        trashButtonAfter.addEventListener("click", function() {
            removeBookFromCompleted(todoObject.id);
            alert("Berhasil Menghapus Data Buku");
        });

        container.append(textContainerAfter);
    } else {
        checkButton.addEventListener("click", function() {
            addBookToCompleted(todoObject.id);
        });
        trashButtonBefore.addEventListener("click", function() {
            removeBookFromCompleted(todoObject.id);
            alert("Berhasil Menghapus Data Buku");
        })
        container.append(textContainerBefore);
    }
    return container;
};

const checkBoxButton = document.getElementById("inputBookIsComplete");
checkBoxButton.addEventListener("change", function() {
    if (checkBoxButton.checked) {
        isCompleted = true;
        document.querySelector("span").innerText = "Selesai Dibaca";

        document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
        isCompleted = false;
        document.querySelector("span").innerText = "Belum Selesai dibaca";
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
});

function addBookToCompleted(todoId) {
    const bookTarget = findTodo(todoId);
    if (bookTarget == null) return;
    
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findTodo(todoId) {
    for(bookItem of todos) {
        if (bookItem.id === todoId) {
            return bookItem;
        }
    }
    return null;
};

function removeBookFromCompleted(todoId) {
    const bookTarget = findTodoIndex(todoId);
    if(bookTarget === -1) return;
    todos.splice(bookTarget, 1);
    
    document.dispatchEvent(new Event (RENDER_EVENT));
    saveData();
};

function findTodoIndex(todoId) {
    for(index in todos) {
        if (todos[index].id === todoId) {
            return index
        }
    }
    return -1;
};

function undoBookFromCompleted(todoId) {
    const bookTarget = findTodo(todoId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "Bookshelf_Apps";

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null) {
        for(todo of data) {
            todos.push(todo);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}