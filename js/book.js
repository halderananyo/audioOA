(function () {
  const bookContent = document.getElementById("bookContent");
  const suggestWrap = document.getElementById("suggestWrap");
  const suggestGrid = document.getElementById("suggestGrid");

  const params = new URLSearchParams(location.search);
  const bookId = params.get("id");

  let ytPlayer = null;

  // --- Load the YouTube IFrame API script once ---
  function loadYouTubeApi() {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => resolve();
    });
  }

  function renderBookShell(book) {
    document.title = `${book.title} — Nightband`;

    bookContent.innerHTML = `
      <div class="video-wrap">
        <div id="ytPlayer"></div>
      </div>
      <div class="book-info">
        <span class="cat-pill-lg">${Nightband.escapeHtml(book.category)}</span>
        <h1>${Nightband.escapeHtml(book.title)}</h1>
        <div class="sub">${Nightband.escapeHtml(book.author)} · Narrated by ${Nightband.escapeHtml(book.narrator || book.author)} · ${Nightband.escapeHtml(book.runtime || "")}${book.year ? " · " + Nightband.escapeHtml(book.year) : ""}</div>
        <p class="blurb">${Nightband.escapeHtml(book.blurb || "")}</p>
      </div>
    `;
  }

  function setupMediaSession(book) {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: book.title,
      artist: book.author,
      album: "Nightband",
      artwork: book.cover_url
        ? [{ src: book.cover_url, sizes: "512x512", type: "image/jpeg" }]
        : []
    });

    navigator.mediaSession.setActionHandler("play", () => ytPlayer && ytPlayer.playVideo());
    navigator.mediaSession.setActionHandler("pause", () => ytPlayer && ytPlayer.pauseVideo());
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      if (!ytPlayer) return;
      ytPlayer.seekTo(Math.max(0, ytPlayer.getCurrentTime() - 10), true);
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      if (!ytPlayer) return;
      ytPlayer.seekTo(ytPlayer.getCurrentTime() + 10, true);
    });
  }

  function onPlayerStateChange(event) {
    if (!("mediaSession" in navigator)) return;
    if (event.data === YT.PlayerState.PLAYING) {
      navigator.mediaSession.playbackState = "playing";
    } else if (event.data === YT.PlayerState.PAUSED) {
      navigator.mediaSession.playbackState = "paused";
    }
  }

  async function createPlayer(book) {
    await loadYouTubeApi();
    ytPlayer = new YT.Player("ytPlayer", {
      videoId: book.video_id,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: () => setupMediaSession(book),
        onStateChange: onPlayerStateChange
      }
    });
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

    renderBookShell(data);
    createPlayer(data);
    loadSuggestions(data);
  }

  load();
})();
