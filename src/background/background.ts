import { translate } from "@vitalets/google-translate-api";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "translate") {
        translate(msg.text, { to: msg.to || "es" })
            .then(res => {
                sendResponse({ translatedText: res.text });
            })
            .catch(err => {
                console.error("Translation error:", err);
                sendResponse({ error: err.message });
            });

        return true; // Required for async response
    }
});
