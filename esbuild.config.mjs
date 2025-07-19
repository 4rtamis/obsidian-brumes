import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import { sassPlugin } from "esbuild-sass-plugin";
import fs from "fs";
import path from "path";

const banner = `/* Brumes, a plugin for City of Mist, Legend in the Mist and Otherscape */`;
const outdir = "demo/.obsidian/plugins/brumes";
const prod = process.argv[2] === "production";

// Helper to copy manifest.json
function copyManifest() {
	const src = path.resolve("manifest.json");
	const dest = path.resolve(outdir, "manifest.json");
	fs.copyFileSync(src, dest);
	console.log("📄 Copied manifest.json");
}

// Build styles
const styleBuild = esbuild.context({
	banner: { js: banner, css: banner },
	entryPoints: ["src/styles/styles.scss"],
	bundle: true,
	loader: { ".scss": "css" },
	minify: prod,
	outdir,
	plugins: [sassPlugin({ type: "css" })],
});

// Build plugin code
const pluginBuild = esbuild.context({
	banner: { js: banner },
	entryPoints: ["src/main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins,
	],
	format: "cjs",
	loader: { ".svg": "text" },
	target: "es2016",
	logLevel: "info",
	minify: prod,
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outdir,
});

// Run both builds
Promise.all([styleBuild, pluginBuild])
	.then(async ([styleCtx, pluginCtx]) => {
		console.log("✨ Both builds succeeded.");

		copyManifest();

		await styleCtx.watch();
		await pluginCtx.watch();
		console.log("👀 Watching for changes...");
	})
	.catch(() => process.exit(1));
