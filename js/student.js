/*
================================================================
   EMOVIA - COLLEGE STUDENT SPECIAL DESK
================================================================
*/

let pomoTimeLeft = 25 * 60; // 25 minutes
let pomoTimer = null;
let isPomoRunning = false;

document.addEventListener("DOMContentLoaded", () => {
    initPomoTimer();
    initPlacementChecklist();
    initBurnoutCalculator();
    initCbtCourses();
});

/* ----------------------------------------------------------------- */
/* 1. EXAM ANXIETY POMODORO TIMER */
/* ----------------------------------------------------------------- */
function initPomoTimer() {
    const display = document.getElementById("pomo-timer-display");
    const startBtn = document.getElementById("pomo-start-btn");
    const resetBtn = document.getElementById("pomo-reset-btn");
    
    if (!display || !startBtn) return;
    
    function updateDisplay() {
        const mins = Math.floor(pomoTimeLeft / 60).toString().padStart(2, '0');
        const secs = (pomoTimeLeft % 60).toString().padStart(2, '0');
        display.textContent = `${mins}:${secs}`;
    }
    
    startBtn.addEventListener("click", () => {
        if (isPomoRunning) {
            // Pause
            clearInterval(pomoTimer);
            isPomoRunning = false;
            startBtn.textContent = "Resume Focus";
        } else {
            // Start
            isPomoRunning = true;
            startBtn.textContent = "Pause Timer";
            
            pomoTimer = setInterval(() => {
                pomoTimeLeft--;
                updateDisplay();
                
                if (pomoTimeLeft <= 0) {
                    clearInterval(pomoTimer);
                    isPomoRunning = false;
                    startBtn.textContent = "Start Focus";
                    pomoTimeLeft = 5 * 60; // 5 mins break default
                    updateDisplay();
                    
                    // Alert User
                    alert("Focus block completed! Let's take a 5-minute deep exhalation to release exam anxiety.");
                    notifyUser("Pomodoro Complete", "Focus session complete. Enjoy your 5 min rest.");
                    
                    // Switch to Breathing panel tab automatically
                    const breathTab = document.querySelector('[data-target="overview-tab"]');
                    if (breathTab) breathTab.click();
                }
            }, 1000);
        }
    });
    
    resetBtn.addEventListener("click", () => {
        clearInterval(pomoTimer);
        isPomoRunning = false;
        pomoTimeLeft = 25 * 60;
        startBtn.textContent = "Start Focus";
        updateDisplay();
    });
}

/* ----------------------------------------------------------------- */
/* 2. PLACEMENT ANXIETY CHECKS */
/* ----------------------------------------------------------------- */
function initPlacementChecklist() {
    const items = document.querySelectorAll("#placement-checklist .task-item");
    
    items.forEach(item => {
        const id = item.getAttribute("data-id");
        
        // Sync local storage checks
        const done = localStorage.getItem(`placement-check-${id}`) === 'true';
        if (done) item.classList.add("completed");
        
        item.addEventListener("click", () => {
            const status = item.classList.toggle("completed");
            localStorage.setItem(`placement-check-${id}`, status ? 'true' : 'false');
            
            if (status) {
                updateStreakCount(1);
            }
        });
    });
}

/* ----------------------------------------------------------------- */
/* 3. ACADEMIC BURNOUT CALCULATOR */
/* ----------------------------------------------------------------- */
function initBurnoutCalculator() {
    const calcBtn = document.getElementById("calc-burnout-btn");
    const resultBox = document.getElementById("burnout-result-box");
    
    if (!calcBtn) return;
    
    calcBtn.addEventListener("click", () => {
        const hours = parseFloat(document.getElementById("burnout-hours").value) || 0;
        const projects = parseFloat(document.getElementById("burnout-projects").value) || 0;
        const sleep = parseFloat(document.getElementById("burnout-sleep").value) || 10;
        
        // Compute Burnout Factor (arbitrary normalized algorithm)
        let strain = (hours * 0.4) + (projects * 2.5) - (sleep * 1.5);
        
        // Convert to percentage (0 - 100)
        let percent = Math.max(5, Math.min(98, Math.round((strain / 25) * 100)));
        
        // Classify Index
        let title = "Stable Workload";
        let color = "var(--accent-green)";
        let bg = "rgba(56, 176, 0, 0.08)";
        let border = "rgba(56, 176, 0, 0.25)";
        let advice = "Your semester parameters reflect an optimal balance. Ensure you maintain sleep thresholds.";
        
        if (percent > 65) {
            title = "Depression & Burnout Hazard!";
            color = "var(--accent-red)";
            bg = "rgba(217, 4, 41, 0.08)";
            border = "rgba(217, 4, 41, 0.25)";
            advice = "CRITICAL overload scanned. High study hours and low sleep are harming your neurological recovery. We recommend scheduling an advisory session with advisor Dr. Meera Deshmukh today.";
        } else if (percent > 35) {
            title = "Mild Academic Fatigue";
            color = "var(--accent-orange)";
            bg = "rgba(247, 127, 0, 0.08)";
            border = "rgba(247, 127, 0, 0.25)";
            advice = "Moderate strain levels. Academic loads are beginning to compress sleep quality. Make use of 5-minute Pomodoro breathing blocks regularly.";
        }
        
        resultBox.style.background = bg;
        resultBox.style.border = `1px solid ${border}`;
        resultBox.style.display = "block";
        
        resultBox.innerHTML = `
            <strong style="color:${color}; font-size:14px; display:block; margin-bottom:5px;">${title}</strong>
            <div><strong>Health Strain Index:</strong> ${percent}%</div>
            <p style="font-size:12px; color:var(--text-muted); margin-top:8px; line-height:1.4;">${advice}</p>
        `;
        
        // Unlock badge if critical burnout scanned
        if (percent > 65) {
            notifyUser("Burnout Risk Scanned", "Consider taking a break now.");
        }
    });
}

/* ----------------------------------------------------------------- */
/* 4. INTERACTIVE CBT SELF-HELP COURSES & BADGES (BetterLYF style) */
/* ----------------------------------------------------------------- */
function initCbtCourses() {
    const stepBtns = document.querySelectorAll(".cbt-step-btn");
    const modal = document.getElementById("cbt-exercise-modal");
    const closeBtn = document.getElementById("close-cbt-modal-btn");
    const backdrop = document.getElementById("app-modal-backdrop");
    const contentPane = document.getElementById("cbt-exercise-content-pane");
    const titleEl = document.getElementById("cbt-exercise-title");
    
    if (!stepBtns || !modal) return;
    
    // Update progress bars on load
    updateCbtProgress();
    
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        backdrop.style.display = "none";
    });
    
    stepBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const course = btn.getAttribute("data-course");
            const step = parseInt(btn.getAttribute("data-step"));
            openCbtExercise(course, step);
        });
    });

    function openCbtExercise(course, step) {
        modal.style.display = "flex";
        backdrop.style.display = "block";
        
        let contentHtml = "";
        
        if (course === "trap") {
            if (step === 1) {
                titleEl.textContent = "Module 1 - Step 1: Cognitive Distortions";
                contentHtml = `
                    <p style="font-size:12.5px; color:var(--text-muted); line-height:1.45;">
                        Cognitive distortions are biased ways of thinking that reinforce negative emotions. The most common ones include:
                        <br><br>
                        • <b>Catastrophizing:</b> Expecting the worst possible outcome.
                        <br>
                        • <b>All-or-Nothing:</b> Viewing things in black-and-white (e.g., "If I don't get this placement, I am a total failure").
                        <br>
                        • <b>Mind Reading:</b> Assuming others think negatively of you without evidence.
                    </p>
                    <div style="border-top:1px solid var(--glass-border); padding-top:15px; margin-top:5px;">
                        <h4 style="font-size:13px; font-weight:700; color:white; margin-bottom:10px;">Quick Check:</h4>
                        <p style="font-size:12.5px; margin-bottom:12px;">Which cognitive distortion involves expecting the absolute worst-case scenario?</p>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <button class="quiz-option-btn cbt-quiz-opt" data-correct="false" style="padding:10px 15px; font-size:12px; width:100%; border:1px solid var(--glass-border); border-radius:8px; color:white; text-align:left;">A. Mind Reading</button>
                            <button class="quiz-option-btn cbt-quiz-opt" data-correct="true" style="padding:10px 15px; font-size:12px; width:100%; border:1px solid var(--glass-border); border-radius:8px; color:white; text-align:left;">B. Catastrophizing</button>
                            <button class="quiz-option-btn cbt-quiz-opt" data-correct="false" style="padding:10px 15px; font-size:12px; width:100%; border:1px solid var(--glass-border); border-radius:8px; color:white; text-align:left;">C. Personalization</button>
                        </div>
                    </div>
                `;
            } else if (step === 2) {
                titleEl.textContent = "Module 1 - Step 2: Thought Record Log";
                contentHtml = `
                    <p style="font-size:12.5px; color:var(--text-muted); line-height:1.45;">
                        CBT thought records help you catch, challenge, and replace negative automatic thoughts with rational ones.
                    </p>
                    <div style="display:flex; flex-direction:column; gap:12px; margin-top:5px;">
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:12px; color:white;">1. What is the automatic negative thought?</label>
                            <textarea id="cbt-thought-input" class="form-input" placeholder="e.g. 'I will fail my exam and my career is ruined.'" style="height:60px; font-size:12px; resize:none; padding:10px; background:rgba(0,0,0,0.3); color:white;"></textarea>
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:12px; color:white;">2. What is the evidence supporting or challenging it?</label>
                            <textarea id="cbt-evidence-input" class="form-input" placeholder="e.g. 'I have studied and passed all mock tests. One exam is not my whole career.'" style="height:60px; font-size:12px; resize:none; padding:10px; background:rgba(0,0,0,0.3); color:white;"></textarea>
                        </div>
                        <button class="gradient-btn" id="submit-cbt-thought-btn" style="padding:10px; font-size:12px; border-radius:8px; border:none; margin-top:5px; cursor:pointer;">Log & Reframe Thought</button>
                    </div>
                `;
            }
        } else if (course === "reframing") {
            if (step === 1) {
                titleEl.textContent = "Module 2 - Step 1: Imposter Syndrome";
                contentHtml = `
                    <p style="font-size:12.5px; color:var(--text-muted); line-height:1.45;">
                        Imposter syndrome is the constant feeling that you are a fraud and do not deserve your achievements, despite clear evidence of success. It is highly prevalent in competitive academic and placement environments.
                    </p>
                    <div style="border-top:1px solid var(--glass-border); padding-top:15px; margin-top:5px;">
                        <h4 style="font-size:13px; font-weight:700; color:white; margin-bottom:10px;">Quick Check:</h4>
                        <p style="font-size:12.5px; margin-bottom:12px;">What percentage of students and professionals report experiencing imposter syndrome at some point?</p>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <button class="quiz-option-btn cbt-quiz-opt" data-correct="false" style="padding:10px 15px; font-size:12px; width:100%; border:1px solid var(--glass-border); border-radius:8px; color:white; text-align:left;">A. Only 10-15%</button>
                            <button class="quiz-option-btn cbt-quiz-opt" data-correct="true" style="padding:10px 15px; font-size:12px; width:100%; border:1px solid var(--glass-border); border-radius:8px; color:white; text-align:left;">B. Over 70%</button>
                            <button class="quiz-option-btn cbt-quiz-opt" data-correct="false" style="padding:10px 15px; font-size:12px; width:100%; border:1px solid var(--glass-border); border-radius:8px; color:white; text-align:left;">C. Close to 100%</button>
                        </div>
                    </div>
                `;
            } else if (step === 2) {
                titleEl.textContent = "Module 2 - Step 2: Rational Affirmation Loop";
                contentHtml = `
                    <p style="font-size:12.5px; color:var(--text-muted); line-height:1.45; margin-bottom:15px;">
                        Affirmations help rewire neural pathways by replacing anxious chatter with grounding declarations. Click to affirm each phrase:
                    </p>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button class="quiz-option-btn cbt-affirmation-opt" style="padding:12px 15px; font-size:12.5px; text-align:left; border:1px solid var(--glass-border); border-radius:8px; color:white; background:rgba(255,255,255,0.02); display:flex; align-items:center; width:100%;">
                            <i data-lucide="circle" style="width:14px; height:14px; color:var(--primary-cyan); margin-right:8px; flex-shrink:0;"></i>
                            <span>"My worth is not defined by external grades or placements."</span>
                        </button>
                        <button class="quiz-option-btn cbt-affirmation-opt" style="padding:12px 15px; font-size:12.5px; text-align:left; border:1px solid var(--glass-border); border-radius:8px; color:white; background:rgba(255,255,255,0.02); display:flex; align-items:center; width:100%;">
                            <i data-lucide="circle" style="width:14px; height:14px; color:var(--primary-cyan); margin-right:8px; flex-shrink:0;"></i>
                            <span>"I have studied well and have unique values to contribute."</span>
                        </button>
                        <button class="quiz-option-btn cbt-affirmation-opt" style="padding:12px 15px; font-size:12.5px; text-align:left; border:1px solid var(--glass-border); border-radius:8px; color:white; background:rgba(255,255,255,0.02); display:flex; align-items:center; width:100%;">
                            <i data-lucide="circle" style="width:14px; height:14px; color:var(--primary-cyan); margin-right:8px; flex-shrink:0;"></i>
                            <span>"Anxiety is a temporary visitor; my grounding remains intact."</span>
                        </button>
                        <button class="gradient-btn" id="finish-cbt-affirmation-btn" style="padding:10px; font-size:12px; border-radius:8px; border:none; margin-top:10px; cursor:pointer; display:none;">Complete Affirmation Practice</button>
                    </div>
                `;
            }
        }
        
        contentPane.innerHTML = contentHtml;
        lucide.createIcons();
        
        // Listeners for step 1 options (Quiz checks)
        const quizOpts = contentPane.querySelectorAll(".cbt-quiz-opt");
        quizOpts.forEach(opt => {
            opt.addEventListener("click", () => {
                const correct = opt.getAttribute("data-correct") === "true";
                if (correct) {
                    opt.style.background = "var(--accent-green)";
                    opt.style.color = "var(--bg-base)";
                    notifyUser("Correct!", "Great job understanding CBT core concepts.");
                    setTimeout(() => {
                        completeStep(course, step);
                        modal.style.display = "none";
                        backdrop.style.display = "none";
                    }, 800);
                } else {
                    opt.style.background = "var(--accent-red)";
                    opt.style.color = "white";
                    notifyUser("Incorrect Choice", "Think again and choose the correct option.");
                }
            });
        });
        
        // Listeners for step 2 thought records log
        const submitThoughtBtn = contentPane.querySelector("#submit-cbt-thought-btn");
        if (submitThoughtBtn) {
            submitThoughtBtn.addEventListener("click", () => {
                const thought = document.getElementById("cbt-thought-input").value.trim();
                const evidence = document.getElementById("cbt-evidence-input").value.trim();
                
                if (thought && evidence) {
                    notifyUser("Thought Reframed", "CBT log saved to your local session.");
                    completeStep(course, step);
                    modal.style.display = "none";
                    backdrop.style.display = "none";
                } else {
                    alert("Please fill in both fields to complete the CBT thought log.");
                }
            });
        }
        
        // Listeners for step 2 affirmations checks
        const affirmations = contentPane.querySelectorAll(".cbt-affirmation-opt");
        const finishAffirmationBtn = contentPane.querySelector("#finish-cbt-affirmation-btn");
        let affirmedCount = 0;
        
        affirmations.forEach(opt => {
            opt.addEventListener("click", () => {
                if (!opt.classList.contains("affirmed")) {
                    opt.classList.add("affirmed");
                    opt.style.borderColor = "var(--accent-green)";
                    opt.style.background = "rgba(56,176,0,0.06)";
                    
                    const icon = opt.querySelector("i");
                    if (icon) {
                        icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>'; // lucide check icon
                        icon.style.color = "var(--accent-green)";
                    }
                    
                    affirmedCount++;
                    if (affirmedCount === affirmations.length && finishAffirmationBtn) {
                        finishAffirmationBtn.style.display = "block";
                    }
                }
            });
        });
        
        if (finishAffirmationBtn) {
            finishAffirmationBtn.addEventListener("click", () => {
                completeStep(course, step);
                modal.style.display = "none";
                backdrop.style.display = "none";
            });
        }
    }
    
    function completeStep(course, step) {
        localStorage.setItem(`emovia-cbt-${course}-${step}`, "true");
        updateCbtProgress();
        if (typeof updateStreakCount === "function") {
            updateStreakCount(1);
        }
    }
    
    function updateCbtProgress() {
        const courses = ["trap", "reframing"];
        
        courses.forEach(c => {
            const step1Done = localStorage.getItem(`emovia-cbt-${c}-1`) === "true";
            const step2Done = localStorage.getItem(`emovia-cbt-${c}-2`) === "true";
            
            let completed = 0;
            if (step1Done) completed++;
            if (step2Done) completed++;
            
            // Update UI elements
            const node = document.querySelector(`.cbt-step-btn[data-course="${c}"][data-step="1"]`);
            if (node) {
                const parentNode = node.closest(".cbt-course-node");
                if (parentNode) {
                    const progressLbl = parentNode.querySelector(".cbt-progress-lbl");
                    const progressBar = parentNode.querySelector(".cbt-progress-bar");
                    
                    if (progressLbl) {
                        progressLbl.textContent = `${completed}/2 Steps`;
                    }
                    if (progressBar) {
                        progressBar.style.width = `${(completed / 2) * 100}%`;
                    }
                }
            }
            
            // Checkmark icons update
            const btn1 = document.querySelector(`.cbt-step-btn[data-course="${c}"][data-step="1"]`);
            const btn2 = document.querySelector(`.cbt-step-btn[data-course="${c}"][data-step="2"]`);
            
            if (btn1 && step1Done) {
                btn1.classList.add("completed");
                const icon = btn1.querySelector("i");
                if (icon) {
                    icon.style.color = "var(--accent-green)";
                    icon.setAttribute("data-lucide", "check-circle");
                }
            }
            if (btn2 && step2Done) {
                btn2.classList.add("completed");
                const icon = btn2.querySelector("i");
                if (icon) {
                    icon.style.color = "var(--accent-green)";
                    icon.setAttribute("data-lucide", "check-circle");
                }
            }
            
            // Trigger completion badge
            if (completed === 2 && !localStorage.getItem(`emovia-badge-cbt-${c}`)) {
                localStorage.setItem(`emovia-badge-cbt-${c}`, "true");
                notifyUser("Course Completed!", `You've finished Module: ${c === 'trap' ? 'Identifying Thought Traps' : 'Reframing Academic Stress'}`);
                
                // Add a custom badge in overview or increase badge count!
                let currentBadgeCount = parseInt(localStorage.getItem("badge-count") || "0");
                currentBadgeCount++;
                localStorage.setItem("badge-count", currentBadgeCount.toString());
                
                const valEl = document.getElementById("badge-count-val");
                if (valEl) valEl.textContent = currentBadgeCount;
            }
        });
        
        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    }
}
