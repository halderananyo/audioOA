# Nightband — audiobook shelf

A small audiobook catalog site. Browse by category, search by title/author,
click a cover and it plays straight from YouTube in an embedded player.

## Files

- `index.html` — the catalog page people browse
- `admin.html` — a form that generates the code for a new book entry
- `js/books-data.js` — the list of books (title, author, category, YouTube ID). This is the "database" for now.
- `js/app.js` — renders the grid, search, filters, and player
- `css/style.css` — all styling

## Adding a book (current, no-backend version)

1. Open `admin.html` in your browser, fill in the form, click **Generate entry**.
2. Copy the code block it gives you.
3. Open `js/books-data.js`, paste the new block inside the `BOOKS = [ ... ]` array (add a comma after the previous entry).
4. Save, commit, and push to GitHub. The new book appears for every visitor.

This works fine for one person maintaining the shelf by hand. See "Next step" below for a real upload-and-it-appears backend.

## Hosting it for free, forever, on GitHub Pages

1. Create a new GitHub repository (e.g. `nightband`).
2. Push these files to the repo (root of the repo, not in a subfolder), for example:
   ```
   git init
   git add .
   git commit -m "first version of Nightband"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/nightband.git
   git push -u origin main
   ```
3. On GitHub, go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
5. GitHub gives you a URL like `https://YOUR-USERNAME.github.io/nightband/` — that's your live site.

GitHub Pages is free with no time limit, as long as the repo stays public (or you're on a paid GitHub plan for a private repo with Pages). There's a soft bandwidth/build limit meant for personal sites, which this kind of project won't come close to.

Every time you edit `books-data.js` and push, the live site updates automatically within a minute or two — no rebuild step needed.

## Next step: a real backend

Right now, adding a book means editing a file and pushing to GitHub — fine for you alone, but visitors can't submit anything, and you can't update the shelf from your phone. When you're ready to remove that step, the usual path is:

- **Supabase** (free tier): gives you a real hosted database and a simple JavaScript client. You'd swap `books-data.js` for a fetch call to Supabase, and `admin.html` would write directly to that database instead of generating copy-paste code. The frontend design/pages barely change.
- **A small Node.js/Express server** (hosted free on Render or Railway): more control, but more to maintain — worth it if you want things like user accounts, or you outgrow Supabase's free tier.

Either way, `index.html`, `css/style.css`, and the overall page structure stay as they are — only where the book list *comes from* changes.
