// Existential Magic 8-Ball - Core Application Script

// 1. Database of Responses
const RESPONSES = {
  philosophical: {
    loading: [
      "Consulting cosmic WiFi...",
      "Tuning alignment of the universe...",
      "Pondering the heat death of space..."
    ],
    normal: [
      "Nothing matters, therefore everything matters.",
      "You seek certainty in a universe built from chaos.",
      "The answer exists in a quantum superposition of yes and no.",
      "Yes. But in the grand cosmic timescale, does it truly change anything?",
      "No. And the stars remain completely indifferent to this outcome.",
      "Why do you seek answers from a glowing purple circle?",
      "Perhaps. The void is thinking about it.",
      "Yes. But maybe after dramatically staring out a window for 3 minutes."
    ],
    roast: [
      "Your existence is a brief flash of carbon-based hubris.",
      "The universe expanded for 13.8 billion years just for you to ask that?",
      "You are a tiny, anxious ape clinging to a wet rock. Figure it out yourself.",
      "In 100 years, nobody will care. In 5 minutes, you'll still be procrastinating.",
      "The laws of physics suggest that you are wasting your time.",
      "Entropy wins in the end. And so does whatever you're trying to avoid doing.",
      "Your confidence is adorable. Your question, however, is tragic.",
      "My answers are limited by your capacity to understand them, which is... low."
    ]
  },
  cat: {
    loading: [
      "Waking up from 14th nap today...",
      "Translating meows to English...",
      "Judging your life choices..."
    ],
    normal: [
      "Girl be serious.",
      "You've asked this question five times.",
      "Look in a mirror and ask yourself if that makes sense.",
      "Meow. (That means figure it out yourself).",
      "No. Now go clean my litter box, human.",
      "Yes, but only if you give me treats first.",
      "The admissions/life gods are busy. Try sacrificing a well-written SOP.",
      "The cat has spoken: proceed. But do it quietly."
    ],
    roast: [
      "You've had the same water bottle on your desk since the Mesozoic Era.",
      "I am a cat and even I have a better five-year plan than you.",
      "You are really testing the limits of my nine lives with this query.",
      "Put the screen down. Touch some synthetic grass. Or real grass.",
      "I lick my own butt and yet I find your choices questionable.",
      "If I had a treat for every bad decision you made, I'd be a fat cat.",
      "You already know the answer, mortal. You're just looking for an accomplice.",
      "I fell asleep halfway through reading your question. Try again with less drama."
    ]
  },
  wizard: {
    loading: [
      "Deciphering dusty scrolls...",
      "Stirring the cauldron of destiny...",
      "Asking the wizard council..."
    ],
    normal: [
      "The scrolls say yes.",
      "The scrolls also suggest touching grass.",
      "My scrying pool is foggy. Try wiping your screen.",
      "The stars align in your favor. The Wizard Union approves.",
      "Alas, the wizard council has voted, and the answer is no.",
      "A mysterious stranger will soon solve this. (Spoiler: it's not me).",
      "It is written in the runes. Unreadable, but definitely written.",
      "Consult the stars, for they know. I'm just a guy in a pointy hat."
    ],
    roast: [
      "I spent 300 years studying arcane arts just to be asked... this?",
      "I cast a spell of common sense upon you. Let me know if it starts working.",
      "The ancient scrolls suggest you log off and clean your room.",
      "My crystal ball is showing me a future where you stop being so indecisive.",
      "You seek magic because you lack the willpower to do the laundry.",
      "I have seen dragons, wizards, and gods, but your procrastination is the most terrifying thing of all.",
      "No amount of magic can fix whatever is going on with your current trajectory.",
      "The wand says yes. The hat says no. The staff suggests getting a hobby."
    ]
  },
  chandler: {
    loading: [
      "Searching for self-deprecating thoughts...",
      "Writing a sarcastic comment...",
      "Thinking: could I be any more helpful?..."
    ],
    normal: [
      "Could you BE any more indecisive?",
      "Oh, sure, ask the purple ball. That's how Einstein did it.",
      "And... I'm spent. Ask again when I'm less sarcastic.",
      "Yes! Unless... wait, no. Definitely no.",
      "I'm not great at advice. Can I interest you in a sarcastic comment?",
      "It's a definite maybe. With a heavy side of 'who cares'.",
      "I'm hopeless and awkward and desperate for love! Oh wait, you asked about your career.",
      "What do you know? You're a door. You're a lock."
    ],
    roast: [
      "Could your life BE any more of a sitcom subplot?",
      "What is wrong with you? No, seriously, I want to write a thesis.",
      "Is it possible to have negative confidence? Because we're there.",
      "I'm glad you came to a glowing ball for guidance, because your own judgement is... wow.",
      "Should you do it? Sure. Should you film it and send it to America's Funniest Home Videos? Absolutely.",
      "Oh, look at you, asking a magical sphere instead of talking to a human. Smooth.",
      "I'm sitting here, pretending to be a personality mode, and even I am embarrassed for you.",
      "If you were any more clueless, you'd be Joey."
    ]
  }
};

// 2. Global State Variables
let currentPersona = 'philosophical';
let roastMode = false;
let localSoundEnabled = true;
let isConsulting = false;

// 3. Elements Selection
const starsContainer = document.getElementById('stars-container');
const questionForm = document.getElementById('question-form');
const questionInput = document.getElementById('question-input');
const submitBtn = document.getElementById('submit-btn');
const crystalBall = document.getElementById('crystal-ball');
const wiseCat = document.getElementById('wise-cat');
const responseLoader = document.getElementById('response-loader');
const responseContent = document.getElementById('response-content');
const consoleMessage = document.getElementById('console-message');
const confidenceMeterContainer = document.getElementById('confidence-meter-container');
const confidenceValue = document.getElementById('confidence-value');
const confidenceFill = document.getElementById('confidence-fill');
const responseContainer = document.getElementById('response-container');
const responseHeader = document.getElementById('response-header');
const responseText = document.getElementById('response-text');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// 4. Initialize Background Stars
function initStars() {
  const starCount = 35;
  const starTypes = ['★', '✦', '✨', '•'];
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = starTypes[Math.floor(Math.random() * starTypes.length)];
    
    // Random size (font-size) between 10px and 22px
    const size = Math.random() * 12 + 10;
    star.style.fontSize = `${size}px`;
    
    // Random color
    star.style.color = Math.random() > 0.4 ? 'var(--color-gold)' : 'var(--color-burgundy-light)';
    
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${Math.random() * 15 + 10}s`; // 10s to 25s
    star.style.animationDelay = `${Math.random() * -25}s`; // Pre-warm animations
    star.style.opacity = Math.random() * 0.6 + 0.3;
    starsContainer.appendChild(star);
  }
}

// 5. Sound FX Toggle Event
const soundToggle = document.getElementById('sound-toggle');
soundToggle.addEventListener('click', () => {
  localSoundEnabled = !localSoundEnabled;
  soundToggle.classList.toggle('active', localSoundEnabled);
  window.OrbAudio.toggle(localSoundEnabled);
  
  if (localSoundEnabled) {
    window.OrbAudio.playSuccess();
    window.OrbAudio.startHum();
  } else {
    window.OrbAudio.stopHum();
  }
});

// 6. Roast Mode Toggle Event
const roastToggle = document.getElementById('roast-toggle');
roastToggle.addEventListener('click', () => {
  roastMode = !roastMode;
  roastToggle.classList.toggle('active', roastMode);
  document.body.classList.toggle('roast-active', roastMode);
  
  if (roastMode) {
    window.OrbAudio.playGlitch();
  } else {
    window.OrbAudio.playWhoosh();
  }
});

// 7. Tabs Selection Event
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (isConsulting) return;
    
    // Deactivate previous tab
    tabButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    
    // Activate clicked tab
    const selectedBtn = e.currentTarget;
    selectedBtn.classList.add('active');
    selectedBtn.setAttribute('aria-selected', 'true');
    
    currentPersona = selectedBtn.dataset.persona;
    
    // Play transition sound
    window.OrbAudio.playWhoosh();
    window.OrbAudio.startHum();
  });
});

// 8. Wise Cat Clicking
wiseCat.addEventListener('click', () => {
  window.OrbAudio.playMeow();
  
  // Temporarily speed up tail wag and twitch ears
  const tail = wiseCat.querySelector('.cat-tail');
  if (tail) {
    tail.style.animationDuration = '0.5s';
    setTimeout(() => {
      tail.style.animationDuration = '';
    }, 1500);
  }
});

// 9. Typewriter Text Reveal
function typeText(element, text, callback) {
  element.textContent = '';
  element.classList.remove('response-placeholder');
  let index = 0;
  
  function nextChar() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      // Typewriter speed: slightly random for human feel
      const speed = Math.random() * 15 + 15; // 15ms - 30ms
      setTimeout(nextChar, speed);
    } else if (callback) {
      callback();
    }
  }
  nextChar();
}

// 10. Memory Systems (localStorage)
function getHistory() {
  try {
    const hist = localStorage.getItem('existential_8ball_history');
    const parsed = hist ? JSON.parse(hist) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse history from localStorage:", e);
    return [];
  }
}

function saveHistory(question, answer, persona, isRoast) {
  try {
    const history = getHistory();
    const newItem = {
      q: question,
      a: answer,
      p: persona,
      roast: isRoast,
      timestamp: new Date().toISOString()
    };
    history.unshift(newItem); // Add to top
    localStorage.setItem('existential_8ball_history', JSON.stringify(history));
  } catch (e) {
    console.error("Failed to write to localStorage:", e);
  }
  try {
    renderHistory();
  } catch (e) {
    console.error("Failed to render history:", e);
  }
}

function renderHistory() {
  try {
    const history = getHistory();
    historyList.innerHTML = '';
    
    // Filter for questions asked "today"
    const todayStr = new Date().toDateString();
    const todayHistory = history.filter(item => {
      return item && item.timestamp && new Date(item.timestamp).toDateString() === todayStr;
    });
    
    if (todayHistory.length === 0) {
      historyList.innerHTML = `<li class="history-empty-state">No questions asked yet today. Don't be shy.</li>`;
      return;
    }
    
    todayHistory.forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      
      // Capitalize persona name
      const personaLabel = item.p ? (item.p.charAt(0).toUpperCase() + item.p.slice(1)) : 'Unknown';
      const roastLabel = item.roast ? ' | 💀 Roast' : '';
      
      li.innerHTML = `
        <div class="history-q">Q: ${escapeHtml(item.q || '')}</div>
        <div class="history-a-row">
          <span class="history-persona">${personaLabel}${roastLabel}</span>
          <span>"${escapeHtml(item.a || '')}"</span>
        </div>
      `;
      historyList.appendChild(li);
    });
  } catch (e) {
    console.error("Failed in renderHistory:", e);
  }
}

function clearHistory() {
  try {
    localStorage.removeItem('existential_8ball_history');
  } catch (e) {
    console.error("Failed to clear localStorage:", e);
  }
  try {
    renderHistory();
  } catch (e) {}
  window.OrbAudio.playGlitch();
}

clearHistoryBtn.addEventListener('click', clearHistory);

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// 11. Form Submission & Orb Consultation
questionForm.addEventListener('submit', (e) => {
  try {
    e.preventDefault();
    const question = questionInput.value.trim();
    if (!question) return;
    
    // Check if already running
    if (isConsulting) return;
    isConsulting = true;

    // Initialize audio context on first user consultation if needed
    try {
      window.OrbAudio.init();
      window.OrbAudio.startHum();
    } catch (err) {
      console.warn("Audio init failed, proceeding without audio:", err);
    }
    
    // UI State: Disable Form
    submitBtn.disabled = true;
    questionInput.disabled = true;
    
    // Reset responses
    responseContainer.classList.remove('active');
    responseText.textContent = '';
    responseText.classList.add('response-placeholder');
    
    // Trigger animations
    crystalBall.classList.add('shaking');
    document.body.classList.add('stars-speedup');
    
    // Make the stars container rotate/shake slightly too
    starsContainer.style.animation = 'stars-fast-spin 2.5s infinite linear';
    
    // Sound
    try {
      window.OrbAudio.playWhoosh();
    } catch (err) {}
    
    // Console Loading Steps Setup
    responseContent.style.display = 'none';
    responseLoader.style.display = 'flex';
    confidenceMeterContainer.classList.remove('visible');
    confidenceFill.style.width = '0%';
    confidenceValue.textContent = '0%';
    
    const loadingPhrases = RESPONSES[currentPersona].loading;
    
    // Step 1: 0ms
    consoleMessage.textContent = loadingPhrases[0];
    
    // Step 2: 500ms
    setTimeout(() => {
      try {
        consoleMessage.textContent = loadingPhrases[1];
        window.OrbAudio.playWhoosh();
      } catch (err) {}
    }, 500);
    
    // Step 3: 1000ms
    setTimeout(() => {
      try {
        consoleMessage.textContent = loadingPhrases[2];
        
        // Show Confidence meter and fill it
        confidenceMeterContainer.classList.add('visible');
        const randConfidence = calculateConfidence();
        confidenceFill.style.width = `${randConfidence}%`;
        
        // Count up the text percentage
        let currentPct = 0;
        const interval = setInterval(() => {
          try {
            if (currentPct < randConfidence) {
              currentPct += Math.min(3, randConfidence - currentPct);
              confidenceValue.textContent = `${currentPct}%`;
            } else {
              clearInterval(interval);
            }
          } catch (err) {
            clearInterval(interval);
          }
        }, 25);
        
        window.OrbAudio.playWhoosh();
      } catch (err) {}
    }, 1000);
    
    // Step 4: Finalize & Reveal after 2000ms
    setTimeout(() => {
      try {
        // Stop animations
        crystalBall.classList.remove('shaking');
        starsContainer.style.animation = '';
        document.body.classList.remove('stars-speedup');
        
        // Switch from loader to response text
        responseLoader.style.display = 'none';
        responseContent.style.display = 'block';
        
        // Play Success sound
        try {
          window.OrbAudio.playSuccess();
        } catch (err) {}
        
        // Select answer
        const answerPool = roastMode ? RESPONSES[currentPersona].roast : RESPONSES[currentPersona].normal;
        const randomIndex = Math.floor(Math.random() * answerPool.length);
        const chosenAnswer = answerPool[randomIndex];
        
        // Display result
        responseHeader.textContent = getResponseHeader();
        responseContainer.classList.add('active');
        
        typeText(responseText, chosenAnswer, () => {
          try {
            // Re-enable form
            submitBtn.disabled = false;
            questionInput.disabled = false;
            questionInput.value = ''; // clear input
            isConsulting = false;
            
            // Save to memory
            saveHistory(question, chosenAnswer, currentPersona, roastMode);
          } catch (err) {
            console.error("Error in typeText callback:", err);
            // Emergency form recovery
            submitBtn.disabled = false;
            questionInput.disabled = false;
            isConsulting = false;
          }
        });
      } catch (err) {
        console.error("Error in finalize timeout:", err);
        // Emergency form recovery
        submitBtn.disabled = false;
        questionInput.disabled = false;
        isConsulting = false;
      }
    }, 2000);
  } catch (err) {
    console.error("Error in form submit listener:", err);
    // Emergency form recovery
    submitBtn.disabled = false;
    questionInput.disabled = false;
    isConsulting = false;
  }
});

// Explicit Enter key submission for the input field
questionInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (!isConsulting && questionInput.value.trim()) {
      try {
        if (typeof questionForm.requestSubmit === 'function') {
          questionForm.requestSubmit();
        } else {
          submitBtn.click();
        }
      } catch (err) {
        console.error("Error submitting form via Enter key:", err);
        submitBtn.click(); // Direct click fallback
      }
    }
  }
});


// Helper: Calculate confidence based on state
function calculateConfidence() {
  if (roastMode) {
    // Sarcastic low/high numbers
    const values = [5, 12, 18, 98, 99, 100];
    return values[Math.floor(Math.random() * values.length)];
  }
  return Math.floor(Math.random() * 61) + 40; // 40% to 100%
}

// Helper: Get response title based on personality
function getResponseHeader() {
  switch (currentPersona) {
    case 'philosophical':
      return "🌌 The Void Whispers";
    case 'cat':
      return "😼 The Wise Cat Judges";
    case 'wizard':
      return "🧙 The Scrolls Reveal";
    case 'chandler':
      return "🎭 Could this BE the answer?";
    default:
      return "🎱 The Orb has spoken";
  }
}

// 12. App Initialization
window.addEventListener('DOMContentLoaded', () => {
  initStars();
  renderHistory();
  
  // Listen for first interaction to start background hum
  const resumeAudioOnGesture = () => {
    if (localSoundEnabled) {
      window.OrbAudio.init();
      window.OrbAudio.startHum();
    }
    // Remove listeners so it only triggers once
    window.removeEventListener('click', resumeAudioOnGesture);
    window.removeEventListener('keydown', resumeAudioOnGesture);
  };
  window.addEventListener('click', resumeAudioOnGesture);
  window.addEventListener('keydown', resumeAudioOnGesture);
});
