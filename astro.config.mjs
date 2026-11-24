import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { wgslVitePlugin } from "vgpu/client";

export default defineConfig({
  site: "https://forcexdev.github.io",
  base: "/my-portfolio",
  trailingSlash: "ignore",
  build: { format: "file" },
  integrations: [icon({ iconDir: "public/icons" }), mdx(), sitemap()],
  vite: { plugins: [tailwind(), wgslVitePlugin()] },
  devToolbar: { enabled: false },
});
