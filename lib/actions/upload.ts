"use server";

import { uploadImage, deleteImage, type CloudinaryUploadResult } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth-guards";

export async function uploadImageAction(formData: FormData, folder: string): Promise<CloudinaryUploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided");

  return uploadImage(file, folder);
}

export async function deleteImageAction(publicId: string): Promise<void> {
  await requireAdmin();
  if (publicId.startsWith("seed/") || publicId.startsWith("unsplash/")) return; // no real Cloudinary asset to delete

  await deleteImage(publicId);
}
