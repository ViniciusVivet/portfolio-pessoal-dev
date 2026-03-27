"use strict";
const fs = require("fs");
const path = require("path");

const PARTIALS_DIR = path.join(__dirname, "src", "partials");
const OUTPUT_FILE = path.join(__dirname, "index.html");

const ORDER = [
  "_head.html",
  "_navbar.html",
  "_home.html",
  "_about.html",
  "_experience.html",
  "_projects.html",
  "_skills.html",
  "_education.html",
  "_services.html",
  "_contact.html",
  "_footer.html",
];

const WARNING = "<!-- ARQUIVO GERADO AUTOMATICAMENTE — edite os arquivos em src/partials/, depois rode: node build.js -->\n";

const html = ORDER.map((file) => {
  const filePath = path.join(PARTIALS_DIR, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Partial não encontrado: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8").trimEnd();
});

fs.writeFileSync(OUTPUT_FILE, WARNING + html.join("\n") + "\n", "utf8");
console.log(`✅  index.html gerado (${ORDER.length} partials)`);
