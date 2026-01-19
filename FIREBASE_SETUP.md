# Custom Firebase CMS Setup Guide

## Project Overview

You now have a custom CMS built with Firebase as the backend. It features:

- **Admin Dashboard** at `/admin` with username/password authentication
- **Blog Management** - Create, edit, publish blogs
- **Content Management** - Areas, Channel Partners, Testimonials
- **Two separate routes**: Official website + Admin dashboard

## Firebase Setup (Important!)

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://firebase.google.com)
2. Click "Add project"
3. Enter project name: `vibha-realty`
4. Accept terms and create

### 2. Get Firebase Credentials

1. In Firebase Console, click your project
2. Go to **Settings** (gear icon) → **Project Settings**
3. Scroll down to "Your apps" section
4. Click **Add app** → **Web** (`</>`icon)
5. Register the app as `vibha-realty-web`
6. Copy the Firebase config object

### 3. Update .env.local

Open `.env.local` and replace the Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose region: `Asia Pacific (asia-southeast1)` for best performance
4. Select **Start in production mode**

### 5. Enable Authentication

1. Go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Click **Save**

### 6. Create Admin User

1. In Firebase Console → **Authentication** tab
2. Click **Add user**
3. Email: `admin@example.com`
4. Password: `admin123`
5. Click **Add user**

### 7. Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace existing rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read published blogs, areas, partners, testimonials
    match /blogPosts/{document=**} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }

    match /areas/{document=**} {
      allow read;
      allow write: if request.auth != null;
    }

    match /channelPartners/{document=**} {
      allow read: if resource.data.status == 'active';
      allow write: if request.auth != null;
    }

    match /testimonials/{document=**} {
      allow read;
      allow write: if request.auth != null;
    }

    match /enquiries/{document=**} {
      allow create;
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Running the Project

```bash
npm install   # Install dependencies
npm run dev   # Start development server
```

Visit:

- **Official Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## Admin Login Credentials

```
Email: admin@example.com
Password: admin123
```

## CMS Features

### Admin Dashboard

- View statistics for all content types
- Quick action buttons to create new content
- Logout button

### Blog Management

- Create, edit, delete blog posts
- Categories: Residential Updates, Investment Guide, Commercial Insights, Market Trends
- Draft/Publish workflow
- Auto-generated slugs
- Featured posts for homepage

### Areas Management

- Manage locality information
- Required for blog posts

### Channel Partners Management

- Manage builder/developer partnerships
- Property types and served areas
- Status (active/inactive)

### Testimonials Management

- Client testimonials with ratings
- Photos and area information

### Enquiries

- View form submissions from website
- Read-only in dashboard

## Frontend Integration

The website automatically fetches content from Firebase:

- Blog page shows published blogs sorted by date
- Areas page lists all areas
- Projects page shows active channel partners
- Testimonials page displays client feedback

No hardcoding needed - update CMS and website updates automatically!

## Data Structure

### Collections in Firestore

**blogPosts**

```
{
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  area: string
  publishedAt: date
  readingTime: number
  author: string
  featured: boolean
  status: 'draft' | 'published'
  createdAt: timestamp
  updatedAt: timestamp
}
```

**areas**

```
{
  name: string
  shortDescription: string
  fullDescription: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

**channelPartners**

```
{
  name: string
  description: string
  propertyTypes: array
  areas: array
  status: 'active' | 'inactive'
  logo: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**testimonials**

```
{
  clientName: string
  area: string
  testimonial: string
  image: string (optional)
  rating: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Troubleshooting

**"No document types" in CMS (Old Sanity)**

- ✅ This is now fixed! Using Firebase instead

**Blog not appearing on website**

- Ensure blog status is "Published" in CMS
- Check that area matches an existing area

**Login not working**

- Verify Firebase credentials in `.env.local`
- Confirm admin user exists in Firebase Authentication
- Check browser console for errors

**Images not uploading**

- Ensure Firebase Storage is enabled
- Check storage permissions in Firestore Rules

## Next Steps

1. Create test content in admin dashboard
2. Verify it appears on website
3. Share admin login with Charushila for blog writing
4. Monitor enquiries in admin dashboard

## Support

For issues:

1. Check browser console (F12) for error messages
2. Verify all Firebase configuration in `.env.local`
3. Check Firestore collections exist in Firebase Console
4. Ensure security rules allow read/write as needed
