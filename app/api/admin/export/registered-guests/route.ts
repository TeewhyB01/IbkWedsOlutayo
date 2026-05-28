import { NextResponse } from "next/server";

import { getAllRsvps } from "@/lib/adminData";
import { getCurrentAdminUser } from "@/lib/adminSession";
import { toExcelXml } from "@/lib/utils";

function eventAttendance(value: boolean) {
  return value ? "Yes" : "No";
}

export async function GET() {
  const user = await getCurrentAdminUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rsvps = await getAllRsvps();
  const rows = rsvps.map((rsvp) => ({
    "Submitted At": rsvp.submitted_at,
    "Invitation Code": rsvp.guests?.invitation_code ?? "",
    "Invited Guest": rsvp.guests?.guest_name ?? "",
    "Registered Name": rsvp.full_name,
    Email: rsvp.email ?? "",
    Phone: rsvp.phone ?? "",
    "Guest Count": rsvp.guest_count,
    "Attending Traditional Wedding": eventAttendance(rsvp.attending_traditional),
    "Attending Grand Finale": eventAttendance(rsvp.attending_finale),
    "Meal Preference": rsvp.meal_preference ?? "",
    "Allergies / Dietary Requirements": rsvp.allergies ?? "",
    "Song Request": rsvp.song_request ?? "",
    "Message To Couple": rsvp.message_to_couple ?? "",
    "Allowed Seats": rsvp.guests?.allowed_guest_count ?? "",
    "Invitation Type": rsvp.guests?.invitation_type ?? "",
  }));
  const workbook = toExcelXml({
    rows,
    worksheetName: "Registered Guests",
  });
  const dateStamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(workbook, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="registered-guests-${dateStamp}.xls"`,
      "Cache-Control": "no-store",
    },
  });
}
