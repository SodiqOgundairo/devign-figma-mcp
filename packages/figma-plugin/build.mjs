import * as esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const watch = process.argv.includes("--watch");

// Build main thread (plugin sandbox)
const mainConfig = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "dist/main.js",
  format: "iife",
  target: "es2015",
  logLevel: "info",
};

// Build UI thread and inline into HTML
const uiConfig = {
  entryPoints: ["src/ui.ts"],
  bundle: true,
  outfile: "dist/ui.js",
  format: "iife",
  target: "es2015",
  logLevel: "info",
};

async function build() {
  mkdirSync("dist", { recursive: true });

  if (watch) {
    const mainCtx = await esbuild.context(mainConfig);
    const uiCtx = await esbuild.context(uiConfig);
    await mainCtx.watch();
    await uiCtx.watch();
    console.log("Watching for changes...");
  } else {
    await esbuild.build(mainConfig);
    await esbuild.build(uiConfig);
  }

  // Create ui.html with inlined JS
  const uiJs = readFileSync("dist/ui.js", "utf-8");
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Inter, system-ui, sans-serif;
      margin: 0;
      padding: 12px;
      font-size: 12px;
      color: #333;
      background: #fff;
    }
    .status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e53e3e;
    }
    .dot.connected {
      background: #38a169;
    }
    #log {
      font-size: 11px;
      color: #666;
      max-height: 120px;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  <div class="status">
    <div class="dot" id="dot"></div>
    <span id="status">Disconnected</span>
  </div>
  <div id="log"></div>
  <script>${uiJs}</script>
</body>
</html>`;
  writeFileSync("dist/ui.html", html);
  console.log("Built dist/ui.html");
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
