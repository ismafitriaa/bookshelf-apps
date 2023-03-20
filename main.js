/**
[
    {
        id: string | number,
        title: string,
        author: string,
        year: number,
        isComplete: boolean,
    }
]
*/

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findTitle(bookTitle) {
    for (const bookItem of books) {
        if (bookItem.title === bookTitle) {
            return bookItem;
        }
    }
    return null;
}

function findAuthor(bookAuthor) {
    for (const bookItem of books) {
        if (bookItem.author === bookAuthor) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}
  
// Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}
  
// Fungsi ini digunakan untuk menyimpan data ke localStorage berdasarkan KEY yang sudah ditetapkan sebelumnya.
function saveData() {
    if (isStorageExist()) {
        const parsed /* string */ = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}
  

// Fungsi ini digunakan untuk memuat data dari localStorage Dan memasukkan data hasil parsing ke variabel
function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
}
  
function makeBook(bookObject) {
  
    const {id, title, author, year, isCompleted} = bookObject;
  
    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis : " + author;
  
    const textYear = document.createElement('p');
    textYear.innerText = "Tahun : " + year;
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);
  
    const container = document.createElement('div');
    container.classList.add('item', 'shadow')
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);
  
    if (isCompleted) {
  
        const undoButton = document.createElement('button');
        undoButton.innerText = "Belum selesai dibaca";
        author.id = generateId.id;
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function () {
            undoTitleFromCompleted(id);
        });
  
        const trashButton = document.createElement('button');
        trashButton.innerText = "Hapus buku";
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            removeTitleFromCompleted(id);
        });
  
        container.append(undoButton, trashButton);
    } else {
  
        const checkButton = document.createElement('button');
        checkButton.innerText = "Selesai dibaca";
        checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function () {
            addTitleToCompleted(id);
        });
  
        const trashButton = document.createElement('button');
        trashButton.innerText = "Hapus buku";
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            removeTitleFromCompleted(id);
        });

        container.append(checkButton, trashButton);
    }
  
    return container;
}
  
function addBook() {
    const textId = document.getElementById('idBook').value;
    const textBook = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear= document.getElementById('inputBookYear').value;
    const readed = document.getElementById("inputBookIsComplete").checked;

    if (textId == "") {
        const generatedID = generateId();
        const bookObject = generateBookObject(
            generatedID, 
            textBook, 
            textAuthor, 
            textYear, 
            readed
        );
    
        books.push(bookObject);
  
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    } else {
        const bookData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const index = findBookIndex(textId);

        bookData[index].inputBookTitle = textBook;
        bookData[index].inputBookAuthor = textAuthor;
        bookData[index].inputBookYear = textYear;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
        document.dispatchEvent(new Event(RENDER_EVENT));
        location.reload();
    }
}

function addTitleToCompleted(bookId /* HTMLELement */) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
        alert('Buku telah selesai dibaca');
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
  
function removeTitleFromCompleted(bookId /* HTMLELement */) {
    const bookTarget = findBookIndex(bookId);
  
    if (bookTarget === -1) return;
        alert('Daftar buku telah dihapus');
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
  
function undoTitleFromCompleted(bookId /* HTMLELement */) {
  
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
        alert('Buku belum selesai dibaca');
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
  
document.addEventListener('DOMContentLoaded', function () {
  
    const submitForm /* HTMLFormElement */ = document.getElementById('inputBook');
  
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
});
  
document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});
  
document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');
  
    // clearing list item
    uncompletedBOOKList.innerHTML = '';
    listCompleted.innerHTML = '';
  
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBOOKList.append(bookElement);
        }
    }
});

const btnSearch = document.querySelector("#searchSubmit");

btnSearch.addEventListener("click", function (event) {
    const textSearch = document.getElementById("searchBookTitle").value;
    const searchForm = document.getElementById("searchBook");
    const searchResult = document.getElementById("searchSection");

    console.log(textSearch);
    event.preventDefault();
    if (textSearch == "") {
        showSearchResult(null);
    } else {
        if (findTitle(textSearch)) {
            showSearchResult(findTitle(textSearch));
        } else if (findAuthor(textSearch)) {
            showSearchResult(findAuthor(textSearch));
        } else {
            searchResult.innerHTML = "";
            alert(textSearch + " buku yang kamu cari tidak ada! ");
        }
    }
    searchForm.reset();
});

function showSearchResult(bookObject) {
    const searchResult = document.getElementById("searchSection");

    if (bookObject == null) {
        searchResult.innerHTML = "";
    } else {
        searchResult.innerHTML = "";
        const {id, title, author, year, isCompleted} = bookObject;
  
        const textTitle = document.createElement('h3');
        textTitle.innerText = title;

        const textAuthor = document.createElement('p');
        textAuthor.innerText = "Penulis : " + author;
  
        const textYear = document.createElement('p');
        textYear.innerText = "Tahun : " + year;

        const explanation = document.createElement('p');
        if (isCompleted) {
            explanation.innerText = "Selesai dibaca";
        } else {
            explanation.innerText = "Belum selesai dibaca";
        }

        const textContainer = document.createElement('div');
        textContainer.classList.add("inner");
        textContainer.append(textTitle, textAuthor, textYear, explanation);

        const container = document.createElement("div");
        container.classList.add("item", "shadow");
        container.append(textContainer);
        container.setAttribute("id", `book-${id}`);
        searchResult.append(container);
    }
}