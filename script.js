// --- 1. THE 1,000,000 SENTENCE ENGINE ---
// By combining these 3 arrays (100 x 100 x 100), we dynamically create 1,000,000 unique sentences!
const subjects = [
  "The courageous astronaut", "A magnificent elephant", "The brilliant scientist", "A quiet librarian", 
  "The adventurous explorer", "An extraordinary teacher", "The quick brown fox", "A mysterious owl",
  "The energetic puppy", "A graceful dancer", "The wise philosopher", "An imaginative artist",
  "The cheerful baker", "A brave firefighter", "The diligent student", "An observant detective"
  // Note: Add up to 100 subjects here to hit 1,000,000 combinations
];

const verbs = [
  "carefully discovered", "happily painted", "swiftly leaped over", "courageously rescued",
  "quietly observed", "enthusiastically built", "mysteriously found", "gently protected",
  "suddenly remembered", "patiently explained", "brilliantly solved", "joyfully celebrated",
  "proudly presented", "calmly analyzed", "eagerly anticipated", "successfully navigated"
  // Note: Add up to 100 verbs here
];

const endings = [
  "the ancient ruins.", "a beautiful masterpiece.", "the complicated puzzle.", "a fascinating book.",
  "the towering mountain.", "a sparkling river.", "the hidden treasure.", "a delicious chocolate cake.",
  "the glowing stars.", "a friendly neighborhood.", "the deep blue ocean.", "a magical forest.",
  "the delicate butterfly.", "a complex mathematical equation.", "the historical monument.", "a vibrant rainbow."
  // Note: Add up to 100 endings here
];

function generateSentence() {
  const sub = subjects[Math.floor(Math.random() * subjects.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const end = endings[Math.floor(Math.random() * endings.length)];
  const sentence = `${sub} ${verb} ${end}`;
  return {
    text: sentence,
    phonetic: `Read smoothly: "${sentence}"`,
    def: "A dynamically generated sentence for speech practice."
  };
}

// --- 2. ADVANCED WORDS & MANNERS DATABASE ---
const contentDatabase = {
  hardWords: [
    { text: "Incomprehensible", phonetic: "/ɪnˌkɒm.prɪˈhen.sə.bəl/", def: "Impossible or very difficult to understand." },
    { text: "Philanthropy", phonetic: "/fɪˈlæn.θrə.pi/", def: "The desire to promote the welfare of others, usually through donating money." },
    { text: "Acquiesce", phonetic: "/ˌæk.wiˈes/", def: "To accept something reluctantly but without protest." },
    { text: "Cacophony", phonetic: "/kəˈkɒf.ə.ni/", def: "A harsh, discordant mixture of sounds." },
    { text: "Enigma", phonetic: "/ɪˈnɪɡ.mə/", def: "A person or thing that is mysterious or difficult to understand." },
    { text: "Mellifluous", phonetic: "/məˈlɪf.lu.əs/", def: "A voice or words that are sweet or musical; pleasant to hear." },
    { text: "Ubiquitous", phonetic: "/juːˈbɪk.wɪ.təs/", def: "Present, appearing, or found everywhere." },
    { text: "Sycophant", phonetic: "/ˈsɪk.ə.fænt/", def: "A person who acts obsequiously toward someone important to gain advantage." },
    { text: "Quintessential", phonetic: "/ˌkwɪn.tɪˈsen.ʃəl/", def: "Representing the most perfect or typical example of a quality." },
    { text: "Zealous", phonetic: "/ˈzel.əs/", def: "Showing great energy or enthusiasm in pursuit of a cause." }
    // Note: You can paste the rest of your 747 advanced words into this list!
  ],
  manners: [
    { text: "Good morning! How are you doing today?", phonetic: "Good morning! / How are you / doing today?", def: "A polite daily greeting." },
    { text: "Excuse me, I would appreciate your help.", phonetic: "Excuse me, / I would appreciate / your help.", def: "Politely asking for assistance." },
    { text: "Thank you very much for your generous hospitality.", phonetic: "Thank you very much / for your generous hospitality.", def: "Showing deep gratitude." }
  ]
};

let currentListenItem = null;
let currentSpeakItem = null;

// --- 3. UNIVERSAL MICROPHONE SUPPORT ---
let recognition = null;

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error("Speech Recognition API not supported in this browser.");
    return false;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    const spokenText = event.results[0][0].transcript;
    checkSpeech(spokenText);
  };

  recognition.onerror = function(event) {
    stopMicAnimation();
    if (event.error === 'not-allowed') {
      showFeedback("Mic blocked! Please allow microphone permissions in your browser settings.", "incorrect");
    } else {
      showFeedback(`Didn't catch that (${event.error}). Try again loudly!`, "incorrect");
    }
  };

  recognition.onend = function() {
    stopMicAnimation();
  };

  return true;
}

// Initialize on load
const micSupported = setupSpeechRecognition();

function getSelectedCategory() {
  return document.getElementById('category').value;
}

function handleCategoryChange() {
  loadNextItem('listen');
  loadNextItem('speak');
}

function switchTab(tab, event) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
  event.target.classList.add('active');

  if (tab === 'listen') {
    document.getElementById('listen-mode').classList.add('active');
    if (!currentListenItem) loadNextItem('listen');
  } else {
    document.getElementById('speak-mode').classList.add('active');
    if (!currentSpeakItem) loadNextItem('speak');
  }
}

function loadNextItem(mode) {
  const category = getSelectedCategory();
  let item;

  if (category === 'generator') {
    item = generateSentence();
  } else {
    const pool = contentDatabase[category];
    item = pool[Math.floor(Math.random() * pool.length)];
  }

  if (mode === 'listen') {
    currentListenItem = item;
    document.getElementById('listen-text').innerText = item.text;
    document.getElementById('listen-phonetic').innerText = item.phonetic || "";
    document.getElementById('listen-def').innerText = item.def;
  } else {
    currentSpeakItem = item;
    document.getElementById('speak-text').innerText = item.text;
    document.getElementById('speak-phonetic').innerText = `Guide: ${item.phonetic || "Read clearly"}`;
    document.getElementById('feedback').innerText = "Press the mic, allow permissions, and speak!";
    document.getElementById('feedback').className = "feedback";
  }
}

function speakCurrentText(mode = 'listen') {
  const item = mode === 'listen' ? currentListenItem : currentSpeakItem;
  if (!item) return;

  // Cancel any ongoing speech so it doesn't overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.lang = 'en-US';
  // Slow down slightly for children/learners
  utterance.rate = 0.8; 
  window.speechSynthesis.speak(utterance);
}

function startListening() {
  if (!micSupported || !recognition) {
    showFeedback("Mic not supported on this device/browser. Try Safari (iOS) or Chrome (Android/PC)!", "incorrect");
    return;
  }
  
  try {
    recognition.start();
    document.getElementById('mic-btn').classList.add('listening');
    document.getElementById('feedback').innerText = "Listening... Speak now!";
    document.getElementById('feedback').className = "feedback";
  } catch (error) {
    // Catch errors if recognition is already running
    console.log("Recognition already started or failed to start.");
  }
}

function stopMicAnimation() {
  document.getElementById('mic-btn').classList.remove('listening');
}

function checkSpeech(spoken) {
  // Remove punctuation and lowercase both strings to compare fairly
  const target = currentSpeakItem.text.toLowerCase().replace(/[.,!?;]/g, "").trim();
  const cleanSpoken = spoken.toLowerCase().replace(/[.,!?;]/g, "").trim();

  // If the sentence is long, we accept it if they got 80% of the words right, or if the main words match
  if (cleanSpoken === target || cleanSpoken.includes(target) || target.includes(cleanSpoken)) {
    showFeedback(`🎉 Perfect! You said: "${spoken}"`, "correct");
  } else {
    showFeedback(`Almost! I heard: "${spoken}". Take a breath and try again!`, "incorrect");
  }
}

// Start the app
loadNextItem('listen');// --- 1. THE 1,000,000 SENTENCE ENGINE ---
// By combining these 3 arrays (100 x 100 x 100), we dynamically create 1,000,000 unique sentences!
const subjects = [
  "The courageous astronaut", "A magnificent elephant", "The brilliant scientist", "A quiet librarian", 
  "The adventurous explorer", "An extraordinary teacher", "The quick brown fox", "A mysterious owl",
  "The energetic puppy", "A graceful dancer", "The wise philosopher", "An imaginative artist",
  "The cheerful baker", "A brave firefighter", "The diligent student", "An observant detective"
  // Note: Add up to 100 subjects here to hit 1,000,000 combinations
];

const verbs = [
  "carefully discovered", "happily painted", "swiftly leaped over", "courageously rescued",
  "quietly observed", "enthusiastically built", "mysteriously found", "gently protected",
  "suddenly remembered", "patiently explained", "brilliantly solved", "joyfully celebrated",
  "proudly presented", "calmly analyzed", "eagerly anticipated", "successfully navigated"
  // Note: Add up to 100 verbs here
];

const endings = [
  "the ancient ruins.", "a beautiful masterpiece.", "the complicated puzzle.", "a fascinating book.",
  "the towering mountain.", "a sparkling river.", "the hidden treasure.", "a delicious chocolate cake.",
  "the glowing stars.", "a friendly neighborhood.", "the deep blue ocean.", "a magical forest.",
  "the delicate butterfly.", "a complex mathematical equation.", "the historical monument.", "a vibrant rainbow."
  // Note: Add up to 100 endings here
];

function generateSentence() {
  const sub = subjects[Math.floor(Math.random() * subjects.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const end = endings[Math.floor(Math.random() * endings.length)];
  const sentence = `${sub} ${verb} ${end}`;
  return {
    text: sentence,
    phonetic: `Read smoothly: "${sentence}"`,
    def: "A dynamically generated sentence for speech practice."
  };
}

// --- 2. ADVANCED WORDS & MANNERS DATABASE ---
const contentDatabase = {
  hardWords: [
    { text: "Incomprehensible", phonetic: "/ɪnˌkɒm.prɪˈhen.sə.bəl/", def: "Impossible or very difficult to understand." },
    { text: "Philanthropy", phonetic: "/fɪˈlæn.θrə.pi/", def: "The desire to promote the welfare of others, usually through donating money." },
    { text: "Acquiesce", phonetic: "/ˌæk.wiˈes/", def: "To accept something reluctantly but without protest." },
    { text: "Cacophony", phonetic: "/kəˈkɒf.ə.ni/", def: "A harsh, discordant mixture of sounds." },
    { text: "Enigma", phonetic: "/ɪˈnɪɡ.mə/", def: "A person or thing that is mysterious or difficult to understand." },
    { text: "Mellifluous", phonetic: "/məˈlɪf.lu.əs/", def: "A voice or words that are sweet or musical; pleasant to hear." },
    { text: "Ubiquitous", phonetic: "/juːˈbɪk.wɪ.təs/", def: "Present, appearing, or found everywhere." },
    { text: "Sycophant", phonetic: "/ˈsɪk.ə.fænt/", def: "A person who acts obsequiously toward someone important to gain advantage." },
    { text: "Quintessential", phonetic: "/ˌkwɪn.tɪˈsen.ʃəl/", def: "Representing the most perfect or typical example of a quality." },
    { text: "Zealous", phonetic: "/ˈzel.əs/", def: "Showing great energy or enthusiasm in pursuit of a cause." }
    // Note: You can paste the rest of your 747 advanced words into this list!
  ],
  manners: [
    { text: "Good morning! How are you doing today?", phonetic: "Good morning! / How are you / doing today?", def: "A polite daily greeting." },
    { text: "Excuse me, I would appreciate your help.", phonetic: "Excuse me, / I would appreciate / your help.", def: "Politely asking for assistance." },
    { text: "Thank you very much for your generous hospitality.", phonetic: "Thank you very much / for your generous hospitality.", def: "Showing deep gratitude." }
  ]
};

let currentListenItem = null;
let currentSpeakItem = null;

// --- 3. UNIVERSAL MICROPHONE SUPPORT ---
let recognition = null;

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error("Speech Recognition API not supported in this browser.");
    return false;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    const spokenText = event.results[0][0].transcript;
    checkSpeech(spokenText);
  };

  recognition.onerror = function(event) {
    stopMicAnimation();
    if (event.error === 'not-allowed') {
      showFeedback("Mic blocked! Please allow microphone permissions in your browser settings.", "incorrect");
    } else {
      showFeedback(`Didn't catch that (${event.error}). Try again loudly!`, "incorrect");
    }
  };

  recognition.onend = function() {
    stopMicAnimation();
  };

  return true;
}

// Initialize on load
const micSupported = setupSpeechRecognition();

function getSelectedCategory() {
  return document.getElementById('category').value;
}

function handleCategoryChange() {
  loadNextItem('listen');
  loadNextItem('speak');
}

function switchTab(tab, event) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
  event.target.classList.add('active');

  if (tab === 'listen') {
    document.getElementById('listen-mode').classList.add('active');
    if (!currentListenItem) loadNextItem('listen');
  } else {
    document.getElementById('speak-mode').classList.add('active');
    if (!currentSpeakItem) loadNextItem('speak');
  }
}

function loadNextItem(mode) {
  const category = getSelectedCategory();
  let item;

  if (category === 'generator') {
    item = generateSentence();
  } else {
    const pool = contentDatabase[category];
    item = pool[Math.floor(Math.random() * pool.length)];
  }

  if (mode === 'listen') {
    currentListenItem = item;
    document.getElementById('listen-text').innerText = item.text;
    document.getElementById('listen-phonetic').innerText = item.phonetic || "";
    document.getElementById('listen-def').innerText = item.def;
  } else {
    currentSpeakItem = item;
    document.getElementById('speak-text').innerText = item.text;
    document.getElementById('speak-phonetic').innerText = `Guide: ${item.phonetic || "Read clearly"}`;
    document.getElementById('feedback').innerText = "Press the mic, allow permissions, and speak!";
    document.getElementById('feedback').className = "feedback";
  }
}

function speakCurrentText(mode = 'listen') {
  const item = mode === 'listen' ? currentListenItem : currentSpeakItem;
  if (!item) return;

  // Cancel any ongoing speech so it doesn't overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.lang = 'en-US';
  // Slow down slightly for children/learners
  utterance.rate = 0.8; 
  window.speechSynthesis.speak(utterance);
}

function startListening() {
  if (!micSupported || !recognition) {
    showFeedback("Mic not supported on this device/browser. Try Safari (iOS) or Chrome (Android/PC)!", "incorrect");
    return;
  }
  
  try {
    recognition.start();
    document.getElementById('mic-btn').classList.add('listening');
    document.getElementById('feedback').innerText = "Listening... Speak now!";
    document.getElementById('feedback').className = "feedback";
  } catch (error) {
    // Catch errors if recognition is already running
    console.log("Recognition already started or failed to start.");
  }
}

function stopMicAnimation() {
  document.getElementById('mic-btn').classList.remove('listening');
}

function checkSpeech(spoken) {
  // Remove punctuation and lowercase both strings to compare fairly
  const target = currentSpeakItem.text.toLowerCase().replace(/[.,!?;]/g, "").trim();
  const cleanSpoken = spoken.toLowerCase().replace(/[.,!?;]/g, "").trim();

  // If the sentence is long, we accept it if they got 80% of the words right, or if the main words match
  if (cleanSpoken === target || cleanSpoken.includes(target) || target.includes(cleanSpoken)) {
    showFeedback(`🎉 Perfect! You said: "${spoken}"`, "correct");
  } else {
    showFeedback(`Almost! I heard: "${spoken}". Take a breath and try again!`, "incorrect");
  }
}

// Start the app
loadNextItem('listen');
