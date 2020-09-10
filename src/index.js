import './sass/main.scss';
import { CreateNote } from './js/createNote'
import templateNoteItems from './template/template_note_item.hbs'


const refs = {
    form: document.querySelector('[data-form-create-note]'),
    formInputTitle: document.querySelector('[data-input-title]'),
    formInputMessage: document.querySelector('[data-input-message]'),
    noteList: document.querySelector('[data-note-list]'),
    pageMain: document.querySelector(".content-wrapper")
}

const loadNote = () => {
    if (localStorage.getItem("saveNote")) {
        const loadNote = localStorage.getItem("saveNote")
        refs.pageMain.classList.add("content-padding")
        refs.noteList.insertAdjacentHTML('beforeend', loadNote);
    }
}

loadNote();

const saveNote = () => {
    let savestring = "";
    const noteArr = refs.noteList.querySelectorAll(".note-item")
    noteArr.forEach((elem) => {
        return savestring += elem.outerHTML;
    })
    localStorage.setItem("saveNote", savestring)
}

const handlerSubmitForm = (event) => {
    event.preventDefault();
    const noteObj = new CreateNote(refs.formInputTitle.value, refs.formInputMessage.value)
    const templateNote = templateNoteItems(noteObj);
    refs.pageMain.classList.add("content-padding")
    refs.noteList.insertAdjacentHTML('beforeend', templateNote);
    refs.form.reset();
    saveNote()
}

const handlerDeleteNote = (event) => {
    refs.noteList.removeChild(event.target.parentNode)
    const noteArr = refs.noteList.querySelectorAll(".note-item")
    if (noteArr.length === 0) {
        refs.pageMain.classList.remove("content-padding")
        localStorage.removeItem("saveNote");
        return;
    }
    saveNote()
}

refs.noteList.addEventListener("click", handlerDeleteNote);
refs.form.addEventListener("submit", handlerSubmitForm);