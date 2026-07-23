export function initHomeInteractions(signal) {
  if (!signal) throw new Error('AbortSignal required');
/* Header relocate / hide / quote-jump / hero rotation → src/interactions/siteChrome.ts */

    (function () {
      function getCapabilityCategory() {
        const fileName = decodeURIComponent((window.location.pathname.split("/").pop() || "").toLowerCase());
        if (fileName.indexOf("能力中心—服务部分") === 0 || fileName.indexOf("服务子页面") !== -1) return "service";
    if (fileName.indexOf("能力中心—材料部分") === 0 || fileName.indexOf("材料子页面") !== -1) return "material";
        if (fileName.indexOf("能力中心—表面处理部分") === 0 || fileName.indexOf("表面处理子页面") !== -1) return "finish";
        if (fileName.indexOf("能力中心—工艺部分") === 0) return "process";
        return null;
      }

      document.querySelectorAll(".capability-menu").forEach((menu) => {
        const cats = Array.from(menu.querySelectorAll("[data-menu-category]"));
        const panels = Array.from(menu.querySelectorAll("[data-menu-panel]"));
        const previews = Array.from(menu.querySelectorAll("[data-menu-preview]"));
        let activeCategory = getCapabilityCategory();
        let defaultCategory = activeCategory || "process";

        function setCapabilityMenu(key, keepCatActive) {
          cats.forEach((cat) => {
            const active = keepCatActive && cat.dataset.menuCategory === key;
            cat.classList.toggle("is-active", active);
            cat.setAttribute("aria-selected", active ? "true" : "false");
          });

          panels.forEach((panel) => {
            panel.classList.toggle("is-active", panel.dataset.menuPanel === key);
          });

          previews.forEach((preview) => {
            preview.classList.toggle("is-active", preview.dataset.menuPreview === key);
          });
        }

        function restoreCurrentMenu() {
          setCapabilityMenu(defaultCategory, Boolean(activeCategory));
        }

        cats.forEach((cat) => {
          cat.addEventListener("mouseenter", () => setCapabilityMenu(cat.dataset.menuCategory, true));
          cat.addEventListener("focus", () => setCapabilityMenu(cat.dataset.menuCategory, true));
          cat.addEventListener("click", () => {
            activeCategory = cat.dataset.menuCategory;
            defaultCategory = activeCategory;
            setCapabilityMenu(activeCategory, true);
          });
        });

        menu.addEventListener("mouseleave", restoreCurrentMenu);
        menu.addEventListener("focusout", () => {
          window.setTimeout(() => {
            if (!menu.contains(document.activeElement)) restoreCurrentMenu();
          }, 0);
        });

        restoreCurrentMenu();
      });
    })();
    (function () {
      const decks = document.querySelectorAll("[data-quality-deck]");
      if (!decks.length) return;
      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      decks.forEach((deck) => {
        const cards = Array.from(deck.querySelectorAll("[data-deck-card]"));
        const counter = deck.querySelector("[data-deck-counter]");
        if (cards.length < 2) return;
        let activeIndex = 0;
        let pointerId = null;
        let startX = 0;
        let startY = 0;
        let dragX = 0;
        let dragY = 0;
        const states = ["is-active", "is-next", "is-third", "is-fourth", "is-fifth", "is-sixth", "is-seventh"];

        function clearMotion(card) {
          ["--drag-x", "--drag-y", "--drag-rotate", "--exit-x", "--exit-y", "--exit-rotate"].forEach((name) => card.style.removeProperty(name));
        }

        function syncDeck() {
          cards.forEach((card, index) => {
            const offset = (index - activeIndex + cards.length) % cards.length;
            card.classList.remove(...states, "is-dragging", "is-exiting");
            card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
            card.tabIndex = offset === 0 ? 0 : -1;
            clearMotion(card);
            if (states[offset]) card.classList.add(states[offset]);
          });
          if (counter) counter.textContent = String(activeIndex + 1).padStart(2, "0") + " / " + String(cards.length).padStart(2, "0");
        }

        function finish(card, switchCard, clicked) {
          card.classList.remove("is-dragging");
          deck.classList.remove("is-dragging");
          if (!switchCard) { clearMotion(card); return; }
          if (clicked) { dragX = 150; dragY = -10; }
          card.style.setProperty("--exit-x", dragX * 1.9 + "px");
          card.style.setProperty("--exit-y", dragY * 1.9 + "px");
          card.style.setProperty("--exit-rotate", clamp(dragX * .04, -18, 18) + "deg");
          card.classList.add("is-exiting");
          window.setTimeout(() => { activeIndex = (activeIndex + 1) % cards.length; syncDeck(); }, 260);
        }

        function flip(card) {
          if (!card.classList.contains("is-active") || card.classList.contains("is-exiting")) return;
          dragX = 150; dragY = -10; finish(card, true, true);
        }

        cards.forEach((card) => {
          card.addEventListener("pointerdown", (event) => {
            if (event.target.closest(".quality-card-link")) return;
            if (!card.classList.contains("is-active") || (event.button && event.button !== 0)) return;
            pointerId = event.pointerId; startX = event.clientX; startY = event.clientY; dragX = 0; dragY = 0;
            card.classList.add("is-dragging"); deck.classList.add("is-dragging"); card.setPointerCapture(event.pointerId);
          });
          card.addEventListener("pointermove", (event) => {
            if (pointerId !== event.pointerId || !card.classList.contains("is-dragging")) return;
            dragX = event.clientX - startX; dragY = event.clientY - startY;
            card.style.setProperty("--drag-x", dragX + "px"); card.style.setProperty("--drag-y", dragY + "px"); card.style.setProperty("--drag-rotate", clamp(dragX * .035, -14, 14) + "deg");
          });
          card.addEventListener("pointerup", (event) => {
            if (pointerId !== event.pointerId || !card.classList.contains("is-dragging")) return;
            const distance = Math.hypot(dragX, dragY); const clicked = distance < 10; pointerId = null; finish(card, distance > 82 || clicked, clicked);
          });
          card.addEventListener("pointercancel", (event) => { if (pointerId !== event.pointerId) return; pointerId = null; finish(card, false, false); });
          card.addEventListener("keydown", (event) => { if (event.target.closest(".quality-card-link")) return; if (event.key !== "Enter" && event.key !== " ") return; event.preventDefault(); flip(card); });
        });
        syncDeck();
      });
    })();
    (function () {
      const aiWidget = document.querySelector(".floating-ai");
      const supportWidget = document.querySelector(".floating-support");
      const supportToggleBtn = document.getElementById("support-toggle-btn");
      const supportCloseBtn = document.getElementById("support-close-btn");
      const supportToggleIcon = document.getElementById("support-toggle-icon");
      const isEnglishPage = document.documentElement.lang === "en";
      const supportOpenLabel = isEnglishPage ? "Open online support" : "打开在线客服";
      const supportCloseLabel = isEnglishPage ? "Hide online support" : "收起在线客服";
      const toggleBtn = document.getElementById("ai-toggle-btn");
      const closeBtn = document.getElementById("close-chat");
      const toggleIcon = document.getElementById("toggle-icon");
      const aiPanel = document.getElementById("ai-chat-window");
      const moduleTabs = aiPanel ? Array.from(aiPanel.querySelectorAll("[data-ai-module]")) : [];
      const moduleThreads = aiPanel ? Array.from(aiPanel.querySelectorAll("[data-ai-thread]")) : [];
      const aiInput = aiPanel ? aiPanel.querySelector(".ai-input-row input") : null;
      const aiSend = aiPanel ? aiPanel.querySelector(".ai-send") : null;
      const quotaText = aiPanel ? aiPanel.querySelector("[data-ai-quota-text]") : null;
      const contextLabel = aiPanel ? aiPanel.querySelector("[data-ai-context-label]") : null;
      const loginOverlay = aiPanel ? aiPanel.querySelector(".ai-login-overlay") : null;

      const moduleMeta = { process:{label:"工艺分析对话",placeholder:"描述零件结构、材料或加工要求...",waiting:"正在生成工艺分析结果..."}, quote:{label:"智能报价对话",placeholder:"输入数量、材料、表面处理和期望交期...",waiting:"正在拆解成本和交付周期..."}, image:{label:"图片转 3D 对话",placeholder:"描述图片中的零件与需要保留的结构特征...",waiting:"正在识别轮廓、结构特征与待确认尺寸..."}, text:{label:"文字转 3D 对话",placeholder:"描述零件用途、外形、尺寸与结构关系...",waiting:"正在把文字需求转换为建模参数..."}, dfm:{label:"DFM 检查对话",placeholder:"描述薄壁、孔位、装配或外观面的疑问...",waiting:"正在检查可制造性风险..."} };

      const guestQuota = Number(aiPanel?.dataset.guestQuota || 3);
      const isLoggedIn = Boolean(window.AGILE_AI_USER && window.AGILE_AI_USER.loggedIn);
      let activeModule = "process";
      let remainingQuota = isLoggedIn ? Infinity : guestQuota;

      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }

      function setFixedPosition(widget, left, top) {
        const rect = widget.getBoundingClientRect();
        const nextLeft = clamp(left, 8, window.innerWidth - rect.width - 8);
        const nextTop = clamp(top, 8, window.innerHeight - rect.height - 8);
        widget.style.left = nextLeft + "px";
        widget.style.top = nextTop + "px";
        widget.style.right = "auto";
        widget.style.bottom = "auto";
      }

      function enableDrag(widget, handles) {
        if (!widget) return;

        handles.forEach((handle) => {
          if (!handle) return;
          handle.addEventListener("pointerdown", (event) => {
            const buttonTarget = event.target.closest("button");
            if (event.target.closest("input, a") || (buttonTarget && buttonTarget !== handle)) return;

            const startRect = widget.getBoundingClientRect();
            const startX = event.clientX;
            const startY = event.clientY;
            let moved = false;

            widget.classList.add("is-dragging");
            handle.setPointerCapture(event.pointerId);

            function onMove(moveEvent) {
              const deltaX = moveEvent.clientX - startX;
              const deltaY = moveEvent.clientY - startY;
              if (Math.abs(deltaX) + Math.abs(deltaY) > 3) moved = true;
              setFixedPosition(widget, startRect.left + deltaX, startRect.top + deltaY);
            }

            function onUp() {
              widget.classList.remove("is-dragging");
              document.removeEventListener("pointermove", onMove);
              if (moved) {
                widget.dataset.dragged = "true";
                setTimeout(() => {
                  delete widget.dataset.dragged;
                }, 0);
              }
            }

            document.addEventListener("pointermove", onMove);
            document.addEventListener("pointerup", onUp, { once: true });
          });
        });
      }

      function setSupportCollapsed(collapsed) {
        if (!supportWidget) return;
        supportWidget.classList.toggle("is-collapsed", collapsed);
        if (supportToggleBtn) {
          supportToggleBtn.setAttribute("aria-expanded", String(!collapsed));
          supportToggleBtn.setAttribute("aria-label", collapsed ? supportOpenLabel : supportCloseLabel);
        }
        if (supportToggleIcon) {
          supportToggleIcon.innerHTML = collapsed
            ? '<path d="M5 6.5h14v9H9l-4 3v-12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 10h6M9 13h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
            : '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
        }
      }

      function setAiCollapsed(collapsed) {
        if (!aiWidget) return;
        aiWidget.classList.toggle("is-collapsed", collapsed);
        if (!collapsed) {
          // Collapsed FAB is 54×54; clear any drag/size inline styles so the panel can open fully.
          aiWidget.style.width = "";
          aiWidget.style.height = "";
          aiWidget.style.maxWidth = "";
          aiWidget.style.overflow = "";
          const panel = aiWidget.querySelector(".ai-panel");
          if (panel) {
            panel.style.visibility = "";
            panel.style.opacity = "";
            panel.style.transform = "";
            panel.style.pointerEvents = "";
          }
          // Keep the expanded panel inside the viewport.
          requestAnimationFrame(() => {
            const rect = aiWidget.getBoundingClientRect();
            const pad = 12;
            let left = rect.left;
            let top = rect.top;
            if (rect.right > window.innerWidth - pad) left = window.innerWidth - rect.width - pad;
            if (rect.bottom > window.innerHeight - pad) top = window.innerHeight - rect.height - pad;
            if (left < pad) left = pad;
            if (top < pad) top = pad;
            if (left !== rect.left || top !== rect.top) {
              setFixedPosition(aiWidget, left, top);
            }
          });
        }
        if (toggleIcon) {
          toggleIcon.innerHTML = collapsed
            ? '<path d="M12 3.5 13.8 9l5.7 1.2-5.7 1.2L12 17l-1.8-5.6-5.7-1.2L10.2 9 12 3.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M18 15.5 18.8 18l2.7.5-2.7.6-.8 2.4-.8-2.4-2.7-.6 2.7-.5.8-2.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
            : '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
        }
      }

      function setLoginOverlayVisible(visible) {
        if (!loginOverlay) return;
        loginOverlay.classList.toggle("is-visible", visible);

        if (!visible) {
          loginOverlay.removeAttribute("style");
          return;
        }

        Object.assign(loginOverlay.style, {
          position: "absolute",
          inset: "12px 14px 14px",
          display: "grid",
          alignContent: "center",
          justifyItems: "center",
          gap: "8px",
          padding: "12px 14px",
          opacity: "1",
          visibility: "visible",
          pointerEvents: "auto",
          textAlign: "center",
          background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
          border: "1px solid rgba(0, 74, 198, 0.12)",
          borderRadius: "18px",
          boxShadow: "0 10px 26px rgba(18, 24, 38, 0.07)",
          backdropFilter: "none",
          transition: "none"
        });
      }

      function syncQuota(lockNow = true) {
        if (!aiPanel) return;

        if (isLoggedIn) {
          aiPanel.classList.remove("is-locked");
          setLoginOverlayVisible(false);
          if (quotaText) quotaText.textContent = "已登录";
          const status = aiPanel.querySelector(".ai-status");
          if (status) status.textContent = "完整功能已开启";
          return;
        }

        const quotaCopy = remainingQuota <= 0 ? "游客额度已用完" : "游客剩余 " + Math.max(remainingQuota, 0) + " 轮";
        if (quotaText) quotaText.textContent = quotaCopy;
        const status = aiPanel.querySelector(".ai-status");
        if (status) status.textContent = quotaCopy;
        const locked = lockNow && remainingQuota <= 0;
        aiPanel.classList.toggle("is-locked", locked);
        setLoginOverlayVisible(locked);
      }

      function setActiveModule(moduleKey) {
        if (!moduleMeta[moduleKey]) return;
        activeModule = moduleKey;

        moduleTabs.forEach((tab) => {
          const active = tab.dataset.aiModule === moduleKey;
          tab.classList.toggle("is-active", active);
          tab.setAttribute("aria-selected", active ? "true" : "false");
        });

        moduleThreads.forEach((thread) => {
          const active = thread.dataset.aiThread === moduleKey;
          thread.classList.toggle("is-active", active);
          thread.toggleAttribute("hidden", !active);
        });

        if (contextLabel) contextLabel.textContent = moduleMeta[moduleKey].label;
        if (aiInput) aiInput.placeholder = moduleMeta[moduleKey].placeholder;
      }

      function getActiveMessages(moduleKey) {
        return aiPanel?.querySelector('[data-ai-thread="' + moduleKey + '"] .ai-messages');
      }

      function scrollThread(moduleKey) {
        const messages = getActiveMessages(moduleKey);
        if (messages) messages.scrollTop = messages.scrollHeight;
      }

      function appendTextMessage(moduleKey, role, text) {
        const messages = getActiveMessages(moduleKey);
        if (!messages) return null;

        const message = document.createElement("div");
        message.className = "ai-message " + role;

        if (role === "bot") {
          const avatar = document.createElement("span");
          avatar.className = "support-avatar";
          avatar.setAttribute("aria-hidden", "true");
          avatar.textContent = "AI";
          message.appendChild(avatar);
        }

        const bubble = document.createElement("div");
        bubble.className = "ai-bubble";
        bubble.textContent = text;
        message.appendChild(bubble);
        messages.appendChild(message);
        scrollThread(moduleKey);
        return message;
      }

      function appendHtmlMessage(moduleKey, html) {
        const messages = getActiveMessages(moduleKey);
        if (!messages) return;

        const message = document.createElement("div");
        message.className = "ai-message bot";
        const avatar = document.createElement("span");
        avatar.className = "support-avatar";
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = "AI";
        const card = document.createElement("div");
        card.className = "ai-generated-card";
        card.innerHTML = html;
        message.appendChild(avatar);
        message.appendChild(card);
        messages.appendChild(message);
        scrollThread(moduleKey);
      }

      function requestAiModule(moduleKey) {
        const responses = isEnglishPage ? {
          process: '<h4>Process Analysis</h4><div class="ai-result-grid"><div><span>Route</span><strong>CNC roughing and finishing</strong></div><div><span>Material</span><strong>Aluminum or stainless steel</strong></div><div><span>Risk</span><strong>Control thin walls and deep pockets</strong></div><div><span>Lead time</span><strong>3–5 working days</strong></div></div>',
          quote: '<h4>Instant Quote</h4><div class="ai-result-grid"><div><span>Cost</span><strong>Material, machine time, finish</strong></div><div><span>Quantity</span><strong>Stable pricing above 50 pieces</strong></div><div><span>Lead time</span><strong>5–7 working days</strong></div><div><span>Needed</span><strong>Tolerances and cosmetics</strong></div></div>',
          image: '<h4>Image-to-3D Result</h4><div class="ai-result-grid"><div><span>Outline</span><strong>Main geometry recognized</strong></div><div><span>Features</span><strong>Holes and symmetry detected</strong></div><div><span>Needed</span><strong>Critical dimensions</strong></div><div><span>Output</span><strong>Editable initial 3D draft</strong></div></div>',
          text: '<h4>Text-to-3D Result</h4><div class="ai-result-grid"><div><span>Structure</span><strong>Purpose and geometry parsed</strong></div><div><span>Parameters</span><strong>Dimensions and wall thickness</strong></div><div><span>Output</span><strong>Parametric 3D draft</strong></div><div><span>Review</span><strong>Material and tolerances</strong></div></div>',
          dfm: '<h4>DFM Check</h4><div class="ai-result-grid"><div><span>Wall</span><strong>Review thin-wall regions</strong></div><div><span>Access</span><strong>Confirm tool reach</strong></div><div><span>Assembly</span><strong>Add datum definitions</strong></div><div><span>Finish</span><strong>Confirm masking areas</strong></div></div>'
        } : {
          process: '<h4>工艺分析结果</h4><div class="ai-result-grid"><div><span>推荐路线</span><strong>CNC 粗加工后精加工</strong></div><div><span>材料方向</span><strong>铝合金或不锈钢</strong></div><div><span>风险控制</span><strong>控制薄壁与深腔结构</strong></div><div><span>交付判断</span><strong>样件 3–5 工作日</strong></div></div>',
          quote: '<h4>智能报价结果</h4><div class="ai-result-grid"><div><span>成本构成</span><strong>材料、机时与后处理</strong></div><div><span>数量影响</span><strong>50 件以上价格更稳定</strong></div><div><span>交期预估</span><strong>5–7 工作日</strong></div><div><span>需补充</span><strong>公差与外观要求</strong></div></div>',
          image: '<h4>图片转 3D 结果</h4><div class="ai-result-grid"><div><span>轮廓</span><strong>已识别主体几何</strong></div><div><span>特征</span><strong>已提取孔位与对称结构</strong></div><div><span>待补充</span><strong>关键尺寸信息</strong></div><div><span>输出</span><strong>可编辑 3D 初始草模</strong></div></div>',
          text: '<h4>文字转 3D 结果</h4><div class="ai-result-grid"><div><span>结构</span><strong>已拆解用途与外形</strong></div><div><span>参数</span><strong>尺寸、孔位与壁厚</strong></div><div><span>输出</span><strong>参数化 3D 草模</strong></div><div><span>待确认</span><strong>材料与公差要求</strong></div></div>',
          dfm: '<h4>DFM 检查结果</h4><div class="ai-result-grid"><div><span>薄壁</span><strong>检查局部薄壁区域</strong></div><div><span>刀具</span><strong>确认深腔可达性</strong></div><div><span>装配</span><strong>补充基准定义</strong></div><div><span>后处理</span><strong>确认遮蔽区域</strong></div></div>'
        };

        return new Promise((resolve) => {
          window.setTimeout(() => resolve(responses[moduleKey] || responses.process), 520);
        });
      }

      function handleAiSend() {
        if (!aiPanel || !aiInput || !aiSend) return;
        if (!isLoggedIn && remainingQuota <= 0) {
          syncQuota(true);
          return;
        }

        const text = aiInput.value.trim() || "请根据当前模块给出一版示例分析。";
        const moduleKey = activeModule;
        appendTextMessage(moduleKey, "user", text);
        aiInput.value = "";

        if (!isLoggedIn) {
          remainingQuota -= 1;
          syncQuota(false);
        }

        const thinking = appendTextMessage(moduleKey, "bot", moduleMeta[moduleKey].waiting);
        requestAiModule(moduleKey, text).then((html) => {
          if (thinking) thinking.remove();
          appendHtmlMessage(moduleKey, html);
          syncQuota(true);
        });
      }

      moduleTabs.forEach((tab) => {
        tab.addEventListener("click", () => setActiveModule(tab.dataset.aiModule));
      });

      if (aiSend) {
        aiSend.addEventListener("click", handleAiSend);
      }

      if (aiInput) {
        aiInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleAiSend();
          }
        });
      }

      setActiveModule(activeModule);
      syncQuota(false);

      window.openManufacturingAi = function (moduleKey) {
        setActiveModule(moduleKey);
        setAiCollapsed(false);
        const activeTab = moduleTabs.find((tab) => tab.dataset.aiModule === moduleKey);
        activeTab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        window.setTimeout(() => aiInput?.focus(), 220);
      };

      setSupportCollapsed(true);

      if (supportToggleBtn) {
        supportToggleBtn.addEventListener("click", () => {
          if (!supportWidget || supportWidget.dataset.dragged) return;
          setSupportCollapsed(!supportWidget.classList.contains("is-collapsed"));
        });
      }

      if (supportCloseBtn) {
        supportCloseBtn.addEventListener("click", () => setSupportCollapsed(true));
      }

      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          if (!aiWidget || aiWidget.dataset.dragged) return;
          setAiCollapsed(!aiWidget.classList.contains("is-collapsed"));
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", () => setAiCollapsed(true));
      }

      enableDrag(supportWidget, [document.querySelector(".support-head"), supportToggleBtn]);
      enableDrag(aiWidget, [document.querySelector(".ai-head"), toggleBtn]);

      window.addEventListener("resize", () => {
        [supportWidget, aiWidget].forEach((widget) => {
          if (!widget || !widget.style.left || !widget.style.top) return;
          const rect = widget.getBoundingClientRect();
          setFixedPosition(widget, rect.left, rect.top);
        });
      }, { signal });
    })();

    (function () {
      const services = document.getElementById("services");
      if (!services) return;

      let ticking = false;

      function setServicesActive() {
        ticking = false;
        const rect = services.getBoundingClientRect();
        const active = rect.top < window.innerHeight * 0.86 && rect.bottom > window.innerHeight * 0.12;
        document.body.classList.toggle("is-services-active", active);
      }

      function requestServicesActive() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(setServicesActive);
      }

      setServicesActive();
      window.addEventListener("scroll", requestServicesActive, { passive: true, signal });
      window.addEventListener("resize", requestServicesActive, { signal });
    })();

    (function () {
      const tabs = Array.from(document.querySelectorAll("[data-quote-tab]"));
      const box = document.querySelector(".quote-box-container");
      const header = document.querySelector(".quote-header");
      const quickPanel = document.querySelector('[data-quote-panel="quick"]');
      const showcase = document.querySelector('[data-quote-panel="ai"]');
      const uploadBox = document.getElementById("quick-upload-box");
      const fileInput = document.getElementById("quote-file-input");
      const uploadStatus = document.querySelector("[data-upload-status]");
      const launchButton = document.querySelector("[data-open-quote-ai]");
      const isEnglish = document.documentElement.lang === "en";
      const content = isEnglish ? {
        quick:["Quick Quote","Upload a 3D model and get a quote quickly","Supports STEP / IGES / STL models and drawing formats"],
        image:{module:"image",eyebrow:"Image to 3D",title:"Turn images and sketches into an editable initial 3D model",description:"Give AI a product photo, hand sketch, or structural reference to identify outlines and features, then confirm the dimensions needed for modeling.",badge:"IMAGE TO 3D",window:"Image Modeling Workspace",prompt:"Identify the outline, holes, and symmetric features in this part sketch, then list dimensions that need confirmation.",benefits:[["Feature recognition","Extract shape, holes, and major structures"],["Dimension completion","Request the critical sizes needed for modeling"],["Engineering handoff","Continue into DFM review and quoting"]],outputs:[["Recognition","Structure and feature hierarchy"],["To confirm","Critical dimensions and assembly"],["Model output","Editable initial 3D draft"],["Next step","Engineering review"]]},
        text:{module:"text",eyebrow:"Text to 3D",title:"Describe the requirement and create a parametric 3D draft",description:"Start without a professional drawing. Describe purpose, shape, dimensions, and structural relationships so AI can convert the idea into modeling parameters.",badge:"TEXT TO 3D",window:"Text Modeling Workspace",prompt:"Design an aluminum mounting bracket, 120 mm long and 60 mm wide, with four mounting holes and reinforcing ribs.",benefits:[["Semantic parsing","Identify purpose, shape, and constraints"],["Parameter extraction","Capture dimensions, holes, and wall thickness"],["Fast iteration","Refine the model through conversation"]],outputs:[["Structure","Mounting bracket"],["Main size","120 × 60 mm"],["Features","4 holes and reinforcing ribs"],["Output","Parametric draft"]]},
        smart:{module:"quote",eyebrow:"Instant Quoting",title:"Let AI break down process, cost, and lead time",description:"Provide material, quantity, finishing, and delivery requirements. AI organizes cost components, schedule risks, and missing information for a formal quote.",badge:"AI INSTANT QUOTE",window:"Instant Quoting Workspace",prompt:"Estimate cost and lead time for 50 aluminum 6061 parts with anodizing and a critical tolerance of ±0.05 mm.",benefits:[["Cost breakdown","Material, machine time, finishing, and inspection"],["Lead-time review","Identify scheduling and special-process risks"],["Information check","Flag inputs needed for a formal quote"]],outputs:[["Process route","CNC roughing and finishing"],["Quantity effect","Stable pricing at 50 pieces"],["Lead time","Typical 5–7 working days"],["To provide","Tolerances and cosmetics"]]}
      } : {
        quick:["快速报价","上传3D模型，快速获取报价","支持 STEP / IGES / STL 等3D文件与图纸格式"],
        image:{module:"image",eyebrow:"图片转 3D",title:"从图片与草图生成可编辑 3D 初始模型",description:"将产品照片、手绘草图或结构参考图交给 AI，快速识别轮廓与结构特征，并引导补充关键尺寸。",badge:"IMAGE TO 3D",window:"图片建模工作区",prompt:"根据这张零件草图识别主体轮廓、孔位和对称结构，并列出需要确认的尺寸。",benefits:[["轮廓识别","提取外形、孔位与主要结构"],["尺寸补全","主动询问影响建模的关键尺寸"],["工程衔接","生成结果可继续进入 DFM 与报价"]],outputs:[["识别结果","主体结构与特征层级"],["待确认项","关键尺寸与装配关系"],["模型输出","可编辑 3D 初始草模"],["下一步","工程复核与制造评估"]]},
        text:{module:"text",eyebrow:"文字转 3D",title:"用自然语言描述需求，快速形成参数化 3D 草模",description:"无需先准备专业图纸，通过用途、外形、尺寸和结构关系的文字描述，让 AI 将想法拆解为可确认的建模参数。",badge:"TEXT TO 3D",window:"文字建模工作区",prompt:"设计一个铝合金安装支架，长 120 mm、宽 60 mm，带四个安装孔和加强筋。",benefits:[["语义拆解","识别用途、形状与结构约束"],["参数整理","提取尺寸、孔位和壁厚信息"],["快速迭代","通过对话持续修正模型方向"]],outputs:[["结构类型","安装支架"],["主要尺寸","120 × 60 mm"],["关键特征","4 孔位与加强筋"],["输出状态","参数化草模待确认"]]},
        smart:{module:"quote",eyebrow:"智能报价",title:"AI 拆解工艺、成本与交期，快速形成报价预估",description:"提供材料、数量、表面处理和交付要求，AI 将结合工艺路径整理成本构成、交期风险和需要补充的信息。",badge:"AI INSTANT QUOTE",window:"智能报价工作区",prompt:"铝 6061 零件 50 件，阳极氧化，关键公差 ±0.05 mm，请预估成本和交期。",benefits:[["成本拆解","材料、机时、后处理与质检"],["交期评估","识别排产和特殊工艺风险"],["信息补全","提示正式报价所需的关键资料"]],outputs:[["加工路线","CNC 粗精加工"],["数量影响","50 件批量价格更稳定"],["交期预估","常规 5–7 个工作日"],["待补充","图纸公差与外观要求"]]}
      };

      function render(key) {
        const item = content[key];
        tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.quoteTab === key));
        box.dataset.mode = key;
        const isQuick = key === "quick";
        header.hidden = !isQuick;
        quickPanel.hidden = !isQuick;
        showcase.hidden = isQuick;
        if (isQuick) {
          header.querySelector(".eyebrow").textContent = content.quick[0];
          header.querySelector("h2").textContent = content.quick[1];
          header.querySelector("p").textContent = content.quick[2];
          return;
        }
        header.querySelector(".eyebrow").textContent = item.eyebrow;
        header.querySelector("h2").textContent = item.title;
        header.querySelector("p").textContent = item.description;
        showcase.querySelector("[data-showcase-badge]").textContent = item.badge;
        showcase.querySelector("[data-showcase-title]").textContent = item.title;
        showcase.querySelector("[data-showcase-description]").textContent = item.description;
        showcase.querySelector("[data-showcase-window-label]").textContent = item.window;
        showcase.querySelector("[data-showcase-prompt]").textContent = item.prompt;
        showcase.querySelector("[data-showcase-benefits]").innerHTML = item.benefits.map((value,index) => '<li><span>0'+(index+1)+'</span><div><strong>'+value[0]+'</strong><small>'+value[1]+'</small></div></li>').join("");
        showcase.querySelector("[data-showcase-output]").innerHTML = item.outputs.map((value) => '<div>'+value[0]+'<strong>'+value[1]+'</strong></div>').join("");
        launchButton.dataset.aiTarget = item.module;
      }

      tabs.forEach((tab) => tab.addEventListener("click", () => render(tab.dataset.quoteTab)));
      launchButton?.addEventListener("click", () => window.openManufacturingAi?.(launchButton.dataset.aiTarget || "quote"));
      if (uploadBox && fileInput) {
        uploadBox.addEventListener("dragover", (event) => { event.preventDefault(); uploadBox.classList.add("is-dragover"); });
        uploadBox.addEventListener("dragleave", () => uploadBox.classList.remove("is-dragover"));
        uploadBox.addEventListener("drop", (event) => { event.preventDefault(); uploadBox.classList.remove("is-dragover"); if(event.dataTransfer?.files?.length) updateFiles(event.dataTransfer.files); });
        fileInput.addEventListener("change", (event) => { if(event.target.files?.length) updateFiles(event.target.files); });
      }
      function updateFiles(files) {
        if (!uploadStatus) return;
        const file=files[0], size=file.size<1048576?(file.size/1024).toFixed(1)+" KB":(file.size/1048576).toFixed(2)+" MB";
        uploadStatus.textContent=files.length>1?(isEnglish?file.name+" and "+(files.length-1)+" more files":file.name+" 等 "+files.length+" 个文件"):file.name+" · "+size;
      }
    })();

    (function () {
      const layout = document.querySelector(".home-faq-layout");
      if (!layout) return;

      const title = layout.querySelector(".home-faq-title-row");
      const list = layout.querySelector(".home-faq-list");
      const items = Array.from(layout.querySelectorAll(".home-faq-item"));
      if (!title || !list || !items.length) return;

      function syncFaqConnector() {
        const activeItem = items.find((item) => item.classList.contains("is-active"));
        layout.classList.toggle("has-open", Boolean(activeItem));
        if (!activeItem) return;

        const question = activeItem.querySelector(".home-faq-question");
        if (!question) return;

        const layoutRect = layout.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();
        const questionRect = question.getBoundingClientRect();
        const titleY = titleRect.top + titleRect.height / 2 - layoutRect.top;
        const activeY = questionRect.top + questionRect.height / 2 - layoutRect.top;
        const railX = titleRect.right + 20 - layoutRect.left;
        const connectorEnd = listRect.left - 14 - layoutRect.left;
        const connectorWidth = Math.max(connectorEnd - railX, 20);

        layout.style.setProperty("--faq-title-y", titleY.toFixed(2) + "px");
        layout.style.setProperty("--faq-line-y", activeY.toFixed(2) + "px");
        layout.style.setProperty("--faq-rail-x", railX.toFixed(2) + "px");
        layout.style.setProperty("--faq-connector-w", connectorWidth.toFixed(2) + "px");
      }

      function animateFaqConnector(duration) {
        const startedAt = performance.now();
        function tick(now) {
          syncFaqConnector();
          if (now - startedAt < duration) window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
      }

      items.forEach((item) => {
        const question = item.querySelector(".home-faq-question");
        question?.addEventListener("click", () => {
          const shouldOpen = !item.classList.contains("is-active");
          items.forEach((other) => {
            const active = shouldOpen && other === item;
            other.classList.toggle("is-active", active);
            other.querySelector(".home-faq-question")?.setAttribute("aria-expanded", active ? "true" : "false");
          });
          animateFaqConnector(280);
        });
      });

      window.addEventListener("resize", syncFaqConnector, { signal });
      window.addEventListener("load", syncFaqConnector, { signal });
      syncFaqConnector();
    })();

    (function () {
      const section = document.getElementById("why-us");
      if (!section) return;

      const finalPanel = section.querySelector(".why-final-panel");
      let ticking = false;

      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }

      function lerp(start, end, amount) {
        return start + (end - start) * amount;
      }

      function smooth(value, start, end) {
        if (start === end) return value >= end ? 1 : 0;
        const progress = clamp((value - start) / (end - start), 0, 1);
        return progress * progress * (3 - 2 * progress);
      }

      function setWhyProgress() {
        ticking = false;

        const rect = section.getBoundingClientRect();
        const scrollLength = Math.max(section.offsetHeight - window.innerHeight, 1);
        const progress = clamp(-rect.top / scrollLength, 0, 1);
        document.body.classList.toggle("is-why-scroll-active", rect.top < window.innerHeight * 0.72 && rect.bottom > window.innerHeight * 0.28);
        const isCompact = window.innerWidth <= 760;
        const introMotion = smooth(progress, 0.01, 0.12);
        const introFade = smooth(progress, 0.08, 0.18);
        const maskReveal = smooth(progress, 0.10, 0.15);
        const expand = smooth(progress, 0.13, 0.24);
        const overlayIn = smooth(progress, 0.24, 0.34);
        const overlayOut = smooth(progress, 0.48, 0.56);
        const finalIn = smooth(progress, 0.56, 0.66);
        const startTop = isCompact ? 16 : 10;
        const startSide = isCompact ? 4 : 6;

        section.style.setProperty("--intro-opacity", String(1 - introFade));
        section.style.setProperty("--intro-y", lerp(0, -34, introFade).toFixed(2) + "px");
        section.style.setProperty("--intro-scale", lerp(1, 1.035, introMotion).toFixed(3));
        section.style.setProperty("--intro-bg-x", lerp(42, 64, introMotion).toFixed(2) + "%");
        section.style.setProperty("--intro-bg-y", lerp(42, 58, introMotion).toFixed(2) + "%");
        section.style.setProperty("--intro-bg-size", lerp(isCompact ? 250 : 150, isCompact ? 310 : 205, introMotion).toFixed(2) + "%");
        section.style.setProperty("--mask-opacity", String(maskReveal));
        section.style.setProperty("--mask-top", lerp(startTop, 0, expand).toFixed(2) + "vh");
        section.style.setProperty("--mask-side", lerp(startSide, 0, expand).toFixed(2) + "vw");
        section.style.setProperty("--mask-radius", lerp(8, 0, expand).toFixed(2) + "px");
        section.style.setProperty("--image-scale", lerp(1.015, 1.045, expand).toFixed(3));
        section.style.setProperty("--overlay-opacity", String(overlayIn * (1 - overlayOut)));
        section.style.setProperty("--overlay-y", lerp(34, 0, overlayIn).toFixed(2) + "px");
        section.style.setProperty("--final-opacity", String(finalIn));
        section.style.setProperty("--final-y", lerp(44, 0, finalIn).toFixed(2) + "px");

        if (finalPanel) {
          finalPanel.style.pointerEvents = finalIn > 0.92 ? "auto" : "none";
        }
      }

      function requestWhyProgress() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(setWhyProgress);
      }

      window.addEventListener("scroll", requestWhyProgress, { passive: true, signal });
      window.addEventListener("resize", requestWhyProgress, { signal });
      setWhyProgress();
    })();

    /* Hero rotation + header hide → src/siteChrome.ts */

    (function () {
      document.querySelectorAll("[data-testimonial-carousel]").forEach((carousel) => {
        const slides = Array.from(carousel.querySelectorAll("[data-testimonial-slide]"));
        const dots = Array.from(carousel.querySelectorAll("[data-testimonial-dot]"));
        const prev = carousel.querySelector("[data-testimonial-prev]");
        const next = carousel.querySelector("[data-testimonial-next]");
        if (slides.length < 2) return;
        let active = 0;
        let timer = null;
        let touchX = null;
        function show(index, direction) {
          const old = active;
          active = (index + slides.length) % slides.length;
          slides.forEach((slide, i) => {
            slide.classList.toggle("is-active", i === active);
            slide.classList.toggle("is-leaving-left", i === old && i !== active && direction > 0);
            slide.setAttribute("aria-hidden", String(i !== active));
          });
          dots.forEach((dot, i) => { dot.classList.toggle("is-active", i === active); dot.setAttribute("aria-current", i === active ? "true" : "false"); });
          window.setTimeout(() => slides.forEach((slide) => slide.classList.remove("is-leaving-left")), 620);
        }
        function start() { window.clearInterval(timer); timer = window.setInterval(() => show(active + 1, 1), 6500); }
        prev?.addEventListener("click", () => { show(active - 1, -1); start(); });
        next?.addEventListener("click", () => { show(active + 1, 1); start(); });
        dots.forEach((dot, i) => dot.addEventListener("click", () => { show(i, i >= active ? 1 : -1); start(); }));
        carousel.addEventListener("mouseenter", () => window.clearInterval(timer));
        carousel.addEventListener("mouseleave", start);
        carousel.addEventListener("focusin", () => window.clearInterval(timer));
        carousel.addEventListener("focusout", start);
        carousel.addEventListener("touchstart", (event) => { touchX = event.touches[0]?.clientX ?? null; }, { passive:true });
        carousel.addEventListener("touchend", (event) => { if (touchX === null) return; const end = event.changedTouches[0]?.clientX ?? touchX; const delta = end - touchX; touchX = null; if (Math.abs(delta) > 45) { show(active + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1); start(); } }, { passive:true });
        show(0, 1); start();
      });
    })();

    // Model community is already in React SiteHeader RESOURCE_HREFS.
    // Legacy HTML injectors that rewrote .nav-menu links are intentionally removed.
}
