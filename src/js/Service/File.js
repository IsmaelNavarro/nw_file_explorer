const fs = require("fs"),
    path = require("path"),
    // Copy file helper 
    cp = (from, toDir, done) => {
        const basename = path.basename(from),
            to = path.join(toDir, basename),
            write = fs.createWriteStream(to);

        fs.createReadStream(from).pipe(write);
        write.on("finish", done);
    };

class FileService {

    constructor(dirService) {
        this.dir = dirService;
        this.copiedFile = null;
    }

    remove(file) {
        fs.unlinkSync(this.dir.getFile(file));
        this.dir.notify();
    }

    paste() {
        const file = this.copiedFile;
        if (fs.lstatSync(file).isFile()) {
            cp(file, this.dir.getDir(), () => this.dir.notify());
        }
    }

    copy(file) {
        this.copiedFile = this.dir.getFile(file);
        const ext = path.parse(this.copiedFile).ext.substr(1);
        switch (ext) {
            case "jpg":
            case "jpeg":
                return this.copyImage(this.copiedFile, "jpeg");
            case "png":
                return this.copyImage(this.copiedFile, "png");
        }
    }

    copyImage(file, type) {
        const clip = nw.Clipboard.get(),
            // load file content as BASE64
            data = fs.readFileSync(file).toString("base64"),
            // image as HTML
            html = `<img src="file:///${encodeURI(data.replace(/^\//, ""))}">`;

        // write both options (raw image and HTML) to the clipboard
        clip.set([
            { type, data: data, raw: true },
            { type: "html", data: html }
        ]);
    }

    hasImageInClipboard() {
        const clip = nw.Clipboard.get();
        return clip.readAvailableTypes().indexOf("png") !== -1;
    }
    
    pasteFromClipboard() {
        const clip = nw.Clipboard.get();
        if (this.hasImageInClipboard()) {
            const base64 = clip.get("png", true),
                binary = Buffer.from(base64, "base64"),
                filename = Date.now() + "--img.png";
            fs.writeFileSync(this.dir.getFile(filename), binary);
            this.dir.notify();
        }
    }

    open(file) {
        nw.Shell.openItem(this.dir.getFile(file));
    }

    showInFolder(file) {
        nw.Shell.showItemInFolder(this.dir.getFile(file));
    }
};

exports.FileService = FileService;