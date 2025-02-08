window.onload = () => {
    console.log("Page fully loaded.");
    chrome.storage.sync.get(["language"], (data) => {
        let language = data.language || "es"; // Default language
        console.log("Translating to:", language);
        translatePageText(language);
    });
};

function gatherVisibleTextNodes(node: Node, nodes: Node[]) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== "" && isNodeVisible(node)) {
        nodes.push(node);
    } else {
        node.childNodes.forEach(child => gatherVisibleTextNodes(child, nodes));
    }
}

function isNodeVisible(node: Node): boolean {
    if (!node.parentElement) return false;
    const tag = node.parentElement.tagName;
    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(tag)) return false;

    const style = window.getComputedStyle(node.parentElement);
    return !(style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0);
}

function translatePageText(targetLanguage: string) {
    const textNodes: Node[] = [];
    gatherVisibleTextNodes(document.body, textNodes);

    let originalTexts = textNodes.map((node, index) => `<<<${index}>>>${node.nodeValue.trim()}`);
    let combinedText = originalTexts.join("\n@@@\n"); // Trick API into treating them as separate lines

    chrome.runtime.sendMessage({ action: "translate", text: combinedText, to: targetLanguage }, (response) => {
        if (response?.translatedText) {
            console.log("Translated response:", response.translatedText);

            const translatedSegments: string[] = response.translatedText.split(/\s*@@@@\s*/).map(segment => segment.trim());

            if (translatedSegments.length === textNodes.length) {
                textNodes.forEach((node, i) => {
                    let textWithoutMarker = translatedSegments[i].replace(/<<<\s*\d+\s*>>>/, "").trim();
                    node.nodeValue = textWithoutMarker || node.nodeValue;
                });
            } else {
                console.warn(`Translation mismatch: Expected ${textNodes.length} segments, got ${translatedSegments.length}`);
            }
        } else {
            console.error("Translation failed:", response?.error);
        }
    });
}
