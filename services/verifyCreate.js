import path from "path";
import fs from "fs-extra";

export async function verifyCreate(CWD) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statePath = path.join(CWD, (isDevelopment ? '/fake/.cli-state.json' : '/.cli-state.json'));
  if (!await fs.existsSync(statePath)) {
    return false;
  }
  const storage = await fs.readJSON(statePath);
  return storage.create === true;
}