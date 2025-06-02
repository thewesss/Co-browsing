// (async function () { 
//   if (window.__wfOnboardingShown) return;
//   window.__wfOnboardingShown = true;

//   const INVITE_URL_BASE = "https://webfuse.com/"; 

//   let shareableLink = "";
//   let determinationMethod = "unknown";

//   async function getSessionIdentifierFromAPI() {
//     let identifier = null;
//     let method = "unknown";

//     try {
//       let sessionInfo = null;
//       if (typeof browser !== "undefined" && browser.virtualSession) {
//         if (typeof browser.virtualSession.getSessionInfo === 'function') {
//           console.log("Webfuse Onboarding: Attempting browser.virtualSession.getSessionInfo()...");
//           sessionInfo = await browser.virtualSession.getSessionInfo();
//           method = 'direct getSessionInfo()';
//         } else if (typeof browser.virtualSession.apiRequest === 'function') {
//           console.log("Webfuse Onboarding: Attempting browser.virtualSession.apiRequest({ cmd: 'getSessionInfo' })...");
//           sessionInfo = await browser.virtualSession.apiRequest({ cmd: 'getSessionInfo' });
//           method = 'apiRequest getSessionInfo';
//         } else {
//           console.warn("Webfuse Onboarding: Neither direct getSessionInfo nor apiRequest methods are available on browser.virtualSession.");
//           return { identifier: null, method: "API methods unavailable" };
//         }

//         console.log(`Webfuse Onboarding: Raw sessionInfo (via ${method}):`, JSON.stringify(sessionInfo, null, 2));
//         if (sessionInfo && typeof sessionInfo.followerLink === 'string' && sessionInfo.followerLink.trim().startsWith('http')) {
//           identifier = sessionInfo.followerLink;
//           determinationMethod = `API (${method} - followerLink)`;
//           return { identifier, method: determinationMethod };
//         }
        
//         if (sessionInfo && sessionInfo.space && typeof sessionInfo.space.link === 'string' && sessionInfo.space.link.trim().startsWith('http')) {
//           if (sessionInfo.sessionId && sessionInfo.space.link.includes(sessionInfo.sessionId) || !sessionInfo.sessionId) {
//             identifier = sessionInfo.space.link;
//             determinationMethod = `API (${method} - space.link)`;
//             return { identifier, method: determinationMethod };
//           }
//         }

//         if (sessionInfo && typeof sessionInfo.sessionId === 'string' && sessionInfo.sessionId.trim() !== '') {
//           identifier = sessionInfo.sessionId;
//           determinationMethod = `API (${method} - sessionId)`;
//           return { identifier, method: determinationMethod };
//         }
        
//         if (sessionInfo && sessionInfo.space && typeof sessionInfo.space.link === 'string' && sessionInfo.space.link.trim().startsWith('http') && !identifier) {
//             identifier = sessionInfo.space.link;
//             determinationMethod = `API (${method} - space.link as fallback)`;
//             return { identifier, method: determinationMethod };
//         }

//         console.warn(`Webfuse Onboarding: getSessionInfo (via ${method}) did not return a usable 'followerLink', suitable 'space.link', or 'sessionId'.`);
//       } else {
//         console.warn("Webfuse Onboarding: browser.virtualSession object not found.");
//       }
//     } catch (e) {
//       console.error('Webfuse Onboarding: Error in getSessionIdentifierFromAPI:', e);
//     }
//     return { identifier: null, method: "API call failed or no suitable data" };
//   }

//   const apiResult = await getSessionIdentifierFromAPI();
//   determinationMethod = apiResult.method; 

//   if (apiResult.identifier) {
//     if (apiResult.identifier.startsWith('http://') || apiResult.identifier.startsWith('https://')) {
//         shareableLink = apiResult.identifier;
//     } 

//     else {
//         if (INVITE_URL_BASE === "YOUR_WEBFUSE_INVITE_BASE_URL_HERE/" || !INVITE_URL_BASE.trim()) {
//             console.error("Webfuse Onboarding: CRITICAL - INVITE_URL_BASE is not configured in guide.js! Using raw identifier as link, which is likely incorrect.");
//             shareableLink = apiResult.identifier; 
//             determinationMethod += " (INVITE_URL_BASE not configured)";
//         } else {
//             shareableLink = INVITE_URL_BASE + apiResult.identifier;
//         }
//     }
//   } else {
//     console.warn("Webfuse Onboarding: Could not get session identifier from API. Attempting fallback methods.");

//     try {
//       if (window.top !== window.self && window.top.location && typeof window.top.location.href === 'string' &&
//           (window.top.location.host.includes('webfuse.com') || window.top.location.host.includes('webfuse.space'))) { // Adjust domains if needed
//         shareableLink = window.top.location.href;
//         determinationMethod = 'Fallback (window.top.location.href)';
//       } else {
//         shareableLink = location.href; 
//         determinationMethod = 'Fallback (location.href)';
//       }
//     } catch (e) {
//       shareableLink = location.href; 
//       determinationMethod = 'Fallback (location.href after error)';
//       console.warn("Webfuse Onboarding: Error accessing window.top.location, used location.href.", e);
//     }
//   }

//   console.log(`Webfuse Onboarding: Final shareable link determined via '${determinationMethod}': ${shareableLink}`);
//   if (!shareableLink.includes('webfuse.com') && !shareableLink.includes('webfuse.space') && (determinationMethod.startsWith("Fallback") || determinationMethod.includes("not configured") )) { // Adjust domains if needed
//       console.warn(`Webfuse Onboarding: WARNING! The determined link ('${shareableLink}') may not be the correct Webfuse session link. Please verify INVITE_URL_BASE and API responses.`);
//   }

//   const style = `
//     #wf-onboarding-backdrop {
//       position: fixed;
//       top: 0; left: 0;
//       width: 100vw;
//       height: 100vh;
//       background: rgba(0, 0, 0, 0.5);
//       backdrop-filter: blur(4px);
//       z-index: 9998;
//     }

//     #wf-onboarding-popup {
//       position: fixed;
//       top: 50%; left: 50%;
//       transform: translate(-50%, -50%);
//       background: #fff;
//       border-radius: 12px;
//       box-shadow: 0 4px 18px rgba(0,0,0,0.2);
//       padding: 24px;
//       max-width: 380px;
//       width: 90%;
//       z-index: 9999;
//       font-family: system-ui, sans-serif;
//     }

//     #wf-onboarding-popup h3 {
//       margin: 0 0 12px;
//       font-size: 18px;
//     }

//     #wf-onboarding-popup p {
//       font-size: 14px;
//       margin-bottom: 12px;
//     }

//     #wf-onboarding-popup input {
//       width: 100%;
//       padding: 6px 8px;
//       margin-bottom: 12px;
//       font-size: 14px;
//       border: 1px solid #ccc;
//       border-radius: 6px;
//     }

//     #wf-onboarding-popup button {
//       padding: 6px 12px;
//       font-size: 14px;
//       border: none;
//       border-radius: 6px;
//       cursor: pointer;
//       margin-right: 8px;
//     }

//     #wf-onboarding-next {
//       background: #007bff;
//       color: white;
//     }

//     #wf-onboarding-copy,
//     #wf-onboarding-finish,
//     #wf-onboarding-skip {
//       background: #e0e0e0;
//     }
//   `;

//   const steps = [
//     {
//       title: "👋 Welcome to Co-Browse",
//       body: "This is a shared session. Invite others to browse this site with you — interactively, in real time.",
//       showInput: false,
//       buttons: ["Next", "Skip"]
//     },
//     {
//       title: "What is Co-Browsing?",
//       body: "Co-browsing allows multiple people to navigate and interact with the same website in sync — no screen share, no install.",
//       showInput: false,
//       buttons: ["Next", "Skip"]
//     },
//     {
//       title: "Invite Participants",
//       body: "Share this link to invite someone into this live session:",
//       showInput: true,
//       buttons: ["Copy", "Finish"]
//     }
//   ];

//   let currentStep = 0;

//   const styleTag = document.createElement("style");
//   styleTag.textContent = style;
//   document.head.appendChild(styleTag);

//   const backdrop = document.createElement("div");
//   backdrop.id = "wf-onboarding-backdrop";
//   document.body.appendChild(backdrop);

//   const popup = document.createElement("div");
//   popup.id = "wf-onboarding-popup";
//   document.body.appendChild(popup);

//   function renderStep(index) {
//     const step = steps[index];
//     popup.innerHTML = `
//       <h3>${step.title}</h3>
//       <p>${step.body}</p>
//       ${
//         step.showInput
//           ? `<input id="wf-onboarding-link" readonly value="${shareableLink}" />`
//           : ""
//       }
//       <div>
//         ${step.buttons
//           .map((btn) => {
//             const id = btn.toLowerCase().replace(" ", "-");
//             return `<button id="wf-onboarding-${id}">${btn}</button>`;
//           })
//           .join("")}
//       </div>
//     `;
//   }

//   function attachEvents() {
//     const next = document.getElementById("wf-onboarding-next");
//     const skip = document.getElementById("wf-onboarding-skip");
//     const finish = document.getElementById("wf-onboarding-finish");
//     const copy = document.getElementById("wf-onboarding-copy");

//     if (next) {
//       next.addEventListener("click", () => {
//         currentStep++;
//         renderStep(currentStep);
//         attachEvents();
//       });
//     }

//     if (skip || finish) {
//       (skip || finish).addEventListener("click", () => {
//         popup.remove();
//         backdrop.remove();
//       });
//     }

//     if (copy) {
//       const input = document.getElementById("wf-onboarding-link");
//       copy.addEventListener("click", () => {
//         input.select();
//         navigator.clipboard
//           .writeText(input.value)
//           .then(() => {
//             copy.textContent = "Copied!";
//             setTimeout(() => (copy.textContent = "Copy"), 1500);
//           })
//           .catch((err) => {
//             console.error("Clipboard copy failed:", err);
//             alert("Copy failed. Please copy it manually.");
//           });
//       });
//     }
//   }

//   renderStep(currentStep);
//   attachEvents();
// })();

(async function () {
  if (window.__wfOnboardingShown) return;
  window.__wfOnboardingShown = true;

  const INVITE_URL_BASE = "https://webfuse.com/";

  let shareableLink = "";
  let determinationMethod = "unknown";

  async function getSessionIdentifierFromAPI() {
    let identifier = null;
    let method = "unknown";
    try {
      let sessionInfo = null;
      if (typeof browser !== "undefined" && browser.virtualSession) {
        if (typeof browser.virtualSession.getSessionInfo === 'function') {
          console.log("Webfuse Onboarding: Attempting browser.virtualSession.getSessionInfo()...");
          sessionInfo = await browser.virtualSession.getSessionInfo();
          method = 'direct getSessionInfo()';
        } else if (typeof browser.virtualSession.apiRequest === 'function') {
          console.log("Webfuse Onboarding: Attempting browser.virtualSession.apiRequest({ cmd: 'getSessionInfo' })...");
          sessionInfo = await browser.virtualSession.apiRequest({ cmd: 'getSessionInfo' });
          method = 'apiRequest getSessionInfo';
        } else {
          console.warn("Webfuse Onboarding: Neither direct getSessionInfo nor apiRequest methods are available on browser.virtualSession.");
          return { identifier: null, method: "API methods unavailable" };
        }
        console.log(`Webfuse Onboarding: Raw sessionInfo (via ${method}):`, JSON.stringify(sessionInfo, null, 2));
        if (sessionInfo && typeof sessionInfo.followerLink === 'string' && sessionInfo.followerLink.trim().startsWith('http')) {
          identifier = sessionInfo.followerLink;
          determinationMethod = `API (${method} - followerLink)`; // This should be apiResult.method, not determinationMethod directly
          return { identifier, method: `API (${method} - followerLink)` };
        }
        if (sessionInfo && sessionInfo.space && typeof sessionInfo.space.link === 'string' && sessionInfo.space.link.trim().startsWith('http')) {
          if (sessionInfo.sessionId && sessionInfo.space.link.includes(sessionInfo.sessionId) || !sessionInfo.sessionId) {
            identifier = sessionInfo.space.link;
            return { identifier, method: `API (${method} - space.link)` };
          }
        }
        if (sessionInfo && typeof sessionInfo.sessionId === 'string' && sessionInfo.sessionId.trim() !== '') {
          identifier = sessionInfo.sessionId;
          return { identifier, method: `API (${method} - sessionId)` };
        }
        if (sessionInfo && sessionInfo.space && typeof sessionInfo.space.link === 'string' && sessionInfo.space.link.trim().startsWith('http') && !identifier) {
          identifier = sessionInfo.space.link;
          return { identifier, method: `API (${method} - space.link as fallback)` };
        }
        console.warn(`Webfuse Onboarding: getSessionInfo (via ${method}) did not return a usable 'followerLink', suitable 'space.link', or 'sessionId'.`);
      } else {
        console.warn("Webfuse Onboarding: browser.virtualSession object not found.");
      }
    } catch (e) {
      console.error('Webfuse Onboarding: Error in getSessionIdentifierFromAPI:', e);
    }
    return { identifier: null, method: "API call failed or no suitable data" };
  }

  const apiResult = await getSessionIdentifierFromAPI();
  determinationMethod = apiResult.method;

  if (apiResult.identifier) {
    if (apiResult.identifier.startsWith('http://') || apiResult.identifier.startsWith('https://')) {
      shareableLink = apiResult.identifier;
    } else {
      if (INVITE_URL_BASE === "YOUR_WEBFUSE_INVITE_BASE_URL_HERE/" || !INVITE_URL_BASE.trim() || INVITE_URL_BASE === "https://webfuse.com/") {
        // Add a more specific warning if the default INVITE_URL_BASE is used with just a session ID.
        if (INVITE_URL_BASE === "https://webfuse.com/" && apiResult.identifier && !apiResult.identifier.startsWith('http')) {
            console.warn(`Webfuse Onboarding: INVITE_URL_BASE is '${INVITE_URL_BASE}'. If '${apiResult.identifier}' is just a session ID, the link might need a path like '/s/' or '/join/'. Current constructed link: ${INVITE_URL_BASE}${apiResult.identifier}`);
        } else if (INVITE_URL_BASE === "YOUR_WEBFUSE_INVITE_BASE_URL_HERE/" || !INVITE_URL_BASE.trim()) {
             console.error("Webfuse Onboarding: CRITICAL - INVITE_URL_BASE is not configured in guide.js! Using raw identifier as link, which is likely incorrect.");
        }
        shareableLink = INVITE_URL_BASE + apiResult.identifier;
        if (INVITE_URL_BASE === "YOUR_WEBFUSE_INVITE_BASE_URL_HERE/") {
             determinationMethod += " (INVITE_URL_BASE not configured)";
        }
      } else {
        shareableLink = INVITE_URL_BASE + apiResult.identifier;
      }
    }
  } else {
    console.warn("Webfuse Onboarding: Could not get session identifier from API. Attempting fallback methods.");
    try {
      if (window.top !== window.self && window.top.location && typeof window.top.location.href === 'string' &&
        (window.top.location.host.includes('webfuse.com') || window.top.location.host.includes('webfuse.space'))) {
        shareableLink = window.top.location.href;
        determinationMethod = 'Fallback (window.top.location.href)';
      } else {
        shareableLink = location.href;
        determinationMethod = 'Fallback (location.href)';
      }
    } catch (e) {
      shareableLink = location.href;
      determinationMethod = 'Fallback (location.href after error)';
      console.warn("Webfuse Onboarding: Error accessing window.top.location, used location.href.", e);
    }
  }

  console.log(`Webfuse Onboarding: Final shareable link determined via '${determinationMethod}': ${shareableLink}`);
  if (!shareableLink.includes('webfuse.com') && !shareableLink.includes('webfuse.space') && (determinationMethod.startsWith("Fallback") || determinationMethod.includes("not configured"))) {
    console.warn(`Webfuse Onboarding: WARNING! The determined link ('${shareableLink}') may not be the correct Webfuse session link. Please verify INVITE_URL_BASE and API responses.`);
  }

  const style = `
    #wf-onboarding-backdrop {
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px); /* Safari */
      z-index: 9998;
    }
    #wf-onboarding-popup {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.2);
      padding: 24px;
      max-width: 380px;
      width: 90%;
      z-index: 9999;
      font-family: system-ui, sans-serif;
    }
    #wf-onboarding-popup h3 {
      margin: 0 0 12px;
      font-size: 18px;
    }
    #wf-onboarding-popup p {
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 12px;
    }
    #wf-onboarding-popup input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      margin-bottom: 12px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #f8f9fa;
    }
    #wf-onboarding-popup button {
      padding: 8px 15px;
      font-size: 14px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 8px;
      font-weight: 500;
    }
    #wf-onboarding-popup button:last-child {
        margin-right: 0;
    }
    #wf-onboarding-next, /* If you add a "Next" button with this ID */
    #wf-onboarding-finish { /* Changed from just #wf-onboarding-finish */
      background: #007bff;
      color: white;
    }
    #wf-onboarding-copy { /* Keep distinct style if needed, or merge with finish */
        background: #007bff;
        color: white;
    }
    #wf-onboarding-skip {
      background: #e0e0e0;
      color: #333;
    }
  `;

  const steps = [
    {
      title: "👋 Welcome to Co-Browse",
      body: "This is a shared session. Invite others to browse this site with you — interactively, in real time.",
      showInput: false,
      buttons: ["Next", "Skip"]
    },
    {
      title: "What is Co-Browse?",
      body: "Co-Browse allows multiple people to navigate and interact with the same website in sync — no screen share, no install.",
      showInput: false,
      buttons: ["Next", "Skip"]
    },
    {
      title: "Invite Participants",
      body: "Share this link to invite someone into this live session:",
      showInput: true,
      buttons: ["Copy", "Finish"]
    }
  ];

  let currentStep = 0;

  const styleTag = document.createElement("style");
  styleTag.textContent = style;
  document.head.appendChild(styleTag);

  const backdrop = document.createElement("div");
  backdrop.id = "wf-onboarding-backdrop";
  document.body.appendChild(backdrop);

  const popup = document.createElement("div");
  popup.id = "wf-onboarding-popup";
  document.body.appendChild(popup);

  function renderStep(index) {
    currentStep = index; // Ensure currentStep is updated
    const step = steps[index];
    popup.innerHTML = `
      <h3>${step.title}</h3>
      <p>${step.body}</p>
      ${
        step.showInput
          ? `<input id="wf-onboarding-link" readonly value="${shareableLink || 'Loading link...'}" />`
          : ""
      }
      <div style="margin-top: 15px; text-align: right;"> 
        ${step.buttons
          .map((btnText) => {
            const id = `wf-onboarding-${btnText.toLowerCase().replace(" ", "-")}`;
            return `<button id="${id}">${btnText}</button>`;
          })
          .join("")}
      </div>
    `;
    attachButtonEvents(); // Re-attach events after innerHTML overwrite
  }
  
  function closeTour() {
    popup.remove();
    backdrop.remove();
    // Optionally remove styleTag if it's only for this tour and won't be reused.
    // styleTag.remove(); 
  }

  function attachButtonEvents() {
    const nextButton = document.getElementById("wf-onboarding-next");
    const skipButton = document.getElementById("wf-onboarding-skip");
    const finishButton = document.getElementById("wf-onboarding-finish");
    const copyButton = document.getElementById("wf-onboarding-copy");
    const linkInput = document.getElementById("wf-onboarding-link");

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
          renderStep(currentStep + 1);
        }
      });
    }

    if (skipButton) {
      skipButton.addEventListener("click", closeTour);
    }
    if (finishButton) {
      finishButton.addEventListener("click", closeTour);
    }

    if (copyButton && linkInput) {
      // Disable copy button if shareableLink is empty or placeholder
      if (!shareableLink || shareableLink === 'Loading link...') {
          copyButton.disabled = true;
          linkInput.value = 'Could not get session link.';
      } else {
          copyButton.disabled = false;
      }

      copyButton.addEventListener("click", () => {
        if (!linkInput.value || linkInput.value === 'Loading link...' || linkInput.value === 'Could not get session link.') {
            console.warn("Webfuse Onboarding: Attempted to copy an invalid or loading link.");
            alert("Session link is not available to copy yet.");
            return;
        }
        
        linkInput.select();
        linkInput.focus(); // Ensure element is focused for clipboard operations

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(linkInput.value).then(() => {
            copyButton.textContent = "Copied!";
            setTimeout(() => (copyButton.textContent = "Copy"), 1500);
          }).catch(clipboardErr => {
            console.error("Webfuse Onboarding: navigator.clipboard.writeText failed:", clipboardErr);
            tryCopyFallback(linkInput, copyButton); // Try fallback
          });
        } else {
          console.warn("Webfuse Onboarding: navigator.clipboard.writeText not available. Using fallback.");
          tryCopyFallback(linkInput, copyButton); // Use fallback
        }
      });
    }
  }

  function tryCopyFallback(inputElement, buttonElement) {
    try {
      inputElement.select(); // Ensure selection
      inputElement.focus();   // Ensure focus

      const successful = document.execCommand('copy');
      if (successful) {
        buttonElement.textContent = "Copied!";
      } else {
        // throw new Error('document.execCommand("copy") returned false.');
        console.error('Webfuse Onboarding: document.execCommand("copy") returned false.');
        alert("Copy failed. Please copy it manually."); // Give feedback
      }
    } catch (fallbackErr) {
      console.error('Webfuse Onboarding: Fallback document.execCommand("copy") also failed:', fallbackErr);
      alert("Copy failed. Please copy it manually.");
    } finally {
        // Reset button text if it wasn't changed to "Copied!"
        if (buttonElement.textContent !== "Copied!") {
             setTimeout(() => (buttonElement.textContent = "Copy"), 1500);
        } else {
             setTimeout(() => (buttonElement.textContent = "Copy"), 1500); // Ensure reset even on success
        }
    }
  }

  renderStep(currentStep); // Initial render of the first step
})();