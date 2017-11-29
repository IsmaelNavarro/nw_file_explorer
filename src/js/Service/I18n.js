const EventEmitter = require("events");

class I18nService extends EventEmitter {
    constructor(dictionary) {
        super();
        this.dictionary = dictionary;
        this._locale = "en-US";
    }

    translate(token, defaultValue) {
        const dictionary = this.dictionary[this._locale];
        return dictionary[token] || defaultValue;
    }

    notify() {
        this.emit("update");
    }

    get locale(){
        return this._locale;
    }

    set locale( locale ){
        this._locale = locale;
    }
}

exports.I18nService = I18nService;