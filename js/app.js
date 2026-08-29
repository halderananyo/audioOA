(function () {
  const CATEGORY_COLORS = {
    Thriller: "var(--c-thriller)",
    History: "var(--c-history)",
    Novel: "var(--c-novel)",
    Mystery: "var(--c-mystery)"
  };

  let activeCategory = "All";
  let searchTerm = "";

  const gridEl = document.getElementById("grid");
  const dialEl = document.getElementById("dial");
  const overlay = document.getElementById("overlay");
  const playerFrame = document.getElementById("playerFrame");
  const searchInput = document.getElementById("searchInput");

  function categoryColor(cat) {
    return CATEGORY_COLORS[cat] || "var(--c-default)";
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function getCategories() {
    const set = new Set(BOOKS.map((b) => b.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  function renderDial() {
    const cats = getCategories();
    const all = [{ name: "All", count: BOOKS.length }].concat(
      cats.map((c) => ({ name: c, count: BOOKS.filter((b) => b.category === c).length }))
    );
    dialEl.innerHTML = "";
    all.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = c.name === activeCategory ? "active" : "";
      const swatch =
        c.name === "All"
          ? ""
          : `<span class="swatch" style="background:${categoryColor(c.name)}"></span>`;
      btn.innerHTML = `${swatch}${escapeHtml(c.name)} <span class="count">${c.count}</span>`;
      btn.addEventListener("click", () => {
        activeCategory = c.name;
        render();
      });
      dialEl.appendChild(btn);
    });
  }

  function posterCard(book) {
    const color = categoryColor(book.category);
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="poster" style="background:linear-gradient(160deg, ${color}, #05070c 130%)">
        <span class="cat-pill">${escapeHtml(book.category)}</span>
        <div class="play-ring">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div class="mark">${escapeHtml(book.title)}</div>
        <div class="runtime">${escapeHtml(book.runtime)} &middot; ${escapeHtml(book.year)}</div>
      </div>
      <div class="poster-title">${escapeHtml(book.title)}</div>
      <div class="poster-author">${escapeHtml(book.author)}</div>
    `;
    card.addEventListener("click", () => openPlayer(book));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openPlayer(book);
    });
    return card;
  }

  function render() {
    renderDial();

    let filtered = BOOKS.filter((b) => {
      const matchesCat = activeCategory === "All" || b.category === activeCategory;
      const matchesSearch =
        !searchTerm ||
        b.title.toLowerCase().includes(searchTerm) ||
        b.author.toLowerCase().includes(searchTerm);
      return matchesCat && matchesSearch;
    });

    gridEl.innerHTML = "";

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <h3>No signal on this frequency</h3>
          <p>Try another search term, or browse a different category.</p>
        </div>`;
      return;
    }

    filtered.forEach((book) => gridEl.appendChild(posterCard(book)));
  }

  function openPlayer(book) {
    playerFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/${book.videoId}?autoplay=1&rel=0" title="${escapeHtml(
      book.title
    )}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    document.getElementById("playerTitle").textContent = book.title;
    document.getElementById("playerMeta").textContent =
      `${book.author} · Narrated by ${book.narrator} · ${book.runtime}`;
    document.getElementById("playerBlurb").textContent = book.blurb;
    overlay.classList.add("show");
  }

  function closePlayer() {
    overlay.classList.remove("show");
    playerFrame.innerHTML = "";
  }

  document.getElementById("closePlayer").addEventListener("click", closePlayer);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePlayer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePlayer();
  });

  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    render();
  });

  render();
})();
