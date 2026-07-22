(function () {
  const DRAFT_KEY = "agileQuoteDraft";
  const AUTH_KEY = "agileQuoteLoggedIn";
  const CAD_EXTENSIONS = [".step", ".stp", ".stl", ".iges", ".igs", ".obj", ".dwg", ".dxf", ".pdf"];

  function pageName() {
    return decodeURIComponent(window.location.pathname.split("/").pop() || "");
  }

  function isAuthed() {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  }

  function setAuthed(value) {
    sessionStorage.setItem(AUTH_KEY, value ? "true" : "false");
  }

  function getDraft() {
    try {
      return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function saveDraft(draft) {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  function isPostLoginProcessing(draft) {
    return isAuthed() && Number(draft?.processingDoneAt || 0) > Date.now();
  }

  function formatSize(file) {
    if (!file || typeof file.size !== "number") return "";
    if (file.size < 1024 * 1024) return (file.size / 1024).toFixed(1) + " KB";
    return (file.size / 1024 / 1024).toFixed(2) + " MB";
  }

  function normalizeFile(file, index) {
    const name = file?.name || "uploaded_model_" + (index + 1) + ".step";
    return {
      id: "MDL-" + Date.now().toString(36) + "-" + index,
      name,
      size: file?.size || 0,
      sizeText: formatSize(file),
      status: "parsing"
    };
  }

  function allowedFiles(files) {
    return Array.from(files || []).filter((file) => {
      const lowerName = (file.name || "").toLowerCase();
      return CAD_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function userPageUrl(fileName, params) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    if (document.getElementById("quick-upload-box")) {
      return "../用户（已核对）/" + fileName + query;
    }
    return fileName + query;
  }

  function createDraft(files, options) {
    const normalizedFiles = Array.from(files).map(normalizeFile);
    const draft = {
      id: "QT-TEMP-" + Date.now(),
      source: options?.source || "upload",
      createdAt: new Date().toISOString(),
      primaryName: normalizedFiles[0]?.name || "uploaded_model.step",
      files: normalizedFiles,
      status: "parsing"
    };
    saveDraft(draft);
    setAuthed(Boolean(options?.authenticated));
    return draft;
  }

  function goThroughOrderCenter(draft, authenticated) {
    window.location.href = userPageUrl("报价订单中心.html", {
      openQuote: "1",
      quoteId: draft.id,
      guest: authenticated ? "0" : "1"
    });
  }

  function handleQuoteFiles(files, options) {
    const validFiles = allowedFiles(files);
    if (!validFiles.length) {
      alert("请上传 STEP、STP、STL、IGES、OBJ、DWG、DXF 或 PDF 格式的报价文件。");
      return;
    }

    const draft = createDraft(validFiles, options);
    if (options?.statusNode) {
      const extraCount = validFiles.length > 1 ? " 等 " + validFiles.length + " 个文件" : "";
      options.statusNode.textContent = draft.primaryName + extraCount + " · 上传完成，正在创建报价";
    }

    window.setTimeout(() => goThroughOrderCenter(draft, Boolean(options?.authenticated)), 420);
  }

  function attachMarketingUpload() {
    const uploadBox = document.getElementById("quick-upload-box");
    const fileInput = document.getElementById("quote-file-input");
    if (!uploadBox || !fileInput) return;

    const statusNode = document.querySelector("[data-upload-status]");
    document.querySelectorAll("a").forEach((link) => {
      if (link.textContent.trim() !== "立即报价") return;
      if (link.closest(".nav-actions")) return;
      link.setAttribute("href", "#quote");
      link.addEventListener("click", () => {
        document.querySelector('[data-quote-tab="quick"]')?.click();
      });
    });
    uploadBox.addEventListener("click", (event) => {
      if (event.target !== fileInput) fileInput.click();
    });
    uploadBox.addEventListener("drop", (event) => {
      if (!event.dataTransfer?.files?.length) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      uploadBox.classList.remove("is-dragover");
      handleQuoteFiles(event.dataTransfer.files, {
        authenticated: false,
        source: "marketing",
        statusNode
      });
    }, true);
    fileInput.addEventListener("change", (event) => {
      if (!event.target.files?.length) return;
      handleQuoteFiles(event.target.files, {
        authenticated: false,
        source: "marketing",
        statusNode
      });
    });
  }

  function attachGuestUpload() {
    if (pageName() !== "报价模型上传页未登录.html") return;
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    if (!dropZone || !fileInput) return;

    const statusArea = document.getElementById("status-area");
    const statusName = statusArea?.querySelector(".text-label-md");
    const statusPercent = statusArea?.querySelector(".text-label-sm");

    function renderStatus(fileName) {
      if (!statusArea) return;
      statusArea.classList.remove("hidden");
      if (statusName) statusName.textContent = fileName;
      if (statusPercent) statusPercent.textContent = "100%";
    }

    dropZone.addEventListener("drop", (event) => {
      if (!event.dataTransfer?.files?.length) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const validFiles = allowedFiles(event.dataTransfer.files);
      if (validFiles[0]) renderStatus(validFiles[0].name);
      handleQuoteFiles(validFiles, { authenticated: false, source: "guest-upload" });
    }, true);

    fileInput.addEventListener("change", (event) => {
      if (!event.target.files?.length) return;
      const validFiles = allowedFiles(event.target.files);
      if (validFiles[0]) renderStatus(validFiles[0].name);
      handleQuoteFiles(validFiles, { authenticated: false, source: "guest-upload" });
    });
  }

  function attachLoggedUpload() {
    const currentPage = pageName();
    if (currentPage !== "报价模型上传页.html") return;

    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const progressContainer = document.getElementById("upload-progress");
    if (!dropZone || !fileInput) return;

    function renderProgress(files) {
      if (!progressContainer) return;
      progressContainer.innerHTML = Array.from(files).map((file) => (
        '<div class="upload-item">' +
          '<span class="material-symbols-outlined text-primary">description</span>' +
          '<span class="font-medium text-on-surface">' + file.name + '</span>' +
          '<div class="progress-bar"><div class="progress-fill" style="width:100%"></div></div>' +
          '<span class="progress-text text-primary">完成</span>' +
        '</div>'
      )).join("");
    }

    dropZone.addEventListener("drop", (event) => {
      if (!event.dataTransfer?.files?.length) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const validFiles = allowedFiles(event.dataTransfer.files);
      renderProgress(validFiles);
      handleQuoteFiles(validFiles, { authenticated: true, source: "logged-upload" });
    }, true);

    fileInput.addEventListener("change", (event) => {
      if (!event.target.files?.length) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const validFiles = allowedFiles(event.target.files);
      renderProgress(validFiles);
      handleQuoteFiles(validFiles, { authenticated: true, source: "logged-upload" });
      fileInput.value = "";
    }, true);
  }

  function attachOrderCenter() {
    if (pageName() !== "报价订单中心.html") return;
    const draft = getDraft();
    const list = document.querySelector(".space-y-md");
    if (draft && list && !document.querySelector("[data-linked-quote-card]")) {
      const created = new Date(draft.createdAt || Date.now());
      const dateText = created.getFullYear() + "-" + String(created.getMonth() + 1).padStart(2, "0") + "-" + String(created.getDate()).padStart(2, "0") + " " + String(created.getHours()).padStart(2, "0") + ":" + String(created.getMinutes()).padStart(2, "0");
      const extra = draft.files.length > 1 ? "，共 " + draft.files.length + " 个文件" : "";
      list.insertAdjacentHTML("afterbegin",
        '<div class="bg-surface-container-lowest border border-primary/30 rounded-xl shadow-sm overflow-hidden" data-linked-quote-card>' +
          '<div class="px-lg py-md bg-primary/5 border-b border-primary/20 flex items-center justify-between">' +
            '<div class="flex items-center gap-md flex-wrap">' +
              '<span class="font-label-md font-bold text-on-surface">' + draft.id + '</span>' +
              '<span class="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[11px] rounded-full font-bold uppercase tracking-tight">解析中</span>' +
              '<span class="text-label-sm text-outline border-l border-outline-variant pl-md ml-base">' + dateText + '</span>' +
            '</div>' +
            '<span class="text-label-sm text-primary font-semibold">来自营销页即时报价</span>' +
          '</div>' +
          '<div class="p-lg flex flex-col md:flex-row md:items-center gap-lg">' +
            '<div class="w-20 h-20 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center shrink-0">' +
              '<span class="material-symbols-outlined text-primary text-[36px]">deployed_code</span>' +
            '</div>' +
            '<div class="flex-1">' +
              '<p class="text-label-sm text-outline uppercase">主要零件名</p>' +
              '<a class="font-label-md text-on-surface font-semibold hover:text-primary transition-colors" href="报价详情.html?quoteId=' + encodeURIComponent(draft.id) + '">' + draft.primaryName + '</a>' +
              '<p class="text-body-sm text-on-surface-variant mt-2">文件已保存' + extra + '，模型几何与成本仍在解析中。</p>' +
              '<div class="w-full h-1.5 bg-surface-container rounded-full mt-4 overflow-hidden"><div class="w-1/3 h-full bg-primary animate-pulse"></div></div>' +
            '</div>' +
            '<a class="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:opacity-90 shadow-sm transition-all inline-flex items-center justify-center" href="报价详情.html?quoteId=' + encodeURIComponent(draft.id) + '">查看详情</a>' +
          '</div>' +
        '</div>'
      );
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("openQuote") === "1") {
      params.delete("openQuote");
      const quoteId = params.get("quoteId") || draft?.id || "";
      const guest = params.get("guest") === "1" && !isAuthed();
      window.history.replaceState(null, "", "报价订单中心.html");
      window.setTimeout(() => {
        window.location.href = "报价详情.html?" + new URLSearchParams({
          quoteId,
          guest: guest ? "1" : "0"
        }).toString();
      }, 180);
    }
  }

  function attachDetail() {
    if (pageName() !== "报价详情.html") return;
    const draft = getDraft();
    const params = new URLSearchParams(window.location.search);
    const fileName = draft?.primaryName || params.get("file") || "uploaded_model.step";
    if (draft && (!isAuthed() || isPostLoginProcessing(draft))) {
      renderProcessingDetail(draft, fileName);
    } else {
      const titleNode = document.querySelector("main section h1");
      if (titleNode) titleNode.textContent = fileName;
    }

    const needsLogin = (params.get("guest") === "1" || draft?.source === "marketing" || draft?.source === "guest-upload") && !isAuthed();
    if (needsLogin) lockDetail(fileName);
  }

  function ensureDetailStyle() {
    if (!document.getElementById("quote-linkage-style")) {
      document.head.insertAdjacentHTML("beforeend",
        '<style id="quote-linkage-style">' +
          '.quote-auth-blocked [data-auth-operation]{pointer-events:none;opacity:.58}' +
          '.quote-auth-overlay{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:24px;background:rgba(250,248,255,.34);backdrop-filter:blur(2px)}' +
          '.quote-auth-card{width:min(760px,100%);display:grid;grid-template-columns:280px minmax(0,1fr);overflow:hidden;background:#fff;border:1px solid #d8dce8;border-radius:16px;box-shadow:0 24px 64px rgba(15,23,42,.20)}' +
          '.quote-auth-hero{position:relative;min-height:390px;padding:24px;color:#fff;background:linear-gradient(180deg,rgba(0,31,84,.10),rgba(0,28,82,.82)),url("../营销页（已核对）/precision/precision-machining-floor.png") center/cover}' +
          '.quote-auth-brand{display:flex;align-items:center;gap:10px;font-weight:900}.quote-auth-logo{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:#fff}.quote-auth-logo svg{width:28px;height:29px}' +
          '.quote-auth-panel{padding:30px 28px 26px}.quote-auth-title{margin:8px 0 0;color:#191b23;font-size:26px;line-height:1.2;font-weight:800}' +
          '.quote-auth-tabs{display:flex;margin:22px 0 16px;border-bottom:1px solid #d8dce8}.quote-auth-tabs button{flex:1;height:38px;border:0;background:transparent;color:#565e74;font-weight:800}.quote-auth-tabs button.is-active{color:#004ac6;border-bottom:2px solid #004ac6}' +
          '.quote-auth-panel input:not([type="checkbox"]){width:100%;height:44px;margin-top:10px;border:1px solid #c3c6d7;border-radius:10px;padding:0 12px;background:#f8fafc;font-size:14px}' +
          '.quote-auth-fields[hidden]{display:none}.quote-auth-code-row{display:grid;grid-template-columns:minmax(0,1fr)104px;gap:10px}.quote-auth-code-row button{height:44px;margin-top:10px;border:1px solid #004ac6;border-radius:10px;background:#fff;color:#004ac6;font-weight:800;cursor:pointer}' +
          '.quote-auth-remember{display:flex;align-items:center;gap:8px;margin-top:12px;color:#565e74;font-size:13px;white-space:nowrap}.quote-auth-remember input{width:16px;height:16px;margin:0;accent-color:#004ac6}' +
          '.quote-auth-submit{width:100%;height:46px;margin-top:16px;border:0;border-radius:10px;background:#004ac6;color:#fff;font-weight:900;cursor:pointer;box-shadow:0 14px 28px rgba(0,74,198,.20)}' +
          '.quote-auth-divider{position:relative;margin:18px 0 12px;text-align:center;color:#737686;font-size:12px}.quote-auth-divider:before{content:"";position:absolute;left:0;right:0;top:50%;border-top:1px solid #d8dce8}.quote-auth-divider span{position:relative;padding:0 10px;background:#fff}.quote-auth-social{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.quote-auth-social button{height:42px;border:1px solid #d8dce8;border-radius:10px;background:#fff;color:#191b23;font-weight:800;cursor:pointer}.quote-auth-social b{display:inline-grid;place-items:center;width:24px;height:24px;margin-right:6px;border-radius:999px;font-size:12px}' +
          '.quote-auth-footer{margin-top:12px;text-align:center;color:#565e74;font-size:13px}.quote-auth-footer a{color:#004ac6;font-weight:800}' +
          '.quote-processing-bar{height:7px;border-radius:999px;background:#e7e7f3;overflow:hidden}.quote-processing-bar>span{display:block;height:100%;width:var(--progress,18%);background:linear-gradient(90deg,#2f9bff,#004ac6);border-radius:inherit;transition:width .4s ease}' +
          '.quote-processing-dots{display:inline-flex;gap:4px}.quote-processing-dots i{width:6px;height:6px;border-radius:50%;background:#004ac6;animation:quotePulse 1.2s ease-in-out infinite}.quote-processing-dots i:nth-child(2){animation-delay:.16s}.quote-processing-dots i:nth-child(3){animation-delay:.32s}' +
          '@keyframes quotePulse{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-2px)}}' +
          '@media(max-width:760px){.quote-auth-card{grid-template-columns:1fr}.quote-auth-hero{display:none}.quote-auth-panel{padding:24px}}' +
        '</style>'
      );
    }
  }

  function progressForDraft(draft) {
    if (isPostLoginProcessing(draft)) {
      const startedAt = Number(draft.processingStartedAt || Date.now());
      const doneAt = Number(draft.processingDoneAt || startedAt + 8000);
      const ratio = Math.min(1, Math.max(0, (Date.now() - startedAt) / Math.max(1, doneAt - startedAt)));
      return Math.round(34 + ratio * 58);
    }

    const createdAt = Date.parse(draft?.createdAt || "") || Date.now();
    const minutes = Math.max(0, (Date.now() - createdAt) / 60000);
    return Math.min(68, Math.max(12, Math.round(16 + minutes * 4)));
  }

  function renderProcessingDetail(draft, fileName) {
    ensureDetailStyle();
    const main = document.querySelector("main");
    if (!main) return;
    const files = draft.files?.length ? draft.files : [{ name: fileName, sizeText: "", status: "parsing" }];
    const progress = progressForDraft(draft);
    const escapedId = escapeHtml(draft.id || "QT-TEMP");

    main.className = "ml-64 min-h-screen bg-[#eef2f7] pb-12 px-8 pt-8";
    main.innerHTML =
      '<div class="max-w-[1380px] mx-auto" data-processing-shell>' +
        '<a class="inline-flex items-center gap-2 text-primary font-bold mb-5" href="报价订单中心.html"><span class="material-symbols-outlined text-[20px]">arrow_back</span>返回我的报价页</a>' +
        '<div class="rounded-lg border border-green-100 bg-green-50 px-5 py-4 text-body-sm text-on-surface-variant mb-6 flex items-center gap-3">' +
          '<span class="material-symbols-outlined text-green-600" style="font-variation-settings:\'FILL\' 1;">verified</span>' +
          '<span>' + (isAuthed() ? '账号已确认，报价继续解析中。' : '文件已上传，报价正在处理中。') + '</span>' +
        '</div>' +
        '<div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">' +
          '<section class="space-y-5">' +
            '<div class="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden">' +
              '<div class="px-5 py-4 bg-surface-container-high border-b border-outline-variant flex items-center justify-between gap-4">' +
                '<div class="flex items-center gap-3 flex-wrap"><h1 class="text-headline-sm font-bold text-on-surface">报价 ' + escapedId + '</h1><span class="inline-flex items-center gap-2 text-primary font-bold"><span class="material-symbols-outlined text-[18px]">add_circle</span>采购单编号</span></div>' +
                '<div class="flex items-center gap-3 text-primary"><span class="material-symbols-outlined">picture_as_pdf</span><span class="material-symbols-outlined">share</span></div>' +
              '</div>' +
              '<div class="p-5">' +
                '<button class="inline-flex items-center gap-2 text-primary font-bold mb-5" type="button" disabled><span class="material-symbols-outlined text-[18px]">edit_square</span>添加注意事项</button>' +
                '<div class="border-t border-dashed border-outline-variant pt-4 flex items-center gap-3 text-body-sm text-on-surface-variant"><input class="rounded border-outline-variant" type="checkbox" disabled><span>选择全部</span><button class="px-3 py-1.5 rounded border border-outline-variant bg-surface-container text-outline cursor-not-allowed" disabled>申请选项 &gt;</button></div>' +
              '</div>' +
            '</div>' +
            '<div class="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden">' +
              '<div class="px-5 py-4 border-b border-outline-variant flex items-center gap-3">' +
                '<span class="material-symbols-outlined text-primary animate-spin">settings</span>' +
                '<h2 class="text-headline-sm font-bold text-on-surface">处理中</h2>' +
                '<span class="quote-processing-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
              '</div>' +
              '<div class="p-5 space-y-5" id="linked-added-models">' + files.map(processingFileHtml).join("") + '</div>' +
            '</div>' +
            '<div class="border-2 border-dashed border-primary/50 rounded-lg min-h-[220px] bg-[#f5faff] flex flex-col items-center justify-center text-center p-8 transition-all hover:border-primary" data-auth-operation data-processing-add-model>' +
              '<span class="material-symbols-outlined text-outline text-[56px]">cloud_upload</span>' +
              '<p class="mt-3 font-bold text-on-surface">新报价: 请将文件拖拽到此上传，或点击 <span class="text-primary">上传</span></p>' +
              '<p class="mt-2 text-body-sm text-on-surface-variant">可一次性将多个文件拖拽上传，单次报价最多支持上传 10 个文件</p>' +
              '<p class="mt-4 text-label-sm text-outline max-w-2xl">支持 STEP、STP、SLDPRT、STL、SAT、3DXML、PRT、ITP、CATPART、X_T、X_B；2D 文件支持 DWS、DWF、DWG、DXF、PDF。</p>' +
            '</div>' +
          '</section>' +
          '<aside class="space-y-5">' +
            '<section class="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden">' +
              '<div class="px-5 py-4 bg-surface-container-high border-b border-outline-variant flex items-center justify-between"><h2 class="font-bold text-on-surface">步骤1 - 确认订单</h2><span class="material-symbols-outlined text-outline">check_circle</span></div>' +
              '<div class="p-5 space-y-4">' +
                '<h3 class="font-bold text-headline-sm text-on-surface">订单:</h3>' +
                '<div class="flex justify-between text-body-sm"><span>预计发货日期:</span><span class="font-bold">--.--</span></div>' +
                '<div class="flex justify-between text-body-sm"><span>' + files.length + ' 款零件 / ' + files.length + ' 件:</span><span class="font-bold">¥0.00</span></div>' +
                '<div class="flex justify-between text-body-sm"><span>运费:</span><span class="font-bold">¥0.00</span></div>' +
                '<div class="flex justify-between text-body-sm"><span>运输类型:</span><span class="font-bold">标准 (DAP)</span></div>' +
                '<div class="flex justify-between text-body-sm"><span>订单价:</span><span class="font-bold text-green-600">VAT --,--</span></div>' +
                '<button class="w-full h-12 rounded-lg bg-surface-container text-outline font-bold cursor-not-allowed" disabled>继续</button>' +
                '<p class="text-center text-primary font-bold text-body-sm">解析完成后可继续确认订单</p>' +
              '</div>' +
            '</section>' +
            '<section class="rounded-lg bg-surface-container-high p-5 text-outline font-bold">步骤2 - 送货</section>' +
            '<section class="rounded-lg bg-surface-container-high p-5 text-outline font-bold">步骤3 - 复核 & 支持</section>' +
          '</aside>' +
        '</div>' +
      '</div>';

    attachAddModel(draft);
    animateProcessingProgress(progress);
    scheduleProcessingReveal(draft);
  }

  function processingFileHtml(file, index) {
    const name = escapeHtml(file.name || "uploaded_model.step");
    const number = index + 1;
    return (
      '<div class="border border-outline-variant rounded-lg overflow-hidden bg-white" data-processing-file>' +
        '<div class="p-5 grid grid-cols-[auto_minmax(0,1fr)_180px] max-md:grid-cols-1 gap-5 items-start">' +
          '<div class="flex items-center gap-3 min-w-0"><input type="checkbox" class="rounded border-outline-variant" disabled><div><p class="font-bold text-on-surface truncate">' + number + '. ' + name + '</p><p class="text-label-sm text-on-surface-variant mt-1">附件: <button class="text-primary font-bold" type="button" disabled>点击上传</button></p></div></div>' +
          '<div class="grid grid-cols-[120px_minmax(0,1fr)] gap-4 max-md:grid-cols-1">' +
            '<div class="h-[120px] border border-outline-variant bg-surface-container-low flex flex-col items-center justify-center text-center text-[#6f90aa] font-bold text-[12px] leading-5"><span>ANALYSING</span><span>GEOMETRY...</span><span class="material-symbols-outlined mt-2 text-[42px] animate-spin">settings</span></div>' +
            '<div class="space-y-2 text-body-sm"><p><b>加工工艺:</b> --</p><p><b>尺寸:</b> --</p><p><b>螺纹和螺丝孔:</b> 0 个位置</p></div>' +
          '</div>' +
          '<div class="text-right max-md:text-left"><label class="font-bold text-body-sm">数量: <input class="ml-2 w-24 rounded border-outline-variant bg-surface-container text-outline" type="number" value="1" disabled></label></div>' +
        '</div>' +
        '<div class="mx-5 mb-5 rounded-lg border border-primary/35 bg-surface-container-lowest p-5 text-center"><p class="text-headline-sm font-bold text-primary">几何分析中</p><p class="mt-2 text-body-sm text-on-surface-variant">请耐心等待，需要数分钟处理...</p></div>' +
        '<div class="px-5 pb-5"><div class="quote-processing-bar" style="--progress:18%"><span></span></div><div class="mt-3 text-right"><button class="inline-flex items-center gap-1 text-primary font-bold" type="button" disabled><span class="material-symbols-outlined text-[18px]">delete</span>删除</button></div></div>' +
      '</div>'
    );
  }

  function animateProcessingProgress(startProgress) {
    const bars = Array.from(document.querySelectorAll(".quote-processing-bar"));
    let progress = startProgress;
    const limit = isAuthed() ? 96 : 72;
    window.setInterval(() => {
      progress = Math.min(limit, progress + Math.random() * (isAuthed() ? 2.8 : 1.4));
      bars.forEach((bar, index) => {
        const fileProgress = index === 0 ? progress : Math.min(limit - 6, progress - 8 + index * 2);
        bar.style.setProperty("--progress", Math.round(fileProgress) + "%");
      });
    }, 2200);
  }

  function scheduleProcessingReveal(draft) {
    if (!isPostLoginProcessing(draft)) return;
    const delay = Math.max(600, Number(draft.processingDoneAt) - Date.now());
    window.setTimeout(() => {
      const latestDraft = getDraft() || draft;
      latestDraft.processingDoneAt = Date.now() - 1;
      saveDraft(latestDraft);
      const url = new URL(window.location.href);
      url.searchParams.set("guest", "0");
      window.location.href = url.pathname.split("/").pop() + "?" + url.searchParams.toString();
    }, delay);
  }

  function lockDetail(fileName) {
    ensureDetailStyle();
    document.body.classList.add("quote-auth-blocked");
    if (document.querySelector(".quote-auth-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "quote-auth-overlay";
    overlay.innerHTML =
      '<form class="quote-auth-card" id="quote-auth-form">' +
        '<div class="quote-auth-hero">' +
          '<div class="quote-auth-brand"><span class="quote-auth-logo"><svg viewBox="0 0 56 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 3 4 17l9.8 5.7L28 14.5l14.2 8.2L52 17 28 3Z" fill="#7f8da0"/><path d="M2 20.8 28 36l26-15.2v29.4l-9.8 5.7V37.7L28 47 11.8 37.7v18.2L2 50.2V20.8Z" fill="#0759d5"/><path d="M17 42.7 28 49l11-6.3v8.8L28 58l-11-6.5v-8.8Z" fill="#7f8da0"/></svg></span><span>AgileMakeAI</span></div>' +
          '<div style="position:absolute;left:28px;right:28px;bottom:28px;"><p style="margin:0 0 10px;font-size:13px;font-weight:800;color:#b4c5ff;">Customer Login</p><h2 style="margin:0;font-size:28px;line-height:1.18;">登录客户工作台</h2><p style="margin:14px 0 0;color:rgba(255,255,255,.78);font-size:14px;line-height:1.7;">进入账户后可查看报价、订单、模型和项目协作信息。</p></div>' +
        '</div>' +
        '<div class="quote-auth-panel">' +
          '<p style="margin:0;color:#004ac6;font-size:13px;font-weight:900;">AgileMakeAI</p>' +
          '<h2 class="quote-auth-title">账户登录</h2>' +
          '<div class="quote-auth-tabs"><button class="is-active" type="button" data-auth-tab="account">账号 / 邮箱登录</button><button type="button" data-auth-tab="sms">手机号登录</button></div>' +
          '<div class="quote-auth-fields" data-auth-fields="account">' +
            '<input type="text" placeholder="手机号 / 邮箱 / 历史账号" autocomplete="username">' +
            '<input type="password" placeholder="密码" autocomplete="current-password">' +
          '</div>' +
          '<div class="quote-auth-fields" data-auth-fields="sms" hidden>' +
            '<input type="tel" placeholder="请输入手机号" autocomplete="tel">' +
            '<div class="quote-auth-code-row"><input type="text" placeholder="短信验证码" inputmode="numeric"><button type="button" data-send-code>发送验证码</button></div>' +
          '</div>' +
          '<label class="quote-auth-remember"><input type="checkbox">30 天内记住账号</label>' +
          '<button class="quote-auth-submit" type="submit">登录</button>' +
          '<div class="quote-auth-divider"><span>或使用其他方式</span></div>' +
          '<div class="quote-auth-social">' +
            '<button type="button"><b style="background:#EA4335;color:#fff;">G</b>Google / Gmail</button>' +
            '<button type="button"><b style="background:#0A66C2;color:#fff;">in</b>LinkedIn</button>' +
            '<button type="button"><b style="background:#1877F2;color:#fff;">f</b>Facebook</button>' +
            '<button type="button"><b style="background:#07C160;color:#fff;">微</b>微信</button>' +
          '</div>' +
          '<a href="../入口/登录.html" style="display:block;margin-top:12px;text-align:center;color:#004ac6;font-weight:800;font-size:13px;">打开完整登录页面</a>' +
          '<p class="quote-auth-footer">还没有账号？<a href="../入口/注册页.html">立即注册</a></p>' +
        '</div>' +
      '</form>';
    document.body.appendChild(overlay);

    const authTabs = Array.from(overlay.querySelectorAll("[data-auth-tab]"));
    const authFields = Array.from(overlay.querySelectorAll("[data-auth-fields]"));
    authTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.dataset.authTab;
        authTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
        authFields.forEach((field) => {
          field.hidden = field.dataset.authFields !== mode;
        });
      });
    });

    const sendCodeButton = overlay.querySelector("[data-send-code]");
    if (sendCodeButton) {
      sendCodeButton.addEventListener("click", () => {
        let seconds = 60;
        sendCodeButton.disabled = true;
        sendCodeButton.textContent = seconds + "s";
        const timer = window.setInterval(() => {
          seconds -= 1;
          sendCodeButton.textContent = seconds + "s";
          if (seconds <= 0) {
            window.clearInterval(timer);
            sendCodeButton.disabled = false;
            sendCodeButton.textContent = "重新发送";
          }
        }, 1000);
      });
    }

    overlay.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      setAuthed(true);
      const draft = getDraft();
      if (draft) {
        draft.processingStartedAt = Date.now();
        draft.processingDoneAt = Date.now() + 8500;
        saveDraft(draft);
      }
      const url = new URL(window.location.href);
      url.searchParams.set("guest", "0");
      overlay.remove();
      document.body.classList.remove("quote-auth-blocked");
      window.history.replaceState(null, "", url.pathname.split("/").pop() + "?" + url.searchParams.toString());
      if (draft) {
        renderProcessingDetail(draft, draft.primaryName || fileName);
      } else {
        window.location.href = url.pathname.split("/").pop() + "?" + url.searchParams.toString();
      }
    });
  }

  function attachAddModel(draft) {
    const addZone = document.querySelector("[data-processing-add-model]") || Array.from(document.querySelectorAll("div")).find((node) => (
      node.classList.contains("border-dashed") && node.textContent.includes("拖拽以添加另一个模型")
    ));
    if (!addZone || addZone.dataset.linkedAddModel === "true") return;
    addZone.dataset.linkedAddModel = "true";
    addZone.setAttribute("role", "button");
    addZone.setAttribute("tabindex", "0");

    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = CAD_EXTENSIONS.join(",");
    input.style.display = "none";
    addZone.appendChild(input);

    let list = document.getElementById("linked-added-models");
    if (!list) {
      list = document.createElement("div");
      list.id = "linked-added-models";
      list.className = "space-y-md";
      addZone.parentElement.insertBefore(list, addZone);
      renderAddedModels(list, draft?.files?.slice(1) || []);
    }

    addZone.addEventListener("click", () => {
      if (!isAuthed()) return;
      input.click();
    });
    addZone.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && isAuthed()) {
        event.preventDefault();
        input.click();
      }
    });
    addZone.addEventListener("drop", (event) => {
      if (!isAuthed() || !event.dataTransfer?.files?.length) return;
      event.preventDefault();
      appendModels(event.dataTransfer.files, list);
    });
    input.addEventListener("change", (event) => {
      if (event.target.files?.length) appendModels(event.target.files, list);
      input.value = "";
    });
  }

  function renderAddedModels(list, files) {
    list.innerHTML = files.map(modelCardHtml).join("");
  }

  function appendModels(files, list) {
    const validFiles = allowedFiles(files);
    if (!validFiles.length) {
      alert("请上传 STEP、STP、STL、IGES、OBJ、DWG、DXF 或 PDF 格式的报价文件。");
      return;
    }
    const draft = getDraft() || {
      id: "QT-TEMP-" + Date.now(),
      source: "detail-add",
      createdAt: new Date().toISOString(),
      primaryName: validFiles[0].name,
      files: []
    };
    const normalized = validFiles.map((file, index) => normalizeFile(file, draft.files.length + index));
    draft.files = draft.files.concat(normalized);
    draft.status = "parsing";
    saveDraft(draft);
    const isProcessingList = Boolean(list.closest("[data-processing-shell]"));
    const currentCount = list.querySelectorAll("[data-processing-file], [data-added-model]").length;
    const html = normalized.map((file, index) => (
      isProcessingList ? processingFileHtml(file, currentCount + index) : modelCardHtml(file)
    )).join("");
    list.insertAdjacentHTML("beforeend", html);
  }

  function modelCardHtml(file) {
    return (
      '<div class="token-card p-md flex items-center justify-between gap-md" data-added-model>' +
        '<div class="flex items-center gap-md min-w-0">' +
          '<div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0"><span class="material-symbols-outlined">deployed_code</span></div>' +
          '<div class="min-w-0">' +
            '<p class="font-bold text-on-surface truncate">' + file.name + '</p>' +
            '<p class="text-body-sm text-on-surface-variant">' + (file.sizeText || "已上传") + ' · 已加入报价，等待模型解析</p>' +
          '</div>' +
        '</div>' +
        '<span class="px-sm py-1 rounded-lg bg-primary/10 text-primary text-label-sm font-bold flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>解析中</span>' +
      '</div>'
    );
  }

  attachMarketingUpload();
  attachGuestUpload();
  attachLoggedUpload();
  attachOrderCenter();
  attachDetail();
})();
