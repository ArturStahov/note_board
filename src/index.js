import './sass/main.scss';
import { CreateNote } from './js/createNote.js';
import templateNoteItems from './template/template_note_item.hbs';
import templateNoteFromArray from './template/templateNoteFromArray.hbs'
import Sortable from 'sortablejs';
import { SaveControl } from './js/saveControl.js';
import MicroModal from 'micromodal';  // es6 module

MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`), // [1]
    onClose: modal => console.info(`${modal.id} is hidden`), // [2]
    openTrigger: 'my-modal', // [3]
    closeTrigger: 'data-custom-close', // [4]
    openClass: 'is-open', // [5]
    disableScroll: true, // [6]
    disableFocus: false, // [7]
    awaitOpenAnimation: true, // [8]
    awaitCloseAnimation: true, // [9]
    debugMode: false // [10]
});


const colorSetting = {
    default: "default",
    mediumImportance: "green",
    notImportant: "grey",
    theRightTime: "yellow",
}

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

const save = new SaveControl();

const loadNote = () => {
    if (localStorage.getItem("saveNote")) {
        const saveJsonStr = localStorage.getItem("saveNote");
        const noteArr = JSON.parse(saveJsonStr);
        const templateNote = templateNoteFromArray(noteArr);
        refs.pageMain.classList.add("content-padding")
        refs.noteList.insertAdjacentHTML('beforeend', templateNote);
        noteArr.forEach(elem => {
            save.saveNote(elem);
        })
    }
}

loadNote();

const handlerSubmitForm = (event) => {
    event.preventDefault();
    const noteObj = new CreateNote(refs.formInputTitle.value, refs.formInputMessage.value)
    noteObj.setColorSettings(colorSetting.default);
    const templateNote = templateNoteItems(noteObj);
    refs.pageMain.classList.add("content-padding")
    refs.noteList.insertAdjacentHTML('beforeend', templateNote);
    refs.form.reset();
    save.saveNote(noteObj);

}

const handlerDeleteNote = (event) => {
    if (event.target.nodeName === "LI") {
        const itemRef = event.target.parentNode.parentNode.parentNode;
        const itemRefId = event.target.parentNode.parentNode.parentNode.dataset.iditem;
        if (event.target.dataset.button === "button-delete-item") {
            refs.noteList.removeChild(itemRef)
            save.deleteNotefromSave(itemRefId)
            if (save.noteArr.length === 0) {
                refs.pageMain.classList.remove("content-padding")
            }
        }
    }
}

const chendgeNoteColorHandler = (event) => {
    if (event.target.nodeName === "LI") {
        const noteDatasetTooltipRef = event.target.dataset.tooltip;
        const itemRef = event.target.parentNode.parentNode.parentNode;
        const itemRefId = event.target.parentNode.parentNode.parentNode.dataset.iditem;
        if (noteDatasetTooltipRef === "medium importance") {
            itemRef.classList.add("green")
            itemRef.classList.remove("grey")
            itemRef.classList.remove("yellow")
            save.saveColorSetting(itemRefId, colorSetting.mediumImportance);
            return;
        }
        if (noteDatasetTooltipRef === "not important") {
            itemRef.classList.add("grey")
            itemRef.classList.remove("green")
            itemRef.classList.remove("yellow")
            save.saveColorSetting(itemRefId, colorSetting.notImportant)
            return;

        }
        if (noteDatasetTooltipRef === "the right time") {
            itemRef.classList.add("yellow")
            itemRef.classList.remove("grey")
            itemRef.classList.remove("green")
            save.saveColorSetting(itemRefId, colorSetting.theRightTime)
            return;
        }

    }
}


const handlerButtonEditNote = (event) => {
    if (event.target.nodeName !== "BUTTON") {
        return
    }
    MicroModal.show('modal-1'); // [1]
    const modalOverlovRef = document.querySelector('[data-closeFromOverlov-close]')
    const buttonCloseRef = document.querySelector('[data-button-close]')
    const itemRefId = event.target.parentNode.dataset.iditem;
    const titleRef = event.target.parentNode.querySelector('.note-item_title')
    const messageRef = event.target.parentNode.querySelector('.note-item_description')
    const formEditNoteRef = document.querySelector('[data-form-edit-note]')
    const formEditInputTitle = document.querySelector('[data-form-edit-input-title]')
    const formEditInputMessage = document.querySelector('[data-form-edit-input-message]')

    const handlerEditNote = (event) => {
        event.preventDefault();
        titleRef.textContent = formEditInputTitle.value;
        messageRef.textContent = formEditInputMessage.value;
        save.saveNoteEdit(itemRefId, formEditInputTitle.value, formEditInputMessage.value)
        formEditNoteRef.reset();
        formEditNoteRef.removeEventListener('submit', handlerEditNote)
        MicroModal.close('modal-1'); // [2]
    }

    const hundlerCloseModal = (event) => {
        if (event.target === event.currentTarget) {
            formEditNoteRef.removeEventListener('submit', handlerEditNote)
            buttonCloseRef.removeEventListener('click', hundlerCloseModal)
            modalOverlovRef.removeEventListener('click', hundlerCloseModal)
            formEditNoteRef.reset();
            MicroModal.close('modal-1'); // [2]  
        }
    }

    modalOverlovRef.addEventListener('click', hundlerCloseModal)
    buttonCloseRef.addEventListener('click', hundlerCloseModal)
    formEditNoteRef.addEventListener('submit', handlerEditNote)
}




refs.noteList.addEventListener("click", chendgeNoteColorHandler);
refs.noteList.addEventListener("click", handlerDeleteNote);
refs.noteList.addEventListener("click", handlerButtonEditNote);
refs.form.addEventListener("submit", handlerSubmitForm);
