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

async function start() {
    try {
        let fetchAttempt = 0
        startTime = Date.now();
        let docState = await waitPageLoad()

        if (docState !== 'complete') {
            throw new Error("Load Timeout: Page did noy load in a timely manner.")
        }
        
        console.log('BusyHands Started');

    } catch (error) {
        console.log('BusyHands failed');
        console.error(error);
    }
}

start()