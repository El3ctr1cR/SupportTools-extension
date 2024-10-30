document.addEventListener('DOMContentLoaded', () => {
    const passwordLengthSlider = document.getElementById('passwordLength');
    const passwordLengthValue = document.getElementById('passwordLengthValue');
    const includeLowercaseCheckbox = document.getElementById('includeLowercase');
    const includeUppercaseCheckbox = document.getElementById('includeUppercase');
    const includeNumbersCheckbox = document.getElementById('includeNumbers');
    const includeSymbolsCheckbox = document.getElementById('includeSymbols');
    const usePassphraseCheckbox = document.getElementById('usePassphrase');
    const generatePasswordButton = document.getElementById('generatePassword');
    const generatedPasswordDisplay = document.getElementById('generatedPassword');
    const copyPasswordButton = document.getElementById('copyPassword');
    const refreshPasswordButton = document.getElementById('refreshPassword');
    const passwordHistoryList = document.getElementById('passwordHistory');
  
    passwordLengthValue.textContent = passwordLengthSlider.value;
  
    passwordLengthSlider.addEventListener('input', () => {
      passwordLengthValue.textContent = passwordLengthSlider.value;
      saveSettings();
    });
  
    includeLowercaseCheckbox.addEventListener('change', saveSettings);
    includeUppercaseCheckbox.addEventListener('change', saveSettings);
    includeNumbersCheckbox.addEventListener('change', saveSettings);
    includeSymbolsCheckbox.addEventListener('change', saveSettings);
    usePassphraseCheckbox.addEventListener('change', saveSettings);
  
    refreshPasswordButton.addEventListener('click', () => {
      generatePassword();
    });
  
    copyPasswordButton.addEventListener('click', () => {
      const password = generatedPasswordDisplay.innerText;
      if (password) {
        navigator.clipboard.writeText(password)
          .catch(err => {
            console.error('Could not copy password: ', err);
          });
      }
    });
  
    loadPasswordHistory();
    loadSettings();
  
    function saveSettings() {
      const settings = {
        passwordLength: passwordLengthSlider.value,
        includeLowercase: includeLowercaseCheckbox.checked,
        includeUppercase: includeUppercaseCheckbox.checked,
        includeNumbers: includeNumbersCheckbox.checked,
        includeSymbols: includeSymbolsCheckbox.checked,
        usePassphrase: usePassphraseCheckbox.checked
      };
      chrome.storage.sync.set({ passwordGeneratorSettings: settings }, () => {
        console.log('Password generator settings saved.');
      });
    }
  
    function loadSettings() {
      chrome.storage.sync.get(['passwordGeneratorSettings'], (result) => {
        const settings = result.passwordGeneratorSettings || {
          passwordLength: 12,
          includeLowercase: true,
          includeUppercase: true,
          includeNumbers: true,
          includeSymbols: true,
          usePassphrase: false
        };
  
        passwordLengthSlider.value = settings.passwordLength;
        passwordLengthValue.textContent = settings.passwordLength;
        includeLowercaseCheckbox.checked = settings.includeLowercase;
        includeUppercaseCheckbox.checked = settings.includeUppercase;
        includeNumbersCheckbox.checked = settings.includeNumbers;
        includeSymbolsCheckbox.checked = settings.includeSymbols;
        usePassphraseCheckbox.checked = settings.usePassphrase;
      });
    }
  
    function generatePassword() {
      if (usePassphraseCheckbox.checked) {
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
        if (history.length > 20) {
          history = history.slice(0, 20);
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
      history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.password} (Generated on: ${item.timestamp})`;
        passwordHistoryList.appendChild(li);
      });
    }
  });
  