import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import { sassPlugin } from "esbuild-sass-plugin";
import fs from "fs";
import path from "path";

const banner = `/* Brumes, a plugin for City of Mist, Legend in the Mist and :Otherscape */`;

// Support for custom outdir via command line argument
const getOutdir = () => {
	// Find the last argument that looks like a path (after -- or as last argument)
	const args = process.argv.slice(2); // Remove 'node' and script name

	// Look for argument after '-p' separator (npm run build -- -p "path")
	const dashIndex = args.indexOf("-p");
	if (dashIndex !== -1 && args[dashIndex + 1]) {
		let customPath = args[dashIndex + 1];

		// Clean up any escape characters that might be added by PowerShell
		customPath = customPath.replace(/\^/g, "");

		// Create the full path to the plugin directory
		const pluginPath = path.resolve(
			customPath,
			".obsidian",
			"plugins",
			"brumes"
		);
		console.log(`🎯 Using custom output directory: ${pluginPath}`);

		// Ensure the directory exists
		try {
			fs.mkdirSync(pluginPath, { recursive: true });
		} catch (error) {
			console.error(`❌ Failed to create directory: ${error.message}`);
		}

		return pluginPath;
	}

	// Fallback to default
	return "demo/.obsidian/plugins/brumes";
};

const outDir = getOutdir();
const prod = process.argv.includes("production");

// Helper to copy manifest.json
function copyManifest() {
	const src = path.resolve("manifest.json");
	const dest = path.resolve(outDir, "manifest.json");
	fs.copyFileSync(src, dest);
	console.log("📄 Copied manifest.json");
}

// Build configurations
const styleConfig = {
	banner: { js: banner, css: banner },
	entryPoints: ["src/styles/styles.scss"],
	bundle: true,
	loader: { ".scss": "css" },
	minify: prod,
	outdir: outDir,
	plugins: [sassPlugin({ type: "css" })],
};

const pluginConfig = {
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
	outdir: outDir,
};

// Run builds
async function build() {
	try {
		console.log(`📁 Output directory: ${outDir}`);

		// Create contexts
		const styleCtx = await esbuild.context(styleConfig);
		const pluginCtx = await esbuild.context(pluginConfig);

		console.log("🔧 Development build starting...");

		// Initial builds
		await styleCtx.rebuild();
		await pluginCtx.rebuild();

		console.log("✅ Initial build completed");
		copyManifest();

		// Watch for changes in development mode
		if (!prod) {
			await styleCtx.watch();
			await pluginCtx.watch();
			console.log("👀 Watching for changes... (Press Ctrl+C to stop)");

			// Keep process alive
			process.on("SIGINT", async () => {
				console.log("\n🛑 Stopping watch mode...");
				await styleCtx.dispose();
				await pluginCtx.dispose();
				process.exit(0);
			});
		} else {
			// Dispose contexts in production mode
			await styleCtx.dispose();
			await pluginCtx.dispose();
			console.log("✨ Production build completed.");
		}
	} catch (error) {
		console.error("❌ Build failed:", error);
		process.exit(1);
	}
}

build();
