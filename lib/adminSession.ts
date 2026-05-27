import { getPasswordAdminUser } from "@/lib/adminAuth";

export async function getCurrentAdminUser() {
  return getPasswordAdminUser();
}
