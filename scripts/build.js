const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

require("dotenv").config();

const root = path.join(__dirname, "..");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Set SUPABASE_URL and SUPABASE_ANON_KEY before building the site."
  );
}

if (!/^https:\/\/.+/.test(supabaseUrl)) {
  throw new Error("SUPABASE_URL must be an HTTPS URL.");
}

const assetsDir = path.join(root, "public", "assets");
fs.mkdirSync(assetsDir, { recursive: true });
fs.writeFileSync(
  path.join(root, "public", "supabase-config.js"),
  `window.SUPABASE_CONFIG = ${JSON.stringify({
    url: supabaseUrl,
    anonKey: supabaseAnonKey
  })};\n`
);

esbuild.buildSync({
  entryPoints: [path.join(root, "public", "js", "app.js")],
  bundle: true,
  platform: "browser",
  format: "iife",
  target: ["es2020"],
  outfile: path.join(assetsDir, "app.js")
});
