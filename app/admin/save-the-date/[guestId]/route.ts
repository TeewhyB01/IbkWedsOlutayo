import { handleSaveTheDateDownload } from "@/lib/saveTheDateDownload";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ guestId: string }> },
) {
  const { guestId } = await params;
  return handleSaveTheDateDownload(guestId);
}
