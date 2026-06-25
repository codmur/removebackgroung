import { createFileRoute } from "@tanstack/react-router";
import { getImageUrlFn, getImageWithouBackgroundName } from "@/lib/bg-remover";
import { ProjectDetailContent } from "@/components/projects/ProjectDetailContent";

export const Route = createFileRoute("/_app/_authed/projects/$name")({
	loader: async ({ params: { name }, context: { queryClient, user } }) => {
		if (!user) return;
		await Promise.all([
			queryClient.ensureQueryData({
				queryKey: ["image-url", name],
				queryFn: () => getImageUrlFn({ data: { name } }),
			}),
			queryClient.ensureQueryData({
				queryKey: ["image-url", getImageWithouBackgroundName(name)],
				queryFn: () => getImageUrlFn({ data: { name: getImageWithouBackgroundName(name) } }),
			}),
		]);
	},
	component: ProjectDetailContent,
});
