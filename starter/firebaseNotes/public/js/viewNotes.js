let googleUser;
let userName;
let googleUserId

window.onload = (event) => {
    //retain user state between html pages 

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            googleUser = user;
            googleUserId = user.uid;
            console.log(googleUser)
            userName = googleUser.displayName;
            getNotes(googleUserId);
        } else {
            window.location = 'index.html';
        }
    })
};

const getNotes = (userId) => {
    console.log("logged in as user:" + userId);
    const dbRef = firebase.database().ref(`users/${userId}`);
    dbRef.on('value', (snapshot) => {
        renderData(snapshot.val());
    });
};

const renderData = (data) => {
    console.log(data);
    const destination = document.querySelector("#app");
    destination.innerHTML = "";

    for(let key in data) {
        const note = data[key];
        destination.innerHTML += createCard(note, key);
    };
};

const createCard = (note, noteId) => {

    return `<div class = "column is-one-quarter">
                <div class = "card">
                    <header class = "card-header">
                        <p class = "card-header-title"> ${note.title} </p>
                    </header>
                    <div class = "card-content">
                        <div class = "content"> 
                            ${note.text} 
                        </div>
                    </div>
                    <div class = "has-text-right"> 
                            <p class="has-text-right">
                            ${userName} &nbsp
                            </p>
                        
                    </div>
                    <footer class="card-footer">
                        <a
                            href="#"
                            class="card-footer-item"
                            onclick="editNote('${noteId}')">
                            Edit
                        </a>
                    </footer>

                    <footer class="card-footer">
                        <a
                            href="#"
                            class="card-footer-item"
                            onclick="deleteNote('${noteId}')">
                            Delete
                        </a>
                    </footer>
                </div>
            </div>
    `;
};

const deleteNote = (noteId) => {
    console.log("delete");
    console.log(noteId);
    alert("Confirm that you want to delete a note.");
    const noteToDeleteRef = firebase.database().ref(`users/${googleUserId}/${noteId}`);
    noteToDeleteRef.remove();
};


const editNote = (noteId) => {
    
    console.log(noteId);
    const noteToEditRef = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
    noteToEditRef.on("value", (snapshot) => {
        const note = (snapshot.val())[noteId];
    
        const editNoteModal=document.querySelector("#editNoteModal");
        
        const noteTitle = document.querySelector("#editTitleInput");
        noteTitle.value = note.title;

        const noteText = document.querySelector("editTextInput");
        noteText.value = note.text;

        const editNoteInput = document.querySelector("#editTextInput");
        editNoteInput.value = noteId;

        
    });
    editNoteModal.classList.add("is-active");
};

const closeModal =()=> {
    const editeNoteModal = document.querySelector("#editNoteModal");
    editeNoteModal.classList.remove("is-active");
};

const saveChanges = () => {
    console.log("save changes");

    const editNoteTitleInput = document.querySelector("#editTitleInput");
    const editNoteTextInput = document.querySelector("#editTextInput");
    const editNoteIdInput = document.querySelector("#editNoteId");

    const title = editNoteTitleInput.value;
    const text = editNoteTextInput.value;
    const noteId = editNoteIdInput.value;

    const noteToEditRef = firebase.database().ref(`user/${googleUser.uid}/${noteId}`);

    noteToEditRef.update({
        title: title,
        text: text,
    });    
};