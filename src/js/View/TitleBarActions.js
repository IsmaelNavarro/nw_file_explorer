const appWindow = nw.Window.get();
/**
 * View class to handle titlebar actions
 */
class TitleBarActionsView {
    /**
     * Constructs the view
     * @param {HTMLElement} boundingEl
     */
    constructor(boundingEl, i18nService) {
        this.unmaximizeEl = boundingEl.querySelector("[data-bind=unmaximize]");
        this.maximizeEl = boundingEl.querySelector("[data-bind=maximize]");
        this.minimizeEl = boundingEl.querySelector("[data-bind=minimize]");
        this.closeEl = boundingEl.querySelector("[data-bind=close]");
        this.i18n = i18nService;
        i18nService.on("update", () => this.translate());
        this.bindUi();

        appWindow.on("maximize", () => this.toggleButtons(false));
        appWindow.on("minimize", () => this.toggleButtons(false));
        appWindow.on("restore", () => this.toggleButtons(true));
    }

    toggleButtons(reset) {
        this.maximizeEl.classList.toggle("is-hidden", !reset);
        this.unmaximizeEl.classList.toggle("is-hidden", reset);
        this.minimizeEl.classList.toggle("is-hidden", !reset);
    }

	/**
	 * Subscribe for click events
	 */
    bindUi() {
        this.closeEl.addEventListener("click", this.onClose.bind(this), false);
        this.minimizeEl.addEventListener("click", this.onMinimize.bind(this), false);
        this.maximizeEl.addEventListener("click", this.onMaximize.bind(this), false);
        this.unmaximizeEl.addEventListener("click", this.onUnmaximize.bind(this), false);
    }

    translate() {
        this.unmaximizeEl.title = this.i18n.translate("RESTORE_WIN", "Restore window");
        this.maximizeEl.title = this.i18n.translate("MAXIMIZE_WIN", "Maximize window");
        this.minimizeEl.title = this.i18n.translate("MINIMIZE_WIN", "Minimize window");
        this.closeEl.title = this.i18n.translate("CLOSE_WIN", "Close window");
    }

	/**
	 * Toggle maximize/restore buttons visibility
	 */
    toggleMaximize() {
        this.maximizeEl.classList.toggle("is-hidden");
        this.unmaximizeEl.classList.toggle("is-hidden");
    }
    /**
     * Handle when 'unmaximize' button is clicked
     * @param {Event} e
     */
    onUnmaximize(e) {
        e.preventDefault();
        appWindow.unmaximize();
        this.toggleMaximize();
    }
    /**
     * Handle when 'maximize' button is clicked
     * @param {Event} e
     */
    onMaximize(e) {
        e.preventDefault();
        appWindow.maximize();
        this.toggleMaximize();
    }
    /**
     * Handle when 'minimize' button is clicked
     * @param {Event} e
     */
    onMinimize(e) {
        e.preventDefault();
        appWindow.minimize();
    }
    /**
     * Handle when 'close' button is clicked
     * @param {Event} e
     */
    onClose(e) {
        e.preventDefault();
        appWindow.close();
    }
}

exports.TitleBarActionsView = TitleBarActionsView;