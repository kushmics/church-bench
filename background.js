const DEMO_TRIGGERS = [
  "banana.com",
  "cornhub.com",
  "cornhub.website",
  "goose.com",
  "goose-test.html",
];
const injectedTabs = new Set();

function canInject(url) {
  if (!url) return false;

  let parsed;
  try {
    parsed = new URL(url);
  } catch (_error) {
    return false;
  }

  if (!["http:", "https:", "file:"].includes(parsed.protocol)) return false;

  if (parsed.hostname.includes("linkedin.com")) return false;

  const searchableUrl = url.toLowerCase();
  return DEMO_TRIGGERS.some((trigger) => searchableUrl.includes(trigger));
}

async function deployChurchBench(tabId) {
  if (injectedTabs.has(tabId)) return;
  injectedTabs.add(tabId);

  try {
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ["styles.css"],
    });

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"],
    });
  } catch (error) {
    injectedTabs.delete(tabId);
    console.warn("Church Bench could not be deployed:", error);
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;

  if (canInject(tab.url)) {
    deployChurchBench(tabId);
  } else {
    injectedTabs.delete(tabId);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});
