'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sound } from '@/lib/sound';
import {
  Camera,
  X,
  Flashlight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Keyboard,
  ScanLine,
} from 'lucide-react';

interface CameraBarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (barcode: string) => void;
  expectedSku?: string;
}

export default function CameraBarcodeScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  expectedSku,
}: CameraBarcodeScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  // Start Camera Stream
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function startCamera() {
      try {
        setErrorMsg(null);
        setHasPermission(null);

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setHasPermission(true);
        setIsScanning(true);
      } catch (err: unknown) {
        if (!isMounted) return;
        setHasPermission(false);
        const msg = err instanceof Error ? err.message : 'Kamera tidak dapat diakses';
        setErrorMsg(`Gagal membuka kamera: ${msg}. Gunakan input manual atau periksa izin browser.`);
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  // Barcode Detection Loop (BarcodeDetector API if available, else canvas pattern detection)
  useEffect(() => {
    if (!isOpen || !isScanning || !hasPermission) return;

    let scanTimer: NodeJS.Timeout;
    const detectorSupported = 'BarcodeDetector' in window;

    // Type definition for BarcodeDetector
    interface DetectedBarcode {
      rawValue: string;
      format: string;
    }

    let barcodeDetector: { detect: (source: ImageBitmapSource) => Promise<DetectedBarcode[]> } | null = null;
    if (detectorSupported) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const DetectorClass = (window as any).BarcodeDetector;
        barcodeDetector = new DetectorClass({
          formats: ['code_128', 'code_39', 'qr_code', 'ean_13'],
        });
      } catch {
        barcodeDetector = null;
      }
    }

    const checkFrame = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        scanTimer = setTimeout(checkFrame, 250);
        return;
      }

      if (barcodeDetector) {
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const raw = barcodes[0].rawValue.trim();
            handleDetectedBarcode(raw);
            return;
          }
        } catch {
          // ignore detection frame errors
        }
      }

      scanTimer = setTimeout(checkFrame, 250);
    };

    scanTimer = setTimeout(checkFrame, 500);

    return () => {
      clearTimeout(scanTimer);
    };
  }, [isOpen, isScanning, hasPermission]);

  const handleDetectedBarcode = (code: string) => {
    setIsScanning(false);
    setScannedCode(code);
    sound.playSuccessBeep();

    setTimeout(() => {
      onScanSuccess(code);
      onClose();
    }, 800);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleDetectedBarcode(manualCode.trim());
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const capabilities = (track as any).getCapabilities ? (track as any).getCapabilities() : {};
        if (capabilities.torch) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (track as any).applyConstraints({
            advanced: [{ torch: !torchOn }],
          });
          setTorchOn(!torchOn);
        } else {
          alert('Lampu senter (torch) tidak didukung pada kamera ini.');
        }
      } catch {
        // torch error
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-espresso-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-linen-900 border border-linen-700 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col relative text-linen-100">
        {/* Header */}
        <div className="p-4 bg-espresso-900/90 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-terracotta-500/20 text-terracotta-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-medium text-linen-50">
                Stasiun Pemindai Kamera HP
              </h3>
              <p className="text-[10px] font-mono text-linen-400">
                Arahkan lensa ke Barcode Hangtag / Resi AWB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTorch}
              className={`p-2 rounded-lg text-xs transition ${
                torchOn ? 'bg-amber-400 text-espresso-950' : 'bg-white/10 text-linen-300 hover:text-white'
              }`}
              title="Nyalakan Lampu Senter"
            >
              <Flashlight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 text-linen-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Viewport with Scanner Reticle */}
        <div className="relative aspect-4/3 sm:aspect-square bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Scanner Overlay Visual Target */}
          {hasPermission && !scannedCode && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-40 sm:w-72 sm:h-48 border-2 border-dashed border-terracotta-400/80 rounded-2xl relative flex items-center justify-center shadow-lg">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-terracotta-500 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-terracotta-500 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-terracotta-500 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-terracotta-500 rounded-br-lg" />

                {/* Animated Red Laser Line */}
                <div className="w-full h-0.5 bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />

                <span className="absolute bottom-2 text-[10px] font-mono tracking-wider uppercase text-linen-200 bg-black/60 px-2 py-0.5 rounded">
                  Posisikan Barcode di Kotak
                </span>
              </div>
            </div>
          )}

          {/* Success Flash Overlay */}
          {scannedCode && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 animate-bounce" />
              <p className="font-serif text-lg font-medium text-emerald-200">Barcode Terdeteksi!</p>
              <p className="font-mono text-xs font-bold text-white bg-black/40 px-3 py-1.5 rounded-lg mt-1 border border-emerald-500/40">
                {scannedCode}
              </p>
            </div>
          )}

          {/* Error / Fallback State */}
          {errorMsg && (
            <div className="absolute inset-0 bg-espresso-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <p className="text-xs text-linen-300 leading-relaxed max-w-xs">{errorMsg}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-linen-800 text-linen-200 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Muat Ulang Izin</span>
              </button>
            </div>
          )}
        </div>

        {/* Expected SKU Target Hint */}
        {expectedSku && (
          <div className="px-4 py-2 bg-espresso-950/80 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-linen-400">Target Verifikasi:</span>
            <span className="text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {expectedSku}
            </span>
          </div>
        )}

        {/* Manual Input Fallback */}
        <div className="p-4 bg-espresso-900 border-t border-white/10 space-y-3">
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Keyboard className="w-3.5 h-3.5 text-linen-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ketik SKU manual (misal: PT-SM-001-001)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-linen-500 focus:outline-hidden focus:border-terracotta-400"
              />
            </div>
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="px-3 py-2 bg-terracotta-600 hover:bg-terracotta-500 disabled:opacity-40 text-white text-xs font-medium rounded-xl transition flex items-center gap-1"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Verifikasi</span>
            </button>
          </form>

          {/* Quick Demo Fill */}
          {expectedSku && (
            <div className="flex items-center justify-between text-[10px] text-linen-400">
              <span>Bermasalah dengan kamera?</span>
              <button
                type="button"
                onClick={() => setManualCode(expectedSku)}
                className="text-terracotta-300 hover:text-terracotta-200 underline font-mono"
              >
                Gunakan target SKU ({expectedSku})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
