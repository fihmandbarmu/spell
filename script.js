// Database tailored for manners, long sentences, and advanced words
const contentDatabase = {
  manners: [
    { text: "Good morning! I hope you have a wonderful day.", phonetic: "Good morning! / I hope you have / a wonderful day.", def: "A polite way to greet someone early in the day." },
    { text: "Excuse me, could you please help me with this?", phonetic: "Excuse me, / could you please help me / with this?", def: "How to politely ask for assistance." },
    { text: "Thank you so much for your kindness.", phonetic: "Thank you so much / for your kindness.", def: "A warm way to show appreciation." },
    { text: "It is very nice to meet you.", phonetic: "It is very nice / to meet you.", def: "What to say when you are introduced to someone new." },
    { text: "I am sorry for making a mistake.", phonetic: "I am sorry / for making a mistake.", def: "A polite apology when you do something wrong." }
  ],
  longSentences: [
    { text: "Even though it was raining heavily outside, they decided to put on their boots and splash in the puddles.", phonetic: "Even though it was raining heavily outside, / they decided to put on their boots / and splash in the puddles.", def: "Practicing a long, descriptive sentence with pauses." },
    { text: "The extraordinary butterfly fluttered its colorful wings and landed gently on the bright yellow sunflower.", phonetic: "The extraordinary butterfly / fluttered its colorful wings / and landed gently / on the bright yellow sunflower.", def: "A beautiful sentence full of adjectives." },
    { text: "If you always try your best and treat others with respect, you will achieve great things in life.", phonetic: "If you always try your best / and treat others with respect, / you will achieve great things in life.", def: "An inspiring long sentence." }
  ],
  words: [
    { text: "Appreciation", phonetic: "/əˌpriː.ʃiˈeɪ.ʃən/", def: "Recognizing the good qualities of someone or something." },
    { text: "Extraordinary", phonetic: "/ɪkˈstrɔː.dən.ər.i/", def: "Very unusual, remarkable, or special." },
    { text: "Respectful", phonetic: "/rɪˈspekt.fəl/", def: "Showing politeness or honor to someone." },
    { text: "Courageous", phonetic: "/kəˈreɪ.dʒəs/", def: "Being very brave in a difficult situation." }
  ]
};

let currentListenItem = null;
let currentSpeakItem = null;
let recognition = null;

// Initialize Speech Recognition API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const spokenText = event.results[0][0].transcript.toLowerCase().trim();
    checkSpeech(spokenText);
  };

  recognition.onerror = function() {
    showFeedback("Didn't catch that clearly. Try speaking a bit louder!", "incorrect");
    stopMicAnimation();
  };

  recognition.onend = function() {
    stopMicAnimation();
  };
}

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

async function fetchWordDetails(query) {
  // If input is a full sentence, provide an automatic breakdown
  if (query.trim().includes(' ')) {
    return {
      text: query,
      phonetic: `Pause at commas: "${query}"`,
      def: "Custom sentence practice."
    };
  }

  // Fetch dynamically from dictionary API for single words
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    
    const phonetic = data[0].phonetic || (data[0].phonetics.find(p => p.text)?.text) || "Pronunciation ready";
    const def = data[0].meanings[0]?.definitions[0]?.definition || "A great English word.";

    return { text: data[0].word, phonetic, def };
  } catch (err) {
    return {
      text: query,
      phonetic: "Sound it out slowly",
      def: "Custom vocabulary word."
    };
  }
}

async function loadNextItem(mode) {
  const category = getSelectedCategory();
  const pool = contentDatabase[category];
  const item = pool[Math.floor(Math.random() * pool.length)];

  if (mode === 'listen') {
    currentListenItem = item;
    document.getElementById('listen-text').innerText = item.text;
    document.getElementById('listen-phonetic').innerText = item.phonetic;
    document.getElementById('listen-def').innerText = item.def;
  } else {
    currentSpeakItem = item;
    document.getElementById('speak-text').innerText = item.text;
    document.getElementById('speak-phonetic').innerText = `Break it down: ${item.phonetic}`;
    document.getElementById('feedback').innerText = "Press the mic and speak clearly!";
    document.getElementById('feedback').className = "feedback";
  }
}

async function loadCustomInput() {
  const val = document.getElementById('custom-input').value.trim();
  if (!val) return;

  const item = await fetchWordDetails(val);
  currentSpeakItem = item;

  document.getElementById('speak-text').innerText = item.text;
  document.getElementById('speak-phonetic').innerText = `Guide: ${item.phonetic}`;
  document.getElementById('feedback').innerText = "Press the mic and say your phrase!";
  document.getElementById('feedback').className = "feedback";
  document.getElementById('custom-input').value = "";
}

function speakCurrentText(mode = 'listen') {
  const item = mode === 'listen' ? currentListenItem : currentSpeakItem;
  if (!item) return;

  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.lang = 'en-US';
  utterance.rate = 0.75; // Slower rate so kids can hear every word in long sentences clearly
  window.speechSynthesis.speak(utterance);
}

function startListening() {
  if (!recognition) {
    alert("Speech Recognition requires Google Chrome or Microsoft Edge!");
    return;
  }
  document.getElementById('mic-btn').classList.add('listening');
  document.getElementById('feedback').innerText = "Listening carefully...";
  document.getElementById('feedback').className = "feedback";
  recognition.start();
}

function stopMicAnimation() {
  document.getElementById('mic-btn').classList.remove('listening');
}

function checkSpeech(spoken) {
  // Clean up punctuation to accurately compare long sentences
  const target = currentSpeakItem.text.toLowerCase().replace(/[.,!?;]/g, "").trim();
  const cleanSpoken = spoken.toLowerCase().replace(/[.,!?;]/g, "").trim();

  // For long sentences, we accept if they got at least a good chunk of it correct
  if (cleanSpoken === target || cleanSpoken.includes(target) || target.includes(cleanSpoken)) {
    showFeedback(`🎉 Beautiful manners! You said: "${spoken}"`, "correct");
  } else {
    showFeedback(`Great try! I heard: "${spoken}". Take a breath at the slashes (/) and try again!`, "incorrect");
  }
}

function showFeedback(text, statusClass) {
  const fb = document.getElementById('feedback');
  fb.innerText = text;
  fb.className = `feedback ${statusClass}`;
}

// Start the app by loading the first item
loadNextItem('listen');
