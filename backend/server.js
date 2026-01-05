import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import { supabase } from "./utils/supabase.js";
import { authMiddleware } from "./middleware/auth.js";
import multer from "multer";
import fs from "fs";



const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated ✅",
    user: req.user.email,
  });
});


// ✅ TEST SUPABASE CONNECTION
app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    message: "Supabase connected successfully ✅",
    data,
  });
});

// ✅ FILE UPLOAD TO SUPABASE STORAGE
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const fileBuffer = fs.readFileSync(file.path);

    const { data, error } = await supabase.storage
      .from("files")
      .upload(file.originalname, fileBuffer, {
        contentType: file.mimetype,
      });

    fs.unlinkSync(file.path); // delete temp file

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "File uploaded successfully ✅",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//getting files from supabase storage
app.get("/files", async (req, res) => {
  try {
    const { data, error } = await supabase.storage
      .from("files")
      .list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//generate download link for a file
app.get("/download/:filename", async (req, res) => {
  const { filename } = req.params;

  const { data, error } = await supabase.storage
    .from("files")
    .createSignedUrl(filename, 60); // valid for 60 seconds

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({
    downloadUrl: data.signedUrl,
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port  ${PORT}`);
});
