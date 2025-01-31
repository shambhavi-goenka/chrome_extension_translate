import React, { useState, useEffect } from "react";
import './popup.css';

const Popup = () => {
    const [language, setLanguage] = useState("es");
    const [percentage, setPercentage] = useState(50);

    useEffect(() => {
        chrome.storage.sync.get(["language", "percentage"], (result) => {
            if (result.language) {
                setLanguage(result.language);
            }
            else {
                chrome.storage.sync.set({ "language": "es" }, () => {
                    console.log('Language saved:', "es");
                });
                setLanguage("es");
            }
            if (result.percentage) {
                setPercentage(result.percentage);
            }
            else {
                chrome.storage.sync.set({ "percentage": 50 }, () => {
                    console.log('Percentage saved:', 50);
                });
                setPercentage(50);
            }
            console.log('Retrieved from storage:', result);
            //returns error object if nothing exists in storage - should not happen now cause default values are set
        });
    }, []);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);
        chrome.storage.sync.set({ "language": newLanguage }, () => {
            console.log('Language saved:', newLanguage);
            // chrome.storage.sync.get(["language"], (result) => {
            //     console.log('Verified language from storage:', result.language);
            // });
        });
    };

    const handlePercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPercentage = Math.round(Number(event.target.value) / 5) * 5;
        setPercentage(newPercentage);
        chrome.storage.sync.set({ "percentage": newPercentage }, () => {
            console.log('Percentage saved:', newPercentage);
            // chrome.storage.sync.get(["percentage"], (result) => {
            //     console.log('Verified percentage from storage:', result.percentage);
            // });
        });
    };

    return (
        <div className="popup-container">
            <h1 className="popup-title">Choose your reads</h1>
            <form className="popup-form">
                <label className="popup-label">
                    Target Language:
                    <select value={language} onChange={handleLanguageChange} className="popup-select">
                        <option value="es">Spanish</option>
                        <option value="de">German</option>
                        <option value="hi">Hindi</option>
                        <option value="fr">French</option>
                    </select>
                </label>
                <br />
                <label className="popup-label">
                    Random Percentage:
                    <input
                        type="range"
                        min="1"
                        max="100"
                        step="5"
                        value={percentage}
                        onChange={handlePercentageChange}
                        className="popup-slider"
                    />
                    {percentage}%
                </label>
            </form>
        </div>
    );
};

export default Popup;