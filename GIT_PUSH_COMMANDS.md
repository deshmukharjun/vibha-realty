# Git Commands to Push to GitHub

## Step 1: Initialize Git Repository (if not already done)
```bash
git init
```

## Step 2: Check Current Status
```bash
git status
```

## Step 3: Add All Files
```bash
git add .
```

Or add specific files:
```bash
git add src/
git add *.md
git add package.json
```

## Step 4: Commit Changes
```bash
git commit -m "Add admin dashboard pages, fix blog listing, and add CMS functionality"
```

Or use a more detailed commit message:
```bash
git commit -m "feat: Complete admin dashboard implementation

- Add new/edit pages for Areas, Partners, and Testimonials
- Fix blog listing refresh and infinite loop issues
- Add Firestore security rules documentation
- Fix blog editor to load existing posts
- Add refresh functionality to CMS hooks"
```

## Step 5: Add GitHub Remote (if not already added)

### Option A: Create new repository on GitHub first, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Option B: If repository already exists:
```bash
git remote -v  # Check if remote exists
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## Step 6: Set Branch Name (if needed)
```bash
git branch -M main
```
or
```bash
git branch -M master
```

## Step 7: Push to GitHub
```bash
git push -u origin main
```

Or if your branch is named `master`:
```bash
git push -u origin master
```

## Complete Sequence (Copy & Paste All at Once)

```bash
# Initialize git (if needed)
git init

# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "feat: Complete admin dashboard implementation with CMS functionality"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Set branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## If You Already Have a Repository

If git is already initialized and you just need to push:

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "feat: Complete admin dashboard implementation with CMS functionality"

# Push
git push
```

## Create .gitignore (Recommended)

Before committing, make sure you have a `.gitignore` file. Create one if it doesn't exist:

```bash
# .gitignore
node_modules/
.next/
.env.local
.env*.local
dist/
build/
.DS_Store
*.log
.vscode/
.idea/
```

## Troubleshooting

### If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### If you get authentication errors:
You may need to use a Personal Access Token instead of password:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate a new token
3. Use it as your password when pushing

### If you need to force push (not recommended, use with caution):
```bash
git push -u origin main --force
```

## Quick One-Liner Commands

```bash
# Check, add, commit, and push in sequence
git status && git add . && git commit -m "Update: Admin dashboard fixes" && git push
```
