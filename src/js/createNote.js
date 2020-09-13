const uniqid = require('uniqid');

export class CreateNote {

    constructor(inputTitle, inputMessage) {
        this.inputTitle = inputTitle;
        this.inputMessage = inputMessage;
        this.id = uniqid();
        this.colorSetting = "";
    }

    getId() {
        return this.id;
    }

    setColorSettings(colorSettings) {
        this.colorSetting = colorSettings;
    }

}