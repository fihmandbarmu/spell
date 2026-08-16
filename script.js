// Starter pool of words (fetches full data dynamically from Dictionary API with 63,000+ words)
const kidWords = ["apple", "banana", "elephant", "guitar", "sunflower", "dolphin", "rainbow", "dinosaur", "rocket", "butterfly", "tiger", "adventure"];

let currentListenWord = "";
let currentSpeakWord = "";
let recognition = null;

// Initialize Speech Recognition for "Speak to Me"
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
    checkSpeech(spokenWord);
  };

  recognition.onerror = function() {
    showFeedback("Didn't catch that. Try again!", "incorrect");
    stopMicAnimation();
  };

  recognition.onend = function() {
    stopMicAnimation();
  };
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));

  if (tab === 'listen') {
    document.getElementById('listen-mode').classList.add('active');
    event.target.classList.add('active');
    if (!currentListenWord) loadRandomWord('listen');
  } else {
    document.getElementById('speak-mode').classList.add('active');
    event.target.classList.add('active');
    if (!currentSpeakWord) loadRandomWord('speak');
  }
}

async function fetchWordDetails(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error('Word not found');
    const data = await response.json();
    
    const phonetic = data[0].phonetic || (data[0].phonetics.find(p => p.text)?.text) || "N/A";
    const definition = data[0].meanings[0]?.definitions[0]?.definition || "A great English word!";

    return { word: data[0].word, phonetic, definition };
  } catch (err) {
    return { word, phonetic: "Pronunciation ready", definition: "Search any valid English word!" };
  }
}

async function loadRandomWord(mode) {
  const randomWord = kidWords[Math.floor(Math.random() * kidWords.length)];
  const details = await fetchWordDetails(randomWord);

  if (mode === 'listen') {
    currentListenWord = details.word;
    document.getElementById('listen-word').innerText = details.word;
    document.getElementById('listen-phonetic').innerText = details.phonetic;
    document.getElementById('listen-def').innerText = details.definition;
  } else {
    currentSpeakWord = details.word;
    document.getElementById('speak-word').innerText = details.word;
    document.getElementById('speak-phonetic').innerText = `How to say: ${details.phonetic}`;
    document.getElementById('feedback').innerText = "Press the mic and say the word!";
    document.getElementById('feedback').className = "feedback";
  }
}

async function loadCustomWord() {
  const input = document.getElementById('custom-word-input').value.trim().toLowerCase();
  if (!input) return;

  const details = await fetchWordDetails(input);
  currentSpeakWord = details.word;
  document.getElementById('speak-word').innerText = details.word;
  document.getElementById('speak-phonetic').innerText = `How to say: ${details.phonetic}`;
  document.getElementById('feedback').innerText = "Press the mic and say the word!";
  document.getElementById('feedback').className = "feedback";
  document.getElementById('custom-word-input').value = "";
}

function speakCurrentWord(mode = 'listen') {
  const text = mode === 'listen' ? currentListenWord : currentSpeakWord;
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.8; // Slower speaking rate for kids
  window.speechSynthesis.speak(utterance);
}

function startListening() {
  if (!recognition) {
    alert("Speech recognition works best in Google Chrome!");
    return;
  }
  document.getElementById('mic-btn').classList.add('listening');
  document.getElementById('feedback').innerText = "Listening...";
  document.getElementById('feedback').className = "feedback";
  recognition.start();
}

function stopMicAnimation() {
  document.getElementById('mic-btn').classList.remove('listening');
}

function checkSpeech(spoken) {
  const target = currentSpeakWord.toLowerCase().trim();
  if (spoken === target || spoken.includes(target)) {
    showFeedback(`🎉 Awesome! You said: "${spoken}"`, "correct");
  } else {
    showFeedback(`Try again! You said "${spoken}", expected "${target}".`, "incorrect");
  }
}

function showFeedback(text, statusClass) {
  const fb = document.getElementById('feedback');
  fb.innerText = text;
  fb.className = `feedback ${statusClass}`;
}

// Initial load
loadRandomWord('listen');
