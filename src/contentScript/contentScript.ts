// Notify background script that content script is active
chrome.runtime.sendMessage({ action: "content_script_loaded" }, (response) => {
    console.log(response);
    console.log("Content script is running.");
});

// Run when the page is fully loaded
window.onload = () => {
    console.log("Page fully loaded.");

    // Retrieve language and percentage settings from storage
    chrome.storage.sync.get(["language", "percentage"], (data) => {
        let language = data.language || "es"; // Default language: Spanish
        let percentage = data.percentage !== undefined ? data.percentage : 50; // Default: 50%

        console.log("Stored Language:", language);
        console.log("Stored Percentage:", percentage);

        // If storage values are missing, save defaults
        if (!data.language || data.percentage === undefined) {
            chrome.storage.sync.set({ language, percentage }, () => {
                console.log("Default values set in storage:", { language, percentage });
            });
        }

        // Example: Send text to background for translation
        chrome.runtime.sendMessage(
            { action: "translate", text: "Hello World", to: language },
            (response) => {
                if (response?.translatedText) {
                    console.log("Translated:", response.translatedText);
                } else {
                    console.error("Translation failed:", response?.error);
                }
            }
        );
    });
};
