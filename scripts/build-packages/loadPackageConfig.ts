import { pathToFileURL } from 'node:url';
import fs from 'fs-extra';

export async function loadPackageConfig(configPath: string) {
  if (!fs.existsSync(configPath)) return {};
  const cfgModule = await import(pathToFileURL(configPath).href);
  return cfgModule.default ?? cfgModule;
}
