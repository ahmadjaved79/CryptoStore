import { supabase } from "../utils/supabase.js";
import { encryptBuffer,decryptBuffer } from "../utils/encryption.js";



export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // 1️⃣ Encrypt file
    const encryptedBuffer = encryptBuffer(file.buffer);

    // 2️⃣ Storage path
    const storagePath = `${Date.now()}-${file.originalname}.enc`;

    // 3️⃣ Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(storagePath, encryptedBuffer);

    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }

    // 4️⃣ INSERT INTO files TABLE AND CAPTURE RESULT ✅
    const { data: fileRecord, error: dbError } = await supabase
      .from("files")
      .insert([
        {
          filename: file.originalname,
          storage_path: storagePath,
          uploaded_by: user.id,
          size: file.size,
          mime_type: file.mimetype,
        },
      ])
      .select()
      .single();

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    // 5️⃣ AUDIT LOG — UPLOAD
    await supabase.from("audit_logs").insert([
      {
        user_id: user.id,
        file_id: fileRecord.id,
        action: "UPLOAD",
      },
    ]);

    res.json({
      message: "File uploaded securely, metadata stored, audit logged",
      file: fileRecord,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const listFiles = async (req, res) => {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
};
  

export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;




    // 1️⃣ Get file metadata from DB
    const { data: file, error: dbError } = await supabase
      .from("files")
      .select("*")
      .eq("id", id)
      .single();

    if (dbError || !file) {
      return res.status(404).json({ error: "File not found" });
    }

    // 2️⃣ Download encrypted file from storage
    const { data: encryptedData, error: storageError } =
      await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .download(file.storage_path);

    if (storageError) {
      return res.status(400).json({ error: storageError.message });
    }

    // 3️⃣ Convert to Buffer
    const encryptedBuffer = Buffer.from(
      await encryptedData.arrayBuffer()
    );

    // 4️⃣ Decrypt
    const decryptedBuffer = decryptBuffer(encryptedBuffer);
        // AUDIT LOG — DOWNLOAD
await supabase.from("audit_logs").insert([
  {
    user_id: req.user.id,
    file_id: file.id,
    action: "DOWNLOAD",
  },
]);
    // 5️⃣ Send original file back to user
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );
    res.setHeader("Content-Type", file.mime_type);

    res.send(decryptedBuffer);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  };