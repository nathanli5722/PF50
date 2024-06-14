chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ hd: 0});
    chrome.storage.local.set({ hr: 0});
    chrome.storage.local.set({ dt: 0});
});
//doesn't work LMAO