// chrome.runtime.sendMessage('I am loading content script', (response) => {
//     console.log(response);
//     console.log('I am content script')

// })

// window.onload = (event) => {
//     console.log('page is fully loaded');
// };

chrome.runtime.sendMessage('I am loading content script', (response) => {
    console.log(response);
    console.log('I am content script');
});

window.onload = (event) => {
    console.log('Page is fully loaded');

    // Retrieve "language" and "percentage" from Chrome storage
    chrome.storage.sync.get(["language", "percentage"], (data) => {

        let language = data.language || "es";  // Default to "es" (Spanish)
        let percentage = data.percentage !== undefined ? data.percentage : 50; // Default to 50

        console.log("Stored Language:", language);
        console.log("Stored Percentage:", percentage);

        // If values were not set in storage, save the default values
        if (!data.language || data.percentage === undefined) {
            chrome.storage.sync.set({ language, percentage }, () => {
                console.log("Default values set in Chrome storage:", { language, percentage });
            });
        }
    });
};
