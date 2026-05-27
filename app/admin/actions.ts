"use server";

import {
  bulkSendPendingInvitationCodes,
  createGuestFromForm,
  deleteGuestById,
  updateGuestFromForm,
} from "@/lib/adminData";
import { getCurrentAdminUser } from "@/lib/adminSession";

async function requireAdmin() {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new Error("Admin authentication is required.");
  }

  return user;
}

export async function createGuestAction(formData: FormData) {
  await requireAdmin();
  await createGuestFromForm(formData);
}

export async function updateGuestAction(formData: FormData) {
  await requireAdmin();
  await updateGuestFromForm(formData);
}

export async function deleteGuestAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  await deleteGuestById(id);
}

export async function bulkSendInvitationCodesAction() {
  await requireAdmin();
  await bulkSendPendingInvitationCodes();
}
