/**
 * Erweiterte deutsche Silbentrennung mit erweitertem Wörterbuch und Regelsystem
 */
(function() {
    // Erweitertes Wörterbuch für häufige, medizinische und komplexe Wörter
    const DICTIONARY = {
      // Medizinische Begriffe
      'herzkranzgefäße': ['herz', 'kranz', 'ge', 'fä', 'ße'],
      'herzinfarkt': ['herz', 'in', 'farkt'],
      'bluthochdruck': ['blut', 'hoch', 'druck'],
      'arterienverkalkung': ['ar', 'te', 'ri', 'en', 'ver', 'kal', 'kung'],
      'schlaganfall': ['schlag', 'an', 'fall'],
      'gefäßverengung': ['ge', 'fäß', 'ver', 'en', 'gung'],
      'ultraschalluntersuchung': ['ul', 'tra', 'schall', 'un', 'ter', 'su', 'chung'],
      'lungenentzündung': ['lun', 'gen', 'ent', 'zün', 'dung'],
      'kniegelenk': ['knie', 'ge', 'lenk'],
      'röntgenaufnahme': ['rönt', 'gen', 'auf', 'nah', 'me'],
      
      // Lange zusammengesetzte Wörter
      'bundeskanzleramt': ['bun', 'des', 'kanz', 'ler', 'amt'],
      'arbeitslosenversicherung': ['ar', 'beits', 'lo', 'sen', 'ver', 'si', 'che', 'rung'],
      'einwohnermeldeamt': ['ein', 'woh', 'ner', 'mel', 'de', 'amt'],
      'geschwindigkeitsbegrenzung': ['ge', 'schwin', 'dig', 'keits', 'be', 'gren', 'zung'],
      'universitätsbibliothek': ['uni', 'ver', 'si', 'täts', 'bi', 'blio', 'thek'],
      'kraftfahrzeugversicherung': ['kraft', 'fahr', 'zeug', 'ver', 'si', 'che', 'rung'],
      'wirtschaftswissenschaften': ['wirt', 'schafts', 'wis', 'sen', 'schaf', 'ten'],
      'gebäudereinigungsservice': ['ge', 'bäu', 'de', 'rei', 'ni', 'gungs', 'ser', 'vice'],
      'verkehrsinfrastruktur': ['ver', 'kehrs', 'in', 'fra', 'struk', 'tur'],
      'computerspieleentwicklung': ['com', 'pu', 'ter', 'spie', 'le', 'ent', 'wick', 'lung'],
      'verbraucherschutzorganisation': ['ver', 'brau', 'cher', 'schutz', 'or', 'ga', 'ni', 'sa', 'ti', 'on'],
      
      // Häufige Wörter
      'deutschland': ['deutsch', 'land'],
      'entwicklung': ['ent', 'wick', 'lung'],
      'geschichte': ['ge', 'schich', 'te'],
      'wissenschaft': ['wis', 'sen', 'schaft'],
      'forschung': ['for', 'schung'],
      'bildung': ['bil', 'dung'],
      'verschiedene': ['ver', 'schie', 'de', 'ne'],
      'beispiel': ['bei', 'spiel'],
      'zusätzlich': ['zu', 'sätz', 'lich'],
      'regierung': ['re', 'gie', 'rung'],
      'wichtig': ['wich', 'tig'],
      'schwierig': ['schwie', 'rig'],
      'einfach': ['ein', 'fach'],
      'computer': ['com', 'pu', 'ter'],
      'telefon': ['te', 'le', 'fon'],
      'internet': ['in', 'ter', 'net'],
      'möglichkeit': ['mög', 'lich', 'keit'],
      'unternehmen': ['un', 'ter', 'neh', 'men'],
      'verfügbar': ['ver', 'füg', 'bar'],
      'beziehung': ['be', 'zie', 'hung'],
      'präsident': ['prä', 'si', 'dent'],
      'familie': ['fa', 'mi', 'lie'],
      'restaurant': ['res', 'tau', 'rant'],
      'universität': ['uni', 'ver', 'si', 'tät'],
      'technologie': ['tech', 'no', 'lo', 'gie'],
      'wirklichkeit': ['wirk', 'lich', 'keit'],
      'umgebung': ['um', 'ge', 'bung'],
      'zusammen': ['zu', 'sam', 'men'],
      'aktuell': ['ak', 'tu', 'ell'],
      'besonders': ['be', 'son', 'ders'],
      'interessant': ['in', 'ter', 'es', 'sant'],
      'wunderbar': ['wun', 'der', 'bar'],
      'fantasie': ['fan', 'ta', 'sie'],
      'außerdem': ['au', 'ßer', 'dem'],
      'vielleicht': ['viel', 'leicht'],
      'zwischen': ['zwi', 'schen'],
      'bedeutung': ['be', 'deu', 'tung'],
      'sprache': ['spra', 'che'],
      'schreiben': ['schrei', 'ben'],
      'lesen': ['le', 'sen'],
      'verstehen': ['ver', 'ste', 'hen'],
      'begreifen': ['be', 'grei', 'fen'],
      'eigentlich': ['ei', 'gent', 'lich'],
      'grundsätzlich': ['grund', 'sätz', 'lich']
    };
    
    // Erweiterte Liste deutscher Präfixe
    const PREFIXES = [
      'ab', 'an', 'auf', 'aus', 'be', 'bei', 'dar', 'ein', 'ent', 'er', 'ge', 'her', 
      'hin', 'mit', 'nach', 'über', 'um', 'un', 'unter', 'ver', 'vor', 'weg', 'zer', 'zu',
      'durch', 'gegen', 'wider', 'miss', 'anti', 'auto', 'bio', 'mikro', 'makro', 'mono',
      'multi', 'poly', 'pseudo', 'quasi', 'semi', 'super', 'trans', 'ultra'
    ];
    
    // Erweiterte Liste deutscher Suffixe
    const SUFFIXES = [
      'ung', 'heit', 'keit', 'schaft', 'lich', 'bar', 'sam', 'los', 'haft', 'ig', 'isch',
      'istisch', 'ativ', 'iv', 'ion', 'tät', 'ität', 'ieren', 'isieren', 'isierung', 'ismus',
      'ler', 'ner', 'er', 'or', 'när', 'ör', 'in', 'tum', 'anz', 'enz'
    ];
    
    // Vokale und Konsonanten
    const VOWELS = 'aeiouäöüAEIOUÄÖÜ';
    const CONSONANTS = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
    
    // Prüfung, ob ein Zeichen ein Vokal ist
    function isVowel(char) {
      return VOWELS.indexOf(char) !== -1;
    }
    
    // Prüfung, ob ein Zeichen ein Konsonant ist
    function isConsonant(char) {
      return CONSONANTS.indexOf(char) !== -1;
    }
    
    // Untrennbare Konsonantengruppen am Wortanfang
    const CONSONANT_CLUSTERS = [
      'bl', 'br', 'ch', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'kl', 'kn', 'kr',
      'ph', 'pl', 'pn', 'pr', 'ps', 'qu', 'rh', 'sch', 'schl', 'schr', 'schw', 'schm',
      'schn', 'sk', 'sl', 'sm', 'sp', 'sph', 'spl', 'spr', 'st', 'str', 'sw', 'th',
      'tr', 'ts', 'tw', 'vl', 'vr', 'zw'
    ];
    
    // Untrennbare Konsonantengruppen innerhalb eines Wortes
    const INTERNAL_CLUSTERS = [
      'ck', 'ch', 'sch', 'ph', 'th', 'rh', 'sh'
    ];
    
    // Dipthonge und untrennbare Vokalgruppen
    const VOWEL_CLUSTERS = [
      'ai', 'au', 'äu', 'ei', 'eu', 'ie', 'oi', 'ui', 'ea'
    ];
    
    // Verbesserte deutsche Silbentrennung
    function hyphenateWord(word) {
      // Für sehr kurze Wörter keine Trennung
      if (word.length <= 3) return [word];
      
      // Wörterbuch-Lookup für häufige oder schwierige Wörter
      const lowerWord = word.toLowerCase();
      if (DICTIONARY[lowerWord]) {
        // Groß-/Kleinschreibung des ersten Buchstabens beibehalten
        const syllables = DICTIONARY[lowerWord].slice();
        if (word[0] !== lowerWord[0]) {
          syllables[0] = syllables[0].charAt(0).toUpperCase() + syllables[0].slice(1);
        }
        return syllables;
      }
      
      const syllables = [];
      let start = 0;
      
      // Prüfen auf Präfixe
      let foundPrefix = false;
      for (const prefix of PREFIXES) {
        if (word.toLowerCase().startsWith(prefix) && word.length > prefix.length + 2) {
          syllables.push(word.substring(0, prefix.length));
          start = prefix.length;
          foundPrefix = true;
          break;
        }
      }
      
      // Prüfen auf Suffixe
      let end = word.length;
      let foundSuffix = false;
      for (const suffix of SUFFIXES) {
        if (word.toLowerCase().endsWith(suffix) && word.length > suffix.length + 2) {
          end = word.length - suffix.length;
          foundSuffix = true;
          break;
        }
      }
      
      // Hauptteil des Wortes in Silben zerlegen
      const mainPart = word.substring(start, end);
      
      if (mainPart.length > 3) {
        let current = start;
        
        for (let i = start + 1; i < end - 1; i++) {
          // Überprüfen, ob wir an einer untrennbaren Gruppe sind
          let isCluster = false;
          
          // Überprüfen auf Vokalcluster (Dipthonge)
          for (const vcluster of VOWEL_CLUSTERS) {
            if (i > 0 && mainPart.substring(i-1, i+1).toLowerCase() === vcluster) {
              isCluster = true;
              break;
            }
          }
          
          // Überprüfen auf untrennbare Konsonantencluster
          for (const ccluster of INTERNAL_CLUSTERS) {
            const startPos = Math.max(0, i - ccluster.length + 1);
            if (mainPart.substring(startPos, i + 1).toLowerCase() === ccluster) {
              isCluster = true;
              break;
            }
          }
          
          if (isCluster) continue;
          
          // Regel 1: Trennung zwischen Vokal und Konsonant, wenn danach ein Vokal folgt
          if (isVowel(mainPart[i-1]) && isConsonant(mainPart[i]) && 
              (i+1 < mainPart.length && isVowel(mainPart[i+1]))) {
            syllables.push(word.substring(current, start + i));
            current = start + i;
            continue;
          }
          
          // Regel 2: Trennung zwischen zwei Konsonanten
          if (isConsonant(mainPart[i-1]) && isConsonant(mainPart[i])) {
            // Ausnahmen: Untrennbare Konsonantencluster überprüfen
            let skipCluster = false;
            for (const ccluster of CONSONANT_CLUSTERS) {
              const startPos = Math.max(0, i - ccluster.length + 1);
              if (mainPart.substring(startPos, i + 1).toLowerCase() === ccluster) {
                skipCluster = true;
                break;
              }
            }
            
            if (!skipCluster) {
              syllables.push(word.substring(current, start + i));
              current = start + i;
            }
          }
        }
        
        // Rest des Hauptteils hinzufügen
        if (current < start + mainPart.length) {
          syllables.push(word.substring(current, end));
        }
      } else {
        // Wenn der Hauptteil zu kurz ist, füge ihn als Ganzes hinzu
        syllables.push(mainPart);
      }
      
      // Suffix hinzufügen, wenn gefunden
      if (foundSuffix) {
        syllables.push(word.substring(end));
      }
      
      // Fallback: Wenn keine oder nur wenige Silben gefunden wurden
      if (syllables.length <= 1 && word.length > 6) {
        // Teile das Wort gleichmäßig
        syllables.length = 0;
        const chunkSize = word.length > 10 ? 4 : 3;
        
        for (let i = 0; i < word.length; i += chunkSize) {
          // Vermeide zu kurze Silben am Ende
          if (i + chunkSize >= word.length - 2 && i + chunkSize < word.length) {
            syllables.push(word.substring(i));
            break;
          } else {
            syllables.push(word.substring(i, Math.min(i + chunkSize, word.length)));
          }
        }
      }
      
      return syllables;
    }
    
    // Text in Worte zerlegen und jedes Wort hyphenisieren
    function hyphenateText(text) {
      if (!text) return [];
      const words = text.split(/(\s+)/);
      const result = [];
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!word || word.trim().length === 0) {
          result.push(word);
        } else {
          const syllables = hyphenateWord(word);
          result.push(...syllables);
        }
      }
      
      return result;
    }
    
    // Implementierung für Bionic Reading
    function createBionicText(text) {
      if (!text) return '';
      
      const words = text.split(/(\s+)/);
      return words.map(word => {
        if (word.trim().length === 0) return word;
        
        // Bestimme, wie viele Zeichen hervorgehoben werden sollen
        let fixationLength;
        if (word.length <= 3) {
          fixationLength = 1; // Für kurze Wörter nur der erste Buchstabe
        } else if (word.length <= 6) {
          fixationLength = Math.ceil(word.length * 0.5); // Ca. die Hälfte für mittlere Wörter
        } else {
          fixationLength = Math.ceil(word.length * 0.4); // Etwas weniger als die Hälfte für lange Wörter
        }
        
        const prefix = word.substring(0, fixationLength);
        const suffix = word.substring(fixationLength);
        
        return `<strong>${prefix}</strong>${suffix}`;
      }).join('');
    }
    
    // Dynamische Erweiterung des Wörterbuchs
    function addWordToDictionary(word, syllables) {
      if (word && syllables && Array.isArray(syllables) && syllables.length > 0) {
        DICTIONARY[word.toLowerCase()] = syllables;
        return true;
      }
      return false;
    }
    
    // Exportiere die Funktionen im globalen Bereich
    window.GermanHyphenator = {
      hyphenate: hyphenateWord,
      hyphenateText: hyphenateText,
      createBionicText: createBionicText,
      addToDictionary: addWordToDictionary
    };
  })();