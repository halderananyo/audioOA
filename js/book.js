(function () {
  const bookContent = document.getElementById("bookContent");
  const suggestWrap = document.getElementById("suggestWrap");
  const suggestGrid = document.getElementById("suggestGrid");

  const params = new URLSearchParams(location.search);
  const bookId = params.get("id");

  function renderBook(book) {
    document.title = `${book.title} — Nightband`;

    bookContent.innerHTML = `
      <div class="video-wrap">
        <iframe
          src="https://www.youtube.com/embed/${book.video_id}?autoplay=1&rel=0"
          title="${Nightband.escapeHtml(book.title)}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
      <div class="book-info">
        <span class="cat-pill-lg">${Nightband.escapeHtml(book.category)}</span>
        <h1>${Nightband.escapeHtml(book.title)}</h1>
        <div class="sub">${Nightband.escapeHtml(book.author)} · Narrated by ${Nightband.escapeHtml(book.narrator || book.author)} · ${Nightband.escapeHtml(book.runtime || "")}${book.year ? " · " + Nightband.escapeHtml(book.year) : ""}</div>
        <p class="blurb">${Nightband.escapeHtml(book.blurb || "")}</p>
      </div>
    `;
  }

  async function loadSuggestions(book) {
    const { data, error } = await supabaseClient.from("books").select("*");
    if (error || !data) return;

    const picks = Nightband.pickSuggestions(book, data, 6);
    if (picks.length === 0) return;

    suggestGrid.innerHTML = "";
    picks.forEach((b) => suggestGrid.appendChild(Nightband.buildPosterEl(b)));
    suggestWrap.style.display = "block";
  }

  async function load() {
    if (!bookId) {
      bookContent.innerHTML = `<div class="empty"><h3>No book selected</h3><p>Go back to the shelf and pick one.</p></div>`;
      return;
    }

    const { data, error } = await supabaseClient
      .from("books")
      .select("*")
      .eq("id", bookId)
      .single();

    if (error || !data) {
      bookContent.innerHTML = `<div class="empty"><h3>Couldn't find that book</h3><p>It may have been removed. Go back to the shelf and try another.</p></div>`;
      return;
    }

    renderBook(data);
    loadSuggestions(data);
  }

  load();
})();
