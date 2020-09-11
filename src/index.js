import './sass/main.scss';
import { CreateNote } from './js/createNote'
import templateNoteItems from './template/template_note_item.hbs'
import Sortable from 'sortablejs';

const refs = {
    form: document.querySelector('[data-form-create-note]'),
    formInputTitle: document.querySelector('[data-input-title]'),
    formInputMessage: document.querySelector('[data-input-message]'),
    noteList: document.querySelector('[data-note-list]'),
    pageMain: document.querySelector(".content-wrapper"),
}

const sort = () => {
    const sortlist = Sortable.create(refs.noteList, { handle: ".note-item_sort-lable", animation: 300, easing: "cubic-bezier(1, 0, 0, 1)" });
}
sort();

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
    if (event.target.nodeName === "LI") {
        const itemRef = event.target.parentNode.parentNode.parentNode;

        if (event.target.dataset.button === "button-delete-item") {
            refs.noteList.removeChild(itemRef)
            const noteArr = refs.noteList.querySelectorAll(".note-item")
            if (noteArr.length === 0) {
                refs.pageMain.classList.remove("content-padding")
                localStorage.removeItem("saveNote");
                return
            }
            saveNote()
        }
        if (event.target.dataset.tooltip === "green") {
            itemRef.classList.add("green")
            itemRef.classList.remove("grey")
            itemRef.classList.remove("yellow")
            saveNote()
        }
        if (event.target.dataset.tooltip === "grey") {
            itemRef.classList.add("grey")
            itemRef.classList.remove("green")
            itemRef.classList.remove("yellow")
            saveNote()
        }
        if (event.target.dataset.tooltip === "yellow") {
            itemRef.classList.add("yellow")
            itemRef.classList.remove("grey")
            itemRef.classList.remove("green")
            saveNote()
        }
    }

    return;
}

refs.noteList.addEventListener("click", handlerDeleteNote);
refs.form.addEventListener("submit", handlerSubmitForm);