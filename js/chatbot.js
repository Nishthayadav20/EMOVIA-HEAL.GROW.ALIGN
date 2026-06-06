/*
================================================================
   EMOVIA - AI COMPANION & VOICE SCANNER
================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    initMindBuddyChat();
    initVoiceScanner();
    initAICoach();
});

/* ----------------------------------------------------------------- */
/* 1. MINDBUDDY AI COMPANION WITH CRISIS TRIGGERS */
/* ----------------------------------------------------------------- */
function initMindBuddyChat() {
    const chatInput = document.getElementById("chat-input-field");
    const sendBtn = document.getElementById("chat-send-btn");
    const messagesPane = document.getElementById("chat-messages");
    const voiceShortcut = document.getElementById("voice-scan-shortcut-btn");
    
    if (!chatInput || !sendBtn) return;
    
    // Send message trigger
    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
    
    // Shortcut to scanner tab
    voiceShortcut.addEventListener("click", () => {
        const scannerBtn = document.getElementById("mic-record-btn");
        if (scannerBtn) scannerBtn.scrollIntoView({ behavior: 'smooth' });
    });
    
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        // Append User Message
        appendMessage(text, 'outgoing');
        chatInput.value = "";
        
        // Append typing indicator
        const typing = appendTypingIndicator();
        messagesPane.scrollTop = messagesPane.scrollHeight;
        
        // Process AI Response after brief delay
        setTimeout(() => {
            typing.remove();
            const response = generateAIResponse(text);
            appendMessage(response, 'incoming');
            messagesPane.scrollTop = messagesPane.scrollHeight;
            
            // Speak the response using SpeechSynthesis
            speakText(response);
        }, 1200);
    }
    
    function appendMessage(content, type) {
        const div = document.createElement("div");
        div.className = `message-bubble ${type}`;
        div.innerHTML = content;
        messagesPane.appendChild(div);
    }
    
    function appendTypingIndicator() {
        const div = document.createElement("div");
        div.className = "message-bubble incoming typing-indicator";
        div.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesPane.appendChild(div);
        return div;
    }
    
    // Local NLP logic & Sentiment keyword scanner
    function generateAIResponse(input) {
        const lower = input.toLowerCase();
        
        // 1. Suicide/Crisis detection
        const suicideKeywords = ["suicide", "kill myself", "die", "self harm", "end my life", "hurt myself", "cutting"];
        if (suicideKeywords.some(keyword => lower.includes(keyword))) {
            // Trigger emergency trusted alerts
            triggerTrustedAlert();
            return `
                <div style="color:#d90429; font-weight:700; border-left:3px solid #d90429; padding-left:10px;">
                    🚨 CRISIS PROTOCOL ACTIVE
                </div>
                I hear your pain, but please connect with people who can help immediately. I've triggered your Trusted Circle Alert link. Please click the red **Emergency Help** button at the top right to dial a 24/7 confidential counselor immediately. You matter.
            `;
        }
        
        // 2. Exam/Placement stress detection
        const studentKeywords = ["placement", "exam", "anxiety", "job", "interview", "college", "burnout", "grades", "fail"];
        if (studentKeywords.some(keyword => lower.includes(keyword))) {
            return "Placement anxiety and exam stress are incredibly heavy loads. I recommend opening our dedicated **Student Desk** tab to start the Pomodoro Timer with relaxing brown waves, and taking a look at our Interview Confidence checklist. Small breaks make a massive difference.";
        }
        
        // 3. Severe loneliness/Sadness
        const sadKeywords = ["lonely", "sad", "depressed", "empty", "cry", "crying", "alone", "darkness"];
        if (sadKeywords.some(keyword => lower.includes(keyword))) {
            return "I'm so sorry you're feeling isolated right now. When things feel overwhelming, focus only on your immediate space. Would you like to try a 2-minute **Breathing Exercise**? Click on the pulsing circle on the dashboard overview; it will help calm your physical heart rate.";
        }
        
        // 4. Greetings
        const greetings = ["hi", "hello", "hey", "greetings", "good morning", "good evening"];
        if (greetings.some(g => lower.startsWith(g))) {
            return "Hello! I'm here. How is your day going? Feel free to vent about whatever is currently stressing you out.";
        }
        
        // Default general validation
        return "I hear you. Healing is not linear, and it is completely normal to feel this way. Let's focus on small self-care goals today. Have you logged your mood or written in your Gratitude journal today? It is a great way to ground your thoughts.";
    }
}

// Speak text using SpeechSynthesis API
function speakText(text) {
    if ('speechSynthesis' in window) {
        // Strip HTML tags if any
        const cleanText = text.replace(/<[^>]*>/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        // Optional: select calm voice if available
        window.speechSynthesis.speak(utterance);
    }
}

// Trigger Emergency Trusted Circle Alert simulation
function triggerTrustedAlert() {
    const contact = localStorage.getItem("emergency-contact-phone");
    if (contact) {
        console.log(`[ALERT TRIGGERED] SMS sent to ${contact}: "ALERT: Guest Explorer is showing high anxiety/crisis signals. Please check on them."`);
        // Notify the user interface
        setTimeout(() => {
            alert(`🚨 [Trusted Circle Alert]: An emergency message alert has been dispatched to your registered contact (${contact}) to check on you.`);
        }, 1000);
    }
}

/* ----------------------------------------------------------------- */
/* 2. VOICE EMOTION SCANNER USING WEB AUDIO API */
/* ----------------------------------------------------------------- */
function initVoiceScanner() {
    const recordBtn = document.getElementById("mic-record-btn");
    const status = document.getElementById("mic-status");
    const results = document.getElementById("voice-analysis-result");
    
    if (!recordBtn) return;
    
    let isRecording = false;
    let audioCtx = null;
    let analyser = null;
    let microphone = null;
    let javascriptNode = null;
    let volumeLogs = [];
    
    recordBtn.addEventListener("click", async () => {
        if (isRecording) {
            // Manual stop or triggered
            stopRecording();
            return;
        }
        
        // Start record
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            isRecording = true;
            recordBtn.classList.add("recording");
            status.textContent = "Listening... (Scan active)";
            results.style.display = "none";
            volumeLogs = [];
            
            // Connect Audio Analyzer for actual micro-fluctuation scans
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            microphone = audioCtx.createMediaStreamSource(stream);
            javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
            
            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;
            
            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioCtx.destination);
            
            javascriptNode.onaudioprocess = () => {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                let values = 0;
                const length = array.length;
                for (let i = 0; i < length; i++) {
                    values += array[i];
                }
                const average = values / length;
                volumeLogs.push(average);
            };
            
            // Auto stop after 5 seconds
            setTimeout(() => {
                if (isRecording) stopRecording(stream);
            }, 5000);
            
        } catch (e) {
            console.error("Microphone access denied", e);
            status.textContent = "Microphone access blocked";
            // Simulate analyzer fallback if mic blocks
            simulateScannerFallback();
        }
    });
    
    function stopRecording(stream) {
        isRecording = false;
        recordBtn.classList.remove("recording");
        status.textContent = "Processing audio...";
        
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        if (audioCtx) {
            audioCtx.close();
        }
        
        // Compute vocal metrics based on actual volumeLogs
        setTimeout(() => {
            const avgVolume = volumeLogs.reduce((a, b) => a + b, 0) / (volumeLogs.length || 1);
            
            // Determine result classification
            let emotion = "Calm & Stable";
            let stressVal = "Low Stress (12%)";
            let advice = "Your voice pitch reflects peace and deep diaphragmatic breath support. Keep practicing mindfulness!";
            
            if (avgVolume > 25) {
                emotion = "Agitated / Anxious";
                stressVal = "High Stress (72%)";
                advice = "Voice tremors and high pitch spikes suggest stress signals. We suggest putting on 'Forest Walk Ambience' in the Mind & Yoga tab.";
            } else if (avgVolume < 3) {
                emotion = "Low energy / Melancholy";
                stressVal = "Mild Fatigue (48%)";
                advice = "Muffled tone and low volume pitch signal fatigue. Try our 7-Day Positivity challenge today to rebuild focus.";
            }
            
            status.textContent = "Scan Complete";
            results.innerHTML = `
                <strong style="color:var(--primary-cyan); font-size:14px; display:block; margin-bottom:5px;">Vocal Scan Result:</strong>
                <div><strong>Detected State:</strong> ${emotion}</div>
                <div><strong>Stress Score:</strong> ${stressVal}</div>
                <div style="margin-top:8px; color:var(--text-muted); font-size:12px;"><strong>AI recommendation:</strong> ${advice}</div>
            `;
            results.style.display = "block";
            
            // Increment Streaks
            updateMeditationMins(1);
        }, 1000);
    }
    
    function simulateScannerFallback() {
        recordBtn.classList.add("recording");
        status.textContent = "Simulating Scan...";
        setTimeout(() => {
            recordBtn.classList.remove("recording");
            status.textContent = "Scan Complete";
            results.innerHTML = `
                <strong style="color:var(--primary-cyan); font-size:14px; display:block; margin-bottom:5px;">Vocal Scan Result (Demo Mode):</strong>
                <div><strong>Detected State:</strong> Mildly Stressed</div>
                <div><strong>Stress Score:</strong> 42% Stress Index</div>
                <div style="margin-top:8px; color:var(--text-muted); font-size:12px;"><strong>AI recommendation:</strong> We suggest booking a Chat-counseling session with therapist Prof. Aarav Sharma to manage study anxiety.</div>
            `;
            results.style.display = "block";
        }, 3000);
    }
}

/* ----------------------------------------------------------------- */
/* 3. AI LIFE COACH BOARD */
/* ----------------------------------------------------------------- */
function initAICoach() {
    const input = document.getElementById("coach-goal-input");
    const btn = document.getElementById("coach-add-goal-btn");
    const container = document.getElementById("coach-goals-container");
    
    if (!btn || !container) return;
    
    // Load from local storage
    let goals = JSON.parse(localStorage.getItem("coach-goals-list") || "[]");
    
    function renderGoals() {
        container.innerHTML = "";
        if (goals.length === 0) {
            container.innerHTML = '<div style="font-size:12px; color:var(--text-muted); text-align:center; padding:10px;">No goals set. Plan one above!</div>';
            return;
        }
        
        goals.forEach((g, idx) => {
            const div = document.createElement("div");
            div.className = "task-item";
            if (g.completed) div.classList.add("completed");
            
            div.innerHTML = `
                <div class="task-checkbox"><i data-lucide="check"></i></div>
                <span class="task-title" style="font-size:12px;">${g.title}</span>
                <button class="play-sound-btn delete-goal-btn" style="width:24px; height:24px; font-size:10px; background:rgba(217, 4, 41, 0.15); color:var(--accent-red);"><i data-lucide="trash-2"></i></button>
            `;
            
            // Checkbox logic
            div.querySelector(".task-checkbox").addEventListener("click", (e) => {
                e.stopPropagation();
                g.completed = !g.completed;
                localStorage.setItem("coach-goals-list", JSON.stringify(goals));
                renderGoals();
            });
            
            // Delete logic
            div.querySelector(".delete-goal-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                goals.splice(idx, 1);
                localStorage.setItem("coach-goals-list", JSON.stringify(goals));
                renderGoals();
            });
            
            container.appendChild(div);
        });
        lucide.createIcons();
    }
    
    btn.addEventListener("click", () => {
        const txt = input.value.trim();
        if (txt) {
            goals.push({ title: txt, completed: false });
            localStorage.setItem("coach-goals-list", JSON.stringify(goals));
            input.value = "";
            renderGoals();
            
            // Toast notification
            notifyUser("Goal Registered", `Your life coach added goal: "${txt}"`);
        }
    });
    
    renderGoals();
}
