import type { Metadata } from "next";

import { createGuestAction } from "@/app/admin/actions";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { GuestTable } from "@/components/admin/GuestTable";
import { Button } from "@/components/ui/Button";
import { getAllGuests } from "@/lib/adminData";
import { getCurrentAdminUser } from "@/lib/adminSession";

export const metadata: Metadata = {
  title: "Admin Guests",
};

export default async function AdminGuestsPage() {
  const user = await getCurrentAdminUser();

  if (!user) {
    return <AdminLogin />;
  }

  const guests = await getAllGuests();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-gold">Guest Management</p>
        <h1 className="mt-2 font-serif text-6xl font-semibold leading-none text-green">
          Invitation Codes
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          Add guests, set allowed seats, choose invitation type, and activate or
          deactivate invitation codes.
        </p>
      </div>

      <section className="mb-8 rounded-[1.5rem] border border-gold/22 bg-white/76 p-6 shadow-xl shadow-gold/10">
        <h2 className="font-serif text-4xl font-semibold text-green">Add Guest</h2>
        <form action={createGuestAction} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminField label="Code">
            <input name="invitationCode" maxLength={4} placeholder="A123" className={adminInput} />
          </AdminField>
          <AdminField label="Guest Name">
            <input name="guestName" placeholder="Mr and Mrs Example" className={adminInput} />
          </AdminField>
          <AdminField label="Email">
            <input name="email" type="email" className={adminInput} />
          </AdminField>
          <AdminField label="Phone">
            <input name="phone" className={adminInput} />
          </AdminField>
          <AdminField label="Allowed Seats">
            <input
              name="allowedGuestCount"
              type="number"
              min={1}
              max={20}
              defaultValue={1}
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Group">
            <input name="groupName" className={adminInput} />
          </AdminField>
          <AdminField label="Invitation Type">
            <select name="invitationType" defaultValue="both" className={adminInput}>
              <option value="both">Both events</option>
              <option value="traditional">Traditional only</option>
              <option value="finale">Grand Finale only</option>
            </select>
          </AdminField>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase text-muted">
            Active
            <span className="flex min-h-12 items-center rounded-xl border border-gold/20 bg-ivory px-3">
              <input name="isActive" type="checkbox" defaultChecked className="size-5 accent-gold" />
            </span>
          </label>
          <div className="md:col-span-2 xl:col-span-4">
            <Button type="submit">Add Guest</Button>
          </div>
        </form>
      </section>

      <GuestTable guests={guests} />
    </main>
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
  "min-h-12 w-full rounded-xl border border-gold/20 bg-ivory px-3 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/15";
