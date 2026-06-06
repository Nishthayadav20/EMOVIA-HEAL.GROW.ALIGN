/*
================================================================
   EMOVIA - JOURNAL & SENTIMENT ANALYZER
================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    initJournal();
    initGratitudeLog();
});

/* ----------------------------------------------------------------- */
/* 1. JOURNAL & SENTIMENT SCANNER */
/* ----------------------------------------------------------------- */
function initJournal() {
    const journalInput = document.getElementById("journal-input");
    const saveBtn = document.getElementById("save-journal-btn");
    const promptBtn = document.getElementById("journal-prompt-btn");
    const historyContainer = document.getElementById("journal-history-list");
    
    const scoreBadge = document.getElementById("sentiment-score-badge");
    const labelEl = document.getElementById("sentiment-label");
    const keywordsEl = document.getElementById("sentiment-keywords");
    const fillBar = document.getElementById("sentiment-bar-fill");
    const recommendEl = document.getElementById("sentiment-recommendation");
    
    if (!journalInput || !saveBtn) return;
    
    let entries = JSON.parse(localStorage.getItem("journal-entries-list") || "[]");
    
    // Journal Prompts Cycle
    const prompts = [
        "What is one thing that made you smile today, even briefly?",
        "Describe a boundary you set or wish you had set today.",
        "Write about a childhood memory that brings you comfort.",
        "If your current emotion was a weather condition, what would it be?",
        "What is currently taking up the most space in your head?",
        "Write down three things you are proud of yourself for accomplishing this week."
    ];
    
    promptBtn.addEventListener("click", () => {
        const rand = prompts[Math.floor(Math.random() * prompts.length)];
        journalInput.value = `[Prompt: ${rand}]\n\n`;
        journalInput.focus();
    });
    
    saveBtn.addEventListener("click", () => {
        const text = journalInput.value.trim();
        if (!text) return;
        
        // NLP Calculation
        const analysis = runSentimentAnalysis(text);
        
        // Check if user chose to share to public feed
        const shareCheckbox = document.getElementById("journal-public-share");
        const isPublic = shareCheckbox ? shareCheckbox.checked : false;
        
        if (isPublic) {
            let posts = JSON.parse(localStorage.getItem("anon-posts-board") || "[]");
            posts.unshift({
                id: Date.now(),
                text: `[Shared Journal Log] ${text}`,
                hearts: 0,
                liked: false,
                date: "Just now",
                comments: []
            });
            localStorage.setItem("anon-posts-board", JSON.stringify(posts));
            if (shareCheckbox) shareCheckbox.checked = false;
        }
        
        // Update UI panels
        scoreBadge.textContent = analysis.score.toFixed(1);
        labelEl.textContent = analysis.label;
        keywordsEl.textContent = analysis.keywords.join(", ") || "None detected";
        
        // Map -10 to 10 into 0% to 100%
        const percent = ((analysis.score + 10) / 20) * 100;
        fillBar.style.width = `${percent}%`;
        recommendEl.textContent = analysis.advice;
        
        // Save to logs
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
        const newEntry = {
            date: dateStr,
            text: text,
            score: analysis.score,
            label: analysis.label
        };
        
        entries.unshift(newEntry);
        localStorage.setItem("journal-entries-list", JSON.stringify(entries));
        
        journalInput.value = "";
        renderJournalHistory();
        
        // Unlock badge
        unlockBadge("badge-scribe");
        
        // Toast notification
        notifyUser("Journal Entry Saved", `AI analyzed entry sentiment: ${analysis.label}`);
    });
    
    function runSentimentAnalysis(str) {
        const lower = str.toLowerCase();
        
        // Sentiment Lexicon lists
        const posWords = ["happy", "excited", "good", "love", "joy", "peace", "calm", "grateful", "success", "accomplish", "proud", "smile", "laugh", "hope", "energized", "relaxed"];
        const negWords = ["sad", "stressed", "angry", "hate", "lonely", "depressed", "scared", "fear", "fail", "worry", "tired", "burnout", "exhausted", "cry", "pain", "heavy"];
        
        let score = 0;
        const matchedKeywords = [];
        
        posWords.forEach(w => {
            if (lower.includes(w)) {
                score += 1.5;
                if (!matchedKeywords.includes(w)) matchedKeywords.push(w);
            }
        });
        
        negWords.forEach(w => {
            if (lower.includes(w)) {
                score -= 1.5;
                if (!matchedKeywords.includes(w)) matchedKeywords.push(w);
            }
        });
        
        // Constrain score between -10.0 and +10.0
        score = Math.max(-10, Math.min(10, score));
        
        let label = "Neutral Focus";
        let advice = "Your entry reflects a steady balanced mindset. Writing consistently helps anchor thoughts.";
        
        if (score > 2) {
            label = "Optimistic / Joyful";
            advice = "Wonderful alignment! Reflect on what brought this positive outlook today to build long-term gratitude anchors.";
        } else if (score < -2) {
            label = "Distressed / Fatigue";
            advice = "We detected fatigue or stress in your writing. We recommend putting on the Binaural Sleep Theta waves or trying a deep 4-4-4 breathing cycle.";
        }
        
        return {
            score: score,
            label: label,
            keywords: matchedKeywords,
            advice: advice
        };
    }
    
    function renderJournalHistory() {
        historyContainer.innerHTML = "";
        if (entries.length === 0) {
            historyContainer.innerHTML = '<div style="font-size:12px; color:var(--text-muted); text-align:center; padding:20px;">Your private journals will appear here. Log your first check-in!</div>';
            return;
        }
        
        // Show up to 3 entries in preview
        entries.slice(0, 3).forEach((e, idx) => {
            const div = document.createElement("div");
            div.style.background = "rgba(255, 255, 255, 0.02)";
            div.style.border = "1px solid var(--glass-border)";
            div.style.padding = "15px";
            div.style.borderRadius = "12px";
            div.style.display = "flex";
            div.style.flexDirection = "column";
            div.style.gap = "8px";
            
            // Limit text preview size
            const previewText = e.text.length > 120 ? e.text.substring(0, 120) + "..." : e.text;
            
            // Score color helper
            let color = "var(--primary-cyan)";
            if (e.score < -2) color = "var(--accent-red)";
            else if (e.score < 2 && e.score > -2) color = "var(--text-muted)";
            
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:12px; color:var(--text-muted);"><i data-lucide="calendar"></i> ${e.date}</strong>
                    <span style="font-size:10px; font-weight:700; color:${color}; border:1px solid ${color}; padding:2px 8px; border-radius:20px;">
                        ${e.label}
                    </span>
                </div>
                <div style="font-size:13px; line-height:1.4; white-space:pre-wrap;">${previewText}</div>
                <button class="lang-select-btn delete-entry-btn" style="align-self:flex-end; padding:4px 10px; font-size:10px; border-color:rgba(217,4,41,0.2); color:var(--accent-red);">Delete</button>
            `;
            
            div.querySelector(".delete-entry-btn").addEventListener("click", () => {
                entries.splice(idx, 1);
                localStorage.setItem("journal-entries-list", JSON.stringify(entries));
                renderJournalHistory();
            });
            
            historyContainer.appendChild(div);
        });
        lucide.createIcons();
    }
    
    renderJournalHistory();
}

/* ----------------------------------------------------------------- */
/* 2. GRATITUDE LOG BOOK */
/* ----------------------------------------------------------------- */
function initGratitudeLog() {
    const input = document.getElementById("gratitude-input");
    const btn = document.getElementById("add-gratitude-btn");
    const container = document.getElementById("gratitude-history");
    
    if (!btn || !container) return;
    
    let logs = JSON.parse(localStorage.getItem("gratitude-logs-list") || "[]");
    
    function renderLogs() {
        container.innerHTML = "";
        if (logs.length === 0) {
            container.innerHTML = '<div style="font-size:11px; color:var(--text-muted); text-align:center; padding:10px;">No entries logged. Add something nice!</div>';
            return;
        }
        
        logs.forEach((item, idx) => {
            const div = document.createElement("div");
            div.className = "task-item";
            div.style.padding = "8px 12px";
            div.innerHTML = `
                <span style="color:var(--primary-cyan); font-size:14px;">🌟</span>
                <span class="task-title" style="font-size:12px; font-weight:500;">${item}</span>
                <button class="play-sound-btn delete-grat-btn" style="width:20px; height:20px; font-size:9px; background:rgba(255,255,255,0.05); border:none;"><i data-lucide="x"></i></button>
            `;
            
            div.querySelector(".delete-grat-btn").addEventListener("click", () => {
                logs.splice(idx, 1);
                localStorage.setItem("gratitude-logs-list", JSON.stringify(logs));
                renderLogs();
            });
            
            container.appendChild(div);
        });
        lucide.createIcons();
    }
    
    btn.addEventListener("click", () => {
        const text = input.value.trim();
        if (text) {
            logs.unshift(text);
            localStorage.setItem("gratitude-logs-list", JSON.stringify(logs));
            input.value = "";
            renderLogs();
            
            // Trigger 30-Day gratitude challenge checks if active
            const challengeBox = document.getElementById("challenge-gratitude");
            if (challengeBox && logs.length >= 3) {
                challengeBox.classList.add("completed");
                notifyUser("Challenge Action Completed", "You wrote 3 distinct entries in your gratitude book!");
            }
        }
    });
    
    renderLogs();
}
