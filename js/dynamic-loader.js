/**
 * Dynamic Greeting Loader
 * Handles URL parameter-based personalization and form submission
 * Supports all editable fields: sender, receiver, subtitle, quote, message, memories
 */

(function () {
    'use strict';

    const API_BASE = '/api';

    // DOM elements for dynamic content
    const SELECTORS = {
        receiver: '[data-receiver]',
        sender: '[data-sender]',
        subtitle: '.greeting-sub, [data-subtitle]',
        quote: '[data-quote]',
        message: '[data-message]'
    };

    /**
     * Get URL parameter by name
     */
    function getUrlParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    /**
     * Safely set text content (XSS-safe)
     */
    function safeSetText(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.textContent = text;
        });
    }

    /**
     * Update Open Graph meta tags for better sharing
     */
    function updateMetaTags(data) {
        const title = `A Valentine's Message for ${data.receiver} 💕`;
        const description = `${data.sender} has a special message for you...`;

        document.title = title;

        // Update OG tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');

        if (ogTitle) ogTitle.setAttribute('content', title);
        if (ogDesc) ogDesc.setAttribute('content', description);
    }

    /**
     * Populate Stage 4 memories dynamically
     */
    function populateMemories(memories) {
        if (!memories || !Array.isArray(memories) || memories.length === 0) return;

        const stage4 = document.getElementById('stage4');
        if (!stage4) return;

        // Generate memory elements
        stage4.innerHTML = memories.map((text, index) =>
            `<p class="idea idea-${index + 1}">${escapeHtml(text)}</p>`
        ).join('');
    }

    /**
     * Escape HTML to prevent XSS (for innerHTML contexts)
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Populate the page with dynamic greeting data
     */
    function populateGreeting(data) {
        // Update receiver name elements
        if (data.receiver) {
            safeSetText(SELECTORS.receiver, data.receiver);
            // Also update with dash prefix for recipient name card
            const recipientName = document.getElementById('recipientName');
            if (recipientName) {
                recipientName.textContent = `— ${data.receiver}`;
            }
        }

        // Update sender name elements
        if (data.sender) {
            safeSetText(SELECTORS.sender, data.sender);
        }

        // Update subtitle
        if (data.subtitle) {
            safeSetText(SELECTORS.subtitle, data.subtitle);
        }

        // Update quote
        if (data.quote) {
            safeSetText(SELECTORS.quote, data.quote);
        }

        // Update day message
        if (data.day_message) {
            safeSetText(SELECTORS.message, data.day_message);
        }

        // Update memories / story lines
        if (data.memories) {
            populateMemories(data.memories);
        }

        // Update Coming Soon page name if visible
        const csName = document.getElementById('csName');
        if (csName && data.receiver) {
            csName.textContent = data.receiver;
        }

        // Update meta tags for sharing
        updateMetaTags(data);

        // Also update config for the existing system
        if (typeof config !== 'undefined') {
            config.recipientName = data.receiver;
            config.senderName = data.sender;
        }
    }

    /**
     * Fetch greeting data from API
     */
    async function fetchGreeting(id) {
        try {
            const response = await fetch(`${API_BASE}/get?id=${encodeURIComponent(id)}`);

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('Greeting not found, using defaults');
                    return null;
                }
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch greeting:', error);
            return null;
        }
    }

    /**
     * Submit new greeting to API
     */
    async function createGreeting(greetingData) {
        try {
            const response = await fetch(`${API_BASE}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(greetingData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create greeting');
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to create greeting:', error);
            throw error;
        }
    }

    /**
     * Show the create form
     */
    function showCreateForm() {
        const form = document.getElementById('createForm');
        if (form) {
            form.style.display = 'flex';
            document.body.classList.add('modal-open');
        }
    }

    /**
     * Hide the create form
     */
    function hideCreateForm() {
        const form = document.getElementById('createForm');
        if (form) {
            form.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    /**
     * Copy URL to clipboard
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        }
    }

    /**
     * Collect form data
     */
    function collectFormData() {
        const form = document.getElementById('greetingForm');
        return {
            sender: form.querySelector('#senderName').value.trim(),
            receiver: form.querySelector('#receiverName').value.trim(),
            day_index: parseInt(form.querySelector('#daySelect')?.value || '0', 10)
        };
    }

    /**
     * Handle preview button - applies custom content to the page without saving
     */
    function handlePreview() {
        const data = collectFormData();

        if (!data.sender || !data.receiver) {
            alert('Please enter both sender and receiver names to preview');
            return;
        }



        // 1. FIRST populate default day content
        if (typeof config !== 'undefined' && typeof populateDayContent === 'function') {
            const index = data.day_index;
            const dayConfig = config.days[index];

            if (dayConfig) {
                // Update global state if defined
                if (typeof currentDayIndex !== 'undefined') {
                    try { currentDayIndex = index; } catch (e) { }
                }

                // Hide Coming Soon overlay if active so we can see the content
                const csOverlay = document.getElementById('comingSoonOverlay');
                if (csOverlay) {
                    csOverlay.classList.remove('visible');
                    // Also ensure stages container is visible
                    const stages = document.getElementById('stagesContainer');
                    if (stages) stages.style.display = 'block';
                }

                // Populate content (resets to defaults)
                populateDayContent(dayConfig);
            }
        }

        // 2. THEN overwrite with custom user input
        populateGreeting({
            sender: data.sender,
            receiver: data.receiver
        });

        // Restart timeline if function exists
        if (typeof playTimeline === 'function') {
            playTimeline();
        } else if (typeof window.playTimeline === 'function') {
            window.playTimeline();
        }

        // Hide form to show preview
        hideCreateForm();

        // Show preview notice - using DOM elements for safety
        showPreviewNotice(data.receiver);
    }

    /**
     * Show preview notice with option to go back to editing
     */
    function showPreviewNotice(receiver) {
        // Remove existing notice if any
        const existing = document.getElementById('previewNotice');
        if (existing) existing.remove();

        const notice = document.createElement('div');
        notice.id = 'previewNotice';
        notice.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(199, 21, 133, 0.95); color: white; padding: 15px 25px; border-radius: 30px; font-family: "Cormorant Garamond", serif; font-size: 1.1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10001; display: flex; align-items: center; gap: 15px;';

        const textSpan = document.createElement('span');
        textSpan.textContent = `👁️ Preview for ${receiver}`;
        notice.appendChild(textSpan);

        const editBtn = document.createElement('button');
        editBtn.id = 'backToEditBtn';
        editBtn.textContent = '← Edit';
        editBtn.style.cssText = 'background: white; color: #C71585; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 600; cursor: pointer; font-family: inherit; margin-left: 10px;';
        notice.appendChild(editBtn);

        const createBtn = document.createElement('button');
        createBtn.id = 'confirmCreateBtn';
        createBtn.textContent = 'Create Link ✓';
        createBtn.style.cssText = 'background: #FFD700; color: #5A2035; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 600; cursor: pointer; font-family: inherit; margin-left: 10px;';
        notice.appendChild(createBtn);

        document.body.appendChild(notice);

        document.getElementById('backToEditBtn').addEventListener('click', () => {
            notice.remove();
            showCreateForm();
        });

        document.getElementById('confirmCreateBtn').addEventListener('click', async () => {
            notice.remove();
            // Submit the form
            const form = document.getElementById('greetingForm');
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            showCreateForm();
        });
    }

    /**
     * Handle form submission
     */
    async function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const resultDiv = document.getElementById('createResult');

        // Collect all form fields
        const data = collectFormData();

        if (!data.sender || !data.receiver) {
            alert('Please enter both sender and receiver names');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating...';

        try {
            const result = await createGreeting(data);

            // Show success with shareable URL
            if (resultDiv) {
                const shareText = encodeURIComponent(`💕 I made something special for you! Check it out: ${result.url}`);
                const shareUrl = encodeURIComponent(result.url);

                resultDiv.innerHTML = `
                    <div class="success-message">
                        <p>✨ Your Valentine's greeting is ready!</p>
                        <div class="share-url-container">
                            <input type="text" value="${result.url}" readonly id="shareUrl" class="share-url-input">
                            <button type="button" id="copyUrlBtn" class="copy-btn">📋 Copy</button>
                        </div>
                        <div class="social-share-buttons">
                            <a href="https://wa.me/?text=${shareText}" target="_blank" class="share-btn whatsapp" title="Share on WhatsApp">
                                <img src="assets/icons/icons8-whatsapp-50.png" alt="WhatsApp"> WhatsApp
                            </a>
                            <a href="https://t.me/share/url?url=${shareUrl}&text=${encodeURIComponent('💕 I made something special for you!')}" target="_blank" class="share-btn telegram" title="Share on Telegram">
                                <img src="assets/icons/icons8-telegram-50.png" alt="Telegram"> Telegram
                            </a>
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" class="share-btn facebook" title="Share on Facebook">
                                <img src="assets/icons/icons8-facebook-50.png" alt="Facebook"> Facebook
                            </a>
                            <button type="button" id="instaShareBtn" class="share-btn instagram" title="Copy for Instagram">
                                <img src="assets/icons/icons8-instagram-64.png" alt="Instagram"> Instagram
                            </button>
                        </div>
                        </div>
                    </div>
                `;

                resultDiv.style.display = 'block';

                // Add copy button handler
                document.getElementById('copyUrlBtn').addEventListener('click', async () => {
                    await copyToClipboard(result.url);
                    document.getElementById('copyUrlBtn').textContent = '✓ Copied!';
                    setTimeout(() => {
                        document.getElementById('copyUrlBtn').textContent = '📋 Copy';
                    }, 2000);
                });

                // Add Instagram share handler (copy and prompt)
                document.getElementById('instaShareBtn').addEventListener('click', async () => {
                    await copyToClipboard(result.url);
                    const btn = document.getElementById('instaShareBtn');
                    const originalContent = '<img src="assets/icons/icons8-instagram-64.png" alt="Instagram"> Instagram';
                    btn.innerHTML = '✓ Copied!';
                    setTimeout(() => {
                        btn.innerHTML = originalContent;
                    }, 3000);
                });
            }

            // Hide form fields
            form.querySelector('.form-fields').style.display = 'none';

        } catch (error) {
            alert('Failed to create greeting: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Link 💕';
        }
    }

    /**
     * Initialize the dynamic loader
     */
    async function init() {
        // Check if running from file system
        if (window.location.protocol === 'file:') {
            alert('⚠️ IMPORTANT: You are opening this file directly.\n\nPlease use the localhost server URL instead:\nhttp://localhost:3000\n\nThe form will NOT work from the file system.');
            return;
        }

        const greetingId = getUrlParam('id');

        if (greetingId) {
            // Viewing a shared greeting
            hideCreateForm();

            const data = await fetchGreeting(greetingId);
            if (data) {
                populateGreeting(data);

                // Switch to correct day theme if provided
                if (typeof data.day_index !== 'undefined' && typeof config !== 'undefined') {
                    const dayConfig = config.days[data.day_index];
                    if (dayConfig && typeof populateDayContent === 'function') {
                        populateDayContent(dayConfig);
                    }
                }
            }
            // If fetch fails, the page will use default config values
        } else {
            // No ID - show create form (after a brief delay to let the page load)
            setTimeout(() => {
                showCreateForm();
            }, 100);
        }
    }

    // Set up form handler when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('greetingForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }

        // Preview button handler
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', handlePreview);
        }


    });

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for potential external use
    window.DynamicLoader = {
        createGreeting,
        fetchGreeting,
        populateGreeting,
        showCreateForm
    };
})();
