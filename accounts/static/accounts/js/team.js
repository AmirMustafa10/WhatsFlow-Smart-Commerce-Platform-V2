(() => {
  const page = document.querySelector(".team-page");
  if (!page) return;

  const root = document.documentElement;
  const cards = [...document.querySelectorAll(".member-card")];
  const search = document.getElementById("teamSearch");
  const empty = document.getElementById("searchEmpty");
  const count = document.getElementById("visibleMembersCount");
  const chips = [...document.querySelectorAll(".filter-chip")];
  const reset = document.getElementById("resetTeamFilters");
  let role = "all";

  const lang = () =>
    (root.lang || root.getAttribute("data-lang") || "en")
      .toLowerCase()
      .startsWith("ar")
      ? "ar"
      : "en";

  function applyLanguage() {
    const current = lang();
    document.querySelectorAll("[data-en][data-ar]").forEach((el) => {
      el.textContent = el.dataset[current];
    });
    if (search)
      search.placeholder =
        search.dataset[`placeholder${current === "ar" ? "Ar" : "En"}`];
  }

  function filterCards() {
    const query = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matchesRole = role === "all" || card.dataset.role === role;
      const matchesText = !query || (card.dataset.search || "").includes(query);
      const show = matchesRole && matchesText;
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = visible;
    if (empty) empty.hidden = visible !== 0;
  }

  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      role = chip.dataset.role;
      chips.forEach((c) => c.classList.toggle("active", c === chip));
      filterCards();
    }),
  );

  search?.addEventListener("input", filterCards);
  reset?.addEventListener("click", () => {
    role = "all";
    if (search) search.value = "";
    chips.forEach((c) =>
      c.classList.toggle("active", c.dataset.role === "all"),
    );
    filterCards();
    search?.focus();
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      search?.focus();
    }
    if (e.key === "Escape" && document.activeElement === search) {
      if (search.value) {
        search.value = "";
        filterCards();
      }
      search.blur();
    }
  });

  cards.forEach((card) => {
    const go = () => {
      const url = card.dataset.profileUrl;
      if (url) window.location.href = url;
    };
    card.addEventListener("click", (e) => {
      if (e.target.closest("button, form, a, input")) return;
      go();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (e.target.closest("button, form, a")) return;
        e.preventDefault();
        go();
      }
    });
  });

  document.querySelectorAll(".owner-card").forEach((card) => {
    const go = () => {
      if (card.dataset.profileUrl)
        window.location.href = card.dataset.profileUrl;
    };
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      go();
    });
  });

  document.querySelectorAll(".profile-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (btn.dataset.profileUrl) window.location.href = btn.dataset.profileUrl;
    });
  });

  document.querySelectorAll(".team-alert-close").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest(".team-alert")?.remove());
  });

  // Re-apply text when the global language toggle changes html[lang].
  applyLanguage();
  new MutationObserver(applyLanguage).observe(root, {
    attributes: true,
    attributeFilter: ["lang", "data-lang"],
  });
  filterCards();
})();
