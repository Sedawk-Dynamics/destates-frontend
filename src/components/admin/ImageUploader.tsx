"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { uploadImages } from "@/lib/api";
import toast from "react-hot-toast";

const API_HOST = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "https://api.destates.in";

function getFullUrl(url: string) {
  if (!url) return "";
  // Already absolute
  if (url.startsWith("http")) return url;
  // Relative /uploads/ path — prefix with backend host for admin preview
  if (url.startsWith("/uploads/")) return `${API_HOST}${url}`;
  return `${API_HOST}${url}`;
}

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  label?: string;
}

export default function ImageUploader({ images, onChange, multiple = true, label = "Images" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const urls = await uploadImages(files);
      if (multiple) {
        onChange([...images, ...urls]);
      } else {
        onChange([urls[0]]);
      }
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((url, i) => (
            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted">
              <img src={getFullUrl(url)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-[var(--radius)] hover:bg-muted transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={14} />
              Upload {multiple ? "Images" : "Image"}
            </>
          )}
        </button>
        {images.length === 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ImageIcon size={14} />
            No images added
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
