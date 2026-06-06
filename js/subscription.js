/*
================================================================
   EMOVIA - SUBSCRIPTIONS & MULTILINGUAL TRANSLATION
================================================================
*/

const translations = {
    en: {
        "menu-overview": "Overview",
        "menu-companion": "AI Companion",
        "menu-journal": "Private Journal",
        "menu-bookings": "Therapy Desk",
        "menu-mind": "Mind & Yoga",
        "menu-student": "Student Desk",
        "menu-community": "Anonymous Circle",
        "menu-diagnostics": "Diagnostics",
        "menu-premium": "Upgrade to Zen",
        "btn-emergency": "Emergency Help",
        "metric-streak": "Streak Count",
        "metric-meditation": "Mindful Mins",
        "metric-mood": "Mood Index",
        "metric-badges": "Badges Unlocked",
        "mood-log-title": "How are you feeling right now?",
        "mood-log-sub": "Log your mood to see trends and personalized recommendations.",
        "mood-joy": "Joyful",
        "mood-calm": "Calm",
        "mood-neutral": "Neutral",
        "mood-anxious": "Anxious",
        "mood-low": "Low Energy",
        "analytics-title": "Emotional Analytics",
        "breathing-title": "Breathing Assistant",
        "breathing-desc": "Calm your nervous system instantly.",
        "roadmap-title": "Your Daily Wellness Roadmap",
        "roadmap-sub": "Complete these customized exercises based on your profile.",
        "safespace-title": "Virtual Safe Space Mixer",
        "safespace-sub": "Mix background nature loops to find your focus or sleep frequencies.",
        "badges-title": "Your Self-Care Badges"
    },
    hi: {
        "menu-overview": "अवलोकन",
        "menu-companion": "एआई साथी",
        "menu-journal": "निजी डायरी",
        "menu-bookings": "चिकित्सा डेस्क",
        "menu-mind": "मन और योग",
        "menu-student": "छात्र डेस्क",
        "menu-community": "अनाम मंडली",
        "menu-diagnostics": "निदान परीक्षण",
        "menu-premium": "ज़ेन में अपग्रेड करें",
        "btn-emergency": "आपातकालीन सहायता",
        "metric-streak": "दैनिक लकीर",
        "metric-meditation": "ध्यान समय",
        "metric-mood": "मनोदशा सूचकांक",
        "metric-badges": "अनलॉक बैज",
        "mood-log-title": "आप अभी कैसा महसूस कर रहे हैं?",
        "mood-log-sub": "प्रवृत्तियों और व्यक्तिगत अनुशंसाओं को देखने के लिए मनोदशा दर्ज करें।",
        "mood-joy": "आनंदित",
        "mood-calm": "शांत",
        "mood-neutral": "सामान्य",
        "mood-anxious": "चिंतित",
        "mood-low": "थका हुआ",
        "analytics-title": "भावना विश्लेषण चार्ट",
        "breathing-title": "श्वसन सहायक",
        "breathing-desc": "अपने तंत्रिका तंत्र को तुरंत शांत करें।",
        "roadmap-title": "दैनिक कल्याण रोडमैप",
        "roadmap-sub": "अपनी रूपरेखा के आधार पर इन कल्याण अभ्यासों को पूरा करें।",
        "safespace-title": "वर्चुअल शांत संगीत मिक्सर",
        "safespace-sub": "नींद और एकाग्रता के लिए प्राकृतिक ध्वनियों को आपस में मिलाएं।",
        "badges-title": "आपके कल्याण मेडल"
    },
    es: {
        "menu-overview": "Resumen",
        "menu-companion": "Compañero IA",
        "menu-journal": "Diario Privado",
        "menu-bookings": "Escritorio Terapia",
        "menu-mind": "Mente y Yoga",
        "menu-student": "Escritorio Estudiantil",
        "menu-community": "Círculo Anónimo",
        "menu-diagnostics": "Diagnósticos",
        "menu-premium": "Mejorar a Zen",
        "btn-emergency": "Ayuda Emergencia",
        "metric-streak": "Racha Diaria",
        "metric-meditation": "Minutos Atentos",
        "metric-mood": "Índice de Ánimo",
        "metric-badges": "Insignias Logradas",
        "mood-log-title": "¿Cómo te sientes ahora mismo?",
        "mood-log-sub": "Registra tu ánimo para ver tendencias y recomendaciones.",
        "mood-joy": "Alegre",
        "mood-calm": "Calmado",
        "mood-neutral": "Neutral",
        "mood-anxious": "Ansioso",
        "mood-low": "Cansado",
        "analytics-title": "Análisis Emocional",
        "breathing-title": "Asistente de Respiración",
        "breathing-desc": "Calma tu sistema nervioso al instante.",
        "roadmap-title": "Tu Mapa Diario de Bienestar",
        "roadmap-sub": "Completa estas tareas personalizadas para tu perfil.",
        "safespace-title": "Mezclador de Espacio Seguro",
        "safespace-sub": "Mezcla sonidos naturales para relajación o enfoque.",
        "badges-title": "Tus Insignias de Bienestar"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initSubscriptionCheckout();
    init3DCardFlipping();
    initLanguageSelector();
});

/* ----------------------------------------------------------------- */
/* 1. SUBSCRIPTION UPGRADE FLOWS */
/* ----------------------------------------------------------------- */
function initSubscriptionCheckout() {
    const modal = document.getElementById("checkout-form-modal");
    const backdrop = document.getElementById("app-modal-backdrop");
    const closeBtn = document.getElementById("close-checkout-modal-btn");
    const checkoutForm = document.getElementById("checkout-form-fields");
    
    const triggers = document.querySelectorAll(".subscribe-checkout-trigger");
    
    triggers.forEach(btn => {
        btn.addEventListener("click", () => {
            const plan = btn.getAttribute("data-plan");
            const price = btn.getAttribute("data-price");
            
            document.getElementById("checkout-plan-name").value = plan;
            document.getElementById("checkout-plan-price").value = price;
            
            modal.classList.add("active");
            backdrop.style.display = "block";
        });
    });
    
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        backdrop.style.display = "none";
    });
    
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const intent = localStorage.getItem("emovia-checkout-intent");
        
        if (intent && intent.startsWith("credit-")) {
            const addedCredits = parseInt(intent.split("-")[1]);
            let currentCredits = parseInt(localStorage.getItem("wellness-credits") || "0");
            currentCredits += addedCredits;
            localStorage.setItem("wellness-credits", currentCredits.toString());
            
            // Clean up intent
            localStorage.removeItem("emovia-checkout-intent");
            
            // Update wallet display
            if (typeof updateWalletDisplay === "function") {
                updateWalletDisplay();
            }
            
            // Close modal
            modal.classList.remove("active");
            backdrop.style.display = "none";
            
            notifyUser("Credits Added!", `Successfully processed payment. Added ${addedCredits} session credit${addedCredits > 1 ? 's' : ''} to your wellness wallet.`);
            return;
        }
        
        const plan = document.getElementById("checkout-plan-name").value;
        
        // Update User state
        EmoviaApp.user.isPremium = true;
        EmoviaApp.user.tier = `${plan} Plan`;
        
        // Sync user widgets
        const tierEl = document.getElementById("app-user-tier");
        const badgeEl = document.getElementById("app-premium-badge");
        
        if (tierEl) tierEl.textContent = EmoviaApp.user.tier;
        if (badgeEl) badgeEl.style.display = "flex";
        
        localStorage.setItem("emovia-user-object", JSON.stringify(EmoviaApp.user));
        
        // Close modal
        modal.classList.remove("active");
        backdrop.style.display = "none";
        
        // Notify
        notifyUser("Plan Upgraded!", `Welcome to ${plan}. All premium channels are unlocked.`);
        
        // Scroll back to Overview
        const overviewLink = document.querySelector('[data-target="overview-tab"]');
        if (overviewLink) overviewLink.click();
    });
}

/* ----------------------------------------------------------------- */
/* 2. 3D PHYSICAL CREDIT CARD FIELD SYNC & ROTATION */
/* ----------------------------------------------------------------- */
function init3DCardFlipping() {
    const cardBox = document.getElementById("credit-card-box");
    
    const nameInput = document.getElementById("cc-name-input");
    const numInput = document.getElementById("cc-num-input");
    const expiryInput = document.getElementById("cc-expiry-input");
    const cvvInput = document.getElementById("cc-cvv-input");
    
    const displayName = document.getElementById("cc-display-name");
    const displayNumber = document.getElementById("cc-display-number");
    const displayExpiry = document.getElementById("cc-display-expiry");
    const displayCvv = document.getElementById("cc-display-cvv");
    
    if (!cardBox || !cvvInput) return;
    
    // Rotate to back on CVV focus
    cvvInput.addEventListener("focus", () => {
        cardBox.classList.add("flipped");
    });
    
    // Rotate back to front on focus out / details focus
    [nameInput, numInput, expiryInput].forEach(inp => {
        inp.addEventListener("focus", () => {
            cardBox.classList.remove("flipped");
        });
    });
    
    // Sync Card Numbers formatted with spaces
    numInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, '');
        let formatted = val.match(/.{1,4}/g);
        if (formatted) {
            numInput.value = formatted.join(' ');
            displayNumber.textContent = formatted.join(' ');
        } else {
            displayNumber.textContent = "•••• •••• •••• ••••";
        }
    });
    
    // Sync Name
    nameInput.addEventListener("input", (e) => {
        displayName.textContent = e.target.value || "Guest User";
    });
    
    // Sync Expiration
    expiryInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 2) {
            expiryInput.value = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        displayExpiry.textContent = expiryInput.value || "MM/YY";
    });
    
    // Sync CVV
    cvvInput.addEventListener("input", (e) => {
        displayCvv.textContent = e.target.value || "•••";
    });
}

/* ----------------------------------------------------------------- */
/* 3. MULTILINGUAL SELECTOR ENGINE */
/* ----------------------------------------------------------------- */
function initLanguageSelector() {
    const btn = document.getElementById("lang-btn");
    const span = btn.querySelector("span");
    
    if (!btn) return;
    
    const langs = ["en", "hi", "es"];
    const langNames = { en: "English", hi: "हिन्दी", es: "Español" };
    let idx = 0;
    
    btn.addEventListener("click", () => {
        idx = (idx + 1) % langs.length;
        const currentLang = langs[idx];
        
        span.textContent = langNames[currentLang];
        EmoviaApp.activeLanguage = currentLang;
        
        // Translate all nodes
        translateDOM();
    });
}

function translateDOM() {
    const nodes = document.querySelectorAll(".lang-txt");
    const currentLang = EmoviaApp.activeLanguage;
    
    nodes.forEach(node => {
        const key = node.getAttribute("data-key");
        if (translations[currentLang] && translations[currentLang][key]) {
            node.textContent = translations[currentLang][key];
        }
    });
    
    // Dynamic welcome text adjustment
    const title = document.getElementById("welcome-title");
    const sub = document.getElementById("welcome-sub");
    
    if (currentLang === "hi") {
        if (title) title.textContent = "एमोविया आपका स्वागत करता है";
        if (sub) sub.textContent = "आइए आज आपके मानसिक स्वास्थ्य को प्राथमिकता दें।";
    } else if (currentLang === "es") {
        if (title) title.textContent = "Emovia te da la bienvenida";
        if (sub) sub.textContent = "Prioricemos tu bienestar emocional hoy.";
    } else {
        if (title) title.textContent = "Emovia welcomes you";
        if (sub) sub.textContent = "Let's prioritize your mental wellness today.";
    }
}
