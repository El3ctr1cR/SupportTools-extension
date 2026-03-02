document.addEventListener('DOMContentLoaded', () => {
  const passwordLengthSlider = document.getElementById('passwordLength');
  const passwordLengthContainer = document.getElementById('passwordLengthContainer');
  const includeLowercaseCheckbox = document.getElementById('includeLowercase');
  const includeUppercaseCheckbox = document.getElementById('includeUppercase');
  const includeNumbersCheckbox = document.getElementById('includeNumbers');
  const includeSymbolsCheckbox = document.getElementById('includeSymbols');
  const typePasswordRadio = document.getElementById('typePassword');
  const typePassphraseRadio = document.getElementById('typePassphrase');
  const generatedPasswordDisplay = document.getElementById('generatedPassword');
  const copyPasswordButton = document.getElementById('copyPassword');
  const refreshPasswordButton = document.getElementById('refreshPassword');
  const passwordHistoryList = document.getElementById('passwordHistory');
  const wordCountInput = document.getElementById('wordCount');
  const wordSeparatorInput = document.getElementById('wordSeparator');
  const passphraseCapitalizeCheckbox = document.getElementById('passphraseCapitalize');
  const passphraseIncludeNumberCheckbox = document.getElementById('passphraseIncludeNumber');
  const passphraseOptions = document.getElementById('passphraseOptions');
  const openHistoryBtn = document.getElementById('openHistoryBtn');
  const closeHistoryBtn = document.getElementById('closeHistoryBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const historyPanel = document.getElementById('historyPanel');

  passwordLengthSlider.addEventListener('input', () => {
    let v = parseInt(passwordLengthSlider.value);
    if (isNaN(v)) return;
    if (v < 3) v = 3;
    if (v > 64) v = 64;
    passwordLengthSlider.value = v;
    saveSettings();
    generatePassword();
  });

  [includeLowercaseCheckbox, includeUppercaseCheckbox, includeNumbersCheckbox, includeSymbolsCheckbox].forEach(cb => {
    cb.addEventListener('change', () => { saveSettings(); generatePassword(); });
  });

  wordCountInput.addEventListener('input', () => {
    let v = parseInt(wordCountInput.value);
    if (isNaN(v)) return;
    if (v < 3) v = 3;
    if (v > 20) v = 20;
    wordCountInput.value = v;
    saveSettings();
    generatePassword();
  });

  wordSeparatorInput.addEventListener('input', () => {
    saveSettings();
    generatePassword();
  });

  [passphraseCapitalizeCheckbox, passphraseIncludeNumberCheckbox].forEach(cb => {
    cb.addEventListener('change', () => { saveSettings(); generatePassword(); });
  });

  typePasswordRadio.addEventListener('change', () => {
    updatePasswordTypeVisibility();
    saveSettings();
    generatePassword();
  });

  typePassphraseRadio.addEventListener('change', () => {
    updatePasswordTypeVisibility();
    saveSettings();
    generatePassword();
  });

  refreshPasswordButton.addEventListener('click', () => { generatePassword(); });

  copyPasswordButton.addEventListener('click', () => {
    const passwordText = Array.from(generatedPasswordDisplay.childNodes)
      .map(node => node.textContent)
      .join('');
    if (passwordText) {
      navigator.clipboard.writeText(passwordText)
        .catch(err => console.error('Could not copy password: ', err));
    }
  });

  openHistoryBtn.addEventListener('click', () => {
    historyPanel.classList.add('open');
    loadPasswordHistory();
  });

  closeHistoryBtn.addEventListener('click', () => {
    historyPanel.classList.remove('open');
  });

  clearHistoryBtn.addEventListener('click', () => {
    chrome.storage.sync.set({ passwordHistory: [] }, () => {
      updatePasswordHistoryUI([]);
    });
  });

  loadSettings(() => { generatePassword(); });

  function saveSettings() {
    const settings = {
      passwordLength: passwordLengthSlider.value,
      includeLowercase: includeLowercaseCheckbox.checked,
      includeUppercase: includeUppercaseCheckbox.checked,
      includeNumbers: includeNumbersCheckbox.checked,
      includeSymbols: includeSymbolsCheckbox.checked,
      passwordType: typePassphraseRadio.checked ? 'passphrase' : 'password',
      passphraseWordCount: parseInt(wordCountInput.value) || 3,
      passphraseSeperator: wordSeparatorInput.value,
      passphraseCapitalize: passphraseCapitalizeCheckbox.checked,
      passphraseIncludeNumber: passphraseIncludeNumberCheckbox.checked
    };
    chrome.storage.sync.set({ passwordGeneratorSettings: settings }, () => {
      console.log('Password generator settings saved.');
    });
  }

  function loadSettings(callback) {
    chrome.storage.sync.get(['passwordGeneratorSettings'], (result) => {
      const settings = result.passwordGeneratorSettings || {
        passwordLength: 12,
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
        passwordType: 'password',
        passphraseWordCount: 3,
        passphraseSeperator: '-',
        passphraseCapitalize: false,
        passphraseIncludeNumber: false
      };

      passwordLengthSlider.value = settings.passwordLength;
      includeLowercaseCheckbox.checked = settings.includeLowercase;
      includeUppercaseCheckbox.checked = settings.includeUppercase;
      includeNumbersCheckbox.checked = settings.includeNumbers;
      includeSymbolsCheckbox.checked = settings.includeSymbols;

      wordCountInput.value = settings.passphraseWordCount || 3;
      wordSeparatorInput.value = (settings.passphraseSeperator !== undefined) ? settings.passphraseSeperator : '-';
      passphraseCapitalizeCheckbox.checked = !!settings.passphraseCapitalize;
      passphraseIncludeNumberCheckbox.checked = !!settings.passphraseIncludeNumber;

      if (settings.passwordType === 'passphrase') {
        typePassphraseRadio.checked = true;
      } else {
        typePasswordRadio.checked = true;
      }

      updatePasswordTypeVisibility();
      if (callback) callback();
    });
  }

  function updatePasswordTypeVisibility() {
    const isPassphrase = typePassphraseRadio.checked;
    const passwordRows = ['lowercaseRow','uppercaseRow','numbersRow','symbolsRow']
      .map(id => document.getElementById(id));

    if (isPassphrase) {
      passwordRows.forEach(r => { if (r) r.style.display = 'none'; });
      passwordLengthContainer.style.display = 'none';
      passphraseOptions.style.display = 'block';
    } else {
      passwordRows.forEach(r => { if (r) r.style.display = 'flex'; });
      passwordLengthContainer.style.display = 'block';
      passphraseOptions.style.display = 'none';
    }
  }

  // ── Generate
  function generatePassword() {
    if (typePassphraseRadio.checked) {
      generatePassphrase();
    } else {
      generateRandomPassword();
    }
  }

  function generateRandomPassword() {
    const length = parseInt(passwordLengthSlider.value);
    const includeLowercase = includeLowercaseCheckbox.checked;
    const includeUppercase = includeUppercaseCheckbox.checked;
    const includeNumbers = includeNumbersCheckbox.checked;
    const includeSymbols = includeSymbolsCheckbox.checked;

    const sets = {
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*'
    };

    let charset = '';
    if (includeLowercase) charset += sets.lowercase;
    if (includeUppercase) charset += sets.uppercase;
    if (includeNumbers) charset += sets.numbers;
    if (includeSymbols) charset += sets.symbols;

    if (charset === '') {
      alert('Please select at least one character type');
      return;
    }

    const guaranteed = [];
    if (includeLowercase) guaranteed.push(sets.lowercase[Math.floor(Math.random() * sets.lowercase.length)]);
    if (includeUppercase) guaranteed.push(sets.uppercase[Math.floor(Math.random() * sets.uppercase.length)]);
    if (includeNumbers) guaranteed.push(sets.numbers[Math.floor(Math.random() * sets.numbers.length)]);
    if (includeSymbols) guaranteed.push(sets.symbols[Math.floor(Math.random() * sets.symbols.length)]);

    const passwordChars = [...guaranteed];
    for (let i = guaranteed.length; i < length; i++) {
      passwordChars.push(charset[Math.floor(Math.random() * charset.length)]);
    }

    for (let i = passwordChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    const password = passwordChars.join('');
    displayPassword(password);
    addPasswordToHistory(password);
  }

  function generatePassphrase() {
    getLanguage(language => {
      const count = Math.max(3, Math.min(20, parseInt(wordCountInput.value) || 3));
      const separator = wordSeparatorInput.value;
      const capitalize = passphraseCapitalizeCheckbox.checked;
      const includeNumber = passphraseIncludeNumberCheckbox.checked;

      fetchRandomWords(language, count)
        .then(words => {
          let processed = words.map(w =>
            capitalize ? w : w.charAt(0).toLowerCase() + w.slice(1)
          );

          if (includeNumber) {
            // Append a random 1-99 number to one random word
            const idx = Math.floor(Math.random() * processed.length);
            processed[idx] = processed[idx] + (Math.floor(Math.random() * 99) + 1);
          }

          const passphrase = processed.join(separator);
          displayPassword(passphrase);
          addPasswordToHistory(passphrase);
        })
        .catch(error => {
          console.error('Error fetching words: ', error);
          alert('Failed to generate passphrase');
        });
    });
  }

  function displayPassword(password) {
    generatedPasswordDisplay.innerHTML = '';
    for (let char of password) {
      let span = document.createElement('span');
      if (/[a-zA-Z]/.test(char)) {
        span.classList.add('char-letter');
      } else if (/[0-9]/.test(char)) {
        span.classList.add('char-number');
      } else {
        span.classList.add('char-special');
      }
      span.textContent = char;
      generatedPasswordDisplay.appendChild(span);
    }
  }

  function getLanguage(callback) {
    const languageMap = { 'nl': 'Dutch', 'en': 'English', 'de': 'German' };
    chrome.storage.sync.get(['selectedLanguage'], (result) => {
      const selectedLanguage = result.selectedLanguage || 'nl';
      callback(languageMap[selectedLanguage] || languageMap['nl']);
    });
  }

  function fetchRandomWords(language, count) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('../libs/words.json');
        if (!response.ok) { reject(new Error('Failed to fetch words.json')); return; }
        const wordLists = await response.json();
        const words = wordLists.words[language];
        if (!words) { reject(new Error(`Language '${language}' not supported`)); return; }
        if (words.length < count) { reject(new Error('Not enough words to choose from')); return; }

        const wordPool = [...words];
        const selectedWords = [];
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * wordPool.length);
          selectedWords.push(wordPool.splice(randomIndex, 1)[0]);
        }
        resolve(selectedWords);
      } catch (error) {
        reject(new Error('Error fetching or processing words: ' + error.message));
      }
    });
  }

  function addPasswordToHistory(password) {
    chrome.storage.sync.get(['passwordHistory'], (result) => {
      let history = result.passwordHistory || [];
      const timestamp = new Date().toLocaleString();
      history.unshift({ password, timestamp });
      if (history.length > 30) history = history.slice(0, 30);
      chrome.storage.sync.set({ passwordHistory: history });
    });
  }

  function loadPasswordHistory() {
    chrome.storage.sync.get(['passwordHistory'], (result) => {
      updatePasswordHistoryUI(result.passwordHistory || []);
    });
  }

  function updatePasswordHistoryUI(history) {
    passwordHistoryList.innerHTML = '';
    history.forEach((item) => {
      const li = document.createElement('li');

      const passwordContainer = document.createElement('div');
      passwordContainer.classList.add('history-password-container');

      const passwordDiv = document.createElement('div');
      passwordDiv.classList.add('history-password');
      for (let char of item.password) {
        let span = document.createElement('span');
        if (/[a-zA-Z]/.test(char)) span.classList.add('char-letter');
        else if (/[0-9]/.test(char)) span.classList.add('char-number');
        else span.classList.add('char-special');
        span.textContent = char;
        passwordDiv.appendChild(span);
      }

      const copyIcon = document.createElement('img');
      copyIcon.src = '../icons/copy.png';
      copyIcon.classList.add('history-copy-icon');
      copyIcon.title = 'Copy Password';
      copyIcon.style.filter = 'brightness(0) invert(1)';
      copyIcon.addEventListener('click', () => {
        navigator.clipboard.writeText(item.password)
          .catch(err => console.error('Could not copy password: ', err));
      });

      passwordContainer.appendChild(passwordDiv);
      passwordContainer.appendChild(copyIcon);

      const timestampDiv = document.createElement('div');
      timestampDiv.classList.add('timestamp');
      timestampDiv.textContent = item.timestamp;

      li.appendChild(passwordContainer);
      li.appendChild(timestampDiv);
      passwordHistoryList.appendChild(li);
    });
  }
});