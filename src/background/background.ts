import {translate} from "@vitalets/google-translate-api";

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("Received message:", msg);

    if (msg.action === "translate") {
        (async () => {
            try {
                const result = await translate(msg.text, { to: msg.to || "es" });
                console.log("Translation result:", result.text);
                sendResponse({ translatedText: result.text });
            } catch (error) {
                console.error("Translation error:", error);
                sendResponse({ error: "Translation failed" });
            }
        })();
        return true; // Keeps service worker alive
    }
});
