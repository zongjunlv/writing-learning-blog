import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const shouldPush = process.argv.includes("--push") || process.env.PUBLISH_PUSH === "1";

function run(command: string, args: string[]): string {
  return execFileSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function runVisible(command: string, args: string[]): void {
  execFileSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
  });
}

runVisible("npm", ["run", "generate:daily"]);
runVisible("npm", ["run", "validate:posts"]);
runVisible("npm", ["run", "build"]);

runVisible("git", ["add", "src/content/posts"]);

const status = run("git", ["status", "--short", "src/content/posts"]);
if (!status) {
  console.log("No daily post changes to publish.");
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
runVisible("git", ["commit", "-m", `post: publish daily learning note ${today}`]);

if (shouldPush) {
  runVisible("git", ["push"]);
  console.log("Daily learning post pushed. Vercel will deploy from GitHub.");
} else {
  console.log("Daily learning post committed locally. Run with --push to publish through GitHub/Vercel.");
}
