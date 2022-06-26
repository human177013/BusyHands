const Keys = Object.freeze({
    Ctrl: 'Ctrl',
    Shift: 'Shift',
    Alt: 'Alt'
});

const LOAD_INIT_WAIT = 0;
const LOAD_TIMEOUT = 5000;

const RANDOM_HREF = "/random/";

const SELECTION_CLASS = "busyhands_seleted"

const HOME_URL_PATTERN = /^https?:\/\/nhentai\.net\/?$/g
const HOME_PAGES_URL_PATTERN = /^https?:\/\/nhentai\.net\/\?page=\d+$/g
const SEARCH_URL_PATTERN = /^https?:\/\/nhentai\.net\/search\/\?q=.+$/g
const POPULAR_CONTAINER_QUERY = "div.container.index-container.index-popular";
const MAIN_CONTAINER_QUERY = "div.container.index-container:not(.index-popular)";
const GALLERY_QUERY = "div.gallery";
const GALLERY_LINK_QUERY = 'a.cover';
const PREVIOUS_PAGE_QUERY = "a.previous";
const NEXT_PAGE_QUERY = "a.next"
const CURRENT_SELECTION_QUERY = "div.gallery." + SELECTION_CLASS

const GALLERY_URL_PATTERN = /^https?:\/\/nhentai\.net\/g\/\d+\/?$/g
const COVER_QUERY = "div#cover a";

const GALLERY_IMAGE_URL_PATTERN = /^https?:\/\/nhentai\.net\/g\/\d+\/\d+\/$/g
const GO_BACK_QUERY = "a.go-back";

const SELECTION_STYLE = `
      ${CURRENT_SELECTION_QUERY} {
        outline: #ed2553 solid 4px;
      }
    `;

let startTime = undefined;

function waitPageLoad() {
    return new Promise(resolve => {
        setTimeout((_document) => {
            // console.log("Checking document.readyState")
            var readyState = _document.readyState
            if (readyState === 'loading' && !((Date.now() - startTime) > LOAD_TIMEOUT)) {
                // console.log('Document not ready');
                readyState = waitPageLoad()
            }
            resolve(readyState);
        }, LOAD_INIT_WAIT, document);
    });
}

async function start() {
    try {
        startTime = Date.now();
        let docState = await waitPageLoad()

        if (docState === 'loading') {
            throw new Error("Load Timeout: Page did noy load in a timely manner.")
        }

        console.log('BusyHands Started');

        let style = document.createElement('style');
        style.innerHTML = SELECTION_STYLE;
        document.head.appendChild(style);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Control' || event.key === 'Shift' || event.key === 'Alt')
                return; // Do nothing.
            else
                handleKeyEvent(event);
        }, false);

    } catch (error) {
        console.log('BusyHands failed');
        console.error(error);
    }
}

function handleKeyEvent(event) {
    var code = event.code;
    var keySequence = [];

    if (event.ctrlKey)
        keySequence.push(Keys.Ctrl);
    if (event.shiftKey)
        keySequence.push(Keys.Shift);
    if (event.altKey)
        keySequence.push(Keys.Alt);
    keySequence.push(code.replace(/Digit|Key/i, ""));

    var keySequenceStr = keySequence.join("+");
    console.log(keySequenceStr);

    if (document.URL.match(HOME_URL_PATTERN) || document.URL.match(HOME_PAGES_URL_PATTERN) || document.URL.match(SEARCH_URL_PATTERN)) {
        handleKeyEventSelection(event, keySequenceStr)
    } else if (document.URL.match(GALLERY_URL_PATTERN)) {
        handleKeyEventGallery(event, keySequenceStr)
    } else if (document.URL.match(GALLERY_IMAGE_URL_PATTERN)) {
        handleKeyEventGalleryImage(event, keySequenceStr)
    } else {
        handleKeyEventGlobal(event, keySequenceStr)
    }
}

function handleKeyEventSelection(event, keySequenceStr) {
    switch (keySequenceStr) {
        case 'W':
        case 'ArrowUp':
            event.preventDefault();
            changeSelection(-getCollumCount())
            break;
        case 'A':
        case 'ArrowLeft':
            event.preventDefault();
            changeSelection(-1)
            break;
        case 'S':
        case 'ArrowDown':
            event.preventDefault();
            changeSelection(getCollumCount())
            break;
        case 'D':
        case 'ArrowRight':
            event.preventDefault();
            changeSelection(1)
            break;
        case 'F':
        case 'Enter':
            event.preventDefault();
            let current = document.querySelector(CURRENT_SELECTION_QUERY);
            if (current) {
                let a = current.querySelector(GALLERY_LINK_QUERY);
                a.setAttribute("target", "_blank");
                a.click();
            }
            break;
        case 'Q':
        case 'PageUp':
            event.preventDefault();
            let previous = document.querySelector(PREVIOUS_PAGE_QUERY);
            if (previous)
                previous.click();
            break;
        case 'E':
        case 'PageDown':
            event.preventDefault();
            let next = document.querySelector(NEXT_PAGE_QUERY);
            if (next)
                next.click();
            break;
        default:
            handleKeyEventGlobal(event, keySequenceStr);
    }
}

function handleKeyEventGallery(event, keySequenceStr) {
    switch (keySequenceStr) {
        case 'D':
        case 'ArrowRight':
            event.preventDefault();
            document.querySelector(COVER_QUERY).click();
            break;
        default:
            handleKeyEventGlobal(event, keySequenceStr);
    }
}

function handleKeyEventGalleryImage(event, keySequenceStr) {
    switch (keySequenceStr) {
        case 'G':
        case 'Home':
            event.preventDefault();
            document.querySelector(GO_BACK_QUERY).click();
            break;
        default:
            handleKeyEventGlobal(event, keySequenceStr);
    }
}

function handleKeyEventGlobal(event, keySequenceStr) {
    switch (keySequenceStr) {
        case 'R':
            event.preventDefault();
            window.open(RANDOM_HREF, "_blank");
            break;
        default:
            return;
    }
}

function getCollumCount() {
    let containerWidth = document.querySelector(MAIN_CONTAINER_QUERY).offsetWidth
    let galleryWidth = document.querySelector(GALLERY_QUERY).offsetWidth
    let marginWidth = document.querySelector(GALLERY_QUERY).offsetLeft * 2
    return Math.floor((containerWidth - marginWidth) / galleryWidth)
}

function changeSelection(distance) {
    let current = document.querySelector(CURRENT_SELECTION_QUERY);
    if (!current) {
        selectGallery(document.querySelector(GALLERY_QUERY)); //select first if none selected
    } else {
        let popularGalleries = undefined;
        let mainGalleries = undefined;
        let currentindex = -1;

        currentindex = Array.prototype.indexOf.call(popularGalleries, current);
        if (currentindex > -1) {
            changeSelectionPopular(distance, current, currentindex)
        } else {
            currentindex = Array.prototype.indexOf.call(mainGalleries, current);
            changeSelectionMain(distance, current, currentindex)
        }       
    }
}

function changeSelectionPopular(distance, current, currentindex) {
    let popularGalleries = document.querySelectorAll(POPULAR_CONTAINER_QUERY + " " + GALLERY_QUERY);

    let isFromMain = (Array.prototype.indexOf.call(popularGalleries, current) === -1)

    let newGalleryindex = currentindex + distance;
    if (isFromMain) {
        newGalleryindex = popularGalleries.length - ((popularGalleries.length % distance) - currentindex);
        if (newGalleryindex > popularGalleries.length - 1)
            newGalleryindex = popularGalleries.length - 1;
        return selectGallery(popularGalleries.item(newGalleryindex));
    } else if (newGalleryindex < 0) {
        return current;
    } else if (newGalleryindex > popularGalleries.length - 1) {
        return changeSelectionMain(distance, current, currentindex);
    } else {
        return selectGallery(popularGalleries.item(newGalleryindex));
    }
}

function changeSelectionMain(distance, current, currentindex) {
    let mainGalleries = document.querySelectorAll(MAIN_CONTAINER_QUERY + " " + GALLERY_QUERY);

    let isFromPopular = (Array.prototype.indexOf.call(mainGalleries, current) === -1)

    let newGalleryindex = currentindex + distance;
    if (isFromPopular) {
        let width = getCollumCount();
        newGalleryindex = width - (width - (currentindex % distance));
        return selectGallery(popularGalleries.item(newGalleryindex));
    } else if (isFromPopular < 0) {
        if (document.URL.match(HOME_URL_PATTERN)) {
            return changeSelectionPopular(distance, current, currentindex)
        } else {
            return selectGallery(mainGalleries.item(0));
        }
    } else if (newGalleryindex >= mainGalleries.length) {
        return current;
    } else {
        return selectGallery(mainGalleries.item(newGalleryindex));
    }
}

function selectGallery(galleryElement) {
    let current = document.querySelectorAll(CURRENT_SELECTION_QUERY);

    if (current) {
        current.forEach(element => {
            element.classList.remove(SELECTION_CLASS);
        });
    }

    galleryElement.classList.add(SELECTION_CLASS);

    return current[current.length - 1];
}

start()