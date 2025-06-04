(async function () {
  const tourShownSessionKey = '__wfCoBrowseTour_Bing_Shown_SessionV3';

  // 1. Domain Check: Only execute this tour logic if the current page is on bing.com
  if (!(window.location.hostname === 'www.bing.com' || window.location.hostname === 'bing.com')) {
    return; // Exit if not on bing.com
  }

  // 2. Session Persistence Check: Use sessionStorage to see if the tour has already been shown during this browser session.
  if (sessionStorage.getItem(tourShownSessionKey) === 'true') {
    return; // Already shown in this session
  }

  // 3. Mark as shown for this session (across all bing.com tabs in this browser session)
  sessionStorage.setItem(tourShownSessionKey, 'true');
  console.log("Webfuse Onboarding Tour: Marking as shown for this browser session.");

  const svgLogoString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 250" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
    <path d="M870 34.9703L870 215.029C870 239.229 893.947 256.363 916.33 247.736C965.249 228.881 1000 181.04 1000 124.998C1000 68.9582 965.249 21.117 916.33 2.26154C912.323 0.717594 908.262 1.30468e-06 904.302 6.12299e-07C886.139 -0.00351153 870 15.1026 870 34.9703Z" fill="url(#paint0_linear_16929_41007_tour)"></path>
    <path d="M870 201.488C890.876 201.488 909.776 192.919 923.47 179.084C937.162 165.253 945.645 146.122 945.645 125.072C945.645 82.9373 911.713 48.6601 870 48.6601L870 201.488Z" fill="currentColor" fill-opacity="0.25"></path>
    <path d="M736.398 200.834C704.684 200.834 682.462 177.749 682.462 144.74C682.462 111.3 704.252 88.2154 735.535 88.2154C767.465 88.2154 787.745 109.574 787.745 142.799V150.781L707.488 150.997C709.43 169.767 719.354 179.259 736.829 179.259C751.284 179.259 760.777 173.65 763.797 163.51H788.177C783.646 186.811 764.229 200.834 736.398 200.834ZM735.751 109.79C720.217 109.79 710.724 118.204 708.135 134.169H761.64C761.64 119.498 751.5 109.79 735.751 109.79Z" fill="currentColor"></path>
    <path d="M587.126 165.668H612.153C612.369 174.945 619.272 180.77 631.354 180.77C643.651 180.77 650.34 175.808 650.34 168.041C650.34 162.647 647.535 158.764 638.042 156.606L618.841 152.076C599.64 147.761 590.363 138.7 590.363 121.656C590.363 100.729 608.054 88.2154 632.648 88.2154C656.596 88.2154 672.777 102.023 672.993 122.734H647.966C647.751 113.673 641.71 107.848 631.57 107.848C621.214 107.848 615.173 112.594 615.173 120.577C615.173 126.618 619.92 130.501 628.981 132.659L648.182 137.189C666.089 141.288 675.15 149.487 675.15 165.883C675.15 187.458 656.812 200.834 630.491 200.834C603.954 200.834 587.126 186.595 587.126 165.668Z" fill="currentColor"></path>
    <path d="M550.398 91.4517H576.718V198.029H552.339L550.398 183.79C543.925 193.93 530.118 200.834 515.879 200.834C491.284 200.834 476.829 184.222 476.829 158.117V91.4517H503.15V148.84C503.15 169.12 511.132 177.318 525.803 177.318C542.415 177.318 550.398 167.61 550.398 147.33V91.4517Z" fill="currentColor"></path>
    <path d="M400.915 91.4517H416.233V78.5071C416.233 49.5973 431.551 37.5156 454.636 37.5156C458.735 37.5156 463.697 37.7314 468.228 38.5943V61.0318H458.951C445.574 61.0318 442.338 67.9356 442.338 78.5071V91.4517H467.796V113.458H442.338V198.029H416.233V113.458H400.915V91.4517Z" fill="currentColor"></path>
    <path d="M309.184 198.029H284.805V37.5156H311.125V106.985C318.029 95.1194 332.268 87.9998 348.449 87.9998C378.869 87.9998 397.423 111.732 397.423 145.388C397.423 178.181 377.359 200.834 346.723 200.834C330.758 200.834 317.166 193.715 310.91 181.417L309.184 198.029ZM311.341 144.309C311.341 163.51 323.207 176.671 341.33 176.671C359.884 176.671 370.886 163.295 370.886 144.309C370.886 125.324 359.884 111.732 341.33 111.732C323.207 111.732 311.341 125.108 311.341 144.309Z" fill="currentColor"></path>
    <path d="M218.864 200.834C187.15 200.834 164.928 177.749 164.928 144.74C164.928 111.3 186.718 88.2154 218.001 88.2154C249.931 88.2154 270.211 109.574 270.211 142.799V150.781L189.954 150.997C191.896 169.767 201.82 179.259 219.296 179.259C233.751 179.259 243.243 173.65 246.264 163.51H270.643C266.112 186.811 246.695 200.834 218.864 200.834ZM218.217 109.79C202.683 109.79 193.191 118.204 190.602 134.169H244.106C244.106 119.498 233.966 109.79 218.217 109.79Z" fill="currentColor"></path>
    <path d="M34.5191 198.029L0 91.4517H27.3996L41.4229 137.19C43.7961 145.604 45.9535 154.881 47.8952 164.805C49.8369 154.449 51.7787 147.761 55.2306 137.19L69.9012 91.4517H96.6535L110.893 137.19C112.187 141.504 116.502 157.47 117.796 164.589C119.522 156.607 122.974 143.878 124.916 137.19L139.155 91.4517H166.986L130.094 198.029H105.499L90.8283 151.86C86.5135 137.837 84.1404 127.697 83.2774 122.303C82.1987 127.265 80.2569 134.816 74.8633 152.292L60.1927 198.029H34.5191Z" fill="currentColor"></path>
    <defs>
    <linearGradient id="paint0_linear_16929_41007_tour" x1="904.07" y1="303.509" x2="1073.41" y2="91.4966" gradientUnits="userSpaceOnUse">
    <stop stop-color="#760DFF"></stop>
    <stop offset="1" stop-color="#10CDFF"></stop>
    </linearGradient>
    </defs>
    </svg>`;
  const INVITE_URL_BASE = "https://webfuse.com/"; // User's current value

  let shareableLink = "";
  let determinationMethod = "unknown";
  let currentlyHighlightedElement = null; // To keep track of the highlighted element

  // --- Helper function to get session identifier (full link or session ID) ---
  async function getSessionIdentifierFromAPI() {
    let identifier = null;
    let method = "API call initiated";
    try {
      let sessionInfo = null;
      if (typeof browser !== "undefined" && browser.virtualSession) {
        if (typeof browser.virtualSession.getSessionInfo === 'function') {
          console.log("Webfuse Onboarding Tour: Attempting browser.virtualSession.getSessionInfo()...");
          sessionInfo = await browser.virtualSession.getSessionInfo();
          method = 'direct getSessionInfo()';
        } else if (typeof browser.virtualSession.apiRequest === 'function') {
          console.log("Webfuse Onboarding Tour: Attempting browser.virtualSession.apiRequest({ cmd: 'getSessionInfo' })...");
          sessionInfo = await browser.virtualSession.apiRequest({ cmd: 'getSessionInfo' });
          method = 'apiRequest getSessionInfo';
        } else {
          console.warn("Webfuse Onboarding Tour: Neither direct getSessionInfo nor apiRequest methods are available on browser.virtualSession.");
          return { identifier: null, method: "API methods unavailable" };
        }
        console.log(`Webfuse Onboarding Tour: Raw sessionInfo (via ${method}):`, JSON.stringify(sessionInfo, null, 2));
        if (sessionInfo && typeof sessionInfo.followerLink === 'string' && sessionInfo.followerLink.trim().startsWith('http')) {
          identifier = sessionInfo.followerLink; return { identifier, method: `API (${method} - followerLink)` };
        }
        if (sessionInfo && sessionInfo.space && typeof sessionInfo.space.link === 'string' && sessionInfo.space.link.trim().startsWith('http')) {
          if (sessionInfo.sessionId && sessionInfo.space.link.includes(sessionInfo.sessionId) || !sessionInfo.sessionId) {
            identifier = sessionInfo.space.link; return { identifier, method: `API (${method} - space.link)` };
          }
        }
        if (sessionInfo && typeof sessionInfo.sessionId === 'string' && sessionInfo.sessionId.trim() !== '') {
          identifier = sessionInfo.sessionId; return { identifier, method: `API (${method} - sessionId)` };
        }
        if (sessionInfo && sessionInfo.space && typeof sessionInfo.space.link === 'string' && sessionInfo.space.link.trim().startsWith('http') && !identifier) {
            identifier = sessionInfo.space.link; return { identifier, method: `API (${method} - space.link as fallback)` };
        }
        console.warn(`Webfuse Onboarding Tour: getSessionInfo (via ${method}) did not return a usable 'followerLink', suitable 'space.link', or 'sessionId'.`);
      } else { console.warn("Webfuse Onboarding Tour: browser.virtualSession object not found."); }
    } catch (e) { console.error('Webfuse Onboarding Tour: Error in getSessionIdentifierFromAPI:', e); }
    return { identifier: null, method: "API call failed or no suitable data" };
  }

  // --- Determine the shareable link ---
  const apiResult = await getSessionIdentifierFromAPI();
  determinationMethod = apiResult.method;
  if (apiResult.identifier) {
    if (apiResult.identifier.startsWith('http://') || apiResult.identifier.startsWith('https://')) {
        shareableLink = apiResult.identifier;
    } else {
        if (INVITE_URL_BASE === "YOUR_WEBFUSE_INVITE_BASE_URL_HERE/" || !INVITE_URL_BASE.trim()) {
            console.error("Webfuse Onboarding Tour: CRITICAL - INVITE_URL_BASE is not configured! Using raw identifier as link, which is likely incorrect.");
            shareableLink = apiResult.identifier; determinationMethod += " (INVITE_URL_BASE not configured)";
        } else {
            if (INVITE_URL_BASE.endsWith('/') && apiResult.identifier.startsWith('/')) {
                shareableLink = INVITE_URL_BASE + apiResult.identifier.substring(1);
            } else if (!INVITE_URL_BASE.endsWith('/') && !apiResult.identifier.startsWith('/')) {
                shareableLink = INVITE_URL_BASE + '/' + apiResult.identifier;
            } else { shareableLink = INVITE_URL_BASE + apiResult.identifier; }
        }
    }
  } else {
    console.warn("Webfuse Onboarding Tour: Could not get session identifier from API. Attempting fallback methods.");
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

  
  const tourSteps = [
    {
        id: "welcome", title: "Welcome to Your Co-Browse Session!",
        text: "You’ve entered a shared Webfuse space. This session allows you to browse any website together with teammates, customers, or collaborators — all in real time. No screen sharing, no installs. Just a shared session that syncs instantly across users.",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "Skip Intro", id: "skip-intro", type: "secondary" }]
    },
    {
        id: "whatis", title: "What Is Co-Browse?",
        text: "Co-Browse means you're all looking at the same live website at the same time — and depending on permissions, each person can scroll, click, or type as if they were sitting side-by-side. Unlike screen share, you stay in control of your browser and your data.",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "Skip Intro", id: "skip-intro", type: "secondary" }]
    },
    {
        id: "whyuseful",
        title: "Why It’s Useful",
        text: `
    <ul style="list-style: none; padding-left: 0; text-align: left; margin-top: 5px; margin-bottom: 15px;">
    <li style="display: flex; align-items: center; margin-bottom: 12px; font-size: 0.95em; line-height: 1.4;">
        <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; flex-shrink: 0;">
        <circle cx="12" cy="12" r="11" fill="#4CAF50"/>
        <path d="M8.5 12.5L11 15L15.5 9.5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Sales teams use co-browsing for interactive product demos.
    </li>
    <li style="display: flex; align-items: center; margin-bottom: 12px; font-size: 0.95em; line-height: 1.4;">
        <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; flex-shrink: 0;">
        <circle cx="12" cy="12" r="11" fill="#4CAF50"/>
        <path d="M8.5 12.5L11 15L15.5 9.5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Support teams guide users through confusing forms.
    </li>
    <li style="display: flex; align-items: center; margin-bottom: 0px; font-size: 0.95em; line-height: 1.4;">
        <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; flex-shrink: 0;">
        <circle cx="12" cy="12" r="11" fill="#4CAF50"/>
        <path d="M8.5 12.5L11 15L15.5 9.5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Designers and QA teams review layouts together.
    </li>
    </ul>
    <p style="font-size: 0.9em; text-align: center; line-height: 1.6; margin-top: 0;">It’s collaborative, fast, and secure — especially for websites you don’t control.</p>
`,
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "Skip Intro", id: "skip-intro", type: "secondary" }]
    },
    {
        id: "invite", title: "How to Invite Others",
        text: `Click the “Copy Link” button below. This link points to your active session — so whoever opens it will join you right here, right now. <br><br>Your shareable link is:`,
        showLinkSharing: true,
        buttons: [{ text: "Copy Link", id: "copy", type: "primary" }, { text: "Tour Features", id: "next-features", type: "primary" }, { text: "Skip All", id: "skip-all", type: "secondary" }]
    },
    {
        id: "participantsBtn", title: "Session Participants",
        text: `
          <div style="margin-bottom: 10px; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" role="presentation" data-t="svg" data-t-ui="icon-users" viewBox="0 0 16 16" height="21px" width="21px" class="" style="display: inline-block;"><g data-t="icon-g-wrapper" transform="scale(0.6666666666666666)"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.75 7C4.75 5.20507 6.20507 3.75 8 3.75C9.79493 3.75 11.25 5.20507 11.25 7C11.25 8.79493 9.79493 10.25 8 10.25C6.20507 10.25 4.75 8.79493 4.75 7ZM8 2.25C5.37665 2.25 3.25 4.37665 3.25 7C3.25 9.62335 5.37665 11.75 8 11.75C10.6234 11.75 12.75 9.62335 12.75 7C12.75 4.37665 10.6234 2.25 8 2.25ZM14 2.25C13.5858 2.25 13.25 2.58579 13.25 3C13.25 3.41421 13.5858 3.75 14 3.75C15.7949 3.75 17.25 5.20507 17.25 7C17.25 8.79493 15.7949 10.25 14 10.25C13.5858 10.25 13.25 10.5858 13.25 11C13.25 11.4142 13.5858 11.75 14 11.75C16.6234 11.75 18.75 9.62335 18.75 7C18.75 4.37665 16.6234 2.25 14 2.25ZM6 15.75C4.20507 15.75 2.75 17.2051 2.75 19C2.75 19.6904 3.30964 20.25 4 20.25H12C12.6904 20.25 13.25 19.6904 13.25 19C13.25 17.2051 11.7949 15.75 10 15.75H6ZM1.25 19C1.25 16.3766 3.37665 14.25 6 14.25H10C12.6234 14.25 14.75 16.3766 14.75 19C14.75 20.5188 13.5188 21.75 12 21.75H4C2.48122 21.75 1.25 20.5188 1.25 19ZM16 14.25C15.5858 14.25 15.25 14.5858 15.25 15C15.25 15.4142 15.5858 15.75 16 15.75H18C19.7949 15.75 21.25 17.2051 21.25 19C21.25 19.6904 20.6904 20.25 20 20.25H16C15.5858 20.25 15.25 20.5858 15.25 21C15.25 21.4142 15.5858 21.75 16 21.75H20C21.5188 21.75 22.75 20.5188 22.75 19C22.75 16.3766 20.6234 14.25 18 14.25H16Z" fill="var(--color-text-primary)"></path></g></svg>
          </div>
          This icon shows how many people are in the session.`,
        targetSelector: "#webfuse-participants-btn", 
        tooltipPosition: "bottom-right",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    {
        id: "urlInput", title: "Navigate Together",
        text: `
          <div style="margin-bottom: 10px; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" role="presentation" data-t="svg" data-t-ui="icon-plus" viewBox="0 0 24 24" height="29px" width="29px" class="" style="display: inline-block;"><g data-t="icon-g-wrapper" transform="scale(1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.25C12.4142 5.25 12.75 5.58579 12.75 6V11.25H18C18.4142 11.25 18.75 11.5858 18.75 12C18.75 12.4142 18.4142 12.75 18 12.75H12.75V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V12.75H6C5.58579 12.75 5.25 12.4142 5.25 12C5.25 11.5858 5.58579 11.25 6 11.25H11.25V6C11.25 5.58579 11.5858 5.25 12 5.25Z" fill="var(--color-theme-icon)"></path></g></svg>
          </div>
          Create new tabs within a session to navigate to a new web address.`,
        targetSelector: "#webfuse-url-bar", 
        tooltipPosition: "bottom",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    {
        id: "controlBtn", title: "Take Control",
        text: `
          <div style="margin-bottom: 10px; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" role="presentation" data-t="svg" data-t-ui="icon-direction2" viewBox="0 0 24 24" height="29px" width="29px" class="" style="display: inline-block;"><g data-t="icon-g-wrapper" transform="scale(1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.9876 4.68657C18.5308 4.7978 17.8961 5.04966 16.9464 5.42954L7.52597 9.19772C6.23256 9.71509 5.33315 10.0765 4.75714 10.3952C4.52507 10.5237 4.38605 10.624 4.30666 10.6965C4.39793 10.7534 4.55289 10.8267 4.80447 10.9107C5.4289 11.1193 6.37908 11.3108 7.74507 11.584L8.53293 11.7416L8.57141 11.7493C9.17239 11.8695 9.68152 11.9713 10.091 12.1005C10.5267 12.238 10.9159 12.4254 11.2456 12.7551C11.5753 13.0849 11.7627 13.474 11.9002 13.9097C12.0295 14.3192 12.1313 14.8284 12.2515 15.4294L12.2592 15.4678L12.4167 16.2557C12.6899 17.6217 12.8815 18.5719 13.09 19.1963C13.1741 19.4479 13.2474 19.6028 13.3043 19.6941C13.3768 19.6147 13.4771 19.4757 13.6056 19.2436C13.9243 18.6676 14.2857 17.7682 14.8031 16.4748L18.5712 7.05437C18.9511 6.10468 19.203 5.46996 19.3142 5.01318C19.3652 4.80352 19.372 4.68888 19.3689 4.63183C19.3119 4.62877 19.1972 4.63551 18.9876 4.68657ZM19.4175 4.6407C19.417 4.64118 19.4125 4.64016 19.4054 4.63622C19.4145 4.63824 19.4181 4.64022 19.4175 4.6407ZM19.3645 4.59535C19.3606 4.58832 19.3596 4.58376 19.3601 4.58323C19.3605 4.58271 19.3625 4.58623 19.3645 4.59535ZM18.6327 3.22915C19.1949 3.09225 19.9098 3.02435 20.4431 3.55764C20.9764 4.09093 20.9085 4.80583 20.7716 5.36807C20.6319 5.94167 20.3378 6.67681 19.9868 7.55431L19.9639 7.61146L16.1958 17.0319L16.1734 17.0877C15.6836 18.3125 15.2881 19.3012 14.918 19.97C14.7301 20.3095 14.516 20.629 14.2533 20.8626C13.9708 21.1138 13.6024 21.2884 13.1616 21.248C12.7208 21.2075 12.3904 20.9687 12.1583 20.6702C11.9425 20.3928 11.7902 20.0396 11.6673 19.6715C11.4251 18.9465 11.2163 17.9023 10.9576 16.6088L10.9459 16.5499L10.7883 15.762C10.6583 15.1123 10.5716 14.6838 10.4698 14.3612C10.3735 14.0561 10.2834 13.9143 10.1849 13.8158C10.0865 13.7174 9.94467 13.6273 9.63958 13.531C9.317 13.4292 8.88851 13.3424 8.23876 13.2125L7.4509 13.0549L7.39199 13.0431C6.09847 12.7845 5.0543 12.5756 4.32928 12.3335C3.96117 12.2105 3.60801 12.0583 3.33056 11.8425C3.03211 11.6104 2.79327 11.2799 2.75281 10.8392C2.71234 10.3984 2.88701 10.03 3.1382 9.74744C3.37173 9.48476 3.69125 9.27073 4.03082 9.0828C4.69962 8.71267 5.68829 8.31722 6.91307 7.82733L6.96889 7.80501L16.3893 4.03683L16.4465 4.01395C17.324 3.66291 18.0591 3.36883 18.6327 3.22915Z" fill="var(--color-theme-icon)"></path></g></svg>
          </div>
          Click this (cursor icon) to request or give control for interaction on the right.
        `,
        targetSelector: ".webfuse-control-icon", 
        tooltipPosition: "bottom-left",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    {
        id: "drawBtn", title: "Annotate & Draw",
        text: `
          <div style="margin-bottom: 10px; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" role="presentation" data-t="svg" data-t-ui="icon-edit3" viewBox="0 0 24 24" height="29px" width="29px" class="" style="display: inline-block;"><g data-t="icon-g-wrapper" transform="scale(1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.1593 4.90346C17.6361 4.47008 18.3642 4.47009 18.8409 4.90349C18.8596 4.92048 18.884 4.94459 18.9698 5.03033C19.0555 5.11606 19.0796 5.14047 19.0966 5.15917C19.53 5.63593 19.53 6.36399 19.0966 6.84075C19.0796 6.85945 19.0555 6.88385 18.9697 6.96959L18.1627 7.77665C17.0865 7.80091 16.1991 6.91356 16.2233 5.83742L17.0305 5.0303C17.1162 4.94456 17.1406 4.92046 17.1593 4.90346ZM14.9524 7.10832L7.09722 14.9634C6.29045 15.7702 5.98987 16.0796 5.78372 16.4437C5.57758 16.8078 5.46691 17.2247 5.19019 18.3316L5.03079 18.9692L5.6684 18.8098C6.77527 18.5331 7.1922 18.4224 7.55629 18.2163C7.92038 18.0101 8.22978 17.7095 9.03654 16.9028L16.8917 9.04759C16.0064 8.70195 15.2981 7.99364 14.9524 7.10832ZM19.8499 3.79356C18.801 2.84007 17.1993 2.84005 16.1504 3.79351C16.1016 3.83787 16.0497 3.88972 15.9824 3.95705L15.9698 3.96963L6.03657 13.9028L5.96302 13.9763C5.25466 14.6844 4.79718 15.1417 4.47843 15.7047C4.15967 16.2676 4.00291 16.8952 3.76019 17.8669L3.73498 17.9678L3.27241 19.8181C3.20851 20.0737 3.2834 20.344 3.46969 20.5303C3.65597 20.7166 3.92634 20.7915 4.18192 20.7276L6.03221 20.265L6.1331 20.2398C7.1048 19.9971 7.73236 19.8403 8.29534 19.5216C8.85831 19.2028 9.31561 18.7453 10.0237 18.037L10.0972 17.9635L20.0304 8.03025L20.043 8.01763C20.1103 7.95033 20.1622 7.8985 20.2065 7.84971C21.16 6.80085 21.16 5.19912 20.2066 4.15023C20.1622 4.10145 20.1104 4.04963 20.0431 3.98235L20.043 3.98228L20.0305 3.96969L20.0179 3.95713L20.0179 3.95709C19.9506 3.88977 19.8987 3.83792 19.8499 3.79356Z" fill="var(--color-theme-icon)"></path></g></svg>
          </div>
          This pencil icon activates drawing mode for on-page annotations.`,
        targetSelector: "button[aria-label='Draw']", 
        tooltipPosition: "bottom-left",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    {
        id: "videoBtn", title: "Adjust Screen Size",
        text: `
          <div style="margin-bottom: 10px; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" role="presentation" data-t="svg" data-t-ui="icon-devices" viewBox="0 0 24 24" height="29px" width="29px" class="" style="display: inline-block;"><g data-t="icon-g-wrapper" transform="scale(1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 4.25H6.948C6.04952 4.24997 5.3003 4.24995 4.70552 4.32991C4.07773 4.41432 3.51093 4.59999 3.05546 5.05546C2.59999 5.51093 2.41432 6.07773 2.32991 6.70552C2.24994 7.3003 2.24997 8.04952 2.25 8.948L2.25 9V16.25H1.33333C0.735025 16.25 0.25 16.735 0.25 17.3333C0.25 19.2203 1.77969 20.75 3.66667 20.75H18.8391L18.948 20.75H18.948L19 20.75L19.052 20.75H19.052H19.0521C19.9505 20.75 20.6997 20.7501 21.2945 20.6701C21.9223 20.5857 22.4891 20.4 22.9445 19.9445C23.4 19.4891 23.5857 18.9223 23.6701 18.2945C23.7501 17.6997 23.75 16.9505 23.75 16.0521V16.052V16.052L23.75 16V12L23.75 11.948V11.948V11.9479C23.75 11.0495 23.7501 10.3003 23.6701 9.70552C23.5857 9.07773 23.4 8.51093 22.9445 8.05546C22.6017 7.71257 22.1957 7.52259 21.7481 7.4136C21.7457 7.20676 21.7406 7.02081 21.7292 6.85464C21.7076 6.53754 21.661 6.23801 21.5407 5.94762C21.2616 5.27379 20.7262 4.73844 20.0524 4.45933C19.762 4.33905 19.4625 4.29241 19.1454 4.27077C18.8408 4.24999 18.4697 4.24999 18.0253 4.25H18.0252H18H7ZM3.66667 19.25H14.5817C14.4506 18.9546 14.3755 18.6334 14.3299 18.2945C14.3072 18.1254 14.2909 17.9439 14.2793 17.75H3H1.79542C1.98566 18.6082 2.75121 19.25 3.66667 19.25ZM14.25 16.052L14.25 16.25H3.75V9C3.75 8.03599 3.75159 7.38843 3.81654 6.90539C3.87858 6.44393 3.9858 6.24643 4.11612 6.11612C4.24643 5.9858 4.44393 5.87858 4.90539 5.81654C5.38843 5.75159 6.03599 5.75 7 5.75H18C18.4762 5.75 18.7958 5.75041 19.0433 5.76729C19.284 5.78372 19.4012 5.81319 19.4784 5.84515C19.7846 5.97202 20.028 6.21536 20.1549 6.52165C20.1868 6.5988 20.2163 6.71602 20.2327 6.95674C20.2388 7.0466 20.2428 7.14597 20.2454 7.25889C19.8826 7.24997 19.4846 7.24998 19.052 7.25L19 7.25L18.948 7.25C18.0495 7.24997 17.3003 7.24994 16.7055 7.32991C16.0777 7.41432 15.5109 7.59999 15.0555 8.05546C14.6 8.51093 14.4143 9.07773 14.3299 9.70552C14.2499 10.3003 14.25 11.0495 14.25 11.948L14.25 12V16L14.25 16.052ZM21.0946 19.1835C20.6116 19.2484 19.964 19.25 19 19.25C18.036 19.25 17.3884 19.2484 16.9054 19.1835C16.4439 19.1214 16.2464 19.0142 16.1161 18.8839C15.9858 18.7536 15.8786 18.5561 15.8165 18.0946C15.7516 17.6116 15.75 16.964 15.75 16V12C15.75 11.036 15.7516 10.3884 15.8165 9.90539C15.8786 9.44393 15.9858 9.24643 16.1161 9.11612C16.2464 8.9858 16.4439 8.87858 16.9054 8.81654C17.3884 8.75159 18.036 8.75 19 8.75C19.964 8.75 20.6116 8.75159 21.0946 8.81654C21.5561 8.87858 21.7536 8.9858 21.8839 9.11612C22.0142 9.24643 22.1214 9.44393 22.1835 9.90539C22.2484 10.3884 22.25 11.036 22.25 12V16C22.25 16.964 22.2484 17.6116 22.1835 18.0946C22.1214 18.5561 22.0142 18.7536 21.8839 18.8839C21.7536 19.0142 21.5561 19.1214 21.0946 19.1835ZM19 12C19.5523 12 20 11.5523 20 11C20 10.4477 19.5523 10 19 10C18.4477 10 18 10.4477 18 11C18 11.5523 18.4477 12 19 12Z" fill="var(--color-theme-icon)"></path></g></svg>
          </div>
          Match the webpage view for all participants. Click this icon to select a common screen resolution (desktop, tablet, mobile) for the session.`,
        targetSelector: "#webfuse-screenshare-toggle", 
        tooltipPosition: "bottom-left",
        buttons: [{ text: "Next", id: "next", type: "primary" }, { text: "End Tour", id: "finish", type: "secondary" }]
    },
    {
        id: "endSessionBtn", title: "End Session",
        text: `
          <div style="margin-bottom: 10px; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" role="presentation" data-t="svg" data-t-ui="icon-power" viewBox="0 0 24 24" height="29px" width="29px" class="" style="display: inline-block;"><g data-t="icon-g-wrapper" transform="scale(1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.75 2C12.75 1.58579 12.4142 1.25 12 1.25C11.5858 1.25 11.25 1.58579 11.25 2V12C11.25 12.4142 11.5858 12.75 12 12.75C12.4142 12.75 12.75 12.4142 12.75 12V2ZM6.81445 5.58303C7.13645 5.32247 7.18625 4.85021 6.92569 4.52822C6.66513 4.20622 6.19288 4.15641 5.87088 4.41697C5.46305 4.74699 5.08242 5.10922 4.73283 5.49981C3.1894 7.22428 2.25 9.50333 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 9.50333 20.8106 7.22428 19.2672 5.49981C18.9176 5.10922 18.5369 4.74699 18.1291 4.41697C17.8071 4.15641 17.3349 4.20622 17.0743 4.52822C16.8137 4.85021 16.8636 5.32247 17.1855 5.58303C17.5309 5.86251 17.8533 6.16934 18.1495 6.50019C19.4563 7.96026 20.25 9.88655 20.25 12C20.25 16.5563 16.5563 20.25 12 20.25C7.44365 20.25 3.75 16.5563 3.75 12C3.75 9.88655 4.54373 7.96026 5.85053 6.50019C6.14665 6.16933 6.46906 5.86251 6.81445 5.58303Z" fill="var(--color-theme-icon)"></path></g></svg>
          </div>
          When you're done, click this (power icon) to end the co-browse session.`,
        targetSelector: "#webfuse-end-session-btn", // Placeholder - REPLACE THIS
        tooltipPosition: "bottom-left",
        buttons: [{ text: "Finish Tour", id: "finish", type: "primary" }]
    }
  ];
  let currentStepIndex = 0;

  const backdropElement = document.createElement('div');
  backdropElement.id = 'wf-tour-backdrop';
  const modalElement = document.createElement('div');
  modalElement.id = 'wf-tour-modal';
  modalElement.classList.add('card');

  document.body.appendChild(backdropElement);
  document.body.appendChild(modalElement);

  function clearHighlight() {
    if (currentlyHighlightedElement) {
      currentlyHighlightedElement.classList.remove('wf-tour-highlighted-element');
      currentlyHighlightedElement = null;
    }
  }

  function renderCurrentStep() {
    clearHighlight(); // Clear previous highlight
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
            ${step.buttons.map(button => `
                <button id="wf-tour-btn-${button.id}" class="${button.type === 'primary' ? 'acceptButton' : 'declineButton'}">
                    ${button.text}
                </button>
            `).join('')}
        </div>
        <div id="wf-tour-logo-container">
            ${svgLogoString}
        </div>
    `;

    if (step.targetSelector) {
      const targetElement = document.querySelector(step.targetSelector);
      if (targetElement) {
        currentlyHighlightedElement = targetElement;
        targetElement.classList.add('wf-tour-highlighted-element');
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

        const targetRect = targetElement.getBoundingClientRect();
        modalElement.classList.add('tooltip-mode'); // Add class for tooltip specific styles

        // Basic positioning logic (can be expanded)
        let modalTop = targetRect.bottom + 15 + window.scrollY;
        let modalLeft = targetRect.left + window.scrollX;

        // Adjust if modal goes off-screen (very basic adjustment)
        if (modalLeft + modalElement.offsetWidth > window.innerWidth - 20) {
            modalLeft = window.innerWidth - modalElement.offsetWidth - 20;
        }
        if (modalLeft < 10) modalLeft = 10;
        
        // If modal would go off bottom, try to position above
        if (modalTop + modalElement.offsetHeight > window.innerHeight - 20 + window.scrollY) {
            modalTop = targetRect.top - modalElement.offsetHeight - 15 + window.scrollY;
        }
        if (modalTop < 10 + window.scrollY) modalTop = 10 + window.scrollY;


        modalElement.style.top = `${modalTop}px`;
        modalElement.style.left = `${modalLeft}px`;
        modalElement.style.position = 'absolute'; // Change from fixed
        modalElement.style.transform = 'translate(0, 0)'; // Reset transform from centered mode

      } else {
        console.warn(`Webfuse Onboarding Tour: Target element for selector "${step.targetSelector}" not found.`);
        // Fallback to centered if target not found
        modalElement.classList.remove('tooltip-mode');
        modalElement.style.position = 'fixed';
        modalElement.style.top = '50%';
        modalElement.style.left = '50%';
        modalElement.style.transform = 'translate(-50%, -50%)';
      }
    } else {
      // Default centered position for non-tooltip steps
      modalElement.classList.remove('tooltip-mode');
      modalElement.style.position = 'fixed';
      modalElement.style.top = '50%';
      modalElement.style.left = '50%';
      modalElement.style.transform = 'translate(-50%, -50%)';
    }
    attachButtonListenersForCurrentStep();
  }

  function closeTour() {
    clearHighlight();
    backdropElement.remove();
    modalElement.remove();
    styleTag.remove();
  }

  function attachButtonListenersForCurrentStep() {
    const step = tourSteps[currentStepIndex];
    step.buttons.forEach(buttonConfig => {
        const buttonElement = document.getElementById(`wf-tour-btn-${buttonConfig.id}`);
        if (buttonElement) {
            buttonElement.addEventListener('click', () => {
                switch (buttonConfig.id) {
                    case 'next':
                    case 'next-features': // "Tour Features" button
                        if (currentStepIndex < tourSteps.length - 1) {
                            currentStepIndex++;
                            renderCurrentStep();
                        } else { // Should not happen if 'next' is not on last step
                            closeTour();
                        }
                        break;
                    case 'skip-intro': // Skip to feature tour or end if no features
                        const firstFeatureStepIndex = tourSteps.findIndex(s => s.targetSelector);
                        if (firstFeatureStepIndex !== -1) {
                            currentStepIndex = firstFeatureStepIndex;
                            renderCurrentStep();
                        } else {
                            closeTour();
                        }
                        break;
                    case 'skip-all': // Skip everything
                    case 'finish': // "End Tour" or "Start Browse"
                        closeTour();
                        break;
                    case 'copy':
                        const linkInput = document.getElementById('wf-tour-link-input');
                        if (linkInput && linkInput.value && linkInput.value !== 'Loading link...') {
                            linkInput.select(); linkInput.focus();
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(linkInput.value).then(() => {
                                    buttonElement.textContent = "Copied!";
                                    setTimeout(() => { buttonElement.textContent = "Copy Link"; }, 1500);
                                }).catch(err => {
                                    console.error('Clipboard copy failed:', err);
                                    tryCopyFallback(linkInput, buttonElement, "Copy Link");
                                });
                            } else { tryCopyFallback(linkInput, buttonElement, "Copy Link"); }
                        } else { alert("Session link is not available to copy yet."); }
                        break;
                }
            });
        }
    });
  }
  
  function tryCopyFallback(inputElement, buttonElement, originalButtonText) {
    try {
      const successful = document.execCommand('copy');
      if (successful) { buttonElement.textContent = "Copied!"; }
      else { console.error('Fallback execCommand("copy") returned false.'); alert("Copy failed. Please copy manually.");}
    } catch (fallbackErr) {
      console.error('Fallback execCommand("copy") also failed:', fallbackErr); alert("Copy failed. Please copy manually.");
    } finally { setTimeout(() => { buttonElement.textContent = originalButtonText; }, 1500); }
  }

  const styleContent = `
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
      /* Default to fixed centered */
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      transition: top 0.3s ease-out, left 0.3s ease-out, transform 0.3s ease-out; /* Smooth transitions */
    }
    .card.tooltip-mode { /* Style for when modal is a tooltip */
      /* Position will be set by JS to 'absolute' */
      /* transform will be set by JS to 'translate(0,0)' */
      width: 300px; /* Tooltips can be smaller */
      padding: 15px 20px;
      gap: 10px;
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
      background-color:rgb(0, 40, 150);
      box-shadow: 0 4px 6px -1px rgba(123, 87, 255, 0.5), 0 2px 4px -1px rgba(123, 87, 255, 0.5);
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
      background-color:rgb(0, 119, 255);
      box-shadow: 0 6px 10px -3px rgba(145, 115, 255, 0.6), 0 4px 6px -2px rgba(145, 115, 255, 0.6);
    }
    .wf-tour-highlighted-element { /* Style for highlighting the target UI element */
      outline: 3px solid #7b57ff !important;
      box-shadow: 0 0 0 5px rgba(123, 87, 255, 0.3), 0 0 15px rgba(123, 87, 255, 0.5) !important;
      border-radius: 4px; /* Optional: adds rounded corners to the highlight */
      position: relative; /* Needed for z-index to work reliably over other elements */
      z-index: 20001 !important; /* Ensure highlight is above other page content but below modal if modal overlaps */
      transition: outline 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    #wf-tour-logo-container {
        width: 100%;
        text-align: center;
        margin-top: 10px; /* Space above the logo */
        margin-bottom: 5px; /* Space below the logo */
        line-height: 0; /* Helps to remove extra space if SVG is inline-block */
    }
    #wf-tour-logo-container svg {
        height: 20px; /* Adjust for desired smallness */
        width: auto; /* Maintain aspect ratio based on height */
        display: inline-block;
    }
  `;

  const styleTag = document.createElement("style");
  styleTag.id = 'wf-tour-styles';
  styleTag.textContent = styleContent;
  document.head.appendChild(styleTag);

  renderCurrentStep();

  const spaceLinkEnvKey = "SPACE_LINK";
  if (typeof browser !== "undefined" && browser.virtualSession && browser.virtualSession.env && browser.virtualSession.env[spaceLinkEnvKey]) {
    console.log(`Webfuse Onboarding Tour: Legacy env var '${spaceLinkEnvKey}' found with value: '${browser.virtualSession.env[spaceLinkEnvKey]}'. This is not used for primary link determination.`);
  }
})();