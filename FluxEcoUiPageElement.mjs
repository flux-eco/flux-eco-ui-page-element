export class FluxEcoUiPageElement extends HTMLElement {

    /**
     * @type {FluxEcoUiPageElementState}
     */
    #state;
    /**
     * @type {ShadowRoot}
     */
    #shadow;


    constructor(state) {
        super();
        this.setAttribute("id", state.id);
        this.#state = state;

        this.#shadow = this.attachShadow({mode: 'closed'});
    }

    static get tagName() {
        return 'flux-eco-ui-page-element'
    }

    /**
     * @param {string} id
     * @returns {FluxEcoUiPageElement}
     */
    static new(id) {
        const stylesheet = document.createElement("link");

        const logo = document.createElement("div");
        logo.classList.add("logo");

        const menu = document.createElement("div");
        menu.classList.add("menu");

        const breadcrumbs = document.createElement("div");
        breadcrumbs.classList.add("breadcrumbs");
        breadcrumbs.style.margin = '16px 0';

        const content = document.createElement("div");
        content.classList.add("content");

        const footer = document.createElement("div");
        footer.classList.add("footer");
        footer.style.margin = 'center';

        const state = {
            id: id,
            stylesheet: stylesheet,
            logo: logo,
            menu: menu,
            breadcrumbs: breadcrumbs,
            content: content,
            footer: footer
        }

        return new this(state);
    }

    connectedCallback() {
        this.#shadow.appendChild(this.#state.stylesheet);

        const layout = document.createElement("div");
        layout.classList.add("layout");

        const layoutHeader = document.createElement("div");
        layoutHeader.classList.add("layoutHeader");

        layoutHeader.appendChild(this.#state.logo)
        layoutHeader.appendChild(this.#state.menu);

        layout.appendChild(layoutHeader);

        const layoutBody = document.createElement("div");

        layoutBody.classList.add("layoutBody");
        layoutBody.style.padding = '0 50px';

        layoutBody.appendChild(this.#state.breadcrumbs);
        layoutBody.appendChild(this.#state.content);

        layout.appendChild(layoutBody);

        layout.appendChild(this.#state.footer);

        this.#shadow.appendChild(layout);
    }

    /**
     * @param {FluxEcoUiPageElementState} stateSubset
     */
    async changeStateSubset(stateSubset) {
        let changedAttributeNames = [];
        for (const [key, value] of Object.entries(this.#state)) {
            if (stateSubset.hasOwnProperty(key) === false) {
                continue;
            }

            if (stateSubset.key !== value) {
                console.log(stateSubset)
                changedAttributeNames.push(key);
            }
        }

        if (changedAttributeNames.length > 0) {
            this.#applyStateChanged(stateSubset, changedAttributeNames);
        }
    }

    /**
     * @param {FluxEcoUiPageElementState} changedStateSubset
     * @param {array} changedAttributeNames
     */
    async #applyStateChanged(changedStateSubset, changedAttributeNames) {

        const applyChanged = {};
        applyChanged.id = (id) => {
            this.setAttribute("id", id);
        }
        applyChanged.stylesheet = (stylesheet) => {
            this.#state.stylesheet.innerHTML = stylesheet.innerHTML
        }
        applyChanged.logo = (logo) => {
            this.#state.logo.innerHTML = logo.innerHTML;
        }
        applyChanged.menu = (menu) => {
            this.#state.menu.innerHTML = menu.innerHTML;
        }
        applyChanged.breadcrumb = (breadcrumb) => {
            this.#state.breadcrumb.innerHTML = breadcrumb.innerHTML;
        }
        applyChanged.content = (content) => {
            this.#state.content.innerHTML = content.innerHTML;
        }
        applyChanged.footer = (footer) => {
            this.#state.footer.innerHTML = footer.innerHTML;
        }

        changedAttributeNames.forEach(changedAttributeName => {
            applyChanged[changedAttributeName](changedStateSubset[changedAttributeName]);
        });
        changedAttributeNames.forEach(changedAttributeName => {
            this.#state[changedAttributeName] = changedStateSubset[changedAttributeName];
        });
    }
}

customElements.define(FluxEcoUiPageElement.tagName, FluxEcoUiPageElement);
