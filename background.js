let currentSite = null;
let startTime = Date.now();

// When tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
        handleTabChange(tab.url);
    }
});

// When page updates (refresh / new URL)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active && tab.url) {
        handleTabChange(tab.url);
    }
});

function handleTabChange(url) {

    let endTime = Date.now();
    let timeSpent = endTime - startTime;

    if (currentSite) {
        chrome.storage.local.get([currentSite], function(result) {
            let previousTime = result[currentSite] || 0;

            chrome.storage.local.set({
                [currentSite]: previousTime + timeSpent
            });
        });
    }

    try {
        let parsedUrl = new URL(url);
        currentSite = parsedUrl.hostname;
    } catch (error) {
        currentSite = null;
    }

    startTime = Date.now();
}
