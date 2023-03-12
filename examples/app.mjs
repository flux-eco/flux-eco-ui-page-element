#!/usr/bin/env node

import {FluxEcoNodeHttpServer} from "../../flux-eco-node-http-server/app/server/FluxEcoNodeHttpServer.mjs";

async function app() {


    const httpServerConfig = /** @type FluxEcoHttpServerConfig */ {
        server: {
            port: '8500',
            host: 'localhost'
        },
        policies: null,
        routes: {
            "static": {
                "/public": {
                    "/favicon.ico": {
                        "contentType": "image/x-icon"
                    },
                    "/index.html": {
                        "contentType": "text/html"
                    },
                    "/main.mjs": {
                        "contentType": "application/javascript"
                    },
                    "/**/*.mjs": {
                        "contentType": "application/javascript"
                    },
                    "/**/*.map": {
                        "contentType": "application/javascript"
                    },
                    "/**/*.json": {
                        "contentType": "application/json"
                    },
                    "/**/*.css": {
                        "contentType": "text/css"
                    },
                    "/**/*.js": {
                        "contentType": "application/javascript"
                    },
                }
            },
            api: {}
        }
    };
    const server = await FluxEcoNodeHttpServer.new(httpServerConfig, null)
    // Start the server
    server.start();
}

app();