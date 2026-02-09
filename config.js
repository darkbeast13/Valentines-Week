// =========================================================================
// Valentine's Week Configuration
// =========================================================================
// Customize this file to personalize the experience!

const config = {
    // Year for Valentine's Week (change this each year!)
    year: 2026,

    // Your Name / Recipient Name
    recipientName: "My ADITI 🌸",

    // Background Icons (Floating)
    floatingIcons: [
        'assets/svgs/heart.svg',
        'assets/svgs/balloon.svg',
        'assets/svgs/happy.svg',
        'assets/svgs/rose.svg',
        'assets/svgs/cupid-arrow.svg',
        'assets/svgs/double-hearts.svg',
        'assets/svgs/love-letter.svg',
        'assets/svgs/ring.svg',
        'assets/svgs/white-flower.svg',
        'assets/svgs/cherry-blossom.svg',
        'assets/svgs/sakura-petal.svg',
        'assets/svgs/sakura-branch.svg'
    ],

    // Default music for outside Valentine's Week (before Feb 7 or after Feb 14)
    defaultMusic: "assets/music/default-bg.mp3",

    // Music Playlist (fallback if day-specific music is not set)
    musicList: [
        "assets/music/rose-day.mp3",
        "assets/music/hug-day.mp3",
        "assets/music/chocolate-day.mp3",
        "assets/music/teddy-day.mp3",
        "assets/music/promise-day.mp3",
        "assets/music/propose-day.mp3",
        "assets/music/kiss-day.mp3"
    ],

    // Day-by-Day Configuration
    days: [
        {
            date: "Feb 7",
            title: "Rose Day",
            dayNumber: "Day 1",
            subtitle: "Where Our Journey Begins...",
            icon: "🌹",
            icons: ["🌹", "🌷", "🌸"],
            quote: "In a garden of billions,<br>my heart chose you —<br>the rarest rose that ever bloomed.",
            message: "Every love story has a beginning. This rose marks the first chapter of our week together.",
            themeColor: "#ff007f",
            bgStart: "#FFF9FB", bgMid: "#FCE4EC", bgEnd: "#F8BBD0",
            petalSymbols: ["🌹", "❤️", "💕", "🌸", "🥀", "💐"],
            music: "assets/music/rose-day.mp3",
            memories: [
                "That's what I was going to send...",
                "But then I stopped.",
                "I remembered something <strong>special</strong>.",
                "Remember the <strong>Kash ful</strong> I gifted you? 🌸",
                "And that <strong>yellow flower</strong> I put on your ears... 🌼",
                "...when you were feeling sad?",
                "I'm so sorry that I'm not with you right now... 🥺",
                "But my heart is always right there beside you.",
                "Those little moments mean <span class='emphasis'>everything</span> to me ✨",
                "Because you deserve the <span class='emphasis'>world</span> 💕"
            ]
        },
        {
            date: "Feb 8",
            title: "Propose Day",
            dayNumber: "Day 2",
            subtitle: "A Question That Changed Everything...",
            icon: "💍",
            icons: ["💍", "💎", "✨"],
            quote: "I'm not asking for the world,<br>I'm asking for something greater —<br>I'm asking for you.",
            message: "Some questions don't need answers. They need courage. Today, I give you mine.",
            themeColor: "#ff4d4d",
            bgStart: "#FFF5F5", bgMid: "#FFE4E4", bgEnd: "#FFD0D0",
            petalSymbols: ["💍", "💎", "💖", "✨", "⭐", "🌟"],
            music: "assets/music/propose-day.mp3",
            memories: [
                "I've thought about this moment...",
                "A thousand times in my head.",
                "The way your eyes light up,",
                "The way your smile changes my world.",
                "I don't need a grand stage,",
                "Just you and me.",
                "So I have to ask...",
                "Will you walk this path with me?",
                "Not just today, but <span class='emphasis'>forever</span>? 💍"
            ]
        },
        {
            date: "Feb 9",
            title: "Chocolate Day",
            dayNumber: "Day 3",
            subtitle: "Sweetness That Never Fades...",
            icon: "🍫",
            icons: ["🍫", "🍬", "🧁"],
            quote: "You are the sweetness<br>I didn't know I was searching for —<br>now I can't imagine life without your taste.",
            message: "Like chocolate that melts on the tongue, you dissolved every wall around my heart.",
            themeColor: "#8b4513",
            bgStart: "#FFF8F0", bgMid: "#FFE8D0", bgEnd: "#F5D0A9",
            petalSymbols: ["🍫", "🍬", "🤎", "🧁", "🍰", "🍪"],
            floatingIcons: ['assets/svgs/heart.svg', 'assets/svgs/chocolate.svg', 'assets/svgs/balloon.svg'],
            music: "assets/music/chocolate-day.mp3",
            memories: [
                "Life can be bitter sometimes...",
                "But then there's you.",
                "Your laughter is my favorite treat.",
                "Your kindness is the sweetest thing I know.",
                "Remember the times we shared sweets?",
                "Or just smiled at each other?",
                "You add flavor to my dullest days.",
                "You are my <span class='emphasis'>Sweetest Addiction</span> 🍫"
            ]
        },
        {
            date: "Feb 10",
            title: "Teddy Day",
            dayNumber: "Day 4",
            subtitle: "Comfort in Every Moment...",
            icon: "🧸",
            icons: ["🧸", "🎀", "💛"],
            quote: "When distance stretches between us,<br>hold this close and remember —<br>my love travels through space and time.",
            message: "A teddy can't replace my arms, but it carries the warmth of every thought I have of you.",
            themeColor: "#e0ac69",
            bgStart: "#FFFAF0", bgMid: "#FFE8CC", bgEnd: "#FFD9B3",
            petalSymbols: ["🧸", "🤍", "💛", "🎀", "🌻", "🍯"],
            music: "assets/music/teddy-day.mp3",
            memories: [
                "Sometimes I wish I was a teddy...",
                "So I could be with you always.",
                "To hug you when you sleep,",
                "To comfort you when you cry.",
                "Distance keeps us apart now,",
                "But my warmth is always with you.",
                "Sending you the biggest, warmest...",
                "<span class='emphasis'>Bear Hug!</span> 🧸"
            ]
        },
        {
            date: "Feb 11",
            title: "Promise Day",
            dayNumber: "Day 5",
            subtitle: "Words Carved in Stone...",
            icon: "🤞",
            icons: ["🤞", "💜", "🔮"],
            quote: "I promise you mornings of gentle light,<br>evenings of peaceful silence,<br>and a lifetime of choosing you — every single day.",
            message: "Promises are fragile things. But the ones I make to you? They're written in my soul.",
            themeColor: "#9932cc",
            bgStart: "#FAF0FF", bgMid: "#E8D0FF", bgEnd: "#D8B0F0",
            petalSymbols: ["🤞", "💜", "🔮", "🌟", "⚡", "🦋"],
            music: "assets/music/promise-day.mp3",
            memories: [
                "They say promises are meant to be broken...",
                "But not mine.",
                "I promise to listen.",
                "I promise to support you.",
                "I promise to annoy you just a little bit 😉",
                "But mostly...",
                "I promise to <span class='emphasis'>Stay</span>.",
                "No matter what. 💜"
            ]
        },
        {
            date: "Feb 12",
            title: "Hug Day",
            dayNumber: "Day 6",
            subtitle: "Where Words Become Silence...",
            icon: "🤗",
            icons: ["🤗", "💗", "🌷"],
            quote: "Some feelings are too deep for words —<br>so I'll hold you tight,<br>and let my heartbeat speak instead.",
            message: "In the language of love, a hug says what a thousand words cannot. Feel this one across the miles.",
            themeColor: "#ff69b4",
            bgStart: "#FFF0F8", bgMid: "#FFD8EC", bgEnd: "#FFC0E0",
            petalSymbols: ["🤗", "💗", "🌷", "💝", "🌸", "💞"],
            music: "assets/music/hug-day.mp3",
            memories: [
                "There is magic in a hug.",
                "It heals everything.",
                "Remember how <strong>safe</strong> I felt?",
                "I miss the feeling of your arms.",
                "The safety I feel with you.",
                "I crave that warmth again.",
                "Wait for me...",
                "Because when I see you,",
                "I'm never letting go.",
                "<span class='emphasis'>TIGHTEST HUG!</span> 🤗"
            ]
        },
        {
            date: "Feb 13",
            title: "Kiss Day",
            dayNumber: "Day 7",
            subtitle: "Secrets Only Lips Can Tell...",
            icon: "💋",
            icons: ["💋", "😘", "💄"],
            quote: "A kiss is a secret<br>told to the mouth instead of the ear —<br>and yours is the only secret I want to keep.",
            message: "Tomorrow is the finale, but tonight... tonight is about the poetry of closeness.",
            themeColor: "#ff0000",
            bgStart: "#FFF0F0", bgMid: "#FFD0D0", bgEnd: "#FFB0B0",
            petalSymbols: ["💋", "❤️", "💄", "😘", "🌹", "💕"],
            music: "assets/music/kiss-day.mp3",
            memories: [
                "A kiss is not just a touch...",
                "Remember Dec 3?",
                "It's a promise.",
                "It's a whisper of love.",
                "Remember the <strong>spark</strong>?",
                "Sending you a gentle one on your forehead.",
                "To keep you safe.",
                "And a sweet one on your lips.",
                "To make you smile.",
                "Just thinking about it makes me <strong>blush</strong>.",
                "Happy <span class='emphasis'>Kiss Day</span> 💋"
            ]
        },
        {
            date: "Feb 14",
            title: "Valentine's Day",
            dayNumber: "The Finale",
            subtitle: "The Day Everything Comes Together...",
            icon: "❤️",
            icons: ["❤️", "💘", "💖"],
            quote: "You are my first thought at dawn,<br>my last whisper at night,<br>and every beautiful moment in between.",
            message: "8 days of love led to this moment. Happy Valentine's Day, Aditi. You are my forever.",
            themeColor: "#ff0040",
            bgStart: "#FFF0F5", bgMid: "#FFD0E0", bgEnd: "#FFB0C8",
            petalSymbols: ["❤️", "💘", "💕", "💗", "💖", "🌹", "🎉", "✨", "🎆"],
            music: "assets/music/valentine-day.mp3",       // Valentine's Day - Special!
            memories: [
                "We've walked through this week together...",
                "7 days of love. 7 promises kept.",
                "From roses to chocolates...",
                "From hugs to kisses...",
                "Every moment leading to <strong>this</strong>.",
                "You're not just my Valentine...",
                "You're my <span class='emphasis'>forever person</span>.",
                "My best friend. My soulmate.",
                "I choose you. Today. Tomorrow. <strong>Always</strong>.",
                "So here's my heart... 💝",
                "Will you keep it safe?",
                "Happy Valentine's Day, my love! ❤️"
            ],
            letter: `Aditi ,<br><br>
            They say seven days make a week, but these seven days with you have felt like a lifetime of happiness packed into moments. <br><br>
            From the first rose I wished to give you, to the promise I made to stand by you forever—every step has only deepened my certainty: <b>You are the one.</b><br><br>
            You are my laughter in happiness, my comfort in silence, and my strength in chaos. I don't just want you for a Valentine's Day; I want you for every single day that follows.<br><br>
            Thank you for being my peace and my home. I love you more than words can say.<br><br>
            Forever yours,<br>Nikhil`
        }
    ]
};
