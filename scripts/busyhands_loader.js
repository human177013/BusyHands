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