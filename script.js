"use strict";

// Edit this letter freely. It is inserted as text, never evaluated as HTML.
const LETTER = `Baby Julie, I miss you so much. I wish I could sit beside you while you read this, hold your hand, and tell you these things without a screen between us. For now, let this little letter be the closest thing to a hug I can send you.

I think about you every day. Even when I'm listening to music, my thoughts somehow find their way back to you. A familiar melody becomes a little reminder of your voice. A sweet line makes me wish you were here to hear it with me. I dream about you almost every night, and waking up makes me miss you all over again.

I miss your smile, your voice, your presence, and all the little things about you. I miss simply knowing you're beside me. Sometimes I wish I could pause time whenever we're together, just to stay a little longer in an ordinary moment that feels special because you're in it. I don't always need a big adventure. Sometimes, being close to you would be more than enough.

There is something I want you to be sure of: I will never stop courting you, Baby Julie. I will never stop loving you, missing you, and finding new ways to remind you that you are special to me. Even on days when we're apart, my heart will always find its way back to you.

I don't want my love to be shown only through words, even lovely ones on a page like this. I want you to feel it in my actions: in the time I make for you, in the way I listen, in remembering what matters to you, and in being there when your day feels heavy. I want to keep choosing you, appreciating you, and making you feel loved, even after the sweet excitement of a moment has passed.

I know that love requires patience, effort, understanding, and faith. I won't pretend that I will always know the perfect thing to say. But I want to learn how to love you well, hear you without rushing you, and take responsibility when I get something wrong. Your feelings matter to me. You never have to hide a difficult day just to make everything look okay.

I don't expect everything to be perfect. I just want us to keep growing together, honestly and gently, with room to understand each other better. I want to celebrate your good days and be patient on the hard ones. I want you to have space for your dreams, your rest, and all the things that make you yourself. Loving you also means caring about your peace.

I pray that God continues guiding our connection and our future. I pray for wisdom, for kind hearts, and for patience when we need it most. Whatever tomorrow brings, I hope we keep meeting it with sincerity, gratitude, and the courage to choose what is good for us.

No matter how ordinary a day may seem, you will always be someone special in my life. You don't need to do anything extraordinary to deserve tenderness. You are already so dear to me, just as you are. And if you ever need reassurance, you can come back to these words: I am grateful for you. I miss you. I love you. And I still want to court you, again and again, in all the little ways I can.

With all the love in my heart,

Your Baby Love,
James 💜`;

const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "james-julie-love-letter-answers-v1";
const FIELDS = ["missMe", "besideYou", "someday", "knowLove", "courting"];
const QUESTIONS = [
  "When you miss me, what do you usually do?",
  "If I were beside you right now, what would you want us to do?",
  "What's one thing you want us to experience together someday?",
  "Do you know how much I love and miss you?",
  "Can I continue courting you and loving you every day?",
];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const state = {
  opened: false,
  opening: false,
  page: "envelope",
  typing: false,
  typed: 0,
  timer: null,
  answers: null,
  motionPaused: reducedMotion.matches,
  storageAvailable: true,
};
const characters = Array.from(LETTER); // Preserve emoji and Unicode characters.
let toastTimer;
let dialogReturnFocus;
let mediaAttemptPending = false;
const audio = $("backgroundMusic");
audio.volume = 0.35;

function toast(message) {
  clearTimeout(toastTimer);
  $("toast").textContent = message;
  $("toast").hidden = false;
  toastTimer = setTimeout(() => {
    $("toast").hidden = true;
  }, 4800);
}

// Ambient particles are created once and reused; there is no endless DOM growth.
function createAmbience() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 23; i++) {
    const particle = document.createElement("span");
    const isHeart = i < 9;
    particle.className = isHeart ? "floating-heart" : "sparkle";
    particle.textContent = isHeart ? "♡" : i % 2 ? "✧" : "✦";
    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--y", `${Math.random() * 95}%`);
    particle.style.setProperty(
      "--size",
      `${isHeart ? 12 + Math.random() * 11 : 7 + Math.random() * 9}px`,
    );
    particle.style.setProperty(
      "--duration",
      `${isHeart ? 17 + Math.random() * 15 : 3 + Math.random() * 4}s`,
    );
    particle.style.setProperty("--delay", `${-Math.random() * 25}s`);
    fragment.append(particle);
  }
  $("ambient").append(fragment);
}

function updateMotion() {
  document.body.classList.toggle("motion-paused", state.motionPaused);
  $("motionToggle").setAttribute("aria-pressed", String(state.motionPaused));
  $("motionToggle").setAttribute(
    "aria-label",
    state.motionPaused
      ? "Resume decorative animations"
      : "Pause decorative animations",
  );
  $("motionLabel").textContent = state.motionPaused
    ? "A quiet moment"
    : "A little magic";
  if (state.motionPaused && state.typing) finishTyping();
}

function burstHearts() {
  if (state.motionPaused || reducedMotion.matches) return;
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = i % 3 ? "♡" : "♥";
    heart.setAttribute("aria-hidden", "true");
    heart.style.setProperty("--size", `${14 + Math.random() * 19}px`);
    heart.style.setProperty(
      "--tx",
      `${(Math.random() - 0.5) * Math.min(window.innerWidth, 750)}px`,
    );
    heart.style.setProperty("--ty", `${-100 - Math.random() * 350}px`);
    heart.style.setProperty("--rotation", `${Math.random() * 90 - 45}deg`);
    document.body.append(heart);
    setTimeout(() => heart.remove(), 2200);
  }
}

function setMusicUI(playing) {
  $("musicButton").setAttribute("aria-pressed", String(playing));
  $("musicButton").setAttribute(
    "aria-label",
    playing ? "Pause background music" : "Play background music",
  );
  $("musicIcon").setAttribute("href", playing ? "#i-pause" : "#i-play");
  $("vinyl").classList.toggle("is-playing", playing);
  const missingSong = !playing && Boolean(audio.error);
  $("musicLabel").textContent = playing
    ? "Playing for you"
    : missingSong
      ? "Our song, soon"
      : "A song for us";
  $("musicStatus").textContent = playing
    ? "Background music is playing."
    : missingSong
      ? "Our soundtrack is waiting for a song to be added."
      : "Background music is paused.";
}

async function playMusic(showMissingMessage = true) {
  if (mediaAttemptPending) return;
  mediaAttemptPending = true;
  try {
    // Reload after an error so replacing the placeholder file can be retried.
    if (audio.error) audio.load();
    await audio.play();
    $("musicStatus").textContent = "Background music is playing.";
  } catch (error) {
    setMusicUI(false);
    const message =
      error.name === "NotAllowedError"
        ? "Tap the music button to play our song."
        : "Our soundtrack is waiting for a song to be added.";
    $("musicLabel").textContent =
      error.name === "NotAllowedError" ? "Tap to play" : "Our song, soon";
    $("musicStatus").textContent = message;
    if (showMissingMessage) toast(message);
  } finally {
    mediaAttemptPending = false;
  }
}

function openEnvelope() {
  if (state.opened || state.opening) return;
  state.opening = true;
  // Invoked directly from a click so browser sound permissions are respected.
  if (audio.paused) void playMusic(false);
  $("openButton").disabled = true;
  $("envelopeButton").disabled = true;
  $("openButton").querySelector("span").textContent =
    "A little piece of my heart…";
  $("envelopeButton").classList.add("is-opening");
  const duration = state.motionPaused || reducedMotion.matches ? 100 : 1700;
  setTimeout(() => {
    $("envelopeView").classList.add("is-leaving");
    setTimeout(
      () => {
        $("envelopeView").hidden = true;
        $("readingSpace").hidden = false;
        state.opened = true;
        state.opening = false;
        showPage("letter");
        $("accessibleLetter").textContent = LETTER;
        startTyping();
      },
      state.motionPaused || reducedMotion.matches ? 20 : 420,
    );
  }, duration);
}

function showPage(page) {
  if (!state.opened) return;
  if (page !== "letter" && state.typing) finishTyping();
  state.page = page;
  $("letterView").hidden = page !== "letter";
  $("questionView").hidden = page !== "question";
  $("thankYouView").hidden = page !== "thanks";
  const firstPage = page === "letter";
  $("pageCount").textContent = `Page ${firstPage ? 1 : 2} of 2`;
  for (const [id, active] of [
    ["letterTab", firstPage],
    ["questionTab", !firstPage],
  ]) {
    $(id).classList.toggle("is-current", active);
    if (active) $(id).setAttribute("aria-current", "step");
    else $(id).removeAttribute("aria-current");
  }
  const heading = $(
    firstPage
      ? "letterPageTitle"
      : page === "question"
        ? "questionTitle"
        : "thanksTitle",
  );
  heading.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function startTyping() {
  if (state.typed >= characters.length) return;
  state.typing = true;
  if (state.motionPaused || reducedMotion.matches) {
    finishTyping();
    return;
  }
  $("typingCursor").hidden = false;
  $("skipTyping").hidden = false;
  typeNextCharacter();
}

function typeNextCharacter() {
  if (!state.typing) return;
  if (document.hidden) {
    state.timer = setTimeout(typeNextCharacter, 150);
    return;
  }
  const next = characters[state.typed++];
  $("letterText").append(document.createTextNode(next));
  if (state.typed >= characters.length) {
    finishTyping();
    return;
  }
  const delay =
    next === "\n"
      ? 70
      : /[.!?]/.test(next)
        ? 110
        : /[,;:]/.test(next)
          ? 55
          : 13;
  state.timer = setTimeout(typeNextCharacter, delay);
}

function finishTyping() {
  clearTimeout(state.timer);
  state.typing = false;
  state.typed = characters.length;
  $("letterText").textContent = LETTER;
  $("typingCursor").hidden = true;
  $("skipTyping").hidden = true;
  $("typingStatus").textContent = "Every word, with all my love.";
}

function showMessage(kind) {
  const secret = kind === "secret";
  $("dialogTitle").textContent = secret
    ? "You found my little secret."
    : "I would choose you again.";
  $("dialogMessage").textContent = secret
    ? "If you could peek into my heart right now, you'd find a little place that has your name on it. Baby Julie, you are in the quiet parts of my day, in my prayers, and in the future I gently hope for. You are never just another thought. You are my favorite one."
    : "Baby Julie, this letter ends, but my effort won't end with it. I still want to court you on the ordinary Tuesdays, listen when you need to talk, and find little ways to make you smile. You never have to earn my kindness by having a perfect day. I love you, I miss you, and I want to keep showing up for you. One little act of love at a time.";
  dialogReturnFocus = document.activeElement;
  $("loveDialog").showModal();
  burstHearts();
}

// Only completed submissions are persisted. Drafts stay in memory until submitted.
function validateStoredAnswers(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  for (const key of FIELDS) {
    if (
      typeof value[key] !== "string" ||
      !value[key].trim() ||
      value[key].length > 3000
    )
      return false;
    const radios = document.querySelectorAll(`input[name="${key}"]`);
    if (
      radios.length &&
      !Array.from(radios).some((input) => input.value === value[key])
    )
      return false;
  }
  return true;
}

function restoreAnswers() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    state.storageAvailable = false;
    $("storageNote").textContent =
      "Browser storage is unavailable. Answers will stay only on this open page and are not sent to James.";
    return;
  }
  if (!raw) return;
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return;
  }
  if (!validateStoredAnswers(saved)) return;
  state.answers = saved;
  for (const key of FIELDS) {
    const field = $("heartForm").elements.namedItem(key);
    if (field) field.value = saved[key];
  }
  $("formStatus").textContent =
    "Your previous answers are here, saved only in this browser.";
}

function renderSummary(answers) {
  $("answerSummary").replaceChildren();
  FIELDS.forEach((key, index) => {
    const title = document.createElement("dt");
    const answer = document.createElement("dd");
    title.textContent = QUESTIONS[index];
    answer.textContent = answers[key]; // No HTML injection from answers or storage.
    $("answerSummary").append(title, answer);
  });
}

function submitAnswers(event) {
  event.preventDefault();
  const form = $("heartForm");
  for (const id of ["besideYou", "someday"]) {
    $(id).setCustomValidity(
      $(id).value.trim() ? "" : "Write a little something from your heart.",
    );
  }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const answers = Object.fromEntries(
    FIELDS.map((key) => [key, String(data.get(key) || "").trim()]),
  );
  state.answers = answers;
  let saved = false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    saved = true;
    state.storageAvailable = true;
  } catch {
    state.storageAvailable = false;
  }
  $("savedNote").textContent = saved
    ? "Your answers are saved only in this browser. Nothing has been sent to James."
    : "Your answers are only on this open page because browser storage is unavailable. Nothing has been sent to James. You can download a copy below.";
  renderSummary(answers);
  $("clearStatus").textContent = "";
  $("clearAnswers").hidden = false;
  $("downloadAnswers").hidden = false;
  showPage("thanks");
  burstHearts();
}

function downloadAnswers() {
  if (!state.answers) {
    toast("There are no answers to download yet.");
    return;
  }
  const content = `A little note from Baby Julie\nFor James Neil Traigo\n\n${FIELDS.map((key, i) => `${i + 1}. ${QUESTIONS[i]}\n${state.answers[key]}`).join("\n\n")}\n\nSaved by you. Not sent automatically. 💜\n`;
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "A-little-note-from-Julie.txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Your answers are ready to keep as a little note.");
}

function clearAnswers() {
  let removed = true;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    removed = false;
  }
  if (!removed) {
    $("clearStatus").textContent =
      "This browser could not clear its storage. Please clear this site’s data in browser settings.";
    return;
  }
  state.answers = null;
  $("heartForm").reset();
  $("answerSummary").replaceChildren();
  $("formStatus").textContent = "";
  $("savedNote").textContent =
    "Saved answers have been cleared from this browser. Nothing was sent to James.";
  $("clearStatus").textContent =
    "Your answers have been cleared. You can write a new little note whenever you like.";
  $("clearAnswers").hidden = true;
  $("downloadAnswers").hidden = true;
}

// The supplied personal photo is the only couple photo. Missing media is graceful.
function showPhoto() {
  const photo = $("ourPhoto");
  if (photo.naturalWidth > 0) {
    photo.hidden = false;
    $("photoPlaceholder").hidden = true;
  }
}
$("ourPhoto").addEventListener("load", showPhoto);
$("ourPhoto").addEventListener("error", () => {
  $("ourPhoto").hidden = true;
  $("photoPlaceholder").hidden = false;
});
if ($("ourPhoto").complete) showPhoto();
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        $("photoCard").classList.add("is-visible");
        observer.disconnect();
      }
    },
    { threshold: 0.15 },
  );
  observer.observe($("photoCard"));
} else {
  $("photoCard").classList.add("is-visible");
}

$("envelopeButton").addEventListener("click", openEnvelope);
$("openButton").addEventListener("click", openEnvelope);
$("skipTyping").addEventListener("click", finishTyping);
$("nextButton").addEventListener("click", () => showPage("question"));
$("questionTab").addEventListener("click", () => showPage("question"));
["letterTab", "backButton", "rereadLetter"].forEach((id) =>
  $(id).addEventListener("click", () => showPage("letter")),
);
$("editAnswers").addEventListener("click", () => showPage("question"));
$("secretHeart").addEventListener("click", () => showMessage("secret"));
$("surpriseButton").addEventListener("click", () => showMessage("surprise"));
["closeDialog", "keepMessage"].forEach((id) =>
  $(id).addEventListener("click", () => $("loveDialog").close()),
);
$("loveDialog").addEventListener("click", (event) => {
  const box = $("loveDialog").getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    $("loveDialog").close();
});
$("loveDialog").addEventListener("close", () => {
  if (dialogReturnFocus) dialogReturnFocus.focus({ preventScroll: true });
});
$("motionToggle").addEventListener("click", () => {
  state.motionPaused = !state.motionPaused;
  updateMotion();
});
reducedMotion.addEventListener("change", (event) => {
  state.motionPaused = event.matches;
  updateMotion();
});
$("heartForm").addEventListener("submit", submitAnswers);
["besideYou", "someday"].forEach((id) =>
  $(id).addEventListener("input", () => $(id).setCustomValidity("")),
);
$("downloadAnswers").addEventListener("click", downloadAnswers);
$("clearAnswers").addEventListener("click", clearAnswers);
$("musicButton").addEventListener("click", () => {
  if (audio.paused) void playMusic();
  else audio.pause();
});
audio.addEventListener("play", () => setMusicUI(true));
audio.addEventListener("pause", () => setMusicUI(false));
audio.addEventListener("error", () => {
  setMusicUI(false);
  $("musicLabel").textContent = "Our song, soon";
});
$("volumeToggle").addEventListener("click", () => {
  const open = $("volumePanel").hidden;
  $("volumePanel").hidden = !open;
  $("volumeToggle").setAttribute("aria-expanded", String(open));
  $("volumeToggle").setAttribute(
    "aria-label",
    open ? "Hide volume control" : "Show volume control",
  );
});
$("volume").addEventListener("input", (event) => {
  const volume = Number(event.target.value);
  audio.volume = volume / 100;
  $("volumeOutput").value = `${volume}%`;
});

createAmbience();
restoreAnswers();
updateMotion();
