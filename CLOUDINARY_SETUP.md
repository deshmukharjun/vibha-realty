# Cloudinary Setup (Listing Image Uploads)

Listing images are uploaded to **Cloudinary** instead of Firebase Storage. Follow these steps once.

## 1. Create a Cloudinary account

- Sign up at [cloudinary.com](https://cloudinary.com) (free tier is enough).

## 2. Get your Cloud name

- In the [Cloudinary Dashboard](https://console.cloudinary.com), open **Dashboard**.
- Your **Cloud name** is shown at the top (e.g. `dxxxxxx`). You’ll need it in step 4.

## 3. Create an unsigned upload preset

- In the dashboard, go to **Settings** (gear icon) → **Upload**.
- Scroll to **Upload presets**.
- Click **Add upload preset**.
- Set:
  - **Preset name**: e.g. `vibha_listings` (you’ll use this as the preset name in env).
  - **Signing Mode**: **Unsigned** (required for browser uploads).
  - **Folder** (optional): e.g. `listings` so all listing images go into one folder.
  - **Incoming transformation** (for watermark): In the preset's "Incoming transformations" section, add: `l_text:Arial_48_bold:VIBHA%20REALTIES%0A9881199152,co_white,o_60,fl_layer_apply,g_center` — this burns in centered white text "VIBHA REALTIES" and "9881199152" at 60% opacity.
- Save.

## 4. Add env variables

In your project root, create or edit `.env.local` and add:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

- `your_cloud_name` = the Cloud name from step 2 (e.g. `dxxxxxx`).
- `your_upload_preset_name` = the preset name from step 3 (e.g. `vibha_listings`).

If you get **401 Unauthorized** or "Unknown API key", add your **API Key** (public, not the secret):

```env
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
```

Get it from the Cloudinary Dashboard (home or **Settings → Access keys**). Use the **API Key** value only; never put the **API Secret** in front-end env.

Restart the dev server after changing env (`npm run dev`).

## 5. Floor plan PDFs (optional)

- Floor plans use Cloudinary **raw** uploads (same preset).
- If PDF upload fails, in **Upload preset** settings ensure the preset allows non-image uploads, or create a separate unsigned preset with **Resource type: Raw** and use it for raw uploads (you’d then need a second env variable for that preset; the app currently uses the same preset for both images and raw files).
- PDFs are stored in the `floorplans` folder.

## 6. Test

- Open the admin **New listing** page.
- Select one or more images, set primary, and click **Save**.
- Images are watermarked during upload via the preset's Incoming Transformation; the returned URLs are saved to the listing in Firestore.
- Optionally add address, bedrooms/bathrooms/parking, location (lat/lng), floor plan PDF, and features.

## Optional: existing Firebase Storage

Firebase Storage is no longer used for listing image uploads. You can leave it enabled for other use or disable it in the Firebase Console.
