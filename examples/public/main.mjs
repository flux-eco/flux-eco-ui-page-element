import {FluxEcoUiPageElement} from "./flux-eco-ui-page-element/FluxEcoUiPageElement.mjs";
import {FluxEcoUiGridContainerElement} from "./flux-eco-ui-grid-container-element/FluxEcoUIGridContainerElement.mjs";
import {FluxEcoUiGridContainerElementOutboundsAdapter} from "./flux-eco-ui-grid-container-element/config/FluxEcoUiGridContainerElementOutboundsAdapter.mjs";
import {FluxEcoUiMapElement} from "./flux-eco-ui-map-element/FluxEcoUiMapElement.mjs";

const currentUrl = new URL(window.location.href);
const params = currentUrl.searchParams;
const page = params.get("page");

const uiMapElementSettings = await (await fetch("/public/configs/settings/flux-eco-ui-map-element-settings.json")).json();

const readState = (readStateActionUrl) => {
    /** fakeData **/
    return JSON.parse(JSON.stringify(
        {
            gridContainerElementItems: [
                {
                    tagName: FluxEcoUiMapElement.tagName,
                    config: /** @type FluxEcoUiMapElementConfig */ {
                        id: "mapElement",
                        settings: uiMapElementSettings,
                        initialState: {
                            mapElementView: {
                                center: {
                                    lat: 10.238972,
                                    lng: -23.433449
                                },
                                zoom: 13
                            },
                            mapElementMarkers: []
                        }
                    }
                }
            ]
        }
    ))
}

const gridContainerElementOutbounds = FluxEcoUiGridContainerElementOutboundsAdapter.new();
gridContainerElementOutbounds.registerCreateElementCallable(FluxEcoUiMapElement.tagName, (config) => {
    return FluxEcoUiMapElement.new(config)
})

const createGridContainerElement = async (configUrl) => {
    const config = await (await fetch(configUrl)).json();
    return FluxEcoUiGridContainerElement.new(config)
}

const state = await (await fetch(`/public/configs/pages/${page}.json`)).json();
const config =  /** @type {FluxEcoUiPageElementConfig} */  {
    id: page,
    settings: {},
    initialState: state,
    outbounds: {
        readState: readState,
        createGridContainerElement: createGridContainerElement
    }
}

const pageElement = FluxEcoUiPageElement.new(config);
document.body.appendChild(pageElement);