import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаем папку uploads если ее нет
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Отдаём фронтенд из папки public
app.use(express.static(path.join(__dirname, "public")));

// Настройка для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Тестовый API
app.get("/api/hello", (req, res) => {
  res.json({ message: "API работает ✅" });
});

// Загрузка документов
app.post("/api/documents", upload.single("file"), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// Главная страница
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
