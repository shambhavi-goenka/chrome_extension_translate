chrome.runtime.sendMessage('I am loading content script', (response) => {
    console.log(response);
    console.log('I am content script')

})

window.onload = (event) => {
    console.log('page is fully loaded');
};


// import translate from 'translate-google-api';

// chrome.runtime.sendMessage('I am loading content script', (response) => {
//     console.log(response);
//     console.log('I am content script');
// });

// window.onload = async (event) => {
//     console.log('page is fully loaded');

//     chrome.storage.sync.get(["language"], async (result) => {
//         const targetLanguage = result.language || 'es'; // Default to Spanish if no language is set

//         const textNodes = [];
//         const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
//         let node;
//         while (node = walker.nextNode()) {
//             textNodes.push(node);
//         }

//         const texts = textNodes.map(node => node.nodeValue);
//         try {
//             const translations = await translate(texts, { to: targetLanguage });
//             translations.forEach((translation, index) => {
//                 textNodes[index].nodeValue = translation;
//             });
//             console.log('Page translated to:', targetLanguage);
//         } catch (error) {
//             console.error('Translation error:', error);
//         }
//     });
// };