export type Role = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  role: Role;
}
