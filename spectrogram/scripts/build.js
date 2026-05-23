const browserify = require("browserify");
const fs = require("fs");
const path = require("path");
const pug = require("pug");
const sass = require("sass");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");
const build = path.join(root, "build");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

function writeFile(file, contents) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, contents);
}

async function bundleApp() {
  ensureDir(path.join(build, "js"));

  const bundled = await new Promise((resolve, reject) => {
    browserify(path.join(src, "javascripts/main.js"), {
      debug: false,
      insertGlobals: true,
    }).bundle((error, buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(buffer);
      }
    });
  });

  writeFile(path.join(build, "js/app.js"), bundled);
}

function bundleLibs() {
  const libDir = path.join(src, "javascripts/o3djs");
  const files = ["base.js", "math.js", "quaternions.js", "shader.js"];
  const contents = files
    .map((file) => fs.readFileSync(path.join(libDir, file), "utf8"))
    .join("\n");

  writeFile(path.join(build, "js/bundle.js"), contents);
}

async function main() {
  fs.rmSync(build, { recursive: true, force: true });
  ensureDir(build);

  const html = pug.renderFile(path.join(src, "jade/index.jade"), {
    pretty: true,
  });
  writeFile(path.join(build, "index.html"), html);

  const css = sass.compile(path.join(src, "sass/screen.scss"), {
    loadPaths: [path.join(src, "sass")],
    style: "compressed",
  });
  writeFile(path.join(build, "css/screen.css"), css.css);

  copyDir(path.join(src, "bin"), path.join(build, "bin"));
  copyDir(path.join(src, "images"), path.join(build, "img"));
  copyDir(path.join(src, "icons"), path.join(build, "img/icons"));

  await bundleApp();
  bundleLibs();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
