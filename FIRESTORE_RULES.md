# Firebase Firestore Security Rules

## 🔐 Fixing "Missing or insufficient permissions" Error

The error occurs because your Firestore security rules are too restrictive. You need to update them to allow authenticated users to read all blog posts (not just published ones) when in admin mode.

## 📝 Required Firestore Rules

Go to your [Firebase Console](https://console.firebase.google.com/) → Your Project → Firestore Database → Rules

Replace your current rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Blog Posts - allow reading published posts publicly, all posts for authenticated users
    match /blogPosts/{postId} {
      // Anyone can read published blog posts
      allow read: if resource.data.status == 'published';
      
      // Authenticated users can read all blog posts (for admin panel)
      allow read: if isAuthenticated();
      
      // Only authenticated users can create, update, or delete
      allow create, update, delete: if isAuthenticated();
    }
    
    // Areas - public read, authenticated write
    match /areas/{areaId} {
      allow read: if true; // Everyone can read areas
      allow create, update, delete: if isAuthenticated();
    }
    
    // Channel Partners - public read (only active), authenticated write
    match /channelPartners/{partnerId} {
      // Anyone can read active partners
      allow read: if resource.data.status == 'active';
      // Authenticated users can read all
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
    }
    
    // Testimonials - public read, authenticated write
    match /testimonials/{testimonialId} {
      allow read: if true; // Everyone can read testimonials
      allow create, update, delete: if isAuthenticated();
    }
    
    // Enquiries - only authenticated users can read/write
    match /enquiries/{enquiryId} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

## 🚀 Alternative: Development Rules (Temporary)

If you're still in development and want to test quickly, you can temporarily use these more permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ WARNING**: These development rules allow any authenticated user to read/write everything. Only use for development, NOT production!

## ✅ Steps to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on **Firestore Database** in the left menu
4. Click on the **Rules** tab
5. Paste the rules above
6. Click **Publish**
7. Wait a few seconds for rules to propagate
8. Refresh your admin panel

## 🔍 Verifying Rules Work

After updating the rules:
1. Refresh your admin dashboard
2. Click the "🔄 Refresh" button on the blogs page
3. You should now see all your blog posts
4. Check the browser console - the permission error should be gone

## 🛡️ Production Rules (Recommended)

For production, you might want more restrictive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Only allow specific authenticated users (admin emails)
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email in ['your-admin@email.com', 'another@admin.com'];
    }
    
    match /blogPosts/{postId} {
      allow read: if resource.data.status == 'published';
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    match /areas/{areaId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /channelPartners/{partnerId} {
      allow read: if resource.data.status == 'active';
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /enquiries/{enquiryId} {
      allow read, write: if isAdmin();
    }
  }
}
```

Replace `your-admin@email.com` with your actual admin email addresses.
