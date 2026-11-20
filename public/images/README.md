# public/images: the image library

New images for the site, the candidate report, emails and social go here, one
copy each, so any of them can link to the same file. Started 20/11/2026.

| Folder | Holds |
|---|---|
| `clay/` | clay scenes from the cast sheet: heroes, product and service scenes, report pages |
| `mascot/` | the flat orange "P", small moments only |
| `photos/` | real photographs: coaches, clients who gave consent |
| `logos/` | PunProfile and EU Fit Check marks |

Which family goes where is ruled in `Brand_Guidelines.md`, "Where clay and where the
mascot", in the coaching repo.

Images in the older per-page folders (`home/`, `products/`, `pricing/` and the
rest) move in here when their page is next changed, with every reference updated
in the same commit. Nothing is moved on its own.

Name files by what they show, never `image.png`. Full-size originals sit in `photos/originals/`, which git ignores, so they stay on Paul's Mac as the pool to choose from and are never deployed; a page uses a copy cut to its size and named for what it shows. A file is listed below once
something uses it.

| File | Used by |
|---|---|
| `photos/europe-street-cafe.jpg` | candidate report, the Coaching 1:1 opening page (`src/lib/report.ts`); 1600x1200, cut from `originals/EU_citylisha-riabinina-eY8ScPnDY4Y--no-copy-right.jpg` |
| `photos/cafe-woman-reading-tall.jpg` | candidate report cover collage; 800x1300, cut from `originals/People-rainier-ridao-LFGF6SL3Co0--no-copy-right.jpg` |
| `photos/copenhagen-nyhavn.jpg` | candidate report cover collage; 900x720, cut from `originals/EU_cityjulius-jansson-yNNa5rEIcF8--no-copy-right.jpg` |
| `photos/cinque-terre-coast.jpg` | candidate report cover collage; 900x720, cut from `originals/EU_citytaisha-ellison-6asCAiJ7fSY--no-copy-right.jpg` |
| `photos/eu-flag-sky-wide.jpg` | candidate report cover collage; 1600x340, cut from `originals/EU_cityalexey-larionov-1X3li7TGf6o--no-copy-right.jpg` |
