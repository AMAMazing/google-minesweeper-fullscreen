(() => {
    // --- Configuration moved to the top-level scope ---
    const WIDGET_SELECTOR = '.rAChLe.onDwW';
    const TOGGLE_BUTTON_ID = 'minesweeper-fullscreen-toggle-btn';

    const initializeMinesweeperButton = () => {
        // --- Remaining Configuration ---
        const ICON_CONTAINER_SELECTOR = '.EYPL8e';
        const DIFFICULTY_SELECTOR = '[jsname="vs0Yb"]';
        const HEADER_SELECTOR = '.NWJp1d';
        const SCOREBOARD_CONTAINER_SELECTOR = '.b11qzc';
        const SCOREBOARD_SELECTOR = '.gW3fkb';
        const DROPDOWN_TEXT_SELECTOR = '.JfmvR span';
        const CUSTOM_STYLES_ID = 'minesweeper-custom-styles';
        const SCOREBOARD_STYLE_ID = 'minesweeper-scoreboard-styler';
        const FULLSCREEN_ACTIVE_CLASS = 'minesweeper-fullscreen-active';

        // --- SVG Icons ---
        const SVG_ENTER_FULLSCREEN = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="100 -850 800 800" fill="white"><path d="M 233 -112 v -121 H 112 v -97 h 218 v 218 h -97 Z m 397 0 v -218 h 218 v 97 H 727 v 121 h -97 Z M 112 -630 v -97 h 121 v -121 h 97 v 218 H 112 Z m 518 0 v -218 h 97 v 121 h 121 v 97 H 630 Z"/></svg>`;
        const SVG_EXIT_FULLSCREEN = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="100 -850 800 800" fill="white"><path d="M 112 -112 v -218 h 97 v 121 h 121 v 97 H 112 Z m 518 0 v -97 h 121 v -121 h 97 v 218 H 630 Z M 112 -630 v -218 h 218 v 97 H 209 v 121 h -97 Z m 639 0 v -121 H 630 v -97 h 218 v 218 h -97 Z"/></svg>`;

        if (document.getElementById(TOGGLE_BUTTON_ID)) return;

        const widget = document.querySelector(WIDGET_SELECTOR);
        const iconContainer = document.querySelector(ICON_CONTAINER_SELECTOR);
        if (!widget || !iconContainer) return;

        const updateScale = () => {
            if (!widget.classList.contains(FULLSCREEN_ACTIVE_CLASS)) return;
            // The scaling factor is now calculated to use the full available height/width.
            const scale = Math.min(window.innerWidth / widget.offsetWidth, window.innerHeight / widget.offsetHeight);
            widget.style.transform = `translate(-50%, -50%) scale(${scale})`;
        };

        const toggleFullScreen = () => {
            const toggleBtn = document.getElementById(TOGGLE_BUTTON_ID);
            const isFullScreen = widget.classList.contains(FULLSCREEN_ACTIVE_CLASS);

            if (isFullScreen) {
                widget.style.cssText = '';
                widget.classList.remove(FULLSCREEN_ACTIVE_CLASS);
            } else {
                widget.classList.add(FULLSCREEN_ACTIVE_CLASS);
                widget.style.position = 'fixed';
                widget.style.top = '50%';
                widget.style.left = '50%';
                widget.style.zIndex = '2147483647';
                updateScale();
            }
            if (toggleBtn) {
                toggleBtn.innerHTML = isFullScreen ? SVG_ENTER_FULLSCREEN : SVG_EXIT_FULLSCREEN;
            }
        };

        const styleSheet = document.createElement('style');
        styleSheet.id = CUSTOM_STYLES_ID;
        styleSheet.innerHTML = `
          #${TOGGLE_BUTTON_ID} {
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            width: 30px; height: 30px; position: absolute;
          }
          ${HEADER_SELECTOR} {
            display: flex; justify-content: space-between; align-items: center;
          }
          ${SCOREBOARD_CONTAINER_SELECTOR} {
            flex-grow: 1; display: flex; justify-content: center;
          }
          ${DROPDOWN_TEXT_SELECTOR} { color: black !important; }
          .UjBGL { color: #464646 !important; }
        `;
        document.head.appendChild(styleSheet);

        const toggleBtn = document.createElement('div');
        toggleBtn.id = TOGGLE_BUTTON_ID;
        toggleBtn.innerHTML = SVG_ENTER_FULLSCREEN;
        toggleBtn.setAttribute('aria-label', 'Toggle Fullscreen');
        toggleBtn.setAttribute('role', 'button');
        toggleBtn.setAttribute('tabindex', '0');

        toggleBtn.addEventListener('click', toggleFullScreen);
        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFullScreen();
            }
        });

        const firstIcon = iconContainer.firstChild;
        iconContainer.insertBefore(toggleBtn, firstIcon);

        const applyAdaptivePosition = () => {
            const difficultyEl = document.querySelector(DIFFICULTY_SELECTOR);
            if (!toggleBtn || !difficultyEl) return;
            const difficulty = difficultyEl.textContent.trim().toLowerCase();
            let xOffset = 52;
            const yOffset = 16;

            switch (difficulty) {
                case 'easy':   xOffset = 21; break;
                case 'medium': xOffset = 52; break;
                case 'hard':   xOffset = 73; break;
            }
            toggleBtn.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

            // --- Logic for moving the scoreboard ---
            let scoreboardStyle = document.getElementById(SCOREBOARD_STYLE_ID);
            if (difficulty === 'easy') {
                if (!scoreboardStyle) {
                    scoreboardStyle = document.createElement('style');
                    scoreboardStyle.id = SCOREBOARD_STYLE_ID;
                    document.head.appendChild(scoreboardStyle);
                }
                scoreboardStyle.innerHTML = `${SCOREBOARD_SELECTOR} { transform: translateX(-24px) !important; }`;
            } else {
                if (scoreboardStyle) {
                    scoreboardStyle.innerHTML = ''; // Clear styles for other modes
                }
            }
        };

        applyAdaptivePosition();

        const difficultyEl = document.querySelector(DIFFICULTY_SELECTOR);
        if (difficultyEl) {
            const difficultyObserver = new MutationObserver(applyAdaptivePosition);
            difficultyObserver.observe(difficultyEl, { subtree: true, childList: true });
        }

        const resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(widget);
        window.addEventListener('resize', updateScale);

        console.log('Minesweeper Fullscreen button (Final) added.');
    };

    const mainContentObserver = new MutationObserver(() => {
        // Now this observer can correctly access WIDGET_SELECTOR and TOGGLE_BUTTON_ID
        if (document.querySelector(WIDGET_SELECTOR) && !document.getElementById(TOGGLE_BUTTON_ID)) {
            initializeMinesweeperButton();
        }
    });

    const targetNode = document.body;
    if (targetNode) {
        mainContentObserver.observe(targetNode, { childList: true, subtree: true });
    }
    initializeMinesweeperButton();
})();