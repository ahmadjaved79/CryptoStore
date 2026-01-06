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
    const fileId = req.params.id;
    const userId = req.user.id; // comes from auth middleware

    // 1️⃣ CHECK OWNERSHIP
    const { data: owned } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .eq("uploaded_by", userId)
      .single();

    // 2️⃣ IF NOT OWNER → CHECK SHARED ACCESS
    if (!owned) {
      const { data: shared } = await supabase
        .from("file_shares")
        .select("*")
        .eq("file_id", fileId)
        .eq("shared_with", userId)
        .single();

      if (!shared) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    // 3️⃣ FETCH FILE METADATA
    const { data: file } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .single();

    // 4️⃣ DOWNLOAD FROM BUCKET
   const { data: encryptedBlob } = await supabase.storage
  .from(process.env.SUPABASE_BUCKET)
  .download(file.storage_path);

// 🔥 Convert Blob → Buffer
const arrayBuffer = await encryptedBlob.arrayBuffer();
const encryptedBuffer = Buffer.from(arrayBuffer);

// ✅ Now decrypt
const decrypted = decryptBuffer(encryptedBuffer);


 

    // 6️⃣ SEND FILE
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );
    res.send(decrypted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
};


  export const shareFile = async (req, res) => {
  const { fileId, userId } = req.body;
  const sharedBy = userId; // from auth middleware

  // 1️⃣ INSERT INTO file_shares TABLE
  const { error } = await supabase
    .from("file_shares")
    .insert({
      file_id: fileId,
      shared_with: userId,
    });

  

  if (error) return res.status(400).json({ error });
    // 2️⃣ AUDIT LOG — SHARE
  await supabase.from("audit_logs").insert({
    user_id: sharedBy,
    file_id: fileId,
    action: "SHARE",
  });
  res.json({ message: "File shared successfully" });

};


export const getSharedFiles = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("file_shares")
    .select("files(*)")
    .eq("shared_with", userId);

  if (error) return res.status(400).json({ error });

  const files = data.map((row) => row.files);

  res.json({ data: files });
};
