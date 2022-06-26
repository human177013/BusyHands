const Keys = Object.freeze({
    Ctrl: 'Ctrl',
    Shift: 'Shift',
    Alt: 'Alt'
});

const LOAD_INIT_WAIT = 0;
const LOAD_TIMEOUT = 5000;

const RANDOM_HREF = "/random/";

const GALLERY_URL_PATTERN = /^https?:\/\/nhentai\.net\/g\/\d+\/?$/g
const COVER_QUERY = "div#cover a";

const GALLERY_IMAGE_URL_PATTERN = /^https?:\/\/nhentai\.net\/g\/\d+\/\d+\/$/g
const GO_BACK_QUERY = "a.go-back";

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

    if (document.URL.match(GALLERY_URL_PATTERN)) {
        handleKeyEventGallery(event, keySequenceStr)
    } else if (document.URL.match(GALLERY_IMAGE_URL_PATTERN)) {
        handleKeyEventGalleryImage(event, keySequenceStr)
    } else {
        handleKeyEventGlobal(event, keySequenceStr)
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
            window.location.href = RANDOM_HREF;
            break;
        default:
            return;
    }
}

start()