import path from "path";
import fs from "fs-extra";

export async function saveCreate(CWD){
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statePath = path.join(CWD, (isDevelopment ? '/fake/.cli-state.json' : '/.cli-state.json'));
  const storagePath = path.join(statePath);
  await fs.outputFile(storagePath, JSON.stringify({ create: true }));
}