const path = require('path');
const fs = require('fs/promises');

const FILES_DIR = path.join(__dirname, '..', 'files');

async function ensureFilesDir() {
  await fs.mkdir(FILES_DIR, { recursive: true });
}

async function listFiles() {
  await ensureFilesDir();
  const entries = await fs.readdir(FILES_DIR);
  const files = [];
  for (const entry of entries) {
    const filePath = path.join(FILES_DIR, entry);
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      files.push({
        name: entry,
        size: stat.size,
        updatedAt: stat.mtime,
      });
    }
  }
  return files;
}

async function readFile(name) {
  const filePath = path.join(FILES_DIR, name);
  const content = await fs.readFile(filePath, 'utf-8');
  const stat = await fs.stat(filePath);
  return { name, content, updatedAt: stat.mtime };
}

async function writeFile(name, content) {
  await ensureFilesDir();
  const filePath = path.join(FILES_DIR, name);
  await fs.writeFile(filePath, content, 'utf-8');
  const stat = await fs.stat(filePath);
  return { name, content, updatedAt: stat.mtime };
}

async function deleteFile(name) {
  const filePath = path.join(FILES_DIR, name);
  await fs.unlink(filePath);
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
