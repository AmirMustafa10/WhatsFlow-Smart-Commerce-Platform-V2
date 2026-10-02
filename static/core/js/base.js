
(function () {
    "use strict";

    var LANGUAGE_KEY = "whatsflow-language";
    var THEME_KEY = "whatsflow-theme";

    var translations = {
        en: {
            skip_to_content:"Skip to content", brand_tagline:"Business on WhatsApp",
            dashboard:"Dashboard", platform:"Platform", team:"Team", my_profile:"My Profile",
            account:"Account", change_password:"Change password", logout:"Log out",
            login:"Log in", get_started:"Get started", dark_mode:"Dark mode",
            light_mode:"Light mode", footer_text:"Intelligent business operations on WhatsApp.",
            all_rights:"All rights reserved.", home:"Home", business:"Business"
        },
        ar: {
            skip_to_content:"تخطي إلى المحتوى", brand_tagline:"إدارة أعمالك عبر واتساب",
            dashboard:"لوحة التحكم", platform:"المنصة", team:"الفريق", my_profile:"حسابي",
            account:"الحساب", change_password:"تغيير كلمة المرور", logout:"تسجيل الخروج",
            login:"تسجيل الدخول", get_started:"ابدأ الآن", dark_mode:"الوضع الداكن",
            light_mode:"الوضع الفاتح", footer_text:"إدارة ذكية لعمليات الأعمال عبر واتساب.",
            all_rights:"جميع الحقوق محفوظة.", home:"الرئيسية", business:"النشاط التجاري"
        }
    };

    var dispatchingLanguage = false;
    var dispatchingTheme = false;

    function storageGet(key, fallback) {
        try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
    }

    function storageSet(key, value) {
        try { localStorage.setItem(key, value); } catch (e) {}
    }

    function language() {
        return document.documentElement.dataset.language === "ar" ? "ar" : "en";
    }

    function theme() {
        return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    }

    function applyLanguage(value, persist) {
        value = value === "ar" ? "ar" : "en";
        persist = persist !== false;

        var root = document.documentElement;
        root.dataset.language = value;
        root.lang = value;
        root.dir = value === "ar" ? "rtl" : "ltr";

        if (persist) storageSet(LANGUAGE_KEY, value);

        var dict = translations[value];
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var key = el.getAttribute("data-i18n");
            if (dict[key]) el.textContent = dict[key];
        });

        document.querySelectorAll("[data-language-label]").forEach(function (el) {
            el.textContent = value === "ar" ? "EN" : "AR";
        });

        document.querySelectorAll("[data-language-toggle]").forEach(function (el) {
            el.setAttribute("title", value === "ar" ? "English" : "العربية");
            el.setAttribute("aria-label", value === "ar" ? "Switch to English" : "التبديل إلى العربية");
        });

        document.querySelectorAll("[data-theme-toggle]").forEach(function (el) {
            var label = theme() === "dark" ? dict.light_mode : dict.dark_mode;
            el.setAttribute("title", label);
            el.setAttribute("aria-label", label);
        });

        if (!dispatchingLanguage) {
            dispatchingLanguage = true;
            document.dispatchEvent(new CustomEvent("whatsflow:languagechange", {
                detail: { language:value, direction:root.dir }
            }));
            dispatchingLanguage = false;
        }
    }

    function applyTheme(value, persist) {
        value = value === "dark" ? "dark" : "light";
        persist = persist !== false;

        document.documentElement.dataset.theme = value;
        if (persist) storageSet(THEME_KEY, value);

        document.querySelectorAll("[data-theme-icon]").forEach(function (el) {
            el.innerHTML = value === "dark"
                ? '<i class="fa-regular fa-sun" aria-hidden="true"></i>'
                : '<i class="fa-regular fa-moon" aria-hidden="true"></i>';
        });

        var dict = translations[language()];
        document.querySelectorAll("[data-theme-label]").forEach(function (el) {
            el.textContent = value === "dark" ? dict.light_mode : dict.dark_mode;
        });

        document.querySelectorAll("[data-theme-toggle]").forEach(function (el) {
            var label = value === "dark" ? dict.light_mode : dict.dark_mode;
            el.setAttribute("title", label);
            el.setAttribute("aria-label", label);
        });

        if (!dispatchingTheme) {
            dispatchingTheme = true;
            document.dispatchEvent(new CustomEvent("whatsflow:themechange", {
                detail: { theme:value }
            }));
            dispatchingTheme = false;
        }
    }

    function sync() {
        applyLanguage(storageGet(LANGUAGE_KEY, language()), false);
        applyTheme(storageGet(THEME_KEY, theme()), false);
    }

    function init() {
        sync();

        document.addEventListener("click", function (event) {
            var lang = event.target.closest && event.target.closest("[data-language-toggle]");
            if (lang) {
                event.preventDefault();
                applyLanguage(language() === "ar" ? "en" : "ar");
                return;
            }

            var th = event.target.closest && event.target.closest("[data-theme-toggle]");
            if (th) {
                event.preventDefault();
                applyTheme(theme() === "dark" ? "light" : "dark");
                return;
            }

            var close = event.target.closest && event.target.closest("[data-notification-close]");
            if (close) {
                var note = close.closest("[data-app-notification]");
                if (note) note.remove();
            }

            var mobile = event.target.closest && event.target.closest("[data-mobile-toggle]");
            if (mobile) {
                var menu = document.querySelector("[data-mobile-menu]");
                if (!menu) return;
                var open = menu.classList.toggle("is-open");
                mobile.setAttribute("aria-expanded", open ? "true" : "false");
                var icon = mobile.querySelector("i");
                if (icon) icon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
            }
        });

        window.addEventListener("storage", function (event) {
            if (event.key === LANGUAGE_KEY && event.newValue) applyLanguage(event.newValue, false);
            if (event.key === THEME_KEY && event.newValue) applyTheme(event.newValue, false);
        });

        window.addEventListener("pageshow", sync);
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") sync();
        });

        window.WhatsFlow = window.WhatsFlow || {};
        window.WhatsFlow.language = language;
        window.WhatsFlow.theme = theme;
        window.WhatsFlow.setLanguage = applyLanguage;
        window.WhatsFlow.setTheme = applyTheme;
        window.WhatsFlow.translations = translations;
        window.WhatsFlow.syncPreferences = sync;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once:true });
    } else {
        init();
    }
})();
