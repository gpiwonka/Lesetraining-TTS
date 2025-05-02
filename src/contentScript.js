(function() {
  // Verwende den bereitgestellten Hyphenator
  const hypher = window.GermanHyphenator;
  // Leseoptionen
  let readingMode = 'syllable'; // 'syllable', 'word', 'bionic'
  
  function removeOverlay() {
    const existing = document.getElementById('tts-reader-overlay');
    if (existing) existing.remove();
    speechSynthesis.cancel();
  }
  
  function createOverlay(text, mode) {
    const overlay = document.createElement('div');
    overlay.id = 'tts-reader-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', top: '10px', left: '10px', right: '10px',
      padding: '15px', background: 'rgba(255,255,255,0.95)',
      zIndex: '2147483647', maxHeight: '45%', overflowY: 'auto',
      fontSize: '1.2em', lineHeight: '1.5',
      borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      fontFamily: 'Arial, sans-serif'
    });
  
    // Add controls to the overlay
    const controls = document.createElement('div');
    controls.className = 'tts-controls';
    Object.assign(controls.style, {
      display: 'flex', justifyContent: 'space-between',
      marginBottom: '15px', padding: '5px'
    });
    
    // Speed controls
    const controlsLeft = document.createElement('div');
    const speedLabel = document.createElement('span');
    speedLabel.textContent = 'Geschwindigkeit: ';
    
    const speedControl = document.createElement('input');
    speedControl.type = 'range';
    speedControl.min = '0.5';
    speedControl.max = '2';
    speedControl.step = '0.1';
    speedControl.value = '1';
    speedControl.style.marginRight = '15px';
    speedControl.addEventListener('change', (e) => {
      if (window.ttsUtterance) {
        window.ttsUtterance.rate = parseFloat(e.target.value);
        speechSynthesis.cancel();
        speechSynthesis.speak(window.ttsUtterance);
      }
    });
    
    controlsLeft.appendChild(speedLabel);
    controlsLeft.appendChild(speedControl);
    
    // Mode selection
    const modeSelector = document.createElement('div');
    modeSelector.style.marginLeft = '15px';
    
    // Syllable mode
    const syllableBtn = document.createElement('button');
    syllableBtn.textContent = 'Silben';
    syllableBtn.className = mode === 'syllable' ? 'mode-btn active' : 'mode-btn';
    syllableBtn.addEventListener('click', () => {
      readingMode = 'syllable';
      removeOverlay();
      createOverlay(text, 'syllable');
      startReading(text);
    });
    
    // Word mode
    const wordBtn = document.createElement('button');
    wordBtn.textContent = 'Wörter';
    wordBtn.className = mode === 'word' ? 'mode-btn active' : 'mode-btn';
    wordBtn.addEventListener('click', () => {
      readingMode = 'word';
      removeOverlay();
      createOverlay(text, 'word');
      startReading(text);
    });
    
    // Bionic mode
    const bionicBtn = document.createElement('button');
    bionicBtn.textContent = 'Bionic';
    bionicBtn.className = mode === 'bionic' ? 'mode-btn active' : 'mode-btn';
    bionicBtn.addEventListener('click', () => {
      readingMode = 'bionic';
      removeOverlay();
      createOverlay(text, 'bionic');
      startReading(text);
    });
    
    modeSelector.appendChild(syllableBtn);
    modeSelector.appendChild(wordBtn);
    modeSelector.appendChild(bionicBtn);
    
    controlsLeft.appendChild(modeSelector);
    controls.appendChild(controlsLeft);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.className = 'close-btn';
    closeBtn.addEventListener('click', removeOverlay);
    
    controls.appendChild(closeBtn);
    overlay.appendChild(controls);
  
    // Content container
    const content = document.createElement('div');
    content.className = 'tts-content';
    
    // Unterschiedliche Anzeige je nach Modus
    if (mode === 'syllable') {
      createSyllableContent(content, text);
    } else if (mode === 'word') {
      createWordContent(content, text);
    } else if (mode === 'bionic') {
      createBionicContent(content, text);
    }
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
  }
  // In der createSyllableContent-Funktion:
function createSyllableContent(container, text) {
  // Erstelle ein effizienteres Index-System für Silben und Wörter
  const words = text.split(/(\s+)/);
  let tokenIndex = 0;
  let wordIndex = 0;
  
  words.forEach(w => {
    if (!w || w.trim().length === 0) {
      // Leerzeichen
      const span = document.createElement('span');
      span.textContent = w;
      container.appendChild(span);
    } else {
      // Füge ein Wort-Container-Element hinzu
      const wordContainer = document.createElement('span');
      wordContainer.className = 'word-container';
      wordContainer.dataset.wordIndex = wordIndex++;
      
      // Silben in diesem Wort
      const syllables = hypher.hyphenate(w);
      let wordSyllableIndex = 0;
      
      syllables.forEach((syll, i) => {
        const span = document.createElement('span');
        span.textContent = syll;
        span.dataset.index = tokenIndex++;
        span.dataset.wordIndex = wordIndex - 1;
        span.dataset.wordSyllableIndex = wordSyllableIndex++;
        span.className = 'syllable';
        wordContainer.appendChild(span);
        
        // Visueller Trenner (außer am Ende)
        if (i < syllables.length - 1) {
          const sep = document.createElement('span');
          sep.textContent = '';
          sep.className = 'syllable-separator';
          wordContainer.appendChild(sep);
        }
      });
      
      container.appendChild(wordContainer);
    }
  });
}
  function createWordContent(container, text) {
    // Split text into words
    const words = text.split(/(\s+)/);
    let tokenIndex = 0;
    words.forEach(word => {
      if (!word || word.trim().length === 0) {
        // whitespace
        const span = document.createElement('span');
        span.textContent = word;
        container.appendChild(span);
      } else {
        const span = document.createElement('span');
        span.textContent = word;
        span.dataset.index = tokenIndex++;
        span.className = 'word';
        container.appendChild(span);
      }
    });
  }
  
  function createBionicContent(container, text) {
    // Erstelle Bionic Reading Inhalt
    container.innerHTML = hypher.createBionicText(text);
    
    // Füge Klassen für Wort-Highlighting hinzu
    const words = text.split(/(\s+)/);
    let tokenIndex = 0;
    let currentPos = 0;
    
    // Finde alle Wörter (ignoriere Leerzeichen)
    const wordElements = container.querySelectorAll('strong');
    wordElements.forEach((strong, index) => {
      // Parent-Element ist der eigentliche Wort-Container
      const parent = strong.parentElement;
      if (parent && parent.textContent.trim().length > 0) {
        parent.dataset.index = tokenIndex++;
        parent.className = 'bionic-word';
      }
    });
  }
  
  function highlightSyllable(index) {
    const overlay = document.getElementById('tts-reader-overlay');
    if (!overlay) return;
    
    // Remove previous highlights
    overlay.querySelectorAll('.syllable.active').forEach(span => {
      span.classList.remove('active');
    });
    
    // Add highlight to current syllable
    const current = overlay.querySelector(`.syllable[data-index="${index}"]`);
    if (current) {
      current.classList.add('active');
      scrollIntoViewIfNeeded(current);
    }
  }
  
  function highlightWord(index) {
    const overlay = document.getElementById('tts-reader-overlay');
    if (!overlay) return;
    
    // Entferne bisherige Hervorhebungen
    overlay.querySelectorAll('.word.active, .bionic-word.active').forEach(span => {
      span.classList.remove('active');
    });
    
    // Je nach Modus das richtige Element auswählen
    let current;
    if (readingMode === 'bionic') {
      current = overlay.querySelector(`.bionic-word[data-index="${index}"]`);
    } else {
      current = overlay.querySelector(`.word[data-index="${index}"]`);
    }
    
    if (current) {
      current.classList.add('active');
      scrollIntoViewIfNeeded(current);
    }
  }
  
  function scrollIntoViewIfNeeded(element) {
    const container = document.querySelector('.tts-content');
    if (!container || !element) return;
    
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    if (elementRect.bottom > containerRect.bottom || elementRect.top < containerRect.top) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  

function startReading(text) {
  // Analytische Vorarbeit: Text in Wörter und Silben zerlegen
  const wordObjects = [];
  let overallIndex = 0;
  
  // Text aufteilen und strukturieren
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  words.forEach((word, wordIndex) => {
    const syllables = hypher.hyphenate(word);
    const syllableObjects = syllables.map((syll, syllIndex) => {
      return {
        text: syll,
        indexInWord: syllIndex,
        globalIndex: overallIndex++,
        isLastInWord: syllIndex === syllables.length - 1
      };
    });
    
    wordObjects.push({
      text: word,
      index: wordIndex,
      syllables: syllableObjects,
      firstSyllableIndex: syllableObjects[0].globalIndex,
      charStartIndex: 0, // Wird später berechnet
      charEndIndex: 0    // Wird später berechnet
    });
  });
  
  // Berechne Textposition jedes Wortes
  let charIndex = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ' || text[i] === '\t' || text[i] === '\n') {
      charIndex++;
      continue;
    }
    
    // Finde das aktuelle Wort
    const wordMatch = text.substring(i).match(/^(\S+)/);
    if (wordMatch) {
      const currentWord = wordMatch[1];
      const matchingWordObj = wordObjects.find(w => w.text === currentWord && w.charStartIndex === 0);
      
      if (matchingWordObj) {
        matchingWordObj.charStartIndex = i;
        matchingWordObj.charEndIndex = i + currentWord.length - 1;
        i += currentWord.length - 1; // Springe zum Ende des Wortes
      }
    }
  }
  
  // Overlay-Elemente abrufen und vorbereiten
  const overlay = document.getElementById('tts-reader-overlay');
  if (!overlay) return;
  
  // Sprachausgabe starten
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = parseFloat(document.querySelector('.tts-controls input[type="range"]').value) || 1.0;
  utter.lang = 'de-DE';
  
  // Letztes hervorgehobenes Wort speichern für bessere Benutzererfahrung
  let lastHighlightedWordIndex = -1;
  let lastHighlightedSyllableIndex = -1;
  
  // Event-Handler für präzisere Silbenerkennung
  utter.onboundary = (event) => {
    if (event.name !== 'word') return;
    
    // Finde das Wort an der aktuellen Position
    const charIndex = event.charIndex;
    let currentWordObj = wordObjects.find(
      w => charIndex >= w.charStartIndex && charIndex <= w.charEndIndex
    );
    
    // Fallback: Verwende das nächste Wort, wenn keine exakte Übereinstimmung
    if (!currentWordObj) {
      const nextWords = wordObjects.filter(w => w.charStartIndex > charIndex);
      if (nextWords.length > 0) {
        nextWords.sort((a, b) => a.charStartIndex - b.charStartIndex);
        currentWordObj = nextWords[0];
      } else if (wordObjects.length > 0) {
        // Wenn wir am Ende sind, verwende das letzte Wort
        currentWordObj = wordObjects[wordObjects.length - 1];
      }
    }
    
    if (!currentWordObj) return;
    
    // Bestimme, welche Silbe im Wort hervorgehoben werden soll
    let syllableToHighlight = 0;
    if (currentWordObj.syllables.length > 1) {
      // Berechne relative Position im Wort
      const relPos = Math.max(0, charIndex - currentWordObj.charStartIndex);
      const wordLen = currentWordObj.text.length;
      const relPercentage = Math.min(1, relPos / wordLen);
      
      // Wähle Silbe basierend auf der relativen Position
      syllableToHighlight = Math.min(
        Math.floor(relPercentage * currentWordObj.syllables.length),
        currentWordObj.syllables.length - 1
      );
    }
    
    // Vermeide unnötige Aktualisierungen
    const wordIndex = currentWordObj.index;
    const syllableIndex = currentWordObj.syllables[syllableToHighlight].globalIndex;
    
    if (wordIndex === lastHighlightedWordIndex && 
        syllableIndex === lastHighlightedSyllableIndex) {
      return;
    }
    
    // Alle Silben im aktuellen Wort hervorheben
    highlightWordAndSyllable(overlay, currentWordObj, syllableToHighlight);
    
    lastHighlightedWordIndex = wordIndex;
    lastHighlightedSyllableIndex = syllableIndex;
  };
  
  utter.onend = () => {
    // Aufräumen nach Ende
    resetHighlighting(overlay);
  };
  
  window.ttsUtterance = utter;
  speechSynthesis.speak(utter);
}

function highlightWordAndSyllable(overlay, wordObj, syllableIndexInWord) {
  // Alle bisherigen Hervorhebungen entfernen
  resetHighlighting(overlay);
  
  // Alle Silben des Wortes markieren
  const wordSyllables = wordObj.syllables;
  wordSyllables.forEach((syllObj, idx) => {
    const syllElement = overlay.querySelector(`.syllable[data-index="${syllObj.globalIndex}"]`);
    if (syllElement) {
      syllElement.classList.add('current-word');
      
      // Die aktuelle Silbe stärker hervorheben
      if (idx === syllableIndexInWord) {
        syllElement.classList.add('active');
        
        // Sanftes Scrollen, um die aktive Silbe ins Sichtfeld zu bringen
        const container = overlay.querySelector('.tts-content');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const syllRect = syllElement.getBoundingClientRect();
          
          if (syllRect.bottom > containerRect.bottom || syllRect.top < containerRect.top) {
            syllElement.scrollIntoView({
              behavior: 'smooth', 
              block: 'center'
            });
          }
        }
      }
    }
  });
}

// Hilsfunktion zum Zurücksetzen der Hervorhebungen
function resetHighlighting(overlay) {
  overlay.querySelectorAll('.syllable').forEach(span => {
    span.classList.remove('active', 'current-word');
  });
}

function createSyllableContent(container, text) {
  
  const words = text.split(/(\s+)/);
  let tokenIndex = 0;
  let wordIndex = 0;
  
  words.forEach(w => {
    if (!w || w.trim().length === 0) {
      // Leerzeichen
      const span = document.createElement('span');
      span.textContent = w;
      container.appendChild(span);
    } else {
      // Wort-Container mit mehr Metadaten
      const wordContainer = document.createElement('span');
      wordContainer.className = 'word-container';
      wordContainer.dataset.wordIndex = wordIndex;
      wordContainer.dataset.word = w;
      
      // Silben dieses Wortes
      const syllables = hypher.hyphenate(w);
      syllables.forEach((syll, i) => {
        const span = document.createElement('span');
        span.textContent = syll;
        span.dataset.index = tokenIndex++;
        span.dataset.wordIndex = wordIndex;
        span.dataset.syllableInWord = i;
        span.dataset.isLastInWord = (i === syllables.length - 1) ? 'true' : 'false';
        span.className = 'syllable';
        wordContainer.appendChild(span);
        
        // Füge Silbentrenner hinzu (außer beim letzten)
        if (i < syllables.length - 1) {
          const sep = document.createElement('span');
          sep.textContent = '';
          sep.className = 'syllable-separator';
          wordContainer.appendChild(sep);
        }
      });
      
      container.appendChild(wordContainer);
      wordIndex++;
    }
  });
}
  
  function highlightSyllableInWord(syllableIndex, wordStartIndex, syllableCount) {
    const overlay = document.getElementById('tts-reader-overlay');
    if (!overlay) return;
    
    // Entferne bisherige Hervorhebungen
    overlay.querySelectorAll('.syllable').forEach(span => {
      span.classList.remove('active', 'current-word');
    });
    
    // Hebe alle Silben des aktuellen Wortes hervor
    for (let i = 0; i < syllableCount; i++) {
      const index = wordStartIndex + i;
      const syllableElement = overlay.querySelector(`.syllable[data-index="${index}"]`);
      if (syllableElement) {
        syllableElement.classList.add('current-word');
        // Die aktuelle Silbe zusätzlich hervorheben
        if (index === syllableIndex) {
          syllableElement.classList.add('active');
          scrollIntoViewIfNeeded(syllableElement);
        }
      }
    }
  }
  
  function handleSyllableBoundary(text, charIndex) {
    // Text bis zur aktuellen Position
    const spokenText = text.substring(0, charIndex);
    const words = spokenText.split(/\s+/).filter(word => word.trim().length > 0);
    
    // Zähle alle Silben bis zum aktuellen Wort
    let syllableCount = 0;
    for (let i = 0; i < words.length - 1; i++) {
      syllableCount += hypher.hyphenate(words[i]).length;
    }
    
    // Markiere alle Silben des aktuellen Wortes
    if (words.length > 0) {
      const currentWord = words[words.length - 1];
      const currentSyllables = hypher.hyphenate(currentWord);
      
      // Entferne alle vorherigen Hervorhebungen
      const overlay = document.getElementById('tts-reader-overlay');
      if (!overlay) return;
      
      overlay.querySelectorAll('.syllable').forEach(span => {
        span.classList.remove('active', 'current-word');
      });
      
      // Markiere alle Silben des aktuellen Wortes
      for (let i = 0; i < currentSyllables.length; i++) {
        const syllableIndex = syllableCount + i;
        const syllableElement = overlay.querySelector(`.syllable[data-index="${syllableIndex}"]`);
        
        if (syllableElement) {
          syllableElement.classList.add('current-word');
          // Die aktuelle Silbe innerhalb des Wortes wird zusätzlich hervorgehoben
          if (i === currentSyllables.length - 1) {
            syllableElement.classList.add('active');
          }
        }
      }
      
      // Scrolle zum aktuellen Wort, wenn nötig
      const firstSyllableElement = overlay.querySelector(`.syllable[data-index="${syllableCount}"]`);
      if (firstSyllableElement) {
        scrollIntoViewIfNeeded(firstSyllableElement);
      }
    }
  }
  
  function handleWordBoundary(text, charIndex) {
    const spokenText = text.substring(0, charIndex);
    const words = spokenText.split(/\s+/).filter(word => word.trim().length > 0);
    
    // Das aktuelle Wort ist das letzte im gesprochenen Text
    const currentWordIndex = Math.max(0, words.length - 1);
    highlightWord(currentWordIndex);
  }
  
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'READ_SELECTION') {
      removeOverlay();
      
      // Get and validate selection
      const selection = window.getSelection().toString().trim();
      if (!selection) { 
        alert('Bitte zuerst Text markieren.'); 
        return; 
      }
      
      // Set reading mode from message or use default
      readingMode = msg.mode || 'syllable';
      
      // Create overlay with the selected mode
      createOverlay(selection, readingMode);
      
      // Start reading
      startReading(selection);
    } else if (msg.type === 'STOP_READING') {
      removeOverlay();
    }
  });
})();