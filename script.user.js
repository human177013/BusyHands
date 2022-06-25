// ==UserScript==
// @name         BusyHands
// @namespace    https://human177013.github.io
// @version      0.0.1
// @icon         https://i.imgur.com/uLAimaY.png
// @description  nhentai one-handed tool
// @author       human177013
// @include      /^https?://nhentai\.net/g/\d+/?$/
// @updateURL    https://human177013.github.io/BusyHands/script.meta.js
// @downloadURL  https://human177013.github.io/BusyHands/script.user.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

const URL = "https://human177013.github.io/BusyHands/busyhands.js";
const FETCH_MAX_ATTEMPT = 3;
const LOAD_INIT_WAIT = 0;
const LOAD_TIMEOUT = 5000;

let startTime = undefined;


function waitPageLoad() {
    return new Promise(resolve => {
        setTimeout((_document) => {
            // console.log("Checking document.readyState")
            if (_document.readyState !== 'complete' && !((Date.now() - startTime) > LOAD_TIMEOUT)) {
                // console.log('Document not ready');
                resolve(waitPageLoad());
            } else {
                console.log('Document ready');
                resolve(_document.readyState);
            }
        }, LOAD_INIT_WAIT, document);
    });
}

async function loadScript() {
    try {
        let fetchAttempt = 0
        startTime = Date.now();
        let docState = await waitPageLoad()

        if (docState !== 'complete') {
            throw new Error("Load Timeout: Page did noy load in a timely manner.")
        }

        fetch(URL).then((response) => {
            response.text().then((script) => {
                window.eval(script);
            });
        }).catch((error) => {
            fetchAttempt++;
            if (fetchAttempt > FETCH_MAX_ATTEMPT) {
                throw error;
            } else {
                console.log('BusyHands script failed to load ' + fetchAttempt + ' times.');
            }
        });
        
    } catch (error) {
        console.log('BusyHands failed to load!');
        console.error(error);
    }
}

loadScript();