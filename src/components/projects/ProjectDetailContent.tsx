import { getRouteApi, useRouter } from "@tanstack/react-router";
import { Button, Spinner } from "@heroui/react";
import { ChevronLeft, CircleCheck, Download, Wand2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Comparison,
	ComparisonHandle,
	ComparisonItem,
} from "@/components/ui/shadcn-io/comparison";
import {
	useImageUrl,
	useImageWithoutBgUrl,
	useRemoveImageBackground,
} from "@/lib/query";

const routeApi = getRouteApi("/_app/_authed/projects/$name");

export function ProjectDetailContent() {
	const { name } = routeApi.useParams();
	const { data } = useImageUrl(name);
	const { data: imageWithoutBgUrl } = useImageWithoutBgUrl(name);
	const removeBgMutation = useRemoveImageBackground();
	const router = useRouter();

	const [originalLoaded, setOriginalLoaded] = useState(false);
	const [withoutBgLoaded, setWithoutBgLoaded] = useState(false);

	useEffect(() => {
		if (name) {
			setOriginalLoaded(false);
			setWithoutBgLoaded(false);
		}
	}, [name]);

	const isImageLoading = !imageWithoutBgUrl
		? !data || !originalLoaded
		: !data || !originalLoaded || !imageWithoutBgUrl || !withoutBgLoaded;

	const download = async () => {
		if (!imageWithoutBgUrl) return;
		const fileUrl = imageWithoutBgUrl;
		const fileName = `no-bg-${name}.png`;

		try {
			const response = await fetch(fileUrl);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			
			const link = document.createElement("a");
			link.href = url;
			link.download = fileName;
			link.target = "_blank"; // Helps bypass some strict popup blockers
			link.style.display = "none";
			document.body.appendChild(link);
			link.click();
			
			// Wait before cleanup so mobile browsers can process the download
			setTimeout(() => {
				link.remove();
				window.URL.revokeObjectURL(url);
			}, 2000);
		} catch (error) {
			console.error("Error downloading image:", error);
			window.open(fileUrl, "_blank");
		}
	};

	const share = async () => {
		if (!imageWithoutBgUrl) return;
		const fileUrl = imageWithoutBgUrl;
		const fileName = `no-bg-${name}.png`;

		try {
			const response = await fetch(fileUrl);
			const blob = await response.blob();
			
			if (navigator.share) {
				const file = new File([blob], fileName, { type: blob.type });
				if (navigator.canShare && navigator.canShare({ files: [file] })) {
					await navigator.share({
						files: [file],
						title: fileName,
					});
				} else {
					alert("Your device does not support sharing this file type directly.");
				}
			} else {
				alert("Web Share API is not supported in your browser.");
			}
		} catch (error) {
			console.error("Error sharing image:", error);
		}
	};

	return (
		<div className="flex flex-col h-full max-h-[calc(100vh-var(--navbar-height)-2rem)] p-6 gap-6 overflow-hidden">
			<div className="flex items-center gap-4 shrink-0">
				<Button
					variant="outline"
					size="sm"
					className="flex items-center gap-1.5 hover:bg-card/85"
					onPress={() => router.history.back()}
				>
					<ChevronLeft size={16} />
					Back
				</Button>
				<h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase truncate max-w-md">
					{name}
				</h2>
			</div>

			<div className="flex-1 flex items-center justify-center bg-card/40 border border-border/60 rounded-2xl p-4 overflow-hidden relative">
				<div className="w-full h-full bg-card border border-border rounded-xl overflow-hidden shadow-2xl relative">
					{isImageLoading && (
						<div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-xs z-50">
							<Spinner color="accent" />
						</div>
					)}

					{!imageWithoutBgUrl ? (
						<img
							src={data || undefined}
							alt={name}
							onLoad={() => setOriginalLoaded(true)}
							className="w-full h-full object-cover select-none pointer-events-none"
						/>
					) : (
						<Comparison className="w-full h-full relative isolate">
							<ComparisonItem position="left">
								<img
									src={imageWithoutBgUrl || undefined}
									alt="No background"
									onLoad={() => setWithoutBgLoaded(true)}
									className="w-full h-full object-cover select-none pointer-events-none"
								/>
							</ComparisonItem>
							<ComparisonItem position="right">
								<img
									src={data || undefined}
									alt="Original"
									onLoad={() => setOriginalLoaded(true)}
									className="w-full h-full object-cover select-none pointer-events-none"
								/>
							</ComparisonItem>
							<ComparisonHandle />
						</Comparison>
					)}
				</div>
			</div>

			<div className="flex flex-col items-center gap-3 shrink-0">
				{removeBgMutation.error && (
					<p className="text-xs text-danger font-medium bg-danger/10 px-3 py-1 rounded-md">
						Error: {removeBgMutation.error.message}
					</p>
				)}

				<div className="flex justify-center w-full max-w-xs">
					{!imageWithoutBgUrl && (
						<Button
							size="lg"
							className="w-full font-semibold shadow-md bg-accent text-accent-foreground flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200"
							isPending={removeBgMutation.isPending}
							onPress={() => removeBgMutation.mutate({ data: { name } })}
						>
							{({ isPending }) => (
								<>
									{isPending ? (
										<Spinner size="sm" color="current" />
									) : removeBgMutation.isSuccess ? (
										<CircleCheck size={18} />
									) : (
										<Wand2 size={18} />
									)}
									{isPending ? "Removing background..." : "Remove Background"}
								</>
							)}
						</Button>
					)}

					{imageWithoutBgUrl && (
						<div className="flex gap-2 w-full">
							<Button
								size="lg"
								className="flex-1 font-semibold shadow-md bg-accent text-accent-foreground flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200 px-0"
								onPress={download}
							>
								<Download size={18} />
								Download
							</Button>
							<Button
								size="lg"
								className="flex-1 font-semibold shadow-md bg-secondary text-secondary-foreground flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200 px-0"
								onPress={share}
							>
								<Share2 size={18} />
								Share
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
