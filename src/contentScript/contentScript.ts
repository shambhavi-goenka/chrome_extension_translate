window.onload = () => {
    console.log("Page fully loaded.");
    chrome.storage.sync.get(["language", "percentage"], (data) => {
        let language = data.language || "es"; // Default language: Spanish
        let percentage = data.percentage !== undefined ? data.percentage : 50; // Default: 50%
        // percentage = percentage/100;
        console.log("Translating to:", language);
        console.log("Percentage:", percentage);
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

    let originalTexts = textNodes.map((node, index) => {
        let textWithDelimiters = node.nodeValue.replace(" ", "\n@\n");
        return `<<<${index}>>>${textWithDelimiters.trim()}`;
    });
    let combinedText = originalTexts.join("\n@@@\n"); // Trick API into treating them as separate lines

    chrome.runtime.sendMessage({ action: "translate", text: combinedText, to: targetLanguage }, (response) => {
        if (response?.translatedText) {
            console.log("Translated response:", response.translatedText);

            const translatedSegments: string[] = response.translatedText.split(/\s*@@@@\s*/).map(segment => segment.trim());

            if (translatedSegments.length === textNodes.length) {
                textNodes.forEach((node, i) => {
                    let translatedText = translatedSegments[i].replace(/<<<\s*\d+\s*>>>/, "").trim();
                    let originalText = node.nodeValue;

                    // Split by words AND preserve spaces exactly as they are
                    let originalWords = originalText.match(/\S+|\s+/g) || [];
                    let translatedWords = translatedText.split("\n@\n");
                    // let translatedWords = translatedText.match(/\S+|\s+/g) || [];

                    // if (originalWords.length !== translatedWords.length) {
                    //     console.warn(`Word count mismatch in node ${i}: Expected ${originalWords.length}, got ${translatedWords.length}`);
                    // }

                    // Randomly decide which words to translate
                    let modifiedWords = originalWords.map((word, index) => {
                        if (!word.trim()) return word; // Preserve spaces exactly
                        if (Math.random() * 100 < 50) {
                            return translatedWords[index] || word; // Fallback to original if missing
                        }
                        return word;
                    });

                    // Reconstruct sentence while keeping original spaces
                    let textWithoutMarker = modifiedWords.join("");

                    // Assign modified text back to the node
                    node.nodeValue = textWithoutMarker || node.nodeValue;
                });
            } 
            
            // else {
            //     console.warn(`Translation mismatch: Expected ${textNodes.length} segments, got ${translatedSegments.length}`);
            // }

        } else {
            console.error("Translation failed:", response?.error);
        }
    });
}
