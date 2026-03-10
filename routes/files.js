const express = require('express');
const { listFiles, readFile, writeFile, deleteFile, fileExists } = require('../models/File');

const router = express.Router();

// GET /api/files — список файлів
router.get('/', async (req, res) => {
  try {
    const files = await listFiles();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/files/:name — прочитати файл
router.get('/:name', async (req, res) => {
  try {
    const exists = await fileExists(req.params.name);
    if (!exists) {
      return res.status(404).json({ error: 'Файл не знайдено' });
    }
    const file = await readFile(req.params.name);
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/files — створити файл
router.post('/', async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Потрібно вказати name' });
    }
    const exists = await fileExists(name);
    if (exists) {
      return res.status(409).json({ error: 'Файл з такою назвою вже існує' });
    }
    const file = await writeFile(name, content || '', req.body.fontSize);
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/files/:name — оновити файл
router.put('/:name', async (req, res) => {
  try {
    const exists = await fileExists(req.params.name);
    if (!exists) {
      return res.status(404).json({ error: 'Файл не знайдено' });
    }
    const { content, fontSize } = req.body;
    const file = await writeFile(req.params.name, content || '', fontSize);
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/files/:name — видалити файл
router.delete('/:name', async (req, res) => {
  try {
    const exists = await fileExists(req.params.name);
    if (!exists) {
      return res.status(404).json({ error: 'Файл не знайдено' });
    }
    await deleteFile(req.params.name);
    res.json({ message: 'Файл видалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
