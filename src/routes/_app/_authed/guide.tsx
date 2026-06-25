import { createFileRoute } from "@tanstack/react-router";
import { GuideContent } from "@/components/guide/GuideContent";

export const Route = createFileRoute("/_app/_authed/guide")({
  component: GuideContent,
});
