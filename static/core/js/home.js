/**
 * WhatsFlow Home
 * Interactive landing page
 * - Theme / language bridge
 * - RTL / LTR
 * - Scroll reveals
 * - Workflow tabs
 * - Business type selector
 * - Live dashboard simulation
 * - Magnetic buttons
 */

(() => {
    "use strict";

    const page = document.getElementById("homePage");
    if (!page) return;

    const root = document.documentElement;
    const body = document.body;

    const translations = {
        en: {
            "hero.eyebrow": "Business management through WhatsApp",
            "hero.titleA": "Run Your Business.",
            "hero.titleB": "WhatsApp Handles the Conversation.",
            "hero.description": "WhatsFlow connects customer conversations with products, services, orders, teams, and AI-powered business knowledge in one platform.",
            "hero.cta": "Create Your Business Account",
            "hero.signIn": "Sign In",
            "hero.note": "After registration, our platform team will contact you within 24 business hours to connect your WhatsApp number.",
            "hero.trustTitle": "Built around your business",
            "hero.trustText": "Conversations, knowledge, and operations in one place.",
            "hero.scroll": "Explore the platform",
            "auth.kicker": "Welcome back",
            "auth.dashboard": "Open Dashboard",
            "auth.activity": "View Activity",
            "auth.status": "Your account is active. Manage your business, team, orders, and WhatsApp activity from your workspace.",
            "auth.finalEyebrow": "Your workspace is ready",
            "auth.finalTitle": "Keep your business moving from one connected workspace.",
            "auth.finalDescription": "Review customer conversations, orders, team activity, and business knowledge whenever you need them.",
            "auth.loggedIn": "You are signed in",

            "preview.title": "WhatsFlow workspace",
            "preview.live": "Live",
            "preview.inbox": "Business inbox",
            "preview.activity": "WhatsApp Activity",
            "preview.customer": "New customer",
            "preview.customerMsg": "Can I order this product?",
            "preview.new": "New",
            "preview.aiMsg": "Answered using your business knowledge.",
            "preview.order": "New order",
            "preview.orderMsg": "Order received and waiting for review.",
            "preview.review": "Review",
            "preview.aiWorking": "AI assistant is working",
            "preview.aiWorkingText": "Using your latest business information",
            "preview.customers": "Customers",
            "preview.orders": "Orders",
            "preview.pending": "Pending",

            "floating.connected": "WhatsApp connected",
            "floating.customer": "Customer conversation received",
            "floating.order": "Order confirmed",
            "floating.team": "Team notified",

            "value.eyebrow": "One connected platform",
            "value.title": "Everything starts with a WhatsApp conversation.",
            "value.description": "Connect what your customers say with the information and operations your business needs.",
            "value.card1Title": "Customer Conversations",
            "value.card1Text": "Let customers reach your business through WhatsApp and receive useful, business-aware answers.",
            "value.card2Title": "Business-Aware AI",
            "value.card2Text": "New products, services, and business information become part of the knowledge used by your AI assistant.",
            "value.card3Title": "Business Operations",
            "value.card3Text": "Keep customers, products, services, orders, delivery, and team operations connected in one place.",
            "value.explore": "Explore conversations",
            "value.exploreKnowledge": "Explore AI knowledge",
            "value.exploreOperations": "Explore operations",

            "workflow.eyebrow": "How it works",
            "workflow.title": "From your first signup to your first customer.",
            "workflow.description": "A simple setup flow that grows with the way your business works.",
            "workflow.start": "Start",
            "workflow.setup": "Setup",
            "workflow.activation": "Activation",
            "workflow.configure": "Configure",
            "workflow.team": "Team",
            "workflow.operate": "Operate",
            "workflow.step1Title": "Create your business account",
            "workflow.step1Text": "Create your account and provide your personal and business information.",
            "workflow.step2Title": "Tell us about your business",
            "workflow.step2Text": "Choose your business type and enter the information needed to represent your business.",
            "workflow.step3Title": "Connect your WhatsApp number",
            "workflow.step3Text": "Our platform team will contact you within 24 business hours to connect your number and activate the business.",
            "workflow.step4Title": "Add your business knowledge",
            "workflow.step4Text": "Add the products, services, FAQs, policies, and information your customers may ask about.",
            "workflow.step5Title": "Bring your team in",
            "workflow.step5Text": "Add team members, roles, and permissions so the right people can handle daily work.",
            "workflow.step6Title": "Let customers start chatting",
            "workflow.step6Text": "Customers can contact your business on WhatsApp and receive responses based on your business data.",

            "business.eyebrow": "Built for different businesses",
            "business.title": "Your business does not have to look like everyone else's.",
            "business.description": "Whether you sell products, provide services, manage deliveries, or operate a larger company, WhatsFlow adapts around the way your customers interact with you.",
            "business.selectedLabel": "Selected business type",
            "business.retail": "Retail",
            "business.fashion": "Fashion",
            "business.restaurants": "Restaurants",
            "business.services": "Services",
            "business.technology": "Technology",
            "business.home": "Home & Furniture",
            "business.professional": "Professional Services",
            "business.delivery": "Delivery",
            "business.companies": "Companies",
            "business.more": "And more",

            "operations.eyebrow": "More than a chatbot",
            "operations.title": "Turn conversations into business operations.",
            "operations.description": "Connect what happens in a conversation with what your owner, team, and delivery staff need to do next.",
            "operations.step1Label": "Customer",
            "operations.step1Title": "Customer asks",
            "operations.step1Text": "A customer starts a conversation and asks about your business, products, or services.",
            "operations.step2Label": "AI",
            "operations.step2Title": "WhatsFlow responds",
            "operations.step2Text": "The system uses your business knowledge to provide an appropriate response.",
            "operations.step3Label": "Team",
            "operations.step3Title": "Business takes action",
            "operations.step3Text": "Your owner or team can review requests, confirm orders, and continue the operation.",
            "operations.step4Label": "Delivery",
            "operations.step4Title": "Deliver when needed",
            "operations.step4Text": "Shippers can receive assigned orders, deliver them, and manage the delivery process.",

            "team.eyebrow": "Work as a team",
            "team.title": "Give your team a place to work together.",
            "team.description": "Business owners can add team members who log in with their own accounts and help manage the daily work of the business.",
            "team.owner": "Business Owner",
            "team.fullAccess": "Full access",
            "team.member": "Team Member",
            "team.operations": "Business operations",
            "team.manage": "Manage business",
            "team.review": "Review orders",
            "team.analytics": "View analytics",
            "team.handle": "Handle assigned work",
            "team.customerRequests": "Review customer requests",
            "team.teamOnline": "4 team members online",
            "team.feature1": "Add team members to your business",
            "team.feature2": "Create roles and control permissions",
            "team.feature3": "Let the right people handle daily tasks",
            "team.feature4": "Keep every operation connected",
            "team.cta": "Build your team",

            "cta.eyebrow": "Start with your business",
            "cta.title": "Ready to bring your business to WhatsApp?",
            "cta.description": "Create your account, tell us about your business, and let WhatsFlow connect your customers, AI, and team.",
            "cta.button": "Create Your Business Account",
            "cta.login": "Already have an account?",
            "cta.signIn": "Sign in"
        },

        ar: {
            "hero.eyebrow": "إدارة أعمالك من خلال واتساب",
            "hero.titleA": "أدر عملك بكل سهولة.",
            "hero.titleB": "وواتساب يتولى المحادثات.",
            "hero.description": "واتس فلو يربط محادثات العملاء بالمنتجات والخدمات والطلبات والفريق ومعرفة نشاطك التجاري المدعومة بالذكاء الاصطناعي في منصة واحدة.",
            "hero.cta": "أنشئ حساب نشاطك التجاري",
            "hero.signIn": "تسجيل الدخول",
            "hero.note": "بعد التسجيل، سيتواصل معك فريق المنصة خلال 24 ساعة عمل لربط رقم واتساب الخاص بك.",
            "hero.trustTitle": "مصمم حول نشاطك التجاري",
            "hero.trustText": "المحادثات والمعرفة والعمليات في مكان واحد.",
            "hero.scroll": "اكتشف المنصة",
            "auth.kicker": "مرحبًا بعودتك",
            "auth.dashboard": "فتح لوحة التحكم",
            "auth.activity": "عرض النشاط",
            "auth.status": "حسابك نشط. أدر نشاطك التجاري وفريقك وطلباتك ونشاط واتساب من مساحة العمل الخاصة بك.",
            "auth.finalEyebrow": "مساحة عملك جاهزة",
            "auth.finalTitle": "واصل إدارة نشاطك من مساحة عمل واحدة ومتصلة.",
            "auth.finalDescription": "راجع محادثات العملاء والطلبات ونشاط الفريق ومعرفة نشاطك التجاري وقتما تحتاج.",
            "auth.loggedIn": "أنت مسجل الدخول",

            "preview.title": "مساحة عمل واتس فلو",
            "preview.live": "مباشر",
            "preview.inbox": "صندوق محادثات النشاط",
            "preview.activity": "نشاط واتساب",
            "preview.customer": "عميل جديد",
            "preview.customerMsg": "هل يمكنني طلب هذا المنتج؟",
            "preview.new": "جديد",
            "preview.aiMsg": "تمت الإجابة بالاعتماد على معلومات نشاطك.",
            "preview.order": "طلب جديد",
            "preview.orderMsg": "تم استلام الطلب وينتظر المراجعة.",
            "preview.review": "مراجعة",
            "preview.aiWorking": "المساعد الذكي يعمل الآن",
            "preview.aiWorkingText": "يستخدم أحدث معلومات نشاطك التجاري",
            "preview.customers": "العملاء",
            "preview.orders": "الطلبات",
            "preview.pending": "قيد الانتظار",

            "floating.connected": "واتساب متصل",
            "floating.customer": "تم استلام محادثة من عميل",
            "floating.order": "تم تأكيد الطلب",
            "floating.team": "تم إخطار الفريق",

            "value.eyebrow": "منصة واحدة متصلة",
            "value.title": "كل شيء يبدأ بمحادثة على واتساب.",
            "value.description": "اربط ما يقوله عملاؤك بالمعلومات والعمليات التي يحتاجها نشاطك التجاري.",
            "value.card1Title": "محادثات العملاء",
            "value.card1Text": "دع العملاء يتواصلون مع نشاطك عبر واتساب ويحصلون على إجابات مفيدة مبنية على معلومات نشاطك.",
            "value.card2Title": "ذكاء اصطناعي يفهم نشاطك",
            "value.card2Text": "المنتجات والخدمات والمعلومات الجديدة تصبح تلقائيًا جزءًا من المعرفة التي يستخدمها المساعد الذكي.",
            "value.card3Title": "عمليات النشاط التجاري",
            "value.card3Text": "أدر العملاء والمنتجات والخدمات والطلبات والتوصيل والفريق من مكان واحد.",
            "value.explore": "استكشف المحادثات",
            "value.exploreKnowledge": "استكشف معرفة الذكاء الاصطناعي",
            "value.exploreOperations": "استكشف العمليات",

            "workflow.eyebrow": "كيف تعمل المنصة",
            "workflow.title": "من أول تسجيل إلى أول عميل.",
            "workflow.description": "خطوات إعداد بسيطة تتوسع مع طريقة عمل نشاطك التجاري.",
            "workflow.start": "البداية",
            "workflow.setup": "الإعداد",
            "workflow.activation": "التفعيل",
            "workflow.configure": "التجهيز",
            "workflow.team": "الفريق",
            "workflow.operate": "التشغيل",
            "workflow.step1Title": "أنشئ حساب نشاطك التجاري",
            "workflow.step1Text": "أنشئ حسابك وأدخل بياناتك الشخصية وبيانات نشاطك التجاري.",
            "workflow.step2Title": "أخبرنا عن نشاطك",
            "workflow.step2Text": "اختر نوع نشاطك وأدخل المعلومات المطلوبة لتمثيل نشاطك.",
            "workflow.step3Title": "اربط رقم واتساب",
            "workflow.step3Text": "سيتواصل معك فريق المنصة خلال 24 ساعة عمل لربط الرقم وتفعيل النشاط.",
            "workflow.step4Title": "أضف معرفة نشاطك التجاري",
            "workflow.step4Text": "أضف المنتجات والخدمات والأسئلة الشائعة والسياسات والمعلومات التي قد يسأل عنها العملاء.",
            "workflow.step5Title": "أضف فريقك",
            "workflow.step5Text": "أضف أعضاء الفريق والأدوار والصلاحيات حتى يتولى الأشخاص المناسبون العمل اليومي.",
            "workflow.step6Title": "ابدأ استقبال المحادثات",
            "workflow.step6Text": "يمكن للعملاء التواصل معك عبر واتساب والحصول على ردود مبنية على بيانات نشاطك.",

            "business.eyebrow": "مصممة لمختلف الأنشطة",
            "business.title": "نشاطك التجاري له طريقته الخاصة.",
            "business.description": "سواء كنت تبيع منتجات أو تقدم خدمات أو تدير عمليات توصيل أو تعمل كشركة كبيرة، تتكيف واتس فلو مع طريقة تواصلك مع عملائك.",
            "business.selectedLabel": "نوع النشاط المحدد",
            "business.retail": "تجزئة",
            "business.fashion": "أزياء",
            "business.restaurants": "مطاعم",
            "business.services": "خدمات",
            "business.technology": "تكنولوجيا",
            "business.home": "منزل وأثاث",
            "business.professional": "خدمات مهنية",
            "business.delivery": "توصيل",
            "business.companies": "شركات",
            "business.more": "والمزيد",

            "operations.eyebrow": "أكثر من مجرد شات بوت",
            "operations.title": "حوّل المحادثات إلى عمليات حقيقية.",
            "operations.description": "اربط ما يحدث داخل المحادثة بما يحتاج المالك والفريق وموظفو التوصيل إلى تنفيذه بعد ذلك.",
            "operations.step1Label": "العميل",
            "operations.step1Title": "العميل يسأل",
            "operations.step1Text": "يبدأ العميل محادثة ويسأل عن نشاطك أو منتجاتك أو خدماتك.",
            "operations.step2Label": "الذكاء الاصطناعي",
            "operations.step2Title": "واتس فلو يرد",
            "operations.step2Text": "يستخدم النظام معرفة نشاطك لتقديم الرد المناسب.",
            "operations.step3Label": "الفريق",
            "operations.step3Title": "النشاط يتخذ إجراء",
            "operations.step3Text": "يمكن للمالك أو الفريق مراجعة الطلبات وتأكيدها ومتابعة العملية.",
            "operations.step4Label": "التوصيل",
            "operations.step4Title": "التوصيل عند الحاجة",
            "operations.step4Text": "يمكن لموظفي التوصيل استلام الطلبات المسندة وتنفيذها وإدارة عملية التوصيل.",

            "team.eyebrow": "اعمل كفريق",
            "team.title": "امنح فريقك مكانًا للعمل معًا.",
            "team.description": "يمكن لمالك النشاط إضافة أعضاء للفريق بحساباتهم الخاصة للمساعدة في إدارة العمل اليومي.",
            "team.owner": "مالك النشاط",
            "team.fullAccess": "صلاحيات كاملة",
            "team.member": "عضو فريق",
            "team.operations": "عمليات النشاط",
            "team.manage": "إدارة النشاط",
            "team.review": "مراجعة الطلبات",
            "team.analytics": "عرض التحليلات",
            "team.handle": "تنفيذ المهام المسندة",
            "team.customerRequests": "مراجعة طلبات العملاء",
            "team.teamOnline": "4 أعضاء من الفريق متصلون",
            "team.feature1": "أضف أعضاء فريقك إلى النشاط",
            "team.feature2": "أنشئ أدوارًا وتحكم في الصلاحيات",
            "team.feature3": "دع الأشخاص المناسبين يتولون المهام اليومية",
            "team.feature4": "حافظ على اتصال كل العمليات",
            "team.cta": "كوّن فريقك",

            "cta.eyebrow": "ابدأ مع نشاطك",
            "cta.title": "جاهز لربط نشاطك التجاري بواتساب؟",
            "cta.description": "أنشئ حسابك وأخبرنا عن نشاطك ودع واتس فلو يربط عملاءك والذكاء الاصطناعي وفريقك.",
            "cta.button": "أنشئ حساب نشاطك التجاري",
            "cta.login": "لديك حساب بالفعل؟",
            "cta.signIn": "تسجيل الدخول"
        }
    };

    let currentLanguage = root.getAttribute("lang") === "ar" ? "ar" : (localStorage.getItem("wf-language") || "en");
    let currentTheme = localStorage.getItem("wf-theme") || detectTheme();

    function detectTheme() {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        return "light";
    }

    function setLanguage(lang) {
        currentLanguage = lang === "ar" ? "ar" : "en";
        const dict = translations[currentLanguage];

        root.lang = currentLanguage;
        root.dir = currentLanguage === "ar" ? "rtl" : "ltr";
        page.setAttribute("data-language", currentLanguage);
        localStorage.setItem("wf-language", currentLanguage);

        page.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            if (dict[key] !== undefined) element.textContent = dict[key];
        });

        document.dispatchEvent(new CustomEvent("wf:languageChanged", { detail: { language: currentLanguage } }));
    }

    function setTheme(theme) {
        currentTheme = theme === "dark" ? "dark" : "light";
        root.setAttribute("data-theme", currentTheme);
        page.setAttribute("data-theme", currentTheme);
        localStorage.setItem("wf-theme", currentTheme);

        document.dispatchEvent(new CustomEvent("wf:themeChanged", { detail: { theme: currentTheme } }));
    }

    function bridgeGlobalControls() {
        /*
         * Supports existing navbar controls without forcing a specific
         * base.html implementation. Use any of:
         * [data-wf-language="ar|en"], [data-language-toggle]
         * [data-wf-theme="dark|light"], [data-theme-toggle]
         */
        document.querySelectorAll("[data-wf-language]").forEach((control) => {
            control.addEventListener("click", () => setLanguage(control.dataset.wfLanguage));
        });

        document.querySelectorAll("[data-language-toggle]").forEach((control) => {
            control.addEventListener("click", () => setLanguage(currentLanguage === "ar" ? "en" : "ar"));
        });

        document.querySelectorAll("[data-wf-theme]").forEach((control) => {
            control.addEventListener("click", () => setTheme(control.dataset.wfTheme));
        });

        document.querySelectorAll("[data-theme-toggle]").forEach((control) => {
            control.addEventListener("click", () => setTheme(currentTheme === "dark" ? "light" : "dark"));
        });

        // Optional custom events from a global navbar.
        document.addEventListener("wf:setLanguage", (event) => {
            if (event.detail?.language) setLanguage(event.detail.language);
        });

        document.addEventListener("wf:setTheme", (event) => {
            if (event.detail?.theme) setTheme(event.detail.theme);
        });
    }

    function initReveal() {
        const elements = page.querySelectorAll(".reveal");
        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        }, { threshold: .12, rootMargin: "0px 0px -45px 0px" });

        elements.forEach((element) => observer.observe(element));
    }

    function initWorkflow() {
        const indicators = [...page.querySelectorAll(".workflow-indicator")];
        const cards = [...page.querySelectorAll(".workflow-step-card")];
        const progress = document.getElementById("workflowProgress");
        if (!indicators.length || !cards.length) return;

        let active = 0;
        let timer;

        const activate = (index, restart = true) => {
            active = index;
            cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
            indicators.forEach((button, i) => button.classList.toggle("is-active", i === index));

            if (progress) {
                const amount = ((index + 1) / cards.length) * 100;
                if (window.matchMedia("(max-width: 820px)").matches) {
                    progress.style.width = `${amount}%`;
                    progress.style.height = "100%";
                } else {
                    progress.style.height = `${amount}%`;
                    progress.style.width = "100%";
                }
            }

            if (restart) {
                clearInterval(timer);
                timer = setInterval(() => activate((active + 1) % cards.length, false), 4500);
            }
        };

        indicators.forEach((button) => {
            button.addEventListener("click", () => activate(Number(button.dataset.step)));
        });

        activate(0);
    }

    function initBusinessTypes() {
        const buttons = [...page.querySelectorAll(".business-type")];
        const selectedText = document.getElementById("businessSelectedText");
        const selectedIcon = document.getElementById("businessSelectedIcon");
        if (!buttons.length || !selectedText || !selectedIcon) return;

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                buttons.forEach((item) => item.classList.remove("is-selected"));
                button.classList.add("is-selected");

                const business = button.dataset.business;
                const icon = button.dataset.icon;

                selectedIcon.innerHTML = `<i class="fas ${icon}"></i>`;
                selectedText.textContent = translateBusinessName(business);

                selectedIcon.animate([
                    { transform: "scale(.75) rotate(-8deg)", opacity: .4 },
                    { transform: "scale(1.12) rotate(3deg)", opacity: 1 },
                    { transform: "scale(1) rotate(0)", opacity: 1 }
                ], { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" });
            });
        });

        function translateBusinessName(name) {
            const keyMap = {
                "Retail": "business.retail",
                "Fashion": "business.fashion",
                "Restaurants": "business.restaurants",
                "Services": "business.services",
                "Technology": "business.technology",
                "Home & Furniture": "business.home",
                "Professional Services": "business.professional",
                "Delivery": "business.delivery",
                "Companies": "business.companies",
                "More": "business.more"
            };
            return translations[currentLanguage][keyMap[name]] || name;
        }

        document.addEventListener("wf:languageChanged", () => {
            const activeButton = buttons.find((button) => button.classList.contains("is-selected"));
            if (activeButton) selectedText.textContent = translateBusinessName(activeButton.dataset.business);
        });
    }

    function initLivePreview() {
        const dashboard = document.getElementById("liveDashboard");
        if (!dashboard) return;

        const items = [...dashboard.querySelectorAll(".conversation-item")];
        const stats = [...dashboard.querySelectorAll("[data-counter]")];
        if (!items.length) return;

        let state = 0;

        const scenarios = [
            { item: 0, status: "new" },
            { item: 2, status: "review" },
            { item: 1, status: "ai" }
        ];

        setInterval(() => {
            state = (state + 1) % scenarios.length;
            const active = scenarios[state];

            items.forEach((item) => item.classList.remove("is-new"));

            const target = items[active.item];
            if (target) {
                target.classList.add("is-new");
                target.animate([
                    { transform: "translateX(0)", opacity: .65 },
                    { transform: "translateX(5px)", opacity: 1 },
                    { transform: "translateX(0)", opacity: 1 }
                ], { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" });
            }

            stats.forEach((stat, index) => {
                const base = Number(stat.dataset.counter);
                const delta = index === 0 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2);
                const next = base + delta;
                stat.textContent = next;
            });
        }, 3500);
    }

    function initMagneticButtons() {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        page.querySelectorAll(".magnetic-btn").forEach((button) => {
            button.addEventListener("mousemove", (event) => {
                const rect = button.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * .08}px, ${y * .08}px) translateY(-2px)`;
            });

            button.addEventListener("mouseleave", () => {
                button.style.transform = "";
            });
        });
    }

    function initCardTilt() {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const card = document.getElementById("liveDashboard");
        if (!card) return;

        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - .5;
            const y = (event.clientY - rect.top) / rect.height - .5;

            card.style.transform = `perspective(1200px) rotateY(${x * -5}deg) rotateX(${y * 4}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = root.dir === "rtl"
                ? "perspective(1200px) rotateY(4deg) rotateX(2deg)"
                : "perspective(1200px) rotateY(-4deg) rotateX(2deg)";
        });
    }

    function initKeyboardAccessibility() {
        page.querySelectorAll("button, a").forEach((element) => {
            element.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    element.classList.add("keyboard-active");
                }
            });

            element.addEventListener("keyup", () => element.classList.remove("keyboard-active"));
        });
    }

    function init() {
        setTheme(currentTheme);
        setLanguage(currentLanguage);

        bridgeGlobalControls();
        initReveal();
        initWorkflow();
        initBusinessTypes();
        initLivePreview();
        initMagneticButtons();
        initCardTilt();
        initKeyboardAccessibility();

        window.addEventListener("resize", () => {
            const progress = document.getElementById("workflowProgress");
            if (!progress) return;
            const active = page.querySelector(".workflow-indicator.is-active");
            if (!active) return;
            const index = Number(active.dataset.step);
            const amount = ((index + 1) / 6) * 100;
            if (window.matchMedia("(max-width: 820px)").matches) {
                progress.style.width = `${amount}%`;
                progress.style.height = "100%";
            } else {
                progress.style.height = `${amount}%`;
                progress.style.width = "100%";
            }
        });
    }

    init();
})();
