import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "./supabase";

const getUserId = async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error("Not Authenticated");
  }
  return data.user.id;
};
export const uploadImageFn = createServerFn({ method: "POST" })
  .validator(z.object({ file: z.string(), contentType: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const userId = await getUserId();
    const fileName = crypto.randomUUID();
    const filePath = `${userId}/${fileName}`;
    const buffer = Buffer.from(data.file, "base64");
    
    // Limit to 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (buffer.byteLength > MAX_SIZE) {
      throw new Error("El archivo supera el tamaño máximo permitido de 50MB.");
    }
    
    // Proactively try to update the Supabase bucket limit to 50MB
    try {
      await supabase.storage.updateBucket("images", {
        public: true,
        fileSizeLimit: MAX_SIZE,
      });
    } catch (e) {
      console.warn("Failed to update Supabase bucket size limit: ", e);
    }

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, buffer, { contentType: data.contentType });
    if (error) throw new Error(error.message);
    return fileName;
  });

export const getUploadedImagesFn = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();
  const userId = await getUserId();
  const { error, data } = await supabase.storage.from("images").list(userId);
  if (error) throw new Error(error.message);
  
  const filtered = data.filter((image) => !image.name.startsWith("no-bg"));
  if (filtered.length === 0) return [];

  // Generate signed URLs in a single bulk request on the server
  const paths = filtered.map((image) => `${userId}/${image.name}`);
  const { data: signedData, error: signedError } = await supabase.storage
    .from("images")
    .createSignedUrls(paths, 60 * 60);

  if (signedError) {
    console.error("Failed to generate bulk signed URLs:", signedError);
    return filtered.map((image) => ({ ...image, signedUrl: null }));
  }

  // Map the signed URLs back to the image objects
  return filtered.map((image, index) => {
    const signedItem = signedData[index];
    return {
      ...image,
      signedUrl: signedItem?.signedUrl || null,
    };
  });
});

export const getImageUrlFn = createServerFn()
  .validator(z.object({ name: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const userId = await getUserId();
    const fileName = data.name;
    const filePath = `${userId}/${fileName}`;
    try {
      const { error, data: result } = await supabase.storage
        .from("images")
        .createSignedUrl(filePath, 60 * 60);
      if (error) {
        return null;
      }
      return result.signedUrl;
    } catch (_) {
      return null;
    }
  });

export const removeImageBackgroundFn = createServerFn()
  .validator(z.object({ name: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const userId = await getUserId();
    const fileName = data.name;
    const filePath = `${userId}/${fileName}`;
    const { error, data: urlData } = await supabase.storage
      .from("images")
      .createSignedUrl(filePath, 60 * 60);
    if (error) throw new Error(error.message);
    const result = await removeBackgroundImageBria(urlData.signedUrl);
    const newFilePath = `${userId}/${getImageWithouBackgroundName(fileName)}`;
    await uploadFileToSupabaseFromUrl({
      path: newFilePath,
      url: result.result.image_url,
    });
  });
export const getImageWithouBackgroundName = (fileName: string) =>
  `no-bg-${fileName}`;
const removeBackgroundImageBria = createServerOnlyFn(
  async (originalImageUrl: string) => {
    const response = await fetch(
      `https://engine.prod.bria-api.com/v2/image/edit/remove_background`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_token: process.env.BRIA_API_KEY!,
        },
        body: JSON.stringify({ image: originalImageUrl, sync: true }),
      }
    );
    return (await response.json()) as BriaRemoveBackgroundType;
  }
);

type BriaRemoveBackgroundType = {
  result: {
    image_url: string;
  };
  request_id: string;
};
const uploadFileToSupabaseFromUrl = createServerOnlyFn(
  async ({ url, path }: { url: string; path: string }) => {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch file: ${response.statusText}`);

    const blob = await response.blob();

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.storage
      .from("images")
      .upload(path, blob, {
        contentType: blob.type || "application/octet-stream",
      });

    if (error) throw error;
    return data;
  }
);

export const deleteImageFn = createServerFn()
  .validator(z.object({ name: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const userId = await getUserId();
    const fileName = data.name;
    const filePath = `${userId}/${fileName}`;
    const noBgFilePath = `${userId}/${getImageWithouBackgroundName(fileName)}`;
    
    const { error } = await supabase.storage
      .from("images")
      .remove([filePath, noBgFilePath]);
      
    if (error) throw new Error(error.message);
    return { success: true };
  });
