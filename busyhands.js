const LOAD_INIT_WAIT = 0;
const LOAD_TIMEOUT = 5000;

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
        let fetchAttempt = 0
        startTime = Date.now();
        let docState = await waitPageLoad()

        if (docState === 'loading') {
            throw new Error("Load Timeout: Page did noy load in a timely manner.")
        }
        
        console.log('BusyHands Started');

    } catch (error) {
        console.log('BusyHands failed');
        console.error(error);
    }
}

start()