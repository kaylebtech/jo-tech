"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { uploadImageAction } from "@/lib/actions/upload";
import { addGalleryImage, deleteGalleryImage, type GalleryCategory } from "@/lib/actions/gallery";

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  "shop-inside": "Inside the Shop",
  "shop-outside": "Storefront",
  products: "Products",
  "repair-before": "Before Repair",
  "repair-after": "After Repair",
};

type GalleryItem = { id: string; url: string; publicId: string; caption: string | null; category: string };

export function GalleryManager({ images }: { images: GalleryItem[] }) {
  const router = useRouter();
  const [category, setCategory] = useState<GalleryCategory>("products");
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        const uploaded = await uploadImageAction(formData, "gallery");
        await addGalleryImage({ url: uploaded.url, publicId: uploaded.publicId, category });
      }
      toast.success("Image(s) uploaded");
      router.refresh();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select value={category} onValueChange={(v) => v && setCategory(v as GalleryCategory)}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="rounded-full" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload to &ldquo;{CATEGORY_LABELS[category]}&rdquo;
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={image.url} alt={image.caption ?? ""} fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="truncate text-xs text-white">
                {CATEGORY_LABELS[image.category as GalleryCategory] ?? image.category}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDeleteTarget(image)}
              aria-label="Delete image"
              className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">No gallery images yet — upload some above.</p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this image?"
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteGalleryImage(deleteTarget.id);
          toast.success("Image deleted");
          router.refresh();
        }}
      />
    </div>
  );
}
