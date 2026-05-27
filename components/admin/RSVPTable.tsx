import type { RSVPRecord } from "@/types";

export function RSVPTable({ rsvps }: { rsvps: RSVPRecord[] }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-gold/22 bg-white/76 shadow-xl shadow-gold/10">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-green text-ivory">
            <tr>
              <th className="px-4 py-4">Guest</th>
              <th className="px-4 py-4">Code</th>
              <th className="px-4 py-4">Contact</th>
              <th className="px-4 py-4">Traditional</th>
              <th className="px-4 py-4">Finale</th>
              <th className="px-4 py-4">Count</th>
              <th className="px-4 py-4">Meal</th>
              <th className="px-4 py-4">Song</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/14">
            {rsvps.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted">
                  No RSVP responses match this filter yet.
                </td>
              </tr>
            ) : (
              rsvps.map((rsvp) => (
                <tr key={rsvp.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-green">{rsvp.full_name}</p>
                    <p className="text-xs text-muted">{rsvp.guests?.guest_name}</p>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-muted">
                    {rsvp.guests?.invitation_code ?? "N/A"}
                  </td>
                  <td className="px-4 py-4 text-muted">
                    <p>{rsvp.email ?? "No email"}</p>
                    <p>{rsvp.phone ?? "No phone"}</p>
                  </td>
                  <td className="px-4 py-4">{rsvp.attending_traditional ? "Yes" : "No"}</td>
                  <td className="px-4 py-4">{rsvp.attending_finale ? "Yes" : "No"}</td>
                  <td className="px-4 py-4">{rsvp.guest_count}</td>
                  <td className="px-4 py-4">{rsvp.meal_preference ?? "No preference"}</td>
                  <td className="px-4 py-4 text-muted">{rsvp.song_request ?? ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
