/*
================================================================
   EMOVIA - DIAGNOSTIC SCREENING TESTS (PHQ-9 & GAD-7)
================================================================
*/

const gad7Questions = [
    "Feeling nervous, anxious, or on edge?",
    "Not being able to stop or control worrying?",
    "Worrying too much about different things?",
    "Trouble relaxing?",
    "Being so restless that it is hard to sit still?",
    "Becoming easily annoyed or irritable?",
    "Feeling afraid, as if something awful might happen?"
];

const phq9Questions = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself, or that you are a failure?",
    "Trouble concentrating on things, like reading or studying?",
    "Moving or speaking so slowly that other people noticed?",
    "Thoughts that you would be better off dead, or hurting yourself?"
];

const options = [
    { text: "Not at all", val: 0 },
    { text: "Several days", val: 1 },
    { text: "More than half the days", val: 2 },
    { text: "Nearly every day", val: 3 }
];

let activeQuiz = "GAD-7";
let currentQIdx = 0;
let userAnswers = [];

document.addEventListener("DOMContentLoaded", () => {
    initDiagnostics();
});

/* ----------------------------------------------------------------- */
/* 1. QUIZ CONTROLLER ENGINE */
/* ----------------------------------------------------------------- */
function initDiagnostics() {
    const gad7Toggle = document.getElementById("toggle-gad7-btn");
    const phq9Toggle = document.getElementById("toggle-phq9-btn");
    
    if (!gad7Toggle || !phq9Toggle) return;
    
    gad7Toggle.addEventListener("click", () => {
        switchQuiz("GAD-7");
        gad7Toggle.style.borderColor = "var(--primary-cyan)";
        phq9Toggle.style.borderColor = "var(--glass-border)";
    });
    
    phq9Toggle.addEventListener("click", () => {
        switchQuiz("PHQ-9");
        phq9Toggle.style.borderColor = "var(--primary-cyan)";
        gad7Toggle.style.borderColor = "var(--glass-border)";
    });
    
    // Initial start
    startQuiz();
    renderHistory();
}

function switchQuiz(type) {
    activeQuiz = type;
    startQuiz();
}

function startQuiz() {
    currentQIdx = 0;
    userAnswers = [];
    
    const matchDiv = document.getElementById("assessment-match-result");
    if (matchDiv) {
        matchDiv.style.display = "none";
    }
    
    renderQuestion();
}

function renderQuestion() {
    const container = document.getElementById("diagnostic-quiz-box");
    const fill = document.getElementById("quiz-progress-fill");
    
    if (!container) return;
    
    const questions = activeQuiz === "GAD-7" ? gad7Questions : phq9Questions;
    const totalQ = questions.length;
    
    // Update progress bar
    const progressPercent = (currentQIdx / totalQ) * 100;
    fill.style.width = `${progressPercent}%`;
    
    if (currentQIdx >= totalQ) {
        evaluateQuizResults(questions);
        return;
    }
    
    container.innerHTML = `
        <div class="quiz-q-wrap" style="animation: popBubble 0.4s ease;">
            <span style="font-size:11px; text-transform:uppercase; color:var(--text-muted);">Question ${currentQIdx + 1} of ${totalQ}</span>
            <h3 style="font-size:16px; font-weight:600; margin-bottom:15px; line-height:1.4;">${questions[currentQIdx]}</h3>
            <div class="quiz-options-list">
                ${options.map((opt, i) => `
                    <button class="quiz-option-btn" data-val="${opt.val}">${opt.text}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add click listeners to option buttons
    const btns = container.querySelectorAll(".quiz-option-btn");
    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            const val = parseInt(btn.getAttribute("data-val"));
            userAnswers.push(val);
            currentQIdx++;
            
            // Subtle transition delay for 3D card swap feel
            btn.style.background = "var(--primary-cyan)";
            btn.style.color = "var(--bg-base)";
            
            setTimeout(renderQuestion, 200);
        });
    });
}

/* ----------------------------------------------------------------- */
/* 2. RESULTS DIAGNOSTIC CALCULATION */
/* ----------------------------------------------------------------- */
function evaluateQuizResults(questions) {
    const container = document.getElementById("diagnostic-quiz-box");
    const fill = document.getElementById("quiz-progress-fill");
    
    fill.style.width = "100%";
    
    const totalScore = userAnswers.reduce((a, b) => a + b, 0);
    const maxPossible = questions.length * 3;
    
    // Classify severity GAD-7 or PHQ-9 standard thresholds
    let severity = "Minimal Stress";
    let color = "var(--primary-cyan)";
    let advice = "You are maintaining excellent emotional health bounds. Keep practicing basic breathing exercises.";
    
    // PHQ-9 self-harm checks (suicide risk prevention)
    if (activeQuiz === "PHQ-9" && userAnswers[8] > 0) {
        triggerTrustedAlert(); // dispatch emergency alert triggers
    }
    
    if (activeQuiz === "GAD-7") {
        if (totalScore >= 15) {
            severity = "Severe Anxiety Alarm";
            color = "var(--accent-red)";
            advice = "Clinical threshold flagged. We suggest booking a confidential consult with counselor Dr. Vikram Sen immediately.";
        } else if (totalScore >= 10) {
            severity = "Moderate Anxiety";
            color = "var(--accent-orange)";
            advice = "Anxiety levels are compressed. Practice the Pomodoro relaxation timers and seek guidance.";
        } else if (totalScore >= 5) {
            severity = "Mild Anxiety";
            color = "#ffd700";
            advice = "Mild anxiety detected. Utilize the virtual safe space sound mixers to relax.";
        }
    } else {
        // PHQ-9
        if (totalScore >= 20) {
            severity = "Severe Depression Hazard";
            color = "var(--accent-red)";
            advice = "Severe parameters logged. Please click our red Emergency helpline buttons to speak with a counselor immediately.";
        } else if (totalScore >= 15) {
            severity = "Moderately Severe Depression";
            color = "var(--accent-red)";
            advice = "Substantial fatigue flagged. Consider scheduling a session with Prof. Aarav Sharma.";
        } else if (totalScore >= 10) {
            severity = "Moderate Depression";
            color = "var(--accent-orange)";
            advice = "Symptoms reflect low energy blocks. Daily gratitude journal logging is highly recommended.";
        } else if (totalScore >= 5) {
            severity = "Mild Depression";
            color = "#ffd700";
            advice = "Mild parameters scanned. Standard mood adjustments recommended.";
        }
    }
    
    container.innerHTML = `
        <div style="text-align:center; padding:20px; animation: popBubble 0.5s ease;">
            <div style="font-size:44px; font-weight:800; color:${color}; margin-bottom:10px;">${totalScore}</div>
            <strong style="font-size:16px; color:${color}; text-transform:uppercase; letter-spacing:1px;">${severity}</strong>
            <p style="font-size:13px; color:var(--text-muted); margin: 15px 0; line-height:1.4;">${advice}</p>
            <button class="gradient-btn" id="restart-quiz-btn" style="padding:10px 20px; font-size:13px; margin-top:10px;">Retake Test</button>
        </div>
    `;
    
    document.getElementById("restart-quiz-btn").addEventListener("click", startQuiz);
    
    // Save to diagnostic history logs
    saveDiagnostic(activeQuiz, totalScore, severity);
    
    // Intake Therapist Matching suggestion calculation
    let matchName = "Dr. Meera Deshmukh";
    let matchPct = 82;
    if (activeQuiz === "GAD-7") {
        if (totalScore >= 10) {
            matchName = "Prof. Aarav Sharma";
            matchPct = 90 + Math.floor(Math.random() * 9);
        } else {
            matchName = "Dr. Meera Deshmukh";
            matchPct = 78 + Math.floor(Math.random() * 8);
        }
    } else {
        if (totalScore >= 12) {
            matchName = "Dr. Vikram Sen";
            matchPct = 92 + Math.floor(Math.random() * 7);
        } else {
            matchName = "Dr. Meera Deshmukh";
            matchPct = 80 + Math.floor(Math.random() * 9);
        }
    }
    showTherapistMatchingResult(matchName, matchPct);
    
    // Toast notify
    notifyUser("Screening Complete", `Logged score of ${totalScore} for ${activeQuiz}`);
}

function showTherapistMatchingResult(matchedTherapistName, matchScore) {
    const matchDiv = document.getElementById("assessment-match-result");
    const cardContainer = document.getElementById("assessment-match-card-container");
    const matchText = document.getElementById("assessment-match-text");
    
    if (!matchDiv || !cardContainer) return;
    
    const therapist = (typeof therapists !== "undefined") ? therapists.find(t => t.name === matchedTherapistName) : null;
    
    if (therapist) {
        matchText.innerHTML = `Based on your diagnostic scores, we found a therapist specialized in your exact wellness needs. You have a <strong>${matchScore}% Match</strong>!`;
        
        cardContainer.innerHTML = `
            <div class="therapist-card glass-panel" style="padding:15px; border-radius:12px; border:1px solid rgba(0, 245, 212, 0.2); background:rgba(6,9,25,0.7); display:flex; flex-direction:column; gap:10px; margin-top:10px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${therapist.avatar}" alt="${therapist.name}" style="width:55px; height:55px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-cyan);">
                    <div>
                        <h4 style="font-size:14px; font-weight:700; color:white;">${therapist.name}</h4>
                        <div style="font-size:10.5px; color:var(--primary-cyan); margin-top:2px;">${therapist.specialty}</div>
                    </div>
                </div>
                <div style="font-size:11px; color:var(--text-muted); line-height:1.4;">${therapist.bio}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px; border-top:1px solid rgba(255,255,255,0.05); padding-top:10px;">
                    <span style="font-size:12px; font-weight:700; color:var(--primary-cyan);">${therapist.price || "₹199"}</span>
                    <button class="gradient-btn" id="book-matched-session-btn" style="padding:6px 12px; font-size:11px; border-radius:6px; cursor:pointer; border:none;">Book Matched Session</button>
                </div>
            </div>
        `;
        
        matchDiv.style.display = "block";
        
        document.getElementById("book-matched-session-btn").addEventListener("click", () => {
            if (typeof openBookingModal === "function") {
                openBookingModal(therapist);
            }
        });
    } else {
        matchDiv.style.display = "none";
    }
}

/* ----------------------------------------------------------------- */
/* 3. HISTORY TRACKER PERSISTENCE */
/* ----------------------------------------------------------------- */
function saveDiagnostic(type, score, result) {
    let history = JSON.parse(localStorage.getItem("diagnostic-screenings-history") || "[]");
    
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    history.unshift({
        type: type,
        score: score,
        result: result,
        date: dateStr
    });
    
    localStorage.setItem("diagnostic-screenings-history", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById("diagnostic-history-container");
    if (!container) return;
    
    let history = JSON.parse(localStorage.getItem("diagnostic-screenings-history") || "[]");
    
    if (history.length === 0) {
        container.innerHTML = '<div style="font-size:12px; color:var(--text-muted); text-align:center; padding:20px;">No tests taken yet. Log your first screening above.</div>';
        return;
    }
    
    container.innerHTML = "";
    
    // Render up to 4 past runs
    history.slice(0, 4).forEach((h, idx) => {
        const div = document.createElement("div");
        div.style.background = "rgba(255, 255, 255, 0.02)";
        div.style.border = "1px solid var(--glass-border)";
        div.style.padding = "10px 14px";
        div.style.borderRadius = "8px";
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        div.style.fontSize = "12px";
        
        let labelColor = "var(--primary-cyan)";
        if (h.score >= 15) labelColor = "var(--accent-red)";
        else if (h.score >= 10) labelColor = "var(--accent-orange)";
        
        div.innerHTML = `
            <div>
                <strong>${h.type} Test</strong>
                <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">Result: ${h.result}</div>
            </div>
            <div style="text-align:right;">
                <span style="font-weight:700; color:${labelColor}; font-size:14px;">Score: ${h.score}</span>
                <div style="font-size:9px; color:var(--text-muted); margin-top:2px;">${h.date}</div>
            </div>
        `;
        
        container.appendChild(div);
    });
}
