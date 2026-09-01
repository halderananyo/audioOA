(function () {
  let BOOKS = [];
  let activeCategory = "All";
  let searchTerm = "";

  const gridEl = document.getElementById("grid");
  const dialEl = document.getElementById("dial");

  // Click-and-drag horizontal scrolling for the category bar (desktop mouse users)
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  dialEl.addEventListener("mousedown", (e) => {
    isDragging = true;
    dialEl.classList.add("dragging");
    dragStartX = e.pageX;
    dragStartScroll = dialEl.scrollLeft;
  });
  window.addEventListener("mouseup", () => {
    isDragging = false;
    dialEl.classList.remove("dragging");
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    dialEl.scrollLeft = dragStartScroll - (e.pageX - dragStartX);
  });
  const searchInput = document.getElementById("searchInput");

  function renderDial() {
    const cats = Array.from(new Set(BOOKS.map((b) => b.category))).sort((a, b) => a.localeCompare(b));
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
          : `<span class="swatch" style="background:${Nightband.categoryColor(c.name)}"></span>`;
      btn.innerHTML = `${swatch}${Nightband.escapeHtml(c.name)} <span class="count">${c.count}</span>`;
      btn.addEventListener("click", () => {
        activeCategory = c.name;
        render();
      });
      dialEl.appendChild(btn);
    });
  }

  function render() {
    renderDial();

    if (BOOKS.length === 0) {
      gridEl.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <h3>The shelves are bare</h3>
          <p>No books yet — add one from the admin page.</p>
        </div>`;
      return;
    }

    let filtered = BOOKS.filter((b) => {
      const matchesCat = activeCategory === "All" || b.category === activeCategory;
      const matchesSearch =
        !searchTerm ||
        (b.title || "").toLowerCase().includes(searchTerm) ||
        (b.author || "").toLowerCase().includes(searchTerm) ||
        (b.narrator || "").toLowerCase().includes(searchTerm);
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

    filtered.forEach((book) => gridEl.appendChild(Nightband.buildPosterEl(book)));
  }

  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    render();
    renderSearchResults();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchInput.blur();
      hideSearchResults();
    }
    if (e.key === "Escape") {
      hideSearchResults();
    }
  });

  searchInput.addEventListener("focus", () => {
    if (searchTerm) renderSearchResults();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) hideSearchResults();
  });

  const searchResultsEl = document.getElementById("searchResults");

  function hideSearchResults() {
    searchResultsEl.classList.remove("show");
  }

  function resultRow(book) {
    const thumb = book.cover_url
      ? `<img src="${Nightband.escapeHtml(book.cover_url)}" alt="">`
      : "";
    const bg = book.cover_url ? "" : `background:linear-gradient(160deg, ${Nightband.categoryColor(book.category)}, #05070c 130%);`;

    const row = document.createElement("div");
    row.className = "result-row";
    row.innerHTML = `
      <div class="result-thumb" style="${bg}">${thumb}</div>
      <div>
        <div class="result-title">${Nightband.escapeHtml(book.title)}</div>
        <div class="result-sub">${Nightband.escapeHtml(book.author)} · ${Nightband.escapeHtml(book.category)}${book.year ? " · " + Nightband.escapeHtml(book.year) : ""}</div>
      </div>
    `;
    row.addEventListener("click", () => {
      location.href = `book.html?id=${encodeURIComponent(book.id)}`;
    });
    return row;
  }

  function renderSearchResults() {
    if (!searchTerm) {
      hideSearchResults();
      return;
    }

    const matches = BOOKS.filter((b) => {
      return (
        (b.title || "").toLowerCase().includes(searchTerm) ||
        (b.author || "").toLowerCase().includes(searchTerm) ||
        (b.narrator || "").toLowerCase().includes(searchTerm)
      );
    }).slice(0, 8);

    searchResultsEl.innerHTML = "";

    if (matches.length === 0) {
      searchResultsEl.innerHTML = `<div class="result-empty">No matches for "${Nightband.escapeHtml(searchInput.value)}"</div>`;
    } else {
      matches.forEach((b) => searchResultsEl.appendChild(resultRow(b)));
    }

    searchResultsEl.classList.add("show");
  }

  async function loadBooks() {
    gridEl.innerHTML = `<div class="empty" style="grid-column:1/-1"><h3>Tuning in…</h3><p>Loading the shelf.</p></div>`;
    const { data, error } = await supabaseClient
      .from("books")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      gridEl.innerHTML = `<div class="empty" style="grid-column:1/-1"><h3>Couldn't load the shelf</h3><p>${Nightband.escapeHtml(error.message)}</p></div>`;
      return;
    }

    BOOKS = data || [];
    render();
  }

  loadBooks();
})();
