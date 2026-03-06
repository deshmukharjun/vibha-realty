/**
 * Client-side image watermarking via Canvas API.
 * Draws two-line watermark centered on image; returns new File without resizing or changing colors.
 */

const LINE1 = "VIBHA REALTIES";
const LINE2 = "9881199152";

const WATERMARK_OPACITY = 0.6; // 60% opacity
const FONT_SCALE = 25; // fontSize = canvas.width / FONT_SCALE

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

/**
 * Draws the image onto a canvas, adds two-line watermark centered (white, 60% opacity, bold Arial),
 * and returns the result as a new File. Original dimensions and colors are preserved.
 */
export function applyWatermark(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    loadImage(url)
      .then((img) => {
        URL.revokeObjectURL(url);
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas 2d context not available"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const fontSize = Math.max(12, w / FONT_SCALE);
        const lineHeight = fontSize * 1.2;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = "white";
        ctx.globalAlpha = WATERMARK_OPACITY;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const x = w / 2;
        const y = h / 2;
        ctx.fillText(LINE1, x, y - lineHeight / 2);
        ctx.fillText(LINE2, x, y + lineHeight / 2);
        ctx.globalAlpha = 1;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob from canvas"));
              return;
            }
            const name = file.name.replace(/\.[^.]+$/, "") || "image";
            const ext = (file.name.match(/\.[^.]+$/) || [".jpg"])[0];
            resolve(new File([blob], `${name}_watermarked${ext}`, { type: blob.type }));
          },
          "image/jpeg",
          0.92
        );
      })
      .catch(reject);
  });
}
