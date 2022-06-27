

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

const Keys = Object.freeze({
    Ctrl: 'Ctrl',
    Shift: 'Shift',
    Alt: 'Alt'
});

let openAllGalleriesInNewTab = true; // Excludes random

function start() {
    try {
        console.log('BusyHands Started');

        let style = document.createElement('style');
        style.innerHTML = SELECTION_STYLE;
        document.head.appendChild(style);

        if (openAllGalleriesInNewTab && (document.URL.match(HOME_URL_PATTERN) || document.URL.match(HOME_PAGES_URL_PATTERN) || document.URL.match(SEARCH_URL_PATTERN))) {
            document.querySelectorAll(GALLERY_LINK_QUERY).forEach((element) => {
                element.setAttribute("target", "_blank")
            });

        }

        document.addEventListener('keydown', (event) => {
            try {
                if (event.key === 'Control' || event.key === 'Shift' || event.key === 'Alt')
                    return; // Do nothing.
                else
                    handleKeyEvent(event);
            } catch (error) {
                console.error(error);
            }
        }, false);

    } catch (error) {
        console.log('BusyHands failed');
        console.error(error);
    }
}

function testpop() {
    n = window.open('', '_blank');
    var state = n !== null;
    if (state)
        n.close()
    return state;
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
                current.querySelector(GALLERY_LINK_QUERY).click();
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
            document.location.href = RANDOM_HREF;
            break;
        default:
            return;
    }
}

function getCollumCount() {
    let count = 0;
    let previos = undefined;
    for (let element of document.querySelectorAll(GALLERY_QUERY)) {
        if (!previos || previos.getBoundingClientRect().top === element.getBoundingClientRect().top) {
            count++;
            previos = element;
        } else {
            break;
        }
    }
    return count;
}

function changeSelection(distance) {
    let current = document.querySelector(CURRENT_SELECTION_QUERY);
    if (!current) {
        selectGallery(current, document.querySelector(GALLERY_QUERY)); //select first if none selected
    } else {
        if (current.parentElement.classList.contains("index-popular")) {
            console.log("Current selected is in popular")
            changeSelectionPopular(distance, current)
        } else {
            console.log("Current selected is in main")
            changeSelectionMain(distance, current)
        }
    }
}

function changeSelectionPopular(distance, current, currentindex, isFromMain = false) {
    let popularGalleries = document.querySelectorAll(POPULAR_CONTAINER_QUERY + " " + GALLERY_QUERY);

    // console.log("isFromMain: " + isFromMain)
    // console.log("distance: " + distance)
    if (isFromMain) {
        let newGalleryindex = 0;
      	console.log("mod: " + popularGalleries.length % distance)
        if (popularGalleries.length % distance === 0)
            newGalleryindex = popularGalleries.length + distance + currentindex;
        else
            newGalleryindex = popularGalleries.length + (distance - (popularGalleries.length % distance)) + distance + currentindex;
        if (newGalleryindex > popularGalleries.length - 1)
            newGalleryindex = popularGalleries.length - 1;
        // console.log("currentindex: " + currentindex)
        // console.log("newGalleryindex: " + newGalleryindex)
        return selectGallery(current, popularGalleries.item(newGalleryindex));
    } else {
        currentindex = Array.prototype.indexOf.call(popularGalleries, current);
        let newGalleryindex = currentindex + distance;
        // console.log("currentindex: " + currentindex)
        // console.log("newGalleryindex: " + newGalleryindex)
        if (newGalleryindex < 0) {
            return current;
        } else if (newGalleryindex > popularGalleries.length - 1) {
            return changeSelectionMain(distance, current, currentindex, true);
        } else {
            return selectGallery(current, popularGalleries.item(newGalleryindex));
        }
    }
}

function changeSelectionMain(distance, current, currentindex = -1, isFromPopular = false) {
    let mainGalleries = document.querySelectorAll(MAIN_CONTAINER_QUERY + " " + GALLERY_QUERY);

    // console.log("isFromPopular: " + isFromPopular)
    // console.log("distance: " + distance)
    if (isFromPopular) {
        let width = getCollumCount();
        let newGalleryindex = width - (width - (currentindex % distance));
        // console.log("width: " + width)
        // console.log("newGalleryindex: " + newGalleryindex)
        return selectGallery(current, mainGalleries.item(newGalleryindex));
    } else {
        currentindex = Array.prototype.indexOf.call(mainGalleries, current)
        let newGalleryindex = currentindex + distance;
        // console.log("currentindex: " + currentindex)
        // console.log("newGalleryindex: " + newGalleryindex)
        if (newGalleryindex < 0) {
            if (document.URL.match(HOME_URL_PATTERN)) {
                return changeSelectionPopular(distance, current, currentindex, true)
            } else {
                return current;
            }
        } else if (newGalleryindex >= mainGalleries.length) {
            return current;
        } else {
            return selectGallery(current, mainGalleries.item(newGalleryindex));
        }
    }
}

function selectGallery(current, newGalleryElement) {
    if (current) {
        current.classList.remove(SELECTION_CLASS);
    }
    if (!isInViewport(newGalleryElement)) {
  	    newGalleryElement.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }
    newGalleryElement.classList.add(SELECTION_CLASS);
    return current;
}

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

if (document.readyState !== 'loading') {
    start()
} else {
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            start();
        }
    }
}
