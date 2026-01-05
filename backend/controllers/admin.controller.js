import { supabase } from "../utils/supabase.js";

export const getUsers = async (_, res) => {
  const { data } = await supabase
    .from("users")
    .select("id,email,role");

  res.json(data);
};

export const updateRole = async (req, res) => {
  const { userId, role } = req.body;

  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);

  if (error) return res.status(400).json({ error });

  res.json({ message: "Role updated" });
};

export const getAuditLogs = async (_, res) => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select(`
      id,
      action,
      created_at,
      users ( email ),
      files ( filename )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
};

