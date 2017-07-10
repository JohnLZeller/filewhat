chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (sender.id !== chrome.runtime.id){
            return;
        }
        console.log(request);
    });
