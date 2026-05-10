const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

if (!fs.existsSync("./public/uploads")) {
    fs.mkdirSync("./public/uploads", { recursive: true });
}

const db = new sqlite3.Database("./gallery.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            album_id INTEGER,
            filename TEXT,
            FOREIGN KEY(album_id) REFERENCES albums(id)
        )
    `);
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Create Album
app.post("/albums", (req, res) => {
    const { name } = req.body;

    db.run(
        "INSERT INTO albums (name) VALUES (?)",
        [name],
        function(err) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                id: this.lastID,
                name
            });
        }
    );
});

// Get Albums
app.get("/albums", (req, res) => {
    db.all("SELECT * FROM albums", [], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(rows);
    });
});

// Upload Photo
app.post("/upload/:albumId", upload.single("photo"), (req, res) => {
    const albumId = req.params.albumId;
    const filename = req.file.filename;

    db.run(
        "INSERT INTO photos (album_id, filename) VALUES (?, ?)",
        [albumId, filename],
        function(err) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                filename
            });
        }
    );
});

// Get Photos
app.get("/photos/:albumId", (req, res) => {
    const albumId = req.params.albumId;

    db.all(
        "SELECT * FROM photos WHERE album_id = ?",
        [albumId],
        (err, rows) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
