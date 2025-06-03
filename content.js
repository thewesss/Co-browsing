(async function () {
  // This function now also tries to return a distinct 'rawSessionId' for storage purposes
  async function getSessionDetailsFromAPI() {
    let linkIdentifier = null; // For constructing the shareableLink
    let apiMethodUsed = "API call initiated";
    let distinctSessionId = null; // For sessionStorage key

    try {
      let sessionInfo = null;
      if (typeof browser !== "undefined" && browser.virtualSession) {
        if (typeof browser.virtualSession.getSessionInfo === 'function') {
          console.log("Webfuse Onboarding Tour: Attempting browser.virtualSession.getSessionInfo()...");
          sessionInfo = await browser.virtualSession.getSessionInfo();
          apiMethodUsed = 'direct getSessionInfo()';
        } else if (typeof browser.virtualSession.apiRequest === 'function') {
          console.log("Webfuse Onboarding Tour: Attempting browser.virtualSession.apiRequest({ cmd: 'getSessionInfo' })...");
          sessionInfo = await browser.virtualSession.apiRequest({ cmd: 'getSessionInfo' });
          apiMethodUsed = 'apiRequest getSessionInfo';
        } else {
          console.warn("Webfuse Onboarding Tour: Neither direct getSessionInfo nor apiRequest methods are available on browser.virtualSession.");
          return { linkIdentifier: null, apiMethodUsed: "API methods unavailable", distinctSessionId: null };
        }

        console.log(`Webfuse Onboarding Tour: Raw sessionInfo (via ${apiMethodUsed}):`, JSON.stringify(sessionInfo, null, 2));

        // 1. Extract distinct session ID for storage key
        if (sessionInfo && typeof sessionInfo.sessionId === 'string' && sessionInfo.sessionId.trim() !== '') {
          distinctSessionId = sessionInfo.sessionId.trim();
        } else if (sessionInfo && typeof sessionInfo.id === 'string' && sessionInfo.id.trim() !== '') {
            // Fallback if 'sessionId' field is named 'id' or similar (less common for main session ID)
            distinctSessionId = sessionInfo.id.trim();
            console.log("Webfuse Onboarding Tour: Used 'sessionInfo.id' as distinctSessionId.");
        }
        // Add more checks here if the session ID field has other potential names

        // 2. Determine the best identifier for the shareable link
        if (sessionInfo && typeof sessionInfo.followerLink === 'string' && sessionInfo.followerLink.trim().startsWith('http')) {
          linkIdentifier = sessionInfo.followerLink;
          apiMethodUsed += ' - followerLink';
        } else if (sessionInfo && sessionInfo.space && typeof sessionInfo.space.link === 'string' && sessionInfo.space.link.trim().startsWith('http')) {
          // If space.link is specific (contains session ID) or no session ID to make it specific
          if ((distinctSessionId && sessionInfo.space.link.includes(distinctSessionId)) || !distinctSessionId) {
            linkIdentifier = sessionInfo.space.link;
            apiMethodUsed += ' - space.link (session specific or generic)';
          } else if (distinctSessionId) { // If space.link is generic and we have a session ID
            linkIdentifier = distinctSessionId; // Use this to construct with INVITE_URL_BASE
            apiMethodUsed += ' - sessionId (for constructing link with base)';
          } else { // space.link is generic, no session ID
             linkIdentifier = sessionInfo.space.link;
             apiMethodUsed += ' - space.link (generic fallback)';
          }
        } else if (distinctSessionId) { // If no followerLink or space.link, but we have a session ID
          linkIdentifier = distinctSessionId; // Use this to construct with INVITE_URL_BASE
          apiMethodUsed += ' - sessionId (primary for link with base)';
        } else {
          console.warn(`Webfuse Onboarding Tour: getSessionInfo (via ${apiMethodUsed}) did not return a usable 'followerLink', 'space.link', or 'sessionId' for link construction.`);
        }
      } else { 
        console.warn("Webfuse Onboarding Tour: browser.virtualSession object not found.");
        apiMethodUsed = "browser.virtualSession not found";
      }
    } catch (e) { 
      console.error('Webfuse Onboarding Tour: Error in getSessionDetailsFromAPI:', e);
      apiMethodUsed = "API call failed";
    }
    return { linkIdentifier, apiMethodUsed, distinctSessionId };
  }

  // --- Initial check for whether to show the tour ---
  const sessionDetails = await getSessionDetailsFromAPI();
  const storageKey = sessionDetails.distinctSessionId ? `wfCoBrowseTourShown_${sessionDetails.distinctSessionId}` : null;

  if (storageKey && sessionStorage.getItem(storageKey)) {
    console.log(`Webfuse Onboarding Tour: Tour already shown for session ${sessionDetails.distinctSessionId} (sessionStorage). Skipping.`);
    return; 
  }
  
  // Fallback to window flag if no reliable session ID was found for sessionStorage key
  const windowFlagKey = "__wfCoBrowseTourV5Shown"; // Incremented version for this logic
  if (!storageKey && window[windowFlagKey]) {
      console.log("Webfuse Onboarding Tour: No session ID for persistent storage, and tour shown for this window instance (window flag). Skipping.");
      return;
  }
  if (!storageKey) {
      console.warn("Webfuse Onboarding Tour: Could not get a reliable session ID for persistent 'shown' state. Tour will use a window flag (may show on new tabs in same session if script re-runs).");
  }
  window[windowFlagKey] = true; // Set window flag early as a fallback

  // --- Proceed with tour setup if not skipped ---
  const INVITE_URL_BASE = "https://webfuse.com/";
  let shareableLink = "";
  let determinationMethod = sessionDetails.apiMethodUsed; // Use method from sessionDetails
  let currentlyHighlightedElement = null;
  let arrowElement = null;

  if (sessionDetails.linkIdentifier) {
    if (sessionDetails.linkIdentifier.startsWith('http://') || sessionDetails.linkIdentifier.startsWith('https://')) {
        shareableLink = sessionDetails.linkIdentifier;
    } else { // Assume linkIdentifier is a session ID or path component
        if (INVITE_URL_BASE === "YOUR_WEBFUSE_INVITE_BASE_URL_HERE/" || !INVITE_URL_BASE.trim()) {
             console.error("Webfuse Onboarding Tour: CRITICAL - INVITE_URL_BASE is not configured! Using raw identifier as link, which is likely incorrect.");
             shareableLink = sessionDetails.linkIdentifier; 
             determinationMethod += " (INVITE_URL_BASE not configured)";
        } else {
            if (INVITE_URL_BASE.endsWith('/') && sessionDetails.linkIdentifier.startsWith('/')) {
                shareableLink = INVITE_URL_BASE + sessionDetails.linkIdentifier.substring(1);
            } else if (!INVITE_URL_BASE.endsWith('/') && !sessionDetails.linkIdentifier.startsWith('/')) {
                shareableLink = INVITE_URL_BASE + '/' + sessionDetails.linkIdentifier;
            } else { 
                shareableLink = INVITE_URL_BASE + sessionDetails.linkIdentifier; 
            }
        }
    }
  } else { // Fallback if API provided no linkIdentifier
    console.warn("Webfuse Onboarding Tour: API provided no linkIdentifier. Attempting DOM fallback methods for shareableLink.");
    try {
      if (window.top !== window.self && window.top.location && typeof window.top.location.href === 'string' &&
          (window.top.location.host.includes('webfuse.com') || window.top.location.host.includes('webfuse.space'))) {
        shareableLink = window.top.location.href; determinationMethod = 'Fallback (window.top.location.href)';
      } else { shareableLink = location.href; determinationMethod = 'Fallback (location.href)';}
    } catch (e) {
      shareableLink = location.href; determinationMethod = 'Fallback (location.href after error)';
      console.warn("Webfuse Onboarding Tour: Error accessing window.top.location, used location.href.", e);
    }
  }
  console.log(`Webfuse Onboarding Tour: Final shareable link determined via '${determinationMethod}': ${shareableLink}`);

  // --- Tour Data & State (same as before) ---
  const tourSteps = [
    {
        id: "welcome", title: "Welcome to Your Co-Browsing Session!",
        text: "You’ve entered a shared Webfuse space. This session allows you to browse any website together with teammates, customers, or collaborators — all in real time. No screen sharing, no installs. Just a shared session that syncs instantly across users.",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "Skip Intro", id: "skip-intro", type: "secondary" }]
    },
    {
        id: "whatis", title: "What Is Co-Browsing?",
        text: "Co-browsing means you're all looking at the same live website at the same time — and depending on permissions, each person can scroll, click, or type as if they were sitting side-by-side. Unlike screen share, you stay in control of your browser and your data.",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "Skip Intro", id: "skip-intro", type: "secondary" }]
    },
    {
        id: "whyuseful", title: "Why It’s Useful",
        text: "Sales teams use co-browsing for interactive product demos. Support teams guide users through confusing forms. Designers and QA teams review layouts together. It’s collaborative, fast, and secure — especially for websites you don’t control.",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "Skip Intro", id: "skip-intro", type: "secondary" }]
    },
    {
        id: "invite", title: "How to Invite Others",
        text: `Click the “Copy Link” button below. This link points to your active session — not just the space — so whoever opens it will join you right here, right now. <br><br>Your shareable link is:`,
        showLinkSharing: true,
        buttons: [{ text: "Copy Link", id: "copy", type: "primary" }, { text: "Tour Features", id: "next-features", type: "primary" }, { text: "Skip All", id: "skip-all", type: "secondary" }]
    },
    {
        id: "participantsBtn", title: "Session Participants", text: "This icon (usually top-left) shows how many people are in the session and their status.",
        targetSelector: "#webfuse-participants-btn", // Placeholder - REPLACE THIS
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    {
        id: "urlInput", title: "Navigate Together", text: "Use this bar to type a new website URL. Everyone in the session navigates there together.",
        targetSelector: "#webfuse-url-bar", // Placeholder - REPLACE THIS
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    {
        id: "controlBtn", title: "Take Control", text: "Click this (often a cursor icon) to request or take control for interaction on the current page.",
        targetSelector: ".webfuse-control-icon", // Placeholder - REPLACE THIS
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    {
        id: "drawBtn", title: "Annotate & Draw", text: "This pencil icon usually activates drawing mode, allowing you to make annotations directly on the page.",
        targetSelector: "button[aria-label='Draw']", // Placeholder - REPLACE THIS
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    { 
        id: "screenSizeBtn", title: "Adjust Screen Size", text: "This icon (often a phone/laptop symbol) lets you simulate different screen sizes (desktop, tablet, mobile) for responsive testing.",
        targetSelector: "#webfuse-screensize-btn", // Placeholder - REPLACE THIS
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    {
        id: "endSessionBtn", title: "End Session", text: "When you're done, click this (often a power icon or 'End Session' button) to close the co-browsing session.",
        targetSelector: "#webfuse-end-session-btn", // Placeholder - REPLACE THIS
        buttons: [{ text: "Finish Tour", id: "finish", type: "primary" }]
    }
  ];
  let currentStepIndex = 0;

  const backdropElement = document.createElement('div');
  backdropElement.id = 'wf-tour-backdrop';
  const modalElement = document.createElement('div');
  modalElement.id = 'wf-tour-modal';
  modalElement.classList.add('card');

  function createArrowElement() { /* ... same as before ... */ 
    if (!arrowElement) {
        arrowElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        arrowElement.setAttribute("id", "wf-tour-arrow");
        arrowElement.setAttribute("width", "24"); arrowElement.setAttribute("height", "12");
        arrowElement.style.position = "absolute"; arrowElement.style.display = "none";
        arrowElement.style.zIndex = "20000"; arrowElement.style.pointerEvents = "none";
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", "12,0 0,12 24,12"); polygon.setAttribute("fill", "#7b57ff");
        arrowElement.appendChild(polygon);
        document.body.appendChild(arrowElement);
    }
  }
  
  function clearHighlightAndArrow() { /* ... same as before ... */ 
    if (currentlyHighlightedElement) {
      currentlyHighlightedElement.classList.remove('wf-tour-highlighted-element');
      currentlyHighlightedElement = null;
    }
    if (arrowElement) { arrowElement.style.display = 'none';}
  }

  function positionAndShowArrow(modalElRect, targetElRect) { /* ... same as before ... */
    if (!arrowElement || !modalElRect || !targetElRect) return;
    const arrowWidth = 24; const arrowHeight = 12;
    let arrowTop, arrowLeft, rotationDeg = 0;
    const modalCenterX = modalElRect.left + modalElRect.width / 2;
    const modalCenterY = modalElRect.top + modalElRect.height / 2;
    const targetCenterX = targetElRect.left + targetElRect.width / 2;
    const targetCenterY = targetElRect.top + targetElRect.height / 2;
    arrowTop = modalElRect.top - arrowHeight + window.scrollY;
    arrowLeft = modalCenterX - arrowWidth / 2 + window.scrollX;
    rotationDeg = Math.atan2(targetCenterY - (modalElRect.top + window.scrollY), targetCenterX - modalCenterX) * (180 / Math.PI) + 90;
    const buffer = 5;
    if (modalElRect.bottom + buffer < targetElRect.top) { 
        arrowTop = modalElRect.bottom - buffer + window.scrollY;
        arrowLeft = modalCenterX - arrowWidth / 2 + window.scrollX;
        rotationDeg = 180;
    } else if (modalElRect.top - buffer > targetElRect.bottom) {
        arrowTop = modalElRect.top - arrowHeight + buffer + window.scrollY;
        arrowLeft = modalCenterX - arrowWidth / 2 + window.scrollX;
        rotationDeg = 0;
    } else if (modalElRect.right + buffer < targetElRect.left) {
        arrowTop = modalCenterY - arrowHeight / 2 + window.scrollY;
        arrowLeft = modalElRect.right - buffer + window.scrollX;
        rotationDeg = 90;
    } else if (modalElRect.left - buffer > targetElRect.right) {
        arrowTop = modalCenterY - arrowHeight / 2 + window.scrollY;
        arrowLeft = modalElRect.left - arrowWidth + buffer + window.scrollX;
        rotationDeg = -90;
    }
    arrowElement.style.top = `${arrowTop}px`;
    arrowElement.style.left = `${arrowLeft}px`;
    arrowElement.style.transform = `rotate(${rotationDeg}deg)`;
    arrowElement.style.display = 'block';
  }

  function renderCurrentStep() { /* ... same as before, ensures arrow positioning is called ... */
    clearHighlightAndArrow();
    const step = tourSteps[currentStepIndex];
    modalElement.innerHTML = `
        <h3 class="cookieHeading" id="wf-tour-title">${step.title}</h3>
        <p class="cookieDescription" id="wf-tour-text">${step.text}</p>
        ${step.showLinkSharing ? `
            <div id="wf-tour-link-section" style="width: 100%; margin-bottom: 15px;">
                <input id="wf-tour-link-input" readonly value="${shareableLink || 'Loading link...'}" style="width: 100%; box-sizing: border-box; padding: 8px 10px; font-size: 13px; border: 1px solid #ccc; border-radius: 6px; background-color: #f8f9fa; text-align: center;" />
            </div>
        ` : ''}
        <div class="buttonContainer" id="wf-tour-navigation">
            ${step.buttons.map(button => `<button id="wf-tour-btn-${button.id}" class="${button.type === 'primary' ? 'acceptButton' : 'declineButton'}">${button.text}</button>`).join('')}
        </div>`;

    if (step.targetSelector) {
      const targetElement = document.querySelector(step.targetSelector);
      if (targetElement) {
        currentlyHighlightedElement = targetElement;
        targetElement.classList.add('wf-tour-highlighted-element');
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        setTimeout(() => {
            const targetRect = targetElement.getBoundingClientRect();
            const modalCurrentRect = modalElement.getBoundingClientRect();
            modalElement.classList.add('tooltip-mode');
            let modalTop = targetRect.bottom + 15 + window.scrollY;
            let modalLeft = targetRect.left + (targetRect.width / 2) - (modalCurrentRect.width / 2) + window.scrollX;
            if (modalLeft + modalCurrentRect.width > window.innerWidth - 10) modalLeft = window.innerWidth - modalCurrentRect.width - 10;
            if (modalLeft < 10) modalLeft = 10;
            if (modalTop + modalCurrentRect.height > window.innerHeight - 10 + window.scrollY) modalTop = targetRect.top - modalCurrentRect.height - 15 + window.scrollY;
            if (modalTop < 10 + window.scrollY) modalTop = 10 + window.scrollY;
            modalElement.style.top = `${modalTop}px`;
            modalElement.style.left = `${modalLeft}px`;
            modalElement.style.position = 'absolute';
            modalElement.style.transform = 'translate(0, 0)';
            positionAndShowArrow(modalElement.getBoundingClientRect(), targetElement.getBoundingClientRect());
        }, 300);
      } else {
        console.warn(`Webfuse Onboarding Tour: Target element for selector "${step.targetSelector}" not found.`);
        modalElement.classList.remove('tooltip-mode');
        modalElement.style.position = 'fixed'; modalElement.style.top = '50%'; modalElement.style.left = '50%';
        modalElement.style.transform = 'translate(-50%, -50%)';
        if(arrowElement) arrowElement.style.display = 'none';
      }
    } else {
      modalElement.classList.remove('tooltip-mode');
      modalElement.style.position = 'fixed'; modalElement.style.top = '50%'; modalElement.style.left = '50%';
      modalElement.style.transform = 'translate(-50%, -50%)';
      if(arrowElement) arrowElement.style.display = 'none';
    }
    attachButtonListenersForCurrentStep();
  }

  function closeTour() { /* ... same as before, BUT now sets sessionStorage ... */
    clearHighlightAndArrow();
    backdropElement.remove();
    modalElement.remove();
    if (arrowElement) arrowElement.remove(); 
    arrowElement = null; 
    styleTag.remove();

    // Set flag in sessionStorage
    if (storageKey) {
      try {
        sessionStorage.setItem(storageKey, 'true');
        console.log(`Webfuse Onboarding Tour: Tour marked as shown for session ${sessionDetails.distinctSessionId} in sessionStorage.`);
      } catch (e) {
        console.error("Webfuse Onboarding Tour: Failed to set item in sessionStorage.", e);
      }
    }
  }

  function attachButtonListenersForCurrentStep() { /* ... same as before ... */ 
    const step = tourSteps[currentStepIndex];
    step.buttons.forEach(buttonConfig => {
        const buttonElement = document.getElementById(`wf-tour-btn-${buttonConfig.id}`);
        if (buttonElement) {
            buttonElement.addEventListener('click', () => {
                switch (buttonConfig.id) {
                    case 'next': case 'next-features':
                        if (currentStepIndex < tourSteps.length - 1) { currentStepIndex++; renderCurrentStep(); } else { closeTour(); }
                        break;
                    case 'skip-intro':
                        const firstFeatureStepIndex = tourSteps.findIndex(s => s.targetSelector);
                        if (firstFeatureStepIndex !== -1) { currentStepIndex = firstFeatureStepIndex; renderCurrentStep(); } else { closeTour(); }
                        break;
                    case 'skip-all': case 'finish':
                        closeTour();
                        break;
                    case 'copy':
                        const linkInput = document.getElementById('wf-tour-link-input');
                        if (linkInput && linkInput.value && linkInput.value !== 'Loading link...') {
                            linkInput.select(); linkInput.focus();
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(linkInput.value).then(() => {
                                    buttonElement.textContent = "Copied!"; setTimeout(() => { buttonElement.textContent = "Copy Link"; }, 1500);
                                }).catch(err => { console.error('Clipboard copy failed:', err); tryCopyFallback(linkInput, buttonElement, "Copy Link"); });
                            } else { tryCopyFallback(linkInput, buttonElement, "Copy Link"); }
                        } else { alert("Session link is not available to copy yet."); }
                        break;
                }
            });
        }
    });
  }
  
  function tryCopyFallback(inputElement, buttonElement, originalButtonText) { /* ... same as before ... */ 
    try {
      const successful = document.execCommand('copy');
      if (successful) { buttonElement.textContent = "Copied!"; }
      else { console.error('Fallback execCommand("copy") returned false.'); alert("Copy failed. Please copy manually.");}
    } catch (fallbackErr) {
      console.error('Fallback execCommand("copy") also failed:', fallbackErr); alert("Copy failed. Please copy manually.");
    } finally { setTimeout(() => { buttonElement.textContent = originalButtonText; }, 1500); }
  }

  const styleContent = ` /* ... All CSS styles remain the same as the previous version ... */
    #wf-tour-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
      z-index: 19998; display: flex; justify-content: center; align-items: center;
    }
    .card { /* Base style for modal */
      width: 380px; min-height: 200px; height: auto;
      background-color: rgb(255, 255, 255); border-radius: 12px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 25px 30px; gap: 15px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      z-index: 20000; text-align: center;
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      transition: top 0.3s ease-out, left 0.3s ease-out, opacity 0.3s ease-out;
    }
    .card.tooltip-mode {
      width: 300px; padding: 15px 20px; gap: 10px;
    }
    .cookieHeading {
      font-size: 1.3em; font-weight: 700; color: rgb(26, 26, 26); margin-bottom: 10px;
    }
    .cookieDescription {
      text-align: center; font-size: 0.9em; font-weight: 500;
      color: rgb(80, 80, 80); line-height: 1.6;
    }
    .buttonContainer {
      display: flex; gap: 10px; flex-direction: row;
      justify-content: center; width: 100%; margin-top: 15px;
    }
    .acceptButton, .declineButton {
      min-width: 100px; height: 38px; transition-duration: .2s;
      border: none; color: rgb(241, 241, 241); cursor: pointer;
      font-weight: 600; border-radius: 20px; transition: all .3s ease;
      padding: 0 18px; font-size: 0.9em;
    }
    .acceptButton {
      background-color: #002896; /* Darker blue */
      box-shadow: 0 4px 6px -1px rgba(0, 40, 150, 0.5), 0 2px 4px -1px rgba(0, 40, 150, 0.5);
    }
    .declineButton {
      background-color: #dadada; color: rgb(46, 46, 46);
      box-shadow: 0 4px 6px -1px rgba(190, 189, 189, 0.5), 0 2px 4px -1px rgba(190, 189, 189, 0.5);
    }
    .declineButton:hover {
      background-color: #ebebeb;
      box-shadow: 0 6px 10px -3px rgba(190, 189, 189, 0.6), 0 4px 6px -2px rgba(190, 189, 189, 0.6);
    }
    .acceptButton:hover {
      background-color: #0077FF; /* Brighter blue on hover */
      box-shadow: 0 6px 10px -3px rgba(0, 119, 255, 0.6), 0 4px 6px -2px rgba(0, 119, 255, 0.6);
    }
    .wf-tour-highlighted-element {
      outline: 3px solid #0077FF !important; /* Adjusted highlight color */
      box-shadow: 0 0 0 5px rgba(0, 119, 255, 0.3), 0 0 15px rgba(0, 119, 255, 0.5) !important;
      border-radius: 4px; position: relative; z-index: 20001 !important;
      transition: outline 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
  `;

  const styleTag = document.createElement("style");
  styleTag.id = 'wf-tour-styles';
  styleTag.textContent = styleContent;
  document.head.appendChild(styleTag);

  // --- Initialize DOM Elements and Tour ---
  document.body.appendChild(backdropElement);
  document.body.appendChild(modalElement);
  createArrowElement(); 
  renderCurrentStep();

  // Legacy env var check (no functional change, just logging)
  const spaceLinkEnvKey = "SPACE_LINK";
  if (typeof browser !== "undefined" && browser.virtualSession && browser.virtualSession.env && browser.virtualSession.env[spaceLinkEnvKey]) {
    console.log(`Webfuse Onboarding Tour: Legacy env var '${spaceLinkEnvKey}' found with value: '${browser.virtualSession.env[spaceLinkEnvKey]}'. This is not used for primary link determination.`);
  }

})();