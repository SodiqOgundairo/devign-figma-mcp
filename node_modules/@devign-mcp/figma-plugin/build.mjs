import * as esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const watch = process.argv.includes("--watch");

function generateHtml() {
  const uiJs = readFileSync("dist/ui.js", "utf-8");
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Inter, system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      font-size: 12px;
      color: #333;
      background: #fff;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    /* Header */
    .header {
      padding: 12px 14px;
      border-bottom: 1px solid #e5e5e5;
    }
    .title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .title-row h1 {
      font-size: 13px;
      font-weight: 600;
      margin: 0;
      color: #1a1a1a;
    }
    .badge {
      font-size: 10px;
      font-weight: 500;
      padding: 1px 6px;
      border-radius: 9999px;
      background: #eef2ff;
      color: #4f46e5;
    }
    .status-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
      flex-shrink: 0;
    }
    .dot.connected { background: #22c55e; }
    #status {
      font-weight: 500;
      font-size: 12px;
    }
    .hint {
      font-size: 11px;
      margin-top: 6px;
      line-height: 1.4;
    }
    .hint.ok { color: #16a34a; }
    .hint.warn { color: #b45309; }

    /* Steps */
    .steps {
      padding: 10px 14px;
      border-bottom: 1px solid #e5e5e5;
      background: #fafafa;
    }
    .steps-title {
      font-size: 11px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .step {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 11px;
      color: #555;
      line-height: 1.4;
      margin-bottom: 4px;
    }
    .step-num {
      font-weight: 600;
      color: #4f46e5;
      flex-shrink: 0;
    }
    .step code {
      background: #e5e7eb;
      padding: 0 3px;
      border-radius: 3px;
      font-size: 10px;
      font-family: 'SF Mono', Consolas, monospace;
    }

    /* Counter */
    #counter {
      font-size: 11px;
      color: #888;
      padding: 6px 14px;
      border-bottom: 1px solid #e5e5e5;
    }

    /* Log */
    #log {
      font-size: 10px;
      font-family: 'SF Mono', Consolas, monospace;
      color: #888;
      padding: 8px 14px;
      overflow-y: auto;
      flex: 1;
      line-height: 1.5;
    }
    #log div { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title-row">
      <h1>Devign MCP Bridge</h1>
      <span class="badge">v2.0</span>
    </div>
    <div class="status-row">
      <div class="dot" id="dot"></div>
      <span id="status">Disconnected</span>
    </div>
    <div class="hint warn" id="status-hint">Waiting for MCP server... Make sure it is running.</div>
  </div>

  <div class="steps">
    <div class="steps-title">How to use</div>
    <div class="step"><span class="step-num">1.</span> Run <code>npm start</code> in the devign-mcp folder</div>
    <div class="step"><span class="step-num">2.</span> Keep this plugin open &mdash; it bridges AI to Figma</div>
    <div class="step"><span class="step-num">3.</span> Ask your AI to create, read, or edit designs</div>
  </div>

  <div id="counter">0 commands processed</div>
  <div id="log"></div>

  <script>${uiJs}</script>
</body>
</html>`;
  writeFileSync("dist/ui.html", html);
  console.log("Built dist/ui.html");
}

// esbuild plugin that regenerates ui.html after each UI rebuild
const htmlPlugin = {
  name: "html-generator",
  setup(build) {
    build.onEnd(() => {
      try {
        generateHtml();
      } catch {
        // ui.js not ready yet on first main-thread build
      }
    });
  },
};

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
  plugins: [htmlPlugin],
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
    generateHtml();
  }
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
