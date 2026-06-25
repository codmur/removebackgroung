import { logoutFn } from "@/lib/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/logout")({
  beforeLoad: async () => {
    try {
      await logoutFn();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    throw redirect({ to: "/" });
  },
  component: () => null,
});
