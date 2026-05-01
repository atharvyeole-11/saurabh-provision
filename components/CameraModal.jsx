'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCcw, Check, FlipHorizontal, AlertTriangle, Upload, Loader2 } from 'lucide-react';

/**
 * CameraModal
 *
 * Props:
 *  isOpen      {boolean}   – whether the modal is visible
 *  onClose     {function}  – called when user dismisses the modal
 *  onCapture   {function}  – called with (file: File, base64: string, uploadUrl?: string)
 *                            after the user confirms the shot AND the image is uploaded.
 *  title       {string}    – modal header text
 *  upload      {boolean}   – if true (default), POST to /api/upload-image automatically
 */
export default function CameraModal({
  isOpen,
  onClose,
  onCapture,
  title = 'Scan Product',
  upload = true,
}) {
  const [stream, setStream]             = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // base64 data-URL
  const [facingMode, setFacingMode]     = useState('environment'); // 'environment' | 'user'
  const [permError, setPermError]       = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState(null);

  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  /* ─── Camera lifecycle ──────────────────────────────────────────── */

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async (facing = facingMode) => {
    // Stop any existing stream first
    if (stream) stream.getTracks().forEach((t) => t.stop());

    setPermError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width:  { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      setStream(mediaStream);
      // Attach to <video> once the ref is ready
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('[CameraModal] getUserMedia error:', err.name, err.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermError('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError') {
        setPermError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setPermError('Camera is already in use by another application.');
      } else {
        setPermError(`Camera error: ${err.message}`);
      }
    }
  }, [facingMode, stream]); // eslint-disable-line react-hooks/exhaustive-deps

  // Attach stream to video element whenever stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Open/close camera with the modal
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setUploadError(null);
      startCamera(facingMode);
    } else {
      stopCamera();
      setCapturedImage(null);
      setPermError(null);
    }
    return () => {
      // Cleanup on unmount
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Camera actions ────────────────────────────────────────────── */

  const capture = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth  || 1280;
    canvas.height = video.videoHeight || 720;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const retake = () => {
    setCapturedImage(null);
    setUploadError(null);
    startCamera(facingMode);
  };

  const flipCamera = async () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    await startCamera(next);
  };

  /* ─── Upload & confirm ──────────────────────────────────────────── */

  /**
   * Converts a base64 data-URL to a File object.
   */
  const dataUrlToFile = (dataUrl, filename = 'capture.jpg') => {
    const [header, data] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new File([array], filename, { type: mime });
  };

  const confirm = async () => {
    if (!capturedImage) return;

    const file   = dataUrlToFile(capturedImage, `capture_${Date.now()}.jpg`);
    const base64 = capturedImage; // full data-URL including the MIME prefix

    if (!upload) {
      // Caller handles everything — just pass file + base64
      onCapture(file, base64, null);
      onClose();
      return;
    }

    /* ── POST to /api/upload-image ── */
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('base64', base64);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Upload failed (${res.status})`);
      }

      // Pass file, base64, and whatever URL the server returns
      onCapture(file, base64, json.url ?? null);
      onClose();
    } catch (err) {
      console.error('[CameraModal] Upload error:', err);
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ─── Render ────────────────────────────────────────────────────── */

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black" role="dialog" aria-modal="true" aria-label={title}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 inset-x-0 z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-white" />
          <h2 className="text-white font-bold text-base tracking-wide">{title}</h2>
        </div>
        <button
          onClick={() => { stopCamera(); onClose(); }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition text-white"
          aria-label="Close camera"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">

        {/* Permission / device error */}
        {permError && (
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{permError}</p>
            <button
              onClick={() => startCamera(facingMode)}
              className="mt-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-100 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Live video */}
        {!permError && !capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Corner-bracket viewfinder overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* TL */}
                <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-sm" />
                {/* TR */}
                <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-sm" />
                {/* BL */}
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-sm" />
                {/* BR */}
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-sm" />
                {/* Scan line animation */}
                <span className="absolute inset-x-0 top-0 h-0.5 bg-green-400/70 animate-scan-line" />
              </div>
            </div>
          </>
        )}

        {/* Captured preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        )}

        {/* Hidden canvas for snapshot */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="px-8 py-8 flex items-center justify-center gap-10 bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 inset-x-0">

        {!capturedImage ? (
          /* ── Shoot mode ── */
          <>
            {/* Flip camera */}
            <button
              onClick={flipCamera}
              disabled={!!permError}
              className="flex flex-col items-center gap-1.5 text-white disabled:opacity-30"
              aria-label="Switch camera"
            >
              <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <FlipHorizontal className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Flip</span>
            </button>

            {/* Shutter */}
            <button
              onClick={capture}
              disabled={!!permError || !stream}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center
                         border-4 border-gray-300 shadow-2xl shadow-white/20
                         active:scale-95 transition-transform disabled:opacity-30"
              aria-label="Capture photo"
            >
              <span className="w-[62px] h-[62px] rounded-full bg-white border-2 border-gray-400" />
            </button>

            {/* Spacer to keep shutter centred */}
            <div className="w-12" aria-hidden />
          </>
        ) : (
          /* ── Review mode ── */
          <>
            {/* Retake */}
            <button
              onClick={retake}
              disabled={uploading}
              className="flex flex-col items-center gap-1.5 text-white disabled:opacity-40"
              aria-label="Retake photo"
            >
              <span className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <RefreshCcw className="w-6 h-6" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Retake</span>
            </button>

            {/* Confirm / Upload */}
            <button
              onClick={confirm}
              disabled={uploading}
              className="flex flex-col items-center gap-1.5 text-white disabled:opacity-40"
              aria-label="Confirm and upload photo"
            >
              <span className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-xl shadow-green-500/40 transition-all active:scale-95">
                {uploading
                  ? <Loader2 className="w-8 h-8 animate-spin" />
                  : upload
                    ? <Upload className="w-8 h-8" />
                    : <Check className="w-8 h-8" />
                }
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {uploading ? 'Uploading…' : 'Use Photo'}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Upload error toast */}
      {uploadError && (
        <div className="absolute bottom-36 inset-x-4 flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded-2xl shadow-lg z-20">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium flex-1">{uploadError}</p>
          <button onClick={() => setUploadError(null)} aria-label="Dismiss error">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scan line keyframe (injected inline for portability) */}
      <style>{`
        @keyframes scan-line {
          0%   { top: 0; opacity: 1; }
          90%  { top: 100%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
          position: absolute;
        }
      `}</style>
    </div>
  );
}
