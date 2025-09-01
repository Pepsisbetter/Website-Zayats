import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
// +++ Импортируем пакет для работы с PostgreSQL +++
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаем пул подключений к БД
// Он автоматически возьмет строку подключения из переменной окружения DATABASE_URL, которую мы добавили в Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Это часто необходимо для внешних БД, включая Render
  }
});

// Создаем таблицу для хранения информации о файлах (это нужно сделать один раз)
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        original_name TEXT NOT NULL,
        stored_name TEXT NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Таблица documents готова');
  } catch (err) {
    console.error('❌ Ошибка создания таблицы:', err);
  } finally {
    client.release();
  }
}
// Вызываем функцию инициализации при старте сервера
initDatabase();

// ... остальной код (создание папки uploads, настройка express и multer) остается без изменений ...

// Загрузка документов ТЕПЕРЬ С СОХРАНЕНИЕМ В БД
app.post("/api/documents", upload.single("file"), async (req, res) => {
  // Получаем данные о файле из multer
  const { originalname, filename } = req.file;

  try {
    // Сохраняем информацию о файле в базу данных
    const result = await pool.query(
      'INSERT INTO documents (original_name, stored_name) VALUES ($1, $2) RETURNING *',
      [originalname, filename]
    );

    // Отправляем успешный ответ, включая ID из базы данных
    res.json({
      success: true,
      document: result.rows[0], // Возвращаем всю запись из БД
      url: `/uploads/${filename}`
    });
  } catch (err) {
    console.error('Ошибка сохранения в БД:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Новый API-эндпоинт для получения списка всех документов
app.get("/api/documents", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents ORDER BY upload_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка загрузки из БД:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ... остальной код (статические routes, app.listen) остается без изменений ...
