(function () {
  let BOOKS = [];
  let activeCategory = "All";
  let searchTerm = "";

  const gridEl = document.getElementById("grid");
  const dialEl = document.getElementById("dial");
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
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchInput.blur();
    }
  });

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
