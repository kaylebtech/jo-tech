"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImageAction, deleteImageAction } from "@/lib/actions/upload";

export type UploadedImage = { url: string; publicId: string };

export function ImageUploader({
  folder,
  images,
  onChange,
  multiple = true,
  max = 8,
}: {
  folder: string;
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  multiple?: boolean;
  max?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(
        Array.from(files)
          .slice(0, max - images.length)
          .map(async (file) => {
            const formData = new FormData();
            formData.set("file", file);
            return uploadImageAction(formData, folder);
          })
      );
      onChange(multiple ? [...images, ...uploads] : uploads.slice(0, 1));
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async (image: UploadedImage) => {
    onChange(images.filter((img) => img.publicId !== image.publicId));
    try {
      await deleteImageAction(image.publicId);
    } catch {
      // Non-fatal — the reference is already removed from this record.
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((image) => (
          <div key={image.publicId} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
            <Image src={image.url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(image)}
              aria-label="Remove image"
              className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
          >
            {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            <span className="text-xs">{uploading ? "Uploading…" : "Upload"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
