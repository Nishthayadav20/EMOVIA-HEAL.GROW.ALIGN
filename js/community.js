/*
================================================================
   EMOVIA - SOCIAL SUPPORT CIRCLE & WELLNESS MAGAZINES
================================================================
*/

// Mock Preloaded Anonymous Posts with Comment Arrays
const preloadedPosts = [
    { 
        id: 101, 
        text: "Feeling so lost about upcoming campus placements, but trying to take it one day at a time.", 
        hearts: 12, 
        liked: false, 
        date: "2 hrs ago",
        comments: [
            { author: "ZenBuddy", text: "Hey! Try dividing your day into 25-minute Pomodoro blocks. It saved me last semester." },
            { author: "MeeraAdvises", text: "Remember to take breaks. 1 hour of study followed by 10 minutes of deep breathing." }
        ]
    },
    { 
        id: 102, 
        text: "A gentle reminder that your exam grades do not define your human worth. We got this guys!", 
        hearts: 24, 
        liked: true, 
        date: "4 hrs ago",
        comments: [
            { author: "MindExplorer", text: "Needed to hear this today. Semester exams are draining." }
        ]
    },
    { 
        id: 103, 
        text: "Had a panic attack during mock presentations. Dr. Meera's breathing exercises really brought me back.", 
        hearts: 8, 
        liked: false, 
        date: "1 day ago",
        comments: []
    }
];

// Mock Wellness Magazines updates
const wellnessArticles = [
    {
        id: 1,
        title: "Coping with Placement Stress",
        author: "Mindfulness Board",
        readTime: "4 min read",
        preview: "Practical tips to build confidence, manage expectations, and maintain breathing cycles during high-pressure placement cycles.",
        content: "Campus placements are stressful. The pressure to secure a job often makes graduates forget to take care of themselves. Here are 3 primary tips:\n\n1. Cognitive Reframing: Instead of thinking 'I must get this job or I fail', reframe it to 'I am excited to demonstrate my programming/logic skills. If I don't clear this step, it is simply a data point on my learning curve.'\n2. Diaphragmatic Breathing: Right before entering your online interviews or tech rounds, do a 4-second inhale, 4-second hold, and 4-second exhale breathing cycle to deactivate physical stress responses.\n3. Keep study limits: Study for at most 8 hours a day. Overworking leads to academic burnout."
    },
    {
        id: 2,
        title: "Defeating Semester Burnout",
        author: "Zen Editors",
        readTime: "5 min read",
        preview: "Understanding fatigue indicators, time-management blocks, and building daily wellness roadmaps to protect your sleep schedule.",
        content: "Burnout is not just feeling tired; it is a neurological block of energy and motivation. To recover from semester overload:\n\n- Audit your credit load: Balance difficult coding/math courses with active breaks.\n- Sleep priority: Low sleep (under 6 hours) limits your brain's processing capacity. Lock your mobile devices 1 hour before sleep.\n- Peer systems: Discuss challenges with a support buddy. Sharing problems releases academic anxiety."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    initSocialFeed();
    initBuddyMatching();
    initWellnessMagazines();
});

/* ----------------------------------------------------------------- */
/* 1. SOCIAL DISCUSSIONS & COMMENTS THREADS */
/* ----------------------------------------------------------------- */
function initSocialFeed() {
    const postInput = document.getElementById("community-post-input");
    const postBtn = document.getElementById("post-anon-btn");
    const feed = document.getElementById("anon-board-feed");
    
    if (!postBtn || !feed) return;
    
    let posts = JSON.parse(localStorage.getItem("anon-posts-board") || "[]");
    
    if (posts.length === 0) {
        posts = preloadedPosts;
        localStorage.setItem("anon-posts-board", JSON.stringify(posts));
    }
    
    function renderBoard() {
        feed.innerHTML = "";
        
        posts.forEach(p => {
            const card = document.createElement("div");
            card.className = "anon-post-card glass-panel";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.gap = "12px";
            
            // Comments list HTML generator
            const commentsListHtml = p.comments && p.comments.length > 0 
                ? p.comments.map(c => `
                    <div style="background:rgba(255,255,255,0.02); padding:10px 14px; border-radius:10px; border:1px solid rgba(255,255,255,0.03); font-size:12.5px;">
                        <strong style="color:var(--primary-cyan); font-size:11px;">@${c.author}</strong>: ${c.text}
                    </div>
                `).join('')
                : `<div style="font-size:11.5px; color:var(--text-muted); text-align:center; padding:10px;">No solutions/replies posted yet. Share yours!</div>`;
                
            card.innerHTML = `
                <div style="font-size:14.5px; line-height:1.55; white-space:pre-wrap; font-weight:500;">"${p.text}"</div>
                
                <div class="anon-post-meta" style="margin-top:5px; border-top:1px solid rgba(255,255,255,0.06); padding-top:12px;">
                    <span><i data-lucide="clock" style="width:12px; height:12px; vertical-align:middle;"></i> ${p.date}</span>
                    <div style="display:flex; gap:15px; align-items:center;">
                        <button class="post-heart-btn ${p.liked ? 'liked' : ''}" data-id="${p.id}">
                            <i data-lucide="heart" style="width:15px; height:15px; fill:${p.liked ? 'currentColor' : 'none'};"></i>
                            <span>${p.hearts}</span>
                        </button>
                        <button class="post-heart-btn toggle-comment-btn" style="color:var(--text-muted);">
                            <i data-lucide="message-square" style="width:15px; height:15px;"></i>
                            <span>${p.comments ? p.comments.length : 0} Solutions</span>
                        </button>
                    </div>
                </div>
                
                <!-- Comment Accordion Section -->
                <div class="comment-thread-panel" style="display:none; padding:10px 0 0 0; border-top:1px dashed rgba(255,255,255,0.05); flex-direction:column; gap:10px;">
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${commentsListHtml}
                    </div>
                    <div style="display:flex; gap:10px; margin-top:8px;">
                        <input type="text" class="form-input reply-box-input" placeholder="Write a solution/reply..." style="flex:1; padding:8px 14px; font-size:12px; border-radius:10px;">
                        <button class="gradient-btn add-reply-trigger-btn" style="padding:8px 16px; font-size:11px; border-radius:10px; font-weight:600; color:var(--text-dark);">Reply</button>
                    </div>
                </div>
            `;
            
            // Likes click
            card.querySelector(".post-heart-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                p.liked = !p.liked;
                p.hearts += p.liked ? 1 : -1;
                localStorage.setItem("anon-posts-board", JSON.stringify(posts));
                renderBoard();
            });
            
            // Comments thread toggle
            const commentsPanel = card.querySelector(".comment-thread-panel");
            card.querySelector(".toggle-comment-btn").addEventListener("click", () => {
                const isOpen = commentsPanel.style.display === "flex";
                commentsPanel.style.display = isOpen ? "none" : "flex";
            });
            
            // Add comment reply triggers
            const replyInput = card.querySelector(".reply-box-input");
            card.querySelector(".add-reply-trigger-btn").addEventListener("click", () => {
                const replyText = replyInput.value.trim();
                if (!replyText) return;
                
                if (!p.comments) p.comments = [];
                p.comments.push({
                    author: "GuestUser",
                    text: replyText
                });
                
                localStorage.setItem("anon-posts-board", JSON.stringify(posts));
                renderBoard();
                
                // Keep the comments thread expanded on reload
                const newCard = feed.querySelector(`.toggle-comment-btn[data-id="${p.id}"]`);
                // Or just force expand panel
                notifyUser("Reply Saved", "Your solution has been shared to the support circle thread.");
            });
            
            feed.appendChild(card);
        });
        lucide.createIcons();
    }
    
    postBtn.addEventListener("click", () => {
        const text = postInput.value.trim();
        if (text) {
            if (!posts) posts = [];
            posts.unshift({
                id: Date.now(),
                text: text,
                hearts: 0,
                liked: false,
                date: "Just now",
                comments: []
            });
            localStorage.setItem("anon-posts-board", JSON.stringify(posts));
            postInput.value = "";
            renderBoard();
            notifyUser("Post Published", "Your challenge is posted. Support buddies can now share solutions.");
        }
    });
    
    renderBoard();
}

/* ----------------------------------------------------------------- */
/* 2. PEER SUPPORT MATCHING */
/* ----------------------------------------------------------------- */
function initBuddyMatching() {
    const area = document.getElementById("buddy-matching-area");
    if (!area) return;
    
    area.addEventListener("click", (e) => {
        if (!e.target.id || e.target.id !== "start-buddy-match-btn") return;
        
        area.innerHTML = `
            <div class="matching-overlay">
                <div class="match-radar"></div>
                <h3 style="font-size:14px; margin-bottom:5px;">Scanning for Support Buddy...</h3>
                <p style="font-size:11px; color:var(--text-muted);">Finding peers with placement/academic stress filters.</p>
            </div>
        `;
        
        setTimeout(() => {
            area.innerHTML = `
                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--glass-border); padding:15px; border-radius:12px; display:flex; flex-direction:column; gap:10px;">
                    <strong style="color:var(--primary-cyan); font-size:13px; display:flex; align-items:center; gap:5px;">
                        <span style="color:var(--accent-green);">●</span> Match Active!
                    </strong>
                    <div style="font-size:12px;"><strong>Connected with:</strong> Anonymous Buddy #402</div>
                    <div style="font-size:10px; color:var(--text-muted);">Common Stress: Exam Stress & Career Anxiety</div>
                    
                    <div id="buddy-chat-log" style="height:120px; overflow-y:auto; background:rgba(0,0,0,0.15); border-radius:8px; padding:10px; display:flex; flex-direction:column; gap:8px; margin: 10px 0;">
                        <div style="font-size:10px; color:var(--text-muted); align-self:flex-start; background:rgba(255,255,255,0.03); padding:4px 8px; border-radius:4px;">
                            Hey! I'm prepping for placements too, it's so stressful. How are you holding up?
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:8px;">
                        <input type="text" id="buddy-chat-input" class="form-input" placeholder="Reply anonymously..." style="flex:1; padding:6px 10px; font-size:11px;">
                        <button class="gradient-btn" id="buddy-chat-send-btn" style="padding:6px 12px; font-size:11px; color:var(--text-dark);">Send</button>
                    </div>
                </div>
            `;
            
            const sendBtn = document.getElementById("buddy-chat-send-btn");
            const chatInput = document.getElementById("buddy-chat-input");
            const chatLog = document.getElementById("buddy-chat-log");
            
            sendBtn.addEventListener("click", () => {
                const text = chatInput.value.trim();
                if (!text) return;
                
                const userMsg = document.createElement("div");
                userMsg.style.cssText = "font-size:10px; color:var(--bg-base); align-self:flex-end; background:var(--primary-cyan); padding:4px 8px; border-radius:4px;";
                userMsg.textContent = text;
                chatLog.appendChild(userMsg);
                chatInput.value = "";
                chatLog.scrollTop = chatLog.scrollHeight;
                
                setTimeout(() => {
                    const peerMsg = document.createElement("div");
                    peerMsg.style.cssText = "font-size:10px; color:var(--text-muted); align-self:flex-start; background:rgba(255,255,255,0.03); padding:4px 8px; border-radius:4px;";
                    peerMsg.textContent = "Yes, absolutely! Let's check out the exam Pomodoro desk in Emovia. It helps keep concentration.";
                    chatLog.appendChild(peerMsg);
                    chatLog.scrollTop = chatLog.scrollHeight;
                }, 1500);
            });
        }, 3500);
    });
}

/* ----------------------------------------------------------------- */
/* 3. WELLNESS MAGAZINES & BLOGS ENGINE */
/* ----------------------------------------------------------------- */
function initWellnessMagazines() {
    const list = document.getElementById("wellness-magazines-list");
    const modal = document.getElementById("magazine-modal");
    const backdrop = document.getElementById("app-modal-backdrop");
    const closeBtn = document.getElementById("close-magazine-modal-btn");
    
    if (!list || !modal) return;
    
    list.innerHTML = "";
    
    wellnessArticles.forEach(art => {
        const card = document.createElement("div");
        card.style.background = "rgba(255, 255, 255, 0.02)";
        card.style.border = "1px solid var(--glass-border)";
        card.style.padding = "15px";
        card.style.borderRadius = "12px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "8px";
        card.className = "map-sidebar-card";
        
        card.innerHTML = `
            <strong style="color:var(--primary-cyan); font-size:13px;">${art.title}</strong>
            <div style="font-size:10px; color:var(--text-muted); display:flex; justify-content:space-between;">
                <span>By ${art.author}</span>
                <span>${art.readTime}</span>
            </div>
            <p style="font-size:11px; line-height:1.4; color:var(--text-muted);">${art.preview}</p>
            <button class="lang-select-btn read-article-btn" style="padding:6px; font-size:11px; margin-top:5px; text-align:center; display:block;">Read Magazine Update</button>
        `;
        
        // Open details modal callback
        card.querySelector(".read-article-btn").addEventListener("click", () => {
            document.getElementById("magazine-modal-title").textContent = art.title;
            document.getElementById("magazine-modal-content").textContent = art.content;
            
            modal.style.display = "flex";
            backdrop.style.display = "block";
        });
        
        list.appendChild(card);
    });
    
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        backdrop.style.display = "none";
    });
}
