document.addEventListener('DOMContentLoaded', function() {
  // Load settings
  chrome.storage.local.get(['defaultSpeed', 'slowSpeed', 'fastSpeed', 'defaultMode'], function(data) {
    const defaultSpeed = document.getElementById('defaultSpeed');
    const slowSpeed = document.getElementById('slowSpeed');
    const fastSpeed = document.getElementById('fastSpeed');
    
    defaultSpeed.value = data.defaultSpeed || 1.0;
    slowSpeed.value = data.slowSpeed || 0.7;
    fastSpeed.value = data.fastSpeed || 1.5;
    
    updateValueDisplay('defaultSpeed');
    updateValueDisplay('slowSpeed');
    updateValueDisplay('fastSpeed');
    
    // Setze aktiven Modus-Button
    const mode = data.defaultMode || 'syllable';
    document.querySelectorAll('.mode-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    if (mode === 'syllable') {
      document.getElementById('syllable-mode').classList.add('active');
    } else if (mode === 'word') {
      document.getElementById('word-mode').classList.add('active');
    } else if (mode === 'bionic') {
      document.getElementById('bionic-mode').classList.add('active');
    }
  });
  
  // Add event listeners to sliders
  const sliders = ['defaultSpeed', 'slowSpeed', 'fastSpeed'];
  sliders.forEach(id => {
    const slider = document.getElementById(id);
    slider.addEventListener('input', function() {
      updateValueDisplay(id);
    });
    
    slider.addEventListener('change', function() {
      saveSettings();
    });
  });
  
  // Add event listeners to mode buttons
  document.getElementById('syllable-mode').addEventListener('click', function() {
    document.querySelectorAll('.mode-button').forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');
    chrome.storage.local.set({ defaultMode: 'syllable' });
  });
  
  document.getElementById('word-mode').addEventListener('click', function() {
    document.querySelectorAll('.mode-button').forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');
    chrome.storage.local.set({ defaultMode: 'word' });
  });
  
  document.getElementById('bionic-mode').addEventListener('click', function() {
    document.querySelectorAll('.mode-button').forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');
    chrome.storage.local.set({ defaultMode: 'bionic' });
  });
  
  // Add event listeners to buttons
  document.getElementById('read').addEventListener('click', function() {
    const speed = parseFloat(document.getElementById('defaultSpeed').value);
    
    // Ermittle den ausgewählten Modus
    let mode = 'syllable';
    if (document.getElementById('word-mode').classList.contains('active')) {
      mode = 'word';
    } else if (document.getElementById('bionic-mode').classList.contains('active')) {
      mode = 'bionic';
    }
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'READ_SELECTION',
        speed: speed,
        mode: mode
      });
    });
  });
  
  document.getElementById('stop').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'STOP_READING'
      });
    });
  });
});

function updateValueDisplay(id) {
  const slider = document.getElementById(id);
  const display = document.getElementById(id + 'Value');
  display.textContent = slider.value;
}

function saveSettings() {
  const defaultSpeed = parseFloat(document.getElementById('defaultSpeed').value);
  const slowSpeed = parseFloat(document.getElementById('slowSpeed').value);
  const fastSpeed = parseFloat(document.getElementById('fastSpeed').value);
  
  chrome.storage.local.set({
    defaultSpeed: defaultSpeed,
    slowSpeed: slowSpeed,
    fastSpeed: fastSpeed
  });
}