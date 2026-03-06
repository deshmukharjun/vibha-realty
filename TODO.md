# Vibha Realties – TODO & Improvements

A living list of remaining work, improvements, and cleanup for the website.

---

## Completed cleanup (done in this pass)

- **Removed unused components:** `AnimatedAreaCards.tsx`, `PartnersList.tsx` (not imported anywhere).
- **Removed unused import:** `createCallLink` from `StickyButtons.tsx` (call link is built inline).

---

## To remove / simplify

| Item | Notes |
|------|--------|
| **`/projects` page** | Only redirects to `/`. Remove route or repurpose for actual projects later. |
| **`picsum.photos` in `next.config.ts`** | No longer used (listings use Unsplash). Can remove from `remotePatterns` if no other code uses it. |
| **Duplicate/legacy CSS** | `globals.css` has both `--orange-accent` and 60-30-10 variables; consolidate if orange is no longer used. |
| **`CMS_CONTENT_MAPPING.md`** | References removed components (e.g. `PartnersList`). Update or archive. |

---

## Content & copy

| Item | Notes |
|------|--------|
| **Stats consistency** | Homepage uses "8+ years", "40+ clients", "14+ projects"; other copy mentioned "10+ years", "365 families", "67+ projects". Align numbers and messaging site-wide. |
| **About section** | Ensure "Charushila" / "Vibha Realties" positioning and RERA/certification wording are final. |
| **Contact / WhatsApp** | Confirm `NEXT_PUBLIC_WHATSAPP_NUMBER` is correct in env and used everywhere. |
| **Privacy policy** | Review and update contact/legal details if needed. |

---

## UX & functionality

| Item | Notes |
|------|--------|
| **Listing search** | Area/locality search works; consider debouncing input to avoid excessive filter runs while typing. |
| **Empty states** | When filters return no listings, consider clearer CTA (e.g. "Adjust filters" or "Contact us for similar properties"). |
| **Listing detail** | Add optional meta (e.g. Open Graph image, description) for better sharing. |
| **Enquiry form** | Optional: client-side validation (e.g. phone format), success message without full form reset, or redirect to thank-you page. |
| **Mobile sticky bar** | StickyHeader shows WhatsApp + Call; ensure phone number is correct for `tel:` link. |
| **404 page** | Already has link to contact; consider adding link back to home/listings. |

---

## Performance & tech

| Item | Notes |
|------|--------|
| **Images** | Listing cards use 320×220; detail page uses high-res helper for Unsplash. Ensure Firebase/uploaded images use appropriate sizes. |
| **Fonts** | Single Inter font; consider preload if LCP is critical. |
| **Bundle** | GSAP used for scroll-to-top on home; confirm it’s only loaded when needed (e.g. home page). |
| **Env & config** | Document required env vars (e.g. `NEXT_PUBLIC_WHATSAPP_NUMBER`, Firebase) in README or `.env.example`. |

---

## Accessibility & SEO

| Item | Notes |
|------|--------|
| **Focus states** | Buttons/links use accent focus rings; ensure all interactive elements are keyboard-focusable and visible. |
| **Alt text** | Listing images use area + property type; ensure logo and decorative images have appropriate `alt`. |
| **Headings** | Keep single `<h1>` per page and logical heading order. |
| **Metadata** | Listing detail pages could have dynamic `title`/`description` from listing data. |

---

## Admin & CMS

| Item | Notes |
|------|--------|
| **Firestore rules** | Ensure rules match current usage (listings, enquiries, testimonials, areas, channel partners). |
| **Admin auth** | Login flow and session handling; consider expiry or secure logout. |
| **Listings** | Bulk actions, duplicate, or status filters if needed. |
| **Enquiries** | Optional: export or mark-as-read in dashboard. |

---

## Optional enhancements

- **Analytics** : Add events or page views (e.g. GA4) for listings, enquiries, WhatsApp clicks.
- **WhatsApp CTA** : Optional floating WhatsApp button with configurable message.
- **Areas** : If `/areas` stays as redirect, consider a dedicated areas page with CMS-driven content later.
- **Testimonials** : Optional "Submit testimonial" form or link from homepage.
- **RERA** : Display RERA number/certification where required by law.

---

*Last updated when creating this list and performing unused-component cleanup.*
