import { NextResponse } from "next/server";

import {
  getGuestByIdForAdmin,
  markSaveTheDateDownloaded,
} from "@/lib/adminData";
import { createSaveTheDatePdf } from "@/lib/saveTheDatePdf";
import { getCurrentAdminUser } from "@/lib/adminSession";

export async function handleSaveTheDateDownload(guestId: string) {
  const user = await getCurrentAdminUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const guest = await getGuestByIdForAdmin(guestId);

  if (!guest) {
    return NextResponse.json({ message: "Guest not found." }, { status: 404 });
  }

  if (guest.save_the_date_downloaded_at) {
    return NextResponse.json(
      { message: "This save-the-date has already been downloaded." },
      { status: 409 },
    );
  }

  const pdfBytes = await createSaveTheDatePdf(guest);
  const updatedGuest = await markSaveTheDateDownloaded(guest.id);

  if (!updatedGuest) {
    return NextResponse.json(
      { message: "This save-the-date has already been downloaded." },
      { status: 409 },
    );
  }

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="save-the-date-${guest.invitation_code}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
