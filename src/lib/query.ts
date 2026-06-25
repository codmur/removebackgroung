import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getImageUrlFn,
  getImageWithouBackgroundName,
  getUploadedImagesFn,
  removeImageBackgroundFn,
  uploadImageFn,
  deleteImageFn,
} from "./bg-remover";

export const useUploadImage = () =>
  useMutation({
    mutationFn: uploadImageFn,
    onSuccess: (_, _1, _2, context) =>
      context.client.invalidateQueries({ queryKey: ["uploads"] }),
  });

export const useRemoveImageBackground = () =>
  useMutation({
    mutationFn: removeImageBackgroundFn,
    onSuccess: (_, _1, _2, context) =>
      context.client.invalidateQueries({ queryKey: ["image-url"] }),
  });

export const useUploads = () =>
  useQuery({
    queryKey: ["uploads"],
    queryFn: getUploadedImagesFn,
  });

export const useImageUrl = (name: string, initialData?: string | null) =>
  useQuery({
    queryKey: ["image-url", name],
    queryFn: () => getImageUrlFn({ data: { name } }),
    initialData: initialData !== undefined ? initialData : undefined,
  });

export const useImageWithoutBgUrl = (name: string) =>
  useImageUrl(getImageWithouBackgroundName(name));

export const useDeleteImage = () =>
  useMutation({
    mutationFn: deleteImageFn,
    onSuccess: (_, _1, _2, context) =>
      context.client.invalidateQueries({ queryKey: ["uploads"] }),
  });
