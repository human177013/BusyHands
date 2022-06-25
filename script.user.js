// ==UserScript==
// @name         BusyHands
// @namespace    https://human177013.github.io
// @version      0.0.1
// @icon         https://i.imgur.com/uLAimaY.png
// @description  nhentai one-handed tool
// @author       human177013
// @match        /^https?://nhentai\.net/g/\d+?/$/
// @updateURL    https://human177013.github.io/BusyHands/script.meta.js
// @downloadURL  https://human177013.github.io/BusyHands/script.user.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

const URL = "https://human177013.github.io/BusyHands/busyhands.js";
const FETCH_MAX_ATTEMPT = 3;
const LOAD_TIMEOUT = 30000;


async function loadScript() { 
    try {
        var fetchAttempt = 0
        var startTime = Date.now()
        
        fetch(URL).then((response) => {
            response.text().then((script) => {
                while (document.readyState !== 'complete') {
                    if ((Date.now() - startTime) > 30000) {
                        throw new Error("Load Timeout: Page did noy load in a timely manner.")
                    }
                }
                window.eval(script);                
            });
        }).catch((error) => {
            fetchAttempt++;
            if (fetchAttempt > FETCH_MAX_ATTEMPT ) {
                throw error;
            } else {
                console.log('BusyHands script failed to load '+ fetchAttempt + ' times.');
            }
        });
    } catch (error) {
        console.log('BusyHands failed to load!');
        console.error(error);
    }
}

loadScript();