(function () {
  const isEnglish = (document.documentElement.lang || "").toLowerCase().startsWith("en");

  function switchAuthMode(root, mode) {
    root.querySelectorAll("[data-auth-tab]").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.authTab === mode);
    });
    root.querySelectorAll("[data-auth-fields]").forEach((fields) => {
      fields.hidden = fields.dataset.authFields !== mode;
    });
  }

  function getRedirectTarget(form) {
    const params = new URLSearchParams(window.location.search);
    return params.get("redirect") || window.sessionStorage.getItem("agileLoginRedirect") || form.dataset.redirect;
  }

  document.querySelectorAll("[data-auth-tabs]").forEach((tabs) => {
    const root = tabs.closest("[data-auth-root]") || document;
    tabs.querySelectorAll("[data-auth-tab]").forEach((tab) => {
      tab.addEventListener("click", () => switchAuthMode(root, tab.dataset.authTab));
    });
  });

  document.querySelectorAll("[data-send-code]").forEach((button) => {
    const defaultText = button.textContent;
    button.addEventListener("click", () => {
      if (button.disabled) return;
      let seconds = 60;
      button.disabled = true;
      button.textContent = seconds + "s";
      const timer = window.setInterval(() => {
        seconds -= 1;
        button.textContent = seconds + "s";
        if (seconds <= 0) {
          window.clearInterval(timer);
          button.disabled = false;
          button.textContent = isEnglish ? defaultText : "重新发送";
        }
      }, 1000);
    });
  });

  document.querySelectorAll("[data-demo-submit]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = form.querySelector(".primary-button");
      if (!button) return;
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = isEnglish ? "Processing..." : "处理中...";
      window.setTimeout(() => {
        button.textContent = isEnglish ? "Completed" : "已完成";
        window.setTimeout(() => {
          button.disabled = false;
          button.textContent = originalText;
          const redirectTarget = getRedirectTarget(form);
          if (redirectTarget) {
            window.location.href = redirectTarget;
          }
        }, 650);
      }, 900);
    });
  });
})();
