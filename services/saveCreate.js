import path from "path";
import fs from "fs-extra";

export async function saveCreate(CWD){
  const isDevelopment = process.env.NODE_ENV === 'development';
  const storagePath = path.join(CWD, '/.cli-state.json');
  const storage = await fs.readJSON(storagePath);
  await fs.writeJson(storagePath, { ...storage, create: true}, { spaces: 2 });
}