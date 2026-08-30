/*
  SHARED CARD RENDERING
  ----------------------
  Used by both index.html (the shelf) and book.html (a single book's
  page + its "you might also like" suggestions), so a poster looks
  and behaves identically everywhere.
*/
window.Nightband = (function () {
  const CATEGORY_COLORS = {
    Thriller: "var(--c-thriller)",
    History: "var(--c-history)",
    Novel: "var(--c-novel)",
    Mystery: "var(--c-mystery)"
  };

  function categoryColor(cat) {
    return CATEGORY_COLORS[cat] || "var(--c-default)";
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s || "";
    return d.innerHTML;
  }

  // Builds one poster card. Clicking it navigates to the book's own page.
  function buildPosterEl(book) {
    const color = categoryColor(book.category);
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;

    const coverLayer = book.cover_url
      ? `<img src="${escapeHtml(book.cover_url)}" alt=""
           style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0;">
         <div style="position:absolute; inset:0; z-index:1;
           background:linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.8) 100%);"></div>`
      : "";

    const posterBg = book.cover_url
      ? "background:#0A0D14;"
      : `background:linear-gradient(160deg, ${color}, #05070c 130%);`;

    card.innerHTML = `
      <div class="poster" style="${posterBg}">
        ${coverLayer}
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
    const go = () => { location.href = `book.html?id=${encodeURIComponent(book.id)}`; };
    card.addEventListener("click", go);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
    return card;
  }

  // Picks related books: same author first, then same category,
  // then anything else (shuffled), up to `limit` total.
  function pickSuggestions(currentBook, allBooks, limit) {
    limit = limit || 6;
    const others = allBooks.filter((b) => b.id !== currentBook.id);

    const sameAuthor = others.filter((b) => b.author === currentBook.author);
    const sameCategory = others.filter(
      (b) => b.category === currentBook.category && b.author !== currentBook.author
    );
    const rest = others.filter(
      (b) => b.category !== currentBook.category && b.author !== currentBook.author
    );

    // shuffle the leftover pool so it's not always the same order
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    return [...sameAuthor, ...sameCategory, ...rest].slice(0, limit);
  }

  return { categoryColor, escapeHtml, buildPosterEl, pickSuggestions };
})();
