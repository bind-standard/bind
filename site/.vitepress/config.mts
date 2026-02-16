import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sidebar = JSON.parse(readFileSync(resolve(__dirname, "sidebar.json"), "utf-8"));

export default withMermaid(defineConfig({
  vite: {
    optimizeDeps: {
      include: ["mermaid", "dayjs"],
    },
  },
  title: "BIND Standard",
  description:
    "Business Insurance Normalized Data — Interoperability standard for commercial insurance",
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["link", { rel: "shortcut icon", href: "/favicon.ico" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
  ],
  themeConfig: {
    nav: [
      {
        text: "Standard",
        items: [
          { text: "Overview", link: "/overview" },
          { text: "White Paper", link: "/white-paper" },
          { text: "Concept Explorer", link: "/explorer" },
        ],
      },
      {
        text: "Specification",
        items: [
          { text: "Resources", link: "/resources/" },
          { text: "Data Types", link: "/data-types/" },
        ],
      },
      {
        text: "Infrastructure",
        items: [
          { text: "Signing", link: "/signing" },
          { text: "Trust", link: "/trust" },
          { text: "Exchange", link: "/exchange" },
        ],
      },
      { text: "Playground", link: "https://playground.bind-standard.org" },
    ],
    sidebar,
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: "https://github.com/bind-standard/bind" }],
  },
}));
