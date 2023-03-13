export class FluxEcoUiPageElement extends HTMLElement {
    /**
     * @type {string|null}
     */
    #id = null;
    /**
     * @type {FluxEcoUiPageElementSettings}
     */
    #settings;
    /**
     * @type {FluxEcoUiPageElementState|null}
     */
    #state;
    /**
     * @type ShadowRoot
     */
    #shadow;
    /**
     * @type {FluxEcoUiPageElementOutbounds}
     */
    #outbounds;
    /**
     * @type {HTMLElement}
     */
    #contentContainer;


    /**
     * @param {FluxEcoUiPageElementConfig} validatedConfig
     */
    constructor(validatedConfig) {
        super();

        if (validatedConfig.hasOwnProperty("id")) {
            this.#id = validatedConfig.id;
        }
        this.#settings = validatedConfig.settings;
        if (validatedConfig.hasOwnProperty("initialState")) {
            this.#state = validatedConfig.initialState;
        }
        this.#outbounds = validatedConfig.outbounds;

        this.#shadow = this.attachShadow({mode: 'closed'});
    }

    /**
     * @returns {HTMLLinkElement}
     */
    #createStyleSheetLinkElement(stylesheetUrl) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = stylesheetUrl;
        return link;
    }

    static get tagName() {
        return 'flux-eco-ui-page-element'
    }

    static get stateName() {
        return {
            stylesheetUrl: "stylesheetUrl",
            pageSections: "pageSections"
        }
    }

    /**
     * @param {FluxEcoUiPageElementConfig} validatedConfig
     * @returns {FluxEcoUiPageElement}
     */
    static new(validatedConfig) {
        return new FluxEcoUiPageElement(validatedConfig);
    }

    connectedCallback() {
        if (this.#id === null) {
            this.#id = FluxEcoUiPageElement.tagName;
        }
        this.setAttribute("id", this.#id);

        this.#contentContainer = this.#createContentContainerElement(this.#id)
        this.#shadow.appendChild(this.#contentContainer);

        if (this.#state) {
            this.#applyStateChanged(this.#state)
        }
    }

    changeState(newState) {
        //todo validate

        this.#applyStateChanged(newState);
    }

    /**
     * @param {FluxEcoUiPageElementState} validatedState
     */
    async #applyStateChanged(validatedState) {

        console.log(validatedState);

        this.#shadow.innerHTML = "";
        this.#contentContainer = this.#createContentContainerElement(this.#id)
        this.#shadow.appendChild(this.#contentContainer);
        if (validatedState.hasOwnProperty(FluxEcoUiPageElement.stateName.stylesheetUrl)) {
            this.#shadow.appendChild(this.#createStyleSheetLinkElement(validatedState.stylesheetUrl));
        }

        if (validatedState.hasOwnProperty(FluxEcoUiPageElement.stateName.pageSections)) {
            const pageSections = validatedState.pageSections;
            for (const [key, pageSection] of Object.entries(pageSections)) {

                const gridContainerElement = await this.#outbounds.createGridContainerElement(pageSection.gridContainerId, pageSection.gridContainerElementSettings, pageSection.gridContainerElementItems);
                this.#contentContainer.appendChild(gridContainerElement);
            }
        }
        this.#state = validatedState;
    }


    /**
     * @returns {HTMLElement}
     */
    #createContentContainerElement(id) {
        const contentContainerId = [id, 'content'].join("/");
        const contentContainer = document.createElement("div");
        contentContainer.id = contentContainerId;
        return contentContainer;
    }

}

customElements.define(FluxEcoUiPageElement.tagName, FluxEcoUiPageElement);
