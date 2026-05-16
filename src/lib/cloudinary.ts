/**
 * Cloudinary URL builder — frontend safe, uses only cloud name.
 * API Key & Secret are NEVER imported here.
 */

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const BASE = `https://res.cloudinary.com/${CLOUD}/image/upload`;

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
  gravity?: 'auto' | 'face' | 'center';
}

/**
 * Build a Cloudinary delivery URL from a public_id.
 * Example: cloudinaryUrl('fire-smoke/p01-grill-portrait', { width: 900 })
 */
export function cloudinaryUrl(publicId: string, opts: CloudinaryOptions = {}): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = opts;

  const transforms: string[] = [
    `f_${format}`,
    `q_${quality}`,
    `c_${crop}`,
    `g_${gravity}`,
    ...(width  ? [`w_${width}`]  : []),
    ...(height ? [`h_${height}`] : []),
  ];

  return `${BASE}/${transforms.join(',')}/${publicId}`;
}

/**
 * Upload a File to Cloudinary using an unsigned upload preset.
 * The preset must be created in the Cloudinary dashboard:
 *   Settings → Upload → Upload presets → Add unsigned preset (name: "fire-smoke")
 *
 * Returns the secure_url of the uploaded asset.
 */
export async function uploadToCloudinary(
  file: File,
  folder = 'fire-smoke',
  preset = 'fire-smoke',
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: 'POST', body: formData },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Cloudinary upload failed: ${err.error?.message ?? res.statusText}`);
  }

  const data = await res.json();
  return data.secure_url as string;
}
