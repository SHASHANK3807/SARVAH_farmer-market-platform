import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const files = ["lots.runtime.json", "offers.runtime.json", "transactions.runtime.json", "demand-posts.runtime.json"];
files.forEach(f => fs.writeFileSync(path.join(DATA_DIR, f), "[]"));
console.log("✅ Demo data reset to seed state");
