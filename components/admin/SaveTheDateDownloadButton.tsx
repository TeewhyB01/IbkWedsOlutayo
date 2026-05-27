"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Download, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function SaveTheDateDownloadButton({
  guestId,
  code,
  alreadyDownloaded,
}: {
  guestId: string;
  code: string;
  alreadyDownloaded: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(alreadyDownloaded);
  const [message, setMessage] = useState<string | null>(null);

  async function downloadSaveTheDate() {
    setLoading(true);
    setMessage(null);

    const response = await fetch(`/admin/save-the-date/${guestId}`, {
      credentials: "same-origin",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setMessage(data?.message ?? "This save-the-date could not be downloaded.");
      setLoading(false);
      setDownloaded(response.status === 409);
      router.refresh();
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `save-the-date-${code}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setLoading(false);
    router.refresh();
  }

  if (downloaded) {
    return (
      <div className="space-y-2">
        <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-gold/24 bg-cream px-4 text-xs font-semibold text-muted">
          <LockKeyhole size={14} /> Already shared
        </span>
        {message ? <p className="text-xs font-semibold text-burgundy">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={downloadSaveTheDate}
        disabled={loading}
        className="min-h-10 px-4 text-xs"
      >
        <Download size={14} /> {loading ? "Preparing..." : "Download PDF"}
      </Button>
      {message ? <p className="text-xs font-semibold text-burgundy">{message}</p> : null}
    </div>
  );
}
