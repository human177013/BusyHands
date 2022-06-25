const Keys = Object.freeze({
    Control: 'Control',
    Shift: 'Shift',
    Alt: 'Alt'
});

const LOAD_INIT_WAIT = 0;
const LOAD_TIMEOUT = 5000;
const coverQuery = "div#cover a";

let startTime = undefined;

function waitPageLoad() {
    return new Promise(resolve => {
        setTimeout((_document) => {
            // console.log("Checking document.readyState")
            var readyState = _document.readyState
            if (readyState === 'loading' && !((Date.now() - startTime) > LOAD_TIMEOUT)) {
                console.log('Document not ready');
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
    var key = event.key;
    var keySequence = [];

    if (event.ctrlKey)
        keySequence.push(Keys.Control);
    if (event.shiftKey)
        keySequence.push(Keys.Shift);
    if (event.altKey)
        keySequence.push(Keys.Alt);
    keySequence.push(key.charAt(0).toUpperCase()+key.substring(1));

    console.log(keySequence.join("+"))

    switch (keySequence.join("+")) {
        case 'D':
        case 'ArrowRight':
            event.preventDefault();
            document.querySelector(coverQuery).click();
            break;
        default:
            return;
    }
}

start()