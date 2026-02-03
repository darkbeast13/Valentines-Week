# Valentine's Week Journey 💕

A magical, interactive web experience to celebrate the 8 days of Valentine's Week. Surprise your special someone with a personalized digital gift featuring animations, music, and memories.

<div align="center">
  <a href="https://Deon-07.github.io/Valentines-Week">
    <img src="https://img.shields.io/badge/View_Live_Demo-FF0080?style=for-the-badge&logo=ko-fi&logoColor=white" alt="View Live Demo" height="40">
  </a>
</div>

## 🎥 Preview

<div style="display: flex; gap: 10px; justify-content: center;">
    <img src="preview/preview_1.png" width="48%" alt="Rose Day Preview">
    <img src="preview/preview_2.png" width="48%" alt="Rose Day Detail">
</div>
*A sneak peek of the experience!*

## ✨ Features

- **8 Days of Content**: From Rose Day (Feb 7) to Valentine's Day (Feb 14).
- **Interactive Storytelling**: WhatsApp-style typing effects, animations, and transitions.
- **Date-Locked Mode**: Users can only see the day that matches the current date - no peeking ahead!
- **Customizable**: Easily change names, messages, music, and images.
- **Configurable Year**: Set the year in config for easy reuse every year.
- **Music Player**: Plays romantic tunes (customizable per day).
- **Themed Music Player**: Player colors adapt to each day's palette with consistent readable text.
- **Responsive**: Works on mobile and desktop.
- **Improved Audio System**: Uses local files for reliable playback with a user-friendly "Enable Music" consent modal.
- **Coming Soon Mode**: Outside Feb 7–14, shows a countdown, sakura petals, and a themed cursor with hover animation.
- **Day-Specific Cursor**: Each day uses its own themed cursor icon across the experience.
- **Interactive Effects Toggle**: Turn day-themed visual bursts on/off from the main reveal card.
- **Letter Modal Usability**: Opening the love letter restores the default cursor for easy close/click.
- **Developer Debug Panel**: Test any day without waiting - click 🔧 in top-left corner.
- **Date Locking**: Prevents users from seeing future days (configurable).

---

## 🚀 How to Make Your Own Version

### Step 1: Fork the Repository

1. Click the **Fork** button at the top right of this page.
2. This creates a copy of the project in your own GitHub account.

### Step 2: Customize Key Details

You can edit the configuration directly on GitHub without downloading anything!

1. Open `config.js` in your forked repository.
2. Click the ✏️ (Edit) icon.
3. Update the following values:
   - `year`: The year (e.g., 2026) to display in the footer.
   - `recipientName`: Your partner's name.
   - `floatingIcons`: Change the background icons if you wish.
   - `musicList`: Add your own music URLs. Note: Propose Day now uses `@music_6.mp3` for a special touch!
   - **Daily Messages**: Scroll down to the `days` array and edit the `message`, `quote`, and `memories` for each day.

### Step 3: Enable GitHub Pages (Deploy)

1. Go to your repository **Settings**.
2. Click on **Pages** in the left sidebar.
3. Under **Build and deployment** > **Source**, select `Deploy from a branch`.
4. Select `main` branch and `/ (root)` folder.
5. Click **Save**.
6. Wait a minute, then refresh. You will see your live URL (e.g., `https://Deon-07.github.io/ValentineWeek`).
7. Send this Link to your Valentine! 💌

---

## ⚙️ Advanced Settings

### Configurable Year

In `config.js`, set the year for easy updating each Valentine's season:

```javascript
const config = {
    year: 2026,  // Change this each year!
    recipientName: "Your Partner's Name",
    // ...
};
```

### Real-time Mode (Date Locking)

By default, the site is set to **date-locked mode** where users can only see the day that matches the current date. Navigation arrows are hidden to prevent peeking ahead.

To switch to **testing mode** (view all days freely):

To switch to **testing mode** (view all days freely):

1. Open `js/main.js`.
2. Find the line:

   ```javascript
   let isDateLocked = true;
   ```

3. Change it to:

   ```javascript
   let isDateLocked = false;
   ```

4. Now you can navigate between all days for testing.

### Debug Panel (For Developers)

When the page loads, click the 🔧 icon in the top-left corner to open the Date Debug panel. This allows you to:

- Test any specific date (Feb 6-15)
- See the "Coming Soon" message (before Feb 7)
- Preview each day's content without waiting

---

## 💻 Running Locally (Optional)

If you want to edit on your computer:

1. Clone the repo: `git clone https://github.com/Deon-07/ValentineWeek.git`
2. Open `index.html` in your browser.
3. To view changes, refresh the page.

---

## 📝 Recent Updates

- **Start Page Link Preview**: Beautiful Open Graph preview image when sharing link on WhatsApp.
- **Magical Teddy Day**: Added a glowing golden aura and floating sparkles to the gift box for a magical feel.
- **Propose Day Celebration**: Clicking "Yes" now triggers a grand celebration with fireworks and hearts rain!
- **Mobile Optimizations**: Improved countdown timer and layouts for better viewing on small screens.
- **WhatsApp Typing Effect**: Message now types in the input bar first, then sends to the bubble - just like real WhatsApp!
- **Date-Locked Navigation**: When `isDateLocked = true`, users can only see today's content (no navigation arrows).
- **Configurable Year**: Set `year` in config.js for easy yearly updates.
- **Debug Panel**: Press 🔧 to test any date without changing code.
- **International Date Support**: Uses browser's local timezone for accurate date detection.

---

## 🎵 Audio System

We've improved the audio system to ensure music plays reliably on all devices:

1. **Local Assets**: Music is now loaded from the `assets/` folder (`music.mp3`, `music_2.mp3`, etc.) instead of external links, ensuring it always works.

## 🔧 Developer Tools (How to Change Date)

As a developer, you have two ways to change the date for testing:

### Method 1: The Debug Panel (Easiest)

1. Open the website.
2. Click the **Wrench Icon (🔧)** in the top-left corner.
3. Select any date (e.g., "Feb 8 - Propose Day") from the dropdown.
4. Click **Apply Date**.
5. The site will reload and behave *exactly* as if it were that day.

### Method 2: Manual Code Override

If you want to force a specific date via code:

1. Open `js/main.js`.
2. Find the variable `debugDate`.
3. Set it to the desired date string (e.g., `'2-14'` for Valentine's Day):

```javascript
// Set to null for automatic date detection
// Set to '2-7' through '2-14' to test specific days
let debugDate = '2-8'; 
```

### Method 3: Enabling/Disabling the Debug Icon

You can choose whether to show or hide the debug wrench icon 🔧 for the final user.

1. Open `js/main.js`.
2. Find the variable `showDebugPanel`.
3. Set it to `true` (show) or `false` (hide):

```javascript
let showDebugPanel = false; // Hide for production (Default)
// let showDebugPanel = true; // Show for development
```

## ❤️ Credits

- Animations & Original Concept: **Deon_07**
- Customization & Enhancements: Dip Kumar Ghosh

Stay happy and spread love! :)
