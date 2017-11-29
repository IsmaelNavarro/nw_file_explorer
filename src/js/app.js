
const { DirService } = require("./Service/Dir");
const { I18nService } = require("./Service/I18n");
const { FileService } = require("./Service/File");

const { TitleBarActionsView } = require("./View/TitleBarActions");
const { DirListView } = require("./View/DirList");
const { FileListView } = require("./View/FileList");
const { TitleBarPathView } = require("./View/TitleBarPathView");
const { LangSelectorView } = require("./View/LangSelector");
const { ContextMenuView } = require("./View/ContextMenu");
const { TrayView } = require("./View/Tray");

const { dictionary } = require("./Data/dictionary");

const i18n = new I18nService(dictionary);

const argv = require("minimist")(nw.App.argv),
dirService = new DirService(argv._[0]);
if (argv.maximize) {
nw.Window.get().maximize();
}
if (argv.minimize) {
nw.Window.get().minimize();
}

const file = new FileService(dirService);

new TitleBarActionsView(document.querySelector("[data-bind=titlebar]"), i18n);
new DirListView(document.querySelector("[data-bind=dirList]"), dirService);
new FileListView(document.querySelector("[data-bind=fileList]"), dirService, i18n, file);
new TitleBarPathView(document.querySelector("[data-bind=path]"), dirService, i18n);
new LangSelectorView(document.querySelector("[data-bind=langSelector]"), i18n);
new TrayView("File Explorer");
new ContextMenuView(file, i18n);

dirService.notify();


