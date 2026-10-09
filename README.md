# FrameSpace — Image Gallery

A responsive photography gallery built with HTML, CSS, and vanilla JavaScript.

## Features
- Responsive masonry-style gallery layout
- Search across titles, descriptions, categories, and tags
- Category filters and title sorting
- Dark/light theme preference saved in local storage
- Favorites saved in local storage
- Fullscreen-style image viewer with next/previous and accurate counter
- Slideshow with keyboard controls
- Random image discovery
- Related photographs
- Share controls with clipboard fallback
- Image download with a new-tab fallback for cross-origin restrictions
- Lazy loading, image error states, accessible labels, and reduced-motion support

## Run locally
1. Keep `index.html`, `style.css`, and `script.js` in the same folder.
2. Open `index.html` in a modern browser.
3. Internet access is needed for the sample Unsplash photographs.

## Add your own photographs
The starter collection contains 15 sample records in `script.js`. To reach 250 photographs, add 235 more objects to the `images` array. Each record should use a unique `id`, a category that matches a filter, descriptive text, tags, and a plain URL string:

```js
{
  id: 16,
  title: "Example photograph",
  category: "nature",
  description: "A short, accurate description.",
  tags: ["forest", "green", "landscape"],
  src: "https://example.com/photo.jpg"
}
```

Use direct image URLs. Do not wrap URLs in Markdown link syntax. For reliable downloads, use images you own or have permission to reuse. Some image hosts restrict direct downloads because of cross-origin rules.

## Suggested categories
`animals`, `nature`, `portraits`, `architecture`, `abstract`

If you add another category, add a matching category button in `index.html`.

## Deploy
You can publish the folder using GitHub Pages:
1. Create a GitHub repository and upload these three files plus `README.md`.
2. Open repository **Settings → Pages**.
3. Select the main branch and root folder, then save.
4. Wait for GitHub Pages to publish the site and copy the generated URL.

## Screenshots checklist
Capture desktop and mobile views of:
- The hero and gallery overview
- Category filters and search results
- Lightbox with navigation and image counter
- Favorites filter
- Day mode
- Slideshow or related photographs

## Accessibility/performance notes
- Semantic landmarks and accessible button names are used.
- Keyboard support includes `/` for search, arrow keys for image navigation, Escape to close, and Space to pause/resume slideshow.
- Images use lazy loading below the first few cards.
- CSS respects `prefers-reduced-motion`.
- Run browser testing on both desktop and mobile before describing the project as fully tested.
