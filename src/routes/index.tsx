import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUserFn } from "@/lib/auth";
import { LandingContent } from "@/components/landing/LandingContent";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      const { user } = await getUserFn();
      if (user && user.email) {
        throw redirect({ to: "/projects" });
      }
    } catch (e) {
      if (e && typeof e === "object" && ("isRedirect" in e || (e as any).status === 307 || (e as any).status === 302 || (e as any).headers)) {
        throw e;
      }
    }
  },
  head: () => ({
    meta: [
      {
        title: "BGR – AI Background Remover | Eliminar Fondos Gratis con IA",
      },
      {
        name: "description",
        content: "Elimina el fondo de tus imágenes de forma automática y en segundos con inteligencia artificial. Gratis, rápido y con calidad profesional HD.",
      },
      {
        name: "keywords",
        content: "eliminar fondo, quitar fondo de imagen, png transparente, inteligencia artificial, bg remover, bgr",
      },
      // Open Graph / Facebook
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "BGR – AI Background Remover | Eliminar Fondos Gratis con IA",
      },
      {
        property: "og:description",
        content: "Elimina el fondo de tus imágenes de forma automática y en segundos con inteligencia artificial. Rápido y con calidad profesional HD.",
      },
      {
        property: "og:image",
        content: "/logo.webp",
      },
      // Twitter
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "BGR – AI Background Remover | Eliminar Fondos Gratis con IA",
      },
      {
        name: "twitter:description",
        content: "Elimina el fondo de tus imágenes de forma automática y en segundos con inteligencia artificial.",
      },
      {
        name: "twitter:image",
        content: "/logo.webp",
      },
    ],
  }),
  component: LandingContent,
});
