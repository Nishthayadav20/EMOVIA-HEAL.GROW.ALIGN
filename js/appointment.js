/*
================================================================
   EMOVIA - APPOINTMENTS, GEOLOCATION, HAVERSINE & MAPS
================================================================
*/

// Mock Therapist Data with Base Offsets (aligned with BetterLYF and Happy Minds)
const therapists = [
    { 
        id: 1, 
        name: "Prof. Aarav Sharma", 
        specialty: "Placement Stress & Anxiety", 
        rating: "4.9 ★", 
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop", 
        bio: "Cognitive therapist specializing in placement anxiety and student confidence.", 
        experience: "8 Yrs Experience", 
        languages: "English, Hindi, Marathi", 
        price: "₹199 / session", 
        lat: 0, 
        lng: 0, 
        distance: "" 
    },
    { 
        id: 2, 
        name: "Dr. Meera Deshmukh", 
        specialty: "Academic Burnout & Fatigue", 
        rating: "4.8 ★", 
        avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=256&auto=format&fit=crop", 
        bio: "Mindfulness expert helping students recover from course overload stress.", 
        experience: "6 Yrs Experience", 
        languages: "English, Hindi, Bengali", 
        price: "₹199 / session", 
        lat: 0, 
        lng: 0, 
        distance: "" 
    },
    { 
        id: 3, 
        name: "Dr. Vikram Sen", 
        specialty: "Clinical Psychology & Trauma", 
        rating: "4.9 ★", 
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&auto=format&fit=crop", 
        bio: "A senior psychiatrist with 12+ years experience in managing panic disorders.", 
        experience: "12 Yrs Experience", 
        languages: "English, Hindi, Tamil", 
        price: "₹249 / session", 
        lat: 0, 
        lng: 0, 
        distance: "" 
    }
];

// Mock Wellness Centres with fixed absolute coordinates
const allCentres = [
    // Delhi / NCR
    { name: "Delhi Dhyana Kendra", type: "meditation", lat: 28.5989, lng: 77.2310, desc: "A peaceful sanctuary offering silent vipassana breathing groups." },
    { name: "Osho Meditation Mandir Delhi", type: "meditation", lat: 28.6419, lng: 77.1950, desc: "Dynamic active meditation classes and stress release activities." },
    { name: "Art of Living Ashram Noida", type: "meditation", lat: 28.5350, lng: 77.2950, desc: "Sudarshan Kriya rhythmic breathing guides and yoga streams." },
    { name: "Noida Zen Meditation Center", type: "meditation", lat: 28.5820, lng: 77.3580, desc: "Quiet zen contemplation chambers and weekend detox workshops." },
    { name: "Vipassana Dhamma Centre Delhi", type: "meditation", lat: 28.6050, lng: 77.1640, desc: "10-day silent meditation retreats and daily mindfulness sittings." },
    
    { name: "Prana Vinyasa Yoga Shala Noida", type: "yoga", lat: 28.6010, lng: 77.3380, desc: "Flowing vinyasa classes, pranayama, and hot yoga sessions." },
    { name: "Sivananda Yoga Vedanta Delhi", type: "yoga", lat: 28.5919, lng: 77.2510, desc: "Traditional hatha yoga, classical yoga philosophy, and chanting." },
    { name: "Isha Hatha Yoga Studio Delhi", type: "yoga", lat: 28.6589, lng: 77.1780, desc: "Authentic classical hatha yoga practices taught by certified teachers." },
    { name: "Mystic Yoga Gurgaon", type: "yoga", lat: 28.4410, lng: 77.0346, desc: "Power yoga, meditation, and detox diet coaching for student stress." },
    
    { name: "Aarav Sharma Placement Stress Clinic", type: "therapy", lat: 28.6028, lng: 77.2270, desc: "Cognitive therapy clinic specializing in placement anxiety and student confidence." },
    { name: "Meera Deshmukh Burnout Recovery Hub", type: "therapy", lat: 28.6289, lng: 77.1940, desc: "Mindfulness clinic helping students recover from course overload stress." },
    { name: "Vikram Sen Psychiatric Centre Noida", type: "therapy", lat: 28.5550, lng: 77.3550, desc: "A senior psychiatrist clinic managing panic and anxiety disorders." },
    
    // Mumbai
    { name: "Mumbai Mindfulness Sanctuary", type: "meditation", lat: 19.0620, lng: 72.8890, desc: "Silent vipassana sessions near the peaceful Mumbai coast." },
    { name: "Juhu Zen & Yoga Retreat", type: "meditation", lat: 19.1020, lng: 72.8270, desc: "Premium seaside meditation and dynamic breathing workshops." },
    { name: "Marine Drive Yoga Flow Shala", type: "yoga", lat: 18.9420, lng: 72.8220, desc: "Wake up with restorative sunset and sunrise vinyasa flows." },
    { name: "Andheri Cognitive Recovery Center", type: "therapy", lat: 19.1190, lng: 72.8470, desc: "Therapy clinic specializing in academic and workplace stress management." },
    { name: "Bandra Mind & Soul Clinic", type: "therapy", lat: 19.0550, lng: 72.8300, desc: "Counseling desk for anxiety, exam stress, and panic relief." },

    // Bangalore
    { name: "Bangalore Vipassana Dhamma Shala", type: "meditation", lat: 12.9820, lng: 77.5850, desc: "Lush green sanctuary offering silent mindfulness retreats." },
    { name: "Whitefield Zen Center", type: "meditation", lat: 12.9690, lng: 77.7490, desc: "Meditation and stress management classes tailored for IT professionals." },
    { name: "Indiranagar Vinyasa Yoga Club", type: "yoga", lat: 12.9780, lng: 77.6410, desc: "Power vinyasa flow and prenatal yoga sessions." },
    { name: "Koramangala Cognitive Advisory Desk", type: "therapy", lat: 12.9350, lng: 77.6250, desc: "Student advisory and clinical psychology services for exam stress." }
];

// Default User Coordinates (Delhi/NCR)
let userCoords = { lat: 28.6139, lng: 77.2090 };
let activeStream = null;
let isMicMuted = false;
let isVideoMuted = false;
let callTimer = null;
let callDuration = 0;
let zenMap = null;
let mapMarkersGroup = null;

let activeMapCategory = "all";
let activeMapRange = 10;
let activeCentresList = [];
let currentSearchLocationName = "Delhi/NCR";

document.addEventListener("DOMContentLoaded", () => {
    // Resolve Leaflet default icon path bugs
    fixLeafletMarkerIcons();
    
    // Set initial coordinates immediately with defaults so map has centers from start!
    updateNearbyCoordinates();
    
    // Request User's Live Geolocation
    acquireUserLocation();
    
    initBookingForm();
    initMapFinder();
    initWalletTriggers();
    updateWalletDisplay();
});

/* ----------------------------------------------------------------- */
/* 0. GEOLOCATION & HAVERSINE CALCULATIONS */
/* ----------------------------------------------------------------- */
function fixLeafletMarkerIcons() {
    if (typeof L !== "undefined") {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
    }
}

function acquireUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userCoords.lat = position.coords.latitude;
                userCoords.lng = position.coords.longitude;
                updateNearbyCoordinates();
            },
            (error) => {
                console.warn("HTML5 Geolocation access denied or failed. Trying IP Geolocation fallback...", error);
                fallbackIPGeolocation();
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    } else {
        fallbackIPGeolocation();
    }
}

function fallbackIPGeolocation() {
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            if (data.latitude && data.longitude) {
                userCoords.lat = data.latitude;
                userCoords.lng = data.longitude;
                console.log(`IP Geolocation matched user city: ${data.city || "Unknown"}`);
                if (typeof notifyUser === "function") {
                    notifyUser("Location Centered", `Centered search area around ${data.city || "your current area"}.`);
                }
            }
            updateNearbyCoordinates();
        })
        .catch(err => {
            console.error("IP Geolocation fallback failed. Using default NCR coordinates.", err);
            updateNearbyCoordinates();
        });
}

// Haversine Equation: Distance in km between two spherical nodes
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's Radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}

function updateWalletDisplay() {
    let credits = parseInt(localStorage.getItem("wellness-credits") || "0");
    const badge = document.getElementById("wallet-credits-badge");
    if (badge) {
        badge.textContent = credits;
    }
}
window.updateWalletDisplay = updateWalletDisplay;

function updateNearbyCoordinates() {
    // 1. Calculate distances for all static predefined fixed centres
    allCentres.forEach((c) => {
        const distanceVal = calculateHaversineDistance(userCoords.lat, userCoords.lng, c.lat, c.lng);
        c.distance = `${distanceVal.toFixed(1)} km`;
        c.distanceNum = distanceVal;
    });
    
    // 2. Filter static centers that are within 35 km
    let closeCentres = allCentres.filter(c => c.distanceNum <= 35);
    
    // 3. If there are fewer than 3 close centers, dynamically generate 6 nearby centers relative to userCoords
    if (closeCentres.length < 3) {
        const prefix = currentSearchLocationName || "Local";
        const dynamicCentres = [
            { name: `${prefix} Dhyana Kendra`, type: "meditation", lat: userCoords.lat - 0.015, lng: userCoords.lng + 0.022, desc: `A peaceful sanctuary in ${prefix} offering silent vipassana breathing groups.` },
            { name: `${prefix} Meditation Mandir`, type: "meditation", lat: userCoords.lat + 0.028, lng: userCoords.lng - 0.014, desc: `Dynamic active meditation classes and stress release activities in ${prefix}.` },
            { name: `${prefix} Vinyasa Yoga Shala`, type: "yoga", lat: userCoords.lat + 0.031, lng: userCoords.lng + 0.018, desc: `Flowing vinyasa classes, pranayama, and hot yoga sessions in ${prefix}.` },
            { name: `${prefix} Hatha Yoga Studio`, type: "yoga", lat: userCoords.lat - 0.022, lng: userCoords.lng + 0.042, desc: `Traditional hatha yoga, classical yoga philosophy, and chanting in ${prefix}.` },
            { name: `${prefix} Cognitive Recovery Hub`, type: "therapy", lat: userCoords.lat + 0.015, lng: userCoords.lng - 0.015, desc: `Mindfulness clinic in ${prefix} helping students recover from course overload stress.` },
            { name: `${prefix} Psychiatric Advisory Centre`, type: "therapy", lat: userCoords.lat + 0.028, lng: userCoords.lng + 0.035, desc: `A senior psychiatrist clinic in ${prefix} managing panic and anxiety disorders.` }
        ];
        
        // Calculate distance for dynamic centers
        dynamicCentres.forEach(c => {
            const distanceVal = calculateHaversineDistance(userCoords.lat, userCoords.lng, c.lat, c.lng);
            c.distance = `${distanceVal.toFixed(1)} km`;
            c.distanceNum = distanceVal;
        });
        
        activeCentresList = [...closeCentres, ...dynamicCentres];
    } else {
        // If we already have enough close static centers, just use the full list
        activeCentresList = [...allCentres];
    }
    
    // Distribute doctors near user's position so there's always local therapist consulting available
    therapists.forEach((t, idx) => {
        const seedLat = (idx * -0.011) + 0.018;
        const seedLng = (idx * 0.015) - 0.015;
        t.lat = userCoords.lat + seedLat;
        t.lng = userCoords.lng + seedLng;
        
        const distanceVal = calculateHaversineDistance(userCoords.lat, userCoords.lng, t.lat, t.lng);
        t.distance = `${distanceVal.toFixed(1)} km`;
        t.distanceNum = distanceVal;
    });
    
    // Trigger render updates
    renderTherapists();
    updateWalletDisplay();
    
    if (zenMap) {
        updateMapMarkers();
        loadMapSidebarList();
    }
}

/* ----------------------------------------------------------------- */
/* 1. THERAPIST DIRECTORY RENDERER */
/* ----------------------------------------------------------------- */
function renderTherapists() {
    const container = document.getElementById("therapists-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    therapists.forEach(t => {
        const card = document.createElement("div");
        card.className = "therapist-card glass-panel tilt-card";
        
        card.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px;">
                <div style="position:relative; display:flex; align-items:center;">
                    <img src="${t.avatar}" alt="${t.name}" class="therapist-avatar">
                    <span style="position:absolute; bottom:2px; right:2px; width:11px; height:11px; background:#22c55e; border:2px solid white; border-radius:50%; box-shadow:0 0 6px #22c55e;" title="Online Now"></span>
                </div>
                <div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <h3 style="font-size:15px; font-weight:700;">${t.name}</h3>
                        <span style="font-size:9px; background:rgba(34,197,94,0.1); color:#15803d; border:1px solid rgba(34,197,94,0.25); padding:1px 5px; border-radius:10px; font-weight:700; display:inline-block;">Online</span>
                    </div>
                    <div class="therapist-specialty" style="margin-top:4px;">
                        ${t.specialty} • <span style="color:var(--primary-cyan); font-weight:700;">${t.distance || "Nearby"}</span>
                    </div>
                </div>
            </div>
            <p style="font-size:12px; color:var(--text-muted); line-height:1.4; margin-top:8px;">${t.bio}</p>
            <div style="display:flex; gap:10px; margin-top:6px; font-size:11px; color:var(--text-muted);">
                <span>💼 ${t.experience || "5+ Yrs Exp"}</span>
                <span>🗣️ ${t.languages || "English, Hindi"}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <span style="font-size:13px; font-weight:700; color:var(--primary-cyan);">${t.price || "₹199"} <span style="font-size:10px; font-weight:400; color:var(--text-muted);">${t.rating}</span></span>
                <div style="display:flex; gap:8px;">
                    <button class="lang-select-btn view-doc-map-btn" data-lat="${t.lat}" data-lng="${t.lng}" style="padding:4px 10px; font-size:11px;">
                        <i data-lucide="map" style="width:12px; height:12px;"></i> Location
                    </button>
                    <button class="gradient-btn book-session-trigger" data-id="${t.id}" style="padding:6px 12px; font-size:11px;">Book Session</button>
                </div>
            </div>
        `;
        
        // Add booking modal opener trigger
        card.querySelector(".book-session-trigger").addEventListener("click", () => {
            openBookingModal(t);
        });
        
        // Pin doctor location on Leaflet
        card.querySelector(".view-doc-map-btn").addEventListener("click", () => {
            triggerDirectMapLocate(t.name, t.lat, t.lng, "Professional Consultation Clinic");
        });
        
        container.appendChild(card);
    });
    
    // Refresh Lucide
    lucide.createIcons();
    
    // Load booked appointments list
    renderAppointmentsList();
}

function triggerDirectMapLocate(name, lat, lng, desc) {
    const mapBtn = document.getElementById("open-map-btn");
    if (mapBtn) {
        mapBtn.click(); // Open ZenMap Finder Modal
        setTimeout(() => {
            if (zenMap) {
                zenMap.setView([lat, lng], 14);
                // Draw dynamic temp popup
                L.popup()
                    .setLatLng([lat, lng])
                    .setContent(`<b>${name}</b><br>${desc}`)
                    .openOn(zenMap);
            }
        }, 500);
    }
}

/* ----------------------------------------------------------------- */
/* 2. BOOKING SYSTEM & FORMS */
/* ----------------------------------------------------------------- */
function initBookingForm() {
    const form = document.getElementById("actual-booking-form");
    const modal = document.getElementById("booking-form-modal");
    const backdrop = document.getElementById("app-modal-backdrop");
    const closeBtn = document.getElementById("close-booking-modal-btn");
    
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const id = document.getElementById("booking-therapist-id").value;
        const name = document.getElementById("booking-therapist-name").value;
        const date = document.getElementById("booking-date").value;
        const time = document.getElementById("booking-time").value;
        const type = document.getElementById("booking-type").value;
        
        let credits = parseInt(localStorage.getItem("wellness-credits") || "0");
        if (credits <= 0) {
            notifyUser("Insufficient Credits", "Please top up your wallet to book this session.");
            return;
        }
        
        let bookings = JSON.parse(localStorage.getItem("booked-consultations") || "[]");
        
        bookings.push({
            id: Date.now(),
            therapistId: id,
            therapistName: name,
            date: date,
            time: time,
            type: type
        });
        
        localStorage.setItem("booked-consultations", JSON.stringify(bookings));
        
        // Deduct 1 credit
        credits = Math.max(0, credits - 1);
        localStorage.setItem("wellness-credits", credits.toString());
        updateWalletDisplay();
        
        // Close modal
        modal.classList.remove("active");
        backdrop.style.display = "none";
        
        // Refresh appointments list
        renderAppointmentsList();
        
        // Toast notify
        notifyUser("Session Booked!", `Your appointment with ${name} is locked.`);
    });
    
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        backdrop.style.display = "none";
    });
}

function openBookingModal(therapist) {
    let credits = parseInt(localStorage.getItem("wellness-credits") || "0");
    if (credits <= 0) {
        notifyUser("Credits Required", "Please buy session credits to consult this therapist.");
        
        document.getElementById("checkout-plan-name").value = "1 Consultation Session Credit";
        document.getElementById("checkout-plan-price").value = "₹199";
        
        const payModal = document.getElementById("checkout-form-modal");
        const backdrop = document.getElementById("app-modal-backdrop");
        if (payModal && backdrop) {
            payModal.classList.add("active");
            backdrop.style.display = "block";
            localStorage.setItem("emovia-checkout-intent", "credit-1");
        }
        return;
    }

    const modal = document.getElementById("booking-form-modal");
    const backdrop = document.getElementById("app-modal-backdrop");
    
    document.getElementById("booking-therapist-id").value = therapist.id;
    document.getElementById("booking-therapist-name").value = therapist.name;
    
    // Set tomorrow as default date picker value
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById("booking-date").value = tomorrow.toISOString().substring(0, 10);
    
    modal.classList.add("active");
    backdrop.style.display = "block";
}

function renderAppointmentsList() {
    const container = document.getElementById("appointments-list-container");
    if (!container) return;
    
    let bookings = JSON.parse(localStorage.getItem("booked-consultations") || "[]");
    
    container.innerHTML = "";
    
    if (bookings.length === 0) {
        container.innerHTML = '<div style="font-size:12px; color:var(--text-muted); text-align:center; padding:15px;">No consultations scheduled.</div>';
        return;
    }
    
    bookings.forEach((b, idx) => {
        const card = document.createElement("div");
        card.style.background = "rgba(255, 255, 255, 0.02)";
        card.style.border = "1px solid var(--glass-border)";
        card.style.padding = "15px";
        card.style.borderRadius = "12px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "8px";
        
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="font-size:13px; color:var(--text-main);">${b.therapistName}</strong>
                <span style="font-size:10px; background:rgba(0, 245, 212, 0.15); color:var(--primary-cyan); padding:2px 8px; border-radius:20px;">
                    ${b.type} Session
                </span>
            </div>
            <div style="font-size:11px; color:var(--text-muted);">
                <i data-lucide="clock" style="width:12px; height:12px; vertical-align:middle;"></i> ${b.date} | ${b.time}
            </div>
            <div style="display:flex; gap:10px; margin-top:5px;">
                <button class="gradient-btn join-call-trigger" style="flex:1; padding:6px; font-size:11px;">Join Channel</button>
                <button class="lang-select-btn cancel-booking-btn" style="padding:6px 12px; font-size:11px; color:var(--accent-red); border-color:rgba(217,4,41,0.2);">Cancel</button>
            </div>
        `;
        
        // Join session link callback
        card.querySelector(".join-call-trigger").addEventListener("click", () => {
            launchVideoConsultation(b.therapistName);
        });
        
        // Cancel booking callback
        card.querySelector(".cancel-booking-btn").addEventListener("click", () => {
            bookings.splice(idx, 1);
            localStorage.setItem("booked-consultations", JSON.stringify(bookings));
            renderAppointmentsList();
        });
        
        container.appendChild(card);
    });
    lucide.createIcons();
}

/* ----------------------------------------------------------------- */
/* 3. FULL SCREEN VIDEO CONSULTATIONS & WEBRTC */
/* ----------------------------------------------------------------- */
async function launchVideoConsultation(therapistName) {
    const pane = document.getElementById("video-consultation-section");
    const selfVideo = document.getElementById("self-video-element");
    const selfPlaceholder = document.getElementById("self-video-placeholder");
    const title = document.getElementById("call-panel-therapist-name");
    
    title.textContent = `Consultation with ${therapistName}`;
    pane.style.display = "flex";
    
    // Acquire webcam feed
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        activeStream = stream;
        selfVideo.srcObject = stream;
        selfVideo.style.display = "block";
        selfPlaceholder.style.display = "none";
        isVideoMuted = false;
        isMicMuted = false;
    } catch (e) {
        console.warn("Camera blocks, using avatar simulation", e);
        selfVideo.style.display = "none";
        selfPlaceholder.style.display = "flex";
    }
    
    // Start consultation clock
    callDuration = 0;
    const timerDisplay = document.getElementById("call-timer-display");
    
    callTimer = setInterval(() => {
        callDuration++;
        const mins = Math.floor(callDuration / 60).toString().padStart(2, '0');
        const secs = (callDuration % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
    
    // Setup Action Listeners
    initCallButtons();
}

function initCallButtons() {
    const hangup = document.getElementById("call-hangup-btn");
    const mic = document.getElementById("call-toggle-mic-btn");
    const video = document.getElementById("call-toggle-video-btn");
    const share = document.getElementById("call-toggle-share-btn");
    const p2pBtn = document.getElementById("call-p2p-setup-btn");
    
    hangup.addEventListener("click", stopConsultation);
    
    // Microphone audio tracks toggle
    mic.addEventListener("click", () => {
        isMicMuted = !isMicMuted;
        if (activeStream) {
            activeStream.getAudioTracks().forEach(track => track.enabled = !isMicMuted);
        }
        mic.innerHTML = isMicMuted ? '<i data-lucide="mic-off"></i>' : '<i data-lucide="mic"></i>';
        mic.className = isMicMuted ? "call-btn disabled" : "call-btn";
        lucide.createIcons();
    });
    
    // Camera video tracks toggle
    video.addEventListener("click", () => {
        isVideoMuted = !isVideoMuted;
        const selfVideo = document.getElementById("self-video-element");
        const selfPlaceholder = document.getElementById("self-video-placeholder");
        
        if (activeStream) {
            activeStream.getVideoTracks().forEach(track => track.enabled = !isVideoMuted);
        }
        
        selfVideo.style.display = isVideoMuted ? "none" : "block";
        selfPlaceholder.style.display = isVideoMuted ? "flex" : "none";
        
        video.innerHTML = isVideoMuted ? '<i data-lucide="video-off"></i>' : '<i data-lucide="video"></i>';
        video.className = isVideoMuted ? "call-btn disabled" : "call-btn";
        lucide.createIcons();
    });
    
    // Screen share mock
    share.addEventListener("click", () => {
        alert("Screen sharing is unlocked on Zen Ultimate plans. Simulating stream capture allocation standard.");
    });
    
    // WebRTC room setup trigger
    p2pBtn.addEventListener("click", () => {
        const code = Math.floor(100000 + Math.random() * 900000);
        const entered = prompt(`Copy your WebRTC connection code to invite a peer:\n\n${code}\n\nOr enter peer room code to connect:`);
        
        if (entered) {
            document.getElementById("call-connection-type-indicator").textContent = `WebRTC Peer Connected`;
            document.getElementById("peer-status-text").textContent = "Peer Connected via WebRTC";
            notifyUser("WebRTC Connected", `Successfully established PeerConnection link.`);
        }
    });
}

function stopConsultation() {
    const pane = document.getElementById("video-consultation-section");
    const selfVideo = document.getElementById("self-video-element");
    
    clearInterval(callTimer);
    
    if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
    }
    
    selfVideo.srcObject = null;
    pane.style.display = "none";
    
    notifyUser("Consultation Finished", "Your wellness appointment feed has ended successfully.");
}

/* ----------------------------------------------------------------- */
/* 4. ZENMAP MEDITATION CENTRE LOCATOR (LEAFLET.JS) */
/* ----------------------------------------------------------------- */
function initMapFinder() {
    const openBtn = document.getElementById("open-map-btn");
    const closeBtn = document.getElementById("close-map-modal-btn");
    const modal = document.getElementById("map-modal");
    const backdrop = document.getElementById("app-modal-backdrop");
    
    const searchInput = document.getElementById("map-search-input");
    const searchBtn = document.getElementById("map-search-btn");
    const rangeSlider = document.getElementById("map-range-slider");
    const rangeValLabel = document.getElementById("map-range-val");
    
    if (!openBtn) return;
    
    // Range Slider listener
    if (rangeSlider && rangeValLabel) {
        rangeSlider.addEventListener("input", (e) => {
            activeMapRange = parseFloat(e.target.value);
            rangeValLabel.textContent = `${activeMapRange} km`;
            
            updateMapMarkers();
            loadMapSidebarList();
        });
    }
    
    // Geocode Search button listener
    if (searchBtn && searchInput) {
        const doSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                geocodeManualLocation(query);
            }
        };
        searchBtn.addEventListener("click", doSearch);
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                doSearch();
            }
        });
    }
    
    // Category Tabs listeners
    const tabs = document.querySelectorAll(".map-filter-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeMapCategory = tab.getAttribute("data-category");
            
            updateMapMarkers();
            loadMapSidebarList();
        });
    });
    
    openBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        backdrop.style.display = "block";
        
        // Initialize Leaflet map if not loaded
        setTimeout(() => {
            if (!zenMap) {
                // Centered on user coords
                zenMap = L.map('zen-map-element').setView([userCoords.lat, userCoords.lng], 13);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap contributors'
                }).addTo(zenMap);
                
                mapMarkersGroup = L.layerGroup().addTo(zenMap);
                
                // Allow Map Clicks to move coordinate pin manually!
                zenMap.on('click', (e) => {
                    userCoords.lat = e.latlng.lat;
                    userCoords.lng = e.latlng.lng;
                    currentSearchLocationName = "Pinned Point";
                    zenMap.panTo([userCoords.lat, userCoords.lng]); // Pan map to click
                    updateNearbyCoordinates();
                });
                
                updateMapMarkers();
                loadMapSidebarList();
            } else {
                // Center and force redraw sizes on reopen to fix blank tile box bugs
                zenMap.setView([userCoords.lat, userCoords.lng], 13);
                zenMap.invalidateSize();
                updateMapMarkers();
                loadMapSidebarList();
            }
        }, 300);
    });
    
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        backdrop.style.display = "none";
    });
}

function geocodeManualLocation(query) {
    const searchBtn = document.getElementById("map-search-btn");
    const originalText = searchBtn.innerHTML;
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
    
    // Call OpenStreetMap Nominatim Free Search API
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
        .then(res => res.json())
        .then(data => {
            searchBtn.disabled = false;
            searchBtn.innerHTML = originalText;
            
            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);
                
                userCoords.lat = lat;
                userCoords.lng = lng;
                
                // Update current search location name
                currentSearchLocationName = result.display_name.split(',')[0];
                
                // Centered map on new location
                if (zenMap) {
                    zenMap.setView([lat, lng], 13);
                }
                
                updateNearbyCoordinates();
                
                notifyUser("Location Found!", `Centered search area at: ${result.display_name.split(',')[0]}`);
            } else {
                notifyUser("Search Failed", "Could not resolve coordinates for this location. Try clicking on map instead.");
            }
        })
        .catch(err => {
            console.error("Geocoding failed:", err);
            searchBtn.disabled = false;
            searchBtn.innerHTML = originalText;
            notifyUser("Search Error", "Network error while geocoding. Try clicking on map instead.");
        });
}

function updateMapMarkers() {
    if (!zenMap || !mapMarkersGroup) return;
    
    // Clear previous elements
    mapMarkersGroup.clearLayers();
    
    // Draw user coordinate marker
    const userMarkerHtml = `
        <div style="
            background-color: var(--primary-cyan);
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 12px var(--primary-cyan);
        "></div>
    `;
    
    const userIcon = L.divIcon({
        html: userMarkerHtml,
        className: 'user-pulse-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
    
    L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(mapMarkersGroup)
        .bindPopup("<b>Your Location Pin</b><br>Currently centered search area.");
        
    // Draw wellness centers filtered by range and type
    const filteredCentres = activeCentresList.filter(c => {
        const matchesCategory = (activeMapCategory === "all" || c.type === activeMapCategory);
        const matchesRange = (c.distanceNum <= activeMapRange);
        return matchesCategory && matchesRange;
    });
    
    filteredCentres.forEach(c => {
        // Choose pin color based on type
        let pinColor = "var(--primary-cyan)";
        if (c.type === "yoga") pinColor = "#ffd700";
        if (c.type === "therapy") pinColor = "var(--accent-purple)";
        
        const pinHtml = `
            <div style="
                background-color: ${pinColor};
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 10px ${pinColor};
            "></div>
        `;
        const pinIcon = L.divIcon({
            html: pinHtml,
            className: 'centre-pin',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
        
        L.marker([c.lat, c.lng], { icon: pinIcon })
            .addTo(mapMarkersGroup)
            .bindPopup(`<b>${c.name}</b> (${c.type.toUpperCase()})<br>${c.desc}<br><i>Distance: ${c.distance} away</i>`);
    });
}

function loadMapSidebarList() {
    const container = document.getElementById("map-sidebar-results-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    // Filter centres
    const filteredCentres = activeCentresList.filter(c => {
        const matchesCategory = (activeMapCategory === "all" || c.type === activeMapCategory);
        const matchesRange = (c.distanceNum <= activeMapRange);
        return matchesCategory && matchesRange;
    });
    
    if (filteredCentres.length === 0) {
        container.innerHTML = `
            <div style="font-size:11.5px; color:var(--text-muted); text-align:center; padding:20px; line-height:1.4;">
                No centers found within ${activeMapRange} km.<br>
                <span style="color:var(--primary-cyan); cursor:pointer; text-decoration:underline;" onclick="document.getElementById('map-range-slider').value=20; document.getElementById('map-range-slider').dispatchEvent(new Event('input'));">Expand Range</span>
            </div>
        `;
        return;
    }
    
    filteredCentres.forEach(c => {
        const item = document.createElement("div");
        item.style.background = "rgba(255, 255, 255, 0.03)";
        item.style.border = "1px solid var(--glass-border)";
        item.style.padding = "10px";
        item.style.borderRadius = "8px";
        item.style.cursor = "pointer";
        item.style.fontSize = "12px";
        item.className = "map-sidebar-card";
        
        // Define color accents
        let badgeColor = "rgba(0, 245, 212, 0.15)";
        let badgeText = "var(--primary-cyan)";
        let typeLabel = "Zen";
        if (c.type === "yoga") {
            badgeColor = "rgba(255, 215, 0, 0.15)";
            badgeText = "#ffd700";
            typeLabel = "Yoga";
        } else if (c.type === "therapy") {
            badgeColor = "rgba(123, 44, 191, 0.25)";
            badgeText = "var(--accent-violet)";
            typeLabel = "Clinic";
        }
        
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:5px;">
                <strong style="color:white; font-size:12px;">${c.name}</strong>
                <span style="font-size:9px; background:${badgeColor}; color:${badgeText}; padding:1px 5px; border-radius:10px; font-weight:700;">${typeLabel}</span>
            </div>
            <div style="font-size:10px; color:var(--accent-green); font-weight:700; margin-top:2px;">Proximity: ${c.distance}</div>
            <p style="font-size:10.5px; line-height:1.35; margin-top:4px; color:var(--text-muted);">${c.desc}</p>
        `;
        
        item.addEventListener("click", () => {
            if (zenMap) {
                zenMap.setView([c.lat, c.lng], 14);
                // Open popup
                zenMap.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        const latlng = layer.getLatLng();
                        if (latlng.lat === c.lat && latlng.lng === c.lng) {
                            layer.openPopup();
                        }
                    }
                });
            }
        });
        
        container.appendChild(item);
    });
}

function initWalletTriggers() {
    const buyTriggers = document.querySelectorAll(".buy-credits-trigger");
    buyTriggers.forEach(btn => {
        btn.addEventListener("click", () => {
            const credits = btn.getAttribute("data-credits");
            const price = btn.getAttribute("data-price");
            
            document.getElementById("checkout-plan-name").value = `${credits} Consultation Credit${credits > 1 ? 's' : ''}`;
            document.getElementById("checkout-plan-price").value = price;
            
            const payModal = document.getElementById("checkout-form-modal");
            const backdrop = document.getElementById("app-modal-backdrop");
            if (payModal && backdrop) {
                payModal.classList.add("active");
                backdrop.style.display = "block";
                localStorage.setItem("emovia-checkout-intent", `credit-${credits}`);
            }
        });
    });
}
