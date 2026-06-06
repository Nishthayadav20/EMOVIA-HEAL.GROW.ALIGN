/*
================================================================
   EMOVIA - GLOBAL STATE & VIEW CONTROLLER
================================================================
*/

// Global Application State Object
const EmoviaApp = {
    // Current User Data
    user: {
        name: "Nishtha Yadav",
        tier: "Standard Plan",
        isPremium: false,
        streak: 1,
        meditationMinutes: 0,
        unlockedBadges: [],
        moodLogs: [
            { date: "Mon", score: 3 },
            { date: "Tue", score: 4 },
            { date: "Wed", score: 3 },
            { date: "Thu", score: 5 },
            { date: "Fri", score: 4 }
        ],
        gratitudeLogs: [],
        goals: []
    },
    
    // Active View Settings
    activeLanguage: 'en',
    activeTab: 'overview-tab',
    
    // Animation Context
    breathingTimer: null,
    isBreathingActive: false,
    
    // Chart Container
    chartInstance: null
};

// Initialize Application once DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Start canvas fallback background
    initFallbackCanvas();
    
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Load local storage configurations
    loadUserData();
    
    // Initialize Tab Routing
    initTabRouting();
    
    // Render Dashboard Analytics Chart
    renderMoodChart();
    
    // Initialize Breathing Exercise
    initBreathingExercise();
    
    // Initialize Safe Space audio control
    initSafeSpaceMixer();
    
    // Initialize Meditation audio tracks
    initMeditationAudio();
    
    // Load Daily Roadmap checklists
    loadRoadmapTasks();
    
    // Setup Emergency button actions
    initEmergencyTriggers();
    
    // Setup Mood log selections
    initMoodLogger();
    
    // Card Hover 3D Tilt Effect
    initTiltEffects();
    
    // Initialize YouTube & Spotify search controls
    initMindTabSearch();
    
    // Initialize Daily Self-Care Tip Click Actions
    initMentalTips();

    // Setup Starting Splash Page controls
    initSplashPage();
});

/* ----------------------------------------------------------------- */
/* 1. VIEW ROUTER & TAB CONTROLLER */
/* ----------------------------------------------------------------- */
function initTabRouting() {
    const navItems = document.querySelectorAll(".nav-item");
    const viewSections = document.querySelectorAll(".view-section");
    
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            if (!target) return;
            
            // Toggle active sidebar link
            navItems.forEach(n => n.classList.remove("active"));
            item.classList.add("active");
            
            // Toggle active viewport section
            viewSections.forEach(sec => {
                sec.classList.remove("active");
                if (sec.id === target) {
                    sec.classList.add("active");
                }
            });
            
            EmoviaApp.activeTab = target;
            
            // Specific overrides for tab selections
            if (target === "overview-tab" && EmoviaApp.chartInstance) {
                // Redraw chart to align with display space dimensions
                setTimeout(() => {
                    EmoviaApp.chartInstance.resize();
                }, 200);
            }
        });
    });
}

/* ----------------------------------------------------------------- */
/* 2. DYNAMIC CANVAS PARTICLE FALLBACK BACKGROUND */
/* ----------------------------------------------------------------- */
function initFallbackCanvas() {
    const canvas = document.getElementById("fallback-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    window.addEventListener("resize", () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });
    
    const particles = [];
    for (let i = 0; i < 45; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 4 + 1,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1
        });
    }
    
    function drawParticles() {
        // Simple light overlay instead of complete clearing to build subtle tracks
        ctx.fillStyle = "rgba(244, 251, 255, 0.15)";
        ctx.fillRect(0, 0, w, h);
        
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(13, 148, 136, ${p.alpha})`;
            ctx.shadowColor = "rgba(13, 148, 136, 0.35)";
            ctx.shadowBlur = p.r * 3;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
        });
        
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
}

/* ----------------------------------------------------------------- */
/* 3. DASHBOARD ANALYTICS CHART SETUP */
/* ----------------------------------------------------------------- */
function renderMoodChart() {
    const canvas = document.getElementById("mood-trends-chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const labels = EmoviaApp.user.moodLogs.map(log => log.date);
    const dataPoints = EmoviaApp.user.moodLogs.map(log => log.score);
    
    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood Balance Scale',
                data: dataPoints,
                borderColor: '#2b7397',
                borderWidth: 3,
                pointBackgroundColor: '#32959d',
                pointBorderColor: '#2b7397',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 9,
                tension: 0.4,
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(43, 115, 151, 0.25)');
                    gradient.addColorStop(1, 'rgba(50, 149, 157, 0.01)');
                    return gradient;
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const labels = ["Low", "Anxious", "Neutral", "Calm", "Joyful"];
                            return labels[value - 1];
                        },
                        color: '#94a3b8',
                        font: { family: 'Outfit', size: 11 }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Outfit', size: 11 }
                    },
                    grid: { display: false }
                }
            }
        }
    };
    
    if (EmoviaApp.chartInstance) {
        EmoviaApp.chartInstance.destroy();
    }
    EmoviaApp.chartInstance = new Chart(ctx, chartConfig);
}

/* ----------------------------------------------------------------- */
/* 4. BREATHING ASSISTANT LOGIC */
/* ----------------------------------------------------------------- */
function initBreathingExercise() {
    const circle = document.getElementById("breath-circle");
    const instruction = document.getElementById("breath-instruction");
    const statusText = document.getElementById("breath-status");
    if (!circle) return;
    
    circle.addEventListener("click", () => {
        if (EmoviaApp.isBreathingActive) {
            // Stop exercise
            clearInterval(EmoviaApp.breathingTimer);
            EmoviaApp.isBreathingActive = false;
            circle.className = "breathing-circle-inner";
            statusText.textContent = "Tap Start";
            instruction.textContent = "Click circle to start breathing sequence";
            
            // Add meditation minutes
            updateMeditationMins(2);
            unlockBadge("badge-zen-master");
            return;
        }
        
        // Start exercise loop
        EmoviaApp.isBreathingActive = true;
        let step = 0; // 0 = Inhale, 1 = Hold, 2 = Exhale
        
        function cycleBreathing() {
            if (!EmoviaApp.isBreathingActive) return;
            
            if (step === 0) {
                // Inhale
                circle.className = "breathing-circle-inner inhale";
                statusText.textContent = "Inhale";
                instruction.textContent = "Breathe in deeply through your nose...";
                step = 1;
                EmoviaApp.breathingTimer = setTimeout(cycleBreathing, 4000);
            } else if (step === 1) {
                // Hold
                circle.className = "breathing-circle-inner hold inhale";
                statusText.textContent = "Hold";
                instruction.textContent = "Suspend your breath softly...";
                step = 2;
                EmoviaApp.breathingTimer = setTimeout(cycleBreathing, 4000);
            } else {
                // Exhale
                circle.className = "breathing-circle-inner exhale";
                statusText.textContent = "Exhale";
                instruction.textContent = "Blow air out completely from your mouth...";
                step = 0;
                EmoviaApp.breathingTimer = setTimeout(cycleBreathing, 4000);
            }
        }
        
        cycleBreathing();
    });
}

/* ----------------------------------------------------------------- */
/* 5. VIRTUAL SAFE SPACE MIXER */
/* ----------------------------------------------------------------- */
function initSafeSpaceMixer() {
    const nodes = document.querySelectorAll(".sound-control-node");
    
    nodes.forEach(node => {
        const btn = node.querySelector(".play-sound-btn");
        const slider = node.querySelector(".sound-vol-slider");
        const type = btn.getAttribute("data-sound");
        const audio = document.getElementById(`audio-${type}`);
        
        if (!audio) return;
        
        // Connect slider to HTML audio volume
        slider.addEventListener("input", (e) => {
            audio.volume = e.target.value;
        });
        
        // Play / Pause toggler
        btn.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                node.classList.add("playing");
                btn.innerHTML = '<i data-lucide="pause"></i>';
                lucide.createIcons();
            } else {
                audio.pause();
                node.classList.remove("playing");
                btn.innerHTML = '<i data-lucide="play"></i>';
                lucide.createIcons();
            }
        });
    });
}

/* ----------------------------------------------------------------- */
/* 6. DAILY ROADMAP CHECKLIST & STREAKS */
/* ----------------------------------------------------------------- */
function loadRoadmapTasks() {
    const container = document.getElementById("wellness-tasks-list");
    if (!container) return;
    
    const tasks = [
        { id: "t1", title: "Complete 1 breathing cycle (4-4-4 seconds)", cat: "Breathing" },
        { id: "t2", title: "Log your mood indicator emoji today", cat: "Tracking" },
        { id: "t3", title: "Write at least one sentence in the Soul Journal", cat: "Writing" },
        { id: "t4", title: "Check the Placement stress checklist", cat: "Student Special" }
    ];
    
    container.innerHTML = "";
    
    tasks.forEach(t => {
        const div = document.createElement("div");
        div.className = "task-item";
        div.setAttribute("data-task-id", t.id);
        
        // Check if completed in local state
        const isCompleted = localStorage.getItem(`task-done-${t.id}`) === 'true';
        if (isCompleted) div.classList.add("completed");
        
        div.innerHTML = `
            <div class="task-checkbox"><i data-lucide="check"></i></div>
            <span class="task-title">${t.title}</span>
            <span class="task-category">${t.cat}</span>
        `;
        
        div.addEventListener("click", () => {
            const currentStatus = div.classList.toggle("completed");
            localStorage.setItem(`task-done-${t.id}`, currentStatus ? 'true' : 'false');
            
            // Recount streak checks
            if (currentStatus) {
                updateStreakCount(1);
            }
        });
        
        container.appendChild(div);
    });
    lucide.createIcons();
}

function updateStreakCount(val) {
    let current = parseInt(localStorage.getItem("user-streak-val") || "1");
    current += val;
    localStorage.setItem("user-streak-val", current);
    
    const el = document.getElementById("streak-val");
    if (el) el.textContent = `${current} Days`;
}

function updateMeditationMins(mins) {
    let current = parseInt(localStorage.getItem("user-med-mins") || "0");
    current += mins;
    localStorage.setItem("user-med-mins", current);
    
    const el = document.getElementById("meditation-val");
    if (el) el.textContent = `${current} min`;
}

/* ----------------------------------------------------------------- */
/* 7. DAILY MOOD SELECTION LOGS */
/* ----------------------------------------------------------------- */
function initMoodLogger() {
    const btns = document.querySelectorAll(".mood-btn");
    
    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            btns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const score = parseInt(btn.getAttribute("data-mood"));
            const desc = btn.getAttribute("data-desc");
            
            // Save to logs
            const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
            EmoviaApp.user.moodLogs.push({ date: today, score: score });
            
            // Limit to 7 items on dashboard chart view
            if (EmoviaApp.user.moodLogs.length > 7) {
                EmoviaApp.user.moodLogs.shift();
            }
            
            // Update UI elements
            const el = document.getElementById("mood-val");
            if (el) el.textContent = desc;
            
            // Save state
            saveUserData();
            
            // Rerender Chart
            renderMoodChart();
            
            // Unlock first badge
            unlockBadge("badge-first-step");
        });
    });
}

/* ----------------------------------------------------------------- */
/* 8. BADGES SYSTEM */
/* ----------------------------------------------------------------- */
function unlockBadge(id) {
    const item = document.getElementById(id);
    if (!item) return;
    
    if (!EmoviaApp.user.unlockedBadges.includes(id)) {
        EmoviaApp.user.unlockedBadges.push(id);
        item.classList.add("unlocked");
        
        // Toast notifications
        notifyUser("New Badge Unlocked!", item.querySelector(".badge-name").textContent);
        
        // Update metric display
        const countEl = document.getElementById("badge-count-val");
        if (countEl) countEl.textContent = EmoviaApp.user.unlockedBadges.length;
        
        saveUserData();
    }
}

function notifyUser(title, body) {
    // Elegant slide-in notification
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.bottom = "20px";
    div.style.right = "20px";
    div.style.zIndex = "300";
    div.style.width = "300px";
    div.style.padding = "15px 20px";
    div.style.borderRadius = "12px";
    div.style.background = "linear-gradient(135deg, #0f172a, #1e1b4b)";
    div.style.border = "1px solid rgba(0, 245, 212, 0.4)";
    div.style.boxShadow = "0 8px 30px rgba(0, 245, 212, 0.2)";
    div.style.color = "white";
    div.style.transform = "translateX(350px)";
    div.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    
    div.innerHTML = `
        <div style="font-weight: 700; font-size:14px; margin-bottom:4px; display:flex; align-items:center; gap:8px;">
            <span style="color:#ffd700;">★</span> ${title}
        </div>
        <div style="font-size:12px; color:#94a3b8;">${body}</div>
    `;
    
    document.body.appendChild(div);
    
    // Slide in
    setTimeout(() => { div.style.transform = "translateX(0)"; }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        div.style.transform = "translateX(350px)";
        setTimeout(() => { div.remove(); }, 400);
    }, 4000);
}

/* ----------------------------------------------------------------- */
/* 9. EMERGENCY HELP LOGS */
/* ----------------------------------------------------------------- */
function initEmergencyTriggers() {
    const btn = document.getElementById("emergency-btn");
    const modal = document.getElementById("crisis-modal");
    const backdrop = document.getElementById("app-modal-backdrop");
    const closeBtn = document.getElementById("close-crisis-modal-btn");
    const saveContactBtn = document.getElementById("crisis-save-contact-btn");
    
    if (!btn) return;
    
    btn.addEventListener("click", () => {
        modal.classList.add("active");
        backdrop.style.display = "block";
    });
    
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        backdrop.style.display = "none";
    });
    
    saveContactBtn.addEventListener("click", () => {
        const val = document.getElementById("crisis-contact-phone").value;
        if (val) {
            localStorage.setItem("emergency-contact-phone", val);
            alert("Emergency trusted contact registered! They will receive immediate notification if high distress levels are scanned.");
        }
    });
}

/* ----------------------------------------------------------------- */
/* 10. LOCAL STORAGE DATAS */
/* ----------------------------------------------------------------- */
function saveUserData() {
    localStorage.setItem("emovia-user-object", JSON.stringify(EmoviaApp.user));
}

function loadUserData() {
    const data = localStorage.getItem("emovia-user-object");
    if (data) {
        try {
            const parsed = JSON.parse(data);
            EmoviaApp.user = Object.assign({}, EmoviaApp.user, parsed);
        } catch(e) {
            console.error("Parse error loading local data", e);
        }
    }
    
    // Sync UI elements
    const nameEl = document.getElementById("app-user-name");
    const tierEl = document.getElementById("app-user-tier");
    const badgeEl = document.getElementById("app-premium-badge");
    
    if (nameEl) nameEl.textContent = EmoviaApp.user.name;
    if (tierEl) tierEl.textContent = EmoviaApp.user.tier;
    
    if (EmoviaApp.user.isPremium) {
        if (badgeEl) badgeEl.style.display = "flex";
    }
    
    // Load badges status
    EmoviaApp.user.unlockedBadges.forEach(badgeId => {
        const item = document.getElementById(badgeId);
        if (item) item.classList.add("unlocked");
    });
    
    const countEl = document.getElementById("badge-count-val");
    if (countEl) countEl.textContent = EmoviaApp.user.unlockedBadges.length;
}

/* ----------------------------------------------------------------- */
/* 11. 3D CARD HOVER TILT EFFECTS */
/* ----------------------------------------------------------------- */
function initTiltEffects() {
    const cards = document.querySelectorAll(".tilt-card");
    
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const px = x / rect.width;
            const py = y / rect.height;
            
            // Subtle rotation constraints
            const rx = (py - 0.5) * -15; // Limit to 15deg
            const ry = (px - 0.5) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

/* ----------------------------------------------------------------- */
/* 12. GUIDED MEDITATION AUDIO TRACKS MANAGER */
/* ----------------------------------------------------------------- */
let activeMedAudio = null;
let activeMedTrigger = null;

function initMeditationAudio() {
    const triggers = document.querySelectorAll(".med-audio-trigger");
    
    triggers.forEach(btn => {
        const url = btn.getAttribute("data-audio-src");
        const card = btn.closest(".meditation-card");
        const progressBar = card.querySelector(".progress-bar-fill");
        
        btn.addEventListener("click", () => {
            // Stop active track if playing another track
            if (activeMedAudio && activeMedTrigger !== btn) {
                activeMedAudio.pause();
                activeMedTrigger.innerHTML = '<i data-lucide="play"></i>';
                activeMedAudio = null;
                activeMedTrigger = null;
            }
            
            if (!activeMedAudio) {
                activeMedAudio = new Audio(url);
                activeMedAudio.play().then(() => {
                    btn.innerHTML = '<i data-lucide="pause"></i>';
                    activeMedTrigger = btn;
                    lucide.createIcons();
                }).catch(err => {
                    console.error("Audio playback blocked by browser security.", err);
                    alert("Audio blocked by browser. Interact with page first then click play.");
                });
                
                // Track progress
                activeMedAudio.addEventListener("timeupdate", () => {
                    if (activeMedAudio && activeMedAudio.duration) {
                        const percent = (activeMedAudio.currentTime / activeMedAudio.duration) * 100;
                        progressBar.style.width = `${percent}%`;
                    }
                });
                
                // Track end
                activeMedAudio.addEventListener("ended", () => {
                    progressBar.style.width = "0%";
                    btn.innerHTML = '<i data-lucide="play"></i>';
                    activeMedAudio = null;
                    activeMedTrigger = null;
                    lucide.createIcons();
                    
                    // Increment meditation minutes
                    updateMeditationMins(10);
                    unlockBadge("badge-zen-master");
                });
            } else {
                activeMedAudio.pause();
                btn.innerHTML = '<i data-lucide="play"></i>';
                activeMedAudio = null;
                activeMedTrigger = null;
                lucide.createIcons();
            }
        });
    });
}

/* ----------------------------------------------------------------- */
/* 13. QUICK ZEN MEDIA SEARCH REDIRECTS (YOUTUBE & SPOTIFY) */
/* ----------------------------------------------------------------- */
function initMindTabSearch() {
    const searchInput = document.getElementById("mind-media-search-input");
    const ytBtn = document.getElementById("mind-search-youtube-btn");
    const spotBtn = document.getElementById("mind-search-spotify-btn");
    
    if (!ytBtn || !spotBtn || !searchInput) return;
    
    function handleSearch(platform) {
        let query = searchInput.value.trim();
        if (!query) {
            query = platform === "youtube" ? "guided healing yoga session" : "peaceful zen meditation music";
        }
        
        let targetUrl = "";
        if (platform === "youtube") {
            targetUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        } else if (platform === "spotify") {
            targetUrl = `https://open.spotify.com/search/${encodeURIComponent(query)}`;
        }
        
        if (targetUrl) {
            window.open(targetUrl, "_blank");
        }
    }
    
    ytBtn.addEventListener("click", () => handleSearch("youtube"));
    spotBtn.addEventListener("click", () => handleSearch("spotify"));
    
    // Support enter key on input field
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSearch("youtube");
        }
    });
}

/* ----------------------------------------------------------------- */
/* 14. DYNAMIC DAILY SELF-CARE TIPS */
/* ----------------------------------------------------------------- */
function initMentalTips() {
    const tipText = document.getElementById("daily-tip-text");
    const nextBtn = document.getElementById("next-tip-btn");
    if (!tipText || !nextBtn) return;

    const mentalTips = [
        "Take 5 slow, deep breaths. Inhale for 4 seconds, hold for 4, and exhale for 4 to instantly calm your body.",
        "Drink a warm glass of water or chamomile tea and step away from all electronic screens for 10 minutes.",
        "Practice mindfulness: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
        "Write down three things you are genuinely grateful for today, no matter how small they seem.",
        "Give yourself permission to say 'no' to commitments that overwhelm your mental energy today.",
        "Step outside or look out the window for 5 minutes. Let your eyes focus on distant greenery or the sky.",
        "Gently stretch your neck, shoulders, and back to release physical stress stored in your muscles.",
        "Acknowledge your thoughts without judging them. It is okay to feel tired, anxious, or overwhelmed.",
        "Listen to a favorite uplifting song or nature frequency loop for a quick mood reset.",
        "Reach out and send a simple check-in text to a trusted friend or family member."
    ];

    let currentIdx = 0;

    nextBtn.addEventListener("click", () => {
        let newIdx;
        do {
            newIdx = Math.floor(Math.random() * mentalTips.length);
        } while (newIdx === currentIdx);
        
        currentIdx = newIdx;
        
        tipText.style.opacity = "0";
        tipText.style.transform = "translateY(5px)";
        tipText.style.transition = "all 0.25s ease";
        
        setTimeout(() => {
            tipText.textContent = mentalTips[currentIdx];
            tipText.style.opacity = "1";
            tipText.style.transform = "translateY(0)";
        }, 250);
        
        const icon = nextBtn.querySelector("i");
        if (icon) {
            icon.style.transform = "rotate(360deg)";
            icon.style.transition = "transform 0.5s ease";
            setTimeout(() => { 
                icon.style.transform = "none"; 
                icon.style.transition = "none";
            }, 500);
        }
    });
}

function initSplashPage() {
    const splashLanding = document.getElementById("splash-landing");
    const scrollIndicator = document.getElementById("splash-scroll-indicator");
    const bgMusic = document.getElementById("bg-audio-music");
    const bgMusicBtn = document.getElementById("bg-music-toggle-btn");
    const bgMusicIcon = document.getElementById("bg-music-icon");
    
    // Prevent browser from restoring scroll position on reload to guarantee starting at splash screen
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    const scrollToApp = () => {
        const appShell = document.getElementById("app-shell");
        if (appShell) {
            appShell.scrollIntoView({ behavior: 'smooth' });
        }
        // Autoplay background music once user clicks/interacts to enter the dashboard
        if (bgMusic && bgMusic.paused) {
            bgMusic.volume = 0.25; // Peaceful, quiet volume
            bgMusic.play().catch(err => console.log("Audio play blocked by browser:", err));
        }
    };
    
    if (splashLanding) {
        splashLanding.addEventListener("click", scrollToApp);
    }
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", (e) => {
            e.stopPropagation();
            scrollToApp();
        });
    }
    
    // Sound Toggle in Header
    if (bgMusicBtn && bgMusic) {
        bgMusicBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Stop scrolling on header button click
            if (bgMusic.paused) {
                bgMusic.play();
                bgMusicIcon.setAttribute("data-lucide", "volume-2");
                bgMusicBtn.style.color = "var(--primary-cyan)";
            } else {
                bgMusic.pause();
                bgMusicIcon.setAttribute("data-lucide", "volume-x");
                bgMusicBtn.style.color = "var(--text-muted)";
            }
            lucide.createIcons();
        });
    }
    
    // Ensure we start at the top on initial load
    window.scrollTo(0, 0);
}

