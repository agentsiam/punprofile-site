# Testimonial faces

**These are the clients' own photographs.** Paul matched each one to its client
on 03/11/2026, `3ac1828`. They are not stock, not generated, and not
placeholders, and nothing here is to be replaced with an illustrated, stock or
model-generated face. `Testimonials.tsx` carries the same rule at the call site:
*"No stock faces. These are real clients. A stock photograph beside a real
client's name would present a stranger as that client."*

| File | Quote id | Rendered from |
|---|---|---|
| `testimonial-photo-min.jpg` | `coaching` | home |
| `testimonial-photo-non.jpg` | `job-alerts` | home |
| `testimonial-photo-jay.jpg` | `ai-training` | home |
| `testimonial-photo-may.jpg` | `placed-hotel-germany` | home, `/coaching`, product index |
| `testimonial-photo-ton.jpg` | `placed-chef-netherlands` | home, `/coaching`, product index |
| `testimonial-photo-nat.jpg` | `placed-it-ireland` | home, `/coaching` |
| `testimonial-photo-nut.jpg` | `placed-logistics-sweden` | home, `/coaching` |

## The clay avatars that were here before

Seven drawn clay avatars stood in these slots from 30/10/2026, `ff26b4e`, while
no photograph existed. The photographs replaced them on 03/11/2026 and nothing
referenced them afterwards, so they left `public/` on 16/11/2026, `c83ffa1`.
They were stand-ins, and their removal was the end of a sequence rather than a
loss. If one is ever needed again it is in history at `c83ffa1^`.

## The guide used to read against this folder

`Brand_Guidelines.md` in the coaching repo now rules on this case directly, in
*Where clay and where the mascot*: "A testimonial card carrying a real client's
own photograph is photography, not clay." An auditor working from the guide
arrives at what this folder already ships, so nothing further is owed here.

It did not read that way until 16/11/2026. The deciding table put "testimonial
faces" in the clay family and declared itself the winner over anything earlier
in the document, so the photography paragraph's carve-out for "real testimonials
or team photos" — exactly this folder — read as the stale one. An image audit
working only from the guide called these seven a brand violation and twice
proposed the clay avatars back over the clients' own faces. The guide was the
thing that was wrong, and it was fixed the same evening in the coaching repo,
`baf80a7`: the clay row now covers a stand-in only while no photograph of that
client exists, the new first bullet under the table rules the photograph case,
and the precedence paragraph says the table rules the two illustration families
alone.
