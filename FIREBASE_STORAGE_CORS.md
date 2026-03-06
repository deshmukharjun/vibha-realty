# Firebase Storage CORS Setup

Uploads from the browser (e.g. listing images from the admin form) can fail with:

```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Cause:** The Firebase Storage bucket must explicitly allow your app’s origins. By default, the bucket may not allow browser uploads from `localhost` or your production domain.

**Fix:** Configure CORS on the Storage bucket. Use either **Cloud Shell** (no install) or **gsutil** on your machine.

---

## Option A: Google Cloud Shell (no install, recommended on Windows)

If `gsutil` is not installed (e.g. “The term 'gsutil' is not recognized” on Windows), use the browser-based shell:

1. Open **[Google Cloud Console](https://console.cloud.google.com)** and sign in with the account that owns the **vibha-realty** Firebase project.
2. In the top bar, click the **Activate Cloud Shell** icon (terminal icon `>_`). A terminal opens at the bottom.
3. Set the project and create the CORS file in the shell:

   ```bash
   gcloud config set project vibha-realty
   ```

4. Create the CORS config (paste the whole block; Cloud Shell runs in your home directory):

   ```bash
   cat > cors.json << 'EOF'
   [
     {
       "origin": ["http://localhost:3000", "http://127.0.0.1:3000", "https://vibharealty.com", "https://www.vibharealty.com"],
       "method": ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
       "maxAgeSeconds": 3600,
       "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With", "Content-Disposition", "x-goog-resumable", "x-goog-meta-*"]
     }
   ]
   EOF
   ```

5. Apply CORS to the Storage bucket (use the bucket name from **Firebase Console → Project Settings → Storage bucket**):

   ```bash
   gsutil cors set cors.json gs://vibha-realty.firebasestorage.app
   ```

   If that fails, try:

   ```bash
   gsutil cors set cors.json gs://vibha-realty.appspot.com
   ```

6. Confirm:

   ```bash
   gsutil cors get gs://vibha-realty.firebasestorage.app
   ```

You should see the same JSON. After that, reload your app and try the upload again.

---

## Option B: Use gsutil on your PC (Windows)

1. **Install Google Cloud SDK for Windows:**  
   [Install the Google Cloud SDK](https://cloud.google.com/sdk/docs/install) and run the installer. Ensure **“Add gsutil to PATH”** (or equivalent) is checked, or add the install directory to your PATH.
2. Open a **new** PowerShell or Command Prompt (so it picks up PATH).
3. From your project folder (where `storage-cors.json` is):

   ```powershell
   gcloud auth login
   gcloud config set project vibha-realty
   gsutil cors set storage-cors.json gs://vibha-realty.firebasestorage.app
   ```

If the bucket name is different, use the one from **Firebase Console → Project Settings → Your apps → Storage bucket**.

---

To confirm CORS is set:

```bash
gsutil cors get gs://vibha-realty.firebasestorage.app
```

You should see the same origins and methods as in your CORS config.

## Add more origins (optional)

Edit `storage-cors.json` and add any new origins (e.g. a staging URL). Then run the same `gsutil cors set` command again.

---

**Firestore errors** (`ERR_QUIC_PROTOCOL_ERROR`, WebChannel transport errors) are often due to network, VPN, or corporate proxy. If the app works on another network or after a refresh, they’re usually transient. Ensuring a stable connection and using a supported browser (Chrome, Firefox, Edge) can help.
