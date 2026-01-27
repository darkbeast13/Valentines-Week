// ============ STATE ============
let currentDayIndex = 0;
let isPlaying = false;
let petals = [];
let isDateLocked = true; // Set to true for production (date-based), false for testing
let debugDate = null; // For debugging: set to test specific dates like '2-7'
let showDebugPanel = true; // Set to true to show the wrench icon, false to hide it

// ============ DATE MAPPING ============
const dateToDay = {
    '2-7': 0,   // Feb 7 - Rose Day
    '2-8': 1,   // Feb 8 - Propose Day
    '2-9': 2,   // Feb 9 - Chocolate Day
    '2-10': 3,  // Feb 10 - Teddy Day
    '2-11': 4,  // Feb 11 - Promise Day
    '2-12': 5,  // Feb 12 - Hug Day
    '2-13': 6,  // Feb 13 - Kiss Day
    '2-14': 7   // Feb 14 - Valentine's Day
};

const dayNames = {
    0: 'Rose Day',
    1: 'Propose Day',
    2: 'Chocolate Day',
    3: 'Teddy Day',
    4: 'Promise Day',
    5: 'Hug Day',
    6: 'Kiss Day',
    7: "Valentine's Day"
};

function getTodaysDayIndex() {
    // Use debug date if set
    if (debugDate) {
        if (dateToDay.hasOwnProperty(debugDate)) {
            return dateToDay[debugDate];
        }
        return -1;
    }

    // Get current date in user's timezone (international)
    const now = new Date();
    const month = now.getMonth() + 1; // 0-indexed
    const day = now.getDate();
    const key = `${month}-${day}`;

    console.log(`📅 Current date: ${now.toLocaleDateString()} (${key})`);

    if (dateToDay.hasOwnProperty(key)) {
        console.log(`✅ Today is ${dayNames[dateToDay[key]]}!`);
        return dateToDay[key];
    }

    // Before Feb 7 - show "Coming Soon" (return -1)
    if (month < 2 || (month === 2 && day < 7)) {
        console.log('⏳ Valentine\'s Week hasn\'t started yet!');
        return -1;
    }

    // After Feb 14 - show "See you next year" (return -1 for overlay mode)
    if (month > 2 || (month === 2 && day > 14)) {
        console.log('💕 Valentine\'s Week has ended, showing post-week message');
        return -1;
    }

    return 0; // Default to first day
}

// ============ DEBUG PANEL ============
function createDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debugPanel';
    debugPanel.className = 'collapsed'; // Start collapsed by default
    debugPanel.innerHTML = `
        <style>
            #debugPanel {
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0,0,0,0.85);
                color: white;
                padding: 15px;
                border-radius: 10px;
                z-index: 99999;
                font-family: monospace;
                font-size: 12px;
                max-width: 200px;
            }
            #debugPanel.collapsed {
                max-width: 40px;
                padding: 10px;
                cursor: pointer;
            }
            #debugPanel.collapsed .debug-content { display: none; }
            #debugPanel select, #debugPanel button {
                width: 100%;
                margin: 5px 0;
                padding: 5px;
                border-radius: 5px;
                border: none;
            }
            #debugPanel button {
                background: #25D366;
                color: white;
                cursor: pointer;
            }
            #debugPanel button:hover { opacity: 0.9; }
            .debug-toggle { cursor: pointer; }
        </style>
        <div class="debug-toggle" onclick="this.parentElement.classList.toggle('collapsed')">🔧</div>
        <div class="debug-content">
            <div style="margin-bottom: 10px; font-weight: bold;">📅 Date Debug</div>
            <select id="debugDateSelect">
                <option value="">Use Real Date</option>
                <option value="2-6">Feb 6 (Before Week)</option>
                <option value="2-7">Feb 7 - Rose Day</option>
                <option value="2-8">Feb 8 - Propose Day</option>
                <option value="2-9">Feb 9 - Chocolate Day</option>
                <option value="2-10">Feb 10 - Teddy Day</option>
                <option value="2-11">Feb 11 - Promise Day</option>
                <option value="2-12">Feb 12 - Hug Day</option>
                <option value="2-13">Feb 13 - Kiss Day</option>
                <option value="2-14">Feb 14 - Valentine's</option>
                <option value="2-15">Feb 15 (After Week)</option>
            </select>
            <button onclick="applyDebugDate()">Apply Date</button>
            <div id="debugInfo" style="margin-top: 10px; font-size: 10px; opacity: 0.8;"></div>
        </div>
    `;
    document.body.appendChild(debugPanel);
    updateDebugInfo();
}

function applyDebugDate() {
    const select = document.getElementById('debugDateSelect');
    debugDate = select.value || null;
    isDateLocked = true;

    // Reload the experience
    gsap.globalTimeline.clear();
    resetAllStages(); // Reset all stages before switching

    const todayIndex = getTodaysDayIndex();

    // Update global state and music first
    currentDayIndex = todayIndex;
    setupMusicForDay();

    if (todayIndex === -1) {
        showComingSoon();
    } else {
        hideComingSoon();
        populateDayContent(config.days[currentDayIndex]);
        playTimeline();
    }
    updateDebugInfo();
}

function resetAllStages() {
    // Reset all regular stages
    document.querySelectorAll('.stage').forEach(stage => {
        gsap.set(stage, { opacity: 0, visibility: 'hidden' });
    });

    // Reset special interactive stages
    const specialStages = ['stageProposal', 'proposalResponse', 'stageTeddy', 'stageValentine', 'stage7'];
    specialStages.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            gsap.set(el, { opacity: 0, visibility: 'hidden' });
        }
    });

    // Reset teddy reveal state
    const giftWrapper = document.getElementById('giftWrapper');
    const teddyReveal = document.getElementById('teddyReveal');
    const giftBox = document.getElementById('giftBox');
    if (giftWrapper) giftWrapper.style.display = 'block';
    if (teddyReveal) teddyReveal.classList.remove('show');
    if (giftBox) {
        giftBox.classList.remove('opened');
        giftBox.textContent = '🎁';
        gsap.set(giftBox, { opacity: 1, scale: 1 });
    }

    // Reset proposal/valentine button positions
    const noButtons = document.querySelectorAll('#proposalNo, #valentineNo');
    noButtons.forEach(btn => gsap.set(btn, { x: 0, y: 0 }));

    // Reset typing text
    const typingText = document.getElementById('typingText');
    if (typingText) {
        typingText.style.display = 'none';
        typingText.classList.remove('sent');
    }
}

function updateDebugInfo() {
    const infoEl = document.getElementById('debugInfo');
    if (infoEl) {
        const now = new Date();
        infoEl.innerHTML = `
            Real: ${now.toLocaleDateString()}<br>
            Debug: ${debugDate || 'OFF'}<br>
            Day: ${currentDayIndex >= 0 ? dayNames[currentDayIndex] : 'Coming Soon'}
        `;
    }
}

// ============ DOM ELEMENTS ============
const dayIndicator = document.getElementById('dayIndicator');
const dayBadge = document.getElementById('dayBadge');
const iconDisplay = document.getElementById('iconDisplay');
const quoteText = document.getElementById('quoteText');
const recipientName = document.getElementById('recipientName');
const footerText = document.getElementById('footerText');
const mainCard = document.getElementById('mainCard');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const musicPlayer = document.getElementById('musicPlayer');
const bgMusic = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const petalsContainer = document.getElementById('petalsContainer');

// ============ INITIALIZATION ============
function init() {
    // Initialize global features first so they work even in "Coming Soon" mode
    createFloatingBackground();
    if (showDebugPanel) {
        createDebugPanel(); // Add debug panel only if enabled
    }
    setupMusicForDay();

    // Replay button
    document.getElementById('replayBtn').addEventListener('click', () => {
        gsap.to('#stage7', {
            opacity: 0, visibility: 'hidden', duration: 0.5, onComplete: () => {
                document.getElementById('stage7').style.display = 'none';
                playTimeline();
            }
        });
    });

    // Music control
    playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMusic(); });
    bgMusic.addEventListener('timeupdate', updateProgress);

    const todayIndex = getTodaysDayIndex();

    if (isDateLocked) {
        // Hide navigation in production - users can only see today's content
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        dayIndicator.style.display = 'none';

        if (todayIndex === -1) {
            showComingSoon();
            // Even if coming soon, we try to play music if configured (or just bg music)
            tryAutoPlayMusic();
            return;
        }
        currentDayIndex = todayIndex;
    } else {
        // Show navigation in debug/testing mode
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        dayIndicator.style.display = 'flex';
        currentDayIndex = 0; // Start at first day for testing
    }

    // Set up day content then play timeline
    populateDayContent(config.days[currentDayIndex]);
    createDayDots();

    // Music setup is already called above, but we might need to update source if day changed
    setupMusicForDay();
    // tryAutoPlayMusic(); // playAudioSafe handles this now to avoid race conditions
    playTimeline();
}

function populateDayContent(day) {
    // Update CSS theme
    document.documentElement.style.setProperty('--theme-color', day.themeColor);
    document.body.style.background = `linear-gradient(135deg, ${day.bgStart} 0%, ${day.bgMid} 50%, ${day.bgEnd} 100%)`;

    // Stage 2: Day announcement
    document.getElementById('stageIcon').textContent = day.icon;
    document.getElementById('stageDayTitle').textContent = `It's ${day.title}!`;

    // Stage 3: Typing text - now types in input bar first
    const waInputText = document.getElementById('waInputText');
    const typingText = document.getElementById('typingText');
    const typingMessage = `Happy ${day.title}! ${day.icon}`;

    // Set up input text for typing animation (using spread to properly handle emoji)
    waInputText.innerHTML = [...typingMessage].map(c => `<span>${c}</span>`).join('');
    waInputText.classList.remove('placeholder');

    // Prepare bubble for later
    typingText.innerHTML = typingMessage;
    typingText.style.display = 'none';

    // Stage 5: Reveal card
    document.getElementById('dayNumber').textContent = day.dayNumber;
    document.getElementById('dayBadge').textContent = `${day.date} • ${day.title}`;
    document.getElementById('daySubtitle').textContent = day.subtitle;

    const icons = day.icons || [day.icon, day.icon, day.icon];
    document.getElementById('iconDisplay').innerHTML = `
<div class="main-icon left">${icons[0]}</div>
<div class="main-icon center">${icons[1]}</div>
<div class="main-icon right">${icons[2]}</div>
`;

    document.getElementById('quoteText').innerHTML = day.quote;
    document.getElementById('recipientName').textContent = `— ${config.recipientName}`;
    document.getElementById('dayMessage').textContent = day.message;
    document.getElementById('footerText').textContent = `Happy ${day.title} • ${day.date}, ${config.year || 2026}`;

    // Add 'Read Letter' button if it's Valentine's Day and letter exists
    if (day.letter) {
        let letterBtn = document.getElementById('letterBtn');
        if (!letterBtn) {
            letterBtn = document.createElement('button');
            letterBtn.id = 'letterBtn';
            letterBtn.className = 'read-letter-btn';
            letterBtn.innerHTML = '💌 Read My Letter 💌';
            letterBtn.onclick = openLoveLetter;
            document.getElementById('dayMessage').parentNode.insertBefore(letterBtn, document.getElementById('footerText'));
        }
        letterBtn.style.display = 'inline-block';
    } else {
        const letterBtn = document.getElementById('letterBtn');
        if (letterBtn) letterBtn.style.display = 'none';
    }

    // Stage 4: Memories - Dynamic Injection
    const stage4 = document.getElementById('stage4');
    if (stage4 && day.memories) {
        stage4.innerHTML = day.memories.map((text, index) =>
            `<p class="idea idea-${index + 1}">${text}</p>`
        ).join('');
    }
}

function playTimeline() {
    const tl = gsap.timeline();

    // Try to play music when animation starts
    bgMusic.play().catch(() => {
        console.log('Click the music player to start audio');
    });

    // Reset all stages comprehensively
    resetAllStages();
    gsap.set('.idea', { opacity: 0, y: 20 });
    gsap.set('.typing-text span', { opacity: 0 });
    gsap.set('.typing-text', { y: 0, opacity: 1, scale: 1 });
    gsap.set('.wa-input-text span', { opacity: 0 });


    // Reset send button and message bubble for replay
    const sendBtn = document.querySelector('.fake-send-btn');
    const typingText = document.querySelector('.typing-text');
    if (sendBtn) {
        gsap.set(sendBtn, { scale: 1, opacity: 1 });
    }
    if (typingText) {
        typingText.classList.remove('sent');
    }


    // Stage 1: Greeting
    tl.to('#stage1', { opacity: 1, visibility: 'visible', duration: 1 })
        .from('.greeting-title', { y: 30, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' })
        .from('.greeting-sub', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .to('#stage1', { opacity: 0, visibility: 'hidden', duration: 0.5 }, '+=1.5')

        // Stage 2: Day Announcement
        .to('#stage2', { opacity: 1, visibility: 'visible', duration: 0.5 })
        .from('#stageIcon', { scale: 0, rotation: -180, duration: 0.6, ease: 'back.out(1.5)' })
        .from('#stageDayTitle', { opacity: 0, scale: 0.8, duration: 0.5 }, '-=0.3')
        .to('#stage2', { opacity: 0, visibility: 'hidden', duration: 0.5 }, '+=2')

        // Stage 3: Typing in input bar, then sending to bubble
        .to('#stage3', { opacity: 1, visibility: 'visible', duration: 0.3 })
        .from('.text-box', { scale: 0.8, opacity: 0, y: 30, duration: 0.6, ease: 'back.out(1.4)' })
        // Type in the input bar
        .to('.wa-input-text span', { opacity: 1, duration: 0.04, stagger: 0.06 })
        .to({}, { duration: 0.5 }) // Pause after typing
        // Press send button
        .to('.fake-send-btn', { scale: 0.9, duration: 0.1 })
        .to('.fake-send-btn', { scale: 1.05, duration: 0.15 })
        // Clear input and show message bubble
        .add(() => {
            const waInput = document.getElementById('waInputText');
            const typingText = document.getElementById('typingText');
            waInput.innerHTML = 'Type a message';
            waInput.classList.add('placeholder');
            typingText.style.display = 'block';
            typingText.classList.add('sent');
        })
        .from('#typingText', { scale: 0.8, opacity: 0, y: 20, duration: 0.3, ease: 'back.out(1.2)' })
        .to({}, { duration: 1 }) // Show the sent message
        .to('#stage3', { opacity: 0, visibility: 'hidden', duration: 0.4 })

        // Stage 4: Dynamic Memories
        .to('#stage4', { opacity: 1, visibility: 'visible', duration: 1 });

    // Animate all visible .idea elements dynamically
    const ideas = document.querySelectorAll('#stage4 .idea');
    if (ideas.length > 0) {
        ideas.forEach((idea, index) => {
            // Animate In
            tl.to(idea, { opacity: 1, y: 0, duration: 1 });

            // Hold Logic
            let holdTime = 3;
            if (idea.textContent.length > 40) holdTime = 4; // Longer text = longer read

            // Animate Out
            tl.to(idea, { opacity: 0, duration: 0.5 }, `+=${holdTime}`);
        });
    } else {
        tl.to({}, { duration: 1 }); // Fallback if no ideas
    }

    tl.to('#stage4', { opacity: 0, visibility: 'hidden', duration: 1 });

    // Check for special interactive days
    const isProposeDayActive = currentDayIndex === 1; // Feb 8 - Propose Day
    const isTeddyDayActive = currentDayIndex === 3;   // Feb 10 - Teddy Day
    const isValentineDayActive = currentDayIndex === 7; // Feb 14 - Valentine's Day

    if (isProposeDayActive) {
        // Show proposal stage and wait for user interaction
        tl.add(() => showProposalStage());
    } else if (isTeddyDayActive) {
        // Show teddy gift stage and wait for user interaction
        tl.add(() => showTeddyStage());
    } else if (isValentineDayActive) {
        // Show special Valentine question
        tl.add(() => showValentineStage());
    } else {
        // Normal flow - go straight to reveal card
        addRevealCardAnimation(tl);
    }
}

// ============ VALENTINE INTERACTION (Feb 14) ============
function showValentineStage() {
    const stageValentine = document.getElementById('stageValentine');
    stageValentine.style.display = 'flex';

    gsap.to('#stageValentine', { opacity: 1, visibility: 'visible', duration: 0.5 });
    gsap.from('.valentine-container', { scale: 0.8, opacity: 0, y: 30, duration: 0.8, ease: 'back.out(1.4)' });

    const vYes = document.getElementById('valentineYes');
    const vNo = document.getElementById('valentineNo');

    // YES Button -> Grand Romantic Celebration! 💕
    vYes.onclick = () => {
        // MASSIVE Celebration - Fireworks + Hearts Rain + Confetti
        createFireworks();
        createHeartsRain();

        // Continuous confetti burst
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                createConfetti(x, y);
            }, i * 80);
        }

        // Multiple celebration waves
        for (let wave = 0; wave < 5; wave++) {
            setTimeout(() => createCelebration(), wave * 300);
        }

        // More fireworks after a moment
        setTimeout(() => createFireworks(), 1500);
        setTimeout(() => createHeartsRain(), 2000);

        // Transition to Final Card with longer delay for celebration
        gsap.to('#stageValentine', {
            opacity: 0, visibility: 'hidden', duration: 0.8, delay: 2.5, onComplete: () => {
                const tl = gsap.timeline();
                addRevealCardAnimation(tl);
            }
        });
    };

    // NO Button -> Runaway (Harder to catch)
    vNo.onmouseover = vNo.ontouchstart = () => {
        const container = stageValentine.querySelector('.valentine-container');
        const maxX = window.innerWidth / 2 - vNo.offsetWidth;
        const maxY = window.innerHeight / 2 - vNo.offsetHeight;

        const newX = (Math.random() - 0.5) * maxX * 1.5;
        const newY = (Math.random() - 0.5) * maxY * 1.5;

        gsap.to(vNo, { x: newX, y: newY, duration: 0.2, ease: 'power2.out' });
    };
}

// ============ PROPOSAL INTERACTION ============
function showProposalStage() {
    const stageProposal = document.getElementById('stageProposal');
    stageProposal.style.display = 'flex';

    gsap.to('#stageProposal', { opacity: 1, visibility: 'visible', duration: 0.5 });
    gsap.from('.proposal-container', { scale: 0.8, opacity: 0, y: 30, duration: 0.6, ease: 'back.out(1.4)' });

    // Setup button handlers
    const yesBtn = document.getElementById('proposalYes');
    const noBtn = document.getElementById('proposalNo');

    // Yes button - celebrate!
    yesBtn.onclick = () => {
        // Celebrate immediately!
        createFireworks();
        createHeartsRain();
        createCelebration();

        // Continuous confetti burst
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                createConfetti(x, y);
            }, i * 100);
        }

        gsap.to('#stageProposal', {
            opacity: 0, visibility: 'hidden', duration: 0.3, onComplete: () => {
                gsap.to('#proposalResponse', { opacity: 1, visibility: 'visible', duration: 0.5 });
                gsap.from('.response-icon', { scale: 0, rotation: 360, duration: 0.8, ease: 'back.out(2)' });
                gsap.from('.response-text', { opacity: 0, y: 20, duration: 0.5, delay: 0.3 });
                gsap.from('.response-sub', { opacity: 0, duration: 0.4, delay: 0.5 });

                // After celebration message, continue to reveal card
                setTimeout(() => {
                    gsap.to('#proposalResponse', {
                        opacity: 0, visibility: 'hidden', duration: 0.5, onComplete: () => {
                            const tl = gsap.timeline();
                            addRevealCardAnimation(tl);
                        }
                    });
                }, 3000);
            }
        });
    };

    // No button - run away! 😄
    noBtn.onmouseover = noBtn.ontouchstart = () => {
        const container = stageProposal.querySelector('.proposal-container');
        const maxX = container.offsetWidth / 2 - noBtn.offsetWidth;
        const maxY = container.offsetHeight / 3;

        const newX = (Math.random() - 0.5) * maxX * 2;
        const newY = (Math.random() - 0.5) * maxY * 2;

        gsap.to(noBtn, {
            x: newX,
            y: newY,
            duration: 0.2,
            ease: 'power2.out'
        });
    };
}

// ============ TEDDY GIFT INTERACTION ============
function showTeddyStage() {
    const stageTeddy = document.getElementById('stageTeddy');
    stageTeddy.style.display = 'flex';

    gsap.to('#stageTeddy', { opacity: 1, visibility: 'visible', duration: 0.5 });
    gsap.from('.teddy-gift-container', { scale: 0.8, opacity: 0, y: 30, duration: 0.6, ease: 'back.out(1.4)' });

    const giftBox = document.getElementById('giftBox');
    const giftWrapper = document.getElementById('giftWrapper');
    const teddyReveal = document.getElementById('teddyReveal');

    giftBox.onclick = () => {
        giftBox.classList.add('opened');
        giftBox.textContent = '🎊';

        gsap.to(giftWrapper, {
            opacity: 0, scale: 0.5, duration: 0.4, onComplete: () => {
                giftWrapper.style.display = 'none';
                teddyReveal.classList.add('show');

                // Create mini celebration
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => createConfetti(
                        window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                        window.innerHeight / 2
                    ), i * 100);
                }

                // Continue to reveal card after a moment
                setTimeout(() => {
                    gsap.to('#stageTeddy', {
                        opacity: 0, visibility: 'hidden', duration: 0.5, onComplete: () => {
                            const tl = gsap.timeline();
                            addRevealCardAnimation(tl);
                        }
                    });
                }, 3500);
            }
        });
    };
}

// ============ REVEAL CARD ANIMATION (Extracted for reuse) ============
function addRevealCardAnimation(tl) {
    tl.to('#stage5', { opacity: 1, visibility: 'visible', duration: 0.5 })
        .from('.reveal-card', { scale: 0.8, opacity: 0, y: 50, duration: 1, ease: 'back.out(1.4)' })
        .from('.day-number', { opacity: 0, y: -10, duration: 0.3 }, '-=0.5')
        .from('.day-badge', { opacity: 0, scale: 0.8, duration: 0.4 }, '-=0.3')
        .from('.subtitle', { opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.main-icon', { scale: 0, rotation: -45, stagger: 0.2, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
        .from('.quote', { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
        .from('.name', { opacity: 0, letterSpacing: '15px', duration: 0.8 }, '-=0.3')
        .from('.message', { opacity: 0, x: -20, duration: 0.5 }, '-=0.3')
        .from('.footer', { opacity: 0, duration: 0.4 }, '-=0.2')
        // Celebration
        .add(() => createCelebration(), '-=0.5')
        // Hold for reading
        .to({}, { duration: 8 })
        // Fade out card
        .to('#stage5', { opacity: 0, visibility: 'hidden', duration: 0.8 })
        // Show End Screen (Stage 7)
        .add(() => {
            const stage7 = document.getElementById('stage7');
            stage7.style.display = 'flex';
        })
        .to('#stage7', { opacity: 1, visibility: 'visible', duration: 0.8 });
}

function createCelebration() {
    const container = document.getElementById('celebrationContainer');
    container.innerHTML = '';
    const day = config.days[currentDayIndex];
    const symbols = ['🎈', '🎉', '✨', '💖', '🎊', ...day.petalSymbols.slice(0, 3)];

    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        balloon.style.animationDuration = `${3 + Math.random() * 3}s`;
        container.appendChild(balloon);
    }
}


function showComingSoon() {
    const overlay = document.getElementById('comingSoonOverlay');
    const csName = document.getElementById('csName');
    if (csName) csName.textContent = config.recipientName;

    overlay.classList.add('visible');
    document.getElementById('stagesContainer').style.display = 'none';
    document.getElementById('musicPlayer').style.display = 'flex'; // Show player for music control

    createPetals();
    setupMusicForDay(); // Trigger default music
    startCountdown(); // Start the countdown timer
}

// ============ COUNTDOWN TIMER ============
let countdownInterval = null;

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    let targetDate;
    let labelText;

    // Determine target: next Feb 7 or next year's Feb 7
    if (month < 2 || (month === 2 && day < 7)) {
        // Before Feb 7 this year
        targetDate = new Date(year, 1, 7, 0, 0, 0); // Feb 7 this year
        labelText = "Valentine's Week begins in:";
    } else if (month === 2 && day >= 7 && day <= 14) {
        // During Valentine's week (shouldn't reach here normally)
        targetDate = new Date(year, 1, 7, 0, 0, 0);
        labelText = "Valentine's Week is here! 💕";
    } else {
        // After Feb 14 - count to next year
        targetDate = new Date(year + 1, 1, 7, 0, 0, 0); // Feb 7 next year
        labelText = "Valentine's Week returns in:";
    }

    const labelEl = document.getElementById('countdownLabel');
    if (labelEl) labelEl.textContent = labelText;

    // Update countdown every second
    updateCountdown(targetDate);
    countdownInterval = setInterval(() => updateCountdown(targetDate), 1000);
}

function updateCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        // Countdown finished - refresh page
        document.getElementById('countDays').textContent = '00';
        document.getElementById('countHours').textContent = '00';
        document.getElementById('countMins').textContent = '00';
        document.getElementById('countSecs').textContent = '00';
        if (countdownInterval) clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countDays').textContent = String(days).padStart(2, '0');
    document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countMins').textContent = String(mins).padStart(2, '0');
    document.getElementById('countSecs').textContent = String(secs).padStart(2, '0');
}

// ============ SAKURA PETALS (Cherry Blossom Effect) ============
let sakuraInterval = null;

function createPetals() {
    const container = document.getElementById('sakuraContainer');
    if (!container) return;

    // Clear any existing petals
    stopPetals();

    // Sakura SVGs to use
    const sakuraSources = [
        'assets/svgs/cherry-blossom.svg',
        'assets/svgs/sakura-petal.svg',
        'assets/svgs/sakura-branch.svg'
    ];

    // Initial burst of petals
    for (let i = 0; i < 25; i++) {
        setTimeout(() => spawnSakuraPetal(container, sakuraSources), i * 200);
    }

    // Continuous petal spawning
    sakuraInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            spawnSakuraPetal(container, sakuraSources);
        }
    }, 500);
}

function spawnSakuraPetal(container, sources) {
    const petal = document.createElement('img');
    petal.src = sources[Math.floor(Math.random() * sources.length)];
    petal.className = 'sakura-petal';

    // Random horizontal position
    petal.style.left = `${Math.random() * 100}%`;

    // Random size (smaller petals for variety)
    const size = 20 + Math.random() * 40;
    petal.style.width = `${size}px`;
    petal.style.height = 'auto';

    // Random animation timing for natural look
    const fallDuration = 8 + Math.random() * 12; // 8-20s to fall
    const swayDuration = 2 + Math.random() * 4; // 2-6s sway cycle
    const delay = Math.random() * 5;

    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.animationDelay = `-${delay}s, -${Math.random() * 3}s`;

    // Random opacity variation
    petal.style.opacity = 0.5 + Math.random() * 0.4;

    container.appendChild(petal);

    // Remove petal after animation completes
    setTimeout(() => {
        if (petal.parentNode) {
            petal.remove();
        }
    }, (fallDuration + delay) * 1000);
}

function stopPetals() {
    if (sakuraInterval) {
        clearInterval(sakuraInterval);
        sakuraInterval = null;
    }
    const container = document.getElementById('sakuraContainer');
    if (container) {
        container.innerHTML = '';
    }
}

function hideComingSoon() {
    const overlay = document.getElementById('comingSoonOverlay');
    overlay.classList.remove('visible');
    document.getElementById('stagesContainer').style.display = 'block';
    document.getElementById('musicPlayer').style.display = 'flex';
    stopPetals(); // Stop sakura when leaving Coming Soon
}



function createDayDots() {
    config.days.forEach((day, index) => {
        const dot = document.createElement('div');
        dot.className = 'day-dot';
        dot.title = `${day.date} - ${day.title}`;
        dot.addEventListener('click', () => goToDay(index));
        dayIndicator.appendChild(dot);
    });
}

function updateDay(index, animate = true) {
    const day = config.days[index];

    if (animate) {
        mainCard.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            applyDayContent(day, index);
            mainCard.style.animation = 'slideIn 0.5s ease forwards';
            resetAnimations();
            setTimeout(() => updateDebugInfo(), 100);
        }, 300);
    } else {
        applyDayContent(day, index);
    }

    updatePetals(day.petalSymbols);
}

function applyDayContent(day, index) {
    // Update CSS variables
    document.documentElement.style.setProperty('--theme-color', day.themeColor);
    document.body.style.background = `linear-gradient(135deg, ${day.bgStart} 0%, ${day.bgMid} 50%, ${day.bgEnd} 100%)`;

    // Update new storytelling content
    document.getElementById('dayNumber').textContent = day.dayNumber || `Day ${index + 1}`;
    document.getElementById('daySubtitle').textContent = day.subtitle || '';
    document.getElementById('dayMessage').textContent = day.message || '';

    // Update content
    dayBadge.textContent = `${day.date} • ${day.title}`;
    quoteText.innerHTML = day.quote;
    recipientName.textContent = `— ${config.recipientName}`;
    footerText.textContent = `Happy ${day.title} • ${day.date}, 2026`;

    // Update icons (use multiple if available)
    const icons = day.icons || [day.icon, day.icon, day.icon];
    iconDisplay.innerHTML = `
<div class="main-icon left">${icons[0]}</div>
<div class="main-icon center">${icons[1] || icons[0]}</div>
<div class="main-icon right">${icons[2] || icons[0]}</div>
`;

    // Update dots
    document.querySelectorAll('.day-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentDayIndex = index;
}

function resetAnimations() {
    document.querySelectorAll('.main-icon').forEach((el, i) => {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = `roseBloom 2s ease forwards ${0.5 + i * 0.3}s`;
    });

    const subtitle = document.getElementById('daySubtitle');
    subtitle.style.animation = 'none';
    subtitle.offsetHeight;
    subtitle.style.animation = 'fadeIn 1.5s ease 0.3s forwards';

    quoteText.style.animation = 'none';
    quoteText.offsetHeight;
    quoteText.style.animation = 'fadeUp 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards';

    recipientName.style.animation = 'none';
    recipientName.offsetHeight;
    recipientName.style.animation = 'nameGlow 3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 2.5s';

    const message = document.getElementById('dayMessage');
    message.style.animation = 'none';
    message.offsetHeight;
    message.style.animation = 'fadeUp 1.5s ease 3s forwards';

    footerText.style.animation = 'none';
    footerText.offsetHeight;
    footerText.style.animation = 'fadeIn 2s ease 3.5s forwards';
}


// ============ BACKGROUND ANIMATION ============
// ============ BACKGROUND ANIMATION (PHYSICS SYSTEM) ============
const floatingIcons = [];
const PHYSICS_BOUNDS = { margin: -100 }; // Allow icons to go off-screen before removal

function createFloatingBackground() {
    const container = document.getElementById('background-animation');
    let icons = config.floatingIcons || [
        'assets/svgs/heart.svg',
        'assets/svgs/balloon.svg',
        'assets/svgs/happy.svg'
    ];

    // Use day-specific floating icons if defined
    if (currentDayIndex >= 0 && config.days[currentDayIndex] && config.days[currentDayIndex].floatingIcons) {
        icons = config.days[currentDayIndex].floatingIcons;
    } else if (currentDayIndex >= 0) {
        // Filter out sakura for generic days if not overridden
        icons = icons.filter(icon =>
            !icon.includes('cherry-blossom') &&
            !icon.includes('sakura-petal') &&
            !icon.includes('sakura-branch')
        );
    }

    // Initial spawns using physics
    for (let i = 0; i < 20; i++) {
        spawnFloatingIcon(container, icons, true);
    }

    // Continuous spawning
    setInterval(() => {
        if (document.visibilityState === 'visible' && floatingIcons.length < 40) {
            spawnFloatingIcon(container, icons);
        }
    }, 2000);

    // Start Physics Loop
    requestAnimationFrame(physicsLoop);
}

function physicsLoop() {
    floatingIcons.forEach((iconData, index) => {
        // Update Position
        iconData.x += iconData.vx;
        iconData.y += iconData.vy;

        // Wall Collisions (Bounce)
        if (iconData.x <= 0 || iconData.x + iconData.size >= window.innerWidth) {
            iconData.vx *= -1;
            iconData.x = Math.max(0, Math.min(iconData.x, window.innerWidth - iconData.size));
        }

        // Remove if off-screen vertically (with buffer)
        if (iconData.y < PHYSICS_BOUNDS.margin || iconData.y > window.innerHeight - PHYSICS_BOUNDS.margin) {
            iconData.element.remove();
            floatingIcons.splice(index, 1);
            return;
        }

        // Object Collisions (Bounce off each other)
        for (let j = index + 1; j < floatingIcons.length; j++) {
            const other = floatingIcons[j];
            const dx = iconData.x - other.x;
            const dy = iconData.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (iconData.size + other.size) * 0.8; // Collision distance

            if (distance < minDistance) {
                // Elastic collision
                [iconData.vx, other.vx] = [other.vx, iconData.vx];
                [iconData.vy, other.vy] = [other.vy, iconData.vy];

                // Push apart to prevent overlap
                const angle = Math.atan2(dy, dx);
                const push = 1;
                iconData.x += Math.cos(angle) * push;
                iconData.y += Math.sin(angle) * push;
                other.x -= Math.cos(angle) * push;
                other.y -= Math.sin(angle) * push;
            }
        }

        // Apply to DOM
        iconData.element.style.transform = `translate(${iconData.x}px, ${iconData.y}px)`;
    });

    requestAnimationFrame(physicsLoop);
}

function spawnFloatingIcon(container, icons, initial = false) {
    const iconWrapper = document.createElement('div');
    const img = document.createElement('img');
    img.src = icons[Math.floor(Math.random() * icons.length)];
    iconWrapper.appendChild(img);

    const size = 30 + Math.random() * 40;
    img.style.width = `${size}px`;
    img.className = 'floating-icon';

    iconWrapper.style.position = 'absolute';
    iconWrapper.style.left = '0';
    iconWrapper.style.top = '0';
    iconWrapper.style.width = `${size}px`;
    iconWrapper.style.height = `${size}px`;
    iconWrapper.style.pointerEvents = 'none';

    // Random Direction & Speed
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.2 + Math.random() * 0.4; // Very gentle speed

    let startX, startY;

    if (initial) {
        startX = Math.random() * (window.innerWidth - size);
        startY = Math.random() * (window.innerHeight - size);
    } else {
        // Spawn from edges
        if (Math.random() < 0.5) {
            startX = Math.random() * window.innerWidth;
            startY = Math.random() < 0.5 ? window.innerHeight + 50 : -50;
        } else {
            startX = Math.random() < 0.5 ? -50 : window.innerWidth + 50;
            startY = Math.random() * window.innerHeight;
        }
    }

    // CSS Animation class for internal sway (no translation)
    const cssAnims = ['float-up', 'float-down', 'drift-left', 'drift-right'];
    img.classList.add(cssAnims[Math.floor(Math.random() * cssAnims.length)]);
    img.style.animationDuration = `${20 + Math.random() * 20}s`;

    container.appendChild(iconWrapper);

    floatingIcons.push({
        element: iconWrapper,
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size
    });

    // Cleanup safety net (in case visual logic fails) - 2 mins
    setTimeout(() => {
        if (iconWrapper.parentNode) iconWrapper.remove();
    }, 120000);
}

function setupMusicForDay() {
    // Use default music for outside Valentine's Week
    if (currentDayIndex < 0 || currentDayIndex === undefined) {
        const defaultSrc = config.defaultMusic || 'assets/music/default-bg.mp3';
        if (bgMusic.src.indexOf(defaultSrc) === -1) {
            playAudioSafe(defaultSrc);
        }
        return;
    }

    const day = config.days[currentDayIndex];
    let source = day.music;

    if (!source && config.musicList && config.musicList.length > 0) {
        source = config.musicList[Math.floor(Math.random() * config.musicList.length)];
    }

    if (source && bgMusic.src.indexOf(source) === -1) {
        playAudioSafe(source);
    }
}

function playAudioSafe(src) {
    bgMusic.pause();
    bgMusic.src = src;
    bgMusic.load();

    // Wait for audio to be ready to prevent race conditions on slow data
    const playHandler = () => {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    isPlaying = true;
                    updateMusicIcon();
                })
                .catch(e => {
                    console.log("Playback deferred/blocked:", e);
                    if (e.name === 'NotAllowedError') {
                        // Show consent modal if blocked
                        const modal = document.getElementById('musicConsentModal');
                        if (modal) modal.classList.add('visible');
                    }
                });
        }
        bgMusic.removeEventListener('canplaythrough', playHandler);
    };

    bgMusic.addEventListener('canplaythrough', playHandler);

    // Error handling fallback
    bgMusic.onerror = function () {
        console.warn("Audio source failed:", src);
        if (src !== 'assets/music/rose-day.mp3') {
            playAudioSafe('assets/music/rose-day.mp3'); // Fallback
        }
    };
}

function tryAutoPlayMusic() {
    bgMusic.play().then(() => {
        isPlaying = true;
        updateMusicIcon();
    }).catch(e => {
        console.log("Autoplay blocked by browser, waiting for user interaction");
        const modal = document.getElementById('musicConsentModal');
        const btn = document.getElementById('musicConsentBtn');

        modal.classList.add('visible');

        // Function to start music and hide modal
        const startMusicAndHideModal = () => {
            bgMusic.play().then(() => {
                isPlaying = true;
                updateMusicIcon();
                modal.classList.remove('visible');
                // Remove the document click listener after music starts
                document.removeEventListener('click', startMusicAndHideModal);
                document.removeEventListener('touchstart', startMusicAndHideModal);
            }).catch(err => console.log("Still blocked:", err));
        };

        // Button click
        btn.onclick = startMusicAndHideModal;

        // Also start music on any click/touch anywhere on the page
        document.addEventListener('click', startMusicAndHideModal, { once: true });
        document.addEventListener('touchstart', startMusicAndHideModal, { once: true });
    });
}

// ============ NAVIGATION ============
function goToDay(index) {
    if (index === currentDayIndex) return;
    updateDay(index);
}

function navigate(direction) {
    let newIndex = currentDayIndex + direction;
    if (newIndex < 0) newIndex = config.days.length - 1;
    if (newIndex >= config.days.length) newIndex = 0;

    currentDayIndex = newIndex;

    // Kill all running animations
    gsap.globalTimeline.clear();

    // Reset
    populateDayContent(config.days[currentDayIndex]);
    createFloatingBackground(); // re-init bg if needed (optional)
    setupMusicForDay();
    playTimeline();
}

// ============ PARALLAX ============
function setupParallax() {
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
        mainCard.style.transform = `
  perspective(1000px)
  rotateY(${xAxis}deg)
  rotateX(${yAxis}deg)
  translateY(-5px)
  scale(1.005)
`;
    });

    document.addEventListener('mouseleave', () => {
        mainCard.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    });
}

// ============ MUSIC ============
function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicPlayer.classList.remove('active');
    } else {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
        musicPlayer.classList.add('active');
    }
    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = `<i class="fas fa-${isPlaying ? 'pause' : 'play'}"></i>`;
}

function updateProgress() {
    const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
    progressBar.style.width = `${progress}%`;
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));
    playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMusic(); });
    bgMusic.addEventListener('timeupdate', updateProgress);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === ' ') { e.preventDefault(); toggleMusic(); }
    });

    // Confetti on click
    document.body.addEventListener('click', (e) => {
        for (let i = 0; i < 5; i++) createConfetti(e.clientX, e.clientY);
    });
}

function createConfetti(x, y) {
    const day = config.days[currentDayIndex];
    const confetti = document.createElement('div');
    confetti.style.cssText = `
position: fixed; left: ${x}px; top: ${y}px;
font-size: 1.5rem; z-index: 9999; pointer-events: none;
`;
    confetti.innerHTML = day.petalSymbols[Math.floor(Math.random() * day.petalSymbols.length)];
    document.body.appendChild(confetti);

    const animation = confetti.animate([
        { transform: `translate(0, 0) rotate(0deg) scale(1)`, opacity: 1 },
        { transform: `translate(${Math.random() * 100 - 50}px, -150px) rotate(${Math.random() * 360}deg) scale(0)`, opacity: 0 }
    ], { duration: 1500, easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)' });

    animation.onfinish = () => confetti.remove();
}

// ============ VALENTINE'S DAY SPECIAL EFFECTS ============
function createFireworks() {
    const colors = ['#ff0040', '#ff69b4', '#ff1493', '#ff6b6b', '#ffd700', '#ff4500'];
    const container = document.body;

    for (let burst = 0; burst < 5; burst++) {
        setTimeout(() => {
            const x = 100 + Math.random() * (window.innerWidth - 200);
            const y = 100 + Math.random() * (window.innerHeight / 2);

            // Create burst of particles
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                const color = colors[Math.floor(Math.random() * colors.length)];
                const angle = (i / 20) * Math.PI * 2;
                const velocity = 50 + Math.random() * 100;
                const endX = Math.cos(angle) * velocity;
                const endY = Math.sin(angle) * velocity;

                particle.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    width: 8px;
                    height: 8px;
                    background: ${color};
                    border-radius: 50%;
                    z-index: 10000;
                    pointer-events: none;
                    box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
                `;
                container.appendChild(particle);

                particle.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${endX}px, ${endY + 50}px) scale(0)`, opacity: 0 }
                ], { duration: 1000 + Math.random() * 500, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' })
                    .onfinish = () => particle.remove();
            }
        }, burst * 400);
    }
}

function createHeartsRain() {
    const hearts = ['❤️', '💕', '💖', '💗', '💝', '💘', '🌹'];
    const container = document.body;

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: ${1 + Math.random() * 1.5}rem;
                z-index: 9998;
                pointer-events: none;
                opacity: 0.8;
            `;
            container.appendChild(heart);

            heart.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], { duration: 4000 + Math.random() * 3000, easing: 'linear' })
                .onfinish = () => heart.remove();
        }, i * 100);
    }
}

// ============ LOVE LETTER CONTROL ============
function openLoveLetter() {
    const modal = document.getElementById('letterModal');
    const letterText = document.getElementById('letterText');
    const day = config.days[currentDayIndex];

    if (day && day.letter) {
        letterText.innerHTML = day.letter;
        modal.style.display = 'flex';
        // Small delay to allow display flex to apply before opacity transition
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);

        // Play soft sound if available? maybe not to conflict with music
    }
}

function closeLoveLetter() {
    const modal = document.getElementById('letterModal');
    modal.classList.remove('visible');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
}

// ============ SECURITY (Disable right-click and text selection in production) ============
if (isDateLocked) {
    // Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
}

// ============ START ============
init();
