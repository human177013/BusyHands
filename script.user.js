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

const URL = "https://human177013.github.io/BusyHands/busyhands.js";
const FETCH_MAX_ATTEMPT = 3;


(function() {
    try {
        let fetchAttempt = 0

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
})();