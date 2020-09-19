
export class SaveControl {

    constructor() {
        this.noteArr = [];
        this.jsonString = "";
    }

    saveNote(noteObj) {
        this.noteArr.push(noteObj)
        this.saveNoteArr();
        console.log(this.noteArr)
    }

    deleteNotefromSave(itemRefId) {
        this.noteArr.forEach((elem, index) => {
            if (elem.id === itemRefId) {
                this.noteArr.splice(index, 1)
                return console.log(this.noteArr)
            }
        })
        if (this.noteArr.length === 0) {
            localStorage.removeItem("saveNote");
        }
        this.saveNoteArr();
    }

    saveColorSetting(itemRefId, colorSetting) {
        this.noteArr.forEach((elem, index) => {
            if (elem.id === itemRefId) {
                elem.colorSetting = colorSetting;
                this.saveNoteArr();
                return console.log(this.noteArr)
            }
        })
    }

    saveNoteEdit(itemRefId, newTitle, newMessage) {
        this.noteArr.forEach((elem, index) => {
            if (elem.id === itemRefId) {
                elem.inputTitle = newTitle
                elem.inputMessage = newMessage
                this.saveNoteArr();
                return console.log(this.noteArr)
            }
        })
    }

    saveNoteArr() {
        if (this.noteArr.length > 0) {
            this.jsonString = JSON.stringify(this.noteArr)
            localStorage.setItem("saveNote", this.jsonString)
            console.log(this.jsonString)
        }
    }
}
