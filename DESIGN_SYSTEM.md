# OMA Tattoo Website — Design & Content Rules

This document is the implementation contract for the OMA Tattoo website. Changes must remain inside these rules unless the client explicitly approves a revision.

## 1. Source of truth

- Visual direction: premium, editorial, image-led pacing inspired by `gangatattoolosangeles.com`; do not copy its branding, artist roster, celebrity claims, copy, or proprietary assets.
- Business content: use only verified information from `omatattoo.com` or client-supplied OMA assets.
- Supplied assets in this project are approved OMA studio, artist, and portfolio imagery.
- Never add a No Pain page, NoPain section, sedation claim, pain-free claim, or outbound link to a No Pain service.
- Do not invent awards, years in business, client counts, artist credentials, prices beyond the verified $100 minimum, testimonials, emails, social handles, or service guarantees.

## 2. Brand palette

Only these colors may be used in the interface:

| Token | Hex | Use |
| --- | --- | --- |
| Ink | `#0A0A0A` | Primary text, dark backgrounds |
| Paper | `#F1EFE9` | Main light background |
| Stone | `#D8D4CB` | Portfolio section background |
| Warm metal | `#C7A87B` | Restrained hover/accent only |
| White | `#FFFFFF` | Text and controls on dark surfaces |
| Muted grey | `#777777` | Secondary footer text only |

- Photography can retain its natural colors.
- Do not introduce bright brand colors, gradients as decoration, neon effects, purple/blue tech styling, or multi-color UI accents.
- Black overlays are allowed only to preserve text contrast over photography.

## 3. Typography

- Display and headings: `Manrope`, fallback `Arial, sans-serif`.
- Body and controls: `DM Sans`, fallback `Arial, sans-serif`.
- Editorial italic accent: `Georgia, serif`, only for a small word or phrase inside a heading.
- No rendered text may be smaller than **12px** (`0.75rem` at the 16px root size), including labels, captions, footer text, legal text, and buttons.
- Headings use tight leading and restrained negative tracking; body copy stays readable at `1.5` line-height.
- Uppercase with letter spacing is reserved for eyebrow labels, navigation, filters, and metadata—not paragraphs.

## 4. Layout and spacing

- Desktop content edge padding uses `clamp(24px, 5vw, 76px)`.
- Major sections use `90–170px` vertical padding depending on viewport size.
- Layout is editorial and asymmetrical, but content order remains clear and accessible.
- Image grids may mix portrait and landscape spans; cards must not use generic rounded SaaS styling.
- Corners remain square. Pill shapes are allowed only for filters. Circles are allowed only for the hero exploration control.
- Mobile breakpoint: `900px`; compact breakpoint: `560px`.

## 5. Components

- Header: transparent over the hero, then opaque black after scroll; logo, navigation, and one booking CTA.
- Hero: real OMA studio photograph, large two-line statement, one short supporting paragraph, one exploration control.
- Studio: verified introduction, daily hours, phone, and verified minimum price.
- Portfolio: filter by artist; every image opens in an accessible modal.
- Artists: list only supplied OMA artists and verified/supplied specialties.
- Reviews: paraphrase verified review themes; do not invent quotes or ratings.
- Booking: collect an inquiry and open the user's SMS app addressed to the verified OMA phone number. Do not imply that the message has already been sent.
- Footer: address, hours, phone, approved Instagram handle from supplied imagery, and copyright.

## 6. Motion and interaction

- Motion is restrained: image scale up to `1.04`, short underline reveals, header transition, and modal opening.
- No autoplay audio, scroll hijacking, cursor replacement, excessive parallax, or looping decorative animation.
- Respect `prefers-reduced-motion` and reduce transitions to effectively zero.
- Keyboard focus, semantic controls, labels, alt text, and a skip link are required.

## 7. Content exclusions

- No “No Pain” page or section.
- No celebrity section.
- No Ganga artist names, Los Angeles address, phone, email, pricing, booking terms, or legal copy.
- No unverified OMA email address.
- No fabricated counters, star ratings, awards, certifications, or claims such as “best in Omaha.”
- No stock imagery while approved OMA imagery is available.

## 8. Approved business facts

- Name: OMA Tattoo.
- Positioning line: “Where Art Meets Skin.”
- Address: 10808 Prairie Hills Drive, Omaha, Nebraska 68144.
- Phone: +1 (402) 680-1201.
- Hours: Monday–Sunday, 11:00 AM–7:00 PM.
- Minimum tattoo price starts at $100.
- Core styles stated by OMA: fine line, black & grey, realism, and custom designs.
- Additional specialties visible in supplied artist materials: cover up, mini color, anime, X-ray floral, floral, and ornamental.

## 9. Change checklist

Before shipping any change, confirm:

1. All business facts are verified or client-supplied.
2. No No Pain content exists.
3. No font renders below 12px.
4. New colors match the approved palette.
5. Mobile, keyboard, and reduced-motion behavior still works.
6. The inquiry CTA describes the real action it performs.
