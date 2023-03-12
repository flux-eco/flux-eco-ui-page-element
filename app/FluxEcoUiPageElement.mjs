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

    /**
     * @returns {string[]}
     */
    static get observedAttributes() {
        return ["state"];
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

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "state":
                this.changeState(JSON.parse(newValue));
                break;
            default:
                break;
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
        this.#shadow.innerHTML = "";
        this.#contentContainer = this.#createContentContainerElement(this.#id)
        this.#shadow.appendChild(this.#contentContainer);
        if (validatedState.hasOwnProperty(FluxEcoUiPageElement.stateName.stylesheetUrl)) {
            this.#shadow.appendChild(this.#createStyleSheetLinkElement(validatedState.stylesheetUrl));
        }

        if (validatedState.hasOwnProperty(FluxEcoUiPageElement.stateName.pageSections)) {
            const pageSections = validatedState.pageSections;

            async function processPageSections(pageSections, outbounds, contentContainer) {
                for (let i = 0; i < pageSections.length; i++) {
                    const pageSection = pageSections[i];
                    const gridContainerElement = await outbounds.createGridContainerElement(pageSection.gridContainerElementConfigUrl);
                    contentContainer.appendChild(gridContainerElement);

                    const gridContainerElementState = await outbounds.readState(pageSection.readStateActionUrl);

                    console.log(gridContainerElementState);


                    gridContainerElement.changeState(gridContainerElementState)
                }
            }
            processPageSections(pageSections, this.#outbounds, this.#contentContainer);
        }

        this.#state = validatedState;
        const stateStringified = JSON.stringify(this.#state)
        if (this.getAttribute("state") !== stateStringified) {
            this.setAttribute("state", stateStringified);
        }
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
