import { Save, Trash2 } from "lucide-react";

import { deleteGuestAction, updateGuestAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import type { GuestRecord } from "@/types";

export function GuestTable({ guests }: { guests: GuestRecord[] }) {
  return (
    <div className="space-y-4">
      {guests.map((guest) => (
        <article
          key={guest.id}
          className="rounded-[1.5rem] border border-gold/22 bg-white/76 p-4 shadow-xl shadow-gold/10"
        >
          <form
            action={updateGuestAction}
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-[100px_1.1fr_1.1fr_0.9fr_80px_0.9fr_130px_110px_80px_100px]"
          >
            <input type="hidden" name="id" value={guest.id} />
            <AdminField label="Code">
              <input
                name="invitationCode"
                defaultValue={guest.invitation_code}
                maxLength={4}
                className={adminInput}
              />
            </AdminField>
            <AdminField label="Guest">
              <input name="guestName" defaultValue={guest.guest_name} className={adminInput} />
            </AdminField>
            <AdminField label="Email">
              <input name="email" defaultValue={guest.email ?? ""} className={adminInput} />
            </AdminField>
            <AdminField label="Phone">
              <input name="phone" defaultValue={guest.phone ?? ""} className={adminInput} />
            </AdminField>
            <AdminField label="Seats">
              <input
                name="allowedGuestCount"
                type="number"
                min={1}
                max={20}
                defaultValue={guest.allowed_guest_count}
                className={adminInput}
              />
            </AdminField>
            <AdminField label="Group">
              <input name="groupName" defaultValue={guest.group_name ?? ""} className={adminInput} />
            </AdminField>
            <AdminField label="Invitation">
              <select name="invitationType" defaultValue={guest.invitation_type} className={adminInput}>
                <option value="both">Both events</option>
                <option value="traditional">Traditional only</option>
                <option value="finale">Grand Finale only</option>
              </select>
            </AdminField>
            <AdminField label="Code Status">
              <span className="flex min-h-10 items-center rounded-xl border border-gold/20 bg-ivory px-3 text-sm capitalize text-green">
                {guest.invitation_send_status}
              </span>
            </AdminField>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase text-muted">
              Active
              <span className="flex min-h-10 items-center rounded-xl border border-gold/20 bg-ivory px-3">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={guest.is_active}
                  className="size-5 accent-gold"
                />
              </span>
            </label>
            <div className="flex items-end">
              <Button type="submit" className="min-h-10 w-full px-4 text-xs">
                <Save size={15} /> Save
              </Button>
            </div>
          </form>
          <form action={deleteGuestAction} className="mt-3 flex justify-end">
            <input type="hidden" name="id" value={guest.id} />
            <Button type="submit" variant="secondary" className="min-h-10 px-4 text-xs">
              <Trash2 size={15} /> Delete Guest
            </Button>
          </form>
        </article>
      ))}
    </div>
  );
}

function AdminField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase text-muted">
      {label}
      {children}
    </label>
  );
}

const adminInput =
  "min-h-10 w-full rounded-xl border border-gold/20 bg-ivory px-3 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/15";
