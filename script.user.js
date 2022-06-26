// ==UserScript==
// @name         BusyHands
// @namespace    https://human177013.github.io
// @version      0.0.1
// @icon         https://i.imgur.com/uLAimaY.png
// @description  nhentai one-handed tool
// @author       human177013
// @match        https://nhentai.net/*
// @updateURL    https://human177013.github.io/BusyHands/script.meta.js
// @downloadURL  https://human177013.github.io/BusyHands/script.user.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

const SCRIPT_URL = "https://human177013.github.io/BusyHands/busyhands.js";
const FETCH_MAX_ATTEMPT = 3;
const FETCH_RETRY_DELAY = 1000;

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

function fetchRetry(url, delay, tries, fetchOptions = {}) {
    return fetch(url, fetchOptions).catch((error) => {
        triesLeft = tries - 1;
        if (!triesLeft) {
            throw err;
        }
        return wait(delay).then(() => fetchRetry(url, delay, triesLeft, fetchOptions));
    });
}


(function () {
    try {
        fetchRetry(SCRIPT_URL, FETCH_RETRY_DELAY, FETCH_MAX_ATTEMPT).then((response) => {
            response.text().then((script) => {
                window.eval(script);
            });
        });
    } catch (error) {
        console.log('BusyHands failed to load!');
        console.error(error);
    }
})();