# Vibha Realty – Implementation Plan

**Core objective:** Drive all qualified enquiries to Charushila. Guide discovery while limiting information exposure so users cannot bypass the advisor.

---

## Phase 1: Data model & naming

### 1.1 Listing data model (new)
- [ ] **Listing interface** in `src/types/cms.ts`:
  - `ownership`: `'personal' | 'channel-partner'`
  - `transactionType`: `'buying' | 'selling'`
  - `category`: `'land' | 'commercial' | 'residential'`
  - `area` (locality only)
  - `propertyType`, `priceRangeMin`, `priceRangeMax`
  - `status`: `'active' | 'sold' | 'hidden'`
  - `statusTag`: `'New' | 'Limited' | 'Hot'` (optional)
  - `images[]` (with order, primary thumbnail index)
  - **Never stored for display:** builder name, project name, exact address, RERA IDs, floor plans, brochures
- [ ] Firestore collection `listings` with security rules
- [ ] Admin CRUD for listings (create/edit with classification fields)

### 1.2 Naming rule
- **Site copy:** Use **Charushila** only. No “Charu” or “Kaku” on the website.
- **CTAs:** “Talk to Charushila” / “Get Verified Details from Charushila” etc.
- WhatsApp prefill can stay “Hi Charushila” (user-facing is Charushila).

---

## Phase 2: Hero – primary listing experience

### 2.1 Structure
- [ ] Hero contains **two horizontal scroll sections** (one after the other):
  1. **Charushila’s Personal Listings**
  2. **Verified Channel Partner Listings**
- [ ] Same card layout and interaction; different section headers and subtle visual differentiation (e.g. background, badge).

### 2.2 Filters (top of listing block)
- [ ] **Primary tabs:** Land | Commercial | Residential
- [ ] **Secondary toggle (per tab):** Buying | Selling
- [ ] Filters drive both Personal and Channel Partner sections (shared state or clear “applied to both” behaviour).

### 2.3 Listing cards (strict)
**Allowed on card:**
- Area (locality only)
- Property type
- Approximate price range
- Status tag (New / Limited / Hot)
- CTA: “Talk to Charushila”

**Never on card:**
- Builder / project name
- Exact address
- RERA details
- Floor plans
- Downloadable brochures

### 2.4 About me placement
- [ ] About Me block stays as-is (copy, image, layout).
- [ ] Place **after** the hero listing experience (trust after exploration).

---

## Phase 3: Image watermark (critical)

- [ ] **Spec:** Text `Vibha Realty - 98811 99152`
- [ ] **Where:** All listing images (personal + channel partner).
- [ ] **How:** Applied at upload (backend/Cloud Function) or at render (e.g. canvas/overlay component). Must be visible on frontend and in any shared/reused use of the image.
- [ ] Non-optional; every listing image must show the watermark.

---

## Phase 4: Channel partner micro-site

- [ ] Separate route or clearly labelled micro-site view.
- [ ] Same listing interaction as hero (tabs + Buying/Selling, card layout).
- [ ] Label: **“Channel Partner Opportunities”**.
- [ ] **Allowed:** Area, category, range pricing, high-level value line.
- [ ] **Not allowed:** Builder branding, project names, external links, download assets.
- [ ] **Primary CTA:** “Get Verified Details from Charushila”.

---

## Phase 5: Areas I cover

- [x] Grid of area cards (one area per card).
- [ ] **Behaviour:** Each card links to **that area’s WhatsApp broadcast group** only.
- [x] User chooses an area; CTA uses that area's link or default (no generic broadcast).
- [x] Admin/config: per-area broadcast URL via Area `whatsappBroadcastLink` (admin area form).

---

## Phase 6: Testimonials

- [x] Display only admin-approved testimonials.
- [x] **Fields:** Client first name, area purchased, short narrative.
- [x] **CTA:** “Bought a home with Charushila? Write a testimonial” → submit to backend.
- [x] Backend stores submission; admin approves; only approved items appear on site.

---

## Phase 7: Admin panel (listings & media)

### 7.1 Listing creation/editing
- [ ] **Required choices:**
  - Listing ownership: Personal | Channel Partner
  - Transaction type: Buying | Selling
  - Property category: Land | Commercial | Residential
  - Area
- [ ] Optional: status tag, price range, status (Active/Sold/Hidden).

### 7.2 Listing status
- [ ] **Active** – shown on site.
- [ ] **Sold** – hidden from public; kept in DB for records/testimonials.
- [ ] **Hidden** – hidden from public; kept in DB.

### 7.3 Media
- [ ] Multiple images/videos per listing.
- [ ] Admin can reorder media and set primary thumbnail.
- [ ] All images pass through watermarking (Phase 3).
- [ ] Optimise for performance (resize, format) on upload or via CDN.

---

## Phase 8: Enquiries & activity (lightweight CRM)

- [ ] Store: phone, listing reference, source.
- [ ] **Lifecycle:** Enquiry received → Site visit scheduled → Site visit completed → Converted / Dropped.
- [ ] Activity timeline per enquiry (viewable in admin).
- [ ] Central list of enquiries with filters (date, area, listing type) and export.

---

## Phase 9: User data & reporting

- [ ] Central place for users, enquiries, site visits.
- [ ] Filters: date, area, listing type.
- [ ] Export (e.g. CSV/Excel) for follow-up and reporting.

---

## Design reference

- **Use:** realestate.com.au – listing hierarchy, card spacing, filter clarity.
- **Avoid:** Full data exposure, builder-first navigation, marketplace-style browsing.
- **Principle:** Advisor-first; information scarcity drives contact; WhatsApp is the main conversion path.

---

## Implementation order (recommended)

1. **Phase 1** – Listing type + naming check  
2. **Phase 3** – Watermark (so all new images are safe from day one)  
3. **Phase 2** – Hero structure + two sections + filters + cards  
4. **Phase 7** – Admin listing CRUD + media + status  
5. **Phase 5** – Areas with per-area broadcast links  
6. **Phase 6** – Testimonial submission + approval  
7. **Phase 4** – Channel partner micro-site  
8. **Phase 8–9** – Enquiry lifecycle + reporting

---

## File/feature checklist (as built)

| Item                         | Status | Notes |
|-----------------------------|--------|--------|
| `Listing` type in cms.ts    | done  | Listing, ListingMedia, ListingCategory, etc. |
| useListings / listing hooks | done  | useCMS.ts; filters category + transactionType in memory |
| Watermark util/component    | done  | lib/watermark.ts, listings/WatermarkedImage.tsx |
| Hero: Personal section       | done  | "Charushila's Personal Listings" in ListingHero |
| Hero: Channel Partner section| done  | "Verified Channel Partner Listings" in ListingHero |
| Tabs: Land / Commercial / Residential | done | ListingHero top tabs |
| Toggle: Buying / Selling    | done  | ListingHero secondary toggle |
| ListingCard component       | done  | area, type, price range, status tag, CTA "Talk to Charushila" |
| About Me after hero         | done  | Page order: ListingHero → About Me → rest |
| Admin: listings list        | done   | Firestore `listings`; admin list + create/edit + ListingForm |
| Admin: listing create/edit  | done   | `/admin/dashboard/listings/new`, `[id]` + ListingForm aligned with filters |
| Area broadcast links config | done   | Area.whatsappBroadcastLink in admin area form; AreasSection uses it per card |
| Testimonial submit + approval | done | status pending/approved; public submit form; admin Approve + status in editor; Firestore rules |
