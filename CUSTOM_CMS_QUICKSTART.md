# Firebase Custom CMS - Quick Start

## ✅ What's Done

Your Vibha Realties website now has a **custom Firebase CMS** instead of Sanity!

### Features:

- 🔐 **Admin Dashboard** with username/password login
- 📝 **Blog Management** - Create, edit, publish blogs
- 📍 **Areas Management** - Manage localities
- 🏢 **Channel Partners** - Manage builders/developers
- ⭐ **Testimonials** - Manage client feedback
- 📧 **Enquiries** - Receive form submissions
- 🔄 **Automatic Updates** - Website updates instantly when content is published

### Two Routes:

1. **Official Website**: http://localhost:3000
2. **Admin Dashboard**: http://localhost:3000/admin

---

## 🚀 Next Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" → Enter "vibha-realty"
3. Follow the setup wizard and create

### 2. Get Firebase Config

1. In your Firebase project, click **Settings** (gear icon)
2. Go to **Project Settings** tab
3. Scroll to **Your apps** section
4. Click **</> (Add app)**
5. Register as a web app called "vibha-realty-web"
6. Copy the Firebase config object

### 3. Update Environment Variables

Open `.env.local` and update with your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Setup Firestore Database

1. In Firebase Console: **Build** → **Firestore Database**
2. Click **Create database**
3. Choose region and start in **production mode**
4. Click **Create**

### 5. Enable Authentication

1. **Build** → **Authentication**
2. **Get Started** → Enable **Email/Password**
3. Click **Save**

### 6. Create Admin User

1. **Authentication** → **Users** tab
2. **Add user**
3. Email: `admin@example.com`
4. Password: `admin123`
5. Click **Add user**

### 7. Set Firestore Security Rules

1. **Firestore Database** → **Rules** tab
2. Replace all code with the rules from `FIREBASE_SETUP.md`
3. Click **Publish**

### 8. Start Development

```bash
npm install  # Install all packages
npm run dev  # Start server
```

Visit:

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## 🔐 Login to Admin Dashboard

```
Email: admin@example.com
Password: admin123
```

Then:

1. Create a few blog posts
2. Add areas/localities
3. Add channel partners (builders)
4. Add testimonials
5. Check the website - content appears automatically!

---

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/               # Admin dashboard
│   │   ├── page.tsx         # Login page
│   │   └── dashboard/       # Admin routes
│   ├── blog/                # Blog page (fetches from Firebase)
│   ├── projects/            # Projects page (fetches from Firebase)
│   └── testimonials/        # Testimonials page (fetches from Firebase)
├── components/
│   ├── BlogList.tsx         # Blog list component
│   ├── PartnersList.tsx     # Partners list component
│   └── TestimonialsList.tsx # Testimonials list component
├── hooks/
│   └── useCMS.ts            # Firebase data hooks
├── lib/
│   └── firebase.ts          # Firebase config
└── types/
    └── cms.ts               # TypeScript types
```

---

## 📝 Admin Dashboard Features

### Dashboard

- View statistics (total blogs, areas, partners, testimonials)
- Quick action buttons to create new content

### Blog Posts

- Create/edit/delete blogs
- Categories: Residential Updates, Investment Guide, Commercial Insights, Market Trends
- Draft/Publish workflow
- Auto-generated slugs
- Reading time estimation

### Areas

- Create/edit/delete locality information
- Used by blog posts and channel partners

### Channel Partners

- Create/edit/delete builders/developers
- Add property types and service areas
- Active/inactive status

### Testimonials

- Create/edit/delete client reviews
- Star ratings (1-5)
- Client photos (optional)

### Enquiries

- View contact form submissions
- Read-only (auto-captured from website)

---

## 🎯 Common Tasks

### Add a Blog Post

1. Go to Admin → Blog Posts
2. Click "+ New Blog"
3. Fill in title, content, category, area
4. Click "Publish"
5. Website updates instantly!

### Manage Testimonials

1. Go to Admin → Testimonials
2. Click "+ New Testimonial"
3. Enter client name, area, review text, rating
4. Click "Save"

### Create New Area

1. Go to Admin → Areas
2. Click "+ New Area"
3. Enter area name and descriptions
4. Click "Save"

---

## ⚠️ Important Notes

1. **Firebase Console** is NOT open during development - use admin dashboard only
2. **Data is live immediately** - no need to "deploy" to website
3. **Firestore is a NoSQL database** - very fast for this use case
4. **Free tier is plenty** for a small business site
5. **No Sanity files left** - everything clean!

---

## 🆘 Troubleshooting

**"Firebase credentials invalid" error**

- Check `.env.local` has correct API keys
- Ensure Firebase project is created and active

**Admin login not working**

- Verify admin user exists in Firebase Authentication
- Check email/password are correct
- See browser console for error details

**Blog not appearing on website**

- Ensure blog status is "Published" (not Draft)
- Check Firebase Firestore for the document
- Verify Firestore security rules allow read access

**Images not showing**

- Enable Firebase Storage if using images
- Add storage rules for public access

---

## 📚 Documentation

For detailed setup: See `FIREBASE_SETUP.md`

---

## 🎉 You're All Set!

Your custom CMS is ready to use. Charushila can now login and manage all content independently!

Questions? Check the console output for detailed error messages.
