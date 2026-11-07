/**
 * Booking alert sounds: a one-shot "ka-ching" and a looping new-order ringtone. Both are made with
 * Web Audio, so no sound file is needed (a real ringtone file can still be dropped in — see ORDER_SOUND_URL).
 * Browsers only allow audio after the user has interacted with the page, so the context is created
 * (or resumed) on the first tap or key press — `unlockAudio` wires that up once.
 */
let ctx: AudioContext | null = null;

function context() {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  return ctx;
}

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const unlock = () => {
    void context()
      ?.resume()
      .then(() => {
        // An alert that started before the first tap was silent — start it for real now.
        if (alarmWanted) startOrderAlarm();
      });
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

/** One decaying tone: `peak` volume reached in 10ms, fading out over `decay` seconds. */
function tone(
  ac: AudioContext,
  out: AudioNode,
  freq: number,
  at: number,
  decay: number,
  peak: number,
  type: OscillatorType = "sine"
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(peak, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + decay + 0.05);
}

/** Short filtered noise burst — the "clack" of a till drawer. */
function click(ac: AudioContext, out: AudioNode, at: number) {
  const len = Math.floor(ac.sampleRate * 0.05);
  const buffer = ac.createBuffer(1, len, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++)
    data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2400;
  const gain = ac.createGain();
  gain.gain.value = 0.35;
  src.connect(filter).connect(gain).connect(out);
  src.start(at);
}

/**
 * "Booking received" sound: a till click, a quick rising C–E–G, then a ringing bell on high C —
 * like a register ka-ching. Under a second, loud enough to hear across the desk, not alarming.
 */
export function playChime() {
  const ac = context();
  if (!ac || ac.state !== "running") return;
  const now = ac.currentTime + 0.02;
  const master = ac.createGain();
  master.gain.value = 0.9;
  master.connect(ac.destination);

  click(ac, master, now);
  // Rising arpeggio C6, E6, G6 — triangle for a brighter, coin-like edge.
  [1046.5, 1318.5, 1568].forEach((f, i) =>
    tone(ac, master, f, now + 0.05 + i * 0.07, 0.22, 0.13, "triangle")
  );
  // Bell on C7: fundamental plus inharmonic partials so it rings like metal.
  const bell = now + 0.27;
  tone(ac, master, 2093, bell, 0.9, 0.16);
  tone(ac, master, 2093 * 2.76, bell, 0.45, 0.05);
  tone(ac, master, 2093 * 5.4, bell, 0.25, 0.025);
}

/* ───────────── New-order ringtone (loops until stopped) ───────────── */

/** Drop a real ringtone here to use it instead of the built-in one. */
export const ORDER_SOUND_URL = "/sounds/new-order.mp3";
const RING_GAP_MS = 2200;

let alarmWanted = false;
let fileFailed = false;
let audioEl: HTMLAudioElement | null = null;
let synthTimer: ReturnType<typeof setInterval> | null = null;

/** Marimba-like note: a sine with its 4th-partial "knock", quick attack, short ring. */
function marimba(ac: AudioContext, out: AudioNode, freq: number, at: number) {
  tone(ac, out, freq, at, 0.42, 0.32);
  tone(ac, out, freq * 3.93, at, 0.09, 0.08);
  tone(ac, out, freq * 2, at, 0.2, 0.06);
}

/**
 * One ring of the built-in order tone: two quick melodic bursts (like a delivery-app "new order" ring),
 * about 1.3s long, played again every RING_GAP_MS.
 */
function ringOnce() {
  const ac = context();
  if (!ac || ac.state !== "running") return;
  const master = ac.createGain();
  master.gain.value = 0.85;
  master.connect(ac.destination);
  const now = ac.currentTime + 0.02;
  // G5 C6 E6 G6 · C7 G6 — up and back, twice.
  const melody = [783.99, 1046.5, 1318.5, 1568, 2093, 1568];
  for (const burst of [0, 0.7])
    melody.forEach((f, i) => marimba(ac, master, f, now + burst + i * 0.095));
}

function startSynth() {
  if (synthTimer) return;
  ringOnce();
  synthTimer = setInterval(ringOnce, RING_GAP_MS);
}

function stopSynth() {
  if (synthTimer) clearInterval(synthTimer);
  synthTimer = null;
}

/** Starts the looping new-order ringtone: the audio file if present, else the built-in tone. */
export function startOrderAlarm() {
  if (typeof window === "undefined") return;
  alarmWanted = true;
  if (fileFailed) return startSynth();
  if (!audioEl) {
    audioEl = new Audio(ORDER_SOUND_URL);
    audioEl.loop = true;
    audioEl.addEventListener("error", () => {
      // No file (404) or unsupported format — fall back to the built-in ring.
      fileFailed = true;
      audioEl = null;
      if (alarmWanted) startSynth();
    });
  }
  audioEl.play().catch(() => {
    // Autoplay blocked until the first tap — unlockAudio restarts it then.
  });
}

export function stopOrderAlarm() {
  alarmWanted = false;
  stopSynth();
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }
}
