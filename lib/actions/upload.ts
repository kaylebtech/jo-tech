"use server";

import { auth } from "@/auth";
import { uploadImage, deleteImage, type CloudinaryUploadResult } from "@/lib/cloudinary";

export async function uploadImageAction(formData: FormData, folder: string): Promise<CloudinaryUploadResult> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided");

  return uploadImage(file, folder);
}

export async function deleteImageAction(publicId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (publicId.startsWith("seed/")) return; // placeholder images have no real Cloudinary asset

  await deleteImage(publicId);
}
