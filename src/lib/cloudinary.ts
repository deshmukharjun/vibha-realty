/**
 * Client-side upload to Cloudinary using an unsigned upload preset.
 * Listing images are watermarked via Incoming Transformation during upload.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

/**
 * Uploads a file to Cloudinary and returns the secure URL.
 * Applies text watermark as Incoming Transformation (permanent burn-in during upload).
 * Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (unsigned).
 * Adding NEXT_PUBLIC_CLOUDINARY_API_KEY (Dashboard API Key, not secret) can fix 401 on some accounts.
 */
export async function uploadImage(file: File, folder = "listings"): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (API_KEY) formData.append("api_key", API_KEY);
  if (folder) formData.append("folder", folder);

  // Watermark is applied via Incoming Transformation configured in the upload preset (Settings → Upload → your preset).
  // transformation param is not allowed for unsigned uploads.

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    const msg = err?.error?.message || response.statusText;
    if (response.status === 401) {
      throw new Error(
        `Cloudinary upload failed (401). Add NEXT_PUBLIC_CLOUDINARY_API_KEY to .env.local (Dashboard → API Key, not the secret). See CLOUDINARY_SETUP.md. (${msg})`
      );
    }
    throw new Error(msg || `Upload failed: ${response.status}`);
  }

  const data = (await response.json()) as { secure_url?: string; url?: string };
  const url = data.secure_url || data.url;
  if (!url) throw new Error("Cloudinary did not return an image URL");
  return url;
}

/**
 * Uploads a raw file (e.g. PDF) to Cloudinary.
 * Use the same unsigned preset; ensure the preset allows "Resource type: Raw" in Cloudinary dashboard.
 * Returns the secure URL for the file.
 */
export async function uploadRawFile(file: File, folder = "floorplans"): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (API_KEY) formData.append("api_key", API_KEY);
  if (folder) formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    const msg = err?.error?.message || response.statusText;
    throw new Error(msg || `Upload failed: ${response.status}`);
  }

  const data = (await response.json()) as { secure_url?: string; url?: string };
  const url = data.secure_url || data.url;
  if (!url) throw new Error("Cloudinary did not return a file URL");
  return url;
}

/**
 * Uploads a video file to Cloudinary and returns the secure URL.
 * Same preset as image/raw; use video/upload endpoint.
 * No watermark applied (used for listing videos).
 */
export async function uploadVideo(file: File, folder = "listings/videos"): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (API_KEY) formData.append("api_key", API_KEY);
  if (folder) formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    const msg = err?.error?.message || response.statusText;
    throw new Error(msg || `Video upload failed: ${response.status}`);
  }

  const data = (await response.json()) as { secure_url?: string; url?: string };
  const url = data.secure_url || data.url;
  if (!url) throw new Error("Cloudinary did not return a video URL");
  return url;
}
