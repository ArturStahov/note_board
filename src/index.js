import './sass/main.scss';
import { CreateNote } from './js/createNote.js';
import templateNoteItems from './template/template_note_item.hbs';
import templateNoteFromArray from './template/templateNoteFromArray.hbs'
import Sortable from 'sortablejs';
import { SaveControl } from './js/saveControl.js';


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


refs.noteList.addEventListener("click", chendgeNoteColorHandler);
refs.noteList.addEventListener("click", handlerDeleteNote);
refs.form.addEventListener("submit", handlerSubmitForm);