import { NextResponse, type NextRequest } from "next/server";

import { getAllRsvps } from "@/lib/adminData";
import { getCurrentAdminUser } from "@/lib/adminSession";
import { toCsv } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const user = await getCurrentAdminUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const event = request.nextUrl.searchParams.get("event");
  const rsvps = await getAllRsvps();
  const filtered = rsvps.filter((rsvp) => {
    if (event === "traditional") return rsvp.attending_traditional;
    if (event === "finale") return rsvp.attending_finale;
    if (event === "not-attending") {
      return !rsvp.attending_traditional && !rsvp.attending_finale;
    }

    return true;
  });

  const rows = filtered.map((rsvp) => ({
    invitation_code: rsvp.guests?.invitation_code,
    invited_guest: rsvp.guests?.guest_name,
    full_name: rsvp.full_name,
    email: rsvp.email,
    phone: rsvp.phone,
    category: formatRsvpCategory(rsvp),
    attending_traditional: rsvp.attending_traditional,
    attending_finale: rsvp.attending_finale,
    guest_count: rsvp.guest_count,
    meal_preference: rsvp.meal_preference,
    allergies: rsvp.allergies,
    song_request: rsvp.song_request,
    message_to_couple: rsvp.message_to_couple,
    submitted_at: rsvp.submitted_at,
  }));

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wedding-rsvps${event ? `-${event}` : ""}.csv"`,
    },
  });
}

function formatRsvpCategory(rsvp: Awaited<ReturnType<typeof getAllRsvps>>[number]) {
  if (!rsvp.guest_category) {
    return "";
  }

  if (rsvp.guest_category === "Others" && rsvp.guest_category_other) {
    return `Others - ${rsvp.guest_category_other}`;
  }

  return rsvp.guest_category;
}
