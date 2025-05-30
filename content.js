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
          determinationMethod = `API (${method} - followerLink)`;
          return { identifier, method: determinationMethod };
        }
        
        if (sessionInfo && sessionInfo.space && typeof sessionInfo.space.link === 'string' && sessionInfo.space.link.trim().startsWith('http')) {
          if (sessionInfo.sessionId && sessionInfo.space.link.includes(sessionInfo.sessionId) || !sessionInfo.sessionId) {
            identifier = sessionInfo.space.link;
            determinationMethod = `API (${method} - space.link)`;
            return { identifier, method: determinationMethod };
          }
        }

        if (sessionInfo && typeof sessionInfo.sessionId === 'string' && sessionInfo.sessionId.trim() !== '') {
          identifier = sessionInfo.sessionId;
          determinationMethod = `API (${method} - sessionId)`;
          return { identifier, method: determinationMethod };
        }
        
        if (sessionInfo && sessionInfo.space && typeof sessionInfo.space.link === 'string' && sessionInfo.space.link.trim().startsWith('http') && !identifier) {
            identifier = sessionInfo.space.link;
            determinationMethod = `API (${method} - space.link as fallback)`;
            return { identifier, method: determinationMethod };
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
    } 

    else {
        if (INVITE_URL_BASE === "YOUR_WEBFUSE_INVITE_BASE_URL_HERE/" || !INVITE_URL_BASE.trim()) {
            console.error("Webfuse Onboarding: CRITICAL - INVITE_URL_BASE is not configured in guide.js! Using raw identifier as link, which is likely incorrect.");
            shareableLink = apiResult.identifier; 
            determinationMethod += " (INVITE_URL_BASE not configured)";
        } else {
            shareableLink = INVITE_URL_BASE + apiResult.identifier;
        }
    }
  } else {
    console.warn("Webfuse Onboarding: Could not get session identifier from API. Attempting fallback methods.");

    try {
      if (window.top !== window.self && window.top.location && typeof window.top.location.href === 'string' &&
          (window.top.location.host.includes('webfuse.com') || window.top.location.host.includes('webfuse.space'))) { // Adjust domains if needed
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
  if (!shareableLink.includes('webfuse.com') && !shareableLink.includes('webfuse.space') && (determinationMethod.startsWith("Fallback") || determinationMethod.includes("not configured") )) { // Adjust domains if needed
      console.warn(`Webfuse Onboarding: WARNING! The determined link ('${shareableLink}') may not be the correct Webfuse session link. Please verify INVITE_URL_BASE and API responses.`);
  }

  const style = `
    #wf-onboarding-popup {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 20px;
      max-width: 320px;
      z-index: 9999;
      font-family: system-ui, sans-serif;
      line-height: 1.4;
    }
    #wf-onboarding-popup h3 {
      margin: 0 0 10px;
      font-size: 16px;
    }
    #wf-onboarding-popup p {
      font-size: 14px;
      margin-bottom: 10px;
    }
    #wf-onboarding-popup input {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 8px;
      margin-bottom: 10px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    #wf-onboarding-popup button {
      padding: 6px 12px;
      font-size: 14px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    #wf-onboarding-copy {
      background: #007bff;
      color: white;
      margin-right: 8px;
    }
    #wf-onboarding-close {
      background: #e0e0e0;
    }
  `;

  const popupHTML = `
    <div id="wf-onboarding-popup">
      <h3>👋 Welcome to Co-Browse</h3>
      <p>You’re in a shared session. Invite others by sharing this link:</p>
      <input id="wf-onboarding-link" readonly value="${shareableLink}" />
      <div style="margin-top: 10px;">
        <button id="wf-onboarding-copy">Copy Link</button>
        <button id="wf-onboarding-close">Got it</button>
      </div>
    </div>
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = style;
  document.head.appendChild(styleTag);

  const container = document.createElement("div");
  container.id = "wf-onboarding-container";
  container.innerHTML = popupHTML;
  document.body.appendChild(container);

  const copyButton = document.getElementById("wf-onboarding-copy");
  const closeButton = document.getElementById("wf-onboarding-close");
  const linkInput = document.getElementById("wf-onboarding-link");
  const urlInput = linkInput; 
  if (copyButton && linkInput) {
      copyButton.addEventListener("click", () => {
      linkInput.select();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(linkInput.value).then(() => {
          copyButton.textContent = "Copied!";
          setTimeout(() => {
            copyButton.textContent = "Copy Link";
          }, 1500);
        }).catch(err => {
          console.error('Failed to copy with navigator.clipboard:', err);
          try {
            const successful = document.execCommand("copy");
            if (successful) {
                copyButton.textContent = "Copied!";
            } else {
                throw new Error('execCommand failed');
            }
            setTimeout(() => {
              copyButton.textContent = "Copy Link";
            }, 1500);
          } catch (e_fallback) {
            console.error('Fallback execCommand also failed:', e_fallback);
          }
        });
      } else {
        try {
          const successful = document.execCommand("copy");
          if (successful) {
            copyButton.textContent = "Copied!";
          } else {
            throw new Error('execCommand failed');
          }
          setTimeout(() => {
            copyButton.textContent = "Copy Link";
          }, 1500);
        } catch (e) {
          console.error('execCommand failed:', e);
        }
      }
    });

    if(shareableLink && shareableLink !== "YOUR_WEBFUSE_INVITE_BASE_URL_HERE/" + (apiResult.identifier || '')) { // Check if link is valid
        if(urlInput) urlInput.value = shareableLink;
        if(copyButton) copyButton.disabled = false;
        setTimeout(() => {
            if(urlInput) {
                 urlInput.focus();
                 urlInput.select();
            }
        }, 100);
    } else {
        if(urlInput) urlInput.value = 'Could not determine session link';
        if(copyButton) copyButton.disabled = true;
    }
  }


  if (closeButton) {
    closeButton.addEventListener("click", () => {
      container.remove();
    });
  }

  const spaceLinkEnvKey = "SPACE_LINK";
  if (
    typeof browser !== "undefined" &&
    browser.virtualSession &&
    browser.virtualSession.env &&
    browser.virtualSession.env[spaceLinkEnvKey]
  ) {
    console.log(`Webfuse Onboarding: Legacy env var '${spaceLinkEnvKey}' found with value: '${browser.virtualSession.env[spaceLinkEnvKey]}'. This is not used for primary link determination anymore.`);
  }

})();