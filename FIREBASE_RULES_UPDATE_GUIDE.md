# 🔴 URGENT: Update Firestore Rules to Allow Public Enquiry Submission

## The Problem
Users cannot submit enquiry forms because your Firestore security rules currently require authentication. The rules need to be updated in Firebase Console to allow **anyone** (including non-authenticated users) to create enquiries.

## ⚠️ IMPORTANT
The `FIRESTORE_RULES.md` file is just **documentation**. You must update the actual rules in Firebase Console for this to work!

## ✅ Step-by-Step Instructions

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Select your project

### 2. Navigate to Firestore Rules
- Click **Firestore Database** in the left sidebar
- Click the **Rules** tab at the top

### 3. Find the Enquiries Section
Look for this section in your current rules:
```javascript
match /enquiries/{enquiryId} {
  allow read, write: if isAuthenticated();
}
```

### 4. Replace It With This
```javascript
match /enquiries/{enquiryId} {
  allow create: if true; // Anyone can create enquiries
  allow read: if isAuthenticated(); // Only authenticated users can read
  allow update, delete: if isAuthenticated(); // Only authenticated users can update/delete
}
```

### 5. Complete Rules (Copy This Entire Block)

If you want to update all rules at once, here's the complete set:

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
    
    // 🔴 CRITICAL: Enquiries - anyone can create (for public forms)
    match /enquiries/{enquiryId} {
      allow create: if true; // ✅ This allows anyone to create enquiries
      allow read: if isAuthenticated(); // Only authenticated users can read
      allow update, delete: if isAuthenticated(); // Only authenticated users can update/delete
    }
  }
}
```

### 6. Publish the Rules
- Click **Publish** button
- Wait 10-30 seconds for rules to propagate
- You should see a success message

### 7. Test It
- Go to your website
- Try submitting an enquiry form (without being logged in)
- It should work now!

## 🔍 How to Verify Rules Are Updated

1. After publishing, check the Rules tab - you should see your updated rules
2. Try submitting an enquiry form on your website
3. Check browser console (F12) - there should be no permission errors
4. Check Firestore Database → Data tab - you should see new enquiries appearing

## 🛡️ Security Note

This configuration is safe because:
- ✅ Anyone can **create** enquiries (needed for public forms)
- ✅ Only authenticated admins can **read** enquiries (protects user data)
- ✅ Only authenticated admins can **update/delete** enquiries

## ❌ If It Still Doesn't Work

1. **Clear browser cache** and try again
2. **Wait 1-2 minutes** - rules can take time to propagate
3. **Check browser console** (F12) for specific error messages
4. **Verify** you're looking at the correct Firebase project
5. **Double-check** the rules syntax - make sure there are no typos

## 📞 Need Help?

If you're still having issues:
1. Take a screenshot of your current Firestore Rules
2. Check the browser console for the exact error message
3. Verify you're in the correct Firebase project
