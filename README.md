# Britney (Jingyi Song) — academic website

A responsive, dark academic homepage for GitHub Pages. Plain HTML, CSS, and JavaScript; no installation, build step, external font services, analytics, or framework required.

## Preview

Open `index.html` in a browser, or serve this folder:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. The page is also usable by opening the file directly. If the browser does not allow clipboard access, the citation dialog selects the BibTeX for manual copying.

## Publish with GitHub Pages

1. Create a public repository named `YOUR-USERNAME.github.io` for a main personal site, or use a new project repository for a project site.
2. Add `index.html`, `styles.css`, `app.js`, `publication.bib`, and `.nojekyll` to the repository root.
3. In the repository, choose **Settings → Pages → Deploy from a branch → main → /(root)**.
4. Open the site URL shown by GitHub after the deployment succeeds.

Asset paths are relative, so the same files work at both a user-site root and a project-site subpath. Do not replace an existing website without checking its contents first.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Edit the content

- `index.html`: biography, research, publication, teaching, education, experience, email and ORCID.
- `styles.css`: the color palette and all desktop, mobile, reduced-motion and print styles.
- `app.js`: the illustrative temporal graph, timeline playback, citation dialog and copy behavior.

The bio and career details were prepared from the résumé supplied by the owner on 29 September 2026. Publication metadata and the research summary were checked against the ACM record for DOI `10.1145/3654960`. The site omits residential address and phone number. Industry responsibilities marked as draft in the résumé were not included.

Publication source: https://doi.org/10.1145/3654960

## Temporal graph

This is an original nine-vertex **illustration**, using synthetic edge events. Move the slider to set the inclusive time window `[end − 2, end]`; select a vertex to highlight its component in the undirected graph containing edges in that window. The component size includes the selected vertex itself. Connectivity is computed by a simple graph traversal. The demo is not an implementation or performance claim for the paper’s index, and does not model time-respecting reachability.

The graph supports mouse, touch and keyboard operation. Focus a vertex and press Enter or Space to select it. The native range control works with arrow keys; Home and End select the earliest and latest windows. Playback is opt-in, can be paused, and stops when the page becomes hidden or the slider is manually changed.

## Included functionality

- Responsive desktop, tablet and phone layout.
- Interactive temporal graph with selectable vertices and time-window playback.
- Publisher link and a keyboard-accessible BibTeX citation dialog with file download.
- Education and teaching timeline; expandable industry experience.
- Email and ORCID links.
- Reduced-motion support, visible keyboard focus and a print stylesheet.

No account credentials, private Overleaf links, or résumé files are included.
