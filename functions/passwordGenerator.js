document.addEventListener('DOMContentLoaded', () => {
  const passwordLengthSlider = document.getElementById('passwordLength');
  const passwordLengthValue = document.getElementById('passwordLengthValue');
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

  passwordLengthValue.textContent = passwordLengthSlider.value;

  passwordLengthSlider.addEventListener('input', () => {
    passwordLengthValue.textContent = passwordLengthSlider.value;
    saveSettings();
  });

  includeLowercaseCheckbox.addEventListener('change', () => {
    saveSettings();
    generatePassword();
  });
  includeUppercaseCheckbox.addEventListener('change', () => {
    saveSettings();
    generatePassword();
  });
  includeNumbersCheckbox.addEventListener('change', () => {
    saveSettings();
    generatePassword();
  });
  includeSymbolsCheckbox.addEventListener('change', () => {
    saveSettings();
    generatePassword();
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

  refreshPasswordButton.addEventListener('click', () => {
    generatePassword();
  });

  copyPasswordButton.addEventListener('click', () => {
    const passwordText = Array.from(generatedPasswordDisplay.childNodes)
      .map(node => node.textContent)
      .join('');
    if (passwordText) {
      navigator.clipboard.writeText(passwordText)
        .catch(err => {
          console.error('Could not copy password: ', err);
        });
    }
  });

  loadPasswordHistory();
  loadSettings(() => {
    generatePassword();
  });

  function saveSettings() {
    const settings = {
      passwordLength: passwordLengthSlider.value,
      includeLowercase: includeLowercaseCheckbox.checked,
      includeUppercase: includeUppercaseCheckbox.checked,
      includeNumbers: includeNumbersCheckbox.checked,
      includeSymbols: includeSymbolsCheckbox.checked,
      passwordType: typePassphraseRadio.checked ? 'passphrase' : 'password'
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
        passwordType: 'password'
      };

      passwordLengthSlider.value = settings.passwordLength;
      passwordLengthValue.textContent = settings.passwordLength;
      includeLowercaseCheckbox.checked = settings.includeLowercase;
      includeUppercaseCheckbox.checked = settings.includeUppercase;
      includeNumbersCheckbox.checked = settings.includeNumbers;
      includeSymbolsCheckbox.checked = settings.includeSymbols;

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
    if (isPassphrase) {
      includeLowercaseCheckbox.parentElement.style.display = 'none';
      includeUppercaseCheckbox.parentElement.style.display = 'none';
      includeNumbersCheckbox.parentElement.style.display = 'none';
      includeSymbolsCheckbox.parentElement.style.display = 'none';
    } else {
      includeLowercaseCheckbox.parentElement.style.display = 'block';
      includeUppercaseCheckbox.parentElement.style.display = 'block';
      includeNumbersCheckbox.parentElement.style.display = 'block';
      includeSymbolsCheckbox.parentElement.style.display = 'block';
    }
  }

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

    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*';
    if (charset === '') {
      alert('Please select at least one character type');
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    displayPassword(password);
    addPasswordToHistory(password);
  }

  function generatePassphrase() {
    getLanguage(language => {
      fetchRandomWords(language, 3)
        .then(words => {
          const passphrase = words.join('-');
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
    const languageMap = {
      'nl': 'Dutch',
      'en': 'English'
    };

    chrome.storage.sync.get(['selectedLanguage'], (result) => {
      const selectedLanguage = result.selectedLanguage || 'nl';
      const language = languageMap[selectedLanguage] || languageMap['nl'];
      callback(language);
    });
  }

  function fetchRandomWords(language, count) {
    return new Promise((resolve, reject) => {
      const wordLists = {
        'English': [
          'Apple', 'Banana', 'Cherry', 'Dog', 'Elephant', 'Flower', 'Guitar', 'House', 'Island', 'Jungle',
          'Kangaroo', 'Lion', 'Mountain', 'Notebook', 'Ocean', 'Piano', 'Queen', 'Rainbow', 'Sunshine', 'Tiger',
          'Umbrella', 'Violin', 'Whale', 'Xylophone', 'Yellow', 'Zebra', 'Falcon', 'Galaxy', 'Harmony', 'Iceberg',
          'Journey', 'Knowledge', 'Liberty', 'Miracle', 'Nature', 'Oxygen', 'Phoenix', 'Quantum', 'Rocket', 'Symphony'
        ],
        'Dutch': [
          'Appel', 'Banaan', 'Kers', 'Hond', 'Olifant', 'Bloem', 'Gitaar', 'Huis', 'Eiland', 'Jungle',
          'Kangoeroe', 'Leeuw', 'Berg', 'Notitieboek', 'Oceaan', 'Piano', 'Koningin', 'Regenboog', 'Zonneschijn', 'Tijger',
          'Paraplu', 'Viool', 'Walvis', 'Xylofoon', 'Geel', 'Zebra', 'Valk', 'Galaxie', 'Harmonie', 'IJsberg',
          'Reis', 'Kennis', 'Vrijheid', 'Wonder', 'Natuur', 'Zuurstof', 'Feniks', 'Kwantum', 'Raket', 'Symfonie'
        ]
      };

      let words = wordLists[language];
      if (!words) {
        reject(new Error('Language not supported'));
        return;
      }

      if (words.length < count) {
        reject(new Error('Not enough words to choose from'));
        return;
      }

      words = [...words];

      const selectedWords = [];
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words.splice(randomIndex, 1)[0];
        selectedWords.push(word);
      }

      resolve(selectedWords);
    });
  }

  function addPasswordToHistory(password) {
    chrome.storage.sync.get(['passwordHistory'], (result) => {
      let history = result.passwordHistory || [];
      const timestamp = new Date().toLocaleString();
      history.unshift({ password, timestamp });
      if (history.length > 30) {
        history = history.slice(0, 30);
      }
      chrome.storage.sync.set({ passwordHistory: history }, () => {
        updatePasswordHistoryUI(history);
      });
    });
  }

  function loadPasswordHistory() {
    chrome.storage.sync.get(['passwordHistory'], (result) => {
      const history = result.passwordHistory || [];
      updatePasswordHistoryUI(history);
    });
  }

  function updatePasswordHistoryUI(history) {
    passwordHistoryList.innerHTML = '';
    history.forEach((item, index) => {
      const li = document.createElement('li');

      const passwordContainer = document.createElement('div');
      passwordContainer.classList.add('history-password-container');

      const passwordDiv = document.createElement('div');
      passwordDiv.classList.add('history-password');
      for (let char of item.password) {
        let span = document.createElement('span');
        if (/[a-zA-Z]/.test(char)) {
          span.classList.add('char-letter');
        } else if (/[0-9]/.test(char)) {
          span.classList.add('char-number');
        } else {
          span.classList.add('char-special');
        }
        span.textContent = char;
        passwordDiv.appendChild(span);
      }

      const copyIcon = document.createElement('img');
      copyIcon.src = '../icons/copy.png';
      copyIcon.classList.add('history-copy-icon');
      copyIcon.title = 'Copy Password';
      copyIcon.addEventListener('click', () => {
        navigator.clipboard.writeText(item.password)
          .catch(err => {
            console.error('Could not copy password: ', err);
          });
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
