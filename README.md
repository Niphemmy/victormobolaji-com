# victormobolaji.com

Personal brand hub for Victor Oluwanifemi Mobolaji (Nifemi), Founder & Team Lead of Northern Star Business Consulting, and the writer behind Nife Writes.

Static, no build step. Plain HTML + one CSS file + one JS file. Brand reused from Northern Star (navy `#001740` / gold `#d3af37`, Montserrat + Lato). Deploys to Vercel as-is.

## Structure

```
index.html              Home
about.html              The story
consulting.html         Northern Star: method, doctrine, value ladder
nife-writes.html        Writing practice (SEO target: "nife writes")
work.html               Anonymized case studies
books.html              Books & products (store links)
insights.html           Blog index
insights/*.html         3 starter posts
contact.html            Calendly embed + WhatsApp + enquiry form
links.html              Link hub
thank-you.html, 404.html
assets/css/style.css    Design system + 3D motion engine
assets/js/main.js       Tilt, parallax, magnetic buttons, reveals, forms, Calendly
assets/img/             Logos + favicons (from Northern Star) + og-default
assets/downloads/       Revenue Roadmap Checklist (lead magnet reward)
sitemap.xml, robots.txt, vercel.json
```

## Owner fill-ins (each has a visible TODO / safe placeholder)

1. **Headshots.** Drop two photos in `assets/img/`:
   - `victor-portrait.jpg` — hero, portrait crop (4:5 looks best)
   - `victor-about.jpg` — About + home "writer's edge"
   They appear automatically once present (no code change needed).
2. **Forms.** Create a free [Web3Forms](https://web3forms.com) access key and replace `REPLACE_WITH_WEB3FORMS_KEY` in `index.html` (lead magnet) and `contact.html` (enquiry). Until then, both forms fall back to opening the visitor's email app, so nothing is ever lost.
3. **Book titles + buy links** → `books.html` (placeholder cards in place).
4. **Real testimonials** from `@nife_writes` → `nife-writes.html` (sample reviews shown now).
5. **Checklist PDF (optional).** A polished printable HTML version ships at `assets/downloads/revenue-roadmap-checklist.html` (visitors can save as PDF). Swap for a designed PDF later if wanted.
6. **Custom domain.** Point `victormobolaji.com` at the Vercel project in Vercel → Settings → Domains.

## Local preview

```
python3 -m http.server 4519 --directory .
```

## Deploy

Pushed to GitHub and deployed on Vercel. `vercel.json` enables clean URLs (`/about`, not `/about.html`) and long-cache headers on assets.

Voice rules: no em dashes in body copy, no AI-flavored filler. Navy/gold only.
