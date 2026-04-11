/* global bootstrap, AOS */
(() => {
  AOS.init();

  // --------- Countdown (edit your birthday date here) ----------
  const birthday = new Date("April 18, 2026 11:59:59").getTime();
  const countdownEl = document.getElementById("countdown");
  const birthdayWishLocked = document.getElementById("birthdayWishLocked");
  const birthdayWishContent = document.getElementById("birthdayWishContent");
  const timer = setInterval(() => {
    const now = Date.now();
    const distance = birthday - now;

    if (distance <= 0) {
      clearInterval(timer);
      countdownEl.textContent = "Happy Birthday My Love 🎂❤️";
      if (birthdayWishLocked && birthdayWishContent) {
        birthdayWishLocked.classList.add("d-none");
        birthdayWishContent.classList.remove("d-none");
        popConfetti(150);
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);

  // --------- Journey dots (active section highlight) ----------
  const journeyDots = Array.from(document.querySelectorAll(".journey-dot"));
  const mobileNavItems = Array.from(document.querySelectorAll(".mobile-nav-item"));
  const journeySections = journeyDots
    .map((d) => d.getAttribute("data-target"))
    .filter(Boolean)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActiveJourney(id) {
    for (const d of journeyDots) {
      d.classList.toggle("is-active", d.getAttribute("data-target") === id);
    }
    for (const item of mobileNavItems) {
      item.classList.toggle("is-active", item.getAttribute("data-target") === id);
    }
  }

  if (journeySections.length > 0 && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        // pick the most-visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (visible?.target?.id) setActiveJourney(visible.target.id);
      },
      { root: null, threshold: [0.25, 0.4, 0.55, 0.7] }
    );
    for (const s of journeySections) io.observe(s);
  }

  // --------- Tap / click hearts ----------
  function spawnTapHeart(clientX, clientY) {
    const heart = document.createElement("span");
    heart.className = "tap-heart";
    heart.style.left = `${clientX}px`;
    heart.style.top = `${clientY}px`;
    heart.style.setProperty("--dx", `${-18 + Math.random() * 36}px`);
    const colors = ["#ff4d6d", "#ffd1dc", "#ff7aa2", "#ffffff"];
    heart.style.setProperty("--heart", colors[(Math.random() * colors.length) | 0]);
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }

  // Use pointerdown so it works on mobile taps too
  document.addEventListener(
    "pointerdown",
    (e) => {
      // Avoid hearts when interacting with form controls
      const tag = (e.target?.tagName || "").toLowerCase();
      if (["input", "textarea", "select", "button"].includes(tag)) return;
      spawnTapHeart(e.clientX, e.clientY);
    },
    { passive: true }
  );

  // --------- This or That ----------
  const thisOptions = Array.from(document.querySelectorAll(".this-option"));
  const thisResult = document.getElementById("thisResult");
  const myChoices = {
    drink: "coffee",
    time: "night",
    food: "spicy",
    plan: "home",
  };

  thisOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-question");
      const choice = btn.getAttribute("data-choice");
      if (!q || !choice) return;

      // clear previous pick in same row
      thisOptions
        .filter((b) => b.getAttribute("data-question") === q)
        .forEach((b) => b.classList.remove("is-chosen"));
      btn.classList.add("is-chosen");

      if (!thisResult) return;
      if (myChoices[q] === choice) {
        thisResult.textContent = "Same answer as mine here 😏";
      } else {
        thisResult.textContent = "Opposite here, but still perfect together 💕";
      }
    });
  });

  // --------- Proposal typing ----------
  const proposalBtn = document.getElementById("proposalBtn");
  const proposalTextEl = document.getElementById("proposalText");
  proposalBtn?.addEventListener("click", () => {
    const text = "Will You Stay With Me Forever? 💖";
    let i = 0;
    proposalTextEl.textContent = "";
    const speed = 55;
    const typeWriter = () => {
      if (i >= text.length) return;
      proposalTextEl.textContent += text.charAt(i);
      i += 1;
      setTimeout(typeWriter, speed);
    };
    typeWriter();
  });

  // --------- Secret ----------
  const secretBtn = document.getElementById("secretBtn");
  const secretMsg = document.getElementById("secretMsg");
  secretBtn?.addEventListener("click", () => {
    const code = prompt("Enter Secret Code ❤️");
    if (!code) return;
    if (code.trim().toLowerCase() === "iloveyou") {
      secretMsg.textContent = "Forever Yours 💖";
      popConfetti(130);
    } else {
      alert("Wrong Code 😜");
    }
  });

  // --------- Copy letter ----------
  const copyLetterBtn = document.getElementById("copyLetterBtn");
  copyLetterBtn?.addEventListener("click", async () => {
    const text = "You are my peace, my happiness, my forever.";
    try {
      await navigator.clipboard.writeText(text);
      copyLetterBtn.textContent = "Copied!";
      setTimeout(() => (copyLetterBtn.textContent = "Copy"), 1200);
    } catch {
      alert("Copy failed. (Browser blocked clipboard.)");
    }
  });

  // --------- Floating random photos (toggle) ----------
  const randomPhotosCard = document.getElementById("randomPhotosCard");
  let randomPhotosTimerId = 0;
  let randomPhotosOn = false;

  // Try common filenames; we'll keep only the ones that actually load.
  const randomPhotoCandidates = [
    "img.jpg",
    "bg.jpg",
    "img1.jpg",
    "img2.jpg",
    "img3.jpg",
    "img4.jpg",
    "img5.jpg",
    "img6.jpg",
    "img7.jpg",
    "img8.jpg",
    "img9.jpg",
    "img10.jpg",
    "photo1.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "pic1.jpg",
    "pic2.jpg",
    "pic3.jpg",
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    "img1.png",
    "img2.png",
    "img3.png",
    "photo1.png",
    "photo2.png",
    "photo3.png",
  ];

  let randomPhotoSources = [];

  function probeImage(src, timeoutMs = 900) {
    return new Promise((resolve) => {
      const img = new Image();
      let done = false;
      const finish = (ok) => {
        if (done) return;
        done = true;
        resolve(ok);
      };
      const t = window.setTimeout(() => finish(false), timeoutMs);
      img.onload = () => {
        window.clearTimeout(t);
        finish(true);
      };
      img.onerror = () => {
        window.clearTimeout(t);
        finish(false);
      };
      img.src = src;
    });
  }

  async function refreshRandomPhotoSources() {
    const checks = await Promise.all(randomPhotoCandidates.map(async (src) => ((await probeImage(src)) ? src : null)));
    randomPhotoSources = checks.filter(Boolean);
  }

  function spawnFloatingPhoto() {
    if (randomPhotoSources.length === 0) return;
    const src = randomPhotoSources[(Math.random() * randomPhotoSources.length) | 0];
    const img = document.createElement("img");
    img.className = "float-photo";
    img.alt = "Moment";
    img.src = src;

    // random position + size
    const w = 110 + Math.random() * 110; // 110 - 220px
    const left = 6 + Math.random() * 88; // vw
    const dur = 4200 + Math.random() * 3200; // ms
    const rot = -10 + Math.random() * 20; // deg
    img.style.left = `${left}vw`;
    img.style.setProperty("--w", `${w}px`);
    img.style.setProperty("--dur", `${Math.round(dur)}ms`);
    img.style.setProperty("--rot", `${rot.toFixed(1)}deg`);

    // slight depth variety
    img.style.opacity = "0";
    img.style.filter = `saturate(${0.95 + Math.random() * 0.25})`;

    document.body.appendChild(img);
    img.addEventListener("animationend", () => img.remove(), { once: true });
  }

  function setRandomPhotos(on) {
    randomPhotosOn = on;
    if (!randomPhotosCard) return;
    const sub = randomPhotosCard.querySelector(".moment-sub");
    if (sub) sub.textContent = on ? "Click to stop floating photos ✨" : "Click to start floating photos ✨";

    randomPhotosCard.style.outline = on ? "2px solid rgba(255,77,109,0.55)" : "none";
    randomPhotosCard.style.boxShadow = on ? "0 0 40px rgba(255,77,109,0.22)" : "";

    if (!on) {
      if (randomPhotosTimerId) window.clearInterval(randomPhotosTimerId);
      randomPhotosTimerId = 0;
      return;
    }

    if (randomPhotoSources.length === 0) {
      if (sub) sub.textContent = "Adding photos… (if none appear, put images in public/)";
      refreshRandomPhotoSources().then(() => {
        if (randomPhotoSources.length === 0) {
          if (sub) sub.textContent = "No photos found in public/ (add img1.jpg etc.)";
          setRandomPhotos(false);
          return;
        }
        if (sub) sub.textContent = "Click to stop floating photos ✨";
        for (let i = 0; i < 3; i += 1) setTimeout(spawnFloatingPhoto, i * 180);
      });
    } else {
      // immediate burst
      for (let i = 0; i < 3; i += 1) setTimeout(spawnFloatingPhoto, i * 180);
    }

    // immediate burst + then periodic spawns
    randomPhotosTimerId = window.setInterval(() => {
      spawnFloatingPhoto();
      if (Math.random() > 0.55) setTimeout(spawnFloatingPhoto, 320 + Math.random() * 420);
    }, 1600);
  }

  randomPhotosCard?.addEventListener("click", () => {
    setRandomPhotos(!randomPhotosOn);
  });

  // --------- Fireworks (simple particle burst) ----------
  const fireworksBtn = document.getElementById("fireworksBtn");
  const canvas = document.getElementById("fireworks");
  const ctx = canvas?.getContext("2d");
  let rafId = 0;
  let particles = [];

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function burst(x, y, count = 120) {
    const colors = ["#ff4d6d", "#ffd166", "#8ecae6", "#b8f2e6", "#ffffff"];
    for (let i = 0; i < count; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const s = 2.5 + Math.random() * 6.5;
      particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 40 + Math.random() * 40,
        r: 1.2 + Math.random() * 2.6,
        c: colors[(Math.random() * colors.length) | 0],
      });
    }
  }

  function tick() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.life -= 1;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.08; // gravity
      p.x += p.vx;
      p.y += p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
    }

    if (particles.length > 0) rafId = requestAnimationFrame(tick);
  }

  fireworksBtn?.addEventListener("click", () => {
    if (!canvas) return;
    const x = canvas.width * (0.25 + Math.random() * 0.5);
    const y = canvas.height * (0.25 + Math.random() * 0.35);
    burst(x, y, 160);
    burst(canvas.width * 0.5, canvas.height * 0.35, 140);
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  // --------- Confetti (DOM particles) ----------
  function popConfetti(amount = 90) {
    const colors = ["#ff4d6d", "#ffd166", "#06d6a0", "#118ab2", "#ffffff"];
    for (let i = 0; i < amount; i += 1) {
      const el = document.createElement("span");
      el.style.position = "fixed";
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = `-10px`;
      el.style.width = `${6 + Math.random() * 6}px`;
      el.style.height = `${6 + Math.random() * 10}px`;
      el.style.background = colors[(Math.random() * colors.length) | 0];
      el.style.borderRadius = `${Math.random() > 0.6 ? 999 : 2}px`;
      el.style.opacity = "0.95";
      el.style.zIndex = "99999";
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(el);

      const dx = (Math.random() - 0.5) * 220;
      const dur = 900 + Math.random() * 900;
      el.animate(
        [
          { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${dx}px, 110vh) rotate(${720 + Math.random() * 720}deg)`, opacity: 0.1 },
        ],
        { duration: dur, easing: "cubic-bezier(.2,.7,.2,1)" }
      ).onfinish = () => el.remove();
    }
  }

  // --------- Music toggle (no external mp3 needed) ----------
  const muteBtn = document.getElementById("muteBtn");
  let audioCtx = null;
  let osc = null;
  let gain = null;
  let isOn = false;

  function ensureTone() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    osc = audioCtx.createOscillator();
    gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = 440;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
  }

  function setMusic(on) {
    ensureTone();
    isOn = on;
    if (audioCtx?.state === "suspended") audioCtx.resume();
    if (gain) gain.gain.value = on ? 0.02 : 0;
    if (muteBtn) muteBtn.textContent = `Music: ${on ? "On" : "Off"}`;
  }

  muteBtn?.addEventListener("click", () => {
    setMusic(!isOn);
    if (isOn) popConfetti(70);
  });

  // unlock audio on first interaction for browsers
  document.body.addEventListener(
    "click",
    () => {
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();
    },
    { once: true }
  );
})();

//Add LOCK SCREEN
function unlockSite() {
  const password = document.getElementById("passwordInput").value;

  if (password === "14NOV2003" || password === "14nov2003" || password === "14112003") {   // 🔑 change password here
    
    // Smooth fade out
    const lock = document.getElementById("lockScreen");
    lock.style.transition = "opacity 1s";
    lock.style.opacity = "0";

    setTimeout(() => {
      lock.style.display = "none";
    }, 1000);

  } else {
    const error = document.getElementById("errorMsg");
    error.innerText = "Wrong Password 💔";

    // Shake effect
    const input = document.getElementById("passwordInput");
    input.style.border = "2px solid red";
    input.animate([
      { transform: "translateX(0px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(0px)" }
    ], { duration: 300 });

    setTimeout(() => {
      error.innerText = "";
      input.style.border = "";
    }, 1500);
  }
}
