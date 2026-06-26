// Existential Magic 8-Ball - Synthesizer Module (Bulletproof Edition)
// Uses Web Audio API to generate sound effects without loading external files

let audioCtx = null;
let crystalHumNode = null;
let soundEnabled = true;

/**
 * Initializes the Audio Context if it hasn't been created yet.
 * Must be called in response to a user gesture.
 */
function initAudio() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (e) {
    console.warn("Existential 8-Ball: Web Audio API is blocked or unsupported.", e);
    audioCtx = null;
  }
}

/**
 * Toggle sound globally
 */
function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  if (!enabled && crystalHumNode) {
    stopCrystalHum();
  } else if (enabled && audioCtx && audioCtx.state === 'running') {
    startCrystalHum();
  }
}

/**
 * Creates a generic gain node with an exponential envelope.
 */
function createEnvelope(startVal, endVal, duration, time) {
  if (!audioCtx) return null;
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(startVal, time);
  gainNode.gain.exponentialRampToValueAtTime(endVal, time + duration);
  return gainNode;
}

/**
 * 1. Tiny Whoosh Sound
 * A quick frequency sweep from high to low with filtered noise-like quality.
 */
function playWhoosh() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  try {
    const time = audioCtx.currentTime;

    // Use a triangle wave sweeping rapidly
    const osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, time);
    osc.frequency.exponentialRampToValueAtTime(150, time + 0.35);

    // Bandpass filter to make it sweepy and soft
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, time);
    filter.frequency.exponentialRampToValueAtTime(200, time + 0.35);
    filter.Q.setValueAtTime(3, time);

    // Volume envelope
    const gainNode = createEnvelope(0.4, 0.001, 0.35, time);
    if (!gainNode) return;

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.36);
  } catch (e) {
    console.warn("Could not play whoosh sound:", e);
  }
}

/**
 * 2. Crystal Hum
 * A continuous, ambient, modulated resonant hum.
 * Fades in and runs continuously.
 */
function startCrystalHum() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  if (crystalHumNode) return; // Already humming

  try {
    const time = audioCtx.currentTime;
    crystalHumNode = audioCtx.createGain();
    crystalHumNode.gain.setValueAtTime(0.001, time);
    crystalHumNode.gain.linearRampToValueAtTime(0.08, time + 1.5); // Slow fade-in

    // Main resonant carrier (Triangle for warm timbre)
    const carrier = audioCtx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(220, time); // A3 note

    // Sub-harmonic for depth
    const subCarrier = audioCtx.createOscillator();
    subCarrier.type = 'sine';
    subCarrier.frequency.setValueAtTime(110, time); // A2 note

    // Modulator LFO for a pulsating effect
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.8, time); // 0.8 Hz oscillation

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(1.5, time);

    // High-resonance bandpass filter to create "crystal" metallic quality
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(880, time); // Resonance around A5
    filter.Q.setValueAtTime(12, time);

    // Modulator sweeps filter frequency slightly
    const filterLfo = audioCtx.createOscillator();
    filterLfo.type = 'sine';
    filterLfo.frequency.setValueAtTime(0.2, time); // Very slow sweep
    const filterLfoGain = audioCtx.createGain();
    filterLfoGain.gain.setValueAtTime(200, time);

    // Connect LFOs
    lfo.connect(lfoGain);
    lfoGain.connect(carrier.frequency); // Modulate carrier frequency slightly

    filterLfo.connect(filterLfoGain);
    filterLfoGain.connect(filter.frequency); // Modulate filter cutoff

    // Connect audio path
    carrier.connect(filter);
    subCarrier.connect(filter);
    filter.connect(crystalHumNode);
    crystalHumNode.connect(audioCtx.destination);

    // Start oscillators
    carrier.start(time);
    subCarrier.start(time);
    lfo.start(time);
    filterLfo.start(time);

    // Keep references to clean up
    crystalHumNode.sources = [carrier, subCarrier, lfo, filterLfo];
  } catch (e) {
    console.warn("Could not start crystal hum:", e);
  }
}

function stopCrystalHum() {
  if (!crystalHumNode) return;
  if (!audioCtx) return;

  try {
    const time = audioCtx.currentTime;
    const oldNode = crystalHumNode;
    crystalHumNode = null;

    oldNode.gain.setValueAtTime(oldNode.gain.value, time);
    oldNode.gain.linearRampToValueAtTime(0.001, time + 0.5); // Quick fade-out

    setTimeout(() => {
      oldNode.sources.forEach(src => {
        try { src.stop(); } catch (e) {}
      });
      oldNode.disconnect();
    }, 600);
  } catch (e) {
    console.warn("Could not stop crystal hum:", e);
  }
}

/**
 * 3. Cat Meow Sound
 * A frequency-swept oscillator (vowel formant simulation) mimicking a cat's meow.
 */
function playMeow() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  try {
    const time = audioCtx.currentTime;

    // Base oscillator (Triangle wave for soft animal voice)
    const osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, time);
    // Meow pitch sweep
    osc.frequency.exponentialRampToValueAtTime(700, time + 0.15);
    osc.frequency.exponentialRampToValueAtTime(320, time + 0.55);

    // Detuned secondary oscillator to create vocal chord thickness
    const oscDetune = audioCtx.createOscillator();
    oscDetune.type = 'sawtooth';
    oscDetune.frequency.setValueAtTime(452, time);
    oscDetune.frequency.exponentialRampToValueAtTime(703, time + 0.15);
    oscDetune.frequency.exponentialRampToValueAtTime(322, time + 0.55);

    // High shelf filter to cut harsh high frequencies from the sawtooth
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1000, time);
    lowpass.frequency.exponentialRampToValueAtTime(600, time + 0.55);

    // Formant bandpass filter simulation (sweeps filter to simulate "m-e-o-w")
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, time); // "eh" sound
    filter.frequency.exponentialRampToValueAtTime(1400, time + 0.15); // "ah" sound
    filter.frequency.exponentialRampToValueAtTime(500, time + 0.55); // "oo/w" sound
    filter.Q.setValueAtTime(4, time);

    // Volume envelope
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.linearRampToValueAtTime(0.18, time + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.55);

    // Connect nodes
    osc.connect(lowpass);
    oscDetune.connect(lowpass);
    lowpass.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start/Stop
    osc.start(time);
    oscDetune.start(time);
    osc.stop(time + 0.6);
    oscDetune.stop(time + 0.6);
  } catch (e) {
    console.warn("Could not play meow sound:", e);
  }
}

/**
 * 4. Tech Difficulty / Glitch Beep
 * A low, distorted, stuttering square wave.
 */
function playGlitch() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  try {
    const time = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, time);

    // Quick stuttering frequency modulation
    osc.frequency.setValueAtTime(180, time + 0.05);
    osc.frequency.setValueAtTime(90, time + 0.08);
    osc.frequency.setValueAtTime(240, time + 0.15);
    osc.frequency.setValueAtTime(100, time + 0.22);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, time);

    // Envelope with a stutter/mute in the middle
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.linearRampToValueAtTime(0.12, time + 0.02);
    gainNode.gain.setValueAtTime(0.12, time + 0.1);
    gainNode.gain.setValueAtTime(0.001, time + 0.12); // Stutter gap
    gainNode.gain.setValueAtTime(0.1, time + 0.16);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.32);
  } catch (e) {
    console.warn("Could not play glitch sound:", e);
  }
}

/**
 * 5. Cosmic Success Arpeggio
 * Sparkling, high-register, major-seventh sine waves.
 */
function playCosmicSuccess() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  try {
    const time = audioCtx.currentTime;
    const notes = [783.99, 1046.50, 1318.51, 1567.98, 2093.00];

    notes.forEach((freq, idx) => {
      const noteTime = time + (idx * 0.05);

      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, noteTime);
      gainNode.gain.linearRampToValueAtTime(0.05, noteTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, noteTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  } catch (e) {
    console.warn("Could not play success chime:", e);
  }
}

// Export functions to window namespace so app.js can access them
window.OrbAudio = {
  init: initAudio,
  toggle: setSoundEnabled,
  playWhoosh,
  startHum: startCrystalHum,
  stopHum: stopCrystalHum,
  playMeow,
  playGlitch,
  playSuccess: playCosmicSuccess
};
