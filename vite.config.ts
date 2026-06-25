import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = defineConfig({
	resolve: {
		tsconfigPaths: true,
		alias: {
			"@heroui-pro/react": path.resolve(
				__dirname,
				"./src/lib/heroui-pro-mock.tsx",
			),
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: true,
		port: 3000,
		allowedHosts: true,
	},
	plugins: [
		devtools(),
		nitro(),
		tailwindcss(),
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: true,
				concurrency: 4,
				filter: (page) => !page.path.startsWith("/demo"),
			},
		}),
		viteReact(),
	],
});

export default config;
