# CMS Content Mapping Guide

This document provides a complete analysis of which CMS content appears on which pages and what needs to be populated in the admin dashboard.

---

## 📊 Content Type Overview

Your CMS manages 5 main content types:
1. **Blog Posts** - Property insights and market updates
2. **Areas** - Service areas in Pune
3. **Channel Partners** - Builder/developer partnerships
4. **Testimonials** - Client reviews and ratings
5. **Enquiries** - Lead submissions (auto-generated from forms)

---

## 🏠 Page-by-Page Content Mapping

### 1. **Homepage (`/`)** 

**Currently Hardcoded (needs CMS integration):**
- Areas section (line 122): Currently shows hardcoded list `["Baner", "Wakad", "Hadapsar", ...]`
- **Should pull from:** `Areas` CMS collection
- Quick enquiry form areas (line 77): Hardcoded `["Baner", "Pune City", "Wakad", "Hadapsar"]`
- **Should pull from:** `Areas` CMS collection

**Dynamic Content (Already Connected):**
- None - homepage is currently static except for form submission

**📝 Action Items:**
- ✅ EnquiryForm uses CMS areas (already implemented via `useAreas()` hook)
- ⚠️ Homepage areas section still hardcoded - needs to fetch from Areas CMS

---

### 2. **Blog Page (`/blog`)**

**Dynamic Content (Already Connected):**
- ✅ Blog posts list via `<BlogList />` component
- ✅ Filters by category and area (UI ready, backend filtering may need implementation)

**CMS Content Used:**
- **Blog Posts Collection** - Only shows `status: 'published'` posts
- Fields displayed:
  - `title` - Blog title
  - `excerpt` - Short description
  - `category` - Category badge (residential-updates, investment-guide, etc.)
  - `area` - Area badge
  - `readingTime` - Reading time display
  - `publishedAt` - Publication date

**📝 Action Items:**
- ✅ Blog posts are fully dynamic
- ⚠️ Search functionality UI exists but needs backend implementation
- ⚠️ Category filter dropdown exists but needs filtering logic

**Content to Add in Admin:**
```
Go to: /admin/dashboard/blogs
Create blog posts with:
- Title (required)
- Slug (auto-generated from title)
- Excerpt (short summary, shown in card)
- Content (full blog content)
- Category: residential-updates | investment-guide | commercial-insights | market-trends
- Area (must match an Area from Areas CMS)
- Published Date
- Reading Time (minutes)
- Author: "Charushila Bhalerao"
- Featured: true/false (for homepage featuring if implemented)
- Status: draft | published (only published show on site)
```

---

### 3. **Areas Page (`/areas`)**

**Currently Hardcoded:**
- ✅ Area list (line 8-17): Hardcoded array with name and description
- ⚠️ **Should pull from:** `Areas` CMS collection

**CMS Content That Should Be Used:**
- **Areas Collection** - All areas
- Fields needed:
  - `name` - Area name (e.g., "Baner", "Wakad")
  - `shortDescription` - Brief description shown in cards
  - `fullDescription` - Detailed description (can be used in individual area pages)

**📝 Action Items:**
- ⚠️ Areas page needs to be updated to use `useAreas()` hook instead of hardcoded array
- Create all service areas in CMS

**Content to Add in Admin:**
```
Go to: /admin/dashboard/areas
Create areas with:
- Name (e.g., "Baner", "Wakad", "Hadapsar")
- Short Description (shown on areas page cards)
- Full Description (for detailed area pages if needed)

Recommended Areas:
1. Baner - Premium locality with modern amenities and good connectivity
2. Wakad - Rapid growth area with excellent infrastructure and schools
3. Hadapsar - IT hub with commercial and residential properties
4. Kalyani Nagar - Upmarket area known for luxury apartments
5. Koregaon Park - Established locality with heritage charm
6. Kothrud - Central location with vibrant community
7. Viman Nagar - Residential area near airport with good returns
8. Pune City - CBD area with commercial and premium residential
```

---

### 4. **Projects Page (`/projects`)**

**Dynamic Content (Already Connected):**
- ✅ Channel Partners list via `<PartnersList />` component
- Shows only `status: 'active'` partners

**CMS Content Used:**
- **Channel Partners Collection** - Only `status: 'active'`
- Fields displayed:
  - `name` - Partner/builder name
  - `propertyTypes` - Array of property types (shown as badges)
  - `areas` - Array of areas they operate in (shown as area badges)
  - `description` - Partner description (not currently displayed, but available)

**📝 Action Items:**
- ✅ Fully dynamic - just needs content

**Content to Add in Admin:**
```
Go to: /admin/dashboard/partners
Create channel partners with:
- Name (builder/developer name, e.g., "ABC Builders", "XYZ Developers")
- Description (optional, not currently displayed on frontend)
- Property Types: Array of types (e.g., ["2 BHK", "3 BHK", "Villas"])
- Areas: Array of areas (must match Area names from Areas CMS)
- Status: active | inactive (only active show on site)
- Logo (optional image URL if you want to add logo support later)

Example:
Name: "ABC Builders"
Property Types: ["2 BHK", "3 BHK", "4 BHK"]
Areas: ["Baner", "Wakad", "Hadapsar"]
Status: active
```

---

### 5. **Testimonials Page (`/testimonials`)**

**Dynamic Content (Already Connected):**
- ✅ Testimonials list via `<TestimonialsList />` component

**CMS Content Used:**
- **Testimonials Collection** - All testimonials
- Fields displayed:
  - `clientName` - Client's name
  - `testimonial` - Review text
  - `rating` - Star rating (1-5)
  - `area` - Area where they purchased (e.g., "Purchased in Baner")
  - `image` - Client photo (optional, not currently displayed)

**📝 Action Items:**
- ✅ Fully dynamic - just needs content

**Content to Add in Admin:**
```
Go to: /admin/dashboard/testimonials
Create testimonials with:
- Client Name (e.g., "Rajesh Kumar", "Priya Sharma")
- Area (where they purchased, e.g., "Baner", "Wakad")
- Testimonial (full review text in quotes)
- Rating: 1-5 (stars displayed)
- Image (optional client photo URL)

Example:
Client Name: "Rajesh Kumar"
Area: "Baner"
Testimonial: "Charushila helped us find our dream home in Baner. Her expertise and honesty made the process smooth. Highly recommended!"
Rating: 5
```

---

### 6. **Contact Page (`/contact`)**

**Currently Hardcoded:**
- ✅ Areas dropdown in form (line 59): Hardcoded array
- ⚠️ **Should pull from:** `Areas` CMS collection (already using EnquiryForm component)

**Dynamic Content:**
- ✅ EnquiryForm component (should use Areas CMS - needs verification)
- ❌ Enquiry submissions create Enquiry records (form currently just redirects to WhatsApp)

**CMS Content Used:**
- **Enquiries Collection** - Auto-created when form is submitted
- Fields:
  - `name` - Enquirer's name
  - `phone` - Phone number
  - `requirement` - "buy" | "rent" | "invest"
  - `area` - Selected area
  - `createdAt` - Timestamp

**📝 Action Items:**
- ⚠️ EnquiryForm should fetch areas from CMS (check if implemented)
- ✅ Enquiries are viewable in admin dashboard at `/admin/dashboard/enquiries`

**Content to Add:**
- No manual content needed - enquiries are auto-generated from form submissions
- Areas dropdown should use Areas CMS (verify implementation)

---

### 7. **About Page (`/about`)**

**CMS Content Used:**
- ❌ None - Currently fully static/hardcoded

**Static Content:**
- Bio text about Charushila
- Service types (Residential, Investment)
- Why choose sections
- Contact CTAs

**📝 Action Items:**
- No CMS integration needed (static page)

---

## 📋 Summary: What to Add in Admin Dashboard

### Priority 1: Essential Content

1. **Areas** (`/admin/dashboard/areas`)
   - Add all 8 service areas (Baner, Wakad, Hadapsar, etc.)
   - Each needs name and short description

2. **Channel Partners** (`/admin/dashboard/partners`)
   - Add all builder/developer partnerships
   - Set status to "active" for them to appear on site

3. **Testimonials** (`/admin/dashboard/testimonials`)
   - Add client reviews and ratings
   - Include client name, area, testimonial text, and rating (1-5)

### Priority 2: Content Marketing

4. **Blog Posts** (`/admin/dashboard/blogs`)
   - Create blog posts about property updates, market trends, investment guides
   - Set status to "published" for them to appear
   - Must match area names exactly with Areas CMS

### Priority 3: Viewing Leads

5. **Enquiries** (`/admin/dashboard/enquiries`)
   - Auto-generated from contact forms
   - Just view and manage - no manual creation needed

---

## 🔧 Code Updates Needed

### 1. Homepage Areas Section
**File:** `src/app/page.tsx` (line 112-131)
**Change:** Replace hardcoded areas array with `useAreas()` hook

### 2. Areas Page
**File:** `src/app/areas/page.tsx` (line 8-17)
**Change:** Replace hardcoded AREAS array with `useAreas()` hook and display `fullDescription`

### 3. EnquiryForm Areas
**File:** `src/components/forms/EnquiryForm.tsx`
**Status:** Check if already using CMS areas - if not, update to use `useAreas()` hook

---

## ✅ Quick Start Guide

1. **Start with Areas:**
   ```
   Go to: /admin/dashboard/areas
   Add all service areas you serve
   ```

2. **Add Channel Partners:**
   ```
   Go to: /admin/dashboard/partners
   Add builders/developers you work with
   Set status: active
   ```

3. **Collect Testimonials:**
   ```
   Go to: /admin/dashboard/testimonials
   Add client reviews
   Rating: 1-5 stars
   ```

4. **Create Blog Content:**
   ```
   Go to: /admin/dashboard/blogs
   Write property updates and guides
   Status: published (to show on site)
   ```

5. **Monitor Enquiries:**
   ```
   Go to: /admin/dashboard/enquiries
   View form submissions
   Contact leads via WhatsApp link
   ```

---

## 📊 Content Field Reference

### Blog Post Fields:
- `title` (string, required)
- `slug` (string, auto-generated)
- `excerpt` (string, required)
- `content` (string, required)
- `category` (enum: residential-updates | investment-guide | commercial-insights | market-trends)
- `area` (string, must match Area name)
- `publishedAt` (date)
- `readingTime` (number, minutes)
- `author` (string, default: "Charushila Bhalerao")
- `featured` (boolean)
- `status` (enum: draft | published)

### Area Fields:
- `name` (string, required)
- `shortDescription` (string, for list views)
- `fullDescription` (string, for detail pages)

### Channel Partner Fields:
- `name` (string, required)
- `description` (string, optional)
- `propertyTypes` (array of strings)
- `areas` (array of strings, must match Area names)
- `status` (enum: active | inactive)
- `logo` (string, optional image URL)

### Testimonial Fields:
- `clientName` (string, required)
- `area` (string, required)
- `testimonial` (string, required)
- `rating` (number, 1-5)
- `image` (string, optional image URL)

### Enquiry Fields (auto-generated):
- `name` (string)
- `phone` (string)
- `requirement` (enum: buy | rent | invest)
- `area` (string)
- `createdAt` (timestamp)

---

## 🎯 Recommended Content Count

- **Areas:** 8-12 areas (all areas you serve)
- **Channel Partners:** 10-20 active partners
- **Testimonials:** 10+ testimonials for social proof
- **Blog Posts:** 5-10 initial posts, then regular updates
- **Enquiries:** Auto-generated, monitor regularly

---

This completes your CMS content mapping! Start by adding Areas, then Partners and Testimonials for immediate site functionality.
