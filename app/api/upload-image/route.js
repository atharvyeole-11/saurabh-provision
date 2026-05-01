import { NextResponse } from 'next/server';

/**
 * POST /api/upload-image
 *
 * Accepts a multipart/form-data body with:
 *   image  – File  (the captured JPEG)
 *   base64 – string (optional, the full data-URL)
 *
 * Returns:
 *   { success: true, url: string, base64: string, size: number, mimeType: string }
 *
 * Storage strategy (no third-party service required):
 *   In production you would swap the `url` logic for your preferred storage
 *   (Cloudinary, Vercel Blob, AWS S3, etc.).  For now the route validates the
 *   image, converts it to base64, and returns it so the caller can use it
 *   immediately – e.g. pass it straight to the Gemini Vision API.
 *
 * To integrate Cloudinary later, uncomment the section below and add:
 *   CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud> to .env.local
 */

export const config = {
  api: {
    bodyParser: false, // handled by Next.js App Router automatically
  },
};

// Max image size accepted: 10 MB
const MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file   = formData.get('image');
    const base64Input = formData.get('base64'); // optional; client may pre-send it

    /* ── Validate ── */
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No image file provided. Send a multipart field named "image".' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WEBP, GIF.` },
        { status: 415 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: `Image too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max allowed: 10 MB.` },
        { status: 413 }
      );
    }

    /* ── Convert to base64 ── */
    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);
    const base64Data  = buffer.toString('base64');
    const dataUrl     = base64Input || `data:${file.type};base64,${base64Data}`;

    /* ── Optional: Upload to Cloudinary ──────────────────────────────
     *
     * Uncomment and install `cloudinary` to persist images:
     *
     * import { v2 as cloudinary } from 'cloudinary';
     * cloudinary.config({ secure: true }); // reads CLOUDINARY_URL env var
     *
     * const uploaded = await cloudinary.uploader.upload(dataUrl, {
     *   folder: 'saurabh-provision',
     *   resource_type: 'image',
     * });
     * const url = uploaded.secure_url;
     *
     * ─────────────────────────────────────────────────────────────── */

    // For now: return the data-URL so callers can use it immediately
    // (e.g. pass as inlineData to Gemini Vision API)
    const url = dataUrl;

    return NextResponse.json({
      success:  true,
      url,                          // usable <img src> or Gemini inlineData
      base64:   base64Data,         // raw base64 without the data: prefix
      mimeType: file.type,
      size:     file.size,
      filename: file.name,
    });
  } catch (err) {
    console.error('[/api/upload-image] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + err.message },
      { status: 500 }
    );
  }
}

/* GET is not supported on this endpoint */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST to upload an image.' },
    { status: 405 }
  );
}
