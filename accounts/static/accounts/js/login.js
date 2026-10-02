(function () {
    "use strict";

    var translations = {
        en: {
            pageTitle: "Login | WhatsFlow",
            eyebrow: "BUSINESS OPERATIONS",
            title: "Welcome back.<br><span>Let’s get your business moving.</span>",
            subtitle: "Manage conversations, orders, customers, products, and your team from one connected workspace.",
            point1Title: "WhatsApp conversations",
            point1Text: "Keep customer conversations connected to your business.",
            point2Title: "Order operations",
            point2Text: "Review and manage orders as they move through your workflow.",
            point3Title: "Team workspace",
            point3Text: "Give every team member the tools they need for their role.",
            signinKicker: "SIGN IN",
            signinTitle: "Welcome back",
            signinText: "Sign in to continue to your WhatsFlow workspace.",
            secure: "Secure",
            emailLabel: "Email address",
            passwordLabel: "Password",
            forgot: "Forgot password?",
            remember: "Remember me",
            submit: "Sign in",
            signingIn: "Signing in...",
            or: "OR",
            noAccount: "Don't have a business account?",
            createAccount: "Create one",
            showPassword: "Show password",
            hidePassword: "Hide password",
            emailPlaceholder: "Enter your email address",
            passwordPlaceholder: "Enter your password"
        },
        ar: {
            pageTitle: "تسجيل الدخول | WhatsFlow",
            eyebrow: "إدارة الأعمال",
            title: "مرحبًا بعودتك.<br><span>خلّي شغلك على واتساب أسهل.</span>",
            subtitle: "أدر المحادثات والطلبات والعملاء والمنتجات وفريقك من مساحة عمل واحدة متصلة.",
            point1Title: "محادثات واتساب",
            point1Text: "خلّي محادثات العملاء متصلة بنشاطك التجاري في مكان واحد.",
            point2Title: "إدارة الطلبات",
            point2Text: "راجع الطلبات وأدرها بسهولة أثناء انتقالها خلال سير العمل.",
            point3Title: "مساحة عمل الفريق",
            point3Text: "امنح كل فرد في فريقك الأدوات المناسبة لدوره.",
            signinKicker: "تسجيل الدخول",
            signinTitle: "مرحبًا بعودتك",
            signinText: "سجّل الدخول للمتابعة إلى مساحة عملك في WhatsFlow.",
            secure: "آمن",
            emailLabel: "البريد الإلكتروني",
            passwordLabel: "كلمة المرور",
            forgot: "نسيت كلمة المرور؟",
            remember: "تذكرني",
            submit: "تسجيل الدخول",
            signingIn: "جارٍ تسجيل الدخول...",
            or: "أو",
            noAccount: "ليس لديك حساب للنشاط التجاري؟",
            createAccount: "أنشئ حسابًا",
            showPassword: "إظهار كلمة المرور",
            hidePassword: "إخفاء كلمة المرور",
            emailPlaceholder: "أدخل بريدك الإلكتروني",
            passwordPlaceholder: "أدخل كلمة المرور"
        }
    };

    function getLanguage() {
        return document.documentElement.dataset.language === "ar" ? "ar" : "en";
    }

    function applyLanguage() {
        var page = document.querySelector("[data-login-page]");
        if (!page) return;

        var lang = getLanguage();
        var t = translations[lang];

        page.querySelectorAll("[data-i18n]").forEach(function (el) {
            var key = el.getAttribute("data-i18n");
            if (!t[key]) return;

            // Login title intentionally contains a highlighted span.
            if (key === "title") {
                el.innerHTML = t[key];
            } else {
                el.textContent = t[key];
            }
        });

        var username = page.querySelector('[name="username"]');
        var password = page.querySelector('[name="password"]');
        if (username) username.setAttribute("placeholder", t.emailPlaceholder);
        if (password) password.setAttribute("placeholder", t.passwordPlaceholder);

        document.title = t.pageTitle;

        var toggle = page.querySelector("[data-password-toggle]");
        if (toggle) {
            var hidden = password ? password.type === "password" : true;
            var label = hidden ? t.showPassword : t.hidePassword;
            toggle.setAttribute("aria-label", label);
            toggle.setAttribute("title", label);
        }
    }

    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
        }
    }

    ready(function () {
        var page = document.querySelector("[data-login-page]");
        if (!page) return;

        var form = page.querySelector(".wf-login-form");
        var password = page.querySelector('[name="password"]');
        var toggle = page.querySelector("[data-password-toggle]");
        var submit = page.querySelector("[data-submit]");

        applyLanguage();
        document.addEventListener("whatsflow:languagechange", applyLanguage);

        if (toggle && password) {
            toggle.addEventListener("click", function () {
                var hidden = password.type === "password";
                password.type = hidden ? "text" : "password";

                var icon = toggle.querySelector("i");
                if (icon) icon.className = hidden ? "fas fa-eye-slash" : "fas fa-eye";

                var t = translations[getLanguage()];
                var label = hidden ? t.hidePassword : t.showPassword;
                toggle.setAttribute("aria-label", label);
                toggle.setAttribute("title", label);
            });
        }

        if (form && submit) {
            form.addEventListener("submit", function () {
                if (form.classList.contains("is-submitting")) return;
                form.classList.add("is-submitting");
                submit.disabled = true;
            });
        }
    });
})();
