(() => {
    "use strict";

    const page = document.getElementById("myProfilePage");
    if (!page) return;

    const root = document.documentElement;
    const LANGUAGE_KEY = "whatsflow-language";
    const THEME_KEY = "whatsflow-theme";

    // -----------------------------
    // Settings tabs
    // -----------------------------
    const tabs = [...document.querySelectorAll(".profile-tab")];
    const panels = [...document.querySelectorAll(".settings-panel")];

    function activateTab(name, updateHash = true) {
        tabs.forEach(tab => {
            const active = tab.dataset.tab === name;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-selected", active ? "true" : "false");
        });

        panels.forEach(panel => {
            const active = panel.id === `tab-${name}`;
            panel.classList.toggle("active", active);
            panel.hidden = !active;
        });

        if (updateHash) history.replaceState(null, "", `#${name}`);
    }

    tabs.forEach(tab => tab.addEventListener("click", () => activateTab(tab.dataset.tab)));

    const initial = location.hash.replace("#", "");
    if (["personal", "security", "notifications", "preferences"].includes(initial)) {
        activateTab(initial, false);
    }

    // -----------------------------
    // Avatar preview
    // -----------------------------
    const avatarInput = document.getElementById("avatarInput");
    const avatar = document.getElementById("profileAvatar");

    avatarInput?.addEventListener("change", () => {
        const file = avatarInput.files?.[0];
        if (!file || !file.type.startsWith("image/") || !avatar) return;

        const url = URL.createObjectURL(file);
        avatar.innerHTML = `<img src="${url}" alt="${currentLanguage() === "ar" ? "معاينة صورة البروفايل" : "Profile preview"}">`;
    });

    // -----------------------------
    // Alerts
    // -----------------------------
    document.querySelectorAll(".alert-close").forEach(btn => {
        btn.addEventListener("click", () => btn.closest(".profile-alert")?.remove());
    });

    // -----------------------------
    // IMPORTANT:
    // My Profile must NOT own the global language/theme state.
    // The global core/base.js is the single source of truth.
    // This page only mirrors it and reacts to its events.
    // -----------------------------
    function safeGet(key, fallback) {
        try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
    }

    function currentLanguage() {
        return root.dataset.language === "ar" || root.lang === "ar" ? "ar" : "en";
    }

    function currentTheme() {
        return root.dataset.theme === "dark" ? "dark" : "light";
    }

    function renderLocalLanguage(language) {
        language = language === "ar" ? "ar" : "en";

        page.querySelectorAll("[data-en][data-ar]").forEach(el => {
            el.textContent = language === "ar" ? el.dataset.ar : el.dataset.en;
        });

        page.querySelectorAll("[data-placeholder-en][data-placeholder-ar]").forEach(el => {
            el.placeholder = language === "ar"
                ? el.dataset.placeholderAr
                : el.dataset.placeholderEn;
        });

        page.querySelectorAll("[data-aria-en][data-aria-ar]").forEach(el => {
            el.setAttribute(
                "aria-label",
                language === "ar" ? el.dataset.ariaAr : el.dataset.ariaEn
            );
        });

        // Keep preference controls visually synchronized.
        document.querySelectorAll("#languageControl button").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.lang === language);
        });
    }

    function renderLocalTheme(theme) {
        theme = theme === "dark" ? "dark" : "light";

        // Keep compatibility with the page's older CSS selectors,
        // while base.js remains responsible for the actual global theme.
        page.classList.toggle("dark", theme === "dark");
        document.body.classList.toggle("dark", theme === "dark");
        document.body.dataset.theme = theme;

        document.querySelectorAll("#themeControl button").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.themeValue === theme);
        });
    }

    function syncFromGlobalState() {
        const language = root.dataset.language === "ar"
            ? "ar"
            : safeGet(LANGUAGE_KEY, root.lang === "ar" ? "ar" : "en");

        const theme = root.dataset.theme === "dark"
            ? "dark"
            : safeGet(THEME_KEY, "light");

        renderLocalLanguage(language);
        renderLocalTheme(theme);
    }

    // These controls are local mirrors. They call the global WhatsFlow API
    // instead of independently changing localStorage / html attributes.
    document.querySelectorAll("#languageControl button").forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            if (window.WhatsFlow?.setLanguage) {
                window.WhatsFlow.setLanguage(lang);
            } else {
                // Fallback only if base.js is unavailable.
                root.dataset.language = lang;
                root.lang = lang;
                root.dir = lang === "ar" ? "rtl" : "ltr";
                try { localStorage.setItem(LANGUAGE_KEY, lang); } catch {}
                renderLocalLanguage(lang);
            }
        });
    });

    document.querySelectorAll("#themeControl button").forEach(btn => {
        btn.addEventListener("click", () => {
            const theme = btn.dataset.themeValue;
            if (window.WhatsFlow?.setTheme) {
                window.WhatsFlow.setTheme(theme);
            } else {
                root.dataset.theme = theme;
                document.body.dataset.theme = theme;
                try { localStorage.setItem(THEME_KEY, theme); } catch {}
                renderLocalTheme(theme);
            }
        });
    });

    // React immediately when the global base changes language/theme.
    document.addEventListener("whatsflow:languagechange", event => {
        renderLocalLanguage(event.detail?.language || currentLanguage());
    });

    document.addEventListener("whatsflow:themechange", event => {
        renderLocalTheme(event.detail?.theme || currentTheme());
    });

    // Handles browser back/forward cache and switching back to this tab.
    window.addEventListener("pageshow", syncFromGlobalState);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) syncFromGlobalState();
    });

    // Cross-tab synchronization.
    window.addEventListener("storage", event => {
        if (event.key === LANGUAGE_KEY) {
            const lang = event.newValue === "ar" ? "ar" : "en";
            if (window.WhatsFlow?.setLanguage) {
                window.WhatsFlow.setLanguage(lang, false);
            } else {
                renderLocalLanguage(lang);
            }
        }

        if (event.key === THEME_KEY) {
            const theme = event.newValue === "dark" ? "dark" : "light";
            if (window.WhatsFlow?.setTheme) {
                window.WhatsFlow.setTheme(theme, false);
            } else {
                renderLocalTheme(theme);
            }
        }
    });

    // Initial sync after base.js has initialized.
    syncFromGlobalState();
})();
