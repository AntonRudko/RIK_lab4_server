const path = require('path');
const fs = require('fs/promises');

const FILES_DIR = path.join(__dirname, '..', 'files');
const META_PATH = path.join(FILES_DIR, 'meta.json');

async function ensureFilesDir() {
  await fs.mkdir(FILES_DIR, { recursive: true });
}

async function readMeta() {
  try {
    const data = await fs.readFile(META_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeMeta(meta) {
  await ensureFilesDir();
  await fs.writeFile(META_PATH, JSON.stringify(meta, null, 2), 'utf-8');
}

async function listFiles() {
  await ensureFilesDir();
  const entries = await fs.readdir(FILES_DIR);
  const meta = await readMeta();
  const files = [];
  for (const entry of entries) {
    if (entry === 'meta.json') continue;
    const filePath = path.join(FILES_DIR, entry);
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      files.push({
        name: entry,
        size: stat.size,
        updatedAt: stat.mtime,
        fontSize: meta[entry]?.fontSize || 16,
      });
    }
  }
  return files;
}

async function readFile(name) {
  const filePath = path.join(FILES_DIR, name);
  const content = await fs.readFile(filePath, 'utf-8');
  const stat = await fs.stat(filePath);
  const meta = await readMeta();
  return { name, content, updatedAt: stat.mtime, fontSize: meta[name]?.fontSize || 16 };
}

async function writeFile(name, content, fontSize) {
  await ensureFilesDir();
  const filePath = path.join(FILES_DIR, name);
  await fs.writeFile(filePath, content, 'utf-8');
  const stat = await fs.stat(filePath);
  if (fontSize !== undefined) {
    const meta = await readMeta();
    meta[name] = { ...meta[name], fontSize };
    await writeMeta(meta);
  }
  const meta = await readMeta();
  return { name, content, updatedAt: stat.mtime, fontSize: meta[name]?.fontSize || 16 };
}

async function deleteFile(name) {
  const filePath = path.join(FILES_DIR, name);
  await fs.unlink(filePath);
  const meta = await readMeta();
  delete meta[name];
  await writeMeta(meta);
}

async function fileExists(name) {
  try {
    await fs.access(path.join(FILES_DIR, name));
    return true;
  } catch {
    return false;
  }
}

module.exports = { listFiles, readFile, writeFile, deleteFile, fileExists };
