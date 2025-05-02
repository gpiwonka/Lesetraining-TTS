// background.js
(function() {
  chrome.runtime.onInstalled.addListener(() => {
    // Create main context menu items
    chrome.contextMenus.create({
      id: "read-selection",
      title: "Text vorlesen",
      contexts: ["selection"]
    });
    
    // Create submenu for reading modes
    chrome.contextMenus.create({
      id: "read-syllable-mode",
      parentId: "read-selection",
      title: "Silbenmodus",
      contexts: ["selection"]
    });
    
    chrome.contextMenus.create({
      id: "read-word-mode",
      parentId: "read-selection",
      title: "Wortmodus",
      contexts: ["selection"]
    });
    
    chrome.contextMenus.create({
      id: "read-bionic-mode",
      parentId: "read-selection",
      title: "Bionic Reading",
      contexts: ["selection"]
    });
    
    // Create speed submenu
    chrome.contextMenus.create({
      id: "read-speeds",
      title: "Vorlesegeschwindigkeit",
      contexts: ["selection"]
    });
    
    chrome.contextMenus.create({
      id: "read-selection-slow",
      parentId: "read-speeds",
      title: "Langsam",
      contexts: ["selection"]
    });
    
    chrome.contextMenus.create({
      id: "read-selection-normal",
      parentId: "read-speeds",
      title: "Normal",
      contexts: ["selection"]
    });
    
    chrome.contextMenus.create({
      id: "read-selection-fast",
      parentId: "read-speeds",
      title: "Schnell",
      contexts: ["selection"]
    });
    
    // Set default settings
    chrome.storage.local.set({
      defaultSpeed: 1.0,
      slowSpeed: 0.7,
      fastSpeed: 1.5,
      defaultMode: 'syllable'
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    // Lese-Modi
    if (info.menuItemId === "read-syllable-mode") {
      sendReadMessage(tab.id, 1.0, 'syllable');
    } 
    else if (info.menuItemId === "read-word-mode") {
      sendReadMessage(tab.id, 1.0, 'word');
    }
    else if (info.menuItemId === "read-bionic-mode") {
      sendReadMessage(tab.id, 1.0, 'bionic');
    }
    // Geschwindigkeiten
    else if (info.menuItemId === "read-selection-slow") {
      chrome.storage.local.get(['slowSpeed', 'defaultMode'], (data) => {
        sendReadMessage(tab.id, data.slowSpeed || 0.7, data.defaultMode || 'syllable');
      });
    } 
    else if (info.menuItemId === "read-selection-normal") {
      chrome.storage.local.get(['defaultSpeed', 'defaultMode'], (data) => {
        sendReadMessage(tab.id, data.defaultSpeed || 1.0, data.defaultMode || 'syllable');
      });
    }
    else if (info.menuItemId === "read-selection-fast") {
      chrome.storage.local.get(['fastSpeed', 'defaultMode'], (data) => {
        sendReadMessage(tab.id, data.fastSpeed || 1.5, data.defaultMode || 'syllable');
      });
    }
    // Direkte Auswahl aus Hauptmenü
    else if (info.menuItemId === "read-selection") {
      chrome.storage.local.get(['defaultSpeed', 'defaultMode'], (data) => {
        sendReadMessage(tab.id, data.defaultSpeed || 1.0, data.defaultMode || 'syllable');
      });
    }
  });
  
  function sendReadMessage(tabId, speed, mode) {
    chrome.tabs.sendMessage(tabId, {
      type: "READ_SELECTION",
      speed: speed,
      mode: mode
    });
  }
  
  // When icon is clicked
  chrome.action.onClicked.addListener((tab) => {
    // This will only fire if no popup is defined
    chrome.storage.local.get(['defaultSpeed', 'defaultMode'], (data) => {
      sendReadMessage(tab.id, data.defaultSpeed || 1.0, data.defaultMode || 'syllable');
    });
  });
})();