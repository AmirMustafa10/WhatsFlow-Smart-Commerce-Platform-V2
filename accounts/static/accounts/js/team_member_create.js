(() => {
  const page = document.querySelector(".tmc-page");
  if (!page) return;

  const root = document.documentElement;
  const form = document.getElementById("teamMemberCreateForm");
  const roleButtons = [...document.querySelectorAll(".tmc-role")];
  const roleInput = document.getElementById("selectedRole");
  const nameInput = document.querySelector('[name="full_name"]');
  const emailInput = document.querySelector('[name="email"]');
  const passwordInput = document.querySelector('[name="password"]');
  const previewName = document.getElementById("previewName");
  const previewEmail = document.getElementById("previewEmail");
  const previewAvatar = document.getElementById("previewAvatar");
  const previewRole = document.getElementById("previewRole");
  const previewRoleIcon = document.getElementById("previewRoleIcon");
  const togglePassword = document.getElementById("togglePassword");
  const strengthText = document.getElementById("passwordStrengthText");
  const strengthBars = [
    ...document.querySelectorAll(".tmc-strength-bars span"),
  ];
  const submit = document.getElementById("createMemberSubmit");

  const translations = {
    en: {
      enter: "Enter a password",
      weak: "Weak password",
      fair: "Fair password",
      good: "Good password",
      strong: "Strong password",
    },
    ar: {
      enter: "أدخل كلمة مرور",
      weak: "كلمة مرور ضعيفة",
      fair: "كلمة مرور متوسطة",
      good: "كلمة مرور جيدة",
      strong: "كلمة مرور قوية",
    },
  };

  const lang = () =>
    (root.lang || root.getAttribute("data-lang") || "en")
      .toLowerCase()
      .startsWith("ar")
      ? "ar"
      : "en";
  const tr = (key) => translations[lang()][key];

  function applyLanguage() {
    const current = lang();
    document.querySelectorAll("[data-en][data-ar]").forEach((el) => {
      el.textContent = el.dataset[current];
    });
    updatePasswordStrength();
    updateRolePreview();
  }

  function updateRolePreview() {
    const active =
      roleButtons.find((btn) => btn.classList.contains("active")) ||
      roleButtons[0];
    if (!active) return;
    const current = lang();
    if (roleInput) roleInput.value = active.dataset.role;
    if (previewRole)
      previewRole.textContent =
        current === "ar" ? active.dataset.labelAr : active.dataset.labelEn;
    if (previewRoleIcon)
      previewRoleIcon.innerHTML = `<i class="fas ${active.dataset.icon || "fa-user"}"></i>`;
  }

  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      roleButtons.forEach((btn) =>
        btn.classList.toggle("active", btn === button),
      );
      updateRolePreview();
    });
  });

  function updatePreview() {
    const name = (nameInput?.value || "").trim();
    const email = (emailInput?.value || "").trim();
    if (previewName)
      previewName.textContent =
        name || previewName.dataset.empty || "New team member";
    if (previewEmail)
      previewEmail.textContent = email || "member@yourbusiness.com";
    if (previewAvatar)
      previewAvatar.textContent = (name || email || "N")
        .charAt(0)
        .toUpperCase();
  }
  nameInput?.addEventListener("input", updatePreview);
  emailInput?.addEventListener("input", updatePreview);

  function updatePasswordStrength() {
    const value = passwordInput?.value || "";
    let score = 0;
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    strengthBars.forEach((bar, index) =>
      bar.classList.toggle("filled", index < score),
    );
    const fills = [
      "transparent",
      "rgba(239,68,68,.85)",
      "rgba(244,183,64,.9)",
      "rgba(79,140,255,.9)",
      "rgba(37,211,102,.95)",
    ];
    strengthBars.forEach((bar, index) => {
      bar.style.background = index < score ? fills[score] : "";
    });
    if (strengthText)
      strengthText.textContent = !value
        ? tr("enter")
        : tr(
            score <= 1
              ? "weak"
              : score === 2
                ? "fair"
                : score === 3
                  ? "good"
                  : "strong",
          );
  }
  passwordInput?.addEventListener("input", updatePasswordStrength);

  togglePassword?.addEventListener("click", () => {
    if (!passwordInput) return;
    const hidden = passwordInput.type === "password";
    passwordInput.type = hidden ? "text" : "password";
    togglePassword.innerHTML = `<i class="fas ${hidden ? "fa-eye-slash" : "fa-eye"}"></i>`;
    togglePassword.setAttribute(
      "aria-label",
      hidden ? "Hide password" : "Show password",
    );
  });

  form?.addEventListener("submit", () => {
    if (!submit) return;
    submit.classList.add("is-loading");
    submit.disabled = true;
  });

  updatePreview();
  updateRolePreview();
  updatePasswordStrength();
  new MutationObserver(applyLanguage).observe(root, {
    attributes: true,
    attributeFilter: ["lang", "data-lang"],
  });
  applyLanguage();
})();
