// ==UserScript==
// @name         BusyHands-dev
// @namespace    https://human177013.github.io
// @version      1.1.0-dev
// @icon         https://i.imgur.com/uLAimaY.png
// @description  nhentai one-handed tool
// @author       human177013
// @match        https://nhentai.net/*
// @updateURL    https://human177013.github.io/BusyHands/busyhands-dev.meta.js
// @downloadURL  https://human177013.github.io/BusyHands/busyhands-dev.user.js
// @require      https://raw.githubusercontent.com/human177013/BusyHands/develop/busyhands.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    try {
        if (document.readyState !== 'loading') {
            start();
        } else {
            document.onreadystatechange = function () {
                if (document.readyState === 'complete') {
                    start();
                }
            }
        }        
    } catch (error) {
        console.log('BusyHands failed to load!');
        console.error(error);
    }
})();